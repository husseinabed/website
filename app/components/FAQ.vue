<template>
  <section class="mx-auto max-w-6xl px-6 py-14" aria-labelledby="faq-title">
    <header class="flex flex-col gap-3">
      <h2 id="faq-title" class="text-3xl font-bold text-slate-900">{{ siteConfig.faq.title }}</h2>
      <p class="max-w-2xl text-slate-600">
        {{ siteConfig.faq.intro }}
      </p>
    </header>

    <div class="mt-8 space-y-4">
      <details v-for="item in siteConfig.faq.items" :key="item.question" class="group card p-0">
        <summary
          class="cursor-pointer list-none rounded-2xl px-6 py-5 text-start font-semibold text-slate-900 focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sky-400 [&::-webkit-details-marker]:hidden"
        >
          <span class="flex items-center justify-between gap-4">
            <span>{{ item.question }}</span>
            <span
              class="shrink-0 text-sky-700 transition-transform duration-150 group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </span>
        </summary>

        <div class="px-6 pb-6 pt-0 text-slate-600">
          <p>{{ item.answer }}</p>
        </div>
      </details>
    </div>
  </section>
</template>

<script setup lang="ts">
import { siteConfig } from '../site.config'
</script>