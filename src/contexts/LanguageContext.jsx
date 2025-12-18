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
  tr: {
    nav: {
      home: 'Ana Sayfa',
      about: 'Hakkımızda',
      contact: 'İletişim',
      admin: 'Yönetim Paneli',
      profile: 'Profil',
      settings: 'Ayarlar',
      logout: 'Çıkış Yap'
    },
    home: {
      title: 'Samarkand Mall',
      subtitle: 'Modern Alışveriş ve Eğlence Merkezi',
      explore: 'Keşfet',
      discover: 'Keşfet',
      experiences: 'Deneyimler',
      events: 'Etkinlikler',
      promotions: 'Kampanyalar',
      openings: 'Yeni Açılışlar',
      insights: 'İçgörüler',
      virtual: 'Sanal Tur',
      reviews: 'Değerlendirmeler',
      spotlight: 'Marka Spot',
      deals: 'Fırsatlar',
      sustainability: 'Sürdürülebilirlik',
      news: 'Haberler',
      help: 'Yardım Merkezi',
      future: 'Gelecek İnovasyonları',
      activeMalls: 'Aktif Mallar',
      totalStores: 'Toplam Mağaza',
      comingSoon: 'Çok Yakında',
      happyVisitors: 'Mutlu Ziyaretçiler',
      virtualTour: 'Sanal Tur',
      questions: 'Sorular?',
      questionsDescription: 'Alışveriş merkezlerimiz hakkında sorularınız mı var? Gerçek zamanlı destek ve kişiselleştirilmiş önerilerle yardıma hazırız!'
    },
    profile: {
      title: 'Profilim',
      name: 'İsim',
      email: 'E-posta',
      phone: 'Telefon',
      edit: 'Düzenle',
      save: 'Kaydet',
      cancel: 'İptal',
      notSet: 'Ayarlanmamış'
    },
    settings: {
      title: 'Ayarlar',
      language: 'Dil',
      theme: 'Tema',
      darkMode: 'Karanlık Mod',
      notifications: 'Bildirimler',
      languageSettings: 'Dil Ayarları',
      themeSettings: 'Tema Ayarları',
      mallUpdates: 'Mall Güncellemeleri',
      promotionsNotify: 'Kampanyalar',
      eventsNotify: 'Etkinlikler'
    },
    common: {
      loading: 'Yükleniyor...',
      error: 'Bir hata oluştu',
      retry: 'Tekrar Deneyin',
      logout: 'Çıkış Yap',
      login: 'Giriş Yap',
      email: 'E-posta',
      password: 'Şifre',
      submit: 'Gönder',
      close: 'Kapat',
      open: 'Açık',
      closed: 'Kapalı',
      comingSoon: 'Çok Yakında',
      share: 'Paylaş',
      shareStore: 'Mağazayı Paylaş',
      shareProduct: 'Ürünü Paylaş',
      copyLink: 'Linki Kopyala',
      copied: 'Kopyalandı!',
      all: 'Tümü',
      searchInStore: 'Mağazada ara...',
      outOfStock: 'Stokta Yok'
    },
    sort: {
      featured: 'Öne Çıkanlar',
      new: 'En Yeni',
      priceLow: 'Fiyat: Düşükten Yükseğe',
      priceHigh: 'Fiyat: Yüksekten Düşüğe',
      popular: 'Popüler'
    },
    errors: {
      storeNotFound: 'Mağaza Bulunamadı'
    },
    admin: {
      login: 'Yönetim Paneli Giriş',
      welcome: 'Hoş Geldiniz!',
      emailPlaceholder: 'admin@samarkandmall.uz',
      passwordPlaceholder: 'admin123',
      loginButton: 'Giriş Yap',
      invalidCredentials: 'Geçersiz giriş veya şifre'
    },
    map: {
      title: 'İnteraktif Harita',
      liveUpdates: 'Canlı Güncellemeler',
      selectMall: 'Mall Seçin',
      stores: 'Mağazalar',
      products: 'Ürünler',
      viewDetails: 'Detayları Görüntüle',
      viewMallDetails: 'Mall Detaylarını Görüntüle',
      viewStoreDetails: 'Mağaza Detaylarını Görüntüle',
      liveEvents: 'Canlı Etkinlikler',
      openNow: 'Şimdi Açık',
      floor: 'Kat',
      storesInMall: 'Bu mall\'daki mağazalar:'
    },
    sections: {
      experiences: 'Deneyimler',
      experiencesSubtitle: 'Alışverişten fazlası - sinemalar, çocuk alanları, yemek mahalleri ve festivaller',
      eventsPromotions: 'Etkinlikler ve Kampanyalar',
      eventsPromotionsSubtitle: 'Mevsimsel indirimler ve sınırlı süreli teklifler için merkezi hub',
      newOpenings: 'Yeni Açılışlar',
      newOpeningsSubtitle: 'Yeni alışveriş merkezleri ve mağazalar - açılış tarihleri ve özel önizlemelerle',
      insights: 'İçgörüler',
      insightsSubtitle: 'Veri odaklı içgörüler - en yoğun ziyaret saatleri, popüler kategoriler ve akış eğilimleri',
      virtualTour: 'Sanal Tur',
      virtualTourSubtitle: 'Sürükleyici önizlemeler: 360° turlar, video gezintileri ve AR hazır mekanlar',
      dealsNearYou: 'Yakınınızdaki Fırsatlar',
      dealsNearYouSubtitle: 'Konuma duyarlı promosyonlar - coğrafi hedefli teklifler ve kişiselleştirilmiş bildirimler için gelecek hazır taban',
      sustainability: 'Sürdürülebilirlik',
      sustainabilitySubtitle: 'Yeşil girişimler, çevre dostu seyahat ve gelecek için sorumluluk',
      newsUpdates: 'Haberler ve Güncellemeler',
      newsUpdatesSubtitle: 'Seyahat için en son haberler, açılışlar ve editöryel içerik',
      helpCenter: 'Yardım Merkezi',
      helpCenterSubtitle: 'Modern destek: AI sohbet asistanı, SSS ve iletişim formları'
    },
    buttons: {
      viewStore: 'Mağazayı Görüntüle',
      viewProducts: 'Ürünleri Görüntüle',
      saveDeal: 'Fırsatı Kaydet',
      startVirtualTour: 'Sanal Tur Başlat',
      liveMallStatus: 'Canlı Mall Durumu',
      launchDemo: 'Demo Başlat',
      enableLocation: 'Konumu Etkinleştir',
      locating: 'Konum Belirleniyor...',
      contactSupport: 'Destekle İletişime Geç',
      send: 'Gönder',
      share: 'Paylaş',
      copy: 'Kopyala',
      backToMall: 'Mall\'a Geri Dön',
      backToHome: 'Ana Sayfaya Dön',
      follow: 'Takip Et',
      quickView: 'Hızlı Görünüm',
      viewFullDetails: 'Tam Detayları Görüntüle',
      addToWishlist: 'Favorilere Ekle',
      clearFilters: 'Tüm Filtreleri Temizle'
    },
    stores: {
      title: 'Mağazalar',
      noStores: 'Mağaza bulunamadı',
      loading: 'Mağazalar yükleniyor...',
      featured: 'Öne Çıkan Mağazalar',
      categories: 'Kategoriler',
      allCategories: 'Tüm Kategoriler',
      searchPlaceholder: 'Mağaza ara...',
      sortBy: 'Sırala',
      filterBy: 'Filtrele'
    },
    products: {
      title: 'Ürünler',
      noProducts: 'Ürün bulunamadı',
      loading: 'Ürünler yükleniyor...',
      featured: 'Öne Çıkan Ürünler',
      categories: 'Kategoriler',
      allCategories: 'Tüm Kategoriler',
      searchPlaceholder: 'Ürün ara...',
      sortBy: 'Sırala',
      filterBy: 'Filtrele',
      price: 'Fiyat',
      addToCart: 'Sepete Ekle',
      buyNow: 'Şimdi Al',
      shareProduct: 'Ürünü Paylaş',
      showing: 'Gösteriliyor',
      products: 'ürün',
      of: 'üzerinden',
      tryAdjusting: 'Filtrelerinizi veya arama sorgunuzu ayarlamayı deneyin',
      specifications: 'Özellikler'
    },
    malls: {
      title: 'Alışveriş Merkezleri',
      featured: 'Öne Çıkan Mallar',
      allMalls: 'Tüm Mallar',
      comingSoon: 'Çok Yakında',
      openNow: 'Şimdi Açık',
      viewOnMap: 'Haritada Görüntüle',
      getDirections: 'Yol Tarifi Al',
      call: 'Ara',
      visitWebsite: 'Web Sitesini Ziyaret Et'
    },
    virtualTour: {
      subtitle: 'Mega Travel Center ni chuqur o\'rganing',
      welcome: {
        title: 'Virtual Tourga Xush Kelibsiz',
        description: 'Mega Travel Center bilan tanishishni boshlashingizga yordam beramiz'
      },
      spaces: {
        title: 'Fazolar',
        description: 'Bizning katta savdo markazlarimizni o\'rganing'
      },
      services: {
        title: 'Xizmatlar',
        description: 'Ko\'plab xizmatlar va imkoniyatlar'
      }
    }
  },
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
      comingSoon: 'Tez orada',
      share: 'Ulashish',
      shareStore: 'Do\'konni ulashish',
      shareProduct: 'Mahsulotni ulashish',
      copyLink: 'Havolani nusxalash',
      copied: 'Nusxalandi!',
      all: 'Barchasi',
      searchInStore: 'Do\'konda qidirish...',
      outOfStock: 'Qolmadi'
    },
    sort: {
      featured: 'Tavsiya etilgan',
      new: 'Eng yangi',
      priceLow: 'Narx: Pastdan Yuqoriga',
      priceHigh: 'Narx: Yuqoridan Pastga',
      popular: 'Mashhur'
    },
    errors: {
      storeNotFound: 'Do\'kon topilmadi'
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
      viewProducts: 'Mahsulotlarni ko\'rish',
      saveDeal: 'Taklifni saqlash',
      startVirtualTour: 'Virtual sayohatni boshlash',
      liveMallStatus: 'Jonli Mall Holati',
      launchDemo: 'Demo\'ni ishga tushirish',
      enableLocation: 'Joylashuvni yoqish',
      locating: 'Joylashuv aniqlanmoqda...',
      contactSupport: 'Qo\'llab-quvvatlash bilan bog\'lanish',
      send: 'Yuborish',
      share: 'Ulashish',
      copy: 'Nusxalash',
      backToMall: 'Mallga qaytish',
      backToHome: 'Bosh sahifaga qaytish',
      follow: 'Kuzatish',
      quickView: 'Tez ko\'rish',
      viewFullDetails: 'To\'liq tafsilotlarni ko\'rish',
      addToWishlist: 'Saqlanganlar',
      clearFilters: 'Barcha filtrlarni tozalash'
    },
    stores: {
      title: 'Do\'konlar',
      noStores: 'Do\'kon topilmadi',
      loading: 'Do\'konlar yuklanmoqda...',
      featured: 'Tavsiya etiladigan do\'konlar',
      categories: 'Kategoriyalar',
      allCategories: 'Barcha kategoriyalar',
      searchPlaceholder: 'Do\'kon qidirish...',
      sortBy: 'Saralash',
      filterBy: 'Filtrlash'
    },
    products: {
      title: 'Mahsulotlar',
      noProducts: 'Mahsulot topilmadi',
      loading: 'Mahsulotlar yuklanmoqda...',
      featured: 'Tavsiya etiladigan mahsulotlar',
      categories: 'Kategoriyalar',
      allCategories: 'Barcha kategoriyalar',
      searchPlaceholder: 'Mahsulot qidirish...',
      sortBy: 'Saralash',
      filterBy: 'Filtrlash',
      price: 'Narx',
      addToCart: 'Savatga qo\'shish',
      buyNow: 'Hoziroq sotib olish',
      shareProduct: 'Mahsulotni ulashish',
      showing: 'Ko\'rsatilmoqda',
      products: 'mahsulot',
      of: 'dan',
      tryAdjusting: 'Filtrlaringizni yoki qidiruv so\'rovingizni sozlashga harakat qiling',
      specifications: 'Xususiyatlar'
    },
    malls: {
      title: 'Savdo markazlari',
      featured: 'Tavsiya etiladigan mallar',
      allMalls: 'Barcha mallar',
      comingSoon: 'Tez orada',
      openNow: 'Hozir ochiq',
      viewOnMap: 'Xaritani ko\'rish',
      getDirections: 'Yo\'lni topish',
      call: 'Qo\'ng\'iroq qilish',
      visitWebsite: 'Veb-saytga o\'tish'
    },
    virtualTour: {
      subtitle: 'Mega Travel Center ni chuqur o\'rganing',
      welcome: {
        title: 'Virtual Tourga Xush Kelibsiz',
        description: 'Mega Travel Center bilan tanishishni boshlashingizga yordam beramiz'
      },
      spaces: {
        title: 'Fazolar',
        description: 'Bizning katta savdo markazlarimizni o\'rganing'
      },
      services: {
        title: 'Xizmatlar',
        description: 'Ko\'plab xizmatlar va imkoniyatlar'
      }
    },
    immersive: {
      title: 'Immersiv Tajriba',
      subtitle: 'Immersiv Kontent',
      description: 'Savdo markazlarimizni 360° ko\'rinishda, video sayohatda va AR texnologiyasi bilan kashf eting',
      comingSoon: 'Tez Orada',
      '360': {
        title: '360° Virtual Tur',
        description: 'Interaktiv 360° ko\'rinish bilan savdo markazini to\'liq o\'rganing. Har qanday burchakka erkin harakatlaning.'
      },
      video: {
        title: 'Video Sayohat',
        description: 'Professional video orqali savdo markazining barcha qismlarini ko\'ring. HD sifat va immersiv audio.'
      },
      ar: {
        title: 'AR Ko\'rinish',
        description: 'Augmented Reality texnologiyasi bilan haqiqiy vaqtda navigatsiya va ma\'lumot olish.'
      },
      features: {
        realistic: 'Realistik Ko\'rinish',
        realisticDesc: 'Yuqori sifatli tasvirlar va 3D texnologiya',
        interactive: 'Interaktiv',
        interactiveDesc: 'To\'liq boshqaruv va erkin harakatlanish',
        accessible: 'Osongina Kirish',
        accessibleDesc: 'Har qanday qurilmadan foydalanish mumkin'
      }
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
      comingSoon: 'Скоро откроется',
      share: 'Поделиться',
      shareStore: 'Поделиться магазином',
      shareProduct: 'Поделиться товаром',
      copyLink: 'Скопировать ссылку',
      copied: 'Скопировано!',
      all: 'Все',
      searchInStore: 'Искать в магазине...',
      outOfStock: 'Нет в наличии'
    },
    sort: {
      featured: 'Рекомендуемые',
      new: 'Новинки',
      priceLow: 'Цена: По возрастанию',
      priceHigh: 'Цена: По убыванию',
      popular: 'Популярные'
    },
    errors: {
      storeNotFound: 'Магазин не найден'
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
      viewProducts: 'Посмотреть товары',
      saveDeal: 'Сохранить предложение',
      startVirtualTour: 'Начать виртуальный тур',
      liveMallStatus: 'Статус молла в реальном времени',
      launchDemo: 'Запустить демо',
      enableLocation: 'Включить местоположение',
      locating: 'Определение местоположения...',
      contactSupport: 'Связаться с поддержкой',
      send: 'Отправить',
      share: 'Поделиться',
      copy: 'Копировать',
      backToMall: 'Вернуться в молл',
      backToHome: 'Вернуться на главную',
      follow: 'Подписаться',
      quickView: 'Быстрый просмотр',
      viewFullDetails: 'Посмотреть все детали',
      addToWishlist: 'В избранное',
      clearFilters: 'Очистить все фильтры'
    },
    stores: {
      title: 'Магазины',
      noStores: 'Магазины не найдены',
      loading: 'Загрузка магазинов...',
      featured: 'Рекомендуемые магазины',
      categories: 'Категории',
      allCategories: 'Все категории',
      searchPlaceholder: 'Поиск магазинов...',
      sortBy: 'Сортировка',
      filterBy: 'Фильтр'
    },
    products: {
      title: 'Товары',
      noProducts: 'Товары не найдены',
      loading: 'Загрузка товаров...',
      featured: 'Рекомендуемые товары',
      categories: 'Категории',
      allCategories: 'Все категории',
      searchPlaceholder: 'Поиск товаров...',
      sortBy: 'Сортировка',
      filterBy: 'Фильтр',
      price: 'Цена',
      addToCart: 'В корзину',
      buyNow: 'Купить сейчас',
      shareProduct: 'Поделиться товаром',
      showing: 'Показано',
      products: 'товаров',
      of: 'из',
      tryAdjusting: 'Попробуйте изменить фильтры или поисковый запрос',
      specifications: 'Характеристики'
    },
    malls: {
      title: 'Торговые центры',
      featured: 'Рекомендуемые моллы',
      allMalls: 'Все моллы',
      comingSoon: 'Скоро откроется',
      openNow: 'Сейчас открыто',
      viewOnMap: 'Посмотреть на карте',
      getDirections: 'Получить направления',
      call: 'Позвонить',
      visitWebsite: 'Посетить веб-сайт'
    },
    virtualTour: {
      subtitle: 'Глубоко изучите Mega Travel Center',
      welcome: {
        title: 'Добро пожаловать в Виртуальный Тур',
        description: 'Мы поможем вам начать знакомство с Mega Travel Center'
      },
      spaces: {
        title: 'Пространства',
        description: 'Исследуйте наши большие торговые центры'
      },
      services: {
        title: 'Услуги',
        description: 'Множество услуг и возможностей'
      }
    },
    immersive: {
      title: 'Иммерсивный Опыт',
      subtitle: 'Иммерсивный Контент',
      description: 'Исследуйте наши торговые центры в 360°, видео-турах и AR технологии',
      comingSoon: 'Скоро',
      '360': {
        title: '360° Виртуальный Тур',
        description: 'Полностью изучите торговый центр с интерактивным 360° обзором. Свободно перемещайтесь в любом направлении.'
      },
      video: {
        title: 'Видео Экскурсия',
        description: 'Посмотрите все части торгового центра через профессиональное видео. HD качество и иммерсивный звук.'
      },
      ar: {
        title: 'AR Просмотр',
        description: 'Навигация и информация в реальном времени с технологией дополненной реальности.'
      },
      features: {
        realistic: 'Реалистичный Вид',
        realisticDesc: 'Высококачественные изображения и 3D технология',
        interactive: 'Интерактивный',
        interactiveDesc: 'Полный контроль и свободное перемещение',
        accessible: 'Легкий Доступ',
        accessibleDesc: 'Можно использовать с любого устройства'
      }
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
      comingSoon: 'Coming Soon',
      share: 'Share',
      shareStore: 'Share Store',
      shareProduct: 'Share Product',
      copyLink: 'Copy Link',
      copied: 'Copied!',
      all: 'All',
      searchInStore: 'Search in store...',
      outOfStock: 'Out of Stock'
    },
    sort: {
      featured: 'Featured',
      new: 'Newest',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      popular: 'Popular'
    },
    errors: {
      storeNotFound: 'Store Not Found'
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
      viewProducts: 'View Products',
      saveDeal: 'Save deal',
      startVirtualTour: 'Start Virtual Tour',
      liveMallStatus: 'Live Mall Status',
      launchDemo: 'Launch demo',
      enableLocation: 'Enable location',
      locating: 'Locating…',
      contactSupport: 'Contact support',
      send: 'Send',
      share: 'Share',
      copy: 'Copy',
      backToMall: 'Back to Mall',
      backToHome: 'Back to Home',
      follow: 'Follow',
      quickView: 'Quick View',
      viewFullDetails: 'View Full Details',
      addToWishlist: 'Add to Wishlist',
      clearFilters: 'Clear All Filters'
    },
    stores: {
      title: 'Stores',
      noStores: 'No stores found',
      loading: 'Loading stores...',
      featured: 'Featured Stores',
      categories: 'Categories',
      allCategories: 'All Categories',
      searchPlaceholder: 'Search stores...',
      sortBy: 'Sort by',
      filterBy: 'Filter by'
    },
    products: {
      title: 'Products',
      noProducts: 'No products found',
      loading: 'Loading products...',
      featured: 'Featured Products',
      categories: 'Categories',
      allCategories: 'All Categories',
      searchPlaceholder: 'Search products...',
      sortBy: 'Sort by',
      filterBy: 'Filter by',
      price: 'Price',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      shareProduct: 'Share Product',
      showing: 'Showing',
      products: 'products',
      of: 'of',
      tryAdjusting: 'Try adjusting your filters or search query',
      specifications: 'Specifications'
    },
    malls: {
      title: 'Shopping Centers',
      featured: 'Featured Malls',
      allMalls: 'All Malls',
      comingSoon: 'Coming Soon',
      openNow: 'Open Now',
      viewOnMap: 'View on Map',
      getDirections: 'Get Directions',
      call: 'Call',
      visitWebsite: 'Visit Website'
    },
    virtualTour: {
      subtitle: 'Explore Mega Travel Center In Depth',
      welcome: {
        title: 'Welcome to Virtual Tour',
        description: 'We will help you start exploring Mega Travel Center'
      },
      spaces: {
        title: 'Spaces',
        description: 'Explore our large shopping centers'
      },
      services: {
        title: 'Services',
        description: 'Many services and opportunities'
      }
    },
    immersive: {
      title: 'Immersive Experience',
      subtitle: 'Immersive Content',
      description: 'Explore our shopping centers in 360°, video tours, and AR technology',
      comingSoon: 'Coming Soon',
      '360': {
        title: '360° Virtual Tour',
        description: 'Fully explore the mall with an interactive 360° view. Move freely in any direction.'
      },
      video: {
        title: 'Video Walkthrough',
        description: 'See all parts of the mall through professional video. HD quality and immersive audio.'
      },
      ar: {
        title: 'AR View',
        description: 'Real-time navigation and information with Augmented Reality technology.'
      },
      features: {
        realistic: 'Realistic View',
        realisticDesc: 'High-quality images and 3D technology',
        interactive: 'Interactive',
        interactiveDesc: 'Full control and free movement',
        accessible: 'Easy Access',
        accessibleDesc: 'Can be used from any device'
      }
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