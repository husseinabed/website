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

function revealMarkVisible(el: Element) {
  el.classList.add(REVEAL_VISIBLE_CLASS)
}

function revealAllVisible(root: ParentNode = document) {
  root.querySelectorAll(REVEAL_SELECTOR).forEach(revealMarkVisible)
}

export function initScrollReveal(options: ScrollRevealOptions = {}) {
  if (!import.meta.client) return

  const w = window as unknown as Record<string, unknown>
  if (w[SCROLL_REVEAL_GLOBAL_KEY]) return
  w[SCROLL_REVEAL_GLOBAL_KEY] = true

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  if (prefersReducedMotion) {
    revealAllVisible(document)
    return
  }

  if (typeof window.IntersectionObserver === 'undefined') {
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
    root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
      if (el.classList.contains(REVEAL_VISIBLE_CLASS)) return
      if (observed.has(el)) return
      observed.add(el)
      observer.observe(el)
    })
  }

  // Initial scan (after mount/hydration frame)
  requestAnimationFrame(() => observeIn(document))

  // Re-scan for route changes / async components / hydration updates
  const mo = new MutationObserver((mutations) => {
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

// Initialize automatically on the client (module is imported by pages/app layout).
initScrollReveal()