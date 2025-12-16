<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-white">
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(0,127,255,0.08),transparent_30%)]"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <div class="space-y-6">
          <p
            class="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-sky-700 shadow-sm ring-1 ring-sky-100 backdrop-blur"
          >
            <span>{{ formatCopy(siteConfig.hero.badgeLeft) }}</span>
            <span class="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
            <span>{{ siteConfig.hero.badgeRight }}</span>
          </p>

          <div class="space-y-4">
            <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {{ formatCopy(siteConfig.hero.headline) }}
            </h1>

            <p class="max-w-2xl text-lg text-slate-600">
              {{ siteConfig.hero.subheadline }}
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a :href="whatsAppHref" class="button-primary" target="_blank" rel="noopener">
              {{ siteConfig.hero.primaryCtaLabel }}
            </a>

            <a :href="telHref" class="button-secondary">
              {{ siteConfig.hero.secondaryCtaLabel }}
            </a>
          </div>

          <dl class="flex flex-wrap gap-3 text-sm text-slate-600">
            <div class="badge">
              <dt class="sr-only">{{ siteConfig.contactPage.phoneLabel }}</dt>
              <dd class="field-ltr">{{ siteConfig.phone }}</dd>
            </div>
            <div class="badge">
              <dt class="sr-only">{{ siteConfig.contactPage.whatsappLabel }}</dt>
              <dd class="field-ltr">{{ siteConfig.whatsapp }}</dd>
            </div>
          </dl>
        </div>

        <figure class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(0,18,32,0.08)]">
          <img
            src="/images/hero.png"
            class="w-full aspect-[16/10] object-cover"
            :alt="siteConfig.hero.imageAlt"
            width="1600"
            height="1000"
            loading="eager"
            decoding="async"
          />
          <figcaption class="border-t border-slate-200 px-4 py-3">
            <p class="text-sm font-semibold text-slate-900">{{ siteConfig.clinicName }}</p>
            <p class="text-sm text-slate-600">{{ siteConfig.hero.figureCaptionSubtitle }}</p>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { buildTelLink, buildWhatsAppLink } from '../client'
import { siteConfig } from '../site.config'

const telHref = buildTelLink(siteConfig.phone)
const whatsAppHref = buildWhatsAppLink(siteConfig.whatsapp)

const formatCopy = (value: string) =>
  value.replace(/\{(\w+)\}/g, (_, token: string) => {
    if (token === 'city') return siteConfig.city
    if (token === 'clinicName') return siteConfig.clinicName
    return `{${token}}`
  })
</script>