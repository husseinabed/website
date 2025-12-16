<template>
  <div class="fixed bottom-4 left-4 z-50 sm:bottom-6 sm:left-6">
    <!-- Floating toggle button -->
    <button
      type="button"
      class="button-primary shadow-lg"
      :aria-label="copy.button.ariaLabel"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="panelId"
      @click="toggleOpen"
    >
      <span class="text-sm font-semibold">
        {{ isOpen ? copy.button.labelOpen : copy.button.labelClosed }}
      </span>
    </button>

    <!-- Overlay (mobile-first) -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-slate-900/40 sm:hidden"
      @click="close"
    />

    <!-- Panel -->
    <section
      v-if="isOpen"
      :id="panelId"
      ref="panelRef"
      class="card fixed bottom-20 left-4 z-50 w-[calc(100vw-2rem)] max-w-[420px] border border-slate-200 bg-white p-4 sm:bottom-24 sm:left-6 sm:w-[420px]"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="subtitleId"
      tabindex="-1"
      @keydown="onDialogKeydown"
    >
      <header class="mb-3 space-y-1">
        <h2 :id="titleId" class="text-lg font-semibold text-slate-900">
          {{ currentViewTitle }}
        </h2>
        <p v-if="currentViewSubtitle" :id="subtitleId" class="text-sm text-slate-600">
          {{ currentViewSubtitle }}
        </p>
      </header>

      <!-- Step content -->
      <div v-if="view === 'flow'" class="space-y-4">
        <!-- Step 1: service -->
        <div v-if="step === 1" class="space-y-3">
          <p class="text-sm font-semibold text-slate-800">
            {{ copy.steps.service.prompt }}
          </p>

          <div ref="servicesContainerRef" class="flex flex-wrap gap-2">
            <button
              v-for="service in serviceOptions"
              :key="service"
              type="button"
              class="rounded-full border px-3 py-1.5 text-sm font-semibold transition"
              :class="
                serviceSelection === service
                  ? 'border-sky-400 bg-sky-50 text-slate-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              "
              data-chat-service-option="true"
              @click="selectService(service)"
            >
              {{ service }}
            </button>

            <button
              v-if="hasOtherService"
              type="button"
              class="rounded-full border px-3 py-1.5 text-sm font-semibold transition"
              :class="
                isOtherSelected
                  ? 'border-sky-400 bg-sky-50 text-slate-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              "
              data-chat-service-option="true"
              @click="selectOtherService"
            >
              {{ copy.steps.service.otherOptionLabel }}
            </button>
          </div>

          <div v-if="isOtherSelected" class="grid gap-1">
            <input
              ref="otherServiceInputRef"
              v-model.trim="otherService"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              :placeholder="copy.steps.service.otherPlaceholder"
              :aria-invalid="serviceError ? 'true' : 'false'"
              :aria-describedby="serviceError ? serviceErrorId : undefined"
            />
          </div>

          <p v-if="serviceError" :id="serviceErrorId" class="text-sm text-red-600" role="status" aria-live="polite">
            {{ serviceError }}
          </p>

          <div class="flex items-center justify-end gap-2 pt-1">
            <button type="button" class="button-secondary" @click="goNextFromService">
              {{ copy.buttons.next }}
            </button>
          </div>
        </div>

        <!-- Step 2: preferred time -->
        <div v-else-if="step === 2" class="space-y-3">
          <p class="text-sm font-semibold text-slate-800">
            {{ copy.steps.time.prompt }}
          </p>

          <div class="grid gap-1">
            <input
              ref="timeInputRef"
              v-model.trim="preferredTime"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              :placeholder="copy.steps.time.placeholder"
              :aria-invalid="timeError ? 'true' : 'false'"
              :aria-describedby="timeError ? timeErrorId : undefined"
            />
          </div>

          <p v-if="timeError" :id="timeErrorId" class="text-sm text-red-600" role="status" aria-live="polite">
            {{ timeError }}
          </p>

          <div class="flex items-center justify-between gap-2 pt-1">
            <button type="button" class="button-secondary" @click="step = 1">
              {{ copy.buttons.back }}
            </button>
            <button type="button" class="button-primary" @click="goNextFromTime">
              {{ copy.buttons.next }}
            </button>
          </div>
        </div>

        <!-- Step 3: phone -->
        <div v-else class="space-y-3">
          <p class="text-sm font-semibold text-slate-800">
            {{ copy.steps.phone.prompt }}
          </p>

          <div class="grid gap-1">
            <input
              ref="phoneInputRef"
              v-model.trim="phone"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              class="field-ltr w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              :placeholder="copy.steps.phone.placeholder"
              :aria-invalid="phoneError ? 'true' : 'false'"
              :aria-describedby="phoneError ? phoneErrorId : undefined"
            />
          </div>

          <p v-if="phoneError" :id="phoneErrorId" class="text-sm text-red-600" role="status" aria-live="polite">
            {{ phoneError }}
          </p>

          <div class="flex items-center justify-between gap-2 pt-1">
            <button type="button" class="button-secondary" @click="step = 2">
              {{ copy.buttons.back }}
            </button>
            <button type="button" class="button-primary" :disabled="submitting" @click="finish">
              {{ submitting ? siteConfig.leadForm.buttons.submitting : copy.buttons.finish }}
            </button>
          </div>
        </div>
      </div>

      <!-- Completion -->
      <div v-else class="space-y-4">
        <p class="text-sm text-slate-700 whitespace-pre-line">
          {{ copy.completion.text }}
        </p>

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <a
            class="button-primary w-full text-center sm:w-auto"
            :href="whatsAppLink"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ copy.completion.whatsappButtonLabel }}
          </a>

          <button type="button" class="button-secondary w-full sm:w-auto" @click="reset">
            {{ copy.buttons.reset }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { buildWhatsAppLink } from '~/client'
import { siteConfig } from '~/site.config'

type ViewState = 'flow' | 'complete'

const route = useRoute()
const copy = siteConfig.chatWidget

const panelId = 'chat-widget-panel'
const titleId = 'chat-widget-title'
const subtitleId = 'chat-widget-subtitle'

const serviceErrorId = 'chat-widget-service-error'
const timeErrorId = 'chat-widget-time-error'
const phoneErrorId = 'chat-widget-phone-error'

const isOpen = ref(false)
const view = ref<ViewState>('flow')
const step = ref<1 | 2 | 3>(1)

const submitting = ref(false)

const serviceSelection = ref<string>('') // one of the service titles, or "__other__"
const otherService = ref<string>('')

const preferredTime = ref<string>('')
const phone = ref<string>('')

const serviceError = ref<string>('')
const timeError = ref<string>('')
const phoneError = ref<string>('')

const panelRef = ref<HTMLElement | null>(null)
const servicesContainerRef = ref<HTMLElement | null>(null)
const otherServiceInputRef = ref<HTMLInputElement | null>(null)
const timeInputRef = ref<HTMLInputElement | null>(null)
const phoneInputRef = ref<HTMLInputElement | null>(null)

const serviceOptions = computed(() => siteConfig.services.map((s) => s.title))

const hasOtherService = computed(() => Boolean(copy.steps.service.otherOptionLabel))
const isOtherSelected = computed(() => serviceSelection.value === '__other__')

const effectiveService = computed(() => {
  if (isOtherSelected.value) return otherService.value.trim()
  return serviceSelection.value.trim()
})

const whatsAppLink = computed(() => buildWhatsAppLink(siteConfig.whatsapp, renderTemplate(copy.whatsappMessageTemplate)))

const currentViewTitle = computed(() => {
  if (view.value === 'complete') return copy.completion.title
  if (step.value === 1) return copy.steps.service.title
  if (step.value === 2) return copy.steps.time.title
  return copy.steps.phone.title
})

const currentViewSubtitle = computed(() => {
  if (view.value === 'complete') return ''
  return copy.panel.subtitle ?? ''
})


function focusFirstServiceOption() {
  const root = servicesContainerRef.value
  if (!root) return
  const first = root.querySelector<HTMLElement>('button[data-chat-service-option="true"]')
  first?.focus()
}

function toggleOpen() {
  if (isOpen.value) close()
  else open()
}

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function reset() {
  view.value = 'flow'
  step.value = 1
  submitting.value = false

  serviceSelection.value = ''
  otherService.value = ''
  preferredTime.value = ''
  phone.value = ''

  serviceError.value = ''
  timeError.value = ''
  phoneError.value = ''

  nextTick(() => {
    focusFirstServiceOption()
  })
}

function selectService(service: string) {
  serviceSelection.value = service
  otherService.value = ''
  serviceError.value = ''
}

function selectOtherService() {
  serviceSelection.value = '__other__'
  serviceError.value = ''
  nextTick(() => otherServiceInputRef.value?.focus())
}

function validateServiceStep(): boolean {
  serviceError.value = ''
  const val = effectiveService.value
  if (!val) {
    serviceError.value = copy.validation.required
    return false
  }
  return true
}

function validateTimeStep(): boolean {
  timeError.value = ''
  if (!preferredTime.value.trim()) {
    timeError.value = copy.validation.required
    return false
  }
  return true
}

function cleanedDigits(input: string) {
  return input.replace(/[^\d]/g, '')
}

function isPhoneValid(input: string): boolean {
  const digits = cleanedDigits(input)
  return digits.length >= 6 && digits.length <= 18
}

function validatePhoneStep(): boolean {
  phoneError.value = ''
  const val = phone.value.trim()
  if (!val) {
    phoneError.value = copy.validation.required
    return false
  }
  if (!isPhoneValid(val)) {
    phoneError.value = copy.validation.phoneInvalid
    return false
  }
  return true
}

function goNextFromService() {
  if (!validateServiceStep()) return
  step.value = 2
  nextTick(() => timeInputRef.value?.focus())
}

function goNextFromTime() {
  if (!validateTimeStep()) return
  step.value = 3
  nextTick(() => phoneInputRef.value?.focus())
}

function resolveLeadService(): string {
  if (copy.lead.serviceMode === 'label') return (copy.lead.serviceLabel ?? '').trim() || effectiveService.value
  return effectiveService.value
}

function resolveLeadName(): string {
  const label = (copy.lead.nameLabel ?? '').trim()
  if (label === '{phone}') return phone.value.trim()
  return label || phone.value.trim()
}

function renderTemplate(template: string): string {
  const tokenMap: Record<string, string> = {
    clinicName: siteConfig.clinicName,
    city: siteConfig.city,
    service: effectiveService.value,
    time: preferredTime.value.trim(),
    phone: phone.value.trim()
  }

  return template.replace(/\{(\w+)\}/g, (_m, rawKey: string) => {
    const key = String(rawKey)
    return tokenMap[key] ?? `{${key}}`
  })
}

async function finish() {
  if (submitting.value) return

  if (!validateServiceStep()) {
    step.value = 1
    nextTick(() => (isOtherSelected.value ? otherServiceInputRef.value?.focus() : focusFirstServiceOption()))
    return
  }
  if (!validateTimeStep()) {
    step.value = 2
    nextTick(() => timeInputRef.value?.focus())
    return
  }
  if (!validatePhoneStep()) {
    step.value = 3
    nextTick(() => phoneInputRef.value?.focus())
    return
  }

  submitting.value = true
  try {
    await $fetch('/api/lead', {
      method: 'POST',
      body: {
        name: resolveLeadName(),
        phone: phone.value.trim(),
        service: resolveLeadService(),
        message: renderTemplate(copy.lead.messageTemplate),
        sourcePage: route.fullPath,
        hp: ''
      }
    })
  } catch {
    // Ignore errors for MVP: WhatsApp completion still works even if lead forwarding fails.
  } finally {
    submitting.value = false
    view.value = 'complete'
    nextTick(() => panelRef.value?.focus())
  }
}

function getFocusableElements(root: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ]
  return Array.from(root.querySelectorAll<HTMLElement>(selectors.join(','))).filter((el) => {
    const style = window.getComputedStyle(el)
    return style.display !== 'none' && style.visibility !== 'hidden'
  })
}

function onDialogKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }

  if (e.key !== 'Tab') return
  const root = panelRef.value
  if (!root) return

  const focusables = getFocusableElements(root)
  if (focusables.length === 0) return

  const first = focusables[0]!
  const last = focusables[focusables.length - 1]!
  const active = document.activeElement as HTMLElement | null

  if (e.shiftKey) {
    if (!active || active === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (!active || active === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

watch(isOpen, async (openNow) => {
  if (!openNow) return

  await nextTick()
  // Focus first meaningful control.
  if (view.value === 'complete') {
    panelRef.value?.focus()
    return
  }
  if (step.value === 1) {
    if (isOtherSelected.value) otherServiceInputRef.value?.focus()
    else focusFirstServiceOption()
    return
  }
  if (step.value === 2) {
    timeInputRef.value?.focus()
    return
  }
  phoneInputRef.value?.focus()
})

function onWindowKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  }
}

if (import.meta.client) {
  window.addEventListener('keydown', onWindowKeydown, { passive: false })
}

onBeforeUnmount(() => {
  if (!import.meta.client) return
  window.removeEventListener('keydown', onWindowKeydown as any)
})
</script>