<template>
  <section class="bg-slate-900 text-white">
    <div class="mx-auto max-w-6xl px-6 py-14">
      <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div class="space-y-2">
          <h2 class="text-3xl font-bold">{{ siteConfig.contactPage.quickTitle }}</h2>
          <p class="max-w-2xl text-slate-100/80">
            {{ siteConfig.contactPage.quickSubtitle }}
          </p>

          <dl class="mt-4 flex flex-wrap gap-3 text-sm text-slate-100/80">
            <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
              <dt class="sr-only">{{ siteConfig.contactPage.whatsappLabel }}</dt>
              <dd class="field-ltr">{{ siteConfig.whatsapp }}</dd>
            </div>
            <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
              <dt class="sr-only">{{ siteConfig.contactPage.phoneLabel }}</dt>
              <dd class="field-ltr">{{ siteConfig.phone }}</dd>
            </div>
          </dl>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a :href="whatsAppHref" class="button-primary" target="_blank" rel="noopener">
            {{ siteConfig.contactPage.quickPrimaryCtaLabel }}
          </a>
          <a :href="telHref" class="button-secondary">
            {{ siteConfig.contactPage.quickSecondaryCtaLabel }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { buildTelLink, buildWhatsAppLink } from '../client'
import { siteConfig } from '../site.config'

const telHref = buildTelLink(siteConfig.phone)
const whatsAppHref = buildWhatsAppLink(siteConfig.whatsapp)
</script>