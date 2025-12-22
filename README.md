# Mega Travel Center (MTC) 🌟

> A world-class, ultra-modern digital platform combining premium UI/UX, advanced animations, and interactive 3D elements.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🎨 Premium Design Language
- **Ultra-modern UI/UX** with dark luxury theme
- **Glassmorphism** effects throughout
- **Premium color palette** with purple gradients and gold accents
- **Responsive design** optimized for all devices

### 🌌 Interactive Background System
- **GPU-accelerated** canvas-based particle animation
- **Mouse-responsive** parallax effects
- **Seasonal variations** with dynamic color schemes
- **Performance-optimized** with low CPU usage
- Depth-layered particles with connection lines

### 🎯 3D Interactive Elements
- **Button3D component** with mouse-based tilt interaction
- **Perspective transforms** on hover
- **Multiple button variants**: primary, secondary, accent, outline, ghost
- **Shine effect** animations
- Tactile and luxurious feel

### 🎭 Seasonal Visual Transformations
Automatic seasonal adaptations with smooth transitions:
- 🌸 **Spring**: Soft pastels, floating blossoms
- ☀️ **Summer**: Warm glows, sun-inspired effects
- 🍁 **Autumn**: Falling leaves, amber tones
- ❄️ **Winter**: Snow particles, frosted glass, cool blues

### ⚡ Micro-interactions
- **AnimatedCounter** with scroll-triggered animations
- **Scroll reveal** effects with intersection observer
- **Parallax scrolling** for depth
- **Hover-activated reveals**
- **Page transitions** with smooth animations

### 🌍 Multi-language Support
- Uzbek (default)
- Russian
- English
- Persistent language selection

### 🌓 Dark Mode
- Premium dark background: `rgba(37, 40, 54, 1)`
- Smooth transitions between modes
- Persistent user preference

### 🔐 Admin Panel
Fully functional enterprise-grade admin system:
- Mall management (CRUD)
- Store management
- Product management
- Banner management
- Media library
- User roles & permissions
- JWT authentication
- **Hidden from public** - accessible only via `/admin/login`

### 📱 Mobile Optimization
- Touch-friendly interface
- Bottom navigation bar
- Responsive breakpoints
- Optimized performance

### 🤖 Telegram Bot Integration
- **Full feature parity** with website
- **Multi-language support** (Uzbek, Russian, English, Turkish)
- **Interactive menus** with inline keyboards
- **Location-based services** (find nearby malls)
- **Real-time data sync** with website
- **All core features**: malls, stores, deals, events, cinema, restaurants, jobs, parking, tourist services
- **Product search** across all stores
- **Reviews & loyalty program**
- See [BOT_SETUP.md](./BOT_SETUP.md) for detailed setup instructions

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mega-travel-center
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

4. **Start backend server** (for admin panel)
```bash
npm run server
```
Backend runs on `http://localhost:5000`

5. **Start Telegram bot** (optional)
```bash
npm run bot
```
See [BOT_SETUP.md](./BOT_SETUP.md) for bot configuration

**Or start everything at once:**
```bash
npm run start:all
```

### Build for Production
```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
mega-travel-center/
├── src/
│   ├── admin/              # Admin panel (hidden from public)
│   │   ├── pages/          # Admin pages
│   │   ├── components/     # Admin components
│   │   └── hooks/          # Admin hooks
│   ├── components/         # Reusable components
│   │   ├── InteractiveBackground.jsx    # ⭐ KEY FEATURE
│   │   ├── Button3D.jsx                 # 3D interactive buttons
│   │   ├── AnimatedCounter.jsx          # Scroll-triggered counters
│   │   ├── SeasonalBackground.jsx       # Seasonal effects
│   │   ├── FloatingActionButton.jsx     # FAB menu
│   │   └── ...
│   ├── contexts/           # React contexts
│   │   ├── ThemeContext.jsx
│   │   ├── LanguageContext.jsx
│   │   └── UserContext.jsx
│   ├── hooks/              # Custom hooks
│   │   └── useScrollReveal.js
│   ├── pages/              # Page components
│   ├── data/               # JSON data (shared with bot)
│   │   ├── malls.json
│   │   ├── stores.json
│   │   └── products.json
│   └── index.css           # Global styles
├── server.js               # Express backend
├── bot.js                  # 🤖 Telegram Bot (NEW)
├── package.json
├── README.md
├── BOT_SETUP.md           # Bot setup guide
└── .env.example           # Environment variables template
```

## 🎨 Design System

### Color Palette
```css
Primary Background: rgba(37, 40, 54, 1)
Purple Gradient: from-purple-400 via-purple-600 to-purple-800
Gold Accent: #D4AF37
Cream: #F4EFE7
```

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Alternative**: Lato

### Component Usage

#### Button3D Component
```jsx
import Button3D from './components/Button3D'

// Primary button
<Button3D variant="primary" size="lg">
  Click Me
</Button3D>

// Outline button
<Button3D variant="outline" onClick={handleClick}>
  Learn More
</Button3D>

// Full width button
<Button3D variant="accent" fullWidth>
  Get Started
</Button3D>
```

#### AnimatedCounter
```jsx
import AnimatedCounter from './components/AnimatedCounter'

<AnimatedCounter 
  end={850} 
  suffix="+" 
  duration={2000}
  className="text-4xl font-bold"
/>
```

#### Scroll Reveal Hook
```jsx
import { useScrollReveal } from './hooks/useScrollReveal'

function MyComponent() {
  const [ref, isVisible] = useScrollReveal()
  
  return (
    <div ref={ref} className={isVisible ? 'fade-in' : ''}>
      Content
    </div>
  )
}
```

## 🎯 Key Features Implementation

### Interactive Background
The `InteractiveBackground` component uses HTML5 Canvas with:
- Particle system with orbital motion
- Mouse-based parallax effects
- Seasonal color schemes
- GPU acceleration with `requestAnimationFrame`
- Connection lines between nearby particles

### 3D Buttons
The `Button3D` component features:
- Mouse position tracking
- 3D perspective transforms
- Tilt effect based on cursor position
- Multiple style variants
- Smooth transitions

### Seasonal System
Automatic detection and visual adaptation:
- CSS animations for seasonal elements
- Dynamic color schemes in background
- Smooth transitions between seasons

## 🔐 Admin Panel - Complete Guide

### Accessing the Admin Panel

1. **Start the backend server** (required for admin panel):
```bash
npm run server
```
The backend runs on `http://localhost:5000`

2. **Access the admin login page**:
Navigate to: `http://localhost:3000/admin/login`

3. **Login with default credentials**:
- **Email**: `admin@samarkand.com`
- **Password**: `admin123`

### Admin Panel Features

#### 📊 Dashboard
- **Real-time statistics**: View total malls, stores, products, banners, and stories
- **Recent activities**: Track latest changes and additions
- **Quick actions**: Fast access to create new items
- **System status**: Monitor server and database health

#### 🏢 Mall Management (`/admin/malls`)
- **Create/Edit/Delete** malls
- **Upload** mall images and galleries
- **Set** opening hours, location, and contact info
- **Manage** mall features and amenities
- Changes reflect **immediately** on the main website

#### 🏪 Store Management (`/admin/stores`)
- **Add stores** to specific malls
- **Configure** store details, categories, and working hours
- **Upload** store logos, banners, and interior photos
- **Set** contact information and social media links
- All updates are **live** on the website instantly

#### 📦 Product Management (`/admin/products`)
- **Add products** to stores
- **Set** prices, categories, and availability
- **Upload** product images and galleries
- **Define** specifications and variations
- Products appear **immediately** in store listings

#### 🖼️ Banner Management (`/admin/banners`)
- **Create promotional banners** for homepage
- **Schedule** banner display dates
- **Set** banner positions and links
- **Toggle** active/inactive status
- Banners show **instantly** when activated

#### 📱 Instagram Stories (`/admin/stories`)
**NEW FEATURE** - Full Instagram-style stories management!

- **Create engaging stories** for mall promotions
- **Upload images or videos** with full customization
- **Add content overlays**: titles, descriptions, CTAs, discounts
- **Promote stories** with special badges (⚡ Promoted, 🆕 New)
- **Schedule stories** with start/end dates
- **Assign to specific malls** for targeted marketing
- Stories appear in **Instagram-style carousel** on mall pages

**Story Features**:
- Instagram-style ring indicators (gradient for new, gray for viewed)
- Full-screen immersive viewer with swipe navigation
- Progress bars showing story duration
- Auto-advance to next story
- Interactive elements (like, share, bookmark icons)
- Pause on touch/click
- Mobile-optimized gestures

#### ⚙️ Settings (`/admin/settings`)
- **Configure** site-wide settings
- **Update** theme colors and branding
- **Manage** company information
- **Set** contact details

#### 👥 Seller Approvals (`/admin/sellers`)
- Review and approve seller applications
- Manage seller permissions

#### 🎨 Season Engine (`/admin/season`)
- Control seasonal themes and decorations
- Activate New Year animations

#### 📄 CMS Pages (`/admin/cms`)
- Create and edit static pages
- Manage site content

#### 💬 Feedback (`/admin/feedback`)
- View customer feedback and reviews
- Respond to user inquiries

### How Admin Changes Affect the Website

**All changes are real-time and immediate:**

1. **Stories created in admin** → Appear instantly in Instagram Stories carousel on mall pages
2. **Malls added** → Show up immediately on homepage and map
3. **Stores created** → Visible in mall store directories right away
4. **Products added** → Listed in store pages immediately
5. **Banners activated** → Display on homepage instantly
6. **Settings updated** → Applied site-wide immediately

### Creating Your First Story

1. Go to **Instagram Stories** section (`/admin/stories`)
2. Click **"Yangi Hikoya"** (New Story)
3. Fill in the form:
   - **Mall**: Select the mall
   - **Title**: Store or brand name
   - **Type**: Image or Video
   - **Thumbnail URL**: Square image for story ring
   - **Media URL**: Full-size image/video for story viewer
   - **Content**: Add title, description, discount, and CTA
   - **Settings**: Mark as promoted or new, set dates
4. Click **"Yaratish"** (Create)
5. **View on website**: Navigate to the mall page to see your story!

### API Endpoints

The admin panel connects to these backend APIs:

```
POST   /api/auth/login          - Admin authentication
GET    /api/auth/me             - Get current user

GET    /api/malls               - List all malls
POST   /api/malls               - Create mall
PUT    /api/malls/:id           - Update mall
DELETE /api/malls/:id           - Delete mall

GET    /api/stores              - List all stores
POST   /api/stores              - Create store
PUT    /api/stores/:id          - Update store
DELETE /api/stores/:id          - Delete store

GET    /api/products            - List all products
POST   /api/products            - Create product
PUT    /api/products/:id        - Update product
DELETE /api/products/:id        - Delete product

GET    /api/banners             - List all banners
POST   /api/banners             - Create banner
PUT    /api/banners/:id         - Update banner
DELETE /api/banners/:id         - Delete banner

GET    /api/stories             - List all stories (public)
GET    /api/stories?mall_id=X   - Get stories for specific mall
POST   /api/stories             - Create story (admin)
PUT    /api/stories/:id         - Update story (admin)
DELETE /api/stories/:id         - Delete story (admin)
```

### Security

- **JWT Authentication**: All admin endpoints require valid JWT token
- **Token Storage**: Stored in localStorage after login
- **Auto-redirect**: Unauthenticated users redirected to login
- **Session Management**: Tokens expire after 24 hours
- **Protected Routes**: All admin pages protected with `ProtectedRoute` component

### Admin Panel Tech Stack

- **Frontend**: React + React Router
- **State**: Local state with hooks
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Express.js
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Storage**: In-memory database (server.js)

### Troubleshooting

**Can't log in?**
- Make sure backend server is running (`npm run server`)
- Check console for error messages
- Verify credentials: `admin@samarkand.com` / `admin123`

**Changes not showing?**
- Hard refresh the website (`Ctrl+Shift+R`)
- Check if backend is running
- Verify item is marked as active/published

**Stories not appearing?**
- Ensure story is marked as "Active" (isActive checkbox)
- Check story dates (start/end date)
- Verify correct mall_id is selected
- Check browser console for API errors

## 📊 Performance

- **Lighthouse Score**: 90+
- **GPU-accelerated** animations
- **Lazy loading** for images
- **Code splitting** with Vite
- **Optimized bundle** size

## 🛠️ Technologies

### Frontend
- **React** 18.2.0 - UI library
- **React Router** v6 - Navigation
- **Tailwind CSS** 3.4.1 - Styling
- **Vite** - Build tool
- **GSAP** - Animations
- **Three.js** - 3D effects

### Backend
- **Express** - Backend server
- **JWT** - Authentication
- **Multer** - File uploads

### Telegram Bot
- **node-telegram-bot-api** - Bot framework
- **Multi-language** - Full i18n support
- **Location services** - GPS integration

## 🌟 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📧 Contact

For questions or support:
- Email: info@megatravelcenter.com
- Phone: +998 (66) 233-30-30

---

**Built with ❤️ by the MTC Team**

*Delivering premium digital experiences since 2024*
