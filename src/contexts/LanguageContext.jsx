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