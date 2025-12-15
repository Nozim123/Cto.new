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
      name: 'Family Park',
      description_short: 'Zamonaviy savdo markazi',
      description_full: 'Family Park - bu zamonaviy savdo markazi bo\'lib, unda barcha turdagi do\'konlar joylashgan.',
      address: 'Samarkand shahri, Amir Temur ko\'chasi 123-uy',
      work_time: '08:00 - 22:00',
      opened_date: '2023-01-15',
      location: { lat: 39.6270, lng: 66.9750 },
      banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      gallery: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
        'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400'
      ],
      phone: '+998 94 123 45 67',
      social: {
        instagram: 'https://instagram.com/familypark',
        telegram: 'https://t.me/familypark',
        website: 'https://familypark.uz'
      },
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  stores: [
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

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user?.role || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
};

const authenticateAdmin = [authenticateToken, requireRole('admin')];

// Utility functions
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
const saveDatabase = async () => {
  try {
    await fs.writeFile('database.json', JSON.stringify(database, null, 2));
  } catch (error) {
    console.error('Database save error:', error);
  }
};

const loadDatabase = async () => {
  try {
    const raw = await fs.readFile('database.json', 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      database = {
        ...database,
        ...parsed,
        users: Array.isArray(parsed.users) ? parsed.users : database.users,
        malls: Array.isArray(parsed.malls) ? parsed.malls : database.malls,
        stores: Array.isArray(parsed.stores) ? parsed.stores : database.stores,
        products: Array.isArray(parsed.products) ? parsed.products : database.products,
        banners: Array.isArray(parsed.banners) ? parsed.banners : database.banners,
        settings: parsed.settings && typeof parsed.settings === 'object' ? parsed.settings : database.settings
      };
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Database load error:', error);
    }
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

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
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

app.get('/api/auth/me', ...authenticateAdmin, (req, res) => {
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

// ==================== PUBLIC USER AUTH ROUTES ====================
app.post('/api/public/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = database.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: generateId(),
      email: normalizedEmail,
      password: hashedPassword,
      name: String(name).trim(),
      role: 'user',
      createdAt: new Date().toISOString()
    };

    database.users.push(newUser);
    await saveDatabase();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/public/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = String(email || '').trim().toLowerCase();
    const user = database.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== 'user') {
      return res.status(403).json({ message: 'User access only' });
    }

    const isValidPassword = await bcrypt.compare(password || '', user.password);
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

app.get('/api/public/auth/me', authenticateToken, (req, res) => {
  const user = database.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.role !== 'user') {
    return res.status(403).json({ message: 'User access only' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

// ==================== MALL ROUTES ====================
app.get('/api/malls', ...authenticateAdmin, (req, res) => {
  res.json(database.malls);
});

app.get('/api/malls/:id', ...authenticateAdmin, (req, res) => {
  const mall = database.malls.find(m => m.id === req.params.id);
  if (!mall) {
    return res.status(404).json({ message: 'Mall not found' });
  }
  res.json(mall);
});

app.post('/api/malls', ...authenticateAdmin, async (req, res) => {
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

app.put('/api/malls/:id', ...authenticateAdmin, async (req, res) => {
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

app.delete('/api/malls/:id', ...authenticateAdmin, async (req, res) => {
  try {
    const mallIndex = database.malls.findIndex(m => m.id === req.params.id);
    if (mallIndex === -1) {
      return res.status(404).json({ message: 'Mall not found' });
    }

    database.malls.splice(mallIndex, 1);
    // Also delete related stores
    database.stores = database.stores.filter(s => s.mall_id !== req.params.id);
    
    await saveDatabase();
    res.json({ message: 'Mall deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting mall', error: error.message });
  }
});

// ==================== STORE ROUTES ====================
app.get('/api/stores', ...authenticateAdmin, (req, res) => {
  const { mall_id } = req.query;
  let stores = database.stores;
  
  if (mall_id) {
    stores = stores.filter(s => s.mall_id === mall_id);
  }
  
  res.json(stores);
});

app.get('/api/stores/:id', ...authenticateAdmin, (req, res) => {
  const store = database.stores.find(s => s.id === req.params.id);
  if (!store) {
    return res.status(404).json({ message: 'Store not found' });
  }
  res.json(store);
});

app.post('/api/stores', ...authenticateAdmin, async (req, res) => {
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

app.put('/api/stores/:id', ...authenticateAdmin, async (req, res) => {
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

app.delete('/api/stores/:id', ...authenticateAdmin, async (req, res) => {
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
app.get('/api/products', ...authenticateAdmin, (req, res) => {
  const { store_id } = req.query;
  let products = database.products;
  
  if (store_id) {
    products = products.filter(p => p.store_id === store_id);
  }
  
  res.json(products);
});

app.get('/api/products/:id', ...authenticateAdmin, (req, res) => {
  const product = database.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', ...authenticateAdmin, async (req, res) => {
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

app.put('/api/products/:id', ...authenticateAdmin, async (req, res) => {
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

app.delete('/api/products/:id', ...authenticateAdmin, async (req, res) => {
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
app.get('/api/banners', ...authenticateAdmin, (req, res) => {
  res.json(database.banners);
});

app.post('/api/banners', ...authenticateAdmin, async (req, res) => {
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

app.put('/api/banners/:id', ...authenticateAdmin, async (req, res) => {
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

app.delete('/api/banners/:id', ...authenticateAdmin, async (req, res) => {
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
app.get('/api/settings', ...authenticateAdmin, (req, res) => {
  res.json(database.settings);
});

app.put('/api/settings', ...authenticateAdmin, async (req, res) => {
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

app.get('/api/banners/:id', ...authenticateAdmin, (req, res) => {
  const banner = database.banners.find(b => b.id === req.params.id);
  if (!banner) {
    return res.status(404).json({ message: 'Banner not found' });
  }
  res.json(banner);
});

// ==================== DASHBOARD STATISTICS ====================
app.get('/api/dashboard/stats', ...authenticateAdmin, (req, res) => {
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
const startServer = async () => {
  await loadDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
  });
};

startServer();

module.exports = app;