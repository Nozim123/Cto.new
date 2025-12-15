import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

const translations = {
  uz: {
    nav: {
      home: 'Bosh sahifa',
      about: 'Biz haqimizda',
      contact: 'Bog\'lanish',
      admin: 'Boshqaruv paneli',
      profile: 'Profil',
      settings: 'Sozlamalar',
      logout: 'Chiqib ketish'
    },
    home: {
      title: 'Samarkand Mall',
      subtitle: 'Zamonaviy savdo va ko\'ngilochar markaz',
      explore: 'Taniish',
      discover: 'Kashf qilish',
      experiences: 'Tajribalar',
      events: 'Tadbirlar',
      promotions: 'Aksiyalar',
      openings: 'Yangi ochilishlar',
      insights: 'Tahlillar',
      virtual: 'Virtual sayr',
      reviews: 'Sharhlar',
      spotlight: 'Brend tafsilotlari',
      deals: 'Chegirmalar',
      sustainability: 'Atrof-muhit',
      news: 'Yangiliklar',
      help: 'Yordam markazi',
      future: 'Kelajak innovatsiyalari',
      activeMalls: 'Faol mallar',
      totalStores: 'Jami do\'konlar',
      comingSoon: 'Tez orada',
      happyVisitors: 'Mamnun tashrif buyuruvchilar',
      virtualTour: 'Virtual sayohat',
      questions: 'Savollar?',
      questionsDescription: 'Bizning savdo markazlarimiz haqida savollaringiz bormi? Biz real-time qo\'llab-quvvatlash va shaxsiy tavsiyalar bilan yordam berishga tayyormiz!'
    },
    profile: {
      title: 'Mening Profilim',
      name: 'Ism',
      email: 'Email',
      phone: 'Telefon',
      edit: 'Tahrirlash',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
      notSet: 'Belgilangan emas'
    },
    settings: {
      title: 'Sozlamalar',
      language: 'Til',
      theme: 'Mavzu',
      darkMode: 'Qora rejim',
      notifications: 'Bildirishnomalar',
      languageSettings: 'Til tanlovi',
      themeSettings: 'Mavzu tanlovi',
      mallUpdates: 'Mall yangiliklari',
      promotionsNotify: 'Aksiyalar',
      eventsNotify: 'Tadbirlar'
    },
    common: {
      loading: 'Yuklanmoqda...',
      error: 'Xatolik yuz berdi',
      retry: 'Qaytadan urinib ko\'ring',
      logout: 'Chiqib ketish',
      login: 'Kirish',
      email: 'Elektron pochta',
      password: 'Parol',
      submit: 'Yuborish',
      close: 'Yopish',
      open: 'Ochiq',
      closed: 'Yopiq',
      comingSoon: 'Tez orada'
    },
    admin: {
      login: 'Admin Panel Kirish',
      welcome: 'Xush kelibsiz!',
      emailPlaceholder: 'admin@samarkandmall.uz',
      passwordPlaceholder: 'admin123',
      loginButton: 'Kirish',
      invalidCredentials: 'Noto\'g\'ri login yoki parol'
    },
    map: {
      title: 'Interaktiv Xarita',
      liveUpdates: 'Jonli Yangilanishlar',
      selectMall: 'Mallni tanlang',
      stores: 'Do\'konlar',
      products: 'Mahsulotlar',
      viewDetails: 'Tafsilotlarni ko\'rish',
      viewMallDetails: 'Mall tafsilotlarini ko\'rish',
      viewStoreDetails: 'Do\'kon tafsilotlarini ko\'rish',
      liveEvents: 'Jonli tadbirlar',
      openNow: 'Hozir ochiq',
      floor: 'Qavat',
      storesInMall: 'Bu malldagi do\'konlar:'
    },
    sections: {
      experiences: 'Tajribalar',
      experiencesSubtitle: 'Savdo markazida savdodan tashqari hayot - kinolar, bolalar maydonlari, oziq-ovqat maydonlari va festivallar',
      eventsPromotions: 'Tadbirlar va Aksiyalar',
      eventsPromotionsSubtitle: 'Mavsumiy chegirmalar va cheklangan vaqt takliflari uchun markazlashtirilgan markaz',
      newOpenings: 'Yangi Ochilishlar',
      newOpeningsSubtitle: 'Yangi savdo markazlari va do\'konlar - ochilish sanalari va eksklyuziv ko\'rib chiqishlar bilan',
      insights: 'Tahlillar',
      insightsSubtitle: 'Ma\'lumotlarga asoslangan tushunchalar - eng yuqori tashrif vaqtlari, mashhur toifalar va oqim tendentsiyalari',
      virtualTour: 'Virtual Sayohat',
      virtualTourSubtitle: 'Immersiv ko\'rib chiqishlar: 360° sayohatlar, video sayohatlar va AR tayyor joylar',
      dealsNearYou: 'Yaqiningizda Chegirmalar',
      dealsNearYouSubtitle: 'Joylashuvga bog\'liq aksiyalar - geo-maqsadli takliflar va shaxsiy bildirishnomalar uchun kelajakka tayyor baza',
      sustainability: 'Barqarorlik',
      sustainabilitySubtitle: 'Yashil tashabbuslar, ekologik sayohat va kelajak uchun mas\'uliyat',
      newsUpdates: 'Yangiliklar va Yangilanishlar',
      newsUpdatesSubtitle: 'So\'nggi yangiliklar, ochilishlar va sayohat uchun tahrirchi mazmuni',
      helpCenter: 'Yordam Markazi',
      helpCenterSubtitle: 'Zamonaviy qo\'llab-quvvatlash: AI chat yordamchisi, FAQ va aloqa shakllari'
    },
    buttons: {
      viewStore: 'Do\'konni ko\'rish',
      saveDeal: 'Taklifni saqlash',
      startVirtualTour: 'Virtual sayohatni boshlash',
      liveMallStatus: 'Jonli Mall Holati',
      launchDemo: 'Demo\'ni ishga tushirish',
      enableLocation: 'Joylashuvni yoqish',
      locating: 'Joylashuv aniqlanmoqda...',
      contactSupport: 'Qo\'llab-quvvatlash bilan bog\'lanish',
      send: 'Yuborish'
    }
  },
  ru: {
    nav: {
      home: 'Главная',
      about: 'О нас',
      contact: 'Контакты',
      admin: 'Админ панель',
      profile: 'Профиль',
      settings: 'Настройки',
      logout: 'Выйти'
    },
    home: {
      title: 'Самарканд Молл',
      subtitle: 'Современный торговый и развлекательный центр',
      explore: 'Исследовать',
      discover: 'Открыть',
      experiences: 'Развлечения',
      events: 'События',
      promotions: 'Акции',
      openings: 'Новые открытия',
      insights: 'Инсайты',
      virtual: 'Виртуальный тур',
      reviews: 'Отзывы',
      spotlight: 'Бренд-прожектор',
      deals: 'Предложения',
      sustainability: 'Экологичность',
      news: 'Новости',
      help: 'Центр помощи',
      future: 'Будущие инновации',
      activeMalls: 'Активные моллы',
      totalStores: 'Всего магазинов',
      comingSoon: 'Скоро откроется',
      happyVisitors: 'Довольные посетители',
      virtualTour: 'Виртуальная экскурсия',
      questions: 'Вопросы?',
      questionsDescription: 'Есть вопросы о наших торговых центрах? Мы готовы помочь с поддержкой в реальном времени и персонализированными рекомендациями!'
    },
    profile: {
      title: 'Мой Профиль',
      name: 'Имя',
      email: 'Email',
      phone: 'Телефон',
      edit: 'Редактировать',
      save: 'Сохранить',
      cancel: 'Отмена',
      notSet: 'Не установлено'
    },
    settings: {
      title: 'Настройки',
      language: 'Язык',
      theme: 'Тема',
      darkMode: 'Темный режим',
      notifications: 'Уведомления',
      languageSettings: 'Выбор языка',
      themeSettings: 'Выбор темы',
      mallUpdates: 'Обновления моллов',
      promotionsNotify: 'Акции',
      eventsNotify: 'События'
    },
    common: {
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      retry: 'Попробовать снова',
      logout: 'Выйти',
      login: 'Войти',
      email: 'Электронная почта',
      password: 'Пароль',
      submit: 'Отправить',
      close: 'Закрыть',
      open: 'Открыт',
      closed: 'Закрыт',
      comingSoon: 'Скоро откроется'
    },
    admin: {
      login: 'Вход в админ-панель',
      welcome: 'Добро пожаловать!',
      emailPlaceholder: 'admin@samarkandmall.uz',
      passwordPlaceholder: 'admin123',
      loginButton: 'Войти',
      invalidCredentials: 'Неверные логин или пароль'
    },
    map: {
      title: 'Интерактивная Карта',
      liveUpdates: 'Обновления в реальном времени',
      selectMall: 'Выберите молл',
      stores: 'Магазины',
      products: 'Товары',
      viewDetails: 'Посмотреть детали',
      viewMallDetails: 'Посмотреть детали молла',
      viewStoreDetails: 'Посмотреть детали магазина',
      liveEvents: 'События в реальном времени',
      openNow: 'Сейчас открыто',
      floor: 'Этаж',
      storesInMall: 'Магазины в этом молле:'
    },
    sections: {
      experiences: 'Развлечения',
      experiencesSubtitle: 'Жизнь в торговом центре за пределами покупок - кинотеатры, детские зоны, фуд-корты и фестивали',
      eventsPromotions: 'События и Акции',
      eventsPromotionsSubtitle: 'Централизованный центр для сезонных скидок и предложений с ограниченным сроком действия',
      newOpenings: 'Новые Открытия',
      newOpeningsSubtitle: 'Новые торговые центры и магазины - с датами открытия и эксклюзивными превью',
      insights: 'Инсайты',
      insightsSubtitle: 'Инсайты на основе данных - часы пик посещения, популярные категории и тенденции толпы',
      virtualTour: 'Виртуальный Тур',
      virtualTourSubtitle: 'Иммерсивные превью: 360° туры, видео-прогулки и AR-готовые места',
      dealsNearYou: 'Предложения Рядом с Вами',
      dealsNearYouSubtitle: 'Предложения с учетом местоположения - готовая база для гео-целевых предложений и персонализированных уведомлений',
      sustainability: 'Устойчивость',
      sustainabilitySubtitle: 'Зеленые инициативы, экологические поездки и ответственность за будущее',
      newsUpdates: 'Новости и Обновления',
      newsUpdatesSubtitle: 'Последние новости, открытия и редакционный контент для путешествий',
      helpCenter: 'Центр Помощи',
      helpCenterSubtitle: 'Современная поддержка: AI-помощник чата, FAQ и формы обратной связи'
    },
    buttons: {
      viewStore: 'Посмотреть магазин',
      saveDeal: 'Сохранить предложение',
      startVirtualTour: 'Начать виртуальный тур',
      liveMallStatus: 'Статус молла в реальном времени',
      launchDemo: 'Запустить демо',
      enableLocation: 'Включить местоположение',
      locating: 'Определение местоположения...',
      contactSupport: 'Связаться с поддержкой',
      send: 'Отправить'
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      admin: 'Admin Panel',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout'
    },
    home: {
      title: 'Samarkand Mall',
      subtitle: 'Modern Shopping & Entertainment Center',
      explore: 'Explore',
      discover: 'Discover',
      experiences: 'Experiences',
      events: 'Events',
      promotions: 'Promotions',
      openings: 'New Openings',
      insights: 'Insights',
      virtual: 'Virtual Tour',
      reviews: 'Reviews',
      spotlight: 'Brand Spotlight',
      deals: 'Deals',
      sustainability: 'Sustainability',
      news: 'News',
      help: 'Help Center',
      future: 'Future Innovations',
      activeMalls: 'Active Malls',
      totalStores: 'Total Stores',
      comingSoon: 'Coming Soon',
      happyVisitors: 'Happy Visitors',
      virtualTour: 'Virtual Tour',
      questions: 'Questions?',
      questionsDescription: 'Have questions about our shopping centers? We\'re here to help with real-time support and personalized recommendations!'
    },
    profile: {
      title: 'My Profile',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      notSet: 'Not set'
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      darkMode: 'Dark Mode',
      notifications: 'Notifications',
      languageSettings: 'Language Settings',
      themeSettings: 'Theme Settings',
      mallUpdates: 'Mall Updates',
      promotionsNotify: 'Promotions',
      eventsNotify: 'Events'
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Try again',
      logout: 'Logout',
      login: 'Login',
      email: 'Email',
      password: 'Password',
      submit: 'Submit',
      close: 'Close',
      open: 'Open',
      closed: 'Closed',
      comingSoon: 'Coming Soon'
    },
    admin: {
      login: 'Admin Panel Login',
      welcome: 'Welcome!',
      emailPlaceholder: 'admin@samarkandmall.uz',
      passwordPlaceholder: 'admin123',
      loginButton: 'Login',
      invalidCredentials: 'Invalid login or password'
    },
    map: {
      title: 'Interactive Map',
      liveUpdates: 'Live Updates',
      selectMall: 'Select mall',
      stores: 'Stores',
      products: 'Products',
      viewDetails: 'View Details',
      viewMallDetails: 'View Mall Details',
      viewStoreDetails: 'View Store Details',
      liveEvents: 'Live Events',
      openNow: 'Open Now',
      floor: 'Floor',
      storesInMall: 'Stores in this mall:'
    },
    sections: {
      experiences: 'Experiences',
      experiencesSubtitle: 'Mall life beyond shopping — cinemas, kids zones, food courts, and festivals to make every visit memorable',
      eventsPromotions: 'Events & Promotions',
      eventsPromotionsSubtitle: 'A centralized hub for seasonal discounts and limited-time offers — with real countdown timers and promo highlights',
      newOpenings: 'New Openings',
      newOpeningsSubtitle: 'New malls and stores — with opening dates, highlights, and exclusive previews',
      insights: 'Insights',
      insightsSubtitle: 'Data-driven insights like peak visiting hours, popular categories, and future-ready crowd trends',
      virtualTour: 'Virtual Tour',
      virtualTourSubtitle: 'Immersive previews: 360° tours, video walkthroughs, and AR-ready placeholders',
      dealsNearYou: 'Deals Near You',
      dealsNearYouSubtitle: 'Location-aware promotions — a future-ready base for geo-targeted offers and personalized notifications',
      sustainability: 'Sustainability',
      sustainabilitySubtitle: 'Green initiatives, eco-friendly travel, and responsibility for the future',
      newsUpdates: 'News & Updates',
      newsUpdatesSubtitle: 'Latest news, openings, and editorial content for travel',
      helpCenter: 'Help Center',
      helpCenterSubtitle: 'Modern support: AI chat assistant, FAQs, and contact forms — built to scale with the platform'
    },
    buttons: {
      viewStore: 'View store',
      saveDeal: 'Save deal',
      startVirtualTour: 'Start Virtual Tour',
      liveMallStatus: 'Live Mall Status',
      launchDemo: 'Launch demo',
      enableLocation: 'Enable location',
      locating: 'Locating…',
      contactSupport: 'Contact support',
      send: 'Send'
    }
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language')
    return saved || 'uz' // Default to Uzbek
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  const value = {
    language,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}