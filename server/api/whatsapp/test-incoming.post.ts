import crypto from 'node:crypto'
import { z } from 'zod'
import { createError, getRequestURL, readBody, setResponseHeader } from 'h3'
import { requireTwilioAuthToken } from '../../utils/useTwilio'

const BodySchema = z
  .object({
    /**
     * Optional convenience fields; will be mapped to Twilio-style form fields.
     */
    from: z.string().optional().default('whatsapp:+972500000000'),
    to: z.string().optional().default('whatsapp:+14155238886'),
    body: z.string().optional().default('Test message (local webhook test)'),

    /**
     * Any additional Twilio form fields you want to include.
     * Example: { MessageSid: "SMxxx", ProfileName: "John" }
     */
    extra: z.record(z.string(), z.string()).optional().default({}),

    /**
     * Defaults to your existing webhook endpoint.
     */
    targetPath: z.string().optional().default('/api/whatsapp/incoming'),

    /**
     * If true, returns the upstream response body as text.
     */
    includeResponseBody: z.boolean().optional().default(true)
  })
  .strict()

/**
 * Twilio signature algorithm:
 * - Build a string: url + (each param name + value) in lexicographic order by param name
 * - HMAC-SHA1 with the auth token as key
 * - Base64 encode
 */
function computeTwilioSignature(authToken: string, url: string, params: Record<string, string>): string {
  const data = url + Object.keys(params).sort().map((k) => `${k}${params[k]}`).join('')
  return crypto.createHmac('sha1', authToken).update(data, 'utf8').digest('base64')
}

export default defineEventHandler(async (event) => {
  // Prevent accidental exposure of a signature-generation endpoint in production.
  if (process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const parsed = BodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: parsed.error.flatten()
    })
  }

  const { from, to, body, extra, targetPath, includeResponseBody } = parsed.data

  const authToken = requireTwilioAuthToken()

  const targetUrl = new URL(getRequestURL(event).href)
  targetUrl.pathname = targetPath
  targetUrl.search = ''

  const form = new URLSearchParams()

  // Minimal Twilio-ish fields that your existing handler parses/logs.
  form.set('From', from)
  form.set('To', to)
  form.set('Body', body)

  // Include any extra Twilio fields the user wants.
  for (const [k, v] of Object.entries(extra)) form.set(k, v)

  // Twilio signs the *decoded* form values (not the raw x-www-form-urlencoded string).
  const paramsObj: Record<string, string> = {}
  for (const [k, v] of form.entries()) paramsObj[k] = v

  const signature = computeTwilioSignature(authToken, targetUrl.href, paramsObj)

  const res = await fetch(targetUrl.href, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-twilio-signature': signature
    },
    body: form.toString()
  })

  const responseText = includeResponseBody ? await res.text() : ''

  // Make it easy to read in the browser.
  setResponseHeader(event, 'content-type', 'application/json; charset=utf-8')

  return {
    ok: res.ok,
    request: {
      url: targetUrl.href,
      signature,
      form: paramsObj
    },
    response: {
      status: res.status,
      statusText: res.statusText,
      body: includeResponseBody ? responseText : undefined
    }
  }
})