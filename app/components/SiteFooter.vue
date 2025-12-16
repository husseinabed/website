<template>
  <footer class="mt-12 border-t border-slate-200 bg-slate-50">
    <div class="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
      <!-- Clinic -->
      <section class="space-y-2">
        <h2 class="text-base font-bold text-slate-900">
          {{ siteConfig.clinicName }}
        </h2>
        <p class="text-sm text-slate-600">
          {{ siteConfig.address }}
        </p>
        <p class="text-sm text-slate-600">
          {{ siteConfig.city }}
        </p>
      </section>

      <!-- Contact -->
      <section class="space-y-3">
        <h2 class="text-base font-bold text-slate-900">{{ siteConfig.contactPage.detailsTitle }}</h2>

        <div class="flex flex-col gap-2 text-sm">
          <a
            :href="whatsAppHref"
            class="inline-flex min-h-11 items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 hover:border-sky-300"
            target="_blank"
            rel="noopener"
          >
            <span class="font-semibold text-slate-700">{{ siteConfig.contactPage.whatsappLabel }}</span>
            <span class="field-ltr text-slate-600">{{ siteConfig.whatsapp }}</span>
          </a>

          <a
            :href="telHref"
            class="inline-flex min-h-11 items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 hover:border-sky-300"
          >
            <span class="font-semibold text-slate-700">{{ siteConfig.contactPage.phoneLabel }}</span>
            <span class="field-ltr text-slate-600">{{ siteConfig.phone }}</span>
          </a>
        </div>
      </section>

      <!-- Hours -->
      <section class="space-y-3">
        <h2 class="text-base font-bold text-slate-900">{{ siteConfig.contactPage.hoursLabel }}</h2>

        <dl class="grid gap-2 text-sm text-slate-700">
          <div v-for="row in hoursRows" :key="row.dayKey" class="flex items-center justify-between gap-4">
            <dt class="font-semibold text-slate-700">{{ row.dayLabel }}</dt>
            <dd class="text-slate-600">
              <span v-if="row.isClosed">{{ siteConfig.contactPage.hoursClosedLabel }}</span>
              <span v-else class="field-ltr">{{ row.open }} - {{ row.close }}</span>
            </dd>
          </div>
        </dl>
      </section>
    </div>

    <div class="border-t border-slate-200">
      <div class="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p class="text-slate-600">
          © {{ new Date().getFullYear() }} {{ siteConfig.clinicName }}
        </p>

        <nav :aria-label="siteConfig.nav.footerAriaLabel">
          <ul class="flex flex-wrap items-center gap-2 sm:gap-4">
            <li>
              <NuxtLink to="/" class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 hover:text-sky-700">
                {{ siteConfig.nav.home }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/services" class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 hover:text-sky-700">
                {{ siteConfig.nav.services }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 hover:text-sky-700">
                {{ siteConfig.nav.contact }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { buildTelLink, buildWhatsAppLink } from '../client'
import { siteConfig, type DayKey } from '../site.config'

type HoursRow = {
  dayKey: DayKey
  dayLabel: string
  isClosed: boolean
  open?: string
  close?: string
}

const telHref = buildTelLink(siteConfig.phone)
const whatsAppHref = buildWhatsAppLink(siteConfig.whatsapp)

const dayOrder = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'] as const satisfies readonly DayKey[]

const hoursRows: HoursRow[] = dayOrder.map((key) => {
  const entry = siteConfig.hours.days[key]
  const dayLabel = siteConfig.hours.dayLabels[key]

  if (!entry) {
    return { dayKey: key, dayLabel, isClosed: true }
  }

  return {
    dayKey: key,
    dayLabel,
    isClosed: false,
    open: entry.open,
    close: entry.close
  }
})
</script>