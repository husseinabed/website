import type { Peer } from 'crossws'

export type WhatsAppIncomingEvent = {
  /**
   * Event discriminator for the frontend.
   */
  type: 'whatsapp:incoming'

  receivedAt: string

  messageSid: string
  from: string
  to: string
  body: string

  /**
   * Twilio sends this as a string number ("0", "1", ...).
   */
  numMedia?: string

  /**
   * Raw Twilio form-urlencoded params (optional; can be large/noisy).
   */
  params?: Record<string, string>
}

/**
 * In-memory connected peer registry.
 *
 * Notes:
 * - This is per server instance (no cross-instance fanout). If you deploy multiple
 *   instances, use a shared pub/sub (Redis, Postgres, Ably, Pusher, etc.).
 * - Peers are stored in module scope so both HTTP handlers and WS handlers can access.
 */
const peers = new Set<Peer>()

export function registerWhatsAppIncomingPeer(peer: Peer) {
  peers.add(peer)
}

export function unregisterWhatsAppIncomingPeer(peer: Peer) {
  peers.delete(peer)
}

export function getWhatsAppIncomingPeerCount(): number {
  return peers.size
}

export function broadcastWhatsAppIncoming(
  payload: Omit<WhatsAppIncomingEvent, 'type' | 'receivedAt'> & {
    receivedAt?: string
    numMedia?: string
    params?: Record<string, string>
  }
) {
  const msg: WhatsAppIncomingEvent = {
    type: 'whatsapp:incoming',
    receivedAt: payload.receivedAt ?? new Date().toISOString(),
    messageSid: payload.messageSid,
    from: payload.from,
    to: payload.to,
    body: payload.body,
    numMedia: payload.numMedia,
    params: payload.params
  }

  const wire = JSON.stringify(msg)

  for (const peer of peers) {
    try {
      // Always send strings over the wire; frontend can JSON.parse(...)
      peer.send(wire)
    } catch {
      // If the peer is in a bad state, drop it.
      peers.delete(peer)
    }
  }
}