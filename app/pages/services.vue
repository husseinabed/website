<!-- @ts-nocheck -->
<template>
  <div class="bg-white text-slate-900">
    <section class="border-b border-slate-200 bg-gradient-to-r from-white via-sky-50 to-white">
      <div class="reveal mx-auto max-w-5xl px-6 py-10">
        <p class="text-sm font-semibold text-sky-700">{{ ar.servicesPage.title }}</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">{{ ar.servicesPage.title }}</h1>
        <p class="mt-2 text-slate-600">{{ ar.servicesPage.subtitle }}</p>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-6 py-10">
      <div class="reveal flex flex-col gap-3">
        <h2 class="text-2xl font-bold text-slate-900">{{ ar.servicesPage.listTitle }}</h2>
        <p class="text-sm text-slate-600">{{ ar.servicesPage.note }}</p>
      </div>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <div
          v-for="(service, idx) in client.services"
          :key="service"
          class="reveal card border border-slate-200 p-5"
          :style="{ '--reveal-delay': `${Math.min(idx, 5) * 80}ms` }"
        >
          <div class="flex items-start gap-3">
            <div class="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" aria-hidden="true" />
            <div>
              <p class="text-lg font-semibold text-slate-900">{{ service }}</p>
              <p class="mt-1 text-sm text-slate-600">
                {{ serviceDesc(service) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="reveal mt-10 card border border-slate-200 p-6 bg-slate-50" style="--reveal-delay: 120ms">
        <div class="flex flex-col gap-2">
          <h3 class="text-xl font-bold text-slate-900">{{ ar.servicesPage.cta.title }}</h3>
          <p class="text-slate-600">{{ ar.servicesPage.cta.subtitle }}</p>
        </div>
        <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a :href="whatsAppHref" class="button-primary" target="_blank" rel="noopener">
            {{ ar.servicesPage.cta.primary }}
          </a>
          <NuxtLink to="/book" class="button-secondary">
            {{ ar.servicesPage.cta.secondary }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { client, buildWhatsAppLink } from '../app/client'
import { ar } from '../app/content/ar'

// @ts-expect-error Nuxt macro auto-imported
definePageMeta({
  title: ar.seo.services.title,
  description: ar.seo.services.description
})

// @ts-expect-error Nuxt macro auto-imported
useHead({
  title: ar.seo.services.title,
  meta: [{ name: 'description', content: ar.seo.services.description }]
})

const whatsAppHref = buildWhatsAppLink(client.whatsapp)

function serviceDesc(label: string): string {
  switch (label) {
    case 'تنظيف الأسنان':
      return 'تنظيف لطيف وإزالة الجير والتصبغات مع نصائح عناية منزلية.'
    case 'تبييض الأسنان':
      return 'تبييض تدريجي وآمن مع مراعاة الحساسية وخيارات تناسبك.'
    case 'حشوات تجميلية':
      return 'ترميمات تجميلية للحفاظ على الشكل والوظيفة وتقليل تسوس المستقبل.'
    case 'تقويم الأسنان':
      return 'خيارات تقويم حسب الحالة مع متابعة دورية وخطة واضحة.'
    case 'زراعة الأسنان':
      return 'تعويض ثابت بخطة علاجية وتقييم شامل قبل البدء.'
    case 'علاج العصب':
      return 'علاج يهدف لتخفيف الألم والحفاظ على السن عند الحاجة.'
    case 'خلع الأسنان':
      return 'خلع آمن مع إرشادات عناية بعد الإجراء وتقليل الانزعاج قدر الإمكان.'
    case 'عدسات الأسنان':
      return 'خيار تجميلي لتحسين شكل الابتسامة مع تقييم الملاءمة لكل حالة.'
    case 'فحص دوري':
      return 'فحص شامل وخطة وقاية وعلاج مبكر لتقليل المفاجآت.'
    default:
      return 'خدمة أسنان ضمن خطة علاج واضحة وبمتابعة عند الحاجة.'
  }
}
</script>