require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Load data files
const malls = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/malls.json'), 'utf8'));
const stores = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/stores.json'), 'utf8'));
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/products.json'), 'utf8'));

// Bot token from environment variable
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';

// Create bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 Mega Travel Center Bot is running...');

// User language preferences (stored in memory - can be moved to database)
const userLanguages = {};

// Translations for bot
const botTranslations = {
  uz: {
    welcome: '🏢 Mega Travel Center botiga xush kelibsiz!\n\nSamarkand shahridagi eng yaxshi savdo markazlarimizni kashf eting. Men sizga quyidagilar bilan yordam bera olaman:\n\n🏬 Savdo markazlari va do\'konlar\n🎉 Aksiyalar va chegirmalar\n🎬 Kino va ko\'ngilochar joylar\n🍽 Restoran va kafe\n🎫 Tadbirlar va festivallar\n💼 Ish o\'rinlari\n🚗 Avtomobil joylari va logistika\n🧳 Sayohatchilar uchun xizmatlar\n\nQuyidagi menyudan tanlang yoki /help buyrug\'ini yuboring.',
    mainMenu: '📋 Asosiy menyu',
    malls: '🏬 Savdo markazlari',
    stores: '🏪 Do\'konlar',
    deals: '🎉 Aksiyalar',
    events: '🎫 Tadbirlar',
    cinema: '🎬 Kino',
    restaurants: '🍽 Restoranlar',
    jobs: '💼 Ish o\'rinlari',
    parking: '🚗 Avtomobil joylari',
    tourist: '🧳 Sayohatchilar uchun',
    language: '🌐 Til',
    help: '❓ Yordam',
    back: '⬅️ Orqaga',
    viewDetails: '📖 Tafsilotlar',
    getDirections: '🗺 Yo\'nalish',
    callNow: '📞 Qo\'ng\'iroq qilish',
    visitWebsite: '🌐 Veb-sayt',
    shareLocation: '📍 Joylashuvni ulashish',
    selectMall: 'Savdo markazini tanlang:',
    selectCategory: 'Kategoriyani tanlang:',
    mallDetails: '📍 *{name}*\n\n📍 Manzil: {address}\n⏰ Ish vaqti: {hours}\n📞 Telefon: {phone}\n🏪 Do\'konlar: {storeCount}\n⭐️ Reyting: {rating}/5.0\n\n{description}',
    storeDetails: '🏪 *{name}*\n\n📍 Joylashuv: {mall}, {floor}-qavat\n📞 Telefon: {phone}\n📧 Email: {email}\n⏰ Ish vaqti: {hours}\n\n{description}',
    dealDetails: '🎉 *{title}*\n\n📍 {mall}\n💰 Chegirma: {discount}\n\n{description}',
    noDeals: 'Hozirda faol aksiyalar yo\'q. Tez orada yangi takliflar uchun kuzatib boring!',
    categoryFashion: '👗 Moda',
    categoryElectronics: '📱 Elektronika',
    categorySportswear: '🏃 Sport kiyimlari',
    categoryHome: '🏠 Uy jihozlari',
    categoryBeauty: '💄 Go\'zallik',
    categoryBooks: '📚 Kitoblar',
    categoryToys: '🧸 O\'yinchoqlar',
    categoryFood: '🍔 Oziq-ovqat',
    allCategories: '📂 Barcha kategoriyalar',
    openNow: '✅ Ochiq',
    closedNow: '❌ Yopiq',
    comingSoon: '🔜 Tez orada',
    nearbyMalls: '📍 Yaqin atrofdagi savdo markazlari',
    sendLocation: 'Yaqin atrofdagi savdo markazlarini topish uchun joylashuvingizni yuboring.',
    locationReceived: 'Joylashuvingiz qabul qilindi! Yaqin atrofdagi savdo markazlarni topmoqda...',
    distanceAway: '{distance} km uzoqlikda',
    helpText: '❓ *Yordam*\n\nMavjud buyruqlar:\n\n/start - Asosiy menyu\n/malls - Savdo markazlari\n/stores - Do\'konlar\n/deals - Aksiyalar\n/events - Tadbirlar\n/cinema - Kino\n/restaurants - Restoranlar\n/jobs - Ish o\'rinlari\n/parking - Avtomobil joylari\n/tourist - Sayohatchilar uchun\n/language - Tilni o\'zgartirish\n/help - Yordam\n\nSavol yoki muammo bo\'lsa, info@megatravelcenter.com manziliga yozing.',
    languageChanged: '✅ Til o\'zgartirildi!',
    eventsList: '🎫 *Yaqinlashib kelayotgan tadbirlar*\n\n',
    noEvents: 'Hozirda yaqinlashib kelayotgan tadbirlar yo\'q.',
    cinemaTitle: '🎬 *Kino Jadvali*\n\nKinolar va ko\'ngilochar joylar haqida ma\'lumot olish uchun savdo markazini tanlang:',
    restaurantsTitle: '🍽 *Restoranlar va Kafe*\n\nOvqatlanish joylarini ko\'rish uchun savdo markazini tanlang:',
    jobsTitle: '💼 *Ish O\'rinlari*\n\nBizning savdo markazlarimizda turli xil ish imkoniyatlari mavjud:\n\n• Sotuvchilar\n• Kassirlar\n• Menejerlar\n• Xavfsizlik xodimlari\n• Tozalovchi xodimlar\n• Restoran xodimlari\n\nCV yuborish: jobs@megatravelcenter.com\nTelefon: +998 (66) 233-30-30',
    parkingTitle: '🚗 *Avtomobil Joylari va Logistika*\n\nBarcha savdo markazlarimizda:\n\n✅ Bepul avtomobil joylari\n✅ Elektr avtomashinalar uchun quvvatlash stantsiyalari\n✅ 24/7 xavfsizlik\n✅ Nogironlar uchun maxsus joylar\n\nJamoat transporti:\n🚌 Avtobus yo\'nalishlari: 5, 12, 18, 24\n🚕 Taksi: Yandex Go, MyTaxi\n\nQo\'shimcha ma\'lumot uchun savdo markazini tanlang:',
    touristTitle: '🧳 *Sayohatchilar Uchun Xizmatlar*\n\nBiz sayohatchilarga quyidagi xizmatlarni taklif qilamiz:\n\n💱 *Valyuta Ayirboshlash*\nBarcha savdo markazlarida valyuta ayirboshlash punktlari mavjud.\n\n💰 *Tax Free (Soliqa Qaytarish)*\nXorijiy mehmonlar uchun Tax Free xizmati.\nMinimal xarid: 200,000 so\'m\n\n🎁 *O\'zbek Suvenerlari*\nAn\'anaviy hunarmandchilik mahsulotlari:\n- Suzani (kashta tikish)\n- Kulolchilik buyumlari\n- Ipak mahsulotlari\n- Miniatyura rasmlar\n- An\'anaviy kiyimlar\n\nℹ️ *Ma\'lumot Markazlari*\nHar bir savdo markazida ko\'p tilli xizmat ko\'rsatish.\n\n📞 24/7 Yordam: +998 (66) 233-30-30',
    searchProducts: '🔍 Mahsulot qidirish',
    productSearch: 'Mahsulot nomini yozing:',
    searchResults: '🔍 *Qidiruv natijalari:* {query}\n\n',
    noSearchResults: 'Hech narsa topilmadi. Boshqa so\'z bilan urinib ko\'ring.',
    productDetails: '🛍 *{name}*\n\n💰 Narx: {price}\n🏪 Do\'kon: {store}\n📍 Mall: {mall}\n\n{description}',
    reviews: '⭐️ Sharhlar va Baholash',
    reviewsTitle: '⭐️ *Sharhlar va Reyting*\n\nBizning savdo markazlarimiz haqida fikringizni bildiring!\n\nSharh yuborish: reviews@megatravelcenter.com\n\nO\'rtacha reyting: 4.6/5.0\nUmumiy sharhlar: 1,143',
    loyalty: '🎁 Sodiqlik Dasturi',
    loyaltyTitle: '🎁 *Sodiqlik Dasturi*\n\nBizning sodiqlik dasturimizga qo\'shiling va bonuslar oling!\n\n✨ Xarid qilganingizda ball to\'plang\n🎫 Eksklyuziv chegirmalarga ega bo\'ling\n🎉 Maxsus takliflar va tadbirlarga taklif oling\n🎁 Tug\'ilgan kuningizda sovg\'a\n\nRo\'yxatdan o\'tish: loyalty@megatravelcenter.com\nTelefon: +998 (66) 233-30-30'
  },
  ru: {
    welcome: '🏢 Добро пожаловать в бот Mega Travel Center!\n\nОткройте для себя лучшие торговые центры Самарканда. Я могу помочь вам с:\n\n🏬 Торговые центры и магазины\n🎉 Акции и скидки\n🎬 Кино и развлечения\n🍽 Рестораны и кафе\n🎫 События и фестивали\n💼 Вакансии\n🚗 Парковка и логистика\n🧳 Услуги для туристов\n\nВыберите из меню ниже или отправьте /help.',
    mainMenu: '📋 Главное меню',
    malls: '🏬 Торговые центры',
    stores: '🏪 Магазины',
    deals: '🎉 Акции',
    events: '🎫 События',
    cinema: '🎬 Кино',
    restaurants: '🍽 Рестораны',
    jobs: '💼 Вакансии',
    parking: '🚗 Парковка',
    tourist: '🧳 Для туристов',
    language: '🌐 Язык',
    help: '❓ Помощь',
    back: '⬅️ Назад',
    viewDetails: '📖 Подробнее',
    getDirections: '🗺 Маршрут',
    callNow: '📞 Позвонить',
    visitWebsite: '🌐 Веб-сайт',
    shareLocation: '📍 Поделиться локацией',
    selectMall: 'Выберите торговый центр:',
    selectCategory: 'Выберите категорию:',
    mallDetails: '📍 *{name}*\n\n📍 Адрес: {address}\n⏰ Часы работы: {hours}\n📞 Телефон: {phone}\n🏪 Магазинов: {storeCount}\n⭐️ Рейтинг: {rating}/5.0\n\n{description}',
    storeDetails: '🏪 *{name}*\n\n📍 Расположение: {mall}, {floor} этаж\n📞 Телефон: {phone}\n📧 Email: {email}\n⏰ Часы работы: {hours}\n\n{description}',
    dealDetails: '🎉 *{title}*\n\n📍 {mall}\n💰 Скидка: {discount}\n\n{description}',
    noDeals: 'Нет активных акций. Следите за новыми предложениями!',
    categoryFashion: '👗 Мода',
    categoryElectronics: '📱 Электроника',
    categorySportswear: '🏃 Спортивная одежда',
    categoryHome: '🏠 Товары для дома',
    categoryBeauty: '💄 Красота',
    categoryBooks: '📚 Книги',
    categoryToys: '🧸 Игрушки',
    categoryFood: '🍔 Продукты',
    allCategories: '📂 Все категории',
    openNow: '✅ Открыто',
    closedNow: '❌ Закрыто',
    comingSoon: '🔜 Скоро',
    nearbyMalls: '📍 Ближайшие торговые центры',
    sendLocation: 'Отправьте свою геолокацию, чтобы найти ближайшие торговые центры.',
    locationReceived: 'Локация получена! Ищем ближайшие торговые центры...',
    distanceAway: 'в {distance} км',
    helpText: '❓ *Помощь*\n\nДоступные команды:\n\n/start - Главное меню\n/malls - Торговые центры\n/stores - Магазины\n/deals - Акции\n/events - События\n/cinema - Кино\n/restaurants - Рестораны\n/jobs - Вакансии\n/parking - Парковка\n/tourist - Для туристов\n/language - Изменить язык\n/help - Помощь\n\nЕсли у вас есть вопросы, пишите на info@megatravelcenter.com.',
    languageChanged: '✅ Язык изменен!',
    eventsList: '🎫 *Предстоящие события*\n\n',
    noEvents: 'Нет предстоящих событий.',
    cinemaTitle: '🎬 *Расписание кино*\n\nВыберите торговый центр для информации о кинотеатрах и развлечениях:',
    restaurantsTitle: '🍽 *Рестораны и кафе*\n\nВыберите торговый центр, чтобы увидеть заведения питания:',
    jobsTitle: '💼 *Вакансии*\n\nВ наших торговых центрах доступны различные вакансии:\n\n• Продавцы\n• Кассиры\n• Менеджеры\n• Охрана\n• Уборщики\n• Персонал ресторанов\n\nОтправить резюме: jobs@megatravelcenter.com\nТелефон: +998 (66) 233-30-30',
    parkingTitle: '🚗 *Парковка и логистика*\n\nВо всех наших торговых центрах:\n\n✅ Бесплатная парковка\n✅ Зарядные станции для электромобилей\n✅ Охрана 24/7\n✅ Места для инвалидов\n\nОбщественный транспорт:\n🚌 Автобусы: 5, 12, 18, 24\n🚕 Такси: Yandex Go, MyTaxi\n\nВыберите торговый центр для деталей:',
    touristTitle: '🧳 *Услуги для туристов*\n\nМы предлагаем туристам следующие услуги:\n\n💱 *Обмен валюты*\nПункты обмена валюты во всех торговых центрах.\n\n💰 *Tax Free*\nУслуга Tax Free для иностранных гостей.\nМинимальная покупка: 200,000 сум\n\n🎁 *Узбекские сувениры*\nТрадиционные изделия ремесленников:\n- Сюзане (вышивка)\n- Керамика\n- Шелковые изделия\n- Миниатюрные картины\n- Традиционная одежда\n\nℹ️ *Информационные центры*\nМногоязычный сервис в каждом торговом центре.\n\n📞 Помощь 24/7: +998 (66) 233-30-30',
    searchProducts: '🔍 Поиск товаров',
    productSearch: 'Введите название товара:',
    searchResults: '🔍 *Результаты поиска:* {query}\n\n',
    noSearchResults: 'Ничего не найдено. Попробуйте другое слово.',
    productDetails: '🛍 *{name}*\n\n💰 Цена: {price}\n🏪 Магазин: {store}\n📍 ТЦ: {mall}\n\n{description}',
    reviews: '⭐️ Отзывы и рейтинг',
    reviewsTitle: '⭐️ *Отзывы и рейтинг*\n\nОставьте свой отзыв о наших торговых центрах!\n\nОтправить отзыв: reviews@megatravelcenter.com\n\nСредний рейтинг: 4.6/5.0\nВсего отзывов: 1,143',
    loyalty: '🎁 Программа лояльности',
    loyaltyTitle: '🎁 *Программа лояльности*\n\nПрисоединяйтесь к нашей программе лояльности и получайте бонусы!\n\n✨ Накапливайте баллы за покупки\n🎫 Получайте эксклюзивные скидки\n🎉 Приглашения на специальные мероприятия\n🎁 Подарок в день рождения\n\nРегистрация: loyalty@megatravelcenter.com\nТелефон: +998 (66) 233-30-30'
  },
  en: {
    welcome: '🏢 Welcome to Mega Travel Center Bot!\n\nDiscover the best shopping malls in Samarkand. I can help you with:\n\n🏬 Malls and stores\n🎉 Promotions and deals\n🎬 Cinema and entertainment\n🍽 Restaurants and cafes\n🎫 Events and festivals\n💼 Job opportunities\n🚗 Parking and logistics\n🧳 Tourist services\n\nSelect from the menu below or send /help.',
    mainMenu: '📋 Main Menu',
    malls: '🏬 Malls',
    stores: '🏪 Stores',
    deals: '🎉 Deals',
    events: '🎫 Events',
    cinema: '🎬 Cinema',
    restaurants: '🍽 Restaurants',
    jobs: '💼 Jobs',
    parking: '🚗 Parking',
    tourist: '🧳 Tourist Info',
    language: '🌐 Language',
    help: '❓ Help',
    back: '⬅️ Back',
    viewDetails: '📖 View Details',
    getDirections: '🗺 Get Directions',
    callNow: '📞 Call Now',
    visitWebsite: '🌐 Visit Website',
    shareLocation: '📍 Share Location',
    selectMall: 'Select a mall:',
    selectCategory: 'Select a category:',
    mallDetails: '📍 *{name}*\n\n📍 Address: {address}\n⏰ Hours: {hours}\n📞 Phone: {phone}\n🏪 Stores: {storeCount}\n⭐️ Rating: {rating}/5.0\n\n{description}',
    storeDetails: '🏪 *{name}*\n\n📍 Location: {mall}, Floor {floor}\n📞 Phone: {phone}\n📧 Email: {email}\n⏰ Hours: {hours}\n\n{description}',
    dealDetails: '🎉 *{title}*\n\n📍 {mall}\n💰 Discount: {discount}\n\n{description}',
    noDeals: 'No active deals right now. Check back soon for new offers!',
    categoryFashion: '👗 Fashion',
    categoryElectronics: '📱 Electronics',
    categorySportswear: '🏃 Sportswear',
    categoryHome: '🏠 Home & Living',
    categoryBeauty: '💄 Beauty',
    categoryBooks: '📚 Books',
    categoryToys: '🧸 Toys',
    categoryFood: '🍔 Food',
    allCategories: '📂 All Categories',
    openNow: '✅ Open Now',
    closedNow: '❌ Closed',
    comingSoon: '🔜 Coming Soon',
    nearbyMalls: '📍 Nearby Malls',
    sendLocation: 'Send your location to find nearby malls.',
    locationReceived: 'Location received! Finding nearby malls...',
    distanceAway: '{distance} km away',
    helpText: '❓ *Help*\n\nAvailable commands:\n\n/start - Main menu\n/malls - Shopping malls\n/stores - Stores directory\n/deals - Current promotions\n/events - Upcoming events\n/cinema - Movie schedules\n/restaurants - Dining options\n/jobs - Career opportunities\n/parking - Parking information\n/tourist - Tourist services\n/language - Change language\n/help - Help menu\n\nFor questions, contact info@megatravelcenter.com.',
    languageChanged: '✅ Language changed!',
    eventsList: '🎫 *Upcoming Events*\n\n',
    noEvents: 'No upcoming events at the moment.',
    cinemaTitle: '🎬 *Cinema Schedule*\n\nSelect a mall to see cinema and entertainment information:',
    restaurantsTitle: '🍽 *Restaurants & Cafes*\n\nSelect a mall to see dining options:',
    jobsTitle: '💼 *Job Opportunities*\n\nVarious positions available at our malls:\n\n• Sales Associates\n• Cashiers\n• Store Managers\n• Security Staff\n• Maintenance Crew\n• Restaurant Staff\n\nSend CV: jobs@megatravelcenter.com\nPhone: +998 (66) 233-30-30',
    parkingTitle: '🚗 *Parking & Logistics*\n\nAt all our malls:\n\n✅ Free parking\n✅ EV charging stations\n✅ 24/7 security\n✅ Disabled parking spots\n\nPublic transport:\n🚌 Bus routes: 5, 12, 18, 24\n🚕 Taxi: Yandex Go, MyTaxi\n\nSelect a mall for details:',
    touristTitle: '🧳 *Tourist Services*\n\nWe offer the following services for tourists:\n\n💱 *Currency Exchange*\nCurrency exchange points at all malls.\n\n💰 *Tax Free*\nTax refund service for foreign visitors.\nMinimum purchase: 200,000 som\n\n🎁 *Uzbek Souvenirs*\nTraditional handicrafts:\n- Suzani (embroidery)\n- Ceramics\n- Silk products\n- Miniature paintings\n- Traditional clothing\n\nℹ️ *Information Centers*\nMultilingual service at every mall.\n\n📞 24/7 Support: +998 (66) 233-30-30',
    searchProducts: '🔍 Search Products',
    productSearch: 'Enter product name:',
    searchResults: '🔍 *Search Results:* {query}\n\n',
    noSearchResults: 'No results found. Try a different search term.',
    productDetails: '🛍 *{name}*\n\n💰 Price: {price}\n🏪 Store: {store}\n📍 Mall: {mall}\n\n{description}',
    reviews: '⭐️ Reviews & Ratings',
    reviewsTitle: '⭐️ *Reviews & Ratings*\n\nShare your feedback about our malls!\n\nSubmit review: reviews@megatravelcenter.com\n\nAverage rating: 4.6/5.0\nTotal reviews: 1,143',
    loyalty: '🎁 Loyalty Program',
    loyaltyTitle: '🎁 *Loyalty Program*\n\nJoin our loyalty program and earn rewards!\n\n✨ Earn points on purchases\n🎫 Get exclusive discounts\n🎉 Invitations to special events\n🎁 Birthday gift\n\nSign up: loyalty@megatravelcenter.com\nPhone: +998 (66) 233-30-30'
  },
  tr: {
    welcome: '🏢 Mega Travel Center botuna hoş geldiniz!\n\nSemerkant\'ın en iyi alışveriş merkezlerini keşfedin. Size şunlarda yardımcı olabilirim:\n\n🏬 Alışveriş merkezleri ve mağazalar\n🎉 Promosyonlar ve indirimler\n🎬 Sinema ve eğlence\n🍽 Restoranlar ve kafeler\n🎫 Etkinlikler ve festivaller\n💼 İş fırsatları\n🚗 Otopark ve lojistik\n🧳 Turist hizmetleri\n\nAşağıdaki menüden seçin veya /help gönderin.',
    mainMenu: '📋 Ana Menü',
    malls: '🏬 Alışveriş Merkezleri',
    stores: '🏪 Mağazalar',
    deals: '🎉 Kampanyalar',
    events: '🎫 Etkinlikler',
    cinema: '🎬 Sinema',
    restaurants: '🍽 Restoranlar',
    jobs: '💼 İş İlanları',
    parking: '🚗 Otopark',
    tourist: '🧳 Turist Bilgileri',
    language: '🌐 Dil',
    help: '❓ Yardım',
    back: '⬅️ Geri',
    viewDetails: '📖 Detaylar',
    getDirections: '🗺 Yol Tarifi',
    callNow: '📞 Ara',
    visitWebsite: '🌐 Web Sitesi',
    shareLocation: '📍 Konumu Paylaş',
    selectMall: 'Bir alışveriş merkezi seçin:',
    selectCategory: 'Kategori seçin:',
    mallDetails: '📍 *{name}*\n\n📍 Adres: {address}\n⏰ Çalışma Saatleri: {hours}\n📞 Telefon: {phone}\n🏪 Mağazalar: {storeCount}\n⭐️ Değerlendirme: {rating}/5.0\n\n{description}',
    storeDetails: '🏪 *{name}*\n\n📍 Konum: {mall}, {floor}. kat\n📞 Telefon: {phone}\n📧 E-posta: {email}\n⏰ Çalışma Saatleri: {hours}\n\n{description}',
    dealDetails: '🎉 *{title}*\n\n📍 {mall}\n💰 İndirim: {discount}\n\n{description}',
    noDeals: 'Şu anda aktif kampanya yok. Yeni teklifler için takipte kalın!',
    categoryFashion: '👗 Moda',
    categoryElectronics: '📱 Elektronik',
    categorySportswear: '🏃 Spor Giyim',
    categoryHome: '🏠 Ev & Yaşam',
    categoryBeauty: '💄 Güzellik',
    categoryBooks: '📚 Kitap',
    categoryToys: '🧸 Oyuncak',
    categoryFood: '🍔 Gıda',
    allCategories: '📂 Tüm Kategoriler',
    openNow: '✅ Açık',
    closedNow: '❌ Kapalı',
    comingSoon: '🔜 Yakında',
    nearbyMalls: '📍 Yakındaki Merkezler',
    sendLocation: 'Yakındaki merkezleri bulmak için konumunuzu gönderin.',
    locationReceived: 'Konum alındı! Yakındaki merkezler aranıyor...',
    distanceAway: '{distance} km uzaklıkta',
    helpText: '❓ *Yardım*\n\nKullanılabilir komutlar:\n\n/start - Ana menü\n/malls - Alışveriş merkezleri\n/stores - Mağazalar\n/deals - Kampanyalar\n/events - Etkinlikler\n/cinema - Sinema\n/restaurants - Restoranlar\n/jobs - İş ilanları\n/parking - Otopark\n/tourist - Turist hizmetleri\n/language - Dil değiştir\n/help - Yardım\n\nSorularınız için: info@megatravelcenter.com',
    languageChanged: '✅ Dil değiştirildi!',
    eventsList: '🎫 *Yaklaşan Etkinlikler*\n\n',
    noEvents: 'Şu anda yaklaşan etkinlik yok.',
    cinemaTitle: '🎬 *Sinema Programı*\n\nSinema ve eğlence bilgisi için bir merkez seçin:',
    restaurantsTitle: '🍽 *Restoranlar ve Kafeler*\n\nYemek seçeneklerini görmek için bir merkez seçin:',
    jobsTitle: '💼 *İş Fırsatları*\n\nMerkezlerimizde çeşitli pozisyonlar:\n\n• Satış Danışmanları\n• Kasiyerler\n• Mağaza Müdürleri\n• Güvenlik Personeli\n• Bakım Ekibi\n• Restoran Personeli\n\nCV gönderin: jobs@megatravelcenter.com\nTelefon: +998 (66) 233-30-30',
    parkingTitle: '🚗 *Otopark ve Lojistik*\n\nTüm merkezlerimizde:\n\n✅ Ücretsiz otopark\n✅ Elektrikli araç şarj istasyonları\n✅ 24/7 güvenlik\n✅ Engelli park yerleri\n\nToplu taşıma:\n🚌 Otobüs hatları: 5, 12, 18, 24\n🚕 Taksi: Yandex Go, MyTaxi\n\nDetaylar için bir merkez seçin:',
    touristTitle: '🧳 *Turist Hizmetleri*\n\nTuristler için sunduğumuz hizmetler:\n\n💱 *Döviz Bozdurma*\nTüm merkezlerde döviz büroları.\n\n💰 *Tax Free*\nYabancı ziyaretçiler için vergi iadesi.\nMinimum alışveriş: 200,000 som\n\n🎁 *Özbek Hediyelikleri*\nGeleneksel el sanatları:\n- Suzani (işleme)\n- Seramik\n- İpek ürünleri\n- Minyatür resimler\n- Geleneksel giysiler\n\nℹ️ *Bilgi Merkezleri*\nHer merkezde çok dilli hizmet.\n\n📞 24/7 Destek: +998 (66) 233-30-30',
    searchProducts: '🔍 Ürün Ara',
    productSearch: 'Ürün adını girin:',
    searchResults: '🔍 *Arama Sonuçları:* {query}\n\n',
    noSearchResults: 'Sonuç bulunamadı. Farklı bir arama yapın.',
    productDetails: '🛍 *{name}*\n\n💰 Fiyat: {price}\n🏪 Mağaza: {store}\n📍 AVM: {mall}\n\n{description}',
    reviews: '⭐️ Yorumlar ve Değerlendirmeler',
    reviewsTitle: '⭐️ *Yorumlar ve Değerlendirmeler*\n\nMerkezlerimiz hakkında görüşlerinizi paylaşın!\n\nYorum gönderin: reviews@megatravelcenter.com\n\nOrtalama puan: 4.6/5.0\nToplam yorum: 1,143',
    loyalty: '🎁 Sadakat Programı',
    loyaltyTitle: '🎁 *Sadakat Programı*\n\nSadakat programımıza katılın ve ödüller kazanın!\n\n✨ Alışverişlerinizde puan kazanın\n🎫 Özel indirimler\n🎉 Özel etkinliklere davetler\n🎁 Doğum günü hediyesi\n\nKayıt: loyalty@megatravelcenter.com\nTelefon: +998 (66) 233-30-30'
  }
};

// Get translation
function t(lang, key) {
  return botTranslations[lang]?.[key] || botTranslations['en'][key] || key;
}

// Get user language
function getUserLanguage(userId) {
  return userLanguages[userId] || 'uz'; // Default to Uzbek
}

// Set user language
function setUserLanguage(userId, lang) {
  userLanguages[userId] = lang;
}

// Format template string
function formatString(template, values) {
  return template.replace(/{(\w+)}/g, (match, key) => values[key] || match);
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get mall status
function getMallStatus(mall) {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;
  
  const [openHour, openMin] = mall.openTime.split(':').map(Number);
  const [closeHour, closeMin] = mall.closeTime.split(':').map(Number);
  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;
  
  return currentTime >= openTime && currentTime < closeTime;
}

// Main menu keyboard
function getMainMenuKeyboard(lang) {
  return {
    keyboard: [
      [{ text: t(lang, 'malls') }, { text: t(lang, 'stores') }],
      [{ text: t(lang, 'deals') }, { text: t(lang, 'events') }],
      [{ text: t(lang, 'cinema') }, { text: t(lang, 'restaurants') }],
      [{ text: t(lang, 'jobs') }, { text: t(lang, 'parking') }],
      [{ text: t(lang, 'tourist') }, { text: t(lang, 'reviews') }],
      [{ text: t(lang, 'loyalty') }, { text: t(lang, 'searchProducts') }],
      [{ text: t(lang, 'language') }, { text: t(lang, 'help') }]
    ],
    resize_keyboard: true
  };
}

// Language selection keyboard
function getLanguageKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '🇺🇿 O\'zbek', callback_data: 'lang_uz' },
        { text: '🇷🇺 Русский', callback_data: 'lang_ru' }
      ],
      [
        { text: '🇬🇧 English', callback_data: 'lang_en' },
        { text: '🇹🇷 Türkçe', callback_data: 'lang_tr' }
      ]
    ]
  };
}

// Mall list inline keyboard
function getMallsKeyboard(lang) {
  const openMalls = malls.filter(m => m.status === 'open');
  const keyboard = [];
  
  for (let i = 0; i < openMalls.length; i += 2) {
    const row = [];
    row.push({ text: openMalls[i].name, callback_data: `mall_${openMalls[i].id}` });
    if (i + 1 < openMalls.length) {
      row.push({ text: openMalls[i + 1].name, callback_data: `mall_${openMalls[i + 1].id}` });
    }
    keyboard.push(row);
  }
  
  keyboard.push([{ text: t(lang, 'back'), callback_data: 'back_main' }]);
  
  return { inline_keyboard: keyboard };
}

// Store categories keyboard
function getCategoriesKeyboard(lang) {
  const categories = [...new Set(stores.map(s => s.category))];
  const keyboard = [];
  
  const categoryIcons = {
    'Fashion': '👗',
    'Electronics': '📱',
    'Sportswear': '🏃',
    'Home': '🏠',
    'Beauty': '💄',
    'Books': '📚',
    'Toys': '🧸',
    'Food': '🍔'
  };
  
  for (let i = 0; i < categories.length; i += 2) {
    const row = [];
    const icon1 = categoryIcons[categories[i]] || '🏪';
    row.push({ text: `${icon1} ${categories[i]}`, callback_data: `cat_${categories[i]}` });
    if (i + 1 < categories.length) {
      const icon2 = categoryIcons[categories[i + 1]] || '🏪';
      row.push({ text: `${icon2} ${categories[i + 1]}`, callback_data: `cat_${categories[i + 1]}` });
    }
    keyboard.push(row);
  }
  
  keyboard.push([{ text: t(lang, 'back'), callback_data: 'back_main' }]);
  
  return { inline_keyboard: keyboard };
}

// Store details keyboard
function getStoreDetailsKeyboard(storeId, lang) {
  return {
    inline_keyboard: [
      [
        { text: t(lang, 'viewDetails'), callback_data: `store_details_${storeId}` },
        { text: t(lang, 'callNow'), callback_data: `store_call_${storeId}` }
      ],
      [{ text: t(lang, 'back'), callback_data: 'back_stores' }]
    ]
  };
}

// Mall details keyboard
function getMallDetailsKeyboard(mallId, lang) {
  const mall = malls.find(m => m.id === mallId);
  const keyboard = [
    [
      { text: t(lang, 'getDirections'), url: `https://maps.google.com/?q=${mall.coordinates[0]},${mall.coordinates[1]}` }
    ]
  ];
  
  if (mall.phone) {
    keyboard.push([{ text: t(lang, 'callNow'), url: `tel:${mall.phone}` }]);
  }
  
  if (mall.website) {
    keyboard.push([{ text: t(lang, 'visitWebsite'), url: `https://${mall.website}` }]);
  }
  
  keyboard.push([{ text: t(lang, 'back'), callback_data: 'back_malls' }]);
  
  return { inline_keyboard: keyboard };
}

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  
  bot.sendMessage(chatId, t(lang, 'welcome'), {
    reply_markup: getMainMenuKeyboard(lang),
    parse_mode: 'Markdown'
  });
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  
  bot.sendMessage(chatId, t(lang, 'helpText'), {
    reply_markup: getMainMenuKeyboard(lang),
    parse_mode: 'Markdown'
  });
});

// Handle /language command
bot.onText(/\/language/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, '🌐 Select your language / Выберите язык / Tilni tanlang / Dil seçin:', {
    reply_markup: getLanguageKeyboard()
  });
});

// Handle /malls command
bot.onText(/\/malls/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  
  bot.sendMessage(chatId, t(lang, 'selectMall'), {
    reply_markup: getMallsKeyboard(lang)
  });
});

// Handle /stores command
bot.onText(/\/stores/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  
  bot.sendMessage(chatId, t(lang, 'selectCategory'), {
    reply_markup: getCategoriesKeyboard(lang)
  });
});

// Handle /deals command
bot.onText(/\/deals/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  
  const dealsStores = stores.filter(s => s.hasPromo);
  
  if (dealsStores.length === 0) {
    bot.sendMessage(chatId, t(lang, 'noDeals'), {
      reply_markup: getMainMenuKeyboard(lang)
    });
    return;
  }
  
  let message = `${t(lang, 'deals')}\n\n`;
  
  dealsStores.forEach((store, index) => {
    const mall = malls.find(m => m.id === store.mallId);
    message += `${index + 1}. 🎉 *${store.promoTitle}*\n`;
    message += `   🏪 ${store.name}\n`;
    message += `   📍 ${mall.name}\n`;
    message += `   💰 ${store.promoDiscount}\n`;
    message += `   ${store.promoDescription}\n\n`;
  });
  
  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(lang)
  });
});

// Handle /events command
bot.onText(/\/events/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  
  // Sample events data
  const events = [
    {
      title: 'Grand Opening - Next Mall',
      date: '2025-06-15',
      mall: 'Next Mall',
      description: 'Be part of the future! Grand opening with special performances and exclusive offers.'
    },
    {
      title: 'Summer Fashion Show',
      date: '2024-07-20',
      mall: 'Family Park Mall',
      description: 'Latest fashion trends from top designers. Free entry!'
    },
    {
      title: 'Food Festival',
      date: '2024-08-10',
      mall: 'Festival Mall',
      description: 'Taste cuisines from around the world. Live music and cooking masterclasses.'
    }
  ];
  
  let message = t(lang, 'eventsList');
  
  events.forEach((event, index) => {
    message += `${index + 1}. 🎫 *${event.title}*\n`;
    message += `   📅 ${event.date}\n`;
    message += `   📍 ${event.mall}\n`;
    message += `   ${event.description}\n\n`;
  });
  
  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(lang)
  });
});

// Handle /cinema command
bot.onText(/\/cinema/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  
  bot.sendMessage(chatId, t(lang, 'cinemaTitle'), {
    reply_markup: getMallsKeyboard(lang),
    parse_mode: 'Markdown'
  });
});

// Handle /restaurants command
bot.onText(/\/restaurants/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  
  bot.sendMessage(chatId, t(lang, 'restaurantsTitle'), {
    reply_markup: getMallsKeyboard(lang),
    parse_mode: 'Markdown'
  });
});

// Handle /jobs command
bot.onText(/\/jobs/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  
  bot.sendMessage(chatId, t(lang, 'jobsTitle'), {
    reply_markup: getMainMenuKeyboard(lang),
    parse_mode: 'Markdown'
  });
});

// Handle /parking command
bot.onText(/\/parking/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  
  bot.sendMessage(chatId, t(lang, 'parkingTitle'), {
    reply_markup: getMallsKeyboard(lang),
    parse_mode: 'Markdown'
  });
});

// Handle /tourist command
bot.onText(/\/tourist/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  
  bot.sendMessage(chatId, t(lang, 'touristTitle'), {
    reply_markup: getMainMenuKeyboard(lang),
    parse_mode: 'Markdown'
  });
});

// Handle text messages (menu buttons)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const lang = getUserLanguage(chatId);
  
  // Skip if it's a command
  if (text && text.startsWith('/')) return;
  
  // Handle menu buttons
  if (text === t(lang, 'malls')) {
    bot.sendMessage(chatId, t(lang, 'selectMall'), {
      reply_markup: getMallsKeyboard(lang)
    });
  } else if (text === t(lang, 'stores')) {
    bot.sendMessage(chatId, t(lang, 'selectCategory'), {
      reply_markup: getCategoriesKeyboard(lang)
    });
  } else if (text === t(lang, 'deals')) {
    bot.sendMessage(chatId, '🎉 Loading deals...', {
      reply_markup: getMainMenuKeyboard(lang)
    });
    setTimeout(() => {
      bot.sendMessage(chatId, '/deals');
    }, 500);
  } else if (text === t(lang, 'events')) {
    bot.sendMessage(chatId, '/events');
  } else if (text === t(lang, 'cinema')) {
    bot.sendMessage(chatId, t(lang, 'cinemaTitle'), {
      reply_markup: getMallsKeyboard(lang),
      parse_mode: 'Markdown'
    });
  } else if (text === t(lang, 'restaurants')) {
    bot.sendMessage(chatId, t(lang, 'restaurantsTitle'), {
      reply_markup: getMallsKeyboard(lang),
      parse_mode: 'Markdown'
    });
  } else if (text === t(lang, 'jobs')) {
    bot.sendMessage(chatId, t(lang, 'jobsTitle'), {
      reply_markup: getMainMenuKeyboard(lang),
      parse_mode: 'Markdown'
    });
  } else if (text === t(lang, 'parking')) {
    bot.sendMessage(chatId, t(lang, 'parkingTitle'), {
      reply_markup: getMallsKeyboard(lang),
      parse_mode: 'Markdown'
    });
  } else if (text === t(lang, 'tourist')) {
    bot.sendMessage(chatId, t(lang, 'touristTitle'), {
      reply_markup: getMainMenuKeyboard(lang),
      parse_mode: 'Markdown'
    });
  } else if (text === t(lang, 'language')) {
    bot.sendMessage(chatId, '🌐 Select your language / Выберите язык / Tilni tanlang / Dil seçin:', {
      reply_markup: getLanguageKeyboard()
    });
  } else if (text === t(lang, 'help')) {
    bot.sendMessage(chatId, t(lang, 'helpText'), {
      reply_markup: getMainMenuKeyboard(lang),
      parse_mode: 'Markdown'
    });
  } else if (text === t(lang, 'reviews')) {
    bot.sendMessage(chatId, t(lang, 'reviewsTitle'), {
      reply_markup: getMainMenuKeyboard(lang),
      parse_mode: 'Markdown'
    });
  } else if (text === t(lang, 'loyalty')) {
    bot.sendMessage(chatId, t(lang, 'loyaltyTitle'), {
      reply_markup: getMainMenuKeyboard(lang),
      parse_mode: 'Markdown'
    });
  } else if (text === t(lang, 'searchProducts')) {
    bot.sendMessage(chatId, t(lang, 'productSearch'), {
      reply_markup: {
        force_reply: true
      }
    });
  }
  
  // Handle location
  if (msg.location) {
    const userLat = msg.location.latitude;
    const userLon = msg.location.longitude;
    
    bot.sendMessage(chatId, t(lang, 'locationReceived'));
    
    // Calculate distances and sort
    const mallsWithDistance = malls
      .filter(m => m.status === 'open')
      .map(mall => ({
        ...mall,
        distance: calculateDistance(userLat, userLon, mall.coordinates[0], mall.coordinates[1])
      }))
      .sort((a, b) => a.distance - b.distance);
    
    let message = `${t(lang, 'nearbyMalls')}\n\n`;
    
    mallsWithDistance.slice(0, 5).forEach((mall, index) => {
      const status = getMallStatus(mall) ? t(lang, 'openNow') : t(lang, 'closedNow');
      message += `${index + 1}. 🏬 *${mall.name}*\n`;
      message += `   📍 ${formatString(t(lang, 'distanceAway'), { distance: mall.distance.toFixed(1) })}\n`;
      message += `   ${status}\n\n`;
    });
    
    bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: getMainMenuKeyboard(lang)
    });
  }
  
  // Handle product search
  if (msg.reply_to_message && msg.reply_to_message.text === t(lang, 'productSearch')) {
    const searchQuery = text.toLowerCase();
    const results = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery) || 
      p.description.toLowerCase().includes(searchQuery)
    );
    
    if (results.length === 0) {
      bot.sendMessage(chatId, t(lang, 'noSearchResults'), {
        reply_markup: getMainMenuKeyboard(lang)
      });
      return;
    }
    
    let message = formatString(t(lang, 'searchResults'), { query: text }) + '\n';
    
    results.slice(0, 10).forEach((product, index) => {
      const store = stores.find(s => s.id === product.storeId);
      const mall = malls.find(m => m.id === store.mallId);
      message += `${index + 1}. 🛍 *${product.name}*\n`;
      message += `   💰 ${product.price.toLocaleString()} so'm\n`;
      message += `   🏪 ${store.name} - ${mall.name}\n\n`;
    });
    
    bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: getMainMenuKeyboard(lang)
    });
  }
});

// Handle callback queries
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const lang = getUserLanguage(chatId);
  
  // Language selection
  if (data.startsWith('lang_')) {
    const selectedLang = data.replace('lang_', '');
    setUserLanguage(chatId, selectedLang);
    
    bot.editMessageText(t(selectedLang, 'languageChanged'), {
      chat_id: chatId,
      message_id: query.message.message_id
    });
    
    setTimeout(() => {
      bot.sendMessage(chatId, t(selectedLang, 'welcome'), {
        reply_markup: getMainMenuKeyboard(selectedLang),
        parse_mode: 'Markdown'
      });
    }, 1000);
    
    bot.answerCallbackQuery(query.id);
    return;
  }
  
  // Mall selection
  if (data.startsWith('mall_')) {
    const mallId = data.replace('mall_', '');
    const mall = malls.find(m => m.id === mallId);
    
    if (mall) {
      const status = getMallStatus(mall) ? t(lang, 'openNow') : t(lang, 'closedNow');
      const message = formatString(t(lang, 'mallDetails'), {
        name: mall.name,
        address: mall.address,
        hours: mall.hours,
        phone: mall.phone,
        storeCount: mall.storeCount,
        rating: mall.rating,
        description: mall.description
      }) + `\n\n${status}`;
      
      // Send mall image
      bot.sendPhoto(chatId, mall.image, {
        caption: message,
        parse_mode: 'Markdown',
        reply_markup: getMallDetailsKeyboard(mallId, lang)
      });
    }
    
    bot.answerCallbackQuery(query.id);
    return;
  }
  
  // Category selection
  if (data.startsWith('cat_')) {
    const category = data.replace('cat_', '');
    const categoryStores = stores.filter(s => s.category === category);
    
    let message = `🏪 *${category}*\n\n`;
    
    categoryStores.forEach((store, index) => {
      const mall = malls.find(m => m.id === store.mallId);
      message += `${index + 1}. *${store.name}*\n`;
      message += `   📍 ${mall.name}, Floor ${store.floor}\n`;
      if (store.hasPromo) {
        message += `   🎉 ${store.promoDiscount}\n`;
      }
      message += `\n`;
    });
    
    bot.editMessageText(message, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: t(lang, 'back'), callback_data: 'back_stores' }]
        ]
      }
    });
    
    bot.answerCallbackQuery(query.id);
    return;
  }
  
  // Back buttons
  if (data === 'back_main') {
    bot.deleteMessage(chatId, query.message.message_id);
    bot.sendMessage(chatId, t(lang, 'mainMenu'), {
      reply_markup: getMainMenuKeyboard(lang)
    });
    bot.answerCallbackQuery(query.id);
    return;
  }
  
  if (data === 'back_malls') {
    bot.editMessageText(t(lang, 'selectMall'), {
      chat_id: chatId,
      message_id: query.message.message_id,
      reply_markup: getMallsKeyboard(lang)
    });
    bot.answerCallbackQuery(query.id);
    return;
  }
  
  if (data === 'back_stores') {
    bot.editMessageText(t(lang, 'selectCategory'), {
      chat_id: chatId,
      message_id: query.message.message_id,
      reply_markup: getCategoriesKeyboard(lang)
    });
    bot.answerCallbackQuery(query.id);
    return;
  }
  
  bot.answerCallbackQuery(query.id);
});

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('✅ Bot is ready! Send /start to begin.');
