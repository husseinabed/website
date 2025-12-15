<!-- @ts-nocheck -->
<template>
  <div class="bg-white text-slate-900">
    <section class="border-b border-slate-200 bg-gradient-to-r from-white via-sky-50 to-white">
      <div class="reveal mx-auto max-w-5xl px-6 py-10">
        <p class="text-sm font-semibold text-sky-700">{{ ar.booking.headerKicker }}</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">{{ ar.booking.title }}</h1>
        <p class="mt-2 text-slate-600">{{ ar.booking.subtitle }}</p>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-6 py-10">
      <div class="flex flex-col gap-6">
        <div class="reveal grid gap-3 md:grid-cols-4" style="--reveal-delay: 80ms">
          <div
            v-for="(step, idx) in steps"
            :key="step.id"
            class="flex items-center gap-3 rounded-lg border px-3 py-3"
            :class="idx === currentStep ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-white'"
          >
            <div
              class="flex h-9 w-9 items-center justify-center rounded-full border"
              :class="idx <= currentStep ? 'border-sky-500 bg-sky-100 text-sky-700' : 'border-slate-200 text-slate-500'"
            >
              {{ idx + 1 }}
            </div>
            <div>
              <p class="text-sm font-semibold" :class="idx === currentStep ? 'text-sky-800' : 'text-slate-700'">
                {{ step.label }}
              </p>
              <p class="text-xs text-slate-500">{{ step.helper }}</p>
            </div>
          </div>
        </div>

        <div class="reveal card border border-slate-200 p-6" style="--reveal-delay: 140ms">
          <component
            :is="activeComponent"
            :model-value="form"
            @update:modelValue="(v) => Object.assign(form, v)"
            :errors="errors"
          />

          <!-- WhatsApp quick CTA (no redesign): sends a prefilled message with current selections -->
          <div class="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p class="text-sm font-semibold text-slate-900">{{ ar.booking.whatsappQuickCta.title }}</p>
            <p class="mt-1 text-sm text-slate-700">{{ ar.booking.whatsappQuickCta.subtitle }}</p>
            <a :href="whatsAppPrefillHref" class="button-secondary mt-3 w-full text-center" target="_blank" rel="noopener">
              {{ ar.booking.whatsappQuickCta.button }}
            </a>
          </div>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              class="button-secondary w-full sm:w-auto"
              :disabled="currentStep === 0 || loading"
              @click="prev"
            >
              {{ ar.booking.buttons.back }}
            </button>
            <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button
                v-if="!isLastStep"
                type="button"
                class="button-primary w-full sm:w-auto"
                :disabled="loading"
                @click="next"
              >
                {{ ar.booking.buttons.continue }}
              </button>
              <button
                v-else
                type="button"
                class="button-primary w-full sm:w-auto"
                :disabled="loading"
                @click="submit"
              >
                {{ loading ? ar.booking.buttons.submitting : ar.booking.buttons.submit }}
              </button>
            </div>
          </div>
          <p v-if="submitError" class="mt-4 text-sm text-red-600">{{ submitError }}</p>
          <p v-if="submitSuccess" class="mt-4 text-sm text-green-600">{{ ar.booking.success }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { reactive, computed, ref, defineAsyncComponent } from 'vue'
import { z } from 'zod'
import { client, buildWhatsAppLink } from '../app/client'
import { ar } from '../app/content/ar'

// @ts-expect-error Nuxt macro auto-imported
definePageMeta({
  title: ar.seo.book.title,
  description: ar.seo.book.description
})

// @ts-expect-error Nuxt macro auto-imported
useHead({
  title: ar.seo.book.title,
  meta: [{ name: 'description', content: ar.seo.book.description }]
})

const steps = ar.booking.steps

type StepId = 'service' | 'time' | 'contact' | 'confirm'

const form = reactive({
  service_type: '',
  preferred_date: '',
  preferred_time_range: '',
  full_name: '',
  phone_whatsapp: '',
  email: '',
  message: '',
  consent_contact: false,
  locale: 'ar'
})

const errors = reactive<Record<string, string>>({})
const currentStep = ref(0)
const loading = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)

const allowedServices = client.services as unknown as [string, ...string[]]

const serviceSchema = z.object({
  service_type: z.enum(allowedServices)
})

const timeSchema = z.object({
  preferred_date: z.string().min(1, ar.booking.timeStep.errors.dateRequired),
  preferred_time_range: z.enum(['morning', 'afternoon', 'evening'], { message: ar.booking.timeStep.errors.timeRequired })
})

const contactSchema = z.object({
  full_name: z.string().min(2, 'الاسم مطلوب'),
  phone_whatsapp: z.string().min(6, 'رقم الهاتف/واتساب مطلوب'),
  email: z.string().email('بريد غير صالح').optional().or(z.literal('')),
  message: z.string().optional()
})

const confirmSchema = z.object({
  consent_contact: z.literal(true)
})

const stepComponents: Record<StepId, any> = {
  service: defineAsyncComponent(() => Promise.resolve(ServiceStep)),
  time: defineAsyncComponent(() => Promise.resolve(TimeStep)),
  contact: defineAsyncComponent(() => Promise.resolve(ContactStep)),
  confirm: defineAsyncComponent(() => Promise.resolve(ConfirmStep))
}

const activeComponent = computed(() => stepComponents[steps[currentStep.value].id])
const isLastStep = computed(() => currentStep.value === steps.length - 1)

const preferredTimeLabel = computed(() => {
  const found = ar.booking.timeStep.timeOptions.find((o) => o.value === (form.preferred_time_range as any))
  return found?.label
})

const whatsAppPrefillHref = computed(() => {
  const text = ar.booking.whatsappPrefill({
    serviceLabel: form.service_type || undefined,
    preferredDate: form.preferred_date || undefined,
    preferredTimeLabel: preferredTimeLabel.value || undefined,
    fullName: form.full_name || undefined,
    phone: form.phone_whatsapp || undefined,
    message: form.message || undefined
  })
  return buildWhatsAppLink(client.whatsapp, text)
})

function validateStep(idx: number): boolean {
  errorsReset()
  try {
    if (idx === 0) serviceSchema.parse(form)
    if (idx === 1) timeSchema.parse(form)
    if (idx === 2) contactSchema.parse(form)
    if (idx === 3) confirmSchema.parse(form)
    return true
  } catch (err) {
    if (err instanceof z.ZodError) {
      for (const issue of err.issues) {
        const path = issue.path[0] as string
        errors[path] = issue.message
      }
    }
    return false
  }
}

function errorsReset() {
  Object.keys(errors).forEach((k) => delete errors[k])
}

function next() {
  if (validateStep(currentStep.value)) {
    currentStep.value = Math.min(currentStep.value + 1, steps.length - 1)
  }
}

function prev() {
  currentStep.value = Math.max(currentStep.value - 1, 0)
}

async function submit() {
  submitError.value = ''
  submitSuccess.value = false
  if (!validateStep(currentStep.value)) return
  loading.value = true
  try {
    const payload = {
      full_name: form.full_name,
      phone_whatsapp: form.phone_whatsapp,
      email: form.email || undefined,
      service_type: form.service_type,
      preferred_date: form.preferred_date,
      preferred_time_range: form.preferred_time_range,
      message: form.message || undefined,
      consent_contact: form.consent_contact,
      locale: form.locale
    }
    await $fetch('/api/leads/create', { method: 'POST', body: payload })
    submitSuccess.value = true
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/book/success'
      }
    }, 600)
  } catch (e: any) {
    submitError.value = e?.data?.message || ar.booking.errors.submitFailed
  } finally {
    loading.value = false
  }
}
</script>

<script lang="ts">
import { ar as arContent } from '../app/content/ar'

/**
 * Inline lightweight components for each step to avoid separate files.
 */
const ServiceStep = {
  props: ['modelValue', 'errors'],
  emits: ['update:modelValue'],
  template: `
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">${arContent.booking.serviceStep.title}</h2>
      <p class="text-slate-600">${arContent.booking.serviceStep.subtitle}</p>
      <div class="grid gap-3 md:grid-cols-2">
        <label class="card cursor-pointer border p-4 hover:border-sky-300" v-for="option in options" :key="option.value">
          <input
            class="sr-only"
            type="radio"
            name="service"
            :value="option.value"
            :checked="modelValue.service_type === option.value"
            @change="$emit('update:modelValue', { ...modelValue, service_type: option.value })"
          />
          <div class="flex items-start gap-3">
            <div class="mt-1 h-2 w-2 rounded-full" :class="modelValue.service_type === option.value ? 'bg-sky-600' : 'bg-slate-300'" />
            <div>
              <p class="font-semibold text-slate-900">{{ option.label }}</p>
              <p class="text-sm text-slate-600">{{ option.desc }}</p>
            </div>
          </div>
        </label>
      </div>
      <p v-if="errors.service_type" class="text-sm text-red-600">{{ errors.service_type }}</p>
    </div>
  `,
  data() {
    return {
      options: arContent.booking.serviceStep.options
    }
  }
}

const TimeStep = {
  props: ['modelValue', 'errors'],
  emits: ['update:modelValue'],
  template: `
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">${arContent.booking.timeStep.title}</h2>
      <p class="text-slate-600">${arContent.booking.timeStep.subtitle}</p>
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="block text-sm font-semibold text-slate-800">${arContent.booking.timeStep.dateLabel}</label>
          <input
            type="date"
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
            :value="modelValue.preferred_date"
            @input="$emit('update:modelValue', { ...modelValue, preferred_date: $event.target.value })"
          />
          <p v-if="errors.preferred_date" class="text-sm text-red-600">{{ errors.preferred_date }}</p>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-800">${arContent.booking.timeStep.timeLabel}</label>
          <select
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
            :value="modelValue.preferred_time_range"
            @change="$emit('update:modelValue', { ...modelValue, preferred_time_range: $event.target.value })"
          >
            <option v-for="opt in timeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <p v-if="errors.preferred_time_range" class="text-sm text-red-600">{{ errors.preferred_time_range }}</p>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      timeOptions: arContent.booking.timeStep.timeOptions
    }
  }
}

const ContactStep = {
  props: ['modelValue', 'errors'],
  emits: ['update:modelValue'],
  template: `
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">${arContent.booking.contactStep.title}</h2>
      <p class="text-slate-600">${arContent.booking.contactStep.subtitle}</p>
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="block text-sm font-semibold text-slate-800">${arContent.booking.contactStep.nameLabel}</label>
          <input
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
            :value="modelValue.full_name"
            @input="$emit('update:modelValue', { ...modelValue, full_name: $event.target.value })"
          />
          <p v-if="errors.full_name" class="text-sm text-red-600">{{ errors.full_name }}</p>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-800">${arContent.booking.contactStep.phoneLabel}</label>
          <input
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
            :value="modelValue.phone_whatsapp"
            @input="$emit('update:modelValue', { ...modelValue, phone_whatsapp: $event.target.value })"
          />
          <p v-if="errors.phone_whatsapp" class="text-sm text-red-600">{{ errors.phone_whatsapp }}</p>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-800">${arContent.booking.contactStep.emailLabel}</label>
          <input
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
            :value="modelValue.email"
            @input="$emit('update:modelValue', { ...modelValue, email: $event.target.value })"
          />
          <p v-if="errors.email" class="text-sm text-red-600">{{ errors.email }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-slate-800">${arContent.booking.contactStep.messageLabel}</label>
          <textarea
            rows="3"
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
            :value="modelValue.message"
            @input="$emit('update:modelValue', { ...modelValue, message: $event.target.value })"
          />
        </div>
      </div>
    </div>
  `
}

const ConfirmStep = {
  props: ['modelValue', 'errors'],
  emits: ['update:modelValue'],
  template: `
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">${arContent.booking.confirmStep.title}</h2>
      <p class="text-slate-600">${arContent.booking.confirmStep.subtitle}</p>
      <label class="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
        <input
          type="checkbox"
          class="mt-1 h-4 w-4"
          :checked="modelValue.consent_contact"
          @change="$emit('update:modelValue', { ...modelValue, consent_contact: $event.target.checked })"
        />
        <span class="text-sm text-slate-800">
          ${arContent.booking.confirmStep.consentText}
        </span>
      </label>
      <p v-if="errors.consent_contact" class="text-sm text-red-600">{{ errors.consent_contact }}</p>
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p class="text-sm font-semibold text-slate-900">${arContent.booking.confirmStep.whatNextTitle}</p>
        <ul class="mt-2 space-y-1 text-sm text-slate-700">
          <li v-for="line in whatNextBullets" :key="line">• {{ line }}</li>
        </ul>
      </div>
    </div>
  `,
  data() {
    return {
      whatNextBullets: arContent.booking.confirmStep.whatNextBullets
    }
  }
}
</script>