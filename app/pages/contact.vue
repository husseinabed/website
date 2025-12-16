<!-- @ts-nocheck -->
<template>
  <div class="bg-white text-slate-900">
    <header class="border-b border-slate-200 bg-gradient-to-r from-white via-sky-50 to-white">
      <div class="mx-auto max-w-6xl px-6 py-10">
        <p class="text-sm font-semibold text-sky-700">{{ siteConfig.contactPage.headerKicker }}</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">{{ formatCopy(siteConfig.contactPage.headerTitle) }}</h1>
        <p class="mt-2 max-w-2xl text-slate-600">
          {{ siteConfig.contactPage.headerSubtitle }}
        </p>
      </div>
    </header>

    <section class="mx-auto max-w-6xl px-6 py-10 grid gap-6 lg:grid-cols-3">
      <div class="card border border-slate-200 p-6 lg:col-span-2">
        <div class="flex flex-col gap-2">
          <h2 class="text-xl font-semibold text-slate-900">{{ siteConfig.contactPage.detailsTitle }}</h2>
          <p class="text-sm text-slate-600">{{ siteConfig.contactPage.detailsSubtitle }}</p>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div class="card border border-slate-200 p-5">
            <p class="text-sm font-semibold text-slate-800">{{ siteConfig.contactPage.phoneLabel }}</p>
            <a class="mt-2 inline-block text-sky-700 font-semibold field-ltr" :href="telHref">
              {{ siteConfig.phone }}
            </a>
          </div>

          <div class="card border border-slate-200 p-5">
            <p class="text-sm font-semibold text-slate-800">{{ siteConfig.contactPage.whatsappLabel }}</p>
            <a
              class="mt-2 inline-block text-sky-700 font-semibold field-ltr"
              :href="whatsAppHref"
              target="_blank"
              rel="noopener"
            >
              {{ siteConfig.whatsapp }}
            </a>
            <p class="mt-2 text-xs text-slate-600">{{ siteConfig.contactPage.whatsappHint }}</p>
          </div>

          <div class="card border border-slate-200 p-5 sm:col-span-2">
            <p class="text-sm font-semibold text-slate-800">{{ siteConfig.contactPage.addressLabel }}</p>
            <p class="mt-2 text-slate-700">
              {{ siteConfig.address }}
            </p>

            <a
              class="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
              :href="mapsHref"
              target="_blank"
              rel="noopener"
            >
              {{ siteConfig.contactPage.mapsLinkLabel }}
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div class="card border border-slate-200 p-5 sm:col-span-2">
            <p class="text-sm font-semibold text-slate-800">{{ siteConfig.contactPage.hoursLabel }}</p>
            <ul class="mt-2 space-y-1 text-sm text-slate-700" role="list">
              <li v-for="line in hoursLines" :key="line">{{ line }}</li>
            </ul>

            <p class="mt-3 text-xs text-slate-600">
              {{ siteConfig.contactPage.hoursNote }}
            </p>
          </div>
        </div>
      </div>

      <aside class="card border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900">{{ siteConfig.contactPage.quickTitle }}</h2>
        <p class="mt-2 text-sm text-slate-600">
          {{ siteConfig.contactPage.quickSubtitle }}
        </p>

        <div class="mt-5 flex flex-col gap-3">
          <a :href="whatsAppHref" class="button-primary w-full text-center" target="_blank" rel="noopener">
            {{ siteConfig.contactPage.quickPrimaryCtaLabel }}
          </a>
          <a :href="telHref" class="button-secondary w-full text-center">{{ siteConfig.contactPage.quickSecondaryCtaLabel }}</a>
        </div>

        <dl class="mt-5 flex flex-wrap gap-2 text-xs text-slate-600">
          <div class="badge">
            <dt class="sr-only">{{ siteConfig.contactPage.cityLabel }}</dt>
            <dd>{{ siteConfig.city }}</dd>
          </div>
          <div class="badge">
            <dt class="sr-only">{{ siteConfig.contactPage.phoneLabel }}</dt>
            <dd class="field-ltr">{{ siteConfig.phone }}</dd>
          </div>
          <div class="badge">
            <dt class="sr-only">{{ siteConfig.contactPage.whatsappLabel }}</dt>
            <dd class="field-ltr">{{ siteConfig.whatsapp }}</dd>
          </div>
        </dl>
      </aside>
    </section>

    <section class="mx-auto max-w-6xl px-6 pb-12">
      <LeadForm source-page="/contact" />
    </section>

    <ContactCTA />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed } from 'vue'
import LeadForm from '~/components/LeadForm.vue'
import { buildTelLink, buildWhatsAppLink } from '~/client'
import { siteConfig } from '~/site.config'
import { buildMeta } from '~/utils/seo'

const telHref = buildTelLink(siteConfig.phone)
const whatsAppHref = buildWhatsAppLink(siteConfig.whatsapp)

const mapsHref = computed(() => {
  const q = encodeURIComponent(siteConfig.address)
  return `https://www.google.com/maps/search/?api=1&query=${q}`
})

const dayOrder = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'] as const

const hoursLines = computed(() => {
  return dayOrder.map((day) => {
    const label = siteConfig.hours.dayLabels[day]
    const slot = siteConfig.hours.days[day]
    if (!slot) return `${label}: ${siteConfig.contactPage.hoursClosedLabel}`
    return `${label}: ${slot.open}–${slot.close}`
  })
})

const formatCopy = (value: string) =>
  value.replace(/\{(\w+)\}/g, (_, token: string) => {
    if (token === 'city') return siteConfig.city
    if (token === 'clinicName') return siteConfig.clinicName
    return `{${token}}`
  })

// @ts-expect-error Nuxt macro auto-imported
useHead(buildMeta({ page: 'contact' }))
</script>