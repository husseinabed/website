export type WhatsAppWsHello = {
  type: 'whatsapp:ws:open'
  at: string
  connectedPeers: number
}

export type WhatsAppIncomingEvent = {
  type: 'whatsapp:incoming'
  receivedAt: string
  messageSid: string
  from: string
  to: string
  body: string
  numMedia?: string
  params?: Record<string, string>
}

export type WhatsAppIncomingWsMessage = WhatsAppWsHello | WhatsAppIncomingEvent | { type: string; [k: string]: any }

export type UseWhatsAppIncomingWsOptions = {
  /**
   * Auto-connect on mount (client only).
   * @default true
   */
  autoConnect?: boolean

  /**
   * Override WS URL (absolute).
   * Default uses current origin + `/api/whatsapp/incoming`.
   */
  url?: string

  /**
   * Keep only last N incoming messages in memory.
   * @default 50
   */
  maxMessages?: number
}

export type WhatsAppIncomingWsStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'

function defaultWsUrl() {
  const { protocol, host } = window.location
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'
  // Note: Nuxt maps `server/api/whatsapp/incoming.ws.ts` to `/api/whatsapp/incoming.ws`
  return `${wsProtocol}//${host}/api/whatsapp/incoming.ws`
}

/**
 * Frontend WebSocket client for the Nitro WS endpoint:
 * - server route: `/api/whatsapp/incoming` (see `server/api/whatsapp/incoming.ws.ts`)
 * - events: `whatsapp:ws:open`, `whatsapp:incoming`
 */
export function useWhatsAppIncomingWs(options: UseWhatsAppIncomingWsOptions = {}) {
  const status = ref<WhatsAppIncomingWsStatus>('idle')
  const lastMessage = shallowRef<WhatsAppIncomingWsMessage | null>(null)
  const incoming = ref<WhatsAppIncomingEvent[]>([])
  const error = shallowRef<unknown>(null)

  let ws: WebSocket | null = null
  let connectAttempt = 0

  const DEBUG = import.meta.dev
  const log = (message: string, data?: Record<string, unknown>) => {
    if (!DEBUG) return
    // eslint-disable-next-line no-console
    console.debug('[wa-incoming-ws]', message, data ?? {})
  }

  const maxMessages = computed(() => options.maxMessages ?? 50)

  function pushIncoming(evt: WhatsAppIncomingEvent) {
    incoming.value = [evt, ...incoming.value].slice(0, maxMessages.value)
  }

  function connect() {
    if (!import.meta.client) return
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return

    error.value = null
    status.value = 'connecting'

    const url = options.url ?? defaultWsUrl()
    connectAttempt += 1
    log('connect()', { attempt: connectAttempt, url })

    ws = new WebSocket(url)

    ws.onopen = () => {
      status.value = 'open'
      log('onopen', { attempt: connectAttempt, url })
    }

    ws.onmessage = (ev) => {
      const raw = typeof ev.data === 'string' ? ev.data : ''
      let msg: WhatsAppIncomingWsMessage = { type: 'unknown', raw }

      try {
        msg = JSON.parse(raw) as WhatsAppIncomingWsMessage
      } catch {
        log('onmessage: non-JSON payload', { sample: raw.slice(0, 200) })
        // ignore non-JSON payloads
      }

      lastMessage.value = msg

      if (msg?.type === 'whatsapp:incoming') {
        pushIncoming(msg as WhatsAppIncomingEvent)
      }
    }

    ws.onerror = (e) => {
      status.value = 'error'
      error.value = e
      log('onerror', { attempt: connectAttempt, url })
    }

    ws.onclose = (ev) => {
      status.value = 'closed'
      log('onclose', {
        attempt: connectAttempt,
        url,
        code: ev.code,
        reason: ev.reason,
        wasClean: ev.wasClean
      })
    }
  }

  function disconnect(code?: number, reason?: string) {
    if (!ws) return
    log('disconnect()', { code, reason, readyState: ws.readyState })
    try {
      ws.close(code, reason)
    } finally {
      ws = null
    }
  }

  function sendPing() {
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    ws.send('ping')
  }

  onMounted(() => {
    if (options.autoConnect ?? true) connect()
  })

  onBeforeUnmount(() => {
    disconnect(1000, 'component unmounted')
  })

  return {
    status,
    lastMessage,
    incoming,
    error,
    connect,
    disconnect,
    sendPing
  }
}