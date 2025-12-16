<template>
  <section class="mx-auto max-w-6xl px-6 py-14" aria-labelledby="services-grid-title">
    <header class="flex flex-col gap-3">
      <h2 id="services-grid-title" class="text-3xl font-bold text-slate-900">
        {{ formatCopy(siteConfig.servicesPage.title) }}
      </h2>
      <p class="max-w-2xl text-slate-600">
        {{ siteConfig.servicesPage.intro }}
      </p>
    </header>

    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article v-for="service in services" :key="service.title" class="card p-6">
        <h3 class="text-xl font-semibold text-slate-900">{{ service.title }}</h3>
        <p class="mt-2 text-slate-600">{{ service.description }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '../site.config'

const services = computed(() => siteConfig.services.slice(0, 6))

const formatCopy = (value: string) =>
  value.replace(/\{(\w+)\}/g, (_, token: string) => {
    if (token === 'city') return siteConfig.city
    if (token === 'clinicName') return siteConfig.clinicName
    return `{${token}}`
  })
</script>