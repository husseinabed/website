import { z } from 'zod'
import { requireTwilioClient, requireTwilioWhatsAppFrom } from '../../utils/useTwilio'

const ToSchema = z
  .string()
  .min(1)
  .refine((v) => v.startsWith('whatsapp:'), 'to must start with "whatsapp:"')

const SendTextSchema = z.object({
  to: ToSchema,
  body: z.string().min(1)
})

const SendTemplateSchema = z.object({
  to: ToSchema,
  // Twilio Content API (template) fields
  contentSid: z.string().min(1),
  contentVariables: z
    .union([z.string().min(1), z.record(z.string(), z.string())])
    .optional()
    .default('{}')
})

const BodySchema = z.union([SendTextSchema, SendTemplateSchema])

export default defineEventHandler(async (event) => {
  const client = requireTwilioClient()
  const from = requireTwilioWhatsAppFrom()

  const parsed = BodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: parsed.error.flatten()
    })
  }

  try {
    const requestId =
      (event.node.req.headers['x-request-id'] as string | undefined) ??
      (globalThis.crypto?.randomUUID?.() as string | undefined) ??
      `${Date.now()}-${Math.random().toString(16).slice(2)}`

    const maskPhone = (v: string) => {
      const s = String(v ?? '')
      if (!s) return s
      const withoutPrefix = s.startsWith('whatsapp:') ? s.slice('whatsapp:'.length) : s
      const last4 = withoutPrefix.slice(-4)
      return `${s.startsWith('whatsapp:') ? 'whatsapp:' : ''}***${last4}`
    }

    console.info('[twilio] whatsapp send start', {
      requestId,
      from: maskPhone(from),
      fromHasWhatsAppPrefix: from?.startsWith?.('whatsapp:'),
      kind: 'body' in parsed.data ? 'text' : 'template'
    })

    if ('body' in parsed.data) {
      console.info('[twilio] whatsapp send payload', {
        requestId,
        to: maskPhone(parsed.data.to),
        toHasWhatsAppPrefix: parsed.data.to?.startsWith?.('whatsapp:'),
        bodyLength: parsed.data.body?.length
      })

      const message = await client.messages.create({
        from,
        to: parsed.data.to,
        body: parsed.data.body
      })

      console.info('[twilio] whatsapp send success', { requestId, sid: message.sid })

      return {
        ok: true,
        sid: message.sid
      }
    }

    const { to, contentSid, contentVariables } = parsed.data
    const contentVariablesJson =
      typeof contentVariables === 'string' ? contentVariables : JSON.stringify(contentVariables)

    console.info('[twilio] whatsapp send payload', {
      requestId,
      to: maskPhone(to),
      toHasWhatsAppPrefix: to?.startsWith?.('whatsapp:'),
      contentSid,
      contentVariablesLength: contentVariablesJson?.length
    })

    const message = await client.messages.create({
      from,
      to,
      contentSid,
      contentVariables: contentVariablesJson
    })

    console.info('[twilio] whatsapp send success', { requestId, sid: message.sid })

    return {
      ok: true,
      sid: message.sid
    }
  } catch (err: any) {
    // Log richer details server-side (do not leak secrets to client)
    console.error('[twilio] whatsapp send failed', {
      code: err?.code,
      status: err?.status,
      message: err?.message,
      moreInfo: err?.moreInfo,
      details: err?.details
    })

    // Avoid leaking secrets; send minimal error info back to client
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to send WhatsApp message via Twilio',
      data: {
        code: err?.code,
        message: err?.message
      }
    })
  }
})