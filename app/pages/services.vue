<!-- @ts-nocheck -->
<template>
  <div class="bg-white text-slate-900">
    <header class="border-b border-slate-200 bg-gradient-to-r from-white via-sky-50 to-white">
      <div class="mx-auto max-w-6xl px-6 py-10">
        <p class="text-sm font-semibold text-sky-700">{{ siteConfig.servicesPage.kicker }}</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">{{ formatCopy(siteConfig.servicesPage.title) }}</h1>
        <p class="mt-2 max-w-2xl text-slate-600">
          {{ siteConfig.servicesPage.intro }}
        </p>
      </div>
    </header>

    <ServicesGrid />

    <ContactCTA />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { siteConfig } from '~/site.config'
import { buildMeta } from '~/utils/seo'

const formatCopy = (value: string) =>
  value.replace(/\{(\w+)\}/g, (_, token: string) => {
    if (token === 'city') return siteConfig.city
    if (token === 'clinicName') return siteConfig.clinicName
    return `{${token}}`
  })

// @ts-expect-error Nuxt macro auto-imported
useHead(buildMeta({ page: 'services' }))
</script>