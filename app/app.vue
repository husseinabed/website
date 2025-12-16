<template>
  <div class="min-h-screen bg-white text-slate-900">
    <a href="#main-content" class="sr-only sr-only-focusable">تخطي إلى المحتوى</a>

    <SiteHeader />

    <main id="main-content" tabindex="-1">
      <NuxtPage />
    </main>

    <SiteFooter />

    <ChatWidget />
  </div>
</template>

<script setup lang="ts">
import ChatWidget from './components/ChatWidget.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
</script>
