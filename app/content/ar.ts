import { client } from '../client'

export type SeoMeta = {
  title: string
  description: string
}

export type ArContent = {
  locale: 'ar'
  seo: {
    home: SeoMeta
    book: SeoMeta
    contact: SeoMeta
    services: SeoMeta
  }
  nav: {
    home: string
    services: string
    book: string
    contact: string
  }
  global: {
    clinicLabel: string
    tagline: string
    ctas: {
      book: string
      whatsapp: string
      call: string
      map: string
      email: string
    }
    trustBullets: string[]
  }
  home: {
    hero: {
      badgeLeft: string
      badgeRight: string
      headline: string
      subheadline: string
      highlights: string[]
      ctas: {
        primary: string
        secondary: string
      }
    }
    socialProof: {
      title: string
      bullets: string[]
      note: string
    }
    about: {
      title: string
      intro: string
      story: string[]
    }
    services: {
      title: string
      subtitle: string
      cards: { title: string; desc: string }[]
      linkToAll: string
    }
    howItWorks: {
      title: string
      subtitle: string
      steps: { title: string; desc: string }[]
    }
    ctaStrip: {
      title: string
      subtitle: string
      primary: string
      secondary: string
    }
  }
  servicesPage: {
    title: string
    subtitle: string
    listTitle: string
    note: string
    cta: {
      title: string
      subtitle: string
      primary: string
      secondary: string
    }
  }
  booking: {
    headerKicker: string
    title: string
    subtitle: string
    steps: { id: 'service' | 'time' | 'contact' | 'confirm'; label: string; helper: string }[]
    serviceStep: {
      title: string
      subtitle: string
      options: { value: string; label: string; desc: string }[]
      errorRequired: string
    }
    timeStep: {
      title: string
      subtitle: string
      dateLabel: string
      timeLabel: string
      timeOptions: { value: '' | 'morning' | 'afternoon' | 'evening'; label: string }[]
      errors: {
        dateRequired: string
        timeRequired: string
      }
    }
    contactStep: {
      title: string
      subtitle: string
      nameLabel: string
      phoneLabel: string
      emailLabel: string
      messageLabel: string
    }
    confirmStep: {
      title: string
      subtitle: string
      consentText: string
      whatNextTitle: string
      whatNextBullets: string[]
    }
    buttons: {
      back: string
      continue: string
      submit: string
      submitting: string
    }
    success: string
    errors: {
      submitFailed: string
    }
    whatsappPrefill: (args: {
      serviceLabel?: string
      preferredDate?: string
      preferredTimeLabel?: string
      fullName?: string
      phone?: string
      message?: string
    }) => string
    whatsappQuickCta: {
      title: string
      subtitle: string
      button: string
    }
  }
  contact: {
    headerKicker: string
    title: string
    subtitle: string
    detailsTitle: string
    detailsSubtitle: string
    cards: {
      phone: { label: string }
      whatsapp: { label: string; linkLabel: string }
      address: { label: string }
      email: { label: string }
      hours: { label: string; lines: string[] }
      map: { label: string; hint: string }
    }
    bookCard: {
      title: string
      subtitle: string
      primary: string
      secondary: string
      guardrails: string
    }
  }
}

export const ar: ArContent = {
  locale: 'ar',
  seo: {
    home: {
      title: `${client.clinic_name} · ابتسامة واثقة برعاية لطيفة`,
      description: `رعاية أسنان حديثة في ${client.city}: تنظيف، تبييض، حشوات تجميلية، تقويم، وزراعة — مع تعقيم صارم ومواعيد مرنة.`
    },
    services: {
      title: `الخدمات · ${client.clinic_name}`,
      description: `تعرّف على خدمات ${client.clinic_name} في ${client.city}: ${client.services.slice(0, 5).join('، ')} وغيرها.`
    },
    book: {
      title: `حجز موعد · ${client.clinic_name}`,
      description: `احجز موعدك بسهولة: اختر الخدمة، حدّد وقتًا مفضّلًا، واترك بيانات التواصل. يمكننا التأكيد عبر واتساب أو الهاتف.`
    },
    contact: {
      title: `تواصل معنا · ${client.clinic_name}`,
      description: `اتصل أو راسلنا عبر واتساب أو زرنا في ${client.city}. العنوان وخريطة الوصول وروابط التواصل متاحة هنا.`
    }
  },
  nav: {
    home: 'الرئيسية',
    services: 'الخدمات',
    book: 'حجز موعد',
    contact: 'تواصل'
  },
  global: {
    clinicLabel: client.clinic_name,
    tagline: `رعاية أسنان حديثة ولطيفة • ${client.city}`,
    ctas: {
      book: 'احجز موعدًا',
      whatsapp: 'واتساب',
      call: 'اتصال',
      map: 'الخريطة',
      email: 'البريد'
    },
    trustBullets: ['تعقيم صارم', 'تصوير رقمي عند الحاجة', 'خطط علاج واضحة', 'اهتمام بالألم والراحة']
  },
  home: {
    hero: {
      badgeLeft: 'عيادة مرخّصة',
      badgeRight: 'معدات حديثة',
      headline: 'ابتسامة واثقة تبدأ برعاية لطيفة وحديثة',
      subheadline:
        `في ${client.clinic_name} نقدّم عناية متكاملة للأسنان — من التنظيف الدوري إلى الزراعة والتقويم — مع تركيز على الراحة، والتعقيم، ووضوح الخطة العلاجية.`,
      highlights: ['مواعيد مسائية عند الحاجة', 'تواصل سريع عبر واتساب', 'شرح الخيارات قبل البدء'],
      ctas: {
        primary: 'احجز موعدًا',
        secondary: 'راسلنا على واتساب'
      }
    },
    socialProof: {
      title: 'الثقة مهمة',
      bullets: ['فريق مهني مرخّص', 'معايير تعقيم عالية', 'تجهيزات حديثة', 'متابعة بعد الإجراء عند الحاجة'],
      note: 'للاستفسارات العامة حول الأسعار أو الخطوات، يمكننا الرد عبر واتساب مع تحويل للطاقم عند الحاجة.'
    },
    about: {
      title: 'نبذة عن العيادة',
      intro:
        `${client.clinic_name} في ${client.city} تقدّم رعاية أسنان عملية وجمالية ضمن بيئة مريحة. هدفنا تقديم تجربة واضحة: فحص، شرح، ثم خطة علاج تناسبك.`,
      story: [
        `يشرف على العيادة ${client.doctor_name} مع فريق يهتم بالتفاصيل وبراحة المراجع.`,
        'نعتمد أسلوبًا تدريجيًا: نبدأ بالأهم صحيًا ثم ننتقل للجمالي عند رغبتك.',
        'نؤكد على الوقاية: تنظيف دوري، تعليمات عناية منزلية، ومتابعة عند الحاجة.'
      ]
    },
    services: {
      title: 'خدمات تناسب كل ابتسامة',
      subtitle: 'خدمات وقائية، علاجية، وتجميليّة بخيارات واضحة.',
      cards: [
        { title: 'تنظيف الأسنان', desc: 'تنظيف لطيف وتلميع ومتابعة صحة اللثة.' },
        { title: 'تبييض الأسنان', desc: 'تبييض آمن ومتوازن مع مراعاة الحساسية.' },
        { title: 'تقويم الأسنان', desc: 'خيارات تقويم تناسب حالتك مع متابعة مرحلية.' },
        { title: 'زراعة الأسنان', desc: 'تعويض ثابت بخطة واضحة وتقييم شامل.' },
        { title: 'حشوات تجميلية', desc: 'ترميمات تجميلية للحفاظ على الشكل والوظيفة.' },
        { title: 'علاج العصب', desc: 'تخفيف الألم والحفاظ على السن عند الحاجة.' }
      ],
      linkToAll: 'عرض جميع الخدمات'
    },
    howItWorks: {
      title: 'كيف تتم العملية؟',
      subtitle: 'حجز بسيط بثلاث خطوات واضحة.',
      steps: [
        { title: 'اختر الخدمة', desc: 'حدّد ما تحتاجه: تنظيف، تبييض، تقويم، زراعة وغيرها.' },
        { title: 'حدّد الوقت', desc: 'اختر تاريخًا ووقتًا مفضّلًا. سنؤكد أقرب موعد متاح.' },
        { title: 'تأكيد التواصل', desc: 'نؤكد عبر الهاتف/واتساب، ومع البريد الإلكتروني اختياريًا.' }
      ]
    },
    ctaStrip: {
      title: 'جاهز للحجز؟',
      subtitle: 'اختر الخدمة وحدّد وقتًا مفضّلًا وسنؤكد معك.',
      primary: 'احجز الآن',
      secondary: 'واتساب'
    }
  },
  servicesPage: {
    title: 'الخدمات',
    subtitle: `خدمات ${client.clinic_name} في ${client.city} — خيارات وقائية وعلاجية وتجميليّة.`,
    listTitle: 'الخدمات المتوفرة',
    note: 'لا تشخيص طبي عبر الرسائل. في الحالات الطارئة أو الألم الشديد، اتصل مباشرة بالعيادة.',
    cta: {
      title: 'هل تريد ترشيح الخدمة المناسبة؟',
      subtitle: 'راسلنا عبر واتساب مع وصف مختصر وسنوجّهك للخطوة التالية.',
      primary: 'راسلنا على واتساب',
      secondary: 'احجز موعدًا'
    }
  },
  booking: {
    headerKicker: 'حجز موعد',
    title: 'حجز بخطوات بسيطة',
    subtitle: 'اختر الخدمة وحدّد وقتًا مفضّلًا ثم اترك بيانات التواصل للتأكيد.',
    steps: [
      { id: 'service', label: 'الخدمة', helper: 'اختر نوع الزيارة' },
      { id: 'time', label: 'الوقت', helper: 'حدّد موعدًا مفضّلًا' },
      { id: 'contact', label: 'التواصل', helper: 'كيف نصل إليك' },
      { id: 'confirm', label: 'تأكيد', helper: 'موافقة وإرسال' }
    ],
    serviceStep: {
      title: 'اختر الخدمة',
      subtitle: 'اختر الخدمة التي تحتاجها، ويمكنك إضافة ملاحظة في الخطوة التالية.',
      options: client.services.map((label) => ({
        value: label,
        label,
        desc: 'يمكننا شرح التفاصيل وتأكيد الوقت المناسب بعد استلام الطلب.'
      })),
      errorRequired: 'الرجاء اختيار خدمة.'
    },
    timeStep: {
      title: 'حدّد الوقت',
      subtitle: 'سنؤكد أقرب موعد متاح بحسب تفضيلاتك.',
      dateLabel: 'التاريخ المفضّل',
      timeLabel: 'الفترة المفضّلة',
      timeOptions: [
        { value: '', label: 'اختر' },
        { value: 'morning', label: 'صباحًا' },
        { value: 'afternoon', label: 'ظهرًا' },
        { value: 'evening', label: 'مساءً' }
      ],
      errors: {
        dateRequired: 'الرجاء اختيار تاريخ.',
        timeRequired: 'الرجاء اختيار فترة.'
      }
    },
    contactStep: {
      title: 'بيانات التواصل',
      subtitle: 'نؤكد الطلب عبر واتساب/الهاتف، والبريد اختياري.',
      nameLabel: 'الاسم الكامل',
      phoneLabel: 'رقم الهاتف / واتساب',
      emailLabel: 'البريد الإلكتروني (اختياري)',
      messageLabel: 'ملاحظة (اختياري)'
    },
    confirmStep: {
      title: 'الموافقة والتأكيد',
      subtitle: 'سنستخدم بياناتك فقط للتواصل بشأن هذا الطلب.',
      consentText: 'أوافق على التواصل معي عبر الهاتف/واتساب/البريد الإلكتروني بخصوص طلب الحجز.',
      whatNextTitle: 'ماذا بعد الإرسال؟',
      whatNextBullets: [
        'سنؤكد الموعد أو نقترح أقرب وقت متاح.',
        'ستصلك رسالة تأكيد عبر واتساب أو اتصال.',
        'للأسئلة السريرية، يتم التحويل لطاقم مرخّص — لا تشخيص طبي عبر الرسائل.'
      ]
    },
    buttons: {
      back: 'رجوع',
      continue: 'متابعة',
      submit: 'تأكيد وإرسال',
      submitting: 'جارٍ الإرسال…'
    },
    success: 'تم الإرسال! جارٍ تحويلك…',
    errors: {
      submitFailed: 'تعذر إرسال الطلب. الرجاء المحاولة مرة أخرى.'
    },
    whatsappPrefill: ({
      serviceLabel,
      preferredDate,
      preferredTimeLabel,
      fullName,
      phone,
      message
    }) => {
      const parts: string[] = []
      parts.push(`مرحبًا ${client.clinic_name}،`)
      parts.push('أود حجز موعد.')
      if (serviceLabel) parts.push(`الخدمة: ${serviceLabel}`)
      if (preferredDate || preferredTimeLabel) {
        const when = [preferredDate, preferredTimeLabel].filter(Boolean).join(' - ')
        parts.push(`الوقت المفضل: ${when}`)
      }
      if (fullName) parts.push(`الاسم: ${fullName}`)
      if (phone) parts.push(`رقمي: ${phone}`)
      if (message) parts.push(`ملاحظة: ${message}`)
      parts.push('شكرًا!')
      return parts.join('\n')
    },
    whatsappQuickCta: {
      title: 'تفضل واتساب بدل الاستمارة؟',
      subtitle: 'راسلنا برسالة جاهزة وسنؤكد معك أقرب موعد.',
      button: 'إرسال رسالة واتساب'
    }
  },
  contact: {
    headerKicker: 'تواصل معنا',
    title: 'نحن هنا لمساعدتك',
    subtitle: `اتصل، راسلنا عبر واتساب، أو زرنا في ${client.city}.`,
    detailsTitle: 'بيانات التواصل',
    detailsSubtitle: `يمكنك الوصول إلى ${client.clinic_name} بسهولة عبر الروابط التالية.`,
    cards: {
      phone: { label: 'الهاتف' },
      whatsapp: { label: 'واتساب', linkLabel: 'محادثة واتساب' },
      address: { label: 'العنوان' },
      email: { label: 'البريد الإلكتروني' },
      hours: {
        label: 'ساعات العمل',
        lines: ['الأحد–الخميس: 09:00–17:00', 'الجمعة: 09:00–13:00', 'مواعيد مسائية: حسب الطلب']
      },
      map: { label: 'الخريطة', hint: 'افتح الخريطة للحصول على اتجاهات الوصول.' }
    },
    bookCard: {
      title: 'احجز زيارة',
      subtitle: 'تفضل الحجز الذاتي؟ احجز خلال دقائق.',
      primary: 'احجز موعدًا',
      secondary: 'واتساب',
      guardrails: 'تنبيه: لا تشخيص طبي أو إرشادات طوارئ عبر الرسائل؛ يتم التحويل لطاقم مرخّص عند الحاجة.'
    }
  }
}