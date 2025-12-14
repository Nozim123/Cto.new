# Quick Start Guide

## 🚀 Admin Panel Test qilish

### 1. Server ishga tushirish
```bash
cd /home/engine/project
npm run server
```
**Natija:** Backend server 5000-portda ishga tushadi

### 2. Frontend ishga tushirish
```bash
# Yangi terminal ochiq qiling
npm run dev
```
**Natija:** Frontend 3000-portda ishga tushadi

### 3. Admin Panel ga kirish
```bash
http://localhost:3000/admin/login
```

**Demo Login:**
- Email: `admin@samarkand.com`
- Parol: `admin123`

## 📋 Test qilish uchun vazifalar

### 1. Mall Boshqaruvi
- "Yangi Mall" tugmasi bilan mall qo'shing
- Tavsif, manzil, rasmlar qo'shing
- "Tahrirlash" bilan o'zgartiring

### 2. Do'kon Boshqaruvi
- Yangi do'kon qo'shing
- Mall tanlang
- Kategoriya qo'shing

### 3. Mahsulot Boshqaruvi
- Do'kon ichiga mahsulot qo'shing
- Narx va stok holati

### 4. Banner Boshqaruvi
- Banner rasmi qo'shing
- Pozitsiya va vaqt belgilang

### 5. Sozlamalar
- Ranglar o'zgartiring
- Bog'lanish ma'lumotlari kiritng

## 🎨 Admin Panel Xususiyatlari

✅ **Responsive Design** - Mobil va desktop
✅ **Dark Theme** - Professional ko'rinish
✅ **Real-time Data** - Tez yangilash
✅ **Image Preview** - Rasm ko'rish
✅ **Advanced Filters** - Qidiruv va filtr
✅ **Grid/List View** - Turli ko'rinish
✅ **Toast Notifications** - Xabar tizimi
✅ **Form Validation** - Tekshirish
✅ **Loading States** - Yuklanish ko'rsatkichi

## 📁 Fayl tuzilishi

```
/home/engine/project
├── src/admin/           # Admin UI
│   ├── components/      # AdminLayout
│   ├── pages/          # Barcha admin sahifalar
│   ├── hooks/          # useAuth hook
│   └── services/       # API services
├── server.js           # Backend API
├── package.json        # Dependencies
└── README.md           # Hujjat
```

## 🛠️ Texnologiyaslar

**Frontend:** React, Tailwind CSS, React Router, Vite
**Backend:** Node.js, Express, JWT, bcryptjs
**Icons:** Lucide React
**Notifications:** React Hot Toast

## 🔧 Development

```bash
# Backend server
npm run server    # Port 5000

# Frontend development
npm run dev       # Port 3000

# Build for production
npm run build
```

## 📊 API Endpoints

```bash
# Authentication
POST /api/auth/login
GET  /api/auth/me

# Mall Management  
GET/POST/PUT/DELETE /api/malls

# Store Management
GET/POST/PUT/DELETE /api/stores

# Product Management
GET/POST/PUT/DELETE /api/products

# Banner Management
GET/POST/PUT/DELETE /api/banners

# Settings
GET/PUT /api/settings

# Dashboard
GET /api/dashboard/stats
```

## 🎯 Key Features Implemented

### 🏢 Mall Management
- Mall qo'shish/o'chirish/tahrirlash
- Banner va galereya rasmlar
- Manzil va Google Maps koordinatalari
- Ish vaqti, telefon, ijtimoiy tarmoqlar
- Holat boshqaruvi (ochiq/tez orada)

### 🏪 Store Management  
- Mall ichiga do'kon qo'shish
- 12+ kategoriyalar (Kiyim, Texnika, Sport...)
- Logo va banner rasmlar
- Ish vaqti va contact ma'lumotlari
- Qisqacha va to'liq tavsif

### 📦 Product Management
- Do'kon ichiga mahsulot qo'shish
- Kategoriya va narx boshqaruvi  
- Stok holati (mavjud/cheklangan/tugagan)
- Galereya rasmlar
- Batafsil tavsif

### 🖼️ Banner Management
- Homepage va sahifalar uchun
- Pozitsiya boshqaruvi (yuqori/o'rta/pastki)
- Vaqt oralig'i (from/to date)
- Havola URL
- Aktiv/noaktiv holat

### ⚙️ Settings Management
- Sayt umumiy ma'lumotlari
- Ranglar boshqaruvi
- Contact ma'lumotlari
- Ijtimoiy tarmoqlar
- SEO sozlamalari

### 📊 Dashboard & Analytics
- Real-time statistika
- So'ngi aktivliklar
- Tezkor harakatlar
- Tizim holati

## 🎨 UI/UX Design

### Color Palette
- **Navy**: #2C3E50 (Primary)
- **Gold**: #D4AF37 (Accent)  
- **Cream**: #F4EFE7 (Background)
- **Gray**: Professional grays

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Clean, readable fonts
- **UI Elements**: Consistent spacing

### Components
- Professional cards with shadows
- Responsive tables with hover effects
- Smooth animations and transitions
- Mobile-first responsive design

## 🔒 Security Features

- JWT token authentication
- Password hashing (bcrypt)
- Protected admin routes
- Input validation
- CORS configuration
- Secure API endpoints

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px+

---

**✅ To'liq ishlayotgan admin panel tayyor!**

Admin panel saytni 100% boshqarish imkonini beradi:
- Mall qo'shish/o'zgartirish/o'chirish
- Do'konlarni boshqarish  
- Mahsulot katalogi
- Banner kampaniyalari
- Site sozlamalari
- Admin statistik

**Demo:** http://localhost:3000/admin
**Login:** admin@samarkand.com / admin123