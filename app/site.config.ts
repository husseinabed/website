export type TextDirection = 'rtl' | 'ltr';

export type LocaleCode = 'ar' | 'en';

export interface LanguageConfig {
  /** BCP-47-ish locale code used across the app */
  code: LocaleCode;
  /** Human readable label (displayed in UI) */
  label: string;
  /** Layout direction for the locale */
  dir: TextDirection;
  /** Marks the default language for the site */
  isDefault?: boolean;
}

export interface ServiceConfig {
  title: string;
  description: string;
  /**
   * Optional icon identifier (mapped by the UI to an icon component / SVG).
   * Keep this stable if you rely on it in the UI.
   */
  iconKey?: string;
}

export type DayKey = 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export interface HoursConfig {
  /** Display labels for each day (localized copy) */
  dayLabels: Record<DayKey, string>;

  /**
   * Opening hours per day.
   * - Use `null` for closed days.
   * - Time format is `HH:mm` (24-hour) to stay locale-agnostic.
   */
  days: Record<DayKey, { open: string; close: string } | null>;

  /** Explicit closed days for UI badges / summaries */
  closedDays: DayKey[];
}

export interface DoctorConfig {
  name: string;
  title: string;
}

export interface NavLabelsConfig {
  /** Accessible label for the primary nav region */
  primaryAriaLabel: string;
  /** Accessible label for the footer links nav region */
  footerAriaLabel: string;

  home: string;
  services: string;
  contact: string;
}

export interface HeroConfig {
  badgeLeft: string;
  badgeRight: string;
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  figureCaptionSubtitle: string;

  /** Hero figure image alt text (localized copy) */
  imageAlt: string;
}

export interface TrustItemConfig {
  title: string;
  description: string;
}

export interface TrustSectionConfig {
  title: string;
  subtitle: string;
  items: TrustItemConfig[];
}

export interface FaqItemConfig {
  question: string;
  answer: string;
}

export interface FaqSectionConfig {
  title: string;
  intro: string;
  items: FaqItemConfig[];
}

export interface TestimonialConfig {
  name: string;
  city?: string;
  quote: string;
}

export interface ContactPageCopy {
  headerKicker: string;
  headerTitle: string;
  headerSubtitle: string;

  detailsTitle: string;
  detailsSubtitle: string;

  cityLabel: string;
  phoneLabel: string;
  whatsappLabel: string;
  whatsappHint: string;

  addressLabel: string;
  mapsLinkLabel: string;

  hoursLabel: string;
  hoursClosedLabel: string;
  hoursNote: string;

  quickTitle: string;
  quickSubtitle: string;
  quickPrimaryCtaLabel: string;
  quickSecondaryCtaLabel: string;
}

export interface LeadFormCopy {
  title: string;
  subtitle?: string;

  fields: {
    nameLabel: string;
    namePlaceholder: string;

    phoneLabel: string;
    phonePlaceholder: string;

    serviceLabel: string;
    servicePlaceholder: string;

    messageLabel: string;
    messagePlaceholder: string;

    /** Honeypot label (field is visually hidden) */
    hpLabel: string;
  };

  buttons: {
    submit: string;
    submitting: string;
  };

  status: {
    success: string;
    error: string;
  };

  validation: {
    nameRequired: string;
    phoneRequired: string;
    serviceRequired: string;
  };
}

export type ChatWidgetLeadServiceMode = 'selected' | 'label';

export interface ChatWidgetCopy {
  button: {
    /** Label shown on the floating button when the panel is closed */
    labelClosed: string;
    /** Label shown on the floating button when the panel is open */
    labelOpen: string;
    /** Accessible label for the toggle button */
    ariaLabel: string;
  };

  panel: {
    title: string;
    subtitle?: string;
  };

  buttons: {
    next: string;
    back: string;
    finish: string;
    reset: string;
  };

  steps: {
    service: {
      title: string;
      prompt: string;

      /** Optional "Other" option. If present, the widget will allow free text. */
      otherOptionLabel?: string;
      otherPlaceholder?: string;
    };

    time: {
      title: string;
      prompt: string;
      placeholder: string;
    };

    phone: {
      title: string;
      prompt: string;
      placeholder: string;
    };
  };

  validation: {
    required: string;
    phoneInvalid: string;
  };

  /**
   * WhatsApp prefilled message template for the chat widget.
   * Supported tokens: `{clinicName}`, `{city}`, `{service}`, `{time}`, `{phone}`.
   */
  whatsappMessageTemplate: string;

  completion: {
    title: string;
    text: string;
    whatsappButtonLabel: string;
  };

  lead: {
    /**
     * Name used when posting to `/api/lead`.
     * If you prefer using the phone as "name", set this to `{phone}` and replace client-side before sending.
     */
    nameLabel: string;

    /** How to set the `service` field for `/api/lead`. */
    serviceMode: ChatWidgetLeadServiceMode;

    /**
     * Used when `serviceMode === 'label'`.
     * Example: "محادثة (ويدجت)".
     */
    serviceLabel?: string;

    /**
     * Message template for `/api/lead`.
     * Supported tokens: `{service}`, `{time}`, `{phone}`.
     */
    messageTemplate: string;
  };
}

export type BookingStepId = 'service' | 'time' | 'contact' | 'confirm';

export interface BookingStepConfig {
  id: BookingStepId;
  label: string;
  helper: string;
}

export interface BookingPageCopy {
  headerKicker: string;
  title: string;
  subtitle: string;

  steps: BookingStepConfig[];

  whatsappQuickCta: {
    title: string;
    subtitle: string;
    button: string;
  };

  serviceStep: {
    title: string;
    subtitle: string;
    errorRequired: string;
  };

  timeStep: {
    title: string;
    subtitle: string;
    dateLabel: string;
    timeLabel: string;
    timeOptions: { value: '' | 'morning' | 'afternoon' | 'evening'; label: string }[];
    errors: {
      dateRequired: string;
      timeRequired: string;
    };
  };

  contactStep: {
    title: string;
    subtitle: string;
    nameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    messageLabel: string;
    errors: {
      nameRequired: string;
      phoneRequired: string;
      emailInvalid: string;
    };
  };

  confirmStep: {
    title: string;
    subtitle: string;
    consentText: string;
    consentError: string;
    whatNextTitle: string;
    whatNextBullets: string[];
  };

  buttons: {
    back: string;
    continue: string;
    submit: string;
    submitting: string;
  };

  success: string;

  errors: {
    submitFailed: string;
  };

  /**
   * Prefilled WhatsApp message template for the booking CTA.
   * Supported tokens: `{serviceLabel}`, `{preferredDate}`, `{preferredTimeLabel}`, `{fullName}`, `{phone}`, `{message}`, `{clinicName}`, `{city}`.
   */
  whatsappPrefillTemplate: string;
}

export interface ServicesPageCopy {
  kicker: string;
  title: string;
  intro: string;
}

export interface HomePageCopy {
  testimonialsTitle: string;
  testimonialsIntro: string;
}

export type MetaOgType = 'website' | 'article';
export type MetaTwitterCard = 'summary' | 'summary_large_image';

export interface MetaPageConfig {
  /** Short page title (without clinic name). Supports tokens like `{city}` and `{clinicName}`. */
  title: string;
  /** Page description. Supports tokens like `{city}` and `{clinicName}`. */
  description: string;
  /** Route path for canonical URL joining (e.g. '/', '/services'). */
  path: string;

  /** Optional overrides */
  ogType?: MetaOgType;
}

export interface MetaConfig {
  /**
   * Title template used by SEO helper.
   * Supported tokens: `{pageTitle}`, `{clinicName}`, `{city}`.
   */
  titleTemplate: string;

  /**
   * Fallback title when a page forgets to provide one.
   * Supports tokens like `{clinicName}` and `{city}`.
   */
  fallbackTitle: string;

  /** Default/fallback description when not provided by a page config. */
  defaultDescription: string;

  /** Defaults for OG/Twitter */
  ogLocale: string;
  twitterCard: MetaTwitterCard;

  /** Page-specific meta (titles/descriptions come from here) */
  pages: {
    home: MetaPageConfig;
    services: MetaPageConfig;
    contact: MetaPageConfig;
    book: MetaPageConfig;
  };
}

export interface SiteConfig {
  clinicName: string;
  city: string;
  phone: string;
  whatsapp: string;

  /** Clinic-specific copy (no hardcoded strings in templates/pages) */
  doctor: DoctorConfig;
  hero: HeroConfig;
  trust: TrustSectionConfig;
  faq: FaqSectionConfig;
  testimonials: TestimonialConfig[];
  nav: NavLabelsConfig;
  homePage: HomePageCopy;
  bookingPage: BookingPageCopy;
  contactPage: ContactPageCopy;
  leadForm: LeadFormCopy;
  chatWidget: ChatWidgetCopy;
  servicesPage: ServicesPageCopy;

  /** SEO meta patterns + per-page meta config */
  meta: MetaConfig;

  languages: LanguageConfig[];

  services: ServiceConfig[];

  hours: HoursConfig;

  address: string;

  /** Optional canonical base URL for SEO */
  siteUrl?: string;
}

/**
 * Centralized, typed site configuration.
 * Import from pages/components as:
 * `import { siteConfig } from '~/site.config'` (Nuxt alias) or `~/app/site.config` depending on your setup.
 */
export const siteConfig = {
  clinicName: 'عيادة الشفاء لطب الأسنان',
  city: 'القدس',
  phone: '+972 50 123 4567',
  whatsapp: '+972 50 123 4567',

  doctor: {
    name: 'د. أحمد',
    title: 'طبيب أسنان'
  },

  nav: {
    primaryAriaLabel: 'التنقل الرئيسي',
    footerAriaLabel: 'روابط التذييل',

    home: 'الرئيسية',
    services: 'الخدمات',
    contact: 'تواصل'
  },

  homePage: {
    testimonialsTitle: 'آراء المرضى',
    testimonialsIntro: 'تجارب حقيقية من مراجعين زاروا العيادة.'
  },

  bookingPage: {
    headerKicker: 'حجز موعد',
    title: 'احجز موعدك',
    subtitle: 'اختر الخدمة وحدد وقتًا مفضّلًا ثم اترك بيانات التواصل. سنؤكد الموعد عبر واتساب أو الهاتف.',

    steps: [
      { id: 'service', label: 'الخدمة', helper: 'اختر الخدمة المناسبة' },
      { id: 'time', label: 'الوقت', helper: 'حدّد تاريخًا ووقتًا مفضّلًا' },
      { id: 'contact', label: 'بيانات التواصل', helper: 'لنتمكن من تأكيد الموعد' },
      { id: 'confirm', label: 'تأكيد', helper: 'موافقة على التواصل' }
    ],

    whatsappQuickCta: {
      title: 'حجز سريع عبر واتساب',
      subtitle: 'أرسل رسالة جاهزة بالاختيارات الحالية وسنرد بأسرع وقت.',
      button: 'إرسال عبر واتساب'
    },

    serviceStep: {
      title: 'اختر الخدمة',
      subtitle: 'اختر الخدمة الأقرب لاحتياجك. يمكننا التعديل بعد التواصل إذا لزم.',
      errorRequired: 'اختر خدمة من القائمة'
    },

    timeStep: {
      title: 'اختر الوقت',
      subtitle: 'اختر تاريخًا ووقتًا مفضّلًا. سنؤكد أقرب موعد متاح.',
      dateLabel: 'التاريخ المفضّل',
      timeLabel: 'الفترة المفضّلة',
      timeOptions: [
        { value: '', label: 'اختر الفترة' },
        { value: 'morning', label: 'صباحًا' },
        { value: 'afternoon', label: 'بعد الظهر' },
        { value: 'evening', label: 'مساءً' }
      ],
      errors: {
        dateRequired: 'اختر تاريخًا',
        timeRequired: 'اختر فترة زمنية'
      }
    },

    contactStep: {
      title: 'بيانات التواصل',
      subtitle: 'لنتمكن من تأكيد الموعد بسرعة.',
      nameLabel: 'الاسم الكامل',
      phoneLabel: 'رقم الهاتف/واتساب',
      emailLabel: 'البريد الإلكتروني (اختياري)',
      messageLabel: 'ملاحظة (اختياري)',
      errors: {
        nameRequired: 'الاسم مطلوب',
        phoneRequired: 'رقم الهاتف/واتساب مطلوب',
        emailInvalid: 'بريد غير صالح'
      }
    },

    confirmStep: {
      title: 'تأكيد الطلب',
      subtitle: 'يرجى التأكد من المعلومات قبل الإرسال.',
      consentText: 'أوافق على أن تتواصل معي العيادة لتأكيد الموعد عبر واتساب أو الهاتف.',
      consentError: 'يجب الموافقة على التواصل للمتابعة',
      whatNextTitle: 'ماذا بعد؟',
      whatNextBullets: [
        'سنراجع طلبك ونؤكد أقرب موعد متاح.',
        'قد نطلب معلومات إضافية قصيرة عبر واتساب أو مكالمة.',
        'في الحالات العاجلة أو الألم الشديد: يفضل الاتصال مباشرة.'
      ]
    },

    buttons: {
      back: 'رجوع',
      continue: 'متابعة',
      submit: 'إرسال الطلب',
      submitting: 'جاري الإرسال...'
    },

    success: 'تم إرسال الطلب بنجاح. سنعاود التواصل قريبًا.',

    errors: {
      submitFailed: 'تعذر إرسال الطلب. حاول مرة أخرى لاحقًا.'
    },

    whatsappPrefillTemplate:
      'مرحباً، أرغب بحجز موعد في {clinicName}.\nالخدمة: {serviceLabel}\nالتاريخ المفضّل: {preferredDate}\nالفترة: {preferredTimeLabel}\nالاسم: {fullName}\nالهاتف: {phone}\nملاحظة: {message}'
  },

  hero: {
    badgeLeft: 'عيادة أسنان في {city}',
    badgeRight: 'مواعيد مرنة وحجز سريع',
    headline: 'ابتسامة صحية تبدأ من {clinicName}',
    subheadline:
      'رعاية أسنان شاملة بأسلوب مريح وشرح واضح—من الفحص والتنظيف إلى الحشوات والعلاج المتقدم، بإشراف أطباء ذوي خبرة.',
    primaryCtaLabel: 'تواصل عبر واتساب',
    secondaryCtaLabel: 'اتصل الآن',
    figureCaptionSubtitle: 'حجز واستفسارات عبر واتساب أو الاتصال مباشرة',
    imageAlt: 'صورة تعبيرية لعيادة الأسنان'
  },

  trust: {
    title: 'لماذا يثق بنا المرضى؟',
    subtitle: 'نلتزم بمعايير عالية في التعقيم والرعاية والمتابعة.',
    items: [
      {
        title: 'تعقيم ومعايير سلامة',
        description: 'أدوات معقمة وإجراءات واضحة لسلامتكم في كل زيارة.'
      },
      {
        title: 'أطباء ذوو خبرة',
        description: 'تشخيص دقيق وخيارات علاج متعددة تناسب احتياجك.'
      },
      {
        title: 'ساعات عمل مرنة',
        description: 'مواعيد تناسبك مع إمكانية الحجز والاستفسار بسرعة.'
      }
    ]
  },

  faq: {
    title: 'الأسئلة الشائعة',
    intro:
      'إجابات مختصرة على أكثر الأسئلة تكراراً. إذا كانت لديك حالة طارئة أو ألم شديد، اتصل بالعيادة مباشرة.',
    items: [
      {
        question: 'هل تنظيف الأسنان يسبب حساسية؟',
        answer:
          'قد تشعر بحساسية خفيفة ومؤقتة بعد التنظيف، خصوصاً إذا كان هناك جير متراكم أو التهاب لثة. غالباً تزول خلال أيام قليلة.'
      },
      {
        question: 'متى أحتاج إلى علاج العصب؟',
        answer:
          'عادةً عند وجود ألم شديد أو مستمر، أو حساسية طويلة للبارد/الساخن، أو تسوس عميق يصل للعصب. التشخيص يتم بالفحص والأشعة.'
      },
      {
        question: 'هل تبييض الأسنان آمن؟',
        answer:
          'نعم عند إجرائه بإشراف الطبيب وبمواد مناسبة. نحدد الطريقة الأنسب حسب حالة الأسنان واللثة ووجود حشوات أو تيجان.'
      },
      {
        question: 'كم تدوم الحشوات التجميلية؟',
        answer:
          'تعتمد على حجم الحشوة وعادات الأكل والعناية اليومية. غالباً تدوم لسنوات مع تنظيف جيد وفحوصات دورية.'
      },
      {
        question: 'هل يمكن الحجز عبر واتساب؟',
        answer:
          'نعم، يمكنك إرسال رسالة عبر واتساب لتحديد موعد مناسب. سنطلب بعض المعلومات الأساسية ونؤكد الموعد بأسرع وقت.'
      },
      {
        question: 'ما الذي يجب فعله عند ألم شديد أو تورم؟',
        answer: 'اتصل بالعيادة فوراً. في حالات الطوارئ قد نوجهك لزيارة عاجلة أو لإجراء مناسب حسب الحالة.'
      }
    ]
  },

  testimonials: [
    {
      name: 'سارة',
      city: 'القدس',
      quote: 'تعامل راقٍ وشرح واضح قبل البدء. التجربة كانت مريحة جداً.'
    },
    {
      name: 'محمد',
      city: 'القدس',
      quote: 'مواعيد دقيقة ونظافة ممتازة. أنصح به خصوصاً للتنظيف والحشوات.'
    },
    {
      name: 'ليلى',
      city: 'أبو ديس',
      quote: 'كنت متوترة من علاج العصب لكن الفريق كان محترفاً وخففوا التوتر كثيراً.'
    }
  ],

  contactPage: {
    headerKicker: 'تواصل معنا',
    headerTitle: 'تواصل مع {clinicName}',
    headerSubtitle: 'للاستفسارات السريعة: واتساب. وللحالات العاجلة أو الألم الشديد: الاتصال مباشرة.',

    detailsTitle: 'معلومات التواصل',
    detailsSubtitle: 'نرد خلال ساعات العمل قدر الإمكان.',

    cityLabel: 'المدينة',
    phoneLabel: 'الهاتف',
    whatsappLabel: 'واتساب',
    whatsappHint: 'يمكنك إرسال اسمك وسبب الزيارة ووقت مناسب.',

    addressLabel: 'العنوان',
    mapsLinkLabel: 'فتح على خرائط Google',

    hoursLabel: 'ساعات العمل',
    hoursClosedLabel: 'مغلق',
    hoursNote: 'في حال إغلاق العيادة، اترك رسالة على واتساب وسنعاود التواصل في أقرب وقت.',

    quickTitle: 'تواصل سريع',
    quickSubtitle: 'اختر الطريقة الأنسب لك—واتساب للاستفسارات، والاتصال للحالات العاجلة.',
    quickPrimaryCtaLabel: 'تواصل عبر واتساب',
    quickSecondaryCtaLabel: 'اتصال'
  },

  leadForm: {
    title: 'اترك بياناتك وسنتواصل معك',
    subtitle: 'املأ النموذج وسنعاود الاتصال أو التواصل عبر واتساب في أقرب وقت.',

    fields: {
      nameLabel: 'الاسم الكامل',
      namePlaceholder: 'مثال: محمد أحمد',

      phoneLabel: 'رقم الهاتف/واتساب',
      phonePlaceholder: '+972 5X XXX XXXX',

      serviceLabel: 'الخدمة المطلوبة',
      servicePlaceholder: 'اختر خدمة',

      messageLabel: 'ملاحظة (اختياري)',
      messagePlaceholder: 'اكتب تفاصيل مختصرة عن حالتك أو أفضل وقت للتواصل...',

      hpLabel: 'اترك هذا الحقل فارغًا'
    },

    buttons: {
      submit: 'إرسال',
      submitting: 'جاري الإرسال...'
    },

    status: {
      success: 'تم إرسال طلبك بنجاح. سنعاود التواصل قريبًا.',
      error: 'تعذر إرسال الطلب. حاول مرة أخرى لاحقًا.'
    },

    validation: {
      nameRequired: 'الاسم مطلوب',
      phoneRequired: 'رقم الهاتف/واتساب مطلوب',
      serviceRequired: 'اختر خدمة من القائمة'
    }
  },

  chatWidget: {
    button: {
      labelClosed: 'محادثة سريعة',
      labelOpen: 'إغلاق المحادثة',
      ariaLabel: 'محادثة سريعة'
    },

    panel: {
      title: 'محادثة سريعة',
      subtitle: 'أجب عن 3 أسئلة وسنجهّز رسالة واتساب جاهزة.'
    },

    buttons: {
      next: 'متابعة',
      back: 'رجوع',
      finish: 'إنهاء',
      reset: 'إعادة البدء'
    },

    steps: {
      service: {
        title: 'الخدمة المطلوبة',
        prompt: 'ما الخدمة التي تحتاجها؟',
        otherOptionLabel: 'أخرى',
        otherPlaceholder: 'اكتب الخدمة المطلوبة'
      },
      time: {
        title: 'الوقت المفضّل',
        prompt: 'متى تفضّل الموعد؟',
        placeholder: 'مثال: اليوم مساءً / غداً صباحاً / بعد ٣ أيام'
      },
      phone: {
        title: 'رقم الهاتف',
        prompt: 'ما رقم الهاتف للتواصل؟',
        placeholder: '+972 5X XXX XXXX'
      }
    },

    validation: {
      required: 'هذا الحقل مطلوب',
      phoneInvalid: 'رقم الهاتف غير صالح'
    },

    whatsappMessageTemplate:
      'مرحباً، أرغب بالتواصل مع {clinicName} ({city}).\nالخدمة: {service}\nالوقت المفضّل: {time}\nرقم الهاتف: {phone}',

    completion: {
      title: 'تم تجهيز الرسالة',
      text: 'اضغط الزر لإرسال رسالة واتساب جاهزة تتضمن إجاباتك.',
      whatsappButtonLabel: 'إرسال عبر واتساب'
    },

    lead: {
      nameLabel: 'محادثة (ويدجت)',
      serviceMode: 'label',
      serviceLabel: 'محادثة (ويدجت)',
      messageTemplate: 'الوقت المفضّل: {time}\nملاحظة: تم الإرسال عبر ويدجت المحادثة.\nالخدمة: {service}\nالهاتف: {phone}'
    }
  },

  servicesPage: {
    kicker: 'خدماتنا',
    title: 'خدمات طب الأسنان في {city}',
    intro: 'مجموعة خدمات شاملة تحت سقف واحد—بشرح واضح وخطة علاج مناسبة لكل حالة.'
  },

  meta: {
    titleTemplate: '{pageTitle} | {clinicName}',
    fallbackTitle: '{clinicName} | {city}',
    defaultDescription:
      '{clinicName} في {city} — رعاية أسنان شاملة مع إمكانية الحجز عبر واتساب أو الاتصال.',
    ogLocale: 'ar_AR',
    twitterCard: 'summary_large_image',
    pages: {
      home: {
        title: 'عيادة أسنان في {city}',
        description:
          '{clinicName} في {city} — رعاية شاملة تشمل الفحص والتشخيص، تنظيف وتلميع الأسنان، الحشوات التجميلية، علاج العصب، والتركيبات. احجز موعدك بسهولة عبر واتساب أو الاتصال.',
        path: '/'
      },
      services: {
        title: 'خدمات طب الأسنان في {city}',
        description:
          'تعرف على خدمات {clinicName} في {city} — فحص وتشخيص شامل، تنظيف وتلميع الأسنان، حشوات تجميلية، علاج العصب، تركيبات وتيجان، وتبييض الأسنان. شرح واضح وخطة علاج مناسبة لكل حالة مع إمكانية الحجز عبر واتساب أو الاتصال.',
        path: '/services'
      },
      contact: {
        title: 'تواصل مع {clinicName}',
        description:
          'تواصل مع {clinicName} في {city} — معلومات الهاتف والواتساب والعنوان وساعات العمل. للاستفسارات السريعة: واتساب. وللحالات العاجلة أو الألم الشديد: الاتصال مباشرة.',
        path: '/contact'
      },
      book: {
        title: 'حجز موعد',
        description:
          'احجز موعدك بسهولة في {clinicName} — اختر الخدمة، حدّد وقتًا مفضّلًا، واترك بيانات التواصل. سنؤكد الموعد عبر واتساب أو الهاتف.',
        path: '/book'
      }
    }
  },

  languages: [
    { code: 'ar', label: 'العربية', dir: 'rtl', isDefault: true },
    { code: 'en', label: 'English', dir: 'ltr' }
  ],

  services: [
    {
      title: 'فحص وتشخيص شامل',
      description: 'تقييم كامل لصحة الفم والأسنان مع خطة علاج واضحة ومبسطة.',
      iconKey: 'checkup'
    },
    {
      title: 'تنظيف وتلميع الأسنان',
      description: 'إزالة الجير والتصبغات لتحسين صحة اللثة ومظهر الابتسامة.',
      iconKey: 'cleaning'
    },
    {
      title: 'حشوات تجميلية',
      description: 'علاج التسوس بحشوات بلون السن وبأقل تدخل ممكن.',
      iconKey: 'filling'
    },
    {
      title: 'علاج العصب',
      description: 'علاج قنوات الجذر لتسكين الألم والحفاظ على السن الطبيعي.',
      iconKey: 'root-canal'
    },
    {
      title: 'تركيبات وتيجان',
      description: 'حلول ثابتة لاستعادة وظيفة الأسنان وشكلها بشكل طبيعي.',
      iconKey: 'crown'
    },
    {
      title: 'تبييض الأسنان',
      description: 'تفتيح آمن بإشراف الطبيب للحصول على ابتسامة أكثر إشراقاً.',
      iconKey: 'whitening'
    }
  ],

  hours: {
    dayLabels: {
      sat: 'السبت',
      sun: 'الأحد',
      mon: 'الاثنين',
      tue: 'الثلاثاء',
      wed: 'الأربعاء',
      thu: 'الخميس',
      fri: 'الجمعة'
    },
    days: {
      sat: { open: '10:00', close: '18:00' },
      sun: { open: '10:00', close: '18:00' },
      mon: { open: '10:00', close: '18:00' },
      tue: { open: '10:00', close: '18:00' },
      wed: { open: '10:00', close: '18:00' },
      thu: { open: '10:00', close: '16:00' },
      fri: null
    },
    closedDays: ['fri']
  },

  address: 'شارع صلاح الدين، بالقرب من باب الساهرة، القدس',

  siteUrl: 'https://example.com'
} satisfies SiteConfig;