# Samarkand Mall Explorer - Admin Panel

Bu loyiha Samarkand shahri uchun to'liq mall boshqaruv tizimi hisoblanadi.

## 🚀 Tez Start

### 1. Server ishga tushirish (Backend)
```bash
# 5000-portda backend server
npm run server
# yoki
node server.js
```

### 2. Frontend ishga tushirish
```bash
# 3000-portda frontend
npm run dev
```

### 3. Admin Panel ga kirish
```
http://localhost:3000/admin/login
```

**Demo Login Ma'lumotlar:**
- Email: `admin@samarkand.com`
- Parol: `admin123`

## 🏗️ Loyiha Tuzilishi

### Frontend Admin Panel (React + Vite)
```
src/admin/
├── components/
│   └── AdminLayout.jsx     # Admin panel layout
├── pages/
│   ├── LoginPage.jsx       # Login sahifasi
│   ├── DashboardPage.jsx   # Dashboard
│   ├── MallListPage.jsx    # Mall ro'yxati
│   ├── MallFormPage.jsx    # Mall qo'shish/tahrirlash
│   ├── StoreListPage.jsx   # Do'kon ro'yxati
│   ├── StoreFormPage.jsx   # Do'kon qo'shish/tahrirlash
│   ├── ProductListPage.jsx # Mahsulot ro'yxati
│   ├── ProductFormPage.jsx # Mahsulot qo'shish/tahrirlash
│   ├── BannerListPage.jsx  # Banner ro'yxati
│   ├── BannerFormPage.jsx  # Banner qo'shish/tahrirlash
│   └── SettingsPage.jsx    # Sozlamalar
├── hooks/
│   └── useAuth.js          # Authentication hook
└── services/
    └── api.js              # API servis
```

### Backend API (Node.js + Express)
```
server.js                     # Asosiy server fayl
├── Authentication (/api/auth)
├── Mall Management (/api/malls)
├── Store Management (/api/stores)
├── Product Management (/api/products)
├── Banner Management (/api/banners)
└── Settings (/api/settings)
```

## 🎯 Admin Panel Imkoniyatlari

### 🏢 Mall Boshqaruvi
- ✅ Mall qo'shish/o'chirish/tahrirlash
- ✅ Mall rasmlari (banner, galereya)
- ✅ Manzil va koordinatalar (Google Maps)
- ✅ Ish vaqti va telefon
- ✅ Ijtimoiy tarmoqlar
- ✅ Holat boshqaruvi (ochiq/tez orada/yopiq)

### 🏪 Do'kon Boshqaruvi
- ✅ Mall ichiga do'kon qo'shish
- ✅ Kategoriya boshqaruvi (Kiyim, Texnika, Sport, etc.)
- ✅ Logo va banner rasmlar
- ✅ Ish vaqti va telefon
- ✅ Ijtimoiy tarmoqlar
- ✅ Qisqacha va to'liq tavsif

### 📦 Mahsulot Boshqaruvi
- ✅ Do'kon ichiga mahsulot qo'shish
- ✅ Kategoriya va narx boshqaruvi
- ✅ Stok holati (mavjud/cheklangan/tugagan)
- ✅ Galereya rasmlar
- ✅ Batafsil tavsif

### 🖼️ Banner Boshqaruvi
- ✅ Homepage va sahifalar bannerlari
- ✅ Pozitsiya boshqaruvi (yuqori/o'rta/pastki)
- ✅ Vaqt oralig'i belgilash
- ✅ Havola URL
- ✅ Aktiv/noaktiv holat

### ⚙️ Sozlamalar
- ✅ Sayt umumiy ma'lumotlari
- ✅ Ranglar boshqaruvi
- ✅ Bog'lanish ma'lumotlari
- ✅ Ijtimoiy tarmoqlar
- ✅ SEO sozlamalari

### 📊 Dashboard
- ✅ Umumiy statistika
- ✅ So'ngi faoliyatlar
- ✅ Tezkor harakatlar
- ✅ Tizim holati

## 🛠️ Texnologiyalar

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 📱 Responsive Design
- ✅ Mobile First approach
- ✅ Tablet (768px+) support
- ✅ Desktop (1200px+) optimization
- ✅ Collapsible sidebar
- ✅ Responsive tables and grids

## 🎨 Design System

### Ranglar
- **Navy**: #2C3E50 (Asosiy rang)
- **Gold**: #D4AF37 (Accent rang)
- **Cream**: #F4EFE7 (Background)
- **Sage**: #8FA89A (Secondary)
- **Accent**: #E8B4B8 (Highlight)

### Typography
- **Headings**: Playfair Display
- **Body**: Inter
- **Alternative**: Lato

## 🔒 Xavfsizlik
- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ Protected routes
- ✅ CORS configuration
- ✅ Input validation

## 📦 Installation

1. **Dependencies o'rnatish:**
```bash
npm install
```

2. **Server ishga tushirish:**
```bash
node server.js
# yoki
npm run server
```

3. **Frontend ishga tushirish:**
```bash
npm run dev
```

## 🌐 Production Deployment

1. **Environment Variables:**
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
```

2. **Build frontend:**
```bash
npm run build
```

3. **Deploy backend va static files:**
```bash
# Nginx, Apache yoki boshqa web server
```

## 📞 Bog'lanish

- **Email**: admin@samarkand.com
- **Admin Panel**: http://localhost:3000/admin
- **Sayt**: http://localhost:3000

## 📝 Litsenziya

Bu loyiha MIT litsenziyasi ostida tarqatiladi.

---

**Samarkand Mall Explorer Admin Panel** - Full featured mall management system with modern UI and comprehensive features.