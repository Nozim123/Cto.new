require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ========================================
// DATA LOADING
// ========================================

// Load mall/store/product data
const malls = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/malls.json'), 'utf8'));
const stores = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/stores.json'), 'utf8'));
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/products.json'), 'utf8'));

// Bot data directory
const BOT_DATA_DIR = path.join(__dirname, 'bot_data');

// Ensure bot_data directory exists
if (!fs.existsSync(BOT_DATA_DIR)) {
  fs.mkdirSync(BOT_DATA_DIR, { recursive: true });
}

// Helper to load JSON data
function loadData(filename) {
  const filePath = path.join(BOT_DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return filename.includes('.json') && !filename.includes('analytics') ? [] : {};
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return filename.includes('.json') && !filename.includes('analytics') ? [] : {};
  }
}

// Helper to save JSON data
function saveData(filename, data) {
  const filePath = path.join(BOT_DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Load bot data
let users = loadData('users.json');
let favorites = loadData('favorites.json');
let reviews = loadData('reviews.json');
let loyalty = loadData('loyalty.json');
let notifications = loadData('notifications.json');
let orders = loadData('orders.json');
let adminUsers = loadData('admin_users.json');
let analytics = loadData('analytics.json');
let supportTickets = loadData('support_tickets.json');

// Bot token
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';

// Create bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 Mega Travel Center Bot (Enterprise Edition) is running...');

// User language preferences (in-memory, merged with user profiles)
const userLanguages = {};

// User sessions (for multi-step interactions)
const userSessions = {};

// ========================================
// TRANSLATIONS
// ========================================

const botTranslations = {
  uz: {
    // Core messages
    welcome: '🏢 *Mega Travel Center botiga xush kelibsiz!*\n\n' +
             'Samarkandning eng katta raqamli savdo markazi yordamchisi.\n\n' +
             '✨ *Quyidagi xizmatlardan foydalaning:*\n\n' +
             '🏬 Savdo markazlari va do\'konlar\n' +
             '🎉 Aksiyalar va chegirmalar\n' +
             '⭐️ Sevimlilar ro\'yxati\n' +
             '🛍 Mahsulotlarni izlash va topish\n' +
             '💎 Sodiqlik dasturi va bonuslar\n' +
             '🎫 Tadbirlar va festivallar\n' +
             '🎬 Kino va ko\'ngilochar joylar\n' +
             '🍽 Restoran va kafe\n' +
             '💼 Ish o\'rinlari\n' +
             '🚗 Avtomobil joylari\n' +
             '🧳 Sayohatchilar uchun xizmatlar\n' +
             '📞 Yordam va qo\'llab-quvvatlash\n\n' +
             '_Boshlash uchun quyidagi menyudan tanlang._',
    welcomeBack: '👋 Qaytganingizdan xursandmiz, {name}!',
    guestMode: '👤 Mehmon rejimi',
    registerPrompt: '📝 *Ro\'yxatdan o\'tish*\n\nBarcha xizmatlardan to\'liq foydalanish uchun ro\'yxatdan o\'ting!\n\n✨ Telefon raqamingizni kiriting yoki quyidagi tugmani bosing.',
    phoneButton: '📱 Telefon raqamini ulashish',
    skipRegistration: '⏭ Mehmon sifatida davom etish',
    registrationSuccess: '✅ Ro\'yxatdan o\'tdingiz! Xush kelibsiz, {name}!',
    
    // Main menu
    mainMenu: '📋 Asosiy menyu',
    malls: '🏬 Savdo markazlari',
    stores: '🏪 Do\'konlar',
    products: '📦 Mahsulotlar',
    deals: '🎉 Aksiyalar',
    favorites: '⭐️ Sevimlilar',
    mallMap: '🗺 Xarita',
    events: '🎫 Tadbirlar',
    support: '📞 Qo\'llab-quvvatlash',
    settings: '⚙️ Sozlamalar',
    cinema: '🎬 Kino',
    restaurants: '🍽 Restoranlar',
    jobs: '💼 Ish o\'rinlari',
    parking: '🚗 Avtomobil joylari',
    tourist: '🧳 Sayohatchilar uchun',
    language: '🌐 Til',
    help: '❓ Yordam',
    reviews: '⭐️ Sharhlar',
    loyalty: '🎁 Sodiqlik',
    searchProducts: '🔍 Mahsulot qidirish',
    myProfile: '👤 Profilim',
    myOrders: '📦 Buyurtmalarim',
    notifications: '🔔 Bildirishnomalar',
    
    // Navigation
    back: '⬅️ Orqaga',
    cancel: '❌ Bekor qilish',
    confirm: '✅ Tasdiqlash',
    next: '➡️ Keyingi',
    previous: '⬅️ Oldingi',
    viewDetails: '📖 Tafsilotlar',
    getDirections: '🗺 Yo\'nalish',
    callNow: '📞 Qo\'ng\'iroq',
    visitWebsite: '🌐 Veb-sayt',
    shareLocation: '📍 Joylashuvni ulashish',
    
    // Mall related
    selectMall: 'Savdo markazini tanlang:',
    mallDetails: '📍 *{name}*\n\n' +
                 '📍 Manzil: {address}\n' +
                 '⏰ Ish vaqti: {hours}\n' +
                 '📞 Telefon: {phone}\n' +
                 '🏪 Do\'konlar: {storeCount}\n' +
                 '⭐️ Reyting: {rating}/5.0\n\n' +
                 '{description}\n\n' +
                 '_Hozirgi holat: {status}_',
    openNow: '✅ Ochiq',
    closedNow: '❌ Yopiq',
    comingSoon: '🔜 Tez orada',
    nearbyMalls: '📍 Yaqin atrofdagi savdo markazlari',
    sendLocation: 'Yaqin atrofdagi savdo markazlarini topish uchun joylashuvingizni yuboring.',
    locationReceived: 'Joylashuvingiz qabul qilindi! Yaqin atrofdagi savdo markazlarni topmoqda...',
    distanceAway: '{distance} km uzoqlikda',
    
    // Store related
    selectCategory: 'Kategoriyani tanlang:',
    storeDetails: '🏪 *{name}*\n\n' +
                  '📍 Joylashuv: {mall}, {floor}-qavat\n' +
                  '📞 Telefon: {phone}\n' +
                  '📧 Email: {email}\n' +
                  '⏰ Ish vaqti: {hours}\n' +
                  '⭐️ Reyting: {rating}/5.0\n\n' +
                  '{description}',
    viewProducts: '🛍 Mahsulotlarni ko\'rish',
    addToFavorites: '⭐️ Sevimlilarga qo\'shish',
    removeFromFavorites: '💔 Sevimlilardan olib tashlash',
    addedToFavorites: '✅ Sevimlilarga qo\'shildi!',
    removedFromFavorites: '✅ Sevimlilardan olib tashlandi!',
    
    // Categories
    categoryFashion: '👗 Moda',
    categoryElectronics: '📱 Elektronika',
    categorySportswear: '🏃 Sport kiyimlari',
    categoryHome: '🏠 Uy jihozlari',
    categoryBeauty: '💄 Go\'zallik',
    categoryBooks: '📚 Kitoblar',
    categoryToys: '🧸 O\'yinchoqlar',
    categoryFood: '🍔 Oziq-ovqat',
    allCategories: '📂 Barcha kategoriyalar',
    
    // Products
    productDetails: '🛍 *{name}*\n\n' +
                    '💰 Narx: {price}\n' +
                    '🏪 Do\'kon: {store}\n' +
                    '📍 Savdo markazi: {mall}\n' +
                    '📦 Mavjudligi: {availability}\n' +
                    '⭐️ Reyting: {rating}/5.0\n\n' +
                    '{description}\n\n' +
                    '_SKU: {sku}_',
    available: '✅ Mavjud',
    outOfStock: '❌ Tugagan',
    limitedStock: '⚠️ Cheklangan miqdorda',
    productSearch: '🔍 Mahsulot nomini yozing:',
    searchResults: '🔍 *Qidiruv natijalari:* {query}\n\n',
    noSearchResults: 'Hech narsa topilmadi. Boshqa so\'z bilan urinib ko\'ring.',
    orderPickup: '📦 Buyurtma berish',
    checkAvailability: '✅ Mavjudligini tekshirish',
    viewInWebsite: '🌐 Veb-saytda ko\'rish',
    
    // Deals & Promotions
    dealDetails: '🎉 *{title}*\n\n' +
                 '📍 {mall}\n' +
                 '💰 Chegirma: {discount}\n' +
                 '⏰ Amal qilish muddati: {validUntil}\n\n' +
                 '{description}',
    noDeals: 'Hozirda faol aksiyalar yo\'q. Tez orada yangi takliflar uchun kuzatib boring!',
    flashSale: '⚡️ TEZKOR SAVDO',
    limitedOffer: '⏰ Cheklangan taklit',
    exclusiveForMembers: '💎 A\'zolar uchun eksklyuziv',
    
    // Favorites
    myFavorites: '⭐️ *Mening sevimlilarim*\n\nSiz sevimli qilib qo\'shgan:',
    noFavorites: 'Sevimlilar ro\'yxati bo\'sh. Sevimli do\'konlar va mahsulotlarni qo\'shib boshlang!',
    favoriteMalls: '🏬 Sevimli savdo markazlari',
    favoriteStores: '🏪 Sevimli do\'konlar',
    favoriteProducts: '🛍 Sevimli mahsulotlar',
    
    // Loyalty Program
    loyaltyTitle: '🎁 *Sodiqlik Dasturi*\n\n' +
                  'Sizning darajangiz: *{tier}*\n' +
                  '💎 Ballaringiz: *{points}*\n' +
                  '🎯 Keyingi daraja uchun: {pointsToNext} ball\n\n' +
                  '✨ *Imkoniyatlar:*\n' +
                  '• Xarid qilganingizda ball to\'plang\n' +
                  '• Eksklyuziv chegirmalarga ega bo\'ling\n' +
                  '• Maxsus takliflar va tadbirlarga taklif\n' +
                  '• Tug\'ilgan kuningizda sovg\'a\n\n' +
                  '_Har 1000 so\'m uchun 10 ball oling!_',
    tierBronze: '🥉 Bronza',
    tierSilver: '🥈 Kumush',
    tierGold: '🥇 Oltin',
    tierPlatinum: '💎 Platina',
    earnPoints: '💎 Ball to\'plash',
    redeemRewards: '🎁 Mukofotlarni olish',
    viewRewards: '🎁 Mukofotlarni ko\'rish',
    
    // Orders & Pickup
    myOrdersTitle: '📦 *Mening buyurtmalarim*',
    noOrders: 'Hech qanday buyurtmangiz yo\'q.',
    createPickupOrder: '📦 Buyurtma yaratish',
    orderCreated: '✅ Buyurtma yaratildi!\n\nBuyurtma ID: {orderId}\n\nDo\'konga borib, quyidagi QR kodni ko\'rsating:',
    pickupInstructions: '📦 *Olish bo\'yicha ko\'rsatmalar:*\n\n' +
                       '1. Do\'konga boring: {store}\n' +
                       '2. QR kodni ko\'rsating\n' +
                       '3. Mahsulotni oling va to\'lang\n\n' +
                       '⏰ Buyurtma 24 soat davomida saqlanadi.',
    orderStatus: 'Holati: {status}',
    orderPending: '⏳ Kutilmoqda',
    orderReady: '✅ Tayyor',
    orderCompleted: '✅ Tugallandi',
    orderCancelled: '❌ Bekor qilindi',
    
    // Reviews & Ratings
    reviewsTitle: '⭐️ *Sharhlar va Baholash*\n\n' +
                  'Bizning savdo markazlarimiz haqida fikringizni bildiring!\n\n' +
                  'O\'rtacha reyting: 4.6/5.0\n' +
                  'Umumiy sharhlar: {count}',
    writeReview: '✍️ Sharh yozish',
    selectRating: 'Bahoingizni tanlang (1-5 yulduz):',
    reviewPrompt: 'Sharhingizni yozing:',
    reviewSubmitted: '✅ Sharhingiz qabul qilindi! Rahmat!',
    viewReviews: '📖 Sharhlarni ko\'rish',
    reportIssue: '⚠️ Muammoni bildirish',
    
    // Events
    eventsList: '🎫 *Yaqinlashib kelayotgan tadbirlar*\n\n',
    noEvents: 'Hozirda yaqinlashib kelayotgan tadbirlar yo\'q.',
    eventDetails: '🎫 *{title}*\n\n' +
                  '📅 Sana: {date}\n' +
                  '⏰ Vaqt: {time}\n' +
                  '📍 Joylashuv: {location}\n' +
                  '💰 Narx: {price}\n\n' +
                  '{description}',
    registerForEvent: '📝 Ro\'yxatdan o\'tish',
    eventRegistered: '✅ Tadbirga ro\'yxatdan o\'tdingiz!',
    
    // Cinema
    cinemaTitle: '🎬 *Kino Jadvali*\n\n' +
                 'Kinolar va ko\'ngilochar joylar haqida ma\'lumot olish uchun savdo markazini tanlang:',
    movieSchedule: '🎬 *{movie}*\n\n' +
                   '⏰ Seanslar: {showtimes}\n' +
                   '💰 Narx: {price}\n' +
                   '🎭 Janr: {genre}\n\n' +
                   '{description}',
    bookTicket: '🎟 Chipta olish',
    
    // Restaurants
    restaurantsTitle: '🍽 *Restoranlar va Kafe*\n\n' +
                      'Ovqatlanish joylarini ko\'rish uchun savdo markazini tanlang:',
    restaurantDetails: '🍽 *{name}*\n\n' +
                       '📍 {location}\n' +
                       '🍴 Oshxona: {cuisine}\n' +
                       '💰 O\'rtacha narx: {priceRange}\n' +
                       '⭐️ Reyting: {rating}/5.0\n\n' +
                       '{description}',
    viewMenu: '📋 Menyuni ko\'rish',
    makeReservation: '🔖 Buyurtma qilish',
    
    // Jobs
    jobsTitle: '💼 *Ish O\'rinlari*\n\n' +
               'Bizning savdo markazlarimizda turli xil ish imkoniyatlari mavjud:\n\n' +
               '• Sotuvchilar\n' +
               '• Kassirlar\n' +
               '• Menejerlar\n' +
               '• Xavfsizlik xodimlari\n' +
               '• Tozalovchi xodimlar\n' +
               '• Restoran xodimlari\n\n' +
               'CV yuborish: jobs@megatravelcenter.com\n' +
               'Telefon: +998 (66) 233-30-30',
    viewJobs: '💼 Ish o\'rinlarini ko\'rish',
    applyForJob: '📝 Ariza yuborish',
    
    // Parking
    parkingTitle: '🚗 *Avtomobil Joylari va Logistika*\n\n' +
                  'Barcha savdo markazlarimizda:\n\n' +
                  '✅ Bepul avtomobil joylari\n' +
                  '✅ Elektr avtomashinalar uchun quvvatlash\n' +
                  '✅ 24/7 xavfsizlik\n' +
                  '✅ Nogironlar uchun maxsus joylar\n\n' +
                  'Jamoat transporti:\n' +
                  '🚌 Avtobus: 5, 12, 18, 24\n' +
                  '🚕 Taksi: Yandex Go, MyTaxi',
    findParking: '🅿️ Avtomobil joyini topish',
    parkingAvailability: '🅿️ *Avtomobil joylari*\n\n' +
                        '{mall}\n' +
                        'Mavjud joylar: {available}/{total}\n' +
                        'Holati: {status}',
    
    // Tourist Services
    touristTitle: '🧳 *Sayohatchilar Uchun Xizmatlar*\n\n' +
                  'Biz sayohatchilarga quyidagi xizmatlarni taklif qilamiz:\n\n' +
                  '💱 *Valyuta Ayirboshlash*\n' +
                  'Barcha savdo markazlarida valyuta ayirboshlash punktlari mavjud.\n\n' +
                  '💰 *Tax Free (Soliqa Qaytarish)*\n' +
                  'Xorijiy mehmonlar uchun Tax Free xizmati.\n' +
                  'Minimal xarid: 200,000 so\'m\n\n' +
                  '🎁 *O\'zbek Suvenerlari*\n' +
                  'An\'anaviy hunarmandchilik mahsulotlari\n\n' +
                  'ℹ️ *Ma\'lumot Markazlari*\n' +
                  'Har bir savdo markazida ko\'p tilli xizmat.\n\n' +
                  '📞 24/7 Yordam: +998 (66) 233-30-30',
    currencyExchange: '💱 Valyuta kurslari',
    taxFreeInfo: '💰 Tax Free haqida',
    souvenirShops: '🎁 Suvenir do\'konlari',
    
    // Support & Help
    helpText: '❓ *Yordam*\n\n' +
              'Mavjud buyruqlar:\n\n' +
              '/start - Asosiy menyu\n' +
              '/malls - Savdo markazlari\n' +
              '/stores - Do\'konlar\n' +
              '/products - Mahsulotlar\n' +
              '/deals - Aksiyalar\n' +
              '/favorites - Sevimlilar\n' +
              '/events - Tadbirlar\n' +
              '/cinema - Kino\n' +
              '/restaurants - Restoranlar\n' +
              '/jobs - Ish o\'rinlari\n' +
              '/parking - Avtomobil joylari\n' +
              '/tourist - Sayohatchilar uchun\n' +
              '/loyalty - Sodiqlik dasturi\n' +
              '/myorders - Buyurtmalarim\n' +
              '/profile - Profilim\n' +
              '/language - Tilni o\'zgartirish\n' +
              '/help - Yordam\n\n' +
              'Savol yoki muammo bo\'lsa:\n' +
              '📧 info@megatravelcenter.com\n' +
              '📞 +998 (66) 233-30-30',
    supportMenu: '📞 *Qo\'llab-quvvatlash*\n\n' +
                 'Bizga qanday yordam bera olamiz?',
    contactSupport: '💬 Qo\'llab-quvvatlash bilan bog\'lanish',
    faq: '❓ Ko\'p so\'raladigan savollar',
    liveChat: '💬 Jonli suhbat',
    createTicket: '🎫 Muammo bildirish',
    ticketCreated: '✅ Murojaatingiz qabul qilindi!\n\nTicket ID: {ticketId}\n\nBiz tez orada javob beramiz.',
    
    // Settings
    settingsMenu: '⚙️ *Sozlamalar*',
    changeLanguage: '🌐 Tilni o\'zgartirish',
    notificationSettings: '🔔 Bildirishnomalar',
    enableNotifications: '🔔 Bildirishnomalarni yoqish',
    disableNotifications: '🔕 Bildirishnomalarni o\'chirish',
    notificationsEnabled: '✅ Bildirishnomalar yoqildi!',
    notificationsDisabled: '✅ Bildirishnomalar o\'chirildi!',
    deleteAccount: '🗑 Hisobni o\'chirish',
    accountDeleted: '✅ Hisobingiz o\'chirildi.',
    
    // Notifications
    newDealNotification: '🎉 *Yangi aksiya!*\n\n{title}\n\n{description}',
    priceDrop: '💰 *Narx tushdi!*\n\n{product}\n\nEski narx: {oldPrice}\nYangi narx: {newPrice}',
    newArrival: '✨ *Yangi mahsulot!*\n\n{product} endi mavjud!\n\n{store}',
    eventReminder: '🎫 *Tadbir eslatmasi*\n\n{event} bugun soat {time}da boshlanadi!',
    loyaltyReward: '🎁 *Yangi mukofot!*\n\nSiz {points} ball to\'pladingiz!\n\n{reward}',
    
    // Admin commands
    adminMenu: '👨‍💼 *Admin Panel*\n\n' +
               'Tanlang:',
    adminOnly: '⛔️ Bu buyruq faqat adminlar uchun.',
    addMall: '➕ Savdo markazi qo\'shish',
    editMall: '✏️ Savdo markazini tahrirlash',
    addStore: '➕ Do\'kon qo\'shish',
    editStore: '✏️ Do\'konni tahrirlash',
    addProduct: '➕ Mahsulot qo\'shish',
    editProduct: '✏️ Mahsulotni tahrirlash',
    addPromotion: '➕ Aksiya qo\'shish',
    broadcastMessage: '📢 Xabar yuborish (barcha foydalanuvchilarga)',
    viewAnalytics: '📊 Statistikani ko\'rish',
    userManagement: '👥 Foydalanuvchilarni boshqarish',
    contentModeration: '🛡 Moderatsiya',
    broadcastSent: '✅ Xabar {count} foydalanuvchiga yuborildi!',
    
    // Analytics
    analyticsReport: '📊 *Statistika*\n\n' +
                    'Jami foydalanuvchilar: {totalUsers}\n' +
                    'Faol foydalanuvchilar: {activeUsers}\n' +
                    'Jami buyurtmalar: {totalOrders}\n' +
                    'Jami sharhlar: {totalReviews}\n\n' +
                    '*Top savdo markazlari:*\n{topMalls}\n\n' +
                    '*Top do\'konlar:*\n{topStores}',
    
    // Misc
    languageChanged: '✅ Til o\'zgartirildi!',
    comingSoonFeature: '🔜 Bu funksiya tez orada qo\'shiladi!',
    errorOccurred: '❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.',
    invalidInput: '⚠️ Noto\'g\'ri ma\'lumot. Iltimos, qaytadan kiriting.',
    sessionExpired: '⏰ Sessiya tugadi. Iltimos, qaytadan boshlang.',
    loading: '⏳ Yuklanmoqda...',
    pleaseWait: '⏳ Iltimos, kuting...',
    success: '✅ Muvaffaqiyatli!',
    thankYou: '🙏 Rahmat!'
  },
  // Russian translations (abbreviated for space - same structure)
  ru: {
    welcome: '🏢 *Добро пожаловать в Mega Travel Center!*\n\n' +
             'Крупнейший цифровой помощник по торговым центрам Самарканда.\n\n' +
             '✨ *Используйте следующие услуги:*\n\n' +
             '🏬 Торговые центры и магазины\n' +
             '🎉 Акции и скидки\n' +
             '⭐️ Избранное\n' +
             '🛍 Поиск товаров\n' +
             '💎 Программа лояльности\n' +
             '🎫 События и фестивали\n' +
             '🎬 Кино и развлечения\n' +
             '🍽 Рестораны и кафе\n' +
             '💼 Вакансии\n' +
             '🚗 Парковка\n' +
             '🧳 Услуги для туристов\n' +
             '📞 Помощь и поддержка\n\n' +
             '_Выберите из меню ниже для начала._',
    welcomeBack: '👋 Рады видеть вас снова, {name}!',
    mainMenu: '📋 Главное меню',
    malls: '🏬 ТЦ',
    stores: '🏪 Магазины',
    products: '📦 Товары',
    deals: '🎉 Акции',
    favorites: '⭐️ Избранное',
    mallMap: '🗺 Карта',
    events: '🎫 События',
    support: '📞 Поддержка',
    settings: '⚙️ Настройки',
    cinema: '🎬 Кино',
    restaurants: '🍽 Рестораны',
    jobs: '💼 Вакансии',
    parking: '🚗 Парковка',
    tourist: '🧳 Для туристов',
    language: '🌐 Язык',
    help: '❓ Помощь',
    reviews: '⭐️ Отзывы',
    loyalty: '🎁 Лояльность',
    searchProducts: '🔍 Поиск товаров',
    myProfile: '👤 Профиль',
    myOrders: '📦 Заказы',
    back: '⬅️ Назад',
    selectMall: 'Выберите ТЦ:',
    mallDetails: '📍 *{name}*\n\n📍 Адрес: {address}\n⏰ Часы: {hours}\n📞 Телефон: {phone}\n🏪 Магазинов: {storeCount}\n⭐️ Рейтинг: {rating}/5.0\n\n{description}\n\n_Статус: {status}_',
    openNow: '✅ Открыто',
    closedNow: '❌ Закрыто',
    addToFavorites: '⭐️ В избранное',
    removeFromFavorites: '💔 Удалить',
    addedToFavorites: '✅ Добавлено в избранное!',
    productDetails: '🛍 *{name}*\n\n💰 Цена: {price}\n🏪 Магазин: {store}\n📍 ТЦ: {mall}\n📦 Наличие: {availability}\n⭐️ Рейтинг: {rating}/5.0\n\n{description}\n\n_Артикул: {sku}_',
    available: '✅ В наличии',
    loyaltyTitle: '🎁 *Программа лояльности*\n\nВаш уровень: *{tier}*\n💎 Баллы: *{points}*\n🎯 До следующего уровня: {pointsToNext} баллов\n\n✨ *Преимущества:*\n• Накапливайте баллы\n• Эксклюзивные скидки\n• Приглашения на мероприятия\n• Подарок в день рождения',
    helpText: '❓ *Помощь*\n\nДоступные команды:\n\n/start - Главное меню\n/malls - ТЦ\n/stores - Магазины\n/deals - Акции\n/favorites - Избранное\n/language - Язык\n/help - Помощь\n\nПо вопросам:\n📧 info@megatravelcenter.com',
    languageChanged: '✅ Язык изменен!',
    noSearchResults: 'Ничего не найдено.',
    productSearch: 'Введите название товара:',
    searchResults: '🔍 *Результаты:* {query}\n\n'
  },
  // English translations
  en: {
    welcome: '🏢 *Welcome to Mega Travel Center!*\n\n' +
             'Samarkand\'s largest digital mall assistant.\n\n' +
             '✨ *Available services:*\n\n' +
             '🏬 Malls and stores\n' +
             '🎉 Deals and promotions\n' +
             '⭐️ Favorites\n' +
             '🛍 Product search\n' +
             '💎 Loyalty program\n' +
             '🎫 Events and festivals\n' +
             '🎬 Cinema and entertainment\n' +
             '🍽 Restaurants and cafes\n' +
             '💼 Job opportunities\n' +
             '🚗 Parking\n' +
             '🧳 Tourist services\n' +
             '📞 Help and support\n\n' +
             '_Select from menu below to start._',
    welcomeBack: '👋 Welcome back, {name}!',
    mainMenu: '📋 Main Menu',
    malls: '🏬 Malls',
    stores: '🏪 Stores',
    products: '📦 Products',
    deals: '🎉 Deals',
    favorites: '⭐️ Favorites',
    mallMap: '🗺 Map',
    events: '🎫 Events',
    support: '📞 Support',
    settings: '⚙️ Settings',
    cinema: '🎬 Cinema',
    restaurants: '🍽 Restaurants',
    jobs: '💼 Jobs',
    parking: '🚗 Parking',
    tourist: '🧳 Tourist Info',
    language: '🌐 Language',
    help: '❓ Help',
    reviews: '⭐️ Reviews',
    loyalty: '🎁 Loyalty',
    searchProducts: '🔍 Search Products',
    myProfile: '👤 My Profile',
    myOrders: '📦 My Orders',
    back: '⬅️ Back',
    selectMall: 'Select a mall:',
    mallDetails: '📍 *{name}*\n\n📍 Address: {address}\n⏰ Hours: {hours}\n📞 Phone: {phone}\n🏪 Stores: {storeCount}\n⭐️ Rating: {rating}/5.0\n\n{description}\n\n_Status: {status}_',
    openNow: '✅ Open',
    closedNow: '❌ Closed',
    addToFavorites: '⭐️ Add to Favorites',
    removeFromFavorites: '💔 Remove',
    addedToFavorites: '✅ Added to favorites!',
    productDetails: '🛍 *{name}*\n\n💰 Price: {price}\n🏪 Store: {store}\n📍 Mall: {mall}\n📦 Availability: {availability}\n⭐️ Rating: {rating}/5.0\n\n{description}\n\n_SKU: {sku}_',
    available: '✅ Available',
    loyaltyTitle: '🎁 *Loyalty Program*\n\nYour tier: *{tier}*\n💎 Points: *{points}*\n🎯 To next tier: {pointsToNext} points\n\n✨ *Benefits:*\n• Earn points on purchases\n• Exclusive discounts\n• Event invitations\n• Birthday gift',
    helpText: '❓ *Help*\n\nAvailable commands:\n\n/start - Main menu\n/malls - Malls\n/stores - Stores\n/deals - Deals\n/favorites - Favorites\n/language - Language\n/help - Help\n\nContact:\n📧 info@megatravelcenter.com',
    languageChanged: '✅ Language changed!',
    noSearchResults: 'No results found.',
    productSearch: 'Enter product name:',
    searchResults: '🔍 *Results:* {query}\n\n'
  },
  // Turkish translations
  tr: {
    welcome: '🏢 *Mega Travel Center\'a hoş geldiniz!*\n\n' +
             'Semerkant\'ın en büyük dijital AVM asistanı.\n\n' +
             '✨ *Mevcut hizmetler:*\n\n' +
             '🏬 AVM\'ler ve mağazalar\n' +
             '🎉 Kampanyalar\n' +
             '⭐️ Favoriler\n' +
             '🛍 Ürün arama\n' +
             '💎 Sadakat programı\n' +
             '🎫 Etkinlikler\n' +
             '🎬 Sinema ve eğlence\n' +
             '🍽 Restoranlar ve kafeler\n' +
             '💼 İş fırsatları\n' +
             '🚗 Otopark\n' +
             '🧳 Turist hizmetleri\n' +
             '📞 Yardım ve destek\n\n' +
             '_Başlamak için aşağıdaki menüden seçin._',
    welcomeBack: '👋 Tekrar hoş geldiniz, {name}!',
    mainMenu: '📋 Ana Menü',
    malls: '🏬 AVM\'ler',
    stores: '🏪 Mağazalar',
    products: '📦 Ürünler',
    deals: '🎉 Kampanyalar',
    favorites: '⭐️ Favoriler',
    mallMap: '🗺 Harita',
    events: '🎫 Etkinlikler',
    support: '📞 Destek',
    settings: '⚙️ Ayarlar',
    cinema: '🎬 Sinema',
    restaurants: '🍽 Restoranlar',
    jobs: '💼 İş İlanları',
    parking: '🚗 Otopark',
    tourist: '🧳 Turist Bilgisi',
    language: '🌐 Dil',
    help: '❓ Yardım',
    reviews: '⭐️ Yorumlar',
    loyalty: '🎁 Sadakat',
    searchProducts: '🔍 Ürün Ara',
    myProfile: '👤 Profilim',
    myOrders: '📦 Siparişlerim',
    back: '⬅️ Geri',
    selectMall: 'Bir AVM seçin:',
    mallDetails: '📍 *{name}*\n\n📍 Adres: {address}\n⏰ Saatler: {hours}\n📞 Telefon: {phone}\n🏪 Mağazalar: {storeCount}\n⭐️ Puan: {rating}/5.0\n\n{description}\n\n_Durum: {status}_',
    openNow: '✅ Açık',
    closedNow: '❌ Kapalı',
    addToFavorites: '⭐️ Favorilere Ekle',
    removeFromFavorites: '💔 Kaldır',
    addedToFavorites: '✅ Favorilere eklendi!',
    productDetails: '🛍 *{name}*\n\n💰 Fiyat: {price}\n🏪 Mağaza: {store}\n📍 AVM: {mall}\n📦 Stok: {availability}\n⭐️ Puan: {rating}/5.0\n\n{description}\n\n_SKU: {sku}_',
    available: '✅ Mevcut',
    loyaltyTitle: '🎁 *Sadakat Programı*\n\nSeviyeniz: *{tier}*\n💎 Puanlar: *{points}*\n🎯 Sonraki seviye: {pointsToNext} puan\n\n✨ *Avantajlar:*\n• Alışverişte puan kazan\n• Özel indirimler\n• Etkinlik davetleri\n• Doğum günü hediyesi',
    helpText: '❓ *Yardım*\n\nKomutlar:\n\n/start - Ana menü\n/malls - AVM\'ler\n/stores - Mağazalar\n/deals - Kampanyalar\n/favorites - Favoriler\n/language - Dil\n/help - Yardım\n\nİletişim:\n📧 info@megatravelcenter.com',
    languageChanged: '✅ Dil değiştirildi!',
    noSearchResults: 'Sonuç bulunamadı.',
    productSearch: 'Ürün adı girin:',
    searchResults: '🔍 *Sonuçlar:* {query}\n\n'
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Get translation
function t(lang, key) {
  return botTranslations[lang]?.[key] || botTranslations['en'][key] || key;
}

// Get user language
function getUserLanguage(userId) {
  if (userLanguages[userId]) return userLanguages[userId];
  
  const user = users.find(u => u.telegramId === userId);
  if (user && user.language) {
    userLanguages[userId] = user.language;
    return user.language;
  }
  
  return 'uz'; // Default to Uzbek
}

// Set user language
function setUserLanguage(userId, lang) {
  userLanguages[userId] = lang;
  
  // Update user profile
  const user = users.find(u => u.telegramId === userId);
  if (user) {
    user.language = lang;
    saveData('users.json', users);
  }
}

// Format template string
function formatString(template, values) {
  return template.replace(/{(\w+)}/g, (match, key) => values[key] !== undefined ? values[key] : match);
}

// Calculate distance (Haversine formula)
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

// Generate unique ID
function generateId() {
  return crypto.randomBytes(8).toString('hex');
}

// Generate QR code data (simplified - in production use qrcode library)
function generateQRCode(data) {
  return `QR_${Buffer.from(JSON.stringify(data)).toString('base64')}`;
}

// ========================================
// USER MANAGEMENT
// ========================================

// Get or create user
function getOrCreateUser(telegramUser) {
  let user = users.find(u => u.telegramId === telegramUser.id);
  
  if (!user) {
    user = {
      id: generateId(),
      telegramId: telegramUser.id,
      username: telegramUser.username,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      language: getUserLanguage(telegramUser.id),
      isGuest: true,
      phone: null,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      notificationsEnabled: true
    };
    users.push(user);
    saveData('users.json', users);
    
    // Update analytics
    analytics.totalUsers = users.length;
    saveData('analytics.json', analytics);
  } else {
    user.lastActive = new Date().toISOString();
    saveData('users.json', users);
  }
  
  return user;
}

// Check if user is admin
function isAdmin(telegramId) {
  return adminUsers.some(admin => admin.telegramId === telegramId);
}

// Get user loyalty tier
function getLoyaltyTier(points) {
  if (points >= 10000) return 'tierPlatinum';
  if (points >= 5000) return 'tierGold';
  if (points >= 1000) return 'tierSilver';
  return 'tierBronze';
}

// Get or create loyalty record
function getOrCreateLoyalty(userId) {
  let record = loyalty.find(l => l.userId === userId);
  
  if (!record) {
    record = {
      userId: userId,
      points: 0,
      tier: 'tierBronze',
      totalSpent: 0,
      rewardsRedeemed: 0,
      joinedAt: new Date().toISOString()
    };
    loyalty.push(record);
    saveData('loyalty.json', loyalty);
  }
  
  return record;
}

// Add loyalty points
function addLoyaltyPoints(userId, points) {
  const record = getOrCreateLoyalty(userId);
  record.points += points;
  record.tier = getLoyaltyTier(record.points);
  saveData('loyalty.json', loyalty);
  return record;
}

// ========================================
// FAVORITES SYSTEM
// ========================================

// Get user favorites
function getUserFavorites(userId) {
  let userFavs = favorites.find(f => f.userId === userId);
  
  if (!userFavs) {
    userFavs = {
      userId: userId,
      malls: [],
      stores: [],
      products: []
    };
    favorites.push(userFavs);
    saveData('favorites.json', favorites);
  }
  
  return userFavs;
}

// Add to favorites
function addToFavorites(userId, type, itemId) {
  const userFavs = getUserFavorites(userId);
  
  if (!userFavs[type].includes(itemId)) {
    userFavs[type].push(itemId);
    saveData('favorites.json', favorites);
    return true;
  }
  
  return false;
}

// Remove from favorites
function removeFromFavorites(userId, type, itemId) {
  const userFavs = getUserFavorites(userId);
  const index = userFavs[type].indexOf(itemId);
  
  if (index > -1) {
    userFavs[type].splice(index, 1);
    saveData('favorites.json', favorites);
    return true;
  }
  
  return false;
}

// Check if item is favorite
function isFavorite(userId, type, itemId) {
  const userFavs = getUserFavorites(userId);
  return userFavs[type].includes(itemId);
}

// ========================================
// ANALYTICS TRACKING
// ========================================

// Track event
function trackEvent(eventType, data) {
  if (!analytics[eventType]) {
    analytics[eventType] = [];
  }
  
  analytics[eventType].push({
    ...data,
    timestamp: new Date().toISOString()
  });
  
  // Keep only last 1000 events
  if (analytics[eventType].length > 1000) {
    analytics[eventType] = analytics[eventType].slice(-1000);
  }
  
  saveData('analytics.json', analytics);
}

// Track popular item
function trackPopularItem(type, itemId) {
  if (!analytics[`popular${type}`]) {
    analytics[`popular${type}`] = {};
  }
  
  if (!analytics[`popular${type}`][itemId]) {
    analytics[`popular${type}`][itemId] = 0;
  }
  
  analytics[`popular${type}`][itemId]++;
  saveData('analytics.json', analytics);
}

// ========================================
// KEYBOARD GENERATORS
// ========================================

// Main menu keyboard
function getMainMenuKeyboard(lang) {
  return {
    keyboard: [
      [{ text: t(lang, 'malls') }, { text: t(lang, 'stores') }],
      [{ text: t(lang, 'products') }, { text: t(lang, 'deals') }],
      [{ text: t(lang, 'favorites') }, { text: t(lang, 'events') }],
      [{ text: t(lang, 'cinema') }, { text: t(lang, 'restaurants') }],
      [{ text: t(lang, 'loyalty') }, { text: t(lang, 'myOrders') }],
      [{ text: t(lang, 'tourist') }, { text: t(lang, 'support') }],
      [{ text: t(lang, 'myProfile') }, { text: t(lang, 'settings') }]
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
function getMallsKeyboard(lang, page = 0) {
  const pageSize = 8;
  const openMalls = malls.filter(m => m.status === 'open');
  const start = page * pageSize;
  const end = start + pageSize;
  const pageMalls = openMalls.slice(start, end);
  
  const keyboard = [];
  
  for (let i = 0; i < pageMalls.length; i += 2) {
    const row = [];
    row.push({ text: pageMalls[i].name, callback_data: `mall_${pageMalls[i].id}` });
    if (i + 1 < pageMalls.length) {
      row.push({ text: pageMalls[i + 1].name, callback_data: `mall_${pageMalls[i + 1].id}` });
    }
    keyboard.push(row);
  }
  
  // Pagination
  const navRow = [];
  if (page > 0) {
    navRow.push({ text: '⬅️ ' + t(lang, 'previous'), callback_data: `malls_page_${page - 1}` });
  }
  if (end < openMalls.length) {
    navRow.push({ text: t(lang, 'next') + ' ➡️', callback_data: `malls_page_${page + 1}` });
  }
  if (navRow.length > 0) {
    keyboard.push(navRow);
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

// Mall details keyboard
function getMallDetailsKeyboard(mallId, userId, lang) {
  const mall = malls.find(m => m.id === mallId);
  const isFav = isFavorite(userId, 'malls', mallId);
  
  const keyboard = [
    [
      { text: t(lang, 'getDirections'), url: `https://maps.google.com/?q=${mall.coordinates[0]},${mall.coordinates[1]}` }
    ]
  ];
  
  if (mall.phone) {
    keyboard.push([{ text: t(lang, 'callNow'), url: `tel:${mall.phone}` }]);
  }
  
  keyboard.push([
    {
      text: isFav ? t(lang, 'removeFromFavorites') : t(lang, 'addToFavorites'),
      callback_data: `fav_mall_${mallId}`
    }
  ]);
  
  keyboard.push([{ text: t(lang, 'back'), callback_data: 'back_malls' }]);
  
  return { inline_keyboard: keyboard };
}

// Product details keyboard
function getProductDetailsKeyboard(productId, userId, lang) {
  const isFav = isFavorite(userId, 'products', productId);
  
  return {
    inline_keyboard: [
      [
        { text: t(lang, 'orderPickup'), callback_data: `order_${productId}` },
        { text: t(lang, 'viewInWebsite'), url: `https://megatravelcenter.com/products/${productId}` }
      ],
      [
        {
          text: isFav ? t(lang, 'removeFromFavorites') : t(lang, 'addToFavorites'),
          callback_data: `fav_product_${productId}`
        }
      ],
      [{ text: t(lang, 'back'), callback_data: 'back_products' }]
    ]
  };
}

// Admin menu keyboard
function getAdminKeyboard(lang) {
  return {
    inline_keyboard: [
      [
        { text: t(lang, 'addMall'), callback_data: 'admin_add_mall' },
        { text: t(lang, 'addStore'), callback_data: 'admin_add_store' }
      ],
      [
        { text: t(lang, 'addProduct'), callback_data: 'admin_add_product' },
        { text: t(lang, 'addPromotion'), callback_data: 'admin_add_promo' }
      ],
      [
        { text: t(lang, 'broadcastMessage'), callback_data: 'admin_broadcast' },
        { text: t(lang, 'viewAnalytics'), callback_data: 'admin_analytics' }
      ],
      [
        { text: t(lang, 'userManagement'), callback_data: 'admin_users' },
        { text: t(lang, 'contentModeration'), callback_data: 'admin_moderation' }
      ],
      [{ text: t(lang, 'back'), callback_data: 'back_main' }]
    ]
  };
}

// Support menu keyboard
function getSupportKeyboard(lang) {
  return {
    inline_keyboard: [
      [{ text: t(lang, 'liveChat'), callback_data: 'support_chat' }],
      [{ text: t(lang, 'faq'), callback_data: 'support_faq' }],
      [{ text: t(lang, 'createTicket'), callback_data: 'support_ticket' }],
      [{ text: t(lang, 'back'), callback_data: 'back_main' }]
    ]
  };
}

// Settings menu keyboard
function getSettingsKeyboard(lang, user) {
  const notifText = user.notificationsEnabled ? t(lang, 'disableNotifications') : t(lang, 'enableNotifications');
  
  return {
    inline_keyboard: [
      [{ text: t(lang, 'changeLanguage'), callback_data: 'settings_language' }],
      [{ text: notifText, callback_data: 'settings_notifications' }],
      [{ text: t(lang, 'back'), callback_data: 'back_main' }]
    ]
  };
}

// ========================================
// COMMAND HANDLERS
// ========================================

// /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const user = getOrCreateUser(msg.from);
  const lang = getUserLanguage(chatId);
  
  trackEvent('command', { command: 'start', userId: user.id });
  
  const welcomeMsg = user.isGuest && user.lastActive !== user.createdAt 
    ? formatString(t(lang, 'welcomeBack'), { name: user.firstName })
    : t(lang, 'welcome');
  
  bot.sendMessage(chatId, welcomeMsg, {
    reply_markup: getMainMenuKeyboard(lang),
    parse_mode: 'Markdown'
  });
});

// /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const user = getOrCreateUser(msg.from);
  const lang = getUserLanguage(chatId);
  
  bot.sendMessage(chatId, t(lang, 'helpText'), {
    reply_markup: getMainMenuKeyboard(lang),
    parse_mode: 'Markdown'
  });
});

// /language command
bot.onText(/\/language/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, '🌐 Select your language / Выберите язык / Tilni tanlang / Dil seçin:', {
    reply_markup: getLanguageKeyboard()
  });
});

// /malls command
bot.onText(/\/malls/, (msg) => {
  const chatId = msg.chat.id;
  const user = getOrCreateUser(msg.from);
  const lang = getUserLanguage(chatId);
  
  trackEvent('command', { command: 'malls', userId: user.id });
  
  bot.sendMessage(chatId, t(lang, 'selectMall'), {
    reply_markup: getMallsKeyboard(lang, 0)
  });
});

// /stores command
bot.onText(/\/stores/, (msg) => {
  const chatId = msg.chat.id;
  const user = getOrCreateUser(msg.from);
  const lang = getUserLanguage(chatId);
  
  trackEvent('command', { command: 'stores', userId: user.id });
  
  bot.sendMessage(chatId, t(lang, 'selectCategory'), {
    reply_markup: getCategoriesKeyboard(lang)
  });
});

// /deals command
bot.onText(/\/deals/, (msg) => {
  const chatId = msg.chat.id;
  const user = getOrCreateUser(msg.from);
  const lang = getUserLanguage(chatId);
  
  trackEvent('command', { command: 'deals', userId: user.id });
  
  const dealsStores = stores.filter(s => s.hasPromo);
  
  if (dealsStores.length === 0) {
    bot.sendMessage(chatId, t(lang, 'noDeals'), {
      reply_markup: getMainMenuKeyboard(lang)
    });
    return;
  }
  
  let message = `🎉 *${t(lang, 'deals')}*\n\n`;
  
  dealsStores.slice(0, 10).forEach((store, index) => {
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

// /favorites command
bot.onText(/\/favorites/, (msg) => {
  const chatId = msg.chat.id;
  const user = getOrCreateUser(msg.from);
  const lang = getUserLanguage(chatId);
  
  const userFavs = getUserFavorites(user.id);
  
  if (userFavs.malls.length === 0 && userFavs.stores.length === 0 && userFavs.products.length === 0) {
    bot.sendMessage(chatId, t(lang, 'noFavorites'), {
      reply_markup: getMainMenuKeyboard(lang)
    });
    return;
  }
  
  let message = t(lang, 'myFavorites') + '\n\n';
  
  if (userFavs.malls.length > 0) {
    message += `🏬 *${t(lang, 'favoriteMalls')}*\n`;
    userFavs.malls.forEach(mallId => {
      const mall = malls.find(m => m.id === mallId);
      if (mall) message += `• ${mall.name}\n`;
    });
    message += '\n';
  }
  
  if (userFavs.stores.length > 0) {
    message += `🏪 *${t(lang, 'favoriteStores')}*\n`;
    userFavs.stores.forEach(storeId => {
      const store = stores.find(s => s.id === storeId);
      if (store) message += `• ${store.name}\n`;
    });
    message += '\n';
  }
  
  if (userFavs.products.length > 0) {
    message += `🛍 *${t(lang, 'favoriteProducts')}*\n`;
    userFavs.products.slice(0, 10).forEach(prodId => {
      const product = products.find(p => p.id === prodId);
      if (product) message += `• ${product.name} - ${product.price.toLocaleString()} so'm\n`;
    });
  }
  
  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(lang)
  });
});

// /loyalty command
bot.onText(/\/loyalty/, (msg) => {
  const chatId = msg.chat.id;
  const user = getOrCreateUser(msg.from);
  const lang = getUserLanguage(chatId);
  
  const loyaltyRecord = getOrCreateLoyalty(user.id);
  
  const tierPoints = {
    tierBronze: 1000,
    tierSilver: 5000,
    tierGold: 10000,
    tierPlatinum: 999999
  };
  
  const currentTierKey = loyaltyRecord.tier;
  const nextTierKeys = ['tierBronze', 'tierSilver', 'tierGold', 'tierPlatinum'];
  const currentIndex = nextTierKeys.indexOf(currentTierKey);
  const nextTierKey = currentIndex < nextTierKeys.length - 1 ? nextTierKeys[currentIndex + 1] : currentTierKey;
  const pointsToNext = currentIndex < nextTierKeys.length - 1 ? tierPoints[nextTierKey] - loyaltyRecord.points : 0;
  
  const message = formatString(t(lang, 'loyaltyTitle'), {
    tier: t(lang, loyaltyRecord.tier),
    points: loyaltyRecord.points.toLocaleString(),
    pointsToNext: pointsToNext.toLocaleString()
  });
  
  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(lang)
  });
});

// /myorders command
bot.onText(/\/myorders/, (msg) => {
  const chatId = msg.chat.id;
  const user = getOrCreateUser(msg.from);
  const lang = getUserLanguage(chatId);
  
  const userOrders = orders.filter(o => o.userId === user.id);
  
  if (userOrders.length === 0) {
    bot.sendMessage(chatId, t(lang, 'noOrders'), {
      reply_markup: getMainMenuKeyboard(lang)
    });
    return;
  }
  
  let message = t(lang, 'myOrdersTitle') + '\n\n';
  
  userOrders.slice(0, 10).forEach((order, index) => {
    const product = products.find(p => p.id === order.productId);
    const store = stores.find(s => s.id === order.storeId);
    message += `${index + 1}. 📦 ${product.name}\n`;
    message += `   🏪 ${store.name}\n`;
    message += `   ${formatString(t(lang, 'orderStatus'), { status: t(lang, order.status) })}\n\n`;
  });
  
  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(lang)
  });
});

// /profile command
bot.onText(/\/profile/, (msg) => {
  const chatId = msg.chat.id;
  const user = getOrCreateUser(msg.from);
  const lang = getUserLanguage(chatId);
  const loyaltyRecord = getOrCreateLoyalty(user.id);
  
  const message = `👤 *${t(lang, 'myProfile')}*\n\n` +
                  `Ism: ${user.firstName} ${user.lastName || ''}\n` +
                  `Username: @${user.username || 'N/A'}\n` +
                  `Til: ${lang.toUpperCase()}\n` +
                  `💎 Sodiqlik darajasi: ${t(lang, loyaltyRecord.tier)}\n` +
                  `💎 Ballar: ${loyaltyRecord.points.toLocaleString()}\n` +
                  `📅 Ro'yxatdan o'tgan: ${new Date(user.createdAt).toLocaleDateString()}`;
  
  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(lang)
  });
});

// /admin command (admin only)
bot.onText(/\/admin/, (msg) => {
  const chatId = msg.chat.id;
  const user = getOrCreateUser(msg.from);
  const lang = getUserLanguage(chatId);
  
  if (!isAdmin(user.telegramId)) {
    bot.sendMessage(chatId, t(lang, 'adminOnly'));
    return;
  }
  
  bot.sendMessage(chatId, t(lang, 'adminMenu'), {
    reply_markup: getAdminKeyboard(lang),
    parse_mode: 'Markdown'
  });
});

// ========================================
// MESSAGE HANDLERS
// ========================================

// Handle text messages (menu buttons and search)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Skip if command
  if (!text || text.startsWith('/')) return;
  
  const user = getOrCreateUser(msg.from);
  const lang = getUserLanguage(chatId);
  
  // Handle menu buttons
  if (text === t(lang, 'malls')) {
    bot.sendMessage(chatId, t(lang, 'selectMall'), {
      reply_markup: getMallsKeyboard(lang, 0)
    });
  }
  else if (text === t(lang, 'stores')) {
    bot.sendMessage(chatId, t(lang, 'selectCategory'), {
      reply_markup: getCategoriesKeyboard(lang)
    });
  }
  else if (text === t(lang, 'products') || text === t(lang, 'searchProducts')) {
    bot.sendMessage(chatId, t(lang, 'productSearch'), {
      reply_markup: {
        force_reply: true
      }
    });
  }
  else if (text === t(lang, 'deals')) {
    bot.sendMessage(chatId, '/deals');
  }
  else if (text === t(lang, 'favorites')) {
    bot.sendMessage(chatId, '/favorites');
  }
  else if (text === t(lang, 'loyalty')) {
    bot.sendMessage(chatId, '/loyalty');
  }
  else if (text === t(lang, 'myOrders')) {
    bot.sendMessage(chatId, '/myorders');
  }
  else if (text === t(lang, 'myProfile')) {
    bot.sendMessage(chatId, '/profile');
  }
  else if (text === t(lang, 'support')) {
    bot.sendMessage(chatId, t(lang, 'supportMenu'), {
      reply_markup: getSupportKeyboard(lang),
      parse_mode: 'Markdown'
    });
  }
  else if (text === t(lang, 'settings')) {
    bot.sendMessage(chatId, t(lang, 'settingsMenu'), {
      reply_markup: getSettingsKeyboard(lang, user),
      parse_mode: 'Markdown'
    });
  }
  else if (text === t(lang, 'language')) {
    bot.sendMessage(chatId, '🌐 Select language:', {
      reply_markup: getLanguageKeyboard()
    });
  }
  else if (text === t(lang, 'help')) {
    bot.sendMessage(chatId, t(lang, 'helpText'), {
      reply_markup: getMainMenuKeyboard(lang),
      parse_mode: 'Markdown'
    });
  }
  
  // Handle location sharing
  if (msg.location) {
    const userLat = msg.location.latitude;
    const userLon = msg.location.longitude;
    
    bot.sendMessage(chatId, t(lang, 'locationReceived'));
    
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
  
  // Handle product search (reply to prompt)
  if (msg.reply_to_message && msg.reply_to_message.text === t(lang, 'productSearch')) {
    const searchQuery = text.toLowerCase();
    
    trackEvent('search', { query: searchQuery, userId: user.id });
    
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

// ========================================
// CALLBACK QUERY HANDLERS
// ========================================

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const user = getOrCreateUser(query.from);
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
      trackPopularItem('Malls', mallId);
      
      const status = getMallStatus(mall) ? t(lang, 'openNow') : t(lang, 'closedNow');
      const message = formatString(t(lang, 'mallDetails'), {
        name: mall.name,
        address: mall.address,
        hours: mall.hours,
        phone: mall.phone,
        storeCount: mall.storeCount,
        rating: mall.rating,
        description: mall.description,
        status: status
      });
      
      if (mall.image) {
        bot.sendPhoto(chatId, mall.image, {
          caption: message,
          parse_mode: 'Markdown',
          reply_markup: getMallDetailsKeyboard(mallId, user.id, lang)
        });
      } else {
        bot.sendMessage(chatId, message, {
          parse_mode: 'Markdown',
          reply_markup: getMallDetailsKeyboard(mallId, user.id, lang)
        });
      }
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
  
  // Favorites toggle
  if (data.startsWith('fav_')) {
    const parts = data.split('_');
    const type = parts[1] + 's'; // mall -> malls, product -> products
    const itemId = parts[2];
    
    const isFav = isFavorite(user.id, type, itemId);
    
    if (isFav) {
      removeFromFavorites(user.id, type, itemId);
      bot.answerCallbackQuery(query.id, { text: t(lang, 'removedFromFavorites') });
    } else {
      addToFavorites(user.id, type, itemId);
      bot.answerCallbackQuery(query.id, { text: t(lang, 'addedToFavorites') });
    }
    
    // Update keyboard
    if (type === 'malls') {
      bot.editMessageReplyMarkup(getMallDetailsKeyboard(itemId, user.id, lang), {
        chat_id: chatId,
        message_id: query.message.message_id
      });
    } else if (type === 'products') {
      bot.editMessageReplyMarkup(getProductDetailsKeyboard(itemId, user.id, lang), {
        chat_id: chatId,
        message_id: query.message.message_id
      });
    }
    
    return;
  }
  
  // Order/Pickup
  if (data.startsWith('order_')) {
    const productId = data.replace('order_', '');
    const product = products.find(p => p.id === productId);
    const store = stores.find(s => s.id === product.storeId);
    
    const order = {
      id: generateId(),
      userId: user.id,
      productId: productId,
      storeId: store.id,
      status: 'orderPending',
      qrCode: generateQRCode({ orderId: generateId(), productId, storeId: store.id }),
      createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    saveData('orders.json', orders);
    
    const message = formatString(t(lang, 'orderCreated'), { orderId: order.id }) + '\n\n' +
                    formatString(t(lang, 'pickupInstructions'), { store: store.name });
    
    bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown'
    });
    
    // Send QR code as text (in production, generate actual QR image)
    bot.sendMessage(chatId, `\`\`\`\n${order.qrCode}\n\`\`\``, {
      parse_mode: 'Markdown'
    });
    
    bot.answerCallbackQuery(query.id, { text: t(lang, 'success') });
    return;
  }
  
  // Support actions
  if (data.startsWith('support_')) {
    const action = data.replace('support_', '');
    
    if (action === 'ticket') {
      const ticket = {
        id: generateId(),
        userId: user.id,
        status: 'open',
        createdAt: new Date().toISOString()
      };
      supportTickets.push(ticket);
      saveData('support_tickets.json', supportTickets);
      
      bot.sendMessage(chatId, formatString(t(lang, 'ticketCreated'), { ticketId: ticket.id }));
    } else if (action === 'faq') {
      bot.sendMessage(chatId, t(lang, 'comingSoonFeature'));
    } else if (action === 'chat') {
      bot.sendMessage(chatId, t(lang, 'comingSoonFeature'));
    }
    
    bot.answerCallbackQuery(query.id);
    return;
  }
  
  // Settings actions
  if (data.startsWith('settings_')) {
    const action = data.replace('settings_', '');
    
    if (action === 'language') {
      bot.sendMessage(chatId, '🌐 Select language:', {
        reply_markup: getLanguageKeyboard()
      });
    } else if (action === 'notifications') {
      user.notificationsEnabled = !user.notificationsEnabled;
      saveData('users.json', users);
      
      const msg = user.notificationsEnabled ? t(lang, 'notificationsEnabled') : t(lang, 'notificationsDisabled');
      bot.answerCallbackQuery(query.id, { text: msg });
      
      // Update keyboard
      bot.editMessageReplyMarkup(getSettingsKeyboard(lang, user), {
        chat_id: chatId,
        message_id: query.message.message_id
      });
    }
    
    return;
  }
  
  // Admin actions
  if (data.startsWith('admin_')) {
    if (!isAdmin(user.telegramId)) {
      bot.answerCallbackQuery(query.id, { text: t(lang, 'adminOnly') });
      return;
    }
    
    const action = data.replace('admin_', '');
    
    if (action === 'analytics') {
      const report = formatString(t(lang, 'analyticsReport'), {
        totalUsers: analytics.totalUsers || users.length,
        activeUsers: users.filter(u => {
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return new Date(u.lastActive) > dayAgo;
        }).length,
        totalOrders: orders.length,
        totalReviews: reviews.length,
        topMalls: 'Family Park Mall, Next Mall',
        topStores: 'Zara, Tech World'
      });
      
      bot.sendMessage(chatId, report, { parse_mode: 'Markdown' });
    } else if (action === 'broadcast') {
      bot.sendMessage(chatId, 'Send your broadcast message:');
      userSessions[chatId] = { action: 'broadcast' };
    } else {
      bot.sendMessage(chatId, t(lang, 'comingSoonFeature'));
    }
    
    bot.answerCallbackQuery(query.id);
    return;
  }
  
  // Navigation buttons
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
      reply_markup: getMallsKeyboard(lang, 0)
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
  
  // Pagination
  if (data.startsWith('malls_page_')) {
    const page = parseInt(data.replace('malls_page_', ''));
    bot.editMessageReplyMarkup(getMallsKeyboard(lang, page), {
      chat_id: chatId,
      message_id: query.message.message_id
    });
    bot.answerCallbackQuery(query.id);
    return;
  }
  
  bot.answerCallbackQuery(query.id);
});

// ========================================
// NOTIFICATION SYSTEM
// ========================================

// Send notification to user
function sendNotification(userId, message, options = {}) {
  const user = users.find(u => u.id === userId);
  
  if (!user || !user.notificationsEnabled) {
    return;
  }
  
  bot.sendMessage(user.telegramId, message, options);
  
  // Log notification
  notifications.push({
    userId: userId,
    message: message,
    sentAt: new Date().toISOString()
  });
  saveData('notifications.json', notifications);
}

// Broadcast to all users
function broadcastMessage(message, options = {}) {
  let sentCount = 0;
  
  users.forEach(user => {
    if (user.notificationsEnabled) {
      try {
        bot.sendMessage(user.telegramId, message, options);
        sentCount++;
      } catch (error) {
        console.error(`Failed to send to user ${user.id}:`, error);
      }
    }
  });
  
  return sentCount;
}

// ========================================
// ERROR HANDLING
// ========================================

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.on('error', (error) => {
  console.error('Bot error:', error);
});

// ========================================
// STARTUP
// ========================================

console.log('✅ Mega Travel Center Bot (Enterprise Edition) is ready!');
console.log(`📊 Users: ${users.length}`);
console.log(`🏬 Malls: ${malls.length}`);
console.log(`🏪 Stores: ${stores.length}`);
console.log(`🛍 Products: ${products.length}`);
console.log('\nSend /start to begin. Admins can use /admin.');
