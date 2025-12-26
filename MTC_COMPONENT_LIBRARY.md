# MTC Platform - Component Library

## 📦 Complete Component Set

### ✅ Core Components

#### 1. MTCBackground.jsx
**Purpose**: Premium background animation system

**Props**: None

**Features**:
- Canvas-based particle system
- Mouse-responsive parallax
- Winter snow effect
- GPU-accelerated (60fps)
- Non-intrusive design

**Usage**:
```jsx
import MTCBackground from '../components/MTCBackground'

// Auto-rendered in App.jsx
<MTCBackground />
```

---

#### 2. MTCHeroSection.jsx
**Purpose**: Cinematic hero section with parallax

**Props**: None

**Features**:
- Full-width parallax background
- Premium gradient overlay
- Animated stats row
- Three CTA buttons
- Scroll indicator

**Usage**:
```jsx
import MTCHeroSection from '../components/MTCHeroSection'

<MTCHeroSection />
```

---

#### 3. MTCMallCard.jsx
**Purpose**: Premium 3D mall card with hover effects

**Props**:
```tsx
interface Props {
  mall: Mall
  index?: number
  delay?: number
}
```

**Features**:
- 3D hover with perspective
- Image zoom on hover
- Wishlist heart with animation
- Status badges
- Rating display
- Skeleton loading

**Usage**:
```jsx
import MTCMallCard, { MTCMallCardSkeleton } from '../components/MTCMallCard'

<MTCMallCard
  mall={mallData}
  index={0}
  delay={0.1}
/>

{/* Loading State */}
{loading && <MTCMallCardSkeleton />}
```

---

#### 4. MTCHomePage.jsx
**Purpose**: Complete premium homepage

**Sections**:
1. Hero (cinematic parallax)
2. Quick Actions (mobile)
3. Promotions Carousel
4. Featured Malls Grid
5. Popular Shops
6. Events & Attractions
7. Interactive Map Preview
8. Newsletter Signup

**Usage**:
```jsx
import MTCHomePage from '../pages/MTCHomePage'

<Route path="/" element={<MTCHomePage />} />
```

---

#### 5. MTCProductCard.jsx
**Purpose**: Uzum/Amazon style product card

**Props**:
```tsx
interface Props {
  product: Product
  onAddToCart?: (product) => void
  onToggleWishlist?: (productId) => void
  delay?: number
}
```

**Features**:
- Image zoom on hover
- Wishlist heart animation
- Quick add to cart
- Discount badges
- Rating display
- Flash sale indicator

**Usage**:
```jsx
import MTCProductCard, { MTCProductCardSkeleton, MTCProductGrid } from '../components/MTCProductCard'

<MTCProductGrid>
  {products.map(product => (
    <MTCProductCard
      key={product.id}
      product={product}
      onAddToCart={handleAddToCart}
      onToggleWishlist={handleToggleWishlist}
    />
  ))}
</MTCProductGrid>
```

---

### 🎨 Design System Components

#### Buttons

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

#### Badges

```jsx
{/* Primary Badge */}
<span className="mtc-badge mtc-badge-primary">
  Featured
</span>

{/* Success Badge */}
<span className="mtc-badge mtc-badge-success">
  Open Now
</span>

{/* Warning Badge */}
<span className="mtc-badge mtc-badge-warning">
  Coming Soon
</span>

{/* Danger Badge */}
<span className="mtc-badge mtc-badge-danger">
  -50%
</span>
```

#### Cards

```jsx
{/* Glass Card */}
<div className="mtc-card p-6">
  Card content
</div>

{/* 3D Card Container */}
<div className="mtc-card-3d">
  <div className="mtc-card-3d-inner">
    <div className="mtc-card">
      3D card content
    </div>
  </div>
</div>

{/* Glass Container */}
<div className="mtc-glass p-6 rounded-2xl">
  Glassmorphism content
</div>
```

#### Typography

```jsx
{/* Heading XL */}
<h1 className="mtc-heading-xl">
  Page Title
</h1>

{/* Heading LG */}
<h2 className="mtc-heading-lg">
  Section Title
</h2>

{/* Heading MD */}
<h3 className="mtc-heading-md">
  Subsection Title
</h3>

{/* Heading SM */}
<h4 className="mtc-heading-sm">
  Card Title
</h4>

{/* Body Text */}
<p className="mtc-body">
  Body content
</p>

{/* Body Large */}
<p className="mtc-body-lg">
  Lead paragraph
</p>

{/* Body Small */}
<p className="mtc-body-sm">
  Secondary text
</p>

{/* Caption */}
<span className="mtc-caption">
  Caption text
</span>
```

#### Gradient Text

```jsx
{/* Blue-Purple Gradient */}
<span className="mtc-gradient-text">
  Gradient Heading
</span>

{/* Gold Gradient */}
<span className="mtc-gradient-text-gold">
  Gold Premium Text
</span>
```

---

### ⚡ Animation Classes

```jsx
{/* Float Animation */}
<div className="animate-mtc-float">
  Floating content (8s duration)
</div>

{/* Pulse Glow */}
<div className="animate-mtc-pulse-glow">
  Pulsing glow effect (3s duration)
</div>

{/* Shimmer */}
<div className="animate-mtc-shimmer">
  Shimmer loading effect
</div>

{/* Slide Up */}
<div className="animate-mtc-slide-up">
  Fade in from bottom (0.5s duration)
</div>

{/* Scale In */}
<div className="animate-mtc-scale-in">
  Scale from 0.9 to 1 (0.4s duration)
</div>

{/* Snowfall */}
<div className="animate-mtc-snowfall">
  Snow particle animation
</div>
```

---

### 🖱️ Hover Effects

```jsx
{/* Lift Effect */}
<div className="mtc-hover-lift">
  Translates Y -8px on hover
</div>

{/* Glow Effect */}
<div className="mtc-hover-glow">
  Adds blue glow shadow on hover
</div>

{/* Scale Effect */}
<div className="mtc-hover-scale">
  Scales to 1.03 on hover
</div>
```

---

### 📊 Layout Components

```jsx
{/* Grid System */}
<div className="mtc-grid mtc-grid-2">
  {/* 2 columns */}
</div>

<div className="mtc-grid mtc-grid-3">
  {/* 3 columns */}
</div>

<div className="mtc-grid mtc-grid-4">
  {/* 4 columns */}
</div>

<div className="mtc-grid mtc-grid-responsive">
  {/* Auto-fit, min 280px */}
</div>

{/* Container */}
<div className="mtc-container">
  Max-width 1400px, centered
</div>

{/* Section */}
<section className="mtc-section">
  Padding 5rem (desktop), 3rem (mobile)
</section>

{/* Gap Utilities */}
<div className="mtc-gap-sm">
  {/* Gap 0.75rem */}
</div>

<div className="mtc-gap-md">
  {/* Gap 1.5rem */}
</div>

<div className="mtc-gap-lg">
  {/* Gap 2.5rem */}
</div>

<div className="mtc-gap-xl">
  {/* Gap 4rem */}
</div>
```

---

### 🎯 Border Radius

```jsx
<div className="mtc-radius-xl">
  {/* 1rem = 16px */}
</div>

<div className="mtc-radius-2xl">
  {/* 1.25rem = 20px */}
</div>

<div className="mtc-radius-3xl">
  {/* 1.5rem = 24px */}
</div>

<div className="mtc-radius-full">
  {/* 9999px = Circle */}
</div>
```

---

### 🔤 Shadows

```jsx
{/* Card Shadow */}
<div className="shadow-mtc-card">
  {/* 0 4px 24px rgba(0,0,0,0.15) */}
</div>

{/* Card Hover Shadow */}
<div className="shadow-mtc-card-hover">
  {/* 0 12px 48px rgba(0,0,0,0.25) */}
</div>

{/* Blue Glow */}
<div className="shadow-mtc-glow">
  {/* 0 0 20px rgba(59,130,246,0.3) */}
</div>

{/* Blue Glow Large */}
<div className="shadow-mtc-glow-lg">
  {/* 0 0 40px rgba(59,130,246,0.5) */}
</div>

{/* Gold Glow */}
<div className="shadow-mtc-gold-glow">
  {/* 0 0 20px rgba(245,158,11,0.3) */}
</div>

{/* Emerald Glow */}
<div className="shadow-mtc-emerald-glow">
  {/* 0 0 20px rgba(16,185,129,0.3) */}
</div>

{/* Glass Shadow */}
<div className="shadow-mtc-glass">
  {/* 0 8px 32px rgba(0,0,0,0.3) */}
</div>
```

---

### 📱 Mobile Components

```jsx
{/* Bottom Navigation */}
<BottomNavigation />
{/* Renders 4 items: Home | Malls | Stores | Favorites */}

{/* Mobile Quick Actions */}
<div className="grid grid-cols-2 gap-3 md:hidden">
  <QuickActionButton icon={<MapPin />} label="Find Mall" />
  <QuickActionButton icon={<TrendingUp />} label="Trending" />
</div>
```

---

## 🎨 Tailwind Configuration

### MTC Colors (Available as utilities)

```jsx
{/* Background */}
className="bg-[rgba(37,40,54,1)]"
className="bg-mtc-bg"

{/* Text */}
className="text-white"
className="text-white/70"
className="text-white/50"

{/* Accents */}
className="text-blue-400"      /* Electric Blue */
className="text-blue-500"
className="text-purple-400"    /* Purple */
className="text-purple-500"
className="text-emerald-400"   /* Emerald */
className="text-emerald-500"
className="text-yellow-400"     /* Gold */
className="text-yellow-500"
```

### MTC Gradients

```jsx
{/* Electric Blue Gradient */}
className="bg-gradient-to-r from-blue-400 to-blue-600"

{/* Purple Gradient */}
className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600"

{/* Gold Gradient */}
className="bg-gradient-to-r from-yellow-400 to-yellow-600"

{/* Complex Gradient */}
className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600"
```

---

## 🚀 Quick Patterns

### Card with Image

```jsx
<div className="mtc-card overflow-hidden">
  <div className="aspect-[4/3] overflow-hidden">
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-full object-cover hover:scale-110 transition-transform"
    />
  </div>
  <div className="p-5">
    <h3 className="mtc-heading-sm mb-2">{title}</h3>
    <p className="mtc-body-sm text-white/70">{description}</p>
  </div>
</div>
```

### Glassmorphism Container

```jsx
<div className="mtc-glass rounded-2xl p-6 border border-white/10">
  <h3 className="mtc-heading-md mb-4">Premium Section</h3>
  <p className="mtc-body text-white/70">
    Glassmorphism effect with backdrop blur
  </p>
</div>
```

### Hero Section

```jsx
<section className="relative min-h-[80vh] flex items-center">
  {/* Background with Parallax */}
  <div className="absolute inset-0 overflow-hidden">
    <img
      src={heroImage}
      alt="Hero"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-[rgba(37,40,54,1)]" />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
    <h1 className="mtc-heading-xl mtc-gradient-text">
      Hero Heading
    </h1>
    <button className="mtc-button-primary mt-8">
      Call to Action
    </button>
  </div>
</section>
```

### Section with Grid

```jsx
<section className="mtc-container mtc-section">
  <div className="flex items-center justify-between mb-8">
    <div>
      <h2 className="mtc-heading-lg mb-2">Section Title</h2>
      <p className="mtc-body text-white/60">Section description</p>
    </div>
  </div>

  <div className="mtc-grid mtc-grid-3">
    {items.map(item => (
      <div key={item.id} className="mtc-card mtc-hover-lift">
        {item.content}
      </div>
    ))}
  </div>
</section>
```

---

## 🎯 Best Practices

### Performance

1. **Use Lazy Loading** for images
   ```jsx
   <img src={url} loading="lazy" alt={description} />
   ```

2. **Use Skeletons** for loading states
   ```jsx
   {loading ? <MTCMallCardSkeleton /> : <MTCMallCard mall={mall} />}
   ```

3. **Stagger Animations** for multiple items
   ```jsx
   {items.map((item, index) => (
     <div key={item.id} style={{ animationDelay: `${index * 0.1}s` }}>
       {item.content}
     </div>
   ))}
   ```

4. **Memoize Expensive Components**
   ```jsx
   const ExpensiveComponent = React.memo(({ data }) => {
     return <div>{/* expensive rendering */}</div>
   })
   ```

### Accessibility

1. **Semantic HTML** - Use correct elements
2. **ARIA Labels** - On interactive elements
3. **Keyboard Navigation** - Support tab/enter
4. **Focus States** - Visible focus indicators
5. **Color Contrast** - Minimum 4.5:1 ratio

### Mobile UX

1. **Touch Targets** - Minimum 48x48px
2. **Thumb Zone** - Bottom navigation for easy reach
3. **Safe Area** - Handle notched devices
4. **Responsive Images** - Use srcset or sizes
5. **Readable Text** - Minimum 14px, 16px preferred

### Design Consistency

1. **Use MTC Components** - Pre-optimized styles
2. **Follow Spacing System** - Use mtc-gap-* classes
3. **Typography Hierarchy** - Heading sizes, body text
4. **Color System** - Use MTC colors, not arbitrary values
5. **Animation Timing** - Consistent durations (0.3s, 0.5s)

---

## 📞 Troubleshooting

### Component Not Rendering

1. Check import path
2. Verify export is default or named
3. Check for JavaScript errors in console

### Styles Not Applying

1. Verify Tailwind class names
2. Check CSS is imported in main.jsx
3. Clear browser cache (Ctrl+Shift+R)

### Animations Choppy

1. Check browser supports requestAnimationFrame
2. Verify GPU acceleration is enabled
3. Reduce particle count in MTCBackground

### Mobile Layout Issues

1. Check z-index (nav should be 50)
2. Verify safe area insets
3. Test on actual device (emulator differs)

---

## 🔗 Related Documentation

- [MTC_ARCHITECTURE.md](./MTC_ARCHITECTURE.md) - Full platform architecture
- [MTC_IMPLEMENTATION_SUMMARY.md](./MTC_IMPLEMENTATION_SUMMARY.md) - Implementation details
- [MTC_QUICK_START.md](./MTC_QUICK_START.md) - Quick start guide
- [README.md](./README.md) - Main project README

---

**Built with 💜 in Samarkand, Uzbekistan**
