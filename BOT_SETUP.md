# Telegram Bot Setup Guide

## 🤖 Mega Travel Center Telegram Bot

The Telegram bot provides full access to all website features directly in Telegram, with multi-language support and interactive menus.

## Features

### Core Features
- ✅ **Smart Directory & Navigation**: Browse malls, stores by categories, with floor information
- ✅ **Unified Promotion Engine**: Real-time promotions, deals, and flash sales
- ✅ **Entertainment & Cinema Integration**: Movie schedules and entertainment venues
- ✅ **Gastronomy Guide**: Restaurant and cafe directory
- ✅ **Tourist Concierge**: Currency exchange, tax-free info, souvenir shops
- ✅ **Smart Parking & Logistics**: Parking info, EV charging, public transport
- ✅ **Events & Community**: Upcoming events, masterclasses, concerts
- ✅ **Job Board**: Career opportunities
- ✅ **User Engagement**: Reviews, ratings, loyalty program
- ✅ **Product Search**: Search products across all stores
- ✅ **Location-Based Services**: Find nearby malls using GPS

### Technical Features
- 🌐 **Multi-language Support**: Uzbek, Russian, English, Turkish
- 📱 **Interactive Keyboards**: Easy navigation with inline buttons
- 📍 **Location Sharing**: Find nearest malls based on your location
- 🖼 **Rich Media**: Images, photos, and formatted text
- 🔄 **Real-time Data**: Connected to the same data as the website
- ⚡ **Fast Response**: Optimized polling and callbacks

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Choose a name for your bot (e.g., "Mega Travel Center")
4. Choose a username (must end with 'bot', e.g., "megatravelcenter_bot")
5. BotFather will give you a **BOT TOKEN** - save this!

### 2. Configure the Bot

1. Create a `.env` file in the project root:
```bash
cp .env.example .env
```

2. Edit `.env` and add your bot token:
```env
TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
PORT=5000
WEBSITE_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Bot

#### Option 1: Run Bot Only
```bash
npm run bot
```

#### Option 2: Run Everything (Website + Server + Bot)
```bash
npm run start:all
```

Or run each separately in different terminals:
```bash
# Terminal 1 - Website
npm run dev

# Terminal 2 - Backend Server
npm run server

# Terminal 3 - Telegram Bot
npm run bot
```

## Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Start the bot and show main menu |
| `/malls` | Browse all shopping malls |
| `/stores` | Browse stores by category |
| `/deals` | View current promotions and deals |
| `/events` | See upcoming events |
| `/cinema` | Movie schedules and entertainment |
| `/restaurants` | Restaurant and cafe directory |
| `/jobs` | Career opportunities |
| `/parking` | Parking and logistics info |
| `/tourist` | Tourist services (currency, tax-free, souvenirs) |
| `/language` | Change bot language |
| `/help` | Show help and all commands |

## Bot Features in Detail

### 🏬 Malls
- View all open malls in Samarkand
- Get detailed information (address, hours, phone, rating)
- Open/Closed status indicator
- Direct links to Google Maps
- Call directly from chat
- Visit website

### 🏪 Stores
- Browse by category (Fashion, Electronics, Sportswear, etc.)
- See store location (mall and floor)
- View active promotions
- Contact information

### 🎉 Promotions & Deals
- Real-time deals from all stores
- Discount percentages
- Promotion descriptions
- Valid store and mall locations

### 🎫 Events
- Upcoming events calendar
- Grand openings
- Fashion shows
- Food festivals
- Masterclasses and concerts

### 🎬 Cinema & Entertainment
- Select a mall to see cinema schedules
- Information about amusement zones
- Ice rinks and entertainment venues

### 🍽 Restaurants
- Browse dining options by mall
- Food court directory
- Restaurant information

### 💼 Jobs
- Available positions in all malls
- Contact information for CV submission
- Various roles (sales, management, security, etc.)

### 🚗 Parking
- Free parking information
- EV charging stations
- Public transport routes
- Accessibility features

### 🧳 Tourist Services
- Currency exchange locations
- Tax-Free (VAT refund) information
- Traditional Uzbek souvenir shops
- Multi-language assistance
- 24/7 support contact

### 🔍 Product Search
- Search products by name
- See prices and availability
- Find which store and mall
- Quick access to product details

### 📍 Location-Based
- Share your location
- Find nearest malls
- Distance calculation
- Sorted by proximity

### ⭐ Reviews & Ratings
- Submit reviews
- View average ratings
- Community feedback

### 🎁 Loyalty Program
- Join loyalty program
- Earn points on purchases
- Exclusive discounts
- Special event invitations
- Birthday gifts

## Multi-Language Support

The bot supports 4 languages:
- 🇺🇿 **Uzbek (O'zbek)** - Default
- 🇷🇺 **Russian (Русский)**
- 🇬🇧 **English**
- 🇹🇷 **Turkish (Türkçe)**

Users can change language anytime using:
- `/language` command
- "🌐 Language" button in main menu

Language preference is saved per user.

## Bot Architecture

```
bot.js
├── Bot Initialization
├── Translation System (multi-language)
├── Data Loading (malls, stores, products)
├── User Language Preferences
├── Command Handlers
│   ├── /start
│   ├── /help
│   ├── /language
│   ├── /malls
│   ├── /stores
│   ├── /deals
│   ├── /events
│   ├── /cinema
│   ├── /restaurants
│   ├── /jobs
│   ├── /parking
│   └── /tourist
├── Message Handlers
│   ├── Menu Button Clicks
│   ├── Location Sharing
│   └── Product Search
├── Callback Query Handlers
│   ├── Language Selection
│   ├── Mall Selection
│   ├── Category Selection
│   └── Navigation (Back buttons)
└── Utility Functions
    ├── Translation (t)
    ├── Distance Calculator
    ├── Mall Status Checker
    └── Keyboard Builders
```

## Data Synchronization

The bot uses the same data files as the website:
- `src/data/malls.json` - Shopping malls
- `src/data/stores.json` - Store directory
- `src/data/products.json` - Product catalog

**No database required!** Data is loaded from JSON files and kept in sync with the website automatically.

## Customization

### Adding New Features

1. **Add New Command**:
```javascript
bot.onText(/\/newcommand/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  bot.sendMessage(chatId, 'Your message here');
});
```

2. **Add Translation**:
```javascript
const botTranslations = {
  uz: {
    newFeature: 'Yangi xususiyat'
  },
  ru: {
    newFeature: 'Новая функция'
  },
  en: {
    newFeature: 'New feature'
  },
  tr: {
    newFeature: 'Yeni özellik'
  }
};
```

3. **Add Menu Button**:
```javascript
function getMainMenuKeyboard(lang) {
  return {
    keyboard: [
      // ... existing buttons
      [{ text: t(lang, 'newFeature') }]
    ],
    resize_keyboard: true
  };
}
```

## Troubleshooting

### Bot not responding
- Check if bot is running: `npm run bot`
- Verify bot token in `.env` file
- Check console for errors

### Polling errors
- Make sure no other instance is running
- Token might be invalid - get new one from BotFather
- Check internet connection

### Language not changing
- User preferences are stored in memory
- Restart bot to reset preferences
- For production, use database for persistence

### Images not showing
- Check image URLs in data files
- Ensure images are accessible publicly
- Use HTTPS URLs for better compatibility

## Production Deployment

### Recommended Hosting
- **VPS**: DigitalOcean, Linode, Vultr
- **Cloud**: AWS EC2, Google Cloud, Azure
- **PaaS**: Heroku, Railway, Render

### Using Webhooks (Production)
Instead of polling, use webhooks for better performance:

```javascript
const bot = new TelegramBot(BOT_TOKEN, { 
  webHook: { 
    port: process.env.PORT || 8443
  } 
});

bot.setWebHook(`${process.env.WEBHOOK_URL}/bot${BOT_TOKEN}`);
```

### Process Manager (PM2)
```bash
npm install -g pm2

# Start bot
pm2 start bot.js --name telegram-bot

# Auto-restart on server reboot
pm2 startup
pm2 save
```

### Environment Variables
Set these in production:
```env
NODE_ENV=production
TELEGRAM_BOT_TOKEN=your_production_token
WEBHOOK_URL=https://yourdomain.com
```

## Security

- ✅ Never commit `.env` file to Git
- ✅ Keep bot token secret
- ✅ Use webhooks in production (not polling)
- ✅ Validate user inputs
- ✅ Rate limiting for commands
- ✅ Monitor bot logs for suspicious activity

## Analytics & Monitoring

Track important metrics:
- Total users
- Most used commands
- Popular malls/stores
- Language preferences
- Location sharing usage
- Search queries

Use services like:
- **Botanalytics**: Bot-specific analytics
- **Mixpanel**: User behavior tracking
- **Sentry**: Error monitoring

## Support

For bot-related questions:
- 📧 Email: info@megatravelcenter.com
- 📱 Telegram: @megatravelcenter_support
- 💬 Developer: Check bot.js comments

## Future Enhancements

Planned features:
- [ ] User accounts and profiles (when requested)
- [ ] Order/booking system
- [ ] Payment integration
- [ ] Push notifications for deals
- [ ] Chatbot AI assistant
- [ ] Voice messages support
- [ ] Group chat features
- [ ] Admin panel integration
- [ ] Analytics dashboard
- [ ] Multi-bot support (different cities)

## License

Same license as the main project.

---

**Made with ❤️ for Mega Travel Center**
