import { siteConfig } from '~/site.config'
import type { UseHeadInput } from '@unhead/vue'

export type SeoPageInput = {
  /**
   * Page-specific title (Arabic-first). The helper will append the clinic name
   * for a consistent, production-friendly title format.
   *
   * @deprecated Prefer config-driven `buildMeta({ page: ... })`.
   */
  title: string
  /** Page-specific description (Arabic-first). @deprecated Prefer `buildMeta()`. */
  description: string
  /**
   * Route path (e.g. '/', '/services', '/contact') used for canonical URL.
   * If siteConfig.siteUrl is not set, canonical will be omitted.
   *
   * @deprecated Prefer `buildMeta()`.
   */
  path: string

  /** Optional overrides */
  ogType?: 'website' | 'article'
  ogLocale?: string
  twitterCard?: 'summary' | 'summary_large_image'
}

type MetaPageKey = keyof typeof siteConfig.meta.pages

export type BuildMetaInput = {
  /**
   * Optional key to use meta settings from `siteConfig.meta.pages[page]`.
   * Pages should typically call: `useHead(buildMeta({ page: 'home' }))`.
   */
  page?: MetaPageKey

  /** Optional overrides (wins over config) */
  title?: string
  description?: string
  path?: string

  ogType?: 'website' | 'article'
  ogLocale?: string
  twitterCard?: 'summary' | 'summary_large_image'
}

function normalizePath(path: string): string {
  const trimmed = (path ?? '').trim()
  if (!trimmed) return '/'
  if (trimmed.startsWith('/')) return trimmed
  return `/${trimmed}`
}

function resolveCanonicalUrl(path: string): string | undefined {
  const base = siteConfig.siteUrl
  if (!base) return undefined

  try {
    // Using URL ensures we always output an absolute, properly joined canonical.
    return new URL(normalizePath(path), base).toString()
  } catch {
    // If siteUrl is misconfigured, do not emit a broken canonical.
    return undefined
  }
}

function applyTokens(value: string, vars: Record<string, string>): string {
  return (value ?? '').replace(/\{(\w+)\}/g, (_, token: string) => {
    return vars[token] ?? `{${token}}`
  })
}

function buildTitleFromConfig(pageTitle: string): string {
  const vars = {
    clinicName: (siteConfig.clinicName ?? '').trim(),
    city: (siteConfig.city ?? '').trim(),
    pageTitle: (pageTitle ?? '').trim()
  }

  if (!vars.pageTitle) return applyTokens(siteConfig.meta.fallbackTitle, vars)

  // Build final title from template (e.g. "{pageTitle} | {clinicName}")
  return applyTokens(siteConfig.meta.titleTemplate, vars)
}

export function buildMeta(input: BuildMetaInput = {}): UseHeadInput<Record<string, any>> {
  const pageConfig = input.page ? siteConfig.meta.pages[input.page] : undefined

  const rawTitle = input.title ?? pageConfig?.title ?? ''
  const rawDescription = input.description ?? pageConfig?.description ?? siteConfig.meta.defaultDescription
  const rawPath = input.path ?? pageConfig?.path ?? '/'

  const vars = {
    clinicName: (siteConfig.clinicName ?? '').trim(),
    city: (siteConfig.city ?? '').trim()
  }

  const pageTitle = applyTokens(rawTitle, vars)
  const title = buildTitleFromConfig(pageTitle)
  const description = applyTokens(rawDescription, vars).trim()

  const canonical = resolveCanonicalUrl(rawPath)

  const ogType = input.ogType ?? pageConfig?.ogType ?? 'website'
  const ogLocale = input.ogLocale ?? siteConfig.meta.ogLocale ?? 'ar_AR'
  const twitterCard = input.twitterCard ?? siteConfig.meta.twitterCard ?? 'summary_large_image'

  return {
    title,
    meta: [
      { key: 'description', name: 'description', content: description },

      { key: 'og:title', property: 'og:title', content: title },
      { key: 'og:description', property: 'og:description', content: description },
      { key: 'og:type', property: 'og:type', content: ogType },
      { key: 'og:locale', property: 'og:locale', content: ogLocale },

      { key: 'twitter:card', name: 'twitter:card', content: twitterCard },
      { key: 'twitter:title', name: 'twitter:title', content: title },
      { key: 'twitter:description', name: 'twitter:description', content: description }
    ],
    link: canonical ? [{ key: 'canonical', rel: 'canonical', href: canonical }] : []
  }
}

/**
 * Back-compat wrapper: keep existing signature but source defaults via `buildMeta()`.
 * Prefer calling `buildMeta()` directly from pages.
 */
export function buildSeoHead(input: SeoPageInput): UseHeadInput<Record<string, any>> {
  return buildMeta({
    title: input.title,
    description: input.description,
    path: input.path,
    ogType: input.ogType,
    ogLocale: input.ogLocale,
    twitterCard: input.twitterCard
  })
}