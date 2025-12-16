export type ClientAddress = {
  line1: string
  city: string
  country: string
}

export type ClientIntake = {
  clinic_name: string
  doctor_name: string
  city: string
  phone: string
  whatsapp: string
  email: string
  address: ClientAddress
  google_maps_url: string
  services: string[]
}

/**
 * Demo/sample client intake (invented clinic info).
 * Arabic (ar) is the primary locale for this project.
 */
export const client: ClientIntake = {
  clinic_name: 'عيادة براندي لطب الأسنان',
  doctor_name: 'د. أحمد',
  city: 'حيفا',
  phone: '+14155238886',
  whatsapp: '+14155238886',
  email: 'abed@brandi-dental.example',
  address: {
    line1: 'شارع هرتسل 10',
    city: 'حيفا',
    country: 'Israel'
  },
  google_maps_url: 'https://maps.google.com/?q=Haifa',
  services: [
    'تنظيف الأسنان',
    'تبييض الأسنان',
    'حشوات تجميلية',
    'تقويم الأسنان',
    'زراعة الأسنان',
    'علاج العصب',
    'خلع الأسنان',
    'عدسات الأسنان',
    'فحص دوري'
  ]
}

export function formatClientAddress(input: Pick<ClientIntake, 'address'>): string {
  const { line1, city, country } = input.address
  return `${line1}، ${city}، ${country}`
}

/**
 * WhatsApp "wa.me" requires digits only, country code included, without "+".
 */
export function toWaMePhone(phone: string): string {
  return phone.replace(/[^\d]/g, '')
}

export function buildWhatsAppLink(phone: string, text?: string): string {
  const waPhone = toWaMePhone(phone)
  if (!text) return `https://wa.me/${waPhone}`
  return `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`
}

export function buildTelLink(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '')
  return `tel:${cleaned}`
}

export function buildMailtoLink(email: string, opts?: { subject?: string; body?: string }): string {
  const params = new URLSearchParams()
  if (opts?.subject) params.set('subject', opts.subject)
  if (opts?.body) params.set('body', opts.body)

  const query = params.toString()
  return query ? `mailto:${email}?${query}` : `mailto:${email}`
}

export function buildMapsLink(googleMapsUrl: string): string {
  return googleMapsUrl
}

/**
 * Scroll reveal
 * - CSS handles animation; JS only toggles `.is-visible` via IntersectionObserver.
 * - Automatically re-scans on DOM changes (route navigations/hydration) via MutationObserver.
 * - Honors prefers-reduced-motion by revealing immediately with no observer.
 */
type ScrollRevealOptions = {
  rootMargin?: string
  threshold?: number | number[]
}

const REVEAL_SELECTOR = '.reveal'
const REVEAL_VISIBLE_CLASS = 'is-visible'
const SCROLL_REVEAL_GLOBAL_KEY = '__nuxtScrollRevealInitialized__'

const SCROLL_REVEAL_DEBUG = import.meta.dev
function srDebug(message: string, data?: Record<string, unknown>) {
  if (!SCROLL_REVEAL_DEBUG) return
  // Keep logs compact but actionable for hydration mismatch diagnosis.
  // eslint-disable-next-line no-console
  console.debug(`[scroll-reveal] ${message}`, data ?? {})
}

function revealMarkVisible(el: Element) {
  el.classList.add(REVEAL_VISIBLE_CLASS)
}

function revealAllVisible(root: ParentNode = document) {
  const els = Array.from(root.querySelectorAll(REVEAL_SELECTOR))
  srDebug('revealAllVisible()', {
    count: els.length,
    readyState: document.readyState,
    time: Math.round(performance.now()),
    sampleClassNames: els.slice(0, 3).map((e) => (e as HTMLElement).className)
  })
  els.forEach(revealMarkVisible)
}

export function initScrollReveal(options: ScrollRevealOptions = {}) {
  if (!import.meta.client) return

  srDebug('initScrollReveal() called', {
    readyState: document.readyState,
    time: Math.round(performance.now())
  })

  const w = window as unknown as Record<string, unknown>
  if (w[SCROLL_REVEAL_GLOBAL_KEY]) {
    srDebug('skipping: already initialized', {})
    return
  }
  w[SCROLL_REVEAL_GLOBAL_KEY] = true

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  srDebug('environment', {
    prefersReducedMotion,
    hasIntersectionObserver: typeof window.IntersectionObserver !== 'undefined'
  })

  if (prefersReducedMotion) {
    srDebug('branch: reduced-motion => revealAllVisible immediately (can cause hydration mismatch if before hydrate)', {})
    revealAllVisible(document)
    return
  }

  if (typeof window.IntersectionObserver === 'undefined') {
    srDebug('branch: no IntersectionObserver => revealAllVisible immediately (can cause hydration mismatch if before hydrate)', {})
    revealAllVisible(document)
    return
  }

  const observed = new WeakSet<Element>()

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        revealMarkVisible(entry.target)
        observer.unobserve(entry.target)
      }
    },
    {
      root: null,
      rootMargin: options.rootMargin ?? '0px 0px -10% 0px',
      threshold: options.threshold ?? 0.1
    }
  )

  const observeIn = (root: ParentNode) => {
    const els = Array.from(root.querySelectorAll(REVEAL_SELECTOR))
    srDebug('observeIn()', {
      count: els.length,
      readyState: document.readyState,
      time: Math.round(performance.now())
    })

    els.forEach((el) => {
      if (el.classList.contains(REVEAL_VISIBLE_CLASS)) return
      if (observed.has(el)) return
      observed.add(el)
      observer.observe(el)
    })
  }

  // Initial scan (after mount/hydration frame)
  requestAnimationFrame(() => {
    srDebug('requestAnimationFrame() tick - running initial observeIn(document)', {
      readyState: document.readyState,
      time: Math.round(performance.now())
    })
    observeIn(document)
  })

  // Re-scan for route changes / async components / hydration updates
  const mo = new MutationObserver((mutations) => {
    srDebug('MutationObserver callback', {
      mutationCount: mutations.length,
      readyState: document.readyState,
      time: Math.round(performance.now())
    })

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue
        if (node.matches(REVEAL_SELECTOR)) observeIn(node.parentNode ?? document)
        observeIn(node)
      }
    }
  })

  mo.observe(document.body, { childList: true, subtree: true })
}

// Note: scroll-reveal is intentionally NOT auto-initialized at module-eval time.
// It must be started after Nuxt has mounted/hydrated (see client-only plugin),
// otherwise it can mutate `.reveal` classes pre-hydration and cause hydration mismatches.