import { defineWebSocketHandler } from 'h3'

import {
  getWhatsAppIncomingPeerCount,
  registerWhatsAppIncomingPeer,
  unregisterWhatsAppIncomingPeer
} from '../../utils/whatsappIncomingWs'

type WsHello = {
  type: 'whatsapp:ws:open'
  at: string
  connectedPeers: number
}

const DEBUG = process.env.NODE_ENV !== 'production'
function wsLog(message: string, data?: Record<string, unknown>) {
  if (!DEBUG) return
  // eslint-disable-next-line no-console
  console.debug('[wa-incoming-ws][server]', message, data ?? {})
}

export default defineWebSocketHandler({
  open(peer) {
    registerWhatsAppIncomingPeer(peer)

    const connectedPeers = getWhatsAppIncomingPeerCount()
    wsLog('open', {
      connectedPeers,
      peerKeys: Object.keys(peer as any)
    })

    const hello: WsHello = {
      type: 'whatsapp:ws:open',
      at: new Date().toISOString(),
      connectedPeers
    }

    // Always send strings over the wire; frontend can JSON.parse(...)
    peer.send(JSON.stringify(hello))
  },

  message(peer, message) {
    // Optional: simple keepalive
    try {
      const text = message.text()
      wsLog('message', { text, connectedPeers: getWhatsAppIncomingPeerCount() })
      if (text === 'ping') peer.send('pong')
    } catch {
      wsLog('message: non-text', { connectedPeers: getWhatsAppIncomingPeerCount() })
      // ignore non-text messages
    }
  },

  close(peer) {
    unregisterWhatsAppIncomingPeer(peer)
    wsLog('close', { connectedPeers: getWhatsAppIncomingPeerCount() })
  },

  error(peer, err) {
    unregisterWhatsAppIncomingPeer(peer)
    wsLog('error', {
      connectedPeers: getWhatsAppIncomingPeerCount(),
      error: err instanceof Error ? { name: err.name, message: err.message } : String(err)
    })
  }
})