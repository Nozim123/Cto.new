const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory database (in production use MongoDB/PostgreSQL)
let database = {
  users: [
    {
      id: '1',
      email: 'admin@samarkand.com',
      password: '$2a$10$4U9tVBbXk.IpBd.dWn4IJuvqdI5zRaBn1stRDYqojwGJgz.j4G0NG', // 'admin123'
      name: 'Admin',
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  ],
  malls: [
    {
      id: '1',
      name: 'Family Park Mall',
      description_short: 'Zamonaviy savdo markazi',
      description_full: 'Family Park - bu zamonaviy savdo markazi bo\'lib, unda barcha turdagi do\'konlar joylashgan.',
      address: 'Mirzo Ulugbek Street 1, Samarkand 140100, Uzbekistan',
      work_time: '10:00 AM - 10:00 PM',
      opened_date: '2018-01-15',
      location: { lat: 39.6542, lng: 66.9597 },
      banner: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800',
      gallery: [
        'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400',
        'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400'
      ],
      phone: '+998 (66) 233-30-30',
      social: {
        instagram: 'https://instagram.com/familypark',
        telegram: 'https://t.me/familypark',
        website: 'https://familyparkmal.uz'
      },
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Silk Road Mall',
      description_short: 'Shaharlararo savdo markazi',
      description_full: 'Silk Road Mall - bu tarixiy savdo yo\'llari nomi bilan atalgan zamonaviy savdo markazi.',
      address: 'Registan Street 45, Samarkand 140100, Uzbekistan',
      work_time: '10:00 AM - 11:00 PM',
      opened_date: '2022-06-01',
      location: { lat: 39.6434, lng: 66.9689 },
      banner: 'https://images.unsplash.com/photo-1555636222-cae846585b47?w=800',
      gallery: [
        'https://images.unsplash.com/photo-1555636222-cae846585b47?w=400',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
      ],
      phone: '+998 (66) 277-80-80',
      social: {
        instagram: 'https://instagram.com/silkroadmall',
        website: 'https://silkroadmall.uz'
      },
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Registan Tower Mall',
      description_short: 'Tarixiy joydagi savdo markazi',
      description_full: 'Registan Tower Mall - tarixiy Registan maydoni yonida joylashgan savdo markazi.',
      address: 'Registan Street 2, Samarkand 140100, Uzbekistan',
      work_time: '9:00 AM - 10:00 PM',
      opened_date: '2021-03-15',
      location: { lat: 39.6542, lng: 66.9747 },
      banner: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      gallery: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400'
      ],
      phone: '+998 (66) 288-90-90',
      social: {
        instagram: 'https://instagram.com/registantower',
        telegram: 'https://t.me/registantower'
      },
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Makon Mall',
      description_short: 'Kelajak texnologiyalari savdo markazi',
      description_full: 'Makon Mall - zamonaviy texnologiyalar va ekologik dizayn bilan qurilgan savdo markazi.',
      address: 'Amir Temur Street 15, Samarkand 140100, Uzbekistan',
      work_time: '10:00 AM - 10:00 PM',
      opened_date: '2024-01-01',
      location: { lat: 39.6598, lng: 66.9856 },
      banner: 'https://images.unsplash.com/photo-1555636222-cae846585b47?w=800',
      gallery: [
        'https://images.unsplash.com/photo-1555636222-cae846585b47?w=400',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
      ],
      phone: '+998 (66) 299-10-10',
      social: {
        instagram: 'https://instagram.com/makonmall',
        website: 'https://makonmall.uz'
      },
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Festival Mall',
      description_short: 'O\'yin-kulgi va savdo markazi',
      description_full: 'Festival Mall - o\'yin-kulgi, konsertlar va savdoni birlashtirgan yirik majmua.',
      address: 'Shohruh Mirzo Street 28, Samarkand 140100, Uzbekistan',
      work_time: '10:00 AM - 12:00 AM',
      opened_date: '2024-06-01',
      location: { lat: 39.6523, lng: 66.9767 },
      banner: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800',
      gallery: [
        'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=400',
        'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400'
      ],
      phone: '+998 (66) 300-20-20',
      social: {
        instagram: 'https://instagram.com/festivalmall',
        telegram: 'https://t.me/festivalmall',
        website: 'https://festivalmall.uz'
      },
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  stores: [
    // Family Park Mall stores
    {
      id: '1',
      mall_id: '1',
      name: 'Nike Store',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
      banner: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      category: 'Sport',
      description_short: 'Nike rasmiy dileri',
      description_full: 'Nike rasmiy do\'koni bo\'lib, barcha turdagi sport kiyim va ayaq kiyimlari sotiladi.',
      work_time: '09:00 - 21:00',
      opened_date: '2023-02-01',
      phone: '+998 94 123 45 68',
      social: {
        instagram: 'https://instagram.com/nikesamarkand',
        website: 'https://nike.com'
      },
      gallery: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      mall_id: '1',
      name: 'Zara',
      logo: 'https://images.unsplash.com/photo-1592878849121-10e2c0841183?w=200',
      banner: 'https://images.unsplash.com/photo-1592878849121-10e2c0841183?w=800',
      category: 'Fashion',
      description_short: 'Zara zamonaviy moda',
      description_full: 'Zara - bu zamonaviy moda va kiyim-kechaklar do\'koni.',
      work_time: '10:00 - 22:00',
      opened_date: '2023-03-01',
      phone: '+998 94 123 45 69',
      social: {
        instagram: 'https://instagram.com/zara',
        website: 'https://zara.com'
      },
      gallery: [
        'https://images.unsplash.com/photo-1592878849121-10e2c0841183?w=400',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      mall_id: '1',
      name: 'Adidas',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
      banner: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      category: 'Sport',
      description_short: 'Adidas sport mollari',
      description_full: 'Adidas - barcha turdagi sport kiyim va ayaq kiyimlari.',
      work_time: '09:00 - 21:00',
      opened_date: '2023-04-01',
      phone: '+998 94 123 45 70',
      social: {
        instagram: 'https://instagram.com/adidas',
        website: 'https://adidas.com'
      },
      gallery: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    // Silk Road Mall stores
    {
      id: '4',
      mall_id: '2',
      name: 'Apple Store',
      logo: 'https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=200',
      banner: 'https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=800',
      category: 'Electronics',
      description_short: 'Apple texnologiya do\'koni',
      description_full: 'Apple rasmiy dileri - iPhone, iPad, Mac va boshqa Apple mahsulotlari.',
      work_time: '10:00 - 22:00',
      opened_date: '2022-07-01',
      phone: '+998 94 123 45 71',
      social: {
        instagram: 'https://instagram.com/applesamarkand',
        website: 'https://apple.com'
      },
      gallery: [
        'https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=400',
        'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      mall_id: '2',
      name: 'Samsung',
      logo: 'https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=200',
      banner: 'https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=800',
      category: 'Electronics',
      description_short: 'Samsung elektronika',
      description_full: 'Samsung rasmiy dileri - smartfonlar, televizorlar va boshqa elektronika.',
      work_time: '10:00 - 22:00',
      opened_date: '2022-08-01',
      phone: '+998 94 123 45 72',
      social: {
        instagram: 'https://instagram.com/samsung',
        website: 'https://samsung.com'
      },
      gallery: [
        'https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=400',
        'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    // Registan Tower Mall stores
    {
      id: '6',
      mall_id: '3',
      name: 'Local Crafts',
      logo: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200',
      banner: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
      category: 'Handmade',
      description_short: 'An\'anaviy hunarmandlik',
      description_full: 'O\'zbekiston an\'anaviy hunarmandlik buyumlari va sovg\'alar.',
      work_time: '09:00 - 20:00',
      opened_date: '2021-04-01',
      phone: '+998 94 123 45 73',
      social: {
        instagram: 'https://instagram.com/localcrafts',
        telegram: 'https://t.me/localcrafts'
      },
      gallery: [
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '7',
      mall_id: '3',
      name: 'Silk Road Boutique',
      logo: 'https://images.unsplash.com/photo-1592878849121-10e2c0841183?w=200',
      banner: 'https://images.unsplash.com/photo-1592878849121-10e2c0841183?w=800',
      category: 'Fashion',
      description_short: 'Ipak yo\'li an\'anaviy kiyimlar',
      description_full: 'An\'anaviy o\'zbek kiyimlari va zamonaviy dizaynlar.',
      work_time: '10:00 - 21:00',
      opened_date: '2021-05-01',
      phone: '+998 94 123 45 74',
      social: {
        instagram: 'https://instagram.com/silkroadboutique',
        website: 'https://silkroadboutique.uz'
      },
      gallery: [
        'https://images.unsplash.com/photo-1592878849121-10e2c0841183?w=400',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    // Makon Mall stores
    {
      id: '8',
      mall_id: '4',
      name: 'Tech World',
      logo: 'https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=200',
      banner: 'https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=800',
      category: 'Electronics',
      description_short: 'Kelajak texnologiyalari',
      description_full: 'Eng so\'nggi texnologiya mahsulotlari va gadgetlar.',
      work_time: '10:00 - 22:00',
      opened_date: '2024-01-15',
      phone: '+998 94 123 45 75',
      social: {
        instagram: 'https://instagram.com/techworldsamarkand',
        website: 'https://techworld.uz'
      },
      gallery: [
        'https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=400',
        'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '9',
      mall_id: '4',
      name: 'Gaming Zone',
      logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200',
      banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      category: 'Gaming',
      description_short: 'O\'yin va Entertainment',
      description_full: 'Gaming jihozlari, konsollar va o\'yinlar.',
      work_time: '10:00 - 23:00',
      opened_date: '2024-02-01',
      phone: '+998 94 123 45 76',
      social: {
        instagram: 'https://instagram.com/gamingzonesamarkand',
        telegram: 'https://t.me/gamingzone'
      },
      gallery: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
        'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    // Festival Mall stores
    {
      id: '10',
      mall_id: '5',
      name: 'Entertainment Store',
      logo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200',
      banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      category: 'Entertainment',
      description_short: 'O\'yin-kulgi mollari',
      description_full: 'Filmlar, konsertlar va boshqa o\'yin-kulgi mahsulotlari.',
      work_time: '10:00 - 24:00',
      opened_date: '2024-06-15',
      phone: '+998 94 123 45 77',
      social: {
        instagram: 'https://instagram.com/entertainmentstore',
        website: 'https://entertainmentstore.uz'
      },
      gallery: [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=400'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '11',
      mall_id: '5',
      name: 'Food Court Central',
      logo: 'https://images.unsplash.com/photo-1514516870926-205989d3d2b3?w=200',
      banner: 'https://images.unsplash.com/photo-1514516870926-205989d3d2b3?w=800',
      category: 'Food',
      description_short: 'Oziq-ovqat va ichimliklar',
      description_full: 'Turli xil milliy va xorijiy taomlar.',
      work_time: '10:00 - 24:00',
      opened_date: '2024-06-20',
      phone: '+998 94 123 45 78',
      social: {
        instagram: 'https://instagram.com/foodcourtcentral',
        telegram: 'https://t.me/foodcourtcentral'
      },
      gallery: [
        'https://images.unsplash.com/photo-1514516870926-205989d3d2b3?w=400',
        'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=400'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  products: [
    {
      id: '1',
      store_id: '1',
      name: 'Air Jordan 1 Retro',
      description: 'Klassik Jordan tuflilar',
      category: 'Footwear',
      price: '450,000',
      gallery: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
      stock: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      store_id: '1',
      name: 'Nike Air Max 270',
      description: 'Zamonaviy sport tuflilar',
      category: 'Footwear',
      price: '320,000',
      gallery: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
      stock: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      store_id: '2',
      name: 'Zara Women Dress',
      description: 'Zamonaviy ayollar ko\'ylagi',
      category: 'Clothing',
      price: '180,000',
      gallery: ['https://images.unsplash.com/photo-1592878849121-10e2c0841183?w=400'],
      stock: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      store_id: '2',
      name: 'Zara Men Jacket',
      description: 'Erkaklar pidjagi',
      category: 'Clothing',
      price: '280,000',
      gallery: ['https://images.unsplash.com/photo-1592878849121-10e2c0841183?w=400'],
      stock: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      store_id: '3',
      name: 'Adidas Ultraboost',
      description: 'Adidas qo\'shimcha qulay tuflilar',
      category: 'Footwear',
      price: '380,000',
      gallery: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
      stock: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '6',
      store_id: '4',
      name: 'iPhone 15 Pro',
      description: 'Apple iPhone 15 Pro',
      category: 'Smartphone',
      price: '2,500,000',
      gallery: ['https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=400'],
      stock: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '7',
      store_id: '4',
      name: 'MacBook Air M2',
      description: 'Apple MacBook Air M2',
      category: 'Laptop',
      price: '4,200,000',
      gallery: ['https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=400'],
      stock: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '8',
      store_id: '5',
      name: 'Samsung Galaxy S24',
      description: 'Samsung Galaxy S24 Ultra',
      category: 'Smartphone',
      price: '2,200,000',
      gallery: ['https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=400'],
      stock: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '9',
      store_id: '8',
      name: 'Gaming Laptop',
      description: 'O\'yin uchun yuqori unumli noutbuk',
      category: 'Electronics',
      price: '5,800,000',
      gallery: ['https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=400'],
      stock: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '10',
      store_id: '8',
      name: 'Smart Watch',
      description: 'Aqlli soat',
      category: 'Electronics',
      price: '800,000',
      gallery: ['https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=400'],
      stock: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  banners: [
    {
      id: '1',
      title: 'Xush kelibsiz!',
      description: 'Family Park ga xush kelibsiz',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      link: '/malls/1',
      position: 'top',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  stories: [
    {
      id: '1',
      mall_id: '1',
      title: 'Nike Store',
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
      media: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      type: 'image',
      content: {
        title: 'New Collection',
        description: 'Check out our latest arrivals!',
        discount: '30% OFF',
        cta: 'Shop Now'
      },
      isPromoted: true,
      hasNew: true,
      viewed: false,
      timestamp: '2h ago',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      mall_id: '2',
      title: 'Apple Store',
      thumbnail: 'https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=200',
      media: 'https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=800',
      type: 'image',
      content: {
        title: 'iPhone 15 Series',
        description: 'The latest iPhone is here!',
        discount: '15% OFF',
        cta: 'Learn More'
      },
      isPromoted: true,
      hasNew: true,
      viewed: false,
      timestamp: '4h ago',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      mall_id: '3',
      title: 'Local Crafts',
      thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200',
      media: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
      type: 'image',
      content: {
        title: 'Handmade Treasures',
        description: 'Unique local crafts and souvenirs',
        discount: '20% OFF',
        cta: 'Explore'
      },
      isPromoted: false,
      hasNew: false,
      viewed: false,
      timestamp: '6h ago',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      mall_id: '4',
      title: 'Tech World',
      thumbnail: 'https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=200',
      media: 'https://images.unsplash.com/photo-1611498549006-f79e35f62a8e?w=800',
      type: 'image',
      content: {
        title: 'Future Tech',
        description: 'Latest gadgets and innovations',
        discount: '25% OFF',
        cta: 'Discover'
      },
      isPromoted: true,
      hasNew: true,
      viewed: false,
      timestamp: '8h ago',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      mall_id: '5',
      title: 'Festival Mall',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200',
      media: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      type: 'image',
      content: {
        title: 'Entertainment Hub',
        description: 'Movies, games and more!',
        discount: 'Family Special',
        cta: 'Visit Now'
      },
      isPromoted: false,
      hasNew: true,
      viewed: false,
      timestamp: '10h ago',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  events: [
    {
      id: '1',
      mall_id: '5',
      type: 'concert',
      title: 'New Year Live Concert',
      description: 'Celebrate with live music, lights and a festive atmosphere.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
      location: 'Main Stage (2F)',
      startDateTime: '2025-12-31T19:00:00.000Z',
      endDateTime: '2025-12-31T22:00:00.000Z',
      price: 50000,
      currency: 'UZS',
      isBookable: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      mall_id: '1',
      type: 'movie',
      title: 'Cinema: Dune Part Two',
      description: 'Experience the epic continuation on the big screen.',
      image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1200',
      location: 'Cinema Hall 3',
      startDateTime: '2026-01-05T17:00:00.000Z',
      endDateTime: '2026-01-05T19:40:00.000Z',
      price: 60000,
      currency: 'UZS',
      isBookable: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      mall_id: '4',
      type: 'attraction',
      title: 'VR Adventure Zone',
      description: 'Immersive VR experiences for friends and families.',
      image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=1200',
      location: 'Entertainment Area',
      startDateTime: '2026-01-03T10:00:00.000Z',
      endDateTime: '2026-01-03T22:00:00.000Z',
      price: 40000,
      currency: 'UZS',
      isBookable: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      mall_id: '2',
      type: 'playground',
      title: 'Kids Playground',
      description: 'Safe and fun play zone for kids.',
      image: 'https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=1200',
      location: 'Family Zone (1F)',
      startDateTime: '2026-01-02T09:00:00.000Z',
      endDateTime: '2026-01-02T21:00:00.000Z',
      price: 0,
      currency: 'UZS',
      isBookable: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  bookings: [],
  settings: {
    theme: 'light',
    primaryColor: '#D4AF37',
    darkColor: 'rgba(37, 40, 54, 1)',
    lightTextColor: '#ffffff',
    companyName: 'Samarkand Mall Explorer',
    aboutText: 'Bu yerda umumiy ma\'lumot bo\'ladi...',
    contactEmail: 'info@samarkand.com',
    contactPhone: '+998 94 123 45 67',
    address: 'Samarkand shahri'
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Utility functions
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
const saveDatabase = async () => {
  try {
    await fs.writeFile('database.json', JSON.stringify(database, null, 2));
  } catch (error) {
    console.error('Database save error:', error);
  }
};

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = database.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = database.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

// ==================== MALL ROUTES ====================
app.get('/api/malls', authenticateToken, (req, res) => {
  res.json(database.malls);
});

app.get('/api/malls/:id', authenticateToken, (req, res) => {
  const mall = database.malls.find(m => m.id === req.params.id);
  if (!mall) {
    return res.status(404).json({ message: 'Mall not found' });
  }
  res.json(mall);
});

app.post('/api/malls', authenticateToken, async (req, res) => {
  try {
    const mall = {
      id: generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    database.malls.push(mall);
    await saveDatabase();
    res.status(201).json(mall);
  } catch (error) {
    res.status(500).json({ message: 'Error creating mall', error: error.message });
  }
});

app.put('/api/malls/:id', authenticateToken, async (req, res) => {
  try {
    const mallIndex = database.malls.findIndex(m => m.id === req.params.id);
    if (mallIndex === -1) {
      return res.status(404).json({ message: 'Mall not found' });
    }

    database.malls[mallIndex] = {
      ...database.malls[mallIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await saveDatabase();
    res.json(database.malls[mallIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating mall', error: error.message });
  }
});

app.delete('/api/malls/:id', authenticateToken, async (req, res) => {
  try {
    const mallIndex = database.malls.findIndex(m => m.id === req.params.id);
    if (mallIndex === -1) {
      return res.status(404).json({ message: 'Mall not found' });
    }

    database.malls.splice(mallIndex, 1);
    // Also delete related entities
    database.stores = database.stores.filter(s => s.mall_id !== req.params.id);
    database.products = database.products.filter(p => {
      const store = database.stores.find(s => s.id === p.store_id);
      return !!store;
    });
    if (database.stories) {
      database.stories = database.stories.filter(s => s.mall_id !== req.params.id);
    }
    if (database.events) {
      database.events = database.events.filter(e => e.mall_id !== req.params.id);
    }
    if (database.bookings) {
      database.bookings = database.bookings.filter(b => b.mall_id !== req.params.id);
    }
    
    await saveDatabase();
    res.json({ message: 'Mall deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting mall', error: error.message });
  }
});

// ==================== STORE ROUTES ====================
app.get('/api/stores', authenticateToken, (req, res) => {
  const { mall_id } = req.query;
  let stores = database.stores;
  
  if (mall_id) {
    stores = stores.filter(s => s.mall_id === mall_id);
  }
  
  res.json(stores);
});

app.get('/api/stores/:id', authenticateToken, (req, res) => {
  const store = database.stores.find(s => s.id === req.params.id);
  if (!store) {
    return res.status(404).json({ message: 'Store not found' });
  }
  res.json(store);
});

app.post('/api/stores', authenticateToken, async (req, res) => {
  try {
    const store = {
      id: generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    database.stores.push(store);
    await saveDatabase();
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Error creating store', error: error.message });
  }
});

app.put('/api/stores/:id', authenticateToken, async (req, res) => {
  try {
    const storeIndex = database.stores.findIndex(s => s.id === req.params.id);
    if (storeIndex === -1) {
      return res.status(404).json({ message: 'Store not found' });
    }

    database.stores[storeIndex] = {
      ...database.stores[storeIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await saveDatabase();
    res.json(database.stores[storeIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating store', error: error.message });
  }
});

app.delete('/api/stores/:id', authenticateToken, async (req, res) => {
  try {
    const storeIndex = database.stores.findIndex(s => s.id === req.params.id);
    if (storeIndex === -1) {
      return res.status(404).json({ message: 'Store not found' });
    }

    database.stores.splice(storeIndex, 1);
    // Also delete related products
    database.products = database.products.filter(p => p.store_id !== req.params.id);
    
    await saveDatabase();
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting store', error: error.message });
  }
});

// ==================== PRODUCT ROUTES ====================
app.get('/api/products', authenticateToken, (req, res) => {
  const { store_id } = req.query;
  let products = database.products;
  
  if (store_id) {
    products = products.filter(p => p.store_id === store_id);
  }
  
  res.json(products);
});

app.get('/api/products/:id', authenticateToken, (req, res) => {
  const product = database.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const product = {
      id: generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    database.products.push(product);
    await saveDatabase();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const productIndex = database.products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    database.products[productIndex] = {
      ...database.products[productIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await saveDatabase();
    res.json(database.products[productIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const productIndex = database.products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    database.products.splice(productIndex, 1);
    await saveDatabase();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// ==================== BANNER ROUTES ====================
app.get('/api/banners', authenticateToken, (req, res) => {
  res.json(database.banners);
});

app.post('/api/banners', authenticateToken, async (req, res) => {
  try {
    const banner = {
      id: generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    database.banners.push(banner);
    await saveDatabase();
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Error creating banner', error: error.message });
  }
});

app.put('/api/banners/:id', authenticateToken, async (req, res) => {
  try {
    const bannerIndex = database.banners.findIndex(b => b.id === req.params.id);
    if (bannerIndex === -1) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    database.banners[bannerIndex] = {
      ...database.banners[bannerIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await saveDatabase();
    res.json(database.banners[bannerIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating banner', error: error.message });
  }
});

app.delete('/api/banners/:id', authenticateToken, async (req, res) => {
  try {
    const bannerIndex = database.banners.findIndex(b => b.id === req.params.id);
    if (bannerIndex === -1) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    database.banners.splice(bannerIndex, 1);
    await saveDatabase();
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting banner', error: error.message });
  }
});

// ==================== SETTINGS ROUTES ====================
app.get('/api/settings', authenticateToken, (req, res) => {
  res.json(database.settings);
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    database.settings = {
      ...database.settings,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await saveDatabase();
    res.json(database.settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

// ==================== STORIES ROUTES ====================
app.get('/api/stories', (req, res) => {
  const { mall_id } = req.query;
  let stories = database.stories || [];
  
  if (mall_id) {
    stories = stories.filter(s => s.mall_id === mall_id && s.isActive);
  }
  
  res.json(stories);
});

app.get('/api/stories/:id', authenticateToken, (req, res) => {
  const story = database.stories.find(s => s.id === req.params.id);
  if (!story) {
    return res.status(404).json({ message: 'Story not found' });
  }
  res.json(story);
});

app.post('/api/stories', authenticateToken, async (req, res) => {
  try {
    const story = {
      id: generateId(),
      ...req.body,
      viewed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (!database.stories) {
      database.stories = [];
    }
    
    database.stories.push(story);
    await saveDatabase();
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: 'Error creating story', error: error.message });
  }
});

app.put('/api/stories/:id', authenticateToken, async (req, res) => {
  try {
    const storyIndex = database.stories.findIndex(s => s.id === req.params.id);
    if (storyIndex === -1) {
      return res.status(404).json({ message: 'Story not found' });
    }

    database.stories[storyIndex] = {
      ...database.stories[storyIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await saveDatabase();
    res.json(database.stories[storyIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating story', error: error.message });
  }
});

app.delete('/api/stories/:id', authenticateToken, async (req, res) => {
  try {
    const storyIndex = database.stories.findIndex(s => s.id === req.params.id);
    if (storyIndex === -1) {
      return res.status(404).json({ message: 'Story not found' });
    }

    database.stories.splice(storyIndex, 1);
    await saveDatabase();
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting story', error: error.message });
  }
});

// ==================== EVENTS ROUTES ====================
app.get('/api/events', (req, res) => {
  const { mall_id, type } = req.query;
  let events = database.events || [];

  if (mall_id) {
    events = events.filter(e => e.mall_id === mall_id && e.isActive);
  }

  if (type) {
    events = events.filter(e => e.type === type);
  }

  res.json(events);
});

app.get('/api/events/:id', (req, res) => {
  const event = (database.events || []).find(e => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(event);
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { mall_id, title } = req.body;
    if (!mall_id || !title) {
      return res.status(400).json({ message: 'mall_id and title are required' });
    }

    const event = {
      id: generateId(),
      ...req.body,
      isActive: req.body.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!database.events) {
      database.events = [];
    }

    database.events.push(event);
    await saveDatabase();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const eventIndex = (database.events || []).findIndex(e => e.id === req.params.id);
    if (eventIndex === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    database.events[eventIndex] = {
      ...database.events[eventIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveDatabase();
    res.json(database.events[eventIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const eventIndex = (database.events || []).findIndex(e => e.id === req.params.id);
    if (eventIndex === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const [removed] = database.events.splice(eventIndex, 1);

    if (database.bookings) {
      database.bookings = database.bookings.filter(b => b.event_id !== removed.id);
    }

    await saveDatabase();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});

// ==================== BOOKINGS ROUTES ====================
app.get('/api/bookings', authenticateToken, (req, res) => {
  const { mall_id, event_id, status } = req.query;
  let bookings = database.bookings || [];

  if (mall_id) {
    bookings = bookings.filter(b => b.mall_id === mall_id);
  }

  if (event_id) {
    bookings = bookings.filter(b => b.event_id === event_id);
  }

  if (status) {
    bookings = bookings.filter(b => b.status === status);
  }

  res.json(bookings);
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { event_id, mall_id, name, phone, email, quantity } = req.body;

    if (!event_id || !name || !phone) {
      return res.status(400).json({ message: 'event_id, name and phone are required' });
    }

    const event = (database.events || []).find(e => e.id === event_id);
    if (!event || event.isActive === false) {
      return res.status(400).json({ message: 'Event is not available' });
    }

    const booking = {
      id: generateId(),
      event_id,
      mall_id: mall_id || event.mall_id,
      name,
      phone,
      email: email || null,
      quantity: Math.max(1, Number(quantity || 1)),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!database.bookings) {
      database.bookings = [];
    }

    database.bookings.push(booking);
    await saveDatabase();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

app.put('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const bookingIndex = (database.bookings || []).findIndex(b => b.id === req.params.id);
    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    database.bookings[bookingIndex] = {
      ...database.bookings[bookingIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveDatabase();
    res.json(database.bookings[bookingIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});

app.get('/api/banners/:id', authenticateToken, (req, res) => {
  const banner = database.banners.find(b => b.id === req.params.id);
  if (!banner) {
    return res.status(404).json({ message: 'Banner not found' });
  }
  res.json(banner);
});

// ==================== DASHBOARD STATISTICS ====================
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {
    totalMalls: database.malls.length,
    totalStores: database.stores.length,
    totalProducts: database.products.length,
    totalBanners: database.banners.length,
    activeBanners: database.banners.filter(b => b.isActive).length,
    recentActivities: [
      ...database.malls.slice(-5).map(m => ({ type: 'mall', item: m, date: m.updatedAt })),
      ...database.stores.slice(-5).map(s => ({ type: 'store', item: s, date: s.updatedAt })),
      ...database.products.slice(-5).map(p => ({ type: 'product', item: p, date: p.updatedAt })),
      ...database.banners.slice(-5).map(b => ({ type: 'banner', item: b, date: b.updatedAt }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
  };

  res.json(stats);
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ==================== ERROR HANDLING ====================
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});

module.exports = app;