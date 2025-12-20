# 🚀 Quick Start - Telegram Bot

Get your Mega Travel Center Telegram bot running in **10 minutes**!

## Step 1: Create Your Bot (2 minutes)

1. Open Telegram and find **@BotFather**
2. Send: `/newbot`
3. Choose a name: `Mega Travel Center`
4. Choose a username: `megatravelcenter_bot` (must end with 'bot')
5. **Copy the bot token** you receive (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Step 2: Configure (1 minute)

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` and paste your bot token:
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

## Step 3: Run the Bot (1 minute)

```bash
npm run bot
```

You should see:
```
🤖 Mega Travel Center Bot is running...
✅ Bot is ready! Send /start to begin.
```

## Step 4: Test Your Bot (5 minutes)

1. **Find your bot** in Telegram (search for the username you created)
2. **Send** `/start`
3. **Try these features**:
   - 🏬 Click "Malls" → Select a mall
   - 🏪 Click "Stores" → Choose a category
   - 🎉 Click "Deals" → See promotions
   - 📍 Share your location → Find nearby malls
   - 🌐 Click "Language" → Change language
   - 🔍 Click "Product Search" → Search for items

## 🎉 Done!

Your bot is now fully operational with all features!

## Available Commands

| Command | What it does |
|---------|-------------|
| `/start` | Show main menu |
| `/malls` | Browse malls |
| `/stores` | Browse stores |
| `/deals` | Current deals |
| `/events` | Upcoming events |
| `/cinema` | Movie schedules |
| `/restaurants` | Dining options |
| `/jobs` | Job opportunities |
| `/parking` | Parking info |
| `/tourist` | Tourist services |
| `/language` | Change language |
| `/help` | Show help |

## Features Overview

### 🏬 Browse Malls
- View all 7 malls in Samarkand
- See real-time open/closed status
- Get directions, call, or visit website
- View ratings and store counts

### 🏪 Store Directory
- Browse by category (Fashion, Electronics, etc.)
- See store locations and floor numbers
- View active promotions
- Get contact information

### 🎉 Deals & Promotions
- Real-time deals from all stores
- Discount information
- Mall and store locations

### 📍 Location Services
- Share your location
- Find nearest malls
- See distances in kilometers

### 🌐 Multi-Language
- Uzbek (default)
- Russian
- English
- Turkish
- Change anytime!

### 🔍 Product Search
- Search across all stores
- See prices and availability
- Find mall locations

### And Much More!
- Events calendar
- Cinema schedules
- Restaurant directory
- Job opportunities
- Parking information
- Tourist services
- Reviews & ratings
- Loyalty program

## Troubleshooting

### Bot not responding?
```bash
# Check if it's running
# You should see "Bot is running..." in terminal

# If not, restart:
npm run bot
```

### Wrong token?
```bash
# Check your .env file
# Make sure token is correct (no extra spaces)
```

### Need to stop the bot?
```bash
# Press Ctrl+C in the terminal
```

## Run Everything Together

To run the website + backend + bot all at once:

```bash
npm run start:all
```

This starts:
- Website on http://localhost:3000
- Backend on http://localhost:5000
- Telegram Bot

## Next Steps

- 📖 Read [BOT_SETUP.md](./BOT_SETUP.md) for detailed documentation
- 📝 Check [TELEGRAM_BOT_CHANGELOG.md](./TELEGRAM_BOT_CHANGELOG.md) for feature list
- 🎨 Customize bot messages in `bot.js`
- 🌍 Add more languages in `botTranslations` object
- 📊 Monitor bot usage in console logs

## Support

Questions? Contact:
- 📧 info@megatravelcenter.com
- 📱 +998 (66) 233-30-30

---

**Happy Bot Building! 🤖**
