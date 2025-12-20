# Telegram Bot API Reference

Quick reference guide for developers working with the Mega Travel Center bot.

## 🔧 Bot Configuration

### Environment Variables
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
PORT=5000
WEBSITE_URL=http://localhost:3000
```

### Bot Initialization
```javascript
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
```

---

## 📚 Core Functions

### Translation System

#### Get Translation
```javascript
function t(lang, key)
```
**Parameters:**
- `lang` (string): Language code ('uz', 'ru', 'en', 'tr')
- `key` (string): Translation key

**Returns:** Translated string

**Example:**
```javascript
const greeting = t('uz', 'welcome'); // Returns Uzbek welcome message
```

#### Get User Language
```javascript
function getUserLanguage(userId)
```
**Parameters:**
- `userId` (number): Telegram user ID

**Returns:** Language code (string)

**Example:**
```javascript
const lang = getUserLanguage(chatId); // 'uz'
```

#### Set User Language
```javascript
function setUserLanguage(userId, lang)
```
**Parameters:**
- `userId` (number): Telegram user ID
- `lang` (string): Language code to set

**Example:**
```javascript
setUserLanguage(chatId, 'en'); // Set to English
```

### String Formatting

#### Format Template String
```javascript
function formatString(template, values)
```
**Parameters:**
- `template` (string): Template with {placeholders}
- `values` (object): Key-value pairs for replacement

**Returns:** Formatted string

**Example:**
```javascript
const message = formatString('Hello {name}, you have {count} messages', {
  name: 'John',
  count: 5
});
// Returns: "Hello John, you have 5 messages"
```

### Location Services

#### Calculate Distance
```javascript
function calculateDistance(lat1, lon1, lat2, lon2)
```
**Parameters:**
- `lat1` (number): First location latitude
- `lon1` (number): First location longitude
- `lat2` (number): Second location latitude
- `lon2` (number): Second location longitude

**Returns:** Distance in kilometers (number)

**Example:**
```javascript
const distance = calculateDistance(39.6542, 66.9597, 39.6434, 66.9689);
// Returns: 1.234 (km)
```

### Mall Status

#### Get Mall Status
```javascript
function getMallStatus(mall)
```
**Parameters:**
- `mall` (object): Mall object with openTime and closeTime

**Returns:** Boolean (true if open, false if closed)

**Example:**
```javascript
const mall = malls.find(m => m.id === 'family-park');
const isOpen = getMallStatus(mall); // true or false
```

---

## ⌨️ Keyboard Functions

### Main Menu Keyboard
```javascript
function getMainMenuKeyboard(lang)
```
**Parameters:**
- `lang` (string): Language code

**Returns:** Telegram keyboard markup object

**Example:**
```javascript
bot.sendMessage(chatId, 'Welcome!', {
  reply_markup: getMainMenuKeyboard('uz')
});
```

### Language Selection Keyboard
```javascript
function getLanguageKeyboard()
```
**Returns:** Inline keyboard with language options

**Example:**
```javascript
bot.sendMessage(chatId, 'Choose language:', {
  reply_markup: getLanguageKeyboard()
});
```

### Mall List Keyboard
```javascript
function getMallsKeyboard(lang)
```
**Parameters:**
- `lang` (string): Language code

**Returns:** Inline keyboard with mall buttons

### Category List Keyboard
```javascript
function getCategoriesKeyboard(lang)
```
**Parameters:**
- `lang` (string): Language code

**Returns:** Inline keyboard with category buttons

### Store Details Keyboard
```javascript
function getStoreDetailsKeyboard(storeId, lang)
```
**Parameters:**
- `storeId` (string): Store ID
- `lang` (string): Language code

**Returns:** Inline keyboard with store actions

### Mall Details Keyboard
```javascript
function getMallDetailsKeyboard(mallId, lang)
```
**Parameters:**
- `mallId` (string): Mall ID
- `lang` (string): Language code

**Returns:** Inline keyboard with mall actions (directions, call, website)

---

## 📝 Command Handlers

### Basic Command Structure
```javascript
bot.onText(/\/commandname/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  
  bot.sendMessage(chatId, 'Your message', {
    reply_markup: getMainMenuKeyboard(lang),
    parse_mode: 'Markdown'
  });
});
```

### Handle Text Messages
```javascript
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const lang = getUserLanguage(chatId);
  
  // Skip commands
  if (text && text.startsWith('/')) return;
  
  // Your logic here
});
```

### Handle Callback Queries
```javascript
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const lang = getUserLanguage(chatId);
  
  // Handle different callback data
  if (data.startsWith('prefix_')) {
    // Your logic here
  }
  
  bot.answerCallbackQuery(query.id);
});
```

---

## 📊 Data Access

### Load Data Files
```javascript
// Malls
const malls = JSON.parse(fs.readFileSync('src/data/malls.json', 'utf8'));

// Stores
const stores = JSON.parse(fs.readFileSync('src/data/stores.json', 'utf8'));

// Products
const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
```

### Filter Data
```javascript
// Get open malls
const openMalls = malls.filter(m => m.status === 'open');

// Get stores by category
const fashionStores = stores.filter(s => s.category === 'Fashion');

// Get stores with promotions
const dealsStores = stores.filter(s => s.hasPromo);

// Get stores by mall
const mallStores = stores.filter(s => s.mallId === 'family-park');
```

---

## 💬 Message Types

### Send Text Message
```javascript
bot.sendMessage(chatId, 'Your message', {
  parse_mode: 'Markdown',
  reply_markup: keyboard
});
```

### Send Photo with Caption
```javascript
bot.sendPhoto(chatId, photoUrl, {
  caption: 'Your caption',
  parse_mode: 'Markdown',
  reply_markup: keyboard
});
```

### Edit Message
```javascript
bot.editMessageText('New text', {
  chat_id: chatId,
  message_id: messageId,
  parse_mode: 'Markdown',
  reply_markup: keyboard
});
```

### Delete Message
```javascript
bot.deleteMessage(chatId, messageId);
```

---

## 🎨 Formatting

### Markdown Formatting
```javascript
// Bold
const bold = '*Bold Text*';

// Italic
const italic = '_Italic Text_';

// Code
const code = '`Code Block`';

// Link
const link = '[Link Text](https://example.com)';

// Combined
const message = `
*Bold Title*

_Italic description_

\`Code example\`

[Visit Website](https://example.com)
`;
```

### Emoji Icons
```javascript
const icons = {
  mall: '🏬',
  store: '🏪',
  deal: '🎉',
  event: '🎫',
  cinema: '🎬',
  restaurant: '🍽',
  job: '💼',
  parking: '🚗',
  tourist: '🧳',
  language: '🌐',
  help: '❓',
  location: '📍',
  phone: '📞',
  email: '📧',
  time: '⏰',
  star: '⭐️',
  open: '✅',
  closed: '❌'
};
```

---

## 🔄 Callback Data Patterns

### Callback Data Structure
```javascript
// Language selection
'lang_uz', 'lang_ru', 'lang_en', 'lang_tr'

// Mall selection
'mall_family-park', 'mall_silk-road-mall'

// Category selection
'cat_Fashion', 'cat_Electronics'

// Store details
'store_details_terra-pro'

// Store call
'store_call_terra-pro'

// Navigation
'back_main', 'back_malls', 'back_stores'
```

### Handling Callback Data
```javascript
bot.on('callback_query', (query) => {
  const data = query.data;
  
  if (data.startsWith('lang_')) {
    const lang = data.replace('lang_', '');
    // Handle language change
  }
  else if (data.startsWith('mall_')) {
    const mallId = data.replace('mall_', '');
    // Handle mall selection
  }
  else if (data.startsWith('cat_')) {
    const category = data.replace('cat_', '');
    // Handle category selection
  }
  else if (data === 'back_main') {
    // Handle back to main
  }
  
  bot.answerCallbackQuery(query.id);
});
```

---

## 🛠️ Utility Examples

### Send Mall Details
```javascript
function sendMallDetails(chatId, mallId, lang) {
  const mall = malls.find(m => m.id === mallId);
  
  if (!mall) {
    bot.sendMessage(chatId, 'Mall not found');
    return;
  }
  
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
  
  bot.sendPhoto(chatId, mall.image, {
    caption: message,
    parse_mode: 'Markdown',
    reply_markup: getMallDetailsKeyboard(mallId, lang)
  });
}
```

### Find Nearby Malls
```javascript
function findNearbyMalls(chatId, userLat, userLon, lang) {
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
    message += `   📍 ${mall.distance.toFixed(1)} km\n`;
    message += `   ${status}\n\n`;
  });
  
  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(lang)
  });
}
```

---

## 🧪 Testing

### Test Command
```bash
# Start bot in test mode
TELEGRAM_BOT_TOKEN=test_token npm run bot
```

### Test Checklist
- [ ] Bot starts without errors
- [ ] /start command works
- [ ] Language switching works
- [ ] All menu buttons respond
- [ ] Inline keyboards work
- [ ] Images load correctly
- [ ] Links open properly
- [ ] Location sharing works
- [ ] Search functionality works
- [ ] All translations display correctly

---

## 🐛 Error Handling

### Basic Error Handler
```javascript
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

try {
  // Your code here
} catch (error) {
  console.error('Error:', error);
  bot.sendMessage(chatId, t(lang, 'error'));
}
```

### Common Errors
```javascript
// Token invalid
Error: ETELEGRAM: 401 Unauthorized

// User blocked bot
Error: ETELEGRAM: 403 Forbidden: bot was blocked by the user

// Message too long
Error: ETELEGRAM: 400 Bad Request: message is too long

// Invalid chat ID
Error: ETELEGRAM: 400 Bad Request: chat not found
```

---

## 📈 Performance Tips

1. **Cache data** - Load JSON files once at startup
2. **Use inline keyboards** - More efficient than custom keyboards
3. **Limit results** - Don't send too many items at once
4. **Compress images** - Use appropriate image sizes
5. **Answer callback queries** - Always call `answerCallbackQuery`
6. **Delete old messages** - Clean up chat history
7. **Use webhooks in production** - More efficient than polling

---

## 🔗 Useful Links

- [node-telegram-bot-api Documentation](https://github.com/yagop/node-telegram-bot-api)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [BotFather Commands](https://core.telegram.org/bots#6-botfather)
- [Markdown Formatting](https://core.telegram.org/bots/api#formatting-options)

---

## 📞 Support

For development questions:
- 📧 Email: info@megatravelcenter.com
- 📱 Telegram: @megatravelcenter_support
- 📖 See bot.js for inline comments

---

*API Reference v1.0.0*
*Last Updated: December 2024*
