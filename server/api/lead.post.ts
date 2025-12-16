import { z } from 'zod'
import { getHeader, getRequestIP, setResponseHeader } from 'h3'

type RateLimitEntry = {
  count: number
  resetAt: number
  lastSeen: number
}

const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

const BodySchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6).max(30),
  service: z.string().trim().min(2).max(80),
  message: z.string().trim().max(1000).optional().default(''),
  sourcePage: z.string().trim().min(1).max(200),
  // Honeypot: if present and non-empty => treat as spam, still return { ok: true }
  hp: z.string().optional().default('')
})

function getRateLimitStore(): Map<string, RateLimitEntry> {
  const g = globalThis as any
  if (!g.__leadRateLimitStore) g.__leadRateLimitStore = new Map()
  return g.__leadRateLimitStore as Map<string, RateLimitEntry>
}

function cleanupRateLimitStore(store: Map<string, RateLimitEntry>, now: number) {
  // Best-effort cleanup to avoid unbounded growth in long-lived processes
  if (store.size <= 5000) return
  for (const [k, v] of store.entries()) {
    if (v.resetAt <= now) store.delete(k)
  }
}

function checkAndConsumeRateLimit(ipKey: string, now: number) {
  const store = getRateLimitStore()
  cleanupRateLimitStore(store, now)

  const entry = store.get(ipKey)
  if (!entry || now >= entry.resetAt) {
    const next: RateLimitEntry = {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
      lastSeen: now
    }
    store.set(ipKey, next)
    return { allowed: true, retryAfterSeconds: 0, remaining: RATE_LIMIT_MAX - 1 }
  }

  entry.lastSeen = now

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000))
    return { allowed: false, retryAfterSeconds, remaining: 0 }
  }

  entry.count += 1
  return { allowed: true, retryAfterSeconds: 0, remaining: Math.max(0, RATE_LIMIT_MAX - entry.count) }
}

export default defineEventHandler(async (event) => {
  const parsed = BodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: {
        ok: false,
        error: 'invalid_body',
        details: parsed.error.flatten()
      }
    })
  }

  const { name, phone, service, message, sourcePage, hp } = parsed.data

  // Honeypot: do not rate limit, do not forward, always respond OK
  if (hp && hp.trim().length > 0) {
    console.info('[lead] honeypot triggered (spam)', {
      sourcePage,
      hpLength: hp.length
    })
    return { ok: true }
  }

  const now = Date.now()
  const ip = getRequestIP(event) ?? 'unknown'
  const ipKey = String(ip || 'unknown')
  const userAgent = getHeader(event, 'user-agent') ?? undefined

  const rl = checkAndConsumeRateLimit(ipKey, now)
  if (!rl.allowed) {
    setResponseHeader(event, 'retry-after', rl.retryAfterSeconds)
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      data: { ok: false, error: 'rate_limited' }
    })
  }

  const webhookUrl = process.env.LEAD_WEBHOOK_URL
  if (!webhookUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing LEAD_WEBHOOK_URL',
      data: { ok: false, error: 'missing_webhook' }
    })
  }

  const payload = {
    name,
    phone,
    service,
    message,
    sourcePage,
    timestamp: new Date(now).toISOString(),
    ip: ipKey,
    userAgent
  }

  try {
    await $fetch(webhookUrl, {
      method: 'POST',
      body: payload
    })
  } catch (err: any) {
    console.error('[lead] webhook forward failed', {
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      message: err?.message
    })

    throw createError({
      statusCode: 502,
      statusMessage: 'Webhook call failed',
      data: { ok: false, error: 'webhook_failed' }
    })
  }

  return { ok: true }
})