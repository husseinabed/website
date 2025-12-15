# Dental Clinic Web Platform — Implementation Plan (Nuxt 4 + Tailwind 4.1 + Supabase + OpenAI)

## 1) Goals & scope
- Deliver SSR Nuxt 4 site with Tailwind 4.1 and branded theme (Inter, primary #007FFF, secondary #0EA5E9, background #FFFFFF, text #0B1220) and light/dark logo support.
- Pages: `/` home sections, `/book` booking stepper, `/contact` contact panel.
- APIs: `/api/leads/create`, `/api/faq/answer`; outbound webhook `lead.created` with HMAC.
- Data: Supabase tables `leads`, `appointments`, `ai_logs`; workspace isolation via RLS.
- AI: OpenAI tool-assisted `dental_reception_ai` for lead scoring, reply, routing; guardrails.
- Non-functional: SEO (SSR, meta, sitemap, robots), performance (image optimization, Lighthouse ≥90), security (rate limiting, HMAC, headers), analytics events.

## 2) Tech stack & setup choices
- Framework: Nuxt 4 SSR with TypeScript, file-based routing; i18n default en, RTL guardrails (future locales ar/he not active but structure-ready).
- Styling: Tailwind 4.1 + CSS variables for theme tokens; global typography scale.
- Package manager: pnpm (lockfile managed).
- Lint/format/test: ESLint + Prettier, Vitest for unit, Playwright for e2e, Zod for runtime validation.
- Env: `.env.example` with Supabase URL/anon/service keys, OpenAI key, webhook secret, rate-limit secrets, mail/WhatsApp provider keys.
- Key files (planned): [`nuxt.config.ts`](nuxt.config.ts), [`app.vue`](app.vue), [`app.config.ts`](app.config.ts), [`tailwind.config.ts`](tailwind.config.ts), [`pages/index.vue`](pages/index.vue), [`pages/book.vue`](pages/book.vue), [`pages/contact.vue`](pages/contact.vue), [`server/api/leads/create.post.ts`](server/api/leads/create.post.ts), [`server/api/faq/answer.post.ts`](server/api/faq/answer.post.ts), [`server/utils/hmac.ts`](server/utils/hmac.ts), [`server/utils/rate-limit.ts`](server/utils/rate-limit.ts), [`server/utils/ai.ts`](server/utils/ai.ts).

## 3) Milestones & acceptance
- M1 Scaffold & quality: Nuxt 4 SSR app with pnpm, Tailwind wired, ESLint/Prettier/Vitest/Playwright set; CI lint/test script; `.env.example`.
- M2 Theming & layout: App shell with header/footer, color tokens, typography, Inter loaded, light/dark logo switch, SEO defaults, i18n base.
- M3 Pages & components: Home sections implemented per spec; sticky mobile CTA; contact page; booking stepper UI with validation and consent checkbox.
- M4 Data & APIs: Supabase schema and migrations, RLS policies; `/api/leads/create` inserting lead + AI score + optional notify; `/api/faq/answer` with guardrails + ai_logs.
- M5 Integrations & security: Webhook lead.created with HMAC signing; rate limiting public endpoints; security headers; analytics events fired.
- M6 QA & ops: Tests (unit/API/e2e/RLS), Lighthouse/perf tuning, sitemap/robots, deployment checklist with envs/secrets.

## 4) Frontend architecture
- Routes:
  - `/` home with sections: hero, services_grid, how_it_works, trust, faq_ai entry, cta_strip; sticky mobile CTA buttons (book, WhatsApp).
  - `/book` stepper: service → time → contact → confirm; submission to `/api/leads/create`; success redirect `/book/success` (lightweight page).
  - `/contact` panel with phone/WhatsApp, address, hours, optional map embed.
- Components (examples):
  - Sections: [`components/sections/Hero.vue`](components/sections/Hero.vue), `ServicesGrid.vue`, `HowItWorks.vue`, `TrustBadges.vue`, `FaqAiPrompt.vue` (CTA to FAQ form), `CtaStrip.vue`.
  - UI primitives: [`components/ui/Button.vue`](components/ui/Button.vue), `Card.vue`, `Badge.vue`, `Stepper.vue`, `FormField.vue`, `Input`, `Select`, `Textarea`, `Checkbox`, `Alert`, `LoadingSpinner`.
  - Sticky CTA: [`components/StickyCtaBar.vue`](components/StickyCtaBar.vue) rendered on mobile only.
- Form handling:
  - Zod schemas for booking steps; per-step validation; consent checkbox required; submit disabled until valid.
  - Error and success states; loading indicator; redirect on success.
- SEO:
  - Per-route meta via `definePageMeta`; Open Graph defaults; schema.org MedicalBusiness/Dentist on home; canonical tags; sitemap + robots in `server/routes`.
- i18n:
  - `@nuxtjs/i18n` (or Nuxt i18n module) configured with default `en`; structure ready for RTL locales; typography/layout mindful of RTL spacing.

## 5) Styling & theming
- CSS variables for palette: primary, secondary, background, surface, text, subtle, border.
- Typography scale: h1 48px, h2 32px, body 16px; consistent line-height; responsive adjustments.
- Tailwind presets: spacing scale, container widths, shadow set for cards, focus ring using primary.
- Logos: accept light/dark URLs; auto-select by color scheme or toggle.
- Reusable classes: buttons (primary, secondary, ghost), cards, grids (2–3 cols responsive), sticky bar, pills for badges.

## 6) Data model (Supabase)
- `leads`: id uuid PK, workspace_id uuid, project_id uuid, created_at timestamptz default now, full_name text, phone_whatsapp text, email text, service_type text, preferred_date date, preferred_time_range text, message text, lead_score int, status text, locale text, source text.
- `appointments`: id uuid PK, workspace_id uuid, lead_id uuid FK leads(id), scheduled_at timestamptz, status text, notes text.
- `ai_logs`: id uuid PK, workspace_id uuid, project_id uuid, created_at timestamptz default now, agent_id text, input_json jsonb, output_json jsonb.
- Indexes: workspace_id/project_id on leads & ai_logs; lead_id on appointments.
- Status enums (text or enum): lead status e.g., new, contacted, scheduled, closed; appointment status e.g., pending, confirmed, completed, canceled.

## 7) RLS policies (workspace isolation)
- Enable RLS on all tables.
- Policy: tenant users must match `workspace_id` (and `project_id` where present) via JWT claims.
- Public insert pathway (from public API) uses service role or dedicated policy guarded by rate limit + validation; optionally use PostgREST RPC or edge function with service key.
- Logs and appointments restricted to workspace_id; no cross-tenant reads.
- Deferrable constraints to ensure lead insert sets workspace/project IDs server-side, not client provided.

## 8) API contracts & handlers
- `/api/leads/create` (POST):
  - Input: LeadCreateInput schema; validate with Zod; require consent_contact true; set source=web.
  - Steps: rate limit; validate; insert lead with workspace/project IDs from config; call AI scoring; store lead_score; enqueue outbound notifications; respond with LeadCreateOutput { lead_id, lead_score, status, reply_text }.
- `/api/faq/answer` (POST):
  - Input: FaqAnswerInput; validate; call AI with guardrails (no diagnosis/emergency); log to ai_logs; return answer + handoff flag.
- Webhook outbound `lead.created`:
  - POST to configured URL with HMAC signature header `x-signature`, `x-workspace-id`; body includes lead payload and score.
- Utilities:
  - HMAC signing/verification in [`server/utils/hmac.ts`](server/utils/hmac.ts).
  - Rate limiting in [`server/utils/rate-limit.ts`](server/utils/rate-limit.ts) (IP + token bucket or sliding window, Redis/Upstash if available, fallback in-memory with tight ceilings).
  - AI client in [`server/utils/ai.ts`](server/utils/ai.ts) encapsulating OpenAI calls, guardrails, logging.

## 9) AI agent integration (dental_reception_ai)
- Contract: input full_name, phone_whatsapp, service_type, preferred_date/time_range, message?, locale.
- Output: lead_score (0–100), intent, reply_text, next_action, tags.
- Guardrails: block medical diagnosis/emergency advice; if uncertain, handoff; ensure polite tone.
- Logging: persist input/output to `ai_logs` with agent_id; include run id for traceability.
- Failure modes: fallback to default reply and neutral score; mark handoff_to_human.

## 10) Notifications
- WhatsApp (bird optional): templates lead_received, booking_confirmation; include placeholders for name, service, preferred_date/time.
- Email (smtp/provider): templates lead_received_v1, booking_confirmation_v1; send on lead creation and booking confirmation; configurable per workspace.
- Allow optional WhatsApp notify toggle in config.

## 11) Analytics & events
- Client events: cta_click, whatsapp_click, lead_submit, booking_step_view; emit via composable (e.g., `useAnalytics`) and data layer; respect GDPR consent if applicable.
- Server logs for API requests with correlation id; include rate-limit hits.

## 12) Security & performance
- Security headers: CSP (script-src self plus Nuxt/analytics if used), HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin.
- Rate limiting: applied to public APIs and potentially FAQ endpoint to deter abuse.
- Input validation everywhere (Zod).
- HMAC signing for outbound webhook; optional signature verification middleware for inbound webhooks (if added later).
- Performance: image optimization via Nuxt image; lazy-load sections; prefetch route; cache headers for static assets; avoid blocking fonts; measure Lighthouse ≥90.
- Robots/sitemap: generate via Nitro route; allow index/follow.

## 13) Testing & QA
- Unit: Zod schemas, utilities (HMAC, rate-limit).
- API: supertest/nuxt test runner for `/api/leads/create`, `/api/faq/answer` happy/path + validation + rate-limit responses.
- RLS: SQL test or Supabase CLI to assert isolation.
- E2E: Playwright booking flow, sticky CTA visibility on mobile viewport, contact links.
- Performance: Lighthouse CI target ≥90.

## 14) Deployment & ops
- Supabase migrations for tables/RLS; store in `supabase/migrations`.
- Edge functions optional for heavy AI or webhook signing if needed.
- Env secrets: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, WEBHOOK_SIGNING_SECRET, RATE_LIMIT_SECRET, WHATSAPP_PROVIDER_KEY, SMTP creds.
- Monitoring/logging: server logs, AI log retention; alert on webhook failures; retries/backoff for outbound webhook.
- Deployment target: Nuxt SSR on platform supporting Node 18+; connect to Supabase.

## 15) Visual flow (lead creation)
```mermaid
flowchart TD
User[Visitor] -->|Submit booking| LeadsAPI[/api/leads/create]
LeadsAPI --> DB[Supabase leads]
LeadsAPI --> AI[dental_reception_ai]
AI --> Logs[ai_logs]
LeadsAPI --> Notify[Email/WhatsApp templates]
LeadsAPI --> Webhook[lead.created outbound]
```
