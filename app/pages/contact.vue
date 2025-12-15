<!-- @ts-nocheck -->
<template>
  <div class="bg-white text-slate-900">
    <section class="border-b border-slate-200 bg-gradient-to-r from-white via-sky-50 to-white">
      <div class="reveal mx-auto max-w-5xl px-6 py-10">
        <p class="text-sm font-semibold text-sky-700">{{ ar.contact.headerKicker }}</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">{{ ar.contact.title }}</h1>
        <p class="mt-2 text-slate-600">{{ ar.contact.subtitle }}</p>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-6 py-10 grid gap-8 lg:grid-cols-3">
      <div class="reveal card border border-slate-200 p-6 lg:col-span-2 space-y-4">
        <div>
          <h2 class="text-xl font-semibold text-slate-900">{{ ar.contact.detailsTitle }}</h2>
          <p class="text-slate-600">{{ ar.contact.detailsSubtitle }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-1">
            <p class="text-sm font-semibold text-slate-800">{{ ar.contact.cards.phone.label }}</p>
            <a class="text-sky-700 font-semibold" :href="telHref">{{ client.phone }}</a>
          </div>

          <div class="space-y-1">
            <p class="text-sm font-semibold text-slate-800">{{ ar.contact.cards.whatsapp.label }}</p>
            <a class="text-sky-700 font-semibold" :href="whatsAppHref" target="_blank" rel="noopener">
              {{ ar.contact.cards.whatsapp.linkLabel }}
            </a>
          </div>

          <div class="space-y-1">
            <p class="text-sm font-semibold text-slate-800">{{ ar.contact.cards.address.label }}</p>
            <p class="text-slate-700">
              {{ client.address.line1 }}<br />
              {{ client.address.city }}، {{ client.address.country }}
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-sm font-semibold text-slate-800">{{ ar.contact.cards.email.label }}</p>
            <a class="text-sky-700 font-semibold" :href="mailtoHref">{{ client.email }}</a>
          </div>
        </div>

        <div class="space-y-1">
          <p class="text-sm font-semibold text-slate-800">{{ ar.contact.cards.hours.label }}</p>
          <ul class="text-slate-700 text-sm space-y-1">
            <li v-for="line in ar.contact.cards.hours.lines" :key="line">{{ line }}</li>
          </ul>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-semibold text-slate-800">{{ ar.contact.cards.map.label }}</p>
          <div class="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <a :href="mapsHref" class="text-sky-700 font-semibold" target="_blank" rel="noopener">
              {{ ar.global.ctas.map }}
            </a>
            <p class="mt-1 text-slate-600">{{ ar.contact.cards.map.hint }}</p>
          </div>
        </div>

        <!-- WhatsApp API test (dev helper) -->
        <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-sm font-semibold text-slate-900">WhatsApp API Test</h3>
            <span class="text-xs text-slate-500">POST /api/whatsapp/send</span>
          </div>

          <div class="text-xs text-slate-600 leading-relaxed">
            To: <span class="font-mono">{{ waTo }}</span>
            <span class="mx-2 text-slate-300">|</span>
            Requires server env: <span class="font-mono">TWILIO_ACCOUNT_SID</span>, <span class="font-mono">TWILIO_AUTH_TOKEN</span>,
            <span class="font-mono">TWILIO_WHATSAPP_FROM</span>.
          </div>

          <div class="grid gap-3">
            <div class="grid gap-1">
              <label class="text-xs font-semibold text-slate-800">Message (plain text)</label>
              <textarea
                v-model="waBody"
                class="min-h-32 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                placeholder="Hello from /contact"
                spellcheck="false"
              />
            </div>

            <div class="flex items-center gap-3">
              <button class="button-primary" type="button" :disabled="waSending" @click="sendTestWhatsApp">
                {{ waSending ? 'Sending…' : 'Send test message' }}
              </button>

              <span v-if="waResult?.ok" class="text-xs text-emerald-700 font-semibold">
                Sent (sid: <span class="font-mono">{{ waResult.sid }}</span>)
              </span>
              <span v-else-if="waError" class="text-xs text-rose-700 font-semibold">
                {{ waError }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="reveal card border border-slate-200 p-6 space-y-4" style="--reveal-delay: 120ms">
        <h3 class="text-lg font-semibold text-slate-900">{{ ar.contact.bookCard.title }}</h3>
        <p class="text-sm text-slate-600">{{ ar.contact.bookCard.subtitle }}</p>
        <NuxtLink to="/book" class="button-primary w-full text-center">{{ ar.contact.bookCard.primary }}</NuxtLink>
        <a :href="whatsAppHref" class="button-secondary w-full text-center" target="_blank" rel="noopener">
          {{ ar.contact.bookCard.secondary }}
        </a>
        <div class="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          {{ ar.contact.bookCard.guardrails }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { client, buildTelLink, buildWhatsAppLink, buildMailtoLink, buildMapsLink } from '../client'
import { ar } from '../content/ar'

const telHref = buildTelLink(client.phone)
const whatsAppHref = buildWhatsAppLink(client.whatsapp)
const mailtoHref = buildMailtoLink(client.email, { subject: `استفسار · ${client.clinic_name}` })
const mapsHref = buildMapsLink(client.google_maps_url)

// WhatsApp API test panel (client-side)
const waTo = 'whatsapp:+972537816874'
const waBody = ref('Hello from /contact')
const waSending = ref(false)
const waResult = ref<{ ok: boolean; sid?: string } | null>(null)
const waError = ref<string>('')

async function sendTestWhatsApp() {
  waSending.value = true
  waResult.value = null
  waError.value = ''
  try {
    const res = await $fetch('/api/whatsapp/send', {
      method: 'POST',
      body: {
        to: waTo,
        body: waBody.value
      }
    })
    waResult.value = res as any
  } catch (err: any) {
    waError.value = err?.data?.statusMessage || err?.statusMessage || err?.message || 'Failed to send'
  } finally {
    waSending.value = false
  }
}

// @ts-expect-error Nuxt macro auto-imported
definePageMeta({
  title: ar.seo.contact.title,
  description: ar.seo.contact.description
})

// @ts-expect-error Nuxt macro auto-imported
useHead({
  title: ar.seo.contact.title,
  meta: [{ name: 'description', content: ar.seo.contact.description }]
})
</script>