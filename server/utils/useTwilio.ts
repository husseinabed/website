import twilio, { type Twilio } from 'twilio'
import { createError } from 'h3'

export type TwilioServerConfig = {
  accountSid?: string
  authToken?: string
  whatsappFrom?: string
}

export type UseTwilioResult = TwilioServerConfig & {
  /**
   * `null` when not enough config is present to create a client.
   * Use `requireTwilioClient()` if you need a guaranteed client instance.
   */
  client: Twilio | null
}

/**
 * Server-only helper for reading Twilio config and (optionally) creating a Twilio client.
 *
 * Notes:
 * - Do NOT use this from the browser (it reads private runtimeConfig secrets).
 * - Prefer the `require*` helpers below inside API routes.
 */
export function useTwilio(): UseTwilioResult {
  const config = useRuntimeConfig()

  const accountSid = config.twilio?.accountSid
  const authToken = config.twilio?.authToken
  const whatsappFrom = config.twilio?.whatsappFrom

  const client = accountSid && authToken ? twilio(accountSid, authToken) : null

  return {
    accountSid,
    authToken,
    whatsappFrom,
    client
  }
}

export function requireTwilioAuthToken(): string {
  const { authToken } = useTwilio()
  if (!authToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Twilio is not configured. Set TWILIO_AUTH_TOKEN.'
    })
  }
  return authToken
}

export function requireTwilioClient(): Twilio {
  const { client } = useTwilio()
  if (!client) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Twilio is not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.'
    })
  }
  return client
}

export function requireTwilioWhatsAppFrom(): string {
  const { whatsappFrom } = useTwilio()
  if (!whatsappFrom) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Twilio WhatsApp sender is not configured. Set TWILIO_WHATSAPP_FROM.'
    })
  }
  return whatsappFrom
}