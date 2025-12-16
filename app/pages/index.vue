<!-- @ts-nocheck -->
<template>
  <div class="bg-white text-slate-900">
    <Hero />
    <ServicesGrid />
    <TrustBadges />

    <section class="mx-auto max-w-6xl px-6 py-12" aria-labelledby="testimonials-title">
      <header class="flex flex-col gap-2">
        <h2 id="testimonials-title" class="text-2xl font-bold text-slate-900">
          {{ siteConfig.homePage.testimonialsTitle }}
        </h2>
        <p class="max-w-2xl text-slate-600">
          {{ siteConfig.homePage.testimonialsIntro }}
        </p>
      </header>

      <ul class="mt-6 grid gap-4 md:grid-cols-3" role="list">
        <li v-for="t in siteConfig.testimonials" :key="`${t.name}-${t.quote}`" class="card p-6">
          <blockquote class="text-slate-700">
            <p class="leading-relaxed">{{ t.quote }}</p>
          </blockquote>
          <footer class="mt-4 text-sm text-slate-500">
            <span class="font-semibold text-slate-800">{{ t.name }}</span>
            <span v-if="t.city"> — {{ t.city }}</span>
          </footer>
        </li>
      </ul>
    </section>

    <FAQ />

    <div class="mx-auto max-w-6xl px-6 py-12">
      <LeadForm source-page="/" />
    </div>

    <ContactCTA />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import LeadForm from '~/components/LeadForm.vue'
import { siteConfig } from '~/site.config'
import { buildMeta } from '~/utils/seo'

// @ts-expect-error Nuxt macro auto-imported
useHead(buildMeta({ page: 'home' }))
</script>