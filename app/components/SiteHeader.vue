<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6">
      <!-- Brand -->
      <div class="flex items-center justify-between gap-4">
        <NuxtLink to="/" class="flex min-w-0 items-center gap-3 rounded-lg">
          <img
            src="/images/logo.png"
            class="h-11 w-11 shrink-0"
            :alt="siteConfig.clinicName"
            width="44"
            height="44"
            loading="eager"
            decoding="async"
          />
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold text-slate-900 sm:text-base">
              {{ siteConfig.clinicName }}
            </span>
            <span class="block truncate text-xs text-slate-600">
              {{ siteConfig.city }}
            </span>
          </span>
        </NuxtLink>
      </div>

      <!-- Primary navigation -->
      <nav :aria-label="siteConfig.nav.primaryAriaLabel" class="md:flex md:items-center md:gap-6">
        <ul class="flex items-center gap-2 overflow-x-auto whitespace-nowrap px-1 py-1 md:gap-4 md:overflow-visible">
          <li>
            <NuxtLink
              to="/"
              class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:text-sky-700"
            >
              {{ siteConfig.nav.home }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/services"
              class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:text-sky-700"
            >
              {{ siteConfig.nav.services }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/contact"
              class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:text-sky-700"
            >
              {{ siteConfig.nav.contact }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- CTAs -->
      <div class="grid grid-cols-2 gap-3 md:flex md:items-center md:justify-end md:gap-3">
        <a
          :href="whatsAppHref"
          class="button-primary w-full justify-center text-center text-sm"
          target="_blank"
          rel="noopener"
        >
          {{ siteConfig.contactPage.whatsappLabel }}
        </a>

        <a :href="telHref" class="button-secondary w-full justify-center text-center text-sm">
          {{ siteConfig.contactPage.phoneLabel }}
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { buildTelLink, buildWhatsAppLink } from '../client'
import { siteConfig } from '../site.config'

const telHref = buildTelLink(siteConfig.phone)
const whatsAppHref = buildWhatsAppLink(siteConfig.whatsapp)
</script>