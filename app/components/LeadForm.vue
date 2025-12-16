<template>
  <section class="card border border-slate-200 p-6" aria-labelledby="lead-form-title">
    <header class="space-y-1">
      <h2 id="lead-form-title" class="text-2xl font-semibold text-slate-900">
        {{ copy.title }}
      </h2>
      <p v-if="copy.subtitle" class="text-sm text-slate-600">
        {{ copy.subtitle }}
      </p>
    </header>

    <form class="mt-6 grid gap-4" novalidate @submit.prevent="onSubmit">
      <div class="grid gap-1">
        <label class="block text-sm font-semibold text-slate-800" :for="fieldIds.name">
          {{ copy.fields.nameLabel }}
        </label>
        <input
          :id="fieldIds.name"
          v-model.trim="form.name"
          type="text"
          autocomplete="name"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
          :placeholder="copy.fields.namePlaceholder"
          :aria-invalid="Boolean(errors.name)"
          :aria-describedby="errors.name ? errorIds.name : undefined"
          required
        />
        <p v-if="errors.name" :id="errorIds.name" class="text-sm text-red-600">
          {{ errors.name }}
        </p>
      </div>

      <div class="grid gap-1">
        <label class="block text-sm font-semibold text-slate-800" :for="fieldIds.phone">
          {{ copy.fields.phoneLabel }}
        </label>
        <input
          :id="fieldIds.phone"
          v-model.trim="form.phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          class="field-ltr w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
          :placeholder="copy.fields.phonePlaceholder"
          :aria-invalid="Boolean(errors.phone)"
          :aria-describedby="errors.phone ? errorIds.phone : undefined"
          required
        />
        <p v-if="errors.phone" :id="errorIds.phone" class="text-sm text-red-600">
          {{ errors.phone }}
        </p>
      </div>

      <div class="grid gap-1">
        <label class="block text-sm font-semibold text-slate-800" :for="fieldIds.service">
          {{ copy.fields.serviceLabel }}
        </label>
        <select
          :id="fieldIds.service"
          v-model="form.service"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
          :aria-invalid="Boolean(errors.service)"
          :aria-describedby="errors.service ? errorIds.service : undefined"
          required
        >
          <option value="" disabled>
            {{ copy.fields.servicePlaceholder }}
          </option>
          <option v-for="service in serviceOptions" :key="service" :value="service">
            {{ service }}
          </option>
        </select>
        <p v-if="errors.service" :id="errorIds.service" class="text-sm text-red-600">
          {{ errors.service }}
        </p>
      </div>

      <div class="grid gap-1">
        <label class="block text-sm font-semibold text-slate-800" :for="fieldIds.message">
          {{ copy.fields.messageLabel }}
        </label>
        <textarea
          :id="fieldIds.message"
          v-model.trim="form.message"
          rows="4"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
          :placeholder="copy.fields.messagePlaceholder"
        />
      </div>

      <!-- Honeypot (hidden from users) -->
      <div class="sr-only" aria-hidden="true">
        <label :for="fieldIds.hp">{{ copy.fields.hpLabel }}</label>
        <input
          :id="fieldIds.hp"
          v-model="form.hp"
          type="text"
          name="hp"
          tabindex="-1"
          autocomplete="off"
          aria-hidden="true"
        />
      </div>

      <div class="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          v-if="statusMessage"
          class="text-sm"
          role="status"
          aria-live="polite"
          :class="status === 'success' ? 'text-green-700' : 'text-red-600'"
        >
          {{ statusMessage }}
        </p>

        <button type="submit" class="button-primary w-full sm:w-auto" :disabled="loading">
          {{ loading ? copy.buttons.submitting : copy.buttons.submit }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { siteConfig } from '~/site.config'

const props = defineProps<{
  sourcePage: string
}>()

const copy = siteConfig.leadForm

const fieldIds = {
  name: 'lead-name',
  phone: 'lead-phone',
  service: 'lead-service',
  message: 'lead-message',
  hp: 'lead-hp'
} as const

const errorIds = {
  name: 'lead-name-error',
  phone: 'lead-phone-error',
  service: 'lead-service-error'
} as const

const serviceOptions = computed(() => siteConfig.services.map((s) => s.title))

const form = reactive({
  name: '',
  phone: '',
  service: '',
  message: '',
  hp: ''
})

const errors = reactive<Record<'name' | 'phone' | 'service', string | ''>>({
  name: '',
  phone: '',
  service: ''
})

const loading = ref(false)
const status = ref<'idle' | 'success' | 'error'>('idle')

const statusMessage = computed(() => {
  if (status.value === 'success') return copy.status.success
  if (status.value === 'error') return copy.status.error
  return ''
})

function resetErrors() {
  errors.name = ''
  errors.phone = ''
  errors.service = ''
}

function validate(): boolean {
  resetErrors()

  if (!form.name) errors.name = copy.validation.nameRequired
  if (!form.phone) errors.phone = copy.validation.phoneRequired
  if (!form.service) errors.service = copy.validation.serviceRequired

  return !errors.name && !errors.phone && !errors.service
}

async function onSubmit() {
  status.value = 'idle'
  if (!validate()) return

  loading.value = true
  try {
    const res = await $fetch('/api/lead', {
      method: 'POST',
      body: {
        name: form.name,
        phone: form.phone,
        service: form.service,
        message: form.message,
        sourcePage: props.sourcePage,
        hp: form.hp
      }
    })

    if ((res as any)?.ok) {
      status.value = 'success'
    } else {
      status.value = 'error'
    }
  } catch {
    status.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>