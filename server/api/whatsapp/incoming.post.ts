import twilio from 'twilio'
import { z } from 'zod'
import { getHeader, getRequestURL, readRawBody, setResponseHeader, type H3Event } from 'h3'
import { requireTwilioAuthToken } from '../../utils/useTwilio'

const TwilioInboundSchema = z.object({
  // Common Twilio inbound fields (subset; Twilio may include more)
  AccountSid: z.string().optional(),
  ApiVersion: z.string().optional(),
  MessageSid: z.string().optional(),
  SmsMessageSid: z.string().optional(),
  SmsSid: z.string().optional(),
  MessagingServiceSid: z.string().optional(),

  From: z.string().optional(),
  To: z.string().optional(),
  Body: z.string().optional(),

  NumMedia: z.string().optional(),
  ProfileName: z.string().optional(),
  WaId: z.string().optional(),
  SmsStatus: z.string().optional()
})

function parseFormUrlEncoded(raw: string): Record<string, string> {
  const params = new URLSearchParams(raw)
  const out: Record<string, string> = {}
  for (const [k, v] of params.entries()) out[k] = v
  return out
}

function getPublicWebhookUrl(event: H3Event) {
  const url = getRequestURL(event)

  // Signature verification is sensitive to scheme/host.
  // In production behind a proxy, forwarded headers commonly reflect the public URL.
  const forwardedProto = getHeader(event, 'x-forwarded-proto')
  const forwardedHost = getHeader(event, 'x-forwarded-host')

  if (forwardedProto) url.protocol = `${forwardedProto}:`
  if (forwardedHost) url.host = forwardedHost

  return url.href
}

export default defineEventHandler(async (event) => {
  const authToken = requireTwilioAuthToken()

  const signature = getHeader(event, 'x-twilio-signature') ?? ''
  const rawBody = (await readRawBody(event)) ?? ''

  const params = parseFormUrlEncoded(rawBody)
  const webhookUrl = getPublicWebhookUrl(event)

  const valid = twilio.validateRequest(authToken, signature, webhookUrl, params)
  if (!valid) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid Twilio signature'
    })
  }

  const parsed = TwilioInboundSchema.safeParse(params)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Twilio webhook payload',
      data: parsed.error.flatten()
    })
  }

  const body = params.Body ?? ''
  const from = params.From ?? ''
  const to = params.To ?? ''
  const messageSid = params.MessageSid ?? params.SmsMessageSid ?? params.SmsSid ?? ''

  // Replace this with persistence (e.g., Supabase) or forwarding to your internal systems.
  console.info('[twilio] inbound message received', {
    messageSid,
    from,
    to,
    body,
    numMedia: params.NumMedia
  })

  // Twilio accepts empty 200 responses, but returning TwiML is explicit and safe.
  setResponseHeader(event, 'content-type', 'text/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`
})