<template>
  <section class="mx-auto max-w-6xl px-6 py-12" aria-labelledby="trust-badges-title">
    <header class="flex flex-col gap-2">
      <h2 id="trust-badges-title" class="text-2xl font-bold text-slate-900">{{ siteConfig.trust.title }}</h2>
      <p class="max-w-2xl text-slate-600">{{ siteConfig.trust.subtitle }}</p>
    </header>

    <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
      <li v-for="item in siteConfig.trust.items" :key="item.title" class="card p-5">
        <div class="flex items-start gap-3">
          <span class="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-700" aria-hidden="true">
            ✓
          </span>
          <div>
            <h3 class="text-base font-semibold text-slate-900">{{ item.title }}</h3>
            <p class="mt-1 text-sm text-slate-600">{{ item.description }}</p>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { siteConfig } from '../site.config'
</script>