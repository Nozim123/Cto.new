import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'sme_lang_v1'

const get = (obj, path) => {
  const parts = path.split('.')
  let current = obj
  for (const p of parts) {
    if (!current || typeof current !== 'object') return undefined
    current = current[p]
  }
  return current
}

const interpolate = (value, vars) => {
  if (!vars) return value
  return value.replace(/\{(\w+)\}/g, (_, k) => {
    const v = vars[k]
    return v === undefined || v === null ? '' : String(v)
  })
}

const dictionary = {
  uz: {
    nav: {
      home: 'Bosh sahifa',
      about: 'Haqida',
      contact: 'Aloqa',
      malls: 'Malllar'
    },
    hero: {
      title1: 'Samarqanddagi',
      title2: 'savdo markazlarini',
      titleAccent: 'kashf eting',
      subtitle: 'Brendlar, ko\'ngilochar maskanlar va mazali taomlar bilan eng zo\'r savdo tajribasini toping',
      searchPlaceholder: 'Mall qidirish...',
      search: 'Qidirish',
      browse: 'Malllarni ko\'rish ↓'
    },
    home: {
      aboutTitle: 'Samarkand Mall Directory haqida',
      aboutP1: 'Samarkand Mall Directory — Samarqanddagi eng yaxshi savdo markazlari bo\'yicha qulay qo\'llanma.',
      aboutP2: 'Moda, texnika, ovqatlanish yoki ko\'ngilochar maskanlarni qidiryapsizmi — biz bilan topish oson.',
      featuredTitle: 'Tavsiya etilgan savdo markazlari',
      featuredSubtitle: 'Premium moda, texnika va boshqa ko\'plab imkoniyatlarni Samarqandning eng yaxshi mallarida toping',
      ctaTitle: 'Sayohatni boshlaymizmi?',
      ctaSubtitle: 'Family Park Mallga tashrif buyuring va eng zo\'r brendlar hamda aksiyalarni kashf eting',
      viewAll: 'Barcha malllar',
      contactTitle: 'Bog\'lanish',
      contactSubtitle: 'Savollaringiz bormi? Yordam beramiz!'
    },
    common: {
      comingSoon: 'Tez orada',
      viewDetails: 'Batafsil →',
      viewStore: 'Do\'kon →',
      open: 'Ochiq',
      floor: 'Qavat',
      hours: 'Ish vaqti',
      backToHome: 'Bosh sahifaga',
      reset: 'Tiklash',
      loading: 'Yuklanmoqda…'
    },
    map: {
      title: 'Interaktiv xarita',
      subtitle: 'Mall klasterlari, do\'kon nuqtalari va kategoriyalar bo\'yicha filtrlash.',
      filters: 'Filtrlar',
      category: 'Kategoriya',
      allCategories: 'Barcha kategoriyalar',
      mallCluster: 'Mall tanlash',
      cityMap: 'Shahar xaritasi',
      selected: 'Tanlangan',
      openMall: 'Mallni ochish →',
      pinpoints: 'Nuqtalar soni'
    },
    mallPage: {
      notFoundTitle: 'Mall topilmadi',
      notFoundDesc: 'Siz qidirayotgan mall mavjud emas yoki hozircha mavjud emas.',
      backToHome: 'Bosh sahifaga',
      comingSoonTitle: 'Tez orada',
      comingSoonDesc: 'Biz bu mallni tez orada ishga tushiramiz. Yangiliklar uchun kuzatib boring!',
      exploreOther: 'Boshqa malllarni ko\'rish',
      backLink: '← Bosh sahifa',
      hours: 'ISH VAQTI',
      address: 'MANZIL',
      opened: 'OCHILGAN',
      storeHighlights: 'Do\'konlar',
      aboutTheMall: 'Mall haqida',
      contactInformation: 'Aloqa ma\'lumotlari',
      featuredStores: 'Tanlangan do\'konlar',
      viewAll: 'Barchasini ko\'rish →',
      exploreAllStores: 'Barcha do\'konlarni ko\'rish'
    },
    directoryPage: {
      directory: 'Katalog',
      available: '{count} ta do\'kon',
      category: 'Kategoriya',
      floor: 'Qavat',
      allFloors: 'Barcha qavatlar',
      sortBy: 'Saralash',
      nameAz: 'Nomi (A-Z)',
      floorLevel: 'Qavat',
      resetFilters: 'Filtrlarni tiklash',
      noStores: 'Filtrlarga mos do\'kon topilmadi.'
    },
    storePage: {
      notFoundTitle: 'Do\'kon topilmadi',
      backToDirectory: 'Katalogga qaytish'
    },
    profile: {
      title: 'Profil',
      settings: 'Sozlamalar',
      name: 'Ism',
      email: 'Email',
      phone: 'Telefon',
      save: 'Saqlash',
      preferences: 'Moslash',
      darkMode: 'Tungi rejim',
      animations: 'Animatsiyalar'
    },
    footer: {
      tagline: 'Samarqanddagi eng yaxshi savdo markazlarini kashf eting',
      quickLinks: 'Tezkor havolalar',
      contact: 'Aloqa',
      rights: 'Barcha huquqlar himoyalangan.'
    }
  },
  ru: {
    nav: {
      home: 'Главная',
      about: 'О нас',
      contact: 'Контакты',
      malls: 'Моллы'
    },
    hero: {
      title1: 'Откройте',
      title2: 'торговые центры',
      titleAccent: 'Самарканда',
      subtitle: 'Лучшие бренды, развлечения и кафе — всё в одном месте',
      searchPlaceholder: 'Поиск моллов...',
      search: 'Поиск',
      browse: 'Смотреть моллы ↓'
    },
    home: {
      aboutTitle: 'О Samarkand Mall Directory',
      aboutP1: 'Samarkand Mall Directory — удобный гид по торговым центрам Самарканда.',
      aboutP2: 'Мода, электроника, еда или развлечения — найти легко.',
      featuredTitle: 'Лучшие торговые центры',
      featuredSubtitle: 'Премиальные бренды и всё необходимое в лучших моллах Самарканда',
      ctaTitle: 'Готовы исследовать?',
      ctaSubtitle: 'Посетите Family Park Mall и откройте отличные предложения',
      viewAll: 'Все моллы',
      contactTitle: 'Связаться',
      contactSubtitle: 'Есть вопросы? Мы поможем!'
    },
    common: {
      comingSoon: 'Скоро',
      viewDetails: 'Подробнее →',
      viewStore: 'Магазин →',
      open: 'Открыто',
      floor: 'Этаж',
      hours: 'Часы',
      backToHome: 'На главную',
      reset: 'Сбросить',
      loading: 'Загрузка…'
    },
    map: {
      title: 'Интерактивная карта',
      subtitle: 'Кластеры моллов, точки магазинов и фильтры по категориям.',
      filters: 'Фильтры',
      category: 'Категория',
      allCategories: 'Все категории',
      mallCluster: 'Выбор молла',
      cityMap: 'Карта города',
      selected: 'Выбрано',
      openMall: 'Открыть молл →',
      pinpoints: 'Точек'
    },
    mallPage: {
      notFoundTitle: 'Молл не найден',
      notFoundDesc: 'Такого торгового центра нет или он пока недоступен.',
      backToHome: 'На главную',
      comingSoonTitle: 'Скоро',
      comingSoonDesc: 'Мы скоро запустим этот молл. Следите за обновлениями!',
      exploreOther: 'Посмотреть другие моллы',
      backLink: '← На главную',
      hours: 'ЧАСЫ',
      address: 'АДРЕС',
      opened: 'ОТКРЫТИЕ',
      storeHighlights: 'Магазины',
      aboutTheMall: 'О молле',
      contactInformation: 'Контактная информация',
      featuredStores: 'Рекомендуемые магазины',
      viewAll: 'Смотреть все →',
      exploreAllStores: 'Все магазины'
    },
    directoryPage: {
      directory: 'Каталог',
      available: '{count} магазинов',
      category: 'Категория',
      floor: 'Этаж',
      allFloors: 'Все этажи',
      sortBy: 'Сортировка',
      nameAz: 'Название (A-Z)',
      floorLevel: 'Этаж',
      resetFilters: 'Сбросить фильтры',
      noStores: 'По фильтрам магазины не найдены.'
    },
    storePage: {
      notFoundTitle: 'Магазин не найден',
      backToDirectory: 'Назад в каталог'
    },
    profile: {
      title: 'Профиль',
      settings: 'Настройки',
      name: 'Имя',
      email: 'Email',
      phone: 'Телефон',
      save: 'Сохранить',
      preferences: 'Предпочтения',
      darkMode: 'Тёмная тема',
      animations: 'Анимации'
    },
    footer: {
      tagline: 'Лучшие торговые центры Самарканда — быстро и удобно',
      quickLinks: 'Ссылки',
      contact: 'Контакты',
      rights: 'Все права защищены.'
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      malls: 'Malls'
    },
    hero: {
      title1: 'Explore',
      title2: 'shopping malls',
      titleAccent: 'in Samarkand',
      subtitle: 'Discover premium brands, entertainment, and dining experiences',
      searchPlaceholder: 'Search malls...',
      search: 'Search',
      browse: 'Browse malls ↓'
    },
    home: {
      aboutTitle: 'About Samarkand Mall Directory',
      aboutP1: 'Samarkand Mall Directory is a modern guide to the best shopping destinations in Samarkand.',
      aboutP2: 'Fashion, electronics, dining, and entertainment — discover it in seconds.',
      featuredTitle: 'Featured shopping destinations',
      featuredSubtitle: 'Find everything you need in Samarkand\'s premier shopping centers',
      ctaTitle: 'Ready to explore?',
      ctaSubtitle: 'Visit Family Park Mall to discover amazing brands and exclusive offers',
      viewAll: 'View all malls',
      contactTitle: 'Get in touch',
      contactSubtitle: 'Have questions? We\'re here to help!'
    },
    common: {
      comingSoon: 'Coming soon',
      viewDetails: 'View details →',
      viewStore: 'View store →',
      open: 'Open',
      floor: 'Floor',
      hours: 'Hours',
      backToHome: 'Back to home',
      reset: 'Reset',
      loading: 'Loading…'
    },
    map: {
      title: 'Interactive map',
      subtitle: 'Mall clusters, store pinpoints, and category filtering.',
      filters: 'Filters',
      category: 'Category',
      allCategories: 'All categories',
      mallCluster: 'Mall cluster',
      cityMap: 'City map',
      selected: 'Selected',
      openMall: 'Open mall →',
      pinpoints: 'Pinpoints'
    },
    mallPage: {
      notFoundTitle: 'Mall not found',
      notFoundDesc: 'The mall you\'re looking for doesn\'t exist or is not available yet.',
      backToHome: 'Back to home',
      comingSoonTitle: 'Coming soon',
      comingSoonDesc: 'We\'re working hard to bring this mall to life. Check back soon!',
      exploreOther: 'Explore other malls',
      backLink: '← Back to home',
      hours: 'HOURS',
      address: 'ADDRESS',
      opened: 'OPENED',
      storeHighlights: 'Store highlights',
      aboutTheMall: 'About the mall',
      contactInformation: 'Contact information',
      featuredStores: 'Featured stores',
      viewAll: 'View all →',
      exploreAllStores: 'Explore all stores'
    },
    directoryPage: {
      directory: 'Directory',
      available: '{count} stores',
      category: 'Category',
      floor: 'Floor level',
      allFloors: 'All floors',
      sortBy: 'Sort by',
      nameAz: 'Name (A-Z)',
      floorLevel: 'Floor level',
      resetFilters: 'Reset filters',
      noStores: 'No stores found matching your filters.'
    },
    storePage: {
      notFoundTitle: 'Store not found',
      backToDirectory: 'Back to directory'
    },
    profile: {
      title: 'Profile',
      settings: 'Settings',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      save: 'Save',
      preferences: 'Preferences',
      darkMode: 'Dark mode',
      animations: 'Animations'
    },
    footer: {
      tagline: 'Explore the finest shopping destinations in Samarkand',
      quickLinks: 'Quick links',
      contact: 'Contact',
      rights: 'All rights reserved.'
    }
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved || 'uz'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const t = useMemo(() => {
    const dict = dictionary[language] || dictionary.uz
    return (key, vars) => {
      const raw = get(dict, key) ?? get(dictionary.uz, key) ?? key
      return typeof raw === 'string' ? interpolate(raw, vars) : String(raw)
    }
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      available: ['uz', 'ru', 'en']
    }),
    [language, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
