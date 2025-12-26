# Mega Travel Center (MTC) - Ultra-Premium Platform Architecture

## Executive Summary

Mega Travel Center (MTC) is an ultra-premium digital ecosystem showcasing Samarkand's shopping malls, their shops, and all products. The platform delivers Apple-level minimalism, Amazon/Uzum usability, and a real mall experience with smooth, realistic motion.

---

## Design Philosophy

### Core Principles
1. **Apple-Level Minimalism**: Clean, uncluttered interfaces with intentional white space
2. **Amazon/Uzum Usability**: Intuitive navigation, powerful search, smart recommendations
3. **Real Mall Experience**: Immersive, interactive, spatial
4. **Cinematic Premium Feel**: Dark backgrounds, subtle animations, glass-morphism

### Primary Design System
- **Background**: `rgba(37,40,54,1)` - Dark, premium, cinematic
- **Typography**: Clean, modern, comfortable spacing
- **Hierarchy**: Clear visual structure, avoid clutter
- **Motion**: Smooth, realistic micro-animations

---

## Color Palette

### Primary Colors
```
Background: rgba(37,40,54,1) - Cinematic Dark
Text Primary: #FFFFFF - Pure White
Text Secondary: rgba(255,255,255,0.7) - Soft White
Text Tertiary: rgba(255,255,255,0.5) - Muted
```

### Accent Colors
```
Electric Blue: #3B82F6
Soft Gradient Purples: linear-gradient(135deg, #A855F7, #6366F1)
Emerald Highlights: #10B981
Gold Premium: #F59E0B
```

### Glassmorphism
```
Background: rgba(255,255,255,0.08)
Backdrop Blur: 20px
Border: 1px solid rgba(255,255,255,0.1)
Shadow: 0 8px 32px rgba(0,0,0,0.3)
```

---

## Typography System

### Font Families
- **Display**: 'Playfair Display', serif - Headings
- **Body**: 'Inter', sans-serif - All text
- **Numbers**: 'Inter', sans-serif - Consistent digits

### Type Scale
```
H1: 56px / 64px (Mobile: 32px / 40px)
H2: 44px / 52px (Mobile: 28px / 36px)
H3: 36px / 44px (Mobile: 24px / 32px)
H4: 28px / 36px (Mobile: 20px / 28px)
Body Large: 18px / 28px (Mobile: 16px / 24px)
Body: 16px / 24px (Mobile: 14px / 20px)
Small: 14px / 20px (Mobile: 12px / 16px)
Caption: 12px / 16px (Mobile: 10px / 14px)
```

### Spacing System
```
Comfortable letter-spacing: -0.02em for headings, 0 for body
Line-height: 1.14 for headings, 1.5 for body
Paragraph spacing: 1.5em
```

---

## Global Layout Architecture

### Desktop Layout (1200px+)
```
┌─────────────────────────────────────────────────┐
│ Top Navigation (64px)                          │
├─────────────────────────────────────────────────┤
│                                                 │
│ Main Content Area                              │
│ (Max-width: 1400px, Centered)                  │
│                                                 │
├─────────────────────────────────────────────────┤
│ Footer (320px)                                  │
└─────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)
```
┌─────────────────────────┐
│ Top Bar (56px)          │
├─────────────────────────┤
│                         │
│ Scrollable Content      │
│ (Safe Area: pb-24)      │
│                         │
├─────────────────────────┤
│ Bottom Nav (64px)       │
└─────────────────────────┘
```

---

## Page Architecture

### 1. Homepage (`/`)

#### Hero Section (80vh)
- Cinematic full-width background image
- Glass overlay with subtle gradient
- Headline: "Explore Samarkand Malls"
- Subtext: Short, compelling description
- CTA Buttons (3):
  - Primary: "Browse Malls"
  - Secondary: "Events & Deals"
  - Tertiary: "Virtual Tour"

#### Featured Malls Grid
- 6 cards per row (Desktop), 2 cards (Mobile)
- Each card:
  - Aspect ratio: 4:3
  - Image with subtle zoom on hover
  - Mall name (H4)
  - Short description (2 lines max)
  - Rating (star + count)
  - Open/Close status badge
  - "View Mall" button (ghost style)
- Hover effect: Scale up + shadow + slight rotation

#### Current Promotions
- Auto-sliding carousel
- Promo cards with countdown timer
- Flash sale indicators
- Discount badges

#### Popular Shops Section
- Grid layout (4 columns desktop, 2 mobile)
- Shop logo + preview image
- Mini description
- Category tag

#### Events & Attractions
- Horizontal scroll carousel
- Event cards with date/time
- Location tag
- Ticket booking button

#### Interactive Mini Map Preview
- Static map preview
- Mall markers
- "Open Full Map" button

#### Newsletter/App Download
- Email signup form
- App store badges
- QR code

---

### 2. Mall Details Page (`/mall/:mallId`)

#### Hero Section (60vh)
- Full-width panoramic banner
- Mall name (H1)
- Description paragraph (max 2 lines, expandable)
- Action Buttons Row:
  - Shops
  - Restaurants
  - Attractions
  - Deals
  - Parking
  - Contact
- Stats row:
  - Total shops
  - Current visitors
  - Parking available

#### Mall Content Sections

**Shops by Category**
- Filterable grid
- Category tabs (horizontal scroll)
- Search bar
- Shop cards with:
  - Logo
  - Banner
  - Name
  - Opening date
  - Working hours
  - Floor/location
  - "Open Shop" button

**Food Court Block**
- Restaurant cards with cuisine type
- Menu previews
- Order now buttons
- Table reservation

**Entertainment & Attractions**
- Kids park, VR rooms, cinema, rides
- Event schedule
- Booking system

**Events Calendar**
- Date-based event cards
- Filter by type
- Ticket integration

**Promotions & Flash Deals**
- Countdown timers
- Discount badges
- Limited availability

**Parking & Navigation**
- Live parking availability
- Floor plan with shop locations
- Turn-by-turn directions

**Contact & Information**
- Phone, email, social links
- FAQ accordion
- Live chat support

---

### 3. Shops Page (`/mall/:mallId/stores`)

#### Filters Bar (Sticky)
- Category dropdown
- Sort: New | Popular | Discount
- Search input
- Grid/List toggle

#### Shop Cards Grid
- Each card:
  - Shop logo (64x64)
  - Banner image (4:3)
  - Shop name (H4)
  - Category tag
  - Description (2 lines)
  - Opening date
  - Working hours
  - Floor/Area location
  - Rating
  - "Open Shop" button
- Hover: Card lift, shadow increase

---

### 4. Shop Details Page (`/mall/:mallId/store/:storeId`)

#### Top Section
- Gallery carousel (multiple images)
- Shop logo (96x96, centered)
- Shop name (H1)
- Description (read more expandable)
- Phone number (clickable)
- Floor/area badge
- Business hours (with current status)
- Social links row
- Share button

#### Product Grid (Uzum/Amazon style)
- Sidebar filters (desktop):
  - Price range
  - Categories
  - Brands
  - Rating
  - Availability
- Product grid:
  - Product image (4:3)
  - Title (max 2 lines)
  - Price + discount badge
  - Rating
  - Wishlist heart icon
  - Quick view button

#### Promotions Section
- Shop-specific deals
- Bundle offers
- Loyalty rewards

#### "Recommended for You" Carousel
- Related products
- Frequently bought together

---

### 5. Product Pages

#### Product Card (Listing)
- Large product image (aspect ratio 1:1)
- Title (max 2 lines)
- Price with strik-through original
- Discount percentage badge
- Rating (stars + count)
- Wishlist heart icon

#### Product Detail Page (`/product/:productId`)
- Gallery with multiple angles
- Thumbnails row
- Main image zoom on hover
- Product name (H1)
- Price breakdown
  - Original price (strikethrough)
  - Discount price (large)
  - You save (calculated)
  - Tax info
- Full description (rich text)
- Specifications table
  - Property | Value
- Reviews section
  - Average rating
  - Rating distribution
  - Individual reviews with photos
- FAQ accordion
- Similar products grid

---

## Animation System

### Global Background Animation
- **Type**: Subtle particle system
- **Behavior**: React to mouse movement (parallax)
- **Technology**: Canvas + requestAnimationFrame
- **Performance**: < 16ms per frame, 60fps
- **Particles**: Small glowing orbs, slow drift
- **Mouse Interaction**: Particles slightly attracted/repelled
- **Mobile**: Simplified version with fewer particles

### Season Theme: Winter
- **Effect**: Soft snow animation
- **Characteristics**:
  - Small, delicate snowflakes
  - Slow, natural falling motion
  - Gentle horizontal drift
  - Variable opacity
  - Accumulation at bottom (optional)
- **Implementation**:
  - Canvas-based particle system
  - GSAP for smooth motion
  - Non-intrusive opacity (0.3-0.5)
  - Disabled on scroll for performance

### Micro-Interactions
- **Button hover**: Scale 1.05, shadow increase
- **Card hover**: Lift 8px, rotate 1deg, shadow bloom
- **Image hover**: Scale 1.1, brightness +10%
- **Input focus**: Border glow, label float
- **Link hover**: Underline slide-in
- **Pagination**: Smooth scroll, content fade-in
- **Modal**: Scale up with backdrop blur

### Page Transitions
- **Fade**: Opacity 0→1, 0.3s ease
- **Slide**: Transform translate, 0.4s cubic-bezier
- **Stagger**: Children animate with delay
- **Scroll**: Elements reveal on viewport enter

---

## Virtual Mall Experience (Optional 3D Feature)

### Navigation
- Step-by-step pathfinding
- Clickable shops with info
- Floor selector UI (1F, 2F, etc.)
- Smooth camera movements

### Technology
- Three.js for 3D rendering
- OrbitControls for navigation
- Raycaster for click detection
- Performance optimizations:
  - Level of Detail (LOD)
  - Instanced meshes
  - Frustum culling

### UI Overlay
- Minimap
- Floor plan toggle
- Shop search
- Current location indicator
- Path preview

---

## Admin Panel

### Dashboard Overview
- Real-time analytics
- Visitor metrics
- Conversion rates
- Top-performing shops
- Active promotions
- Quick actions

### Mall Management
- CRUD operations
- Image upload (multi)
- Floor plan upload
- Map coordinates
- Operating hours
- Feature toggles

### Shop Management
- Add/Edit/Delete shops
- Logo upload
- Banner images
- Descriptions (rich text)
- Working hours
- Floor/location assignment
- Category management

### Product Management
- Bulk upload (CSV)
- Image gallery
- Price & discount
- Stock levels
- Inventory alerts
- SEO fields

### Promotions
- Banner management
- Flash sales
- Time-limited discounts
- Target by mall/shop/product
- A/B testing

### Events
- Event creation
- Schedule management
- Ticket integration
- Capacity management
- Multi-day events

### Users
- User list
- Role management
- Permission controls
- Activity logs
- Ban/block functionality

### Advertising
- Banner placement
- Targeting rules
- Impression tracking
- Click analytics
- CPM/CPC pricing

---

## Loyalty & Interaction Features

### Wishlist
- Add/remove items
- Share wishlist
- Price drop alerts
- Wishlist collections

### Click & Collect
- Select store
- Time slot picker
- Ready notifications
- QR code pickup

### Cashback & Points
- Earn points on purchases
- Points to rewards
- Tiered membership
- Bonus point events

### Price Alerts
- Set target price
- Email notifications
- Push alerts (mobile)
- Price history charts

### Reviews & Ratings
- Star rating (1-5)
- Photo uploads
- Video reviews
- Helpful voting
- Verified purchase badge

---

## Mobile UX (Critical)

### Design Rules
- **Large buttons**: Min 44px height, 16px padding
- **One-hand navigation**: Thumb zone optimization
- **Sticky bottom nav**: 5 items (Home, Malls, Search, Wishlist, Profile)
- **Touch targets**: Min 48x48px
- **Readable text**: Min 14px body, 16px preferred

### Bottom Navigation
- Fixed position, z-index: 50
- Height: 64px (with safe area)
- Active state: Purple glow
- Active icon: Filled
- Inactive: Outline
- Badge: Notification count

### Scroll Behavior
- Smooth scrolling
- Snap to sections (optional)
- Pull to refresh
- Infinite scroll (where applicable)

### Mobile-Specific Features
- Swipe gestures for galleries
- Long press for context menus
- Haptic feedback
- Offline mode (PWA)
- Push notifications

---

## Performance Optimization

### Code Splitting
- Route-based chunks
- Lazy load components
- Dynamic imports

### Image Optimization
- WebP format with fallbacks
- Responsive images (srcset)
- Lazy loading (intersection observer)
- Blur-up placeholder

### Animation Performance
- CSS transforms (GPU accelerated)
- will-change hints
- requestAnimationFrame
- Reduce motion preference

### Bundle Size
- Tree shaking
- Minification
- Gzip compression
- CDN delivery

---

## Technical Stack

### Frontend
- **Framework**: React 18
- **Routing**: React Router 6
- **Styling**: Tailwind CSS + CSS modules
- **State**: React Context + hooks
- **Animations**: Framer Motion + GSAP
- **3D**: Three.js (optional)
- **Icons**: Lucide React

### Backend
- **API**: Express.js
- **Database**: JSON (development) → PostgreSQL/MongoDB (production)
- **Auth**: JWT
- **File Upload**: Multer
- **CORS**: Enabled

### Mobile
- **PWA**: Service Worker
- **Manifest**: Web App Manifest
- **Push**: Web Push API

---

## Data Models

### Mall
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "location": "string",
  "coordinates": [lat, lng],
  "bannerImage": "url",
  "images": ["url"],
  "description": "string",
  "openedDate": "YYYY",
  "hours": "string",
  "openTime": "HH:MM",
  "closeTime": "HH:MM",
  "address": "string",
  "phone": "string",
  "website": "url",
  "storeCount": number,
  "featured": boolean,
  "status": "open|closed|coming_soon",
  "rating": number,
  "reviews": number,
  "features": ["string"],
  "floorPlan": "url",
  "socialLinks": {
    "instagram": "url",
    "facebook": "url",
    "tiktok": "url"
  }
}
```

### Store
```json
{
  "id": "string",
  "mallId": "string",
  "name": "string",
  "slug": "string",
  "logo": "url",
  "bannerImage": "url",
  "images": ["url"],
  "description": "string",
  "category": "string",
  "floor": "string",
  "area": "string",
  "openedDate": "string",
  "workingHours": "string",
  "phone": "string",
  "email": "string",
  "website": "url",
  "rating": number,
  "reviews": number,
  "socialLinks": {},
  "tags": ["string"]
}
```

### Product
```json
{
  "id": "string",
  "storeId": "string",
  "mallId": "string",
  "name": "string",
  "slug": "string",
  "images": ["url"],
  "description": "string",
  "price": number,
  "originalPrice": number,
  "discount": number,
  "currency": "UZS",
  "category": "string",
  "brand": "string",
  "sku": "string",
  "stock": number,
  "rating": number,
  "reviews": number,
  "features": ["string"],
  "specifications": {},
  "tags": ["string"],
  "isActive": boolean
}
```

### Event
```json
{
  "id": "string",
  "mallId": "string",
  "title": "string",
  "slug": "string",
  "description": "string",
  "image": "url",
  "category": "string",
  "startDate": "ISO-8601",
  "endDate": "ISO-8601",
  "location": "string",
  "price": number,
  "capacity": number,
  "booked": number,
  "featured": boolean
}
```

---

## API Endpoints

### Malls
- `GET /api/malls` - List all malls
- `GET /api/malls/:id` - Get mall details
- `POST /api/malls` - Create mall (admin)
- `PUT /api/malls/:id` - Update mall (admin)
- `DELETE /api/malls/:id` - Delete mall (admin)

### Stores
- `GET /api/malls/:mallId/stores` - List stores in mall
- `GET /api/stores/:id` - Get store details
- `POST /api/stores` - Create store (admin)
- `PUT /api/stores/:id` - Update store (admin)
- `DELETE /api/stores/:id` - Delete store (admin)

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `GET /api/stores/:storeId/products` - Products by store
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Events
- `GET /api/events` - List events
- `GET /api/events/:id` - Get event details
- `GET /api/malls/:mallId/events` - Events by mall
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Promotions
- `GET /api/promotions` - List active promotions
- `GET /api/promotions/:id` - Get promotion
- `POST /api/promotions` - Create promotion (admin)

### User
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/wishlist` - Get wishlist
- `POST /api/user/wishlist` - Add to wishlist
- `DELETE /api/user/wishlist/:id` - Remove from wishlist

---

## Security

### Authentication
- JWT tokens (24h expiration)
- Refresh token rotation
- Password hashing (bcrypt)
- Secure HTTP-only cookies

### Authorization
- Role-based access (admin, user, seller)
- Route guards
- API endpoint protection

### Data Validation
- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens

---

## Deployment

### Environment Variables
```
NODE_ENV=production
VITE_API_URL=https://api.mtc.uz
VITE_GOOGLE_MAPS_KEY=your_key
JWT_SECRET=your_secret
DB_CONNECTION_STRING=your_db
```

### Hosting
- **Frontend**: Vercel / Netlify
- **Backend**: Railway / Render / AWS
- **Database**: Supabase / MongoDB Atlas
- **CDN**: Cloudinary (images)
- **Maps**: Google Maps API

---

## Analytics & Monitoring

### Metrics
- Page views
- Unique visitors
- Session duration
- Bounce rate
- Conversion rate
- Funnel analysis

### Tools
- Google Analytics 4
- Hotjar (heatmaps)
- Sentry (error tracking)
- LogRocket (session replay)

---

## Success Metrics

### KPIs
- 30-second load time
- 90+ Lighthouse score
- 4+ star average rating
- 70% mobile traffic
- 25% conversion rate
- < 1% bounce rate

### Goals
- Launch within 3 months
- 100+ malls on platform
- 1000+ shops
- 50,000+ products
- 10,000+ daily active users

---

## Future Roadmap

### Phase 1 (MVP)
- Core mall/shop/product browsing
- Search & filters
- Admin panel
- Mobile-responsive design

### Phase 2
- User accounts & wishlist
- Reviews & ratings
- Events & bookings
- Advanced animations

### Phase 3
- Loyalty program
- E-commerce checkout
- Push notifications
- PWA offline mode

### Phase 4
- Virtual mall (3D)
- AI recommendations
- Augmented reality
- Voice search

---

## Conclusion

The Mega Travel Center platform combines premium aesthetics with powerful functionality. By focusing on user experience, performance, and scalability, MTC will deliver a digital mall experience that rivals and exceeds physical shopping.

The architecture is designed for flexibility, allowing for rapid iteration and feature expansion while maintaining a consistent, cohesive user experience across all touchpoints.
