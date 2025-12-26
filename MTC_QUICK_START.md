# MTC Platform - Quick Start Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
This starts Vite dev server at `http://localhost:3000`

### 3. Start Backend (for Admin Panel)
```bash
npm run server
```
Backend API runs at `http://localhost:5000`

### 4. Start Everything Together
```bash
npm run start:all
```

---

## 🎨 MTC Design System - At a Glance

### Colors

```css
/* Primary Background */
background: rgba(37, 40, 54, 1); /* Cinematic Dark */

/* Accents */
--electric-blue: #3B82F6;
--purple-gradient: linear-gradient(135deg, #3B82F6, #A855F7, #EC4899);
--gold: #F59E0B;
--emerald: #10B981;

/* Glassmorphism */
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Typography

| Element | Font | Size |
|----------|-------|-------|
| H1 | Playfair Display | 56px (32px mobile) |
| H2 | Playfair Display | 44px (28px mobile) |
| H3 | Playfair Display | 36px (24px mobile) |
| H4 | Playfair Display | 28px (20px mobile) |
| Body | Inter | 16px (14px mobile) |
| Caption | Inter | 12px uppercase |

---

## 🧩 Component Usage Examples

### MTC Card

```jsx
import MTCMallCard from '../components/MTCMallCard'

<MTCMallCard
  mall={mallData}
  index={0}
  delay={0.1}
/>
```

### MTC Buttons

```jsx
{/* Primary Button */}
<button className="mtc-button-primary">
  Browse Malls
</button>

{/* Secondary Button */}
<button className="mtc-button-secondary">
  Virtual Tour
</button>

{/* Ghost Button */}
<button className="mtc-button-ghost">
  Cancel
</button>
```

### MTC Glass Container

```jsx
<div className="mtc-glass p-6 rounded-2xl">
  <h3 className="mtc-heading-md">Premium Content</h3>
  <p className="mtc-body text-white/70">Glassmorphism effect</p>
</div>
```

### MTC Badge

```jsx
<span className="mtc-badge mtc-badge-primary">
  Featured
</span>

<span className="mtc-badge mtc-badge-success">
  Open Now
</span>

<span className="mtc-badge mtc-badge-warning">
  Coming Soon
</span>
```

### MTC Grid

```jsx
<div className="mtc-grid mtc-grid-3">
  {items.map(item => (
    <div key={item.id} className="mtc-card p-4">
      {item.content}
    </div>
  ))}
</div>
```

---

## 🎬 Animation Classes

```jsx
{/* Float Animation */}
<div className="animate-mtc-float">
  Floating content
</div>

{/* Slide Up */}
<div className="animate-mtc-slide-up">
  Reveal from bottom
</div>

{/* Scale In */}
<div className="animate-mtc-scale-in">
  Pop in effect
</div>

{/* Glow Effect */}
<div className="animate-mtc-pulse-glow">
  Pulsing glow
</div>
```

---

## 📱 Mobile Navigation

Bottom navigation items (fixed, z-index: 50):

1. **Home** (`/`) - Main landing
2. **Malls** (`/store-directory`) - Browse all malls
3. **Stores** (`/stores`) - All stores
4. **Favorites** (`/favorites`) - Saved items

---

## 🔐 Admin Panel

### Access
- URL: `http://localhost:3000/admin/login`
- Email: `admin@samarkand.com`
- Password: `admin123`

### Requirements
- Backend must be running: `npm run server`
- JWT token stored in localStorage
- Session expires after 24 hours

---

## 📊 File Structure

```
src/
├── components/
│   ├── MTCBackground.jsx          # Canvas particle animation
│   ├── MTCHeroSection.jsx        # Cinematic hero
│   ├── MTCMallCard.jsx           # 3D mall cards
│   └── ... (existing components)
├── pages/
│   ├── MTCHomePage.jsx           # Premium homepage
│   └── ... (existing pages)
├── contexts/
│   ├── ThemeContext.jsx
│   ├── LanguageContext.jsx
│   └── UserContext.jsx
└── data/
    ├── malls.json
    ├── stores.json
    └── products.json
```

---

## 🎯 Tailwind Config Additions

### MTC Colors (Available in Tailwind)

```jsx
// Background
className="bg-[rgba(37,40,54,1)]"
// OR
className="bg-mtc-bg"

// Accents
className="text-blue-400"        // Electric Blue
className="text-purple-500"      // Purple
className="text-emerald-500"     // Emerald
className="text-yellow-500"      // Gold

// Glass
className="bg-mtc-glass"
className="border-mtc-glass-border"
className="shadow-mtc-glass"
```

### MTC Shadows (Available in Tailwind)

```jsx
className="shadow-mtc-card"           // Card shadow
className="shadow-mtc-card-hover"      // Hover shadow
className="shadow-mtc-glow"            // Blue glow
className="shadow-mtc-gold-glow"       // Gold glow
className="shadow-mtc-emerald-glow"    // Emerald glow
```

### MTC Animations (Available in Tailwind)

```jsx
className="animate-mtc-float"        // Float animation
className="animate-mtc-pulse-glow"   // Pulse glow
className="animate-mtc-slide-up"     // Slide up
className="animate-mtc-scale-in"     // Scale in
className="animate-mtc-shimmer"      // Shimmer effect
```

---

## 🎨 CSS Variables (Optional Override)

Add to your component to override defaults:

```jsx
<div style={{
  '--mtc-bg': 'rgba(37, 40, 54, 1)',
  '--mtc-primary': '#3B82F6',
  '--mtc-purple': '#A855F7'
}}>
  Your content
</div>
```

---

## 📐 Responsive Breakpoints

```css
/* Mobile First */
sm: 375px    /* Small phones */
md: 768px    /* Tablets */
lg: 1200px   /* Desktop */
```

Usage:
```jsx
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>
```

---

## 🖼️ Image Best Practices

### Product Images
- Aspect ratio: 1:1 (square)
- Recommended size: 600x600px
- Format: WebP with JPEG fallback
- Lazy loading: `loading="lazy"`

### Mall Cards
- Aspect ratio: 4:3
- Recommended size: 800x600px
- Hero banner: 1920x1080px

### Loading States

```jsx
{/* Skeleton Loading */}
{loading ? (
  <MTCMallCardSkeleton />
) : (
  <MTCMallCard mall={mall} />
)}
```

---

## ⚡ Performance Tips

1. **Use MTC Components** - Pre-optimized for performance
2. **Lazy Load Images** - Add `loading="lazy"` attribute
3. **Code Splitting** - Use dynamic imports for heavy routes
4. **Memoize Components** - Use `React.memo` for expensive renders
5. **Debounce Search** - Prevent excessive API calls
6. **Virtual Lists** - For long lists (1000+ items)

---

## 🐛 Troubleshooting

### White Screen
1. Check browser console for errors
2. Verify data exists in JSON files
3. Ensure `MTCBackground` canvas is supported

### Styles Not Applying
1. Verify `tailwind.config.js` is correct
2. Check `index.css` is imported in `main.jsx`
3. Clear browser cache (Ctrl+Shift+R)

### Animations Not Smooth
1. Check browser supports `requestAnimationFrame`
2. Verify GPU acceleration is enabled
3. Reduce particle count in `MTCBackground.jsx`

### Mobile Navigation Issues
1. Check z-index (should be 50)
2. Verify safe area insets for notched devices
3. Test on actual device (emulator may differ)

---

## 📚 Documentation Links

- [Full Architecture](./MTC_ARCHITECTURE.md)
- [Implementation Details](./MTC_IMPLEMENTATION_SUMMARY.md)
- [Main README](./README.md)
- [Admin Guide](./ADMIN_GUIDE.md)
- [Bot Setup](./BOT_SETUP.md)

---

## 🎓 Learning Resources

### React
- [Official Docs](https://react.dev)
- [React Router](https://reactrouter.com)

### Tailwind CSS
- [Official Docs](https://tailwindcss.com)
- [Custom Config](https://tailwindcss.com/docs/theme)

### Framer Motion
- [Documentation](https://www.framer.com/motion)
- [Examples](https://www.framer.com/motion/examples)

### Canvas Animation
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

---

## 💡 Pro Tips

1. **Use MTC Components First** - They're pre-optimized
2. **Stagger Animations** - Add `style={{ animationDelay: '0.1s' }}`
3. **Glassmorphism Layering** - Stack multiple `mtc-glass` for depth
4. **Gradient Text** - Use `mtc-gradient-text` for headings
5. **Micro-interactions** - Add `mtc-hover-lift` to all cards

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```
Output: `dist/` folder

### Preview Production Build
```bash
npm run preview
```

### Environment Variables

```env
VITE_API_URL=https://api.mtc.uz
VITE_GOOGLE_MAPS_KEY=your_key
```

---

## 📞 Support

- **Email**: info@megatravelcenter.com
- **Telegram**: @samarkandmall
- **Issues**: GitHub Issues

---

**Built with 💜 in Samarkand, Uzbekistan**
