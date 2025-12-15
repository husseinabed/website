<template>
  <div class="min-h-screen bg-white text-slate-900">
    <header class="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div class="flex items-center gap-3">
          <img
            :src="`/images/logo.png`"
            class="size-15"
            :alt="ar.global.clinicLabel"
            width="150"
            height="150"
            loading="lazy"
            decoding="async"
          />
          <div>
            <p class="text-sm font-semibold text-slate-900">{{ ar.global.clinicLabel }}</p>
            <p class="text-xs text-slate-600">{{ ar.global.tagline }}</p>
          </div>
        </div>

        <nav class="hidden items-center gap-4 text-sm font-semibold text-slate-700 md:flex">
          <NuxtLink to="/" class="hover:text-sky-700">{{ ar.nav.home }}</NuxtLink>
          <NuxtLink to="/services" class="hover:text-sky-700">{{ ar.nav.services }}</NuxtLink>
          <NuxtLink to="/book" class="hover:text-sky-700">{{ ar.nav.book }}</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-sky-700">{{ ar.nav.contact }}</NuxtLink>
        </nav>

        <div class="hidden md:flex items-center gap-3">
          <a :href="whatsAppHref" class="button-secondary" target="_blank" rel="noopener">
            {{ ar.global.ctas.whatsapp }}
          </a>
          <NuxtLink to="/book" class="button-primary">{{ ar.global.ctas.book }}</NuxtLink>
        </div>

        <div class="md:hidden">
          <NuxtLink to="/book" class="button-primary text-sm">{{ ar.global.ctas.book }}</NuxtLink>
        </div>
      </div>
    </header>

    <main>
      <NuxtPage />
    </main>

    <footer class="mt-12 border-t border-slate-200 bg-slate-50">
      <div class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-semibold text-slate-900">{{ ar.global.clinicLabel }}</p>
          <p class="text-xs text-slate-600">{{ ar.global.trustBullets.join(' • ') }}</p>
        </div>
        <div class="flex items-center gap-4 text-sm text-slate-600">
          <NuxtLink to="/services" class="hover:text-sky-700">{{ ar.nav.services }}</NuxtLink>
          <NuxtLink to="/book" class="hover:text-sky-700">{{ ar.nav.book }}</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-sky-700">{{ ar.nav.contact }}</NuxtLink>
          <a :href="whatsAppHref" class="hover:text-sky-700" target="_blank" rel="noopener">{{ ar.global.ctas.whatsapp }}</a>
        </div>
      </div>
    </footer>

    <!-- Minimal global mobile sticky CTA bar (no redesign): ensures valid tel:/wa.me across all pages -->
    <div
      class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur md:hidden"
    >
      <div class="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <a :href="telHref" class="button-secondary w-full text-center">
          {{ ar.global.ctas.call }}
        </a>
        <a :href="whatsAppHref" class="button-primary w-full text-center" target="_blank" rel="noopener">
          {{ ar.global.ctas.whatsapp }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { client, buildTelLink, buildWhatsAppLink } from './client'
import { ar } from './content/ar'

const telHref = buildTelLink(client.phone)
const whatsAppHref = buildWhatsAppLink(client.whatsapp)

</script>
