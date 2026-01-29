# MTC Platform - Developer Quick Start Guide

## New Features Overview

This guide helps developers understand and work with the newly implemented features.

---

## 📁 New Files Created

### Pages
```
src/pages/
├── InfluencerZonePage.jsx       # Influencer content and recommendations
├── CustomerSupportPage.jsx      # Support center with chat/FAQ/tickets
├── BusinessPartnershipPage.jsx  # Partnership applications
└── GamificationZonePage.jsx    # Missions, achievements, games
```

### Components
```
src/components/
├── GiftCardsSection.jsx         # Gift card buying and voucher management
├── LiveMallStatus.jsx          # Real-time mall metrics and alerts
├── Interactive3DMallMap.jsx    # 3D floor plan navigation
└── SustainabilitySection.jsx    # Eco challenges and green features
```

### Documentation
```
/
├── NEW_FEATURES_IMPLEMENTATION.md    # Complete feature overview
├── DATA_STRUCTURES_REFERENCE.md     # Backend data schemas
└── DEVELOPER_QUICK_START.md        # This file
```

---

## 🚀 Quick Component Usage

### 1. Gift Cards Section

```jsx
import GiftCardsSection from '../components/GiftCardsSection'

// In your page
<GiftCardsSection />
```

**Features**:
- Browse gift cards
- Buy with custom amounts
- Send as gift
- View owned vouchers
- Copy/share/download vouchers

---

### 2. Live Mall Status

```jsx
import LiveMallStatus from '../components/LiveMallStatus'

// In mall detail page
<LiveMallStatus mallId={mallId} />
```

**Features**:
- Real-time occupancy
- Parking availability
- Food court capacity
- Queue wait times
- Live alerts

**Auto-updates** every 5 seconds

---

### 3. Interactive 3D Map

```jsx
import Interactive3DMallMap from '../components/Interactive3DMallMap'

// In mall detail page
<Interactive3DMallMap 
  mallId={mallId} 
  mallName={mall.name}
/>
```

**Features**:
- Floor selector
- Category filtering
- Store search
- Click store for details
- Get directions (AR-style)
- Zoom controls
- 2D/3D toggle

---

### 4. Sustainability Section

```jsx
import SustainabilitySection from '../components/SustainabilitySection'

// Standalone section
<SustainabilitySection />
```

**Features**:
- Eco stats dashboard
- Recycling station locator
- EV charging status
- Eco challenges
- Green brands
- Eco rewards store

---

### 5. Full Page Components

```jsx
// All pages have routes configured in App.jsx
import { Link } from 'react-router-dom'

// Gamification Zone
<Link to="/gamification">Gamification</Link>

// Influencer Zone
<Link to="/influencer-zone">Influencer Zone</Link>

// Customer Support
<Link to="/support">Support Center</Link>

// Business Partnership
<Link to="/partnership">Partnership</Link>
```

---

## 🎨 Customization Guide

### Changing Colors

All components use MTC color scheme. To customize:

```jsx
// Example: Change primary color in SustainabilitySection
<div className="text-emerald-400">  {/* Change to text-blue-400 */}

// For gradients:
bg-gradient-to-r from-emerald-900/30 to-cyan-900/30
```

### Adjusting Animation Speed

Components use CSS animations with custom durations:

```jsx
// In components
className="animate-mtc-float"  // 8s duration
className="animate-mtc-pulse-glow"  // 3s duration
className="animate-mtc-slide-up"  // 0.5s duration
```

To change speed, modify `src/index.css`:

```css
@keyframes mtc-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-mtc-float {
  animation: mtc-float 8s ease-in-out infinite;  /* Change 8s */
}
```

---

## 🔧 State Management

### Local State (Components)

Most components use React hooks:

```jsx
const [userPoints, setUserPoints] = useState(2450)
const [activeTab, setActiveTab] = useState('buy')
const [selectedItem, setSelectedItem] = useState(null)
```

### Context Integration

Some features integrate with existing contexts:

```jsx
// User Context
const { user, isAuthenticated } = useUser()

// Ecosystem Context
const { stores, malls, products } = useEcosystem()

// Theme Context
const { darkMode } = useTheme()
```

---

## 📊 Data Fetching Patterns

### Current (Static Data)

Components import from JSON files:

```jsx
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import productsData from '../data/products.json'

const mall = mallsData.find(m => m.id === mallId)
```

### Future (API Integration)

Replace with API calls:

```jsx
import { useState, useEffect } from 'react'

const [mall, setMall] = useState(null)

useEffect(() => {
  fetch(`/api/malls/${mallId}`)
    .then(res => res.json())
    .then(data => setMall(data))
}, [mallId])
```

---

## 🎯 Adding New Features

### Step 1: Create Component

```jsx
// src/components/NewFeature.jsx
export default function NewFeature({ prop1, prop2 }) {
  return (
    <div className="mtc-glass rounded-3xl p-6">
      {/* Your content */}
    </div>
  )
}
```

### Step 2: Add Route

```jsx
// src/App.jsx
import NewFeaturePage from './pages/NewFeaturePage'

// In routes
<Route path="/new-feature" element={<NewFeaturePage />} />
```

### Step 3: Add Navigation

```jsx
// src/components/Navigation.jsx
const navLinks = [
  // ...
  { to: '/new-feature', label: 'New Feature', icon: Icon }
]
```

### Step 4: Update Data (if needed)

Add to relevant JSON file or create new one in `src/data/`

---

## 🧪 Testing Components

### Isolated Testing

```jsx
// In a test file or separate page
import GiftCardsSection from '../components/GiftCardsSection'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-mtc-bg text-white p-8">
      <GiftCardsSection />
    </div>
  )
}
```

### Props Testing

```jsx
// Test with different props
<LiveMallStatus mallId="family-park" />
<LiveMallStatus mallId="silk-road-mall" />
```

---

## 🎨 Design System Classes

### Glassmorphism
```jsx
<div className="mtc-glass">  {/* Glass effect */}
<div className="bg-white/5 backdrop-blur-md">  {/* Alternative */}
```

### Cards
```jsx
<div className="mtc-card">  {/* Premium card */}
<div className="rounded-3xl p-6 bg-white/5">  {/* Custom */}
```

### Buttons
```jsx
<button className="mtc-button-primary">Primary</button>
<button className="mtc-button-secondary">Secondary</button>
<button className="mtc-button-ghost">Ghost</button>
```

### Badges
```jsx
<span className="mtc-badge mtc-badge-primary">Featured</span>
<span className="mtc-badge mtc-badge-success">Success</span>
<span className="mtc-badge mtc-badge-warning">Warning</span>
<span className="mtc-badge mtc-badge-danger">Error</span>
```

### Animations
```jsx
<div className="animate-mtc-float">Float</div>
<div className="animate-mtc-pulse-glow">Pulse</div>
<div className="animate-mtc-slide-up">Slide Up</div>
<div className="animate-mtc-scale-in">Scale In</div>
<div className="animate-mtc-shimmer">Shimmer</div>
```

### Grids
```jsx
<div className="mtc-grid">Default grid</div>
<div className="mtc-grid-2">2 columns</div>
<div className="mtc-grid-3">3 columns</div>
<div className="mtc-grid-4">4 columns</div>
```

### Typography
```jsx
<h1 className="mtc-heading-xl">56px</h1>
<h2 className="mtc-heading-lg">44px</h2>
<h3 className="mtc-heading-md">36px</h3>
<h4 className="mtc-heading-sm">28px</h4>
<p className="mtc-body-lg">18px</p>
<p className="mtc-body">16px</p>
<p className="mtc-body-sm">14px</p>
<p className="mtc-caption">12px uppercase</p>
```

---

## 📱 Responsive Design

### Mobile Breakpoints

All components are responsive with:
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

### Conditional Rendering

```jsx
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

---

## 🔄 Real-time Updates Pattern

LiveMallStatus shows how to implement auto-refresh:

```jsx
useEffect(() => {
  const interval = setInterval(() => {
    // Fetch new data
    setStatusData(prev => ({
      ...prev,
      occupancy: prev.occupancy + (Math.random() - 0.5) * 5
    }))
  }, 5000)  // 5 seconds

  return () => clearInterval(interval)  // Cleanup
}, [])
```

---

## 🎯 Common Patterns

### Modal/Popup
```jsx
const [isOpen, setIsOpen] = useState(false)

{isOpen && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
    <div className="mtc-glass rounded-3xl p-6">
      {/* Content */}
      <button onClick={() => setIsOpen(false)}>Close</button>
    </div>
  </div>
)}
```

### Tabs
```jsx
const [activeTab, setActiveTab] = useState('tab1')

<div className="flex gap-2">
  {['tab1', 'tab2', 'tab3'].map(tab => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={activeTab === tab ? 'bg-blue-500' : 'bg-white/5'}
    >
      {tab}
    </button>
  ))}
</div>
```

### Cards Grid
```jsx
<div className="mtc-grid mtc-grid-3 gap-6">
  {items.map((item, index) => (
    <div key={item.id} style={{ animationDelay: `${index * 0.05}s` }}>
      {/* Card content */}
    </div>
  ))}
</div>
```

---

## 🐛 Troubleshooting

### Component Not Rendering

1. Check imports are correct
2. Verify route is configured in App.jsx
3. Check for console errors

### Styling Issues

1. Ensure Tailwind classes are correct
2. Check if custom CSS is loaded
3. Verify dark mode class is applied

### State Not Updating

1. Check useState hook is properly initialized
2. Verify setter function is called
3. Check for stale closures

---

## 📚 Additional Resources

- **MTC Design System**: See `MTC_COMPONENT_LIBRARY.md`
- **Architecture**: See `MTC_ARCHITECTURE.md`
- **Quick Start**: See `MTC_QUICK_START.md`

---

## 🎓 Next Steps

1. **Backend Integration**: Connect components to API
2. **Database Setup**: Implement data structures from reference
3. **Testing**: Write unit and integration tests
4. **Optimization**: Add lazy loading and code splitting
5. **Analytics**: Integrate tracking

---

## 💡 Tips

- **Use component composition**: Break down complex UIs
- **Leverage existing components**: Reuse MTC components
- **Follow naming conventions**: Use descriptive names
- **Keep components small**: Single responsibility
- **Test on mobile**: Many users are on mobile devices

---

**Happy Coding! 🚀**

For questions or issues, refer to the implementation documents or contact the development team.
