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

## 🔐 Admin Access

**URL**: `http://localhost:3000/admin/login`

**Default Credentials**:
- Email: `admin@samarkand.com`
- Password: `admin123`

**Features**:
- Full CRUD operations
- Media management
- Real-time updates
- Responsive dashboard

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
