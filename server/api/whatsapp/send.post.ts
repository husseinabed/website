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
    if ('body' in parsed.data) {
      const message = await client.messages.create({
        from,
        to: parsed.data.to,
        body: parsed.data.body
      })

      return {
        ok: true,
        sid: message.sid
      }
    }

    const { to, contentSid, contentVariables } = parsed.data
    const contentVariablesJson =
      typeof contentVariables === 'string' ? contentVariables : JSON.stringify(contentVariables)

    const message = await client.messages.create({
      from,
      to,
      contentSid,
      contentVariables: contentVariablesJson
    })

    return {
      ok: true,
      sid: message.sid
    }
  } catch (err: any) {
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