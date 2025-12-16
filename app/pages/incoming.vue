<template>
  <div class="bg-white text-slate-900">
    <section class="border-b border-slate-200 bg-gradient-to-r from-white via-sky-50 to-white">
      <div class="reveal mx-auto max-w-5xl px-6 py-10">
        <p class="text-sm font-semibold text-sky-700">لوحة واتساب</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">الرسائل الواردة (Live)</h1>
        <p class="mt-2 text-slate-600">
          هذه الصفحة تتصل عبر WebSocket إلى <span class="font-mono">/api/whatsapp/incoming.ws</span> وتعرض الرسائل الواردة
          من Twilio فور وصولها.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-6 py-10 grid gap-8">
      <div class="reveal card border border-slate-200 p-6 space-y-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <h2 class="text-xl font-semibold text-slate-900">حالة الاتصال</h2>
            <p class="text-sm text-slate-600">
              الحالة:
              <span
                class="font-mono"
                :class="{
                  'text-emerald-700': status === 'open',
                  'text-amber-700': status === 'connecting',
                  'text-slate-600': status === 'idle' || status === 'closed',
                  'text-rose-700': status === 'error'
                }"
              >
                {{ status }}
              </span>
              <span v-if="lastMessage?.type" class="mx-2 text-slate-300">|</span>
              <span v-if="lastMessage?.type" class="text-xs text-slate-600">
                آخر رسالة: <span class="font-mono">{{ lastMessage.type }}</span>
              </span>
            </p>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button class="button-secondary" type="button" @click="connect">اتصال</button>
            <button class="button-secondary" type="button" @click="disconnect(1000, 'manual disconnect')">قطع الاتصال</button>
            <button class="button-secondary" type="button" @click="sendPing">ping</button>
            <button class="button-primary" type="button" @click="clear">مسح القائمة</button>
          </div>
        </div>

        <div v-if="error" class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          خطأ: <span class="font-mono">{{ String(error) }}</span>
        </div>

        <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed">
          <p class="font-semibold text-slate-900">ملاحظة أمنية</p>
          <p class="mt-1">
            هذه الصفحة تعرض بيانات واردة قد تحتوي على معلومات حساسة. يفضّل وضع حماية (Auth) قبل استخدامها في الإنتاج.
          </p>
        </div>
      </div>

      <div class="reveal flex items-center justify-between gap-3" style="--reveal-delay: 120ms">
        <div class="flex items-center gap-3">
          <div class="badge">عدد الرسائل: {{ incoming.length }}</div>
          <div class="text-xs text-slate-600">
            يتم الاحتفاظ بآخر <span class="font-mono">{{ maxMessages }}</span> رسالة في الذاكرة.
          </div>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold text-slate-700">بحث</label>
          <input
            v-model="q"
            class="w-56 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            placeholder="رقم / نص..."
          />
        </div>
      </div>

      <div class="grid gap-4">
        <article
          v-for="m in filtered"
          :key="m.messageSid + m.receivedAt"
          class="reveal card border border-slate-200 p-5"
          style="--reveal-delay: 80ms"
        >
          <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="badge">incoming</span>
                <span class="text-xs text-slate-500">
                  {{ formatTime(m.receivedAt) }}
                </span>
                <span class="text-xs text-slate-500">
                  SID: <span class="font-mono">{{ m.messageSid }}</span>
                </span>
              </div>

              <p class="text-sm text-slate-700">
                من: <span class="font-mono">{{ m.from }}</span>
                <span class="mx-2 text-slate-300">|</span>
                إلى: <span class="font-mono">{{ m.to }}</span>
                <span v-if="m.numMedia" class="mx-2 text-slate-300">|</span>
                <span v-if="m.numMedia" class="text-xs text-slate-600">NumMedia: <span class="font-mono">{{ m.numMedia }}</span></span>
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button class="button-secondary text-xs px-3 py-2" type="button" @click="copy(m.body)">نسخ النص</button>
              <button class="button-secondary text-xs px-3 py-2" type="button" @click="copy(m.from)">نسخ رقم المرسل</button>
            </div>
          </div>

          <div class="mt-4 rounded-lg border border-slate-200 bg-white p-4">
            <p class="text-slate-900 whitespace-pre-wrap break-words">{{ m.body }}</p>
          </div>
        </article>

        <div v-if="filtered.length === 0" class="reveal card border border-slate-200 p-6 text-center text-slate-600">
          لا توجد رسائل مطابقة.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useWhatsAppIncomingWs } from '../../composables/useWhatsAppIncomingWs'

definePageMeta({
  title: 'الرسائل الواردة (واتساب)',
  description: 'عرض مباشر للرسائل الواردة عبر WebSocket'
})

useHead({
  title: 'الرسائل الواردة (واتساب)',
  meta: [{ name: 'description', content: 'عرض مباشر للرسائل الواردة عبر WebSocket' }]
})

const q = ref('')
const maxMessages = 50

const { status, lastMessage, incoming, error, connect, disconnect, sendPing } = useWhatsAppIncomingWs({
  autoConnect: true,
  maxMessages
})

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase()
  if (!query) return incoming.value
  return incoming.value.filter((m) => {
    const hay = `${m.body}\n${m.from}\n${m.to}\n${m.messageSid}`.toLowerCase()
    return hay.includes(query)
  })
})

function clear() {
  incoming.value = []
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('he-IL', { hour12: false })
  } catch {
    return iso
  }
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // fallback: ignore
  }
}
</script>