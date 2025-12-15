/* eslint-disable */
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  css: ['~~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'ar',
        dir: 'rtl'
      },
      titleTemplate: '%s · عيادة براندي لطب الأسنان',
      meta: [
        {
          name: 'description',
          content:
            'رعاية أسنان حديثة في حيفا: تنظيف، تبييض، حشوات تجميلية، تقويم، وزراعة — مع تعقيم صارم ومواعيد مرنة.'
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#007FFF' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@600;700&family=Inter:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {}
    }
  },
  runtimeConfig: {
    supabase: {
      serviceKey: ''
    },
    twilio: {
      accountSid:  process.env.TWILIO_ACCOUNT_SID,
      authToken:  process.env.TWILIO_AUTH_TOKEN,
      whatsappFrom:  process.env.TWILIO_WHATSAPP_FROM
    },

    openaiApiKey: '',
    webhookSigningSecret: '',
    rateLimitSecret: '',
    public: {
      supabaseUrl: ''
    }
  }
})
