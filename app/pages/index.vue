<!-- @ts-nocheck -->
<template>
  <div class="bg-white text-slate-900">
    <section class="relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-white">
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(0,127,255,0.08),transparent_30%)]"
      />
      <div class="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:py-24">
        <div class="flex-1 space-y-6">
          <div
            class="reveal inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-sky-700 shadow-sm ring-1 ring-sky-100 backdrop-blur"
          >
            <span>{{ ar.home.hero.badgeLeft }}</span>
            <span class="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
            <span>{{ ar.home.hero.badgeRight }}</span>
          </div>

          <div class="reveal space-y-4" style="--reveal-delay: 80ms">
            <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {{ ar.home.hero.headline }}
            </h1>
            <p class="max-w-2xl text-lg text-slate-600">
              {{ ar.home.hero.subheadline }}
            </p>
          </div>

          <div class="reveal flex flex-col gap-3 sm:flex-row sm:items-center" style="--reveal-delay: 160ms">
            <NuxtLink to="/book" class="button-primary">{{ ar.home.hero.ctas.primary }}</NuxtLink>
            <a :href="whatsAppHref" class="button-secondary" target="_blank" rel="noopener">
              {{ ar.home.hero.ctas.secondary }}
            </a>
          </div>

          <div class="reveal flex flex-wrap gap-3 text-sm text-slate-600" style="--reveal-delay: 240ms">
            <div v-for="item in ar.home.hero.highlights" :key="item" class="badge">{{ item }}</div>
          </div>
        </div>

        <div class="flex-1">
          <figure class="reveal home-hero__media" style="--reveal-delay: 120ms">
            <img
              src="/images/hero.png"
              class="home-hero__image"
              alt="صورة تعبيرية لعيادة الأسنان"
              width="1600"
              height="1000"
              loading="eager"
              decoding="async"
            />
            <figcaption class="home-hero__caption">
              <span class="home-hero__captionTitle">{{ ar.home.hero.headline }}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="home-services mx-auto max-w-6xl px-6 py-14" aria-labelledby="home-services-title">
      <header class="reveal flex flex-col gap-3">
        <h2 id="home-services-title" class="text-3xl font-bold text-slate-900">{{ ar.home.services.title }}</h2>
        <p class="max-w-2xl text-slate-600">{{ ar.home.services.subtitle }}</p>
      </header>

      <div class="home-services__grid">
        <article
          v-for="(card, idx) in ar.home.services.cards.slice(0, 3)"
          :key="card.title"
          class="reveal service-card card"
          :style="{ '--reveal-delay': `${idx * 90}ms` }"
        >
          <img
            :src="`/images/service-${idx + 1}.png`"
            class="service-card__image"
            :alt="card.title"
            width="900"
            height="675"
            loading="lazy"
            decoding="async"
          />
          <div class="service-card__body">
            <div class="badge mb-3">{{ ar.servicesPage.title }}</div>
            <h3 class="text-xl font-semibold text-slate-900">{{ card.title }}</h3>
            <p class="mt-2 text-slate-600">{{ card.desc }}</p>
          </div>
        </article>
      </div>

      <div class="mt-6">
        <NuxtLink to="/services" class="text-sm font-semibold text-sky-700 hover:text-sky-900">
          {{ ar.home.services.linkToAll }} ←
        </NuxtLink>
      </div>
    </section>

    <!-- About (intro / bio / story) -->
    <section class="mx-auto max-w-6xl px-6 py-14">
      <div class="grid gap-8 lg:grid-cols-3 lg:items-start">
        <div class="reveal space-y-3">
          <h2 class="text-3xl font-bold text-slate-900">{{ ar.home.about.title }}</h2>
          <p class="text-slate-600">{{ ar.home.about.intro }}</p>
        </div>

        <div class="reveal card border border-slate-200 p-6 lg:col-span-2" style="--reveal-delay: 120ms">
          <p class="text-sm font-semibold text-slate-900">{{ client.clinic_name }}</p>
          <p class="mt-1 text-sm text-slate-600">{{ client.doctor_name }} • {{ client.city }}</p>

          <ul class="mt-4 space-y-2 text-slate-700">
            <li v-for="line in ar.home.about.story" :key="line" class="flex items-start gap-3">
              <span class="mt-2 h-2 w-2 rounded-full bg-sky-500" aria-hidden="true" />
              <span>{{ line }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="bg-sky-50">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <div class="reveal flex flex-col gap-3">
          <h2 class="text-3xl font-bold text-slate-900">{{ ar.home.howItWorks.title }}</h2>
          <p class="max-w-2xl text-slate-600">{{ ar.home.howItWorks.subtitle }}</p>
        </div>
        <div class="mt-8 grid gap-6 md:grid-cols-3">
          <div
            v-for="(step, idx) in ar.home.howItWorks.steps"
            :key="step.title"
            class="reveal card p-6"
            :style="{ '--reveal-delay': `${idx * 90}ms` }"
          >
            <div class="badge mb-3">الخطوة {{ idx + 1 }}</div>
            <h3 class="text-xl font-semibold text-slate-900">{{ step.title }}</h3>
            <p class="mt-2 text-slate-600">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-14">
      <div class="reveal flex flex-col gap-3">
        <h2 class="text-3xl font-bold text-slate-900">{{ ar.home.socialProof.title }}</h2>
        <p class="max-w-2xl text-slate-600">{{ ar.home.socialProof.note }}</p>
      </div>
      <div class="reveal mt-6 flex flex-wrap gap-3" style="--reveal-delay: 120ms">
        <div v-for="b in ar.home.socialProof.bullets" :key="b" class="badge">{{ b }}</div>
      </div>
    </section>

    <section class="bg-slate-900 text-white">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <div class="reveal flex flex-col gap-3">
          <h2 class="text-3xl font-bold">اسأل عن الأسعار، التأمين، أو العناية بعد الإجراء</h2>
          <p class="max-w-3xl text-slate-100/80">
            نجيب عن الأسئلة العامة عبر واتساب ضمن ضوابط السلامة: لا تشخيص طبي، لا نصائح طوارئ، وتحويل مباشر للطاقم عند
            الحاجة.
          </p>
        </div>
        <div class="reveal mt-6 flex flex-col gap-3 sm:flex-row sm:items-center" style="--reveal-delay: 120ms">
          <a :href="whatsAppHref" class="button-primary" target="_blank" rel="noopener">{{ ar.global.ctas.whatsapp }}</a>
          <NuxtLink to="/contact" class="button-secondary">{{ ar.nav.contact }}</NuxtLink>
        </div>
        <p class="reveal mt-4 text-sm text-slate-200/80" style="--reveal-delay: 180ms">
          تنبيه: في حالات الطوارئ أو الألم الشديد، الرجاء الاتصال بالعيادة مباشرة.
        </p>
      </div>
    </section>

    <section class="bg-sky-600 text-white">
      <div class="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="reveal">
          <h3 class="text-2xl font-bold">{{ ar.home.ctaStrip.title }}</h3>
          <p class="text-sky-100">{{ ar.home.ctaStrip.subtitle }}</p>
        </div>
        <div class="reveal flex flex-col gap-3 sm:flex-row" style="--reveal-delay: 120ms">
          <NuxtLink to="/book" class="button-secondary bg-white text-sky-700">{{ ar.home.ctaStrip.primary }}</NuxtLink>
          <a :href="whatsAppHref" class="button-secondary border-white text-white" target="_blank" rel="noopener">
            {{ ar.home.ctaStrip.secondary }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { client, buildWhatsAppLink } from '../app/client'
import { ar } from '../app/content/ar'

const whatsAppHref = buildWhatsAppLink(client.whatsapp)

// @ts-expect-error Nuxt macro auto-imported
definePageMeta({
  title: ar.seo.home.title,
  description: ar.seo.home.description
})

// @ts-expect-error Nuxt macro auto-imported
useHead({
  title: ar.seo.home.title,
  meta: [{ name: 'description', content: ar.seo.home.description }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': ['MedicalBusiness', 'Dentist'],
        name: client.clinic_name,
        url: 'https://brandi-dental.co.il/',
        description: ar.seo.home.description,
        areaServed: client.city,
        address: {
          '@type': 'PostalAddress',
          streetAddress: client.address.line1,
          addressLocality: client.address.city,
          addressCountry: client.address.country
        },
        medicalSpecialty: ['Dentistry']
      })
    }
  ]
})
</script>