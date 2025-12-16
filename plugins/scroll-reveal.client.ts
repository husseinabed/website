import { initScrollReveal } from '../app/client'

export default defineNuxtPlugin((nuxtApp) => {
  // Ensure scroll-reveal runs only after Nuxt mounts/hydrates.
  // Running earlier (module-eval time) can mutate `.reveal` classes pre-hydration and cause hydration mismatches.
  nuxtApp.hook('app:mounted', () => {
    initScrollReveal()
  })
})