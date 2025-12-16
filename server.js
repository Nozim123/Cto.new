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

// ==================== REALTIME (SSE) ====================
const sseClients = new Set();

const writeSseEvent = (res, event, data) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data ?? {})}\n\n`);
};

const broadcastSseEvent = (event, data) => {
  for (const res of sseClients) {
    try {
      writeSseEvent(res, event, data);
    } catch {
      // Ignore broken connections; cleanup happens on close
    }
  }
};

// ==================== DATABASE ====================
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const toIsoDate = (value) => {
  if (!value) return '';
  const str = String(value).trim();
  if (/^\d{4}$/.test(str)) return `${str}-01-01`;
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return str;
  return d.toISOString().slice(0, 10);
};

const seedDatabase = () => {
  let seedMalls = [];
  let seedStores = [];
  let seedProducts = [];

  try {
    // Keep initial seed aligned with the frontend demo JSON so public pages work out of the box.
    // These are only used when database.json is not present.
    // eslint-disable-next-line global-require
    seedMalls = require('./src/data/malls.json');
    // eslint-disable-next-line global-require
    seedStores = require('./src/data/stores.json');
    // eslint-disable-next-line global-require
    seedProducts = require('./src/data/products.json');
  } catch {
    // ignore
  }

  const now = new Date().toISOString();

  const malls = (seedMalls || []).map((m) => ({
    id: m.id || generateId(),
    name: m.name || 'Mall',
    description_short: m.description || '',
    description_full: m.description || '',
    address: m.address || m.location || '',
    work_time: m.hours || '',
    opened_date: toIsoDate(m.openedDate),
    location: Array.isArray(m.coordinates)
      ? { lat: Number(m.coordinates[0]) || 0, lng: Number(m.coordinates[1]) || 0 }
      : { lat: 0, lng: 0 },
    banner: m.bannerImage || m.image || '',
    gallery: [m.bannerImage, m.image].filter(Boolean),
    phone: m.phone || '',
    categories:
      m.id === 'family-park'
        ? ['fashion', 'electronics', 'food', 'entertainment']
        : [],
    featured: Boolean(m.featured),
    social: {
      instagram: '',
      telegram: '',
      website: m.website || ''
    },
    status: m.status || 'open',
    createdAt: now,
    updatedAt: now
  }));

  const stores = (seedStores || []).map((s) => ({
    id: s.id || generateId(),
    mall_id: s.mallId || '',
    name: s.name || 'Store',
    logo: s.logo || '',
    banner: s.heroImage || s.image || '',
    category: s.category || '',
    description_short: s.description || '',
    description_full: s.about || '',
    work_time: s.hours || '',
    opened_date: '',
    floor: s.floor ?? null,
    phone: s.phone || '',
    email: s.email || '',
    social: {
      instagram: '',
      website: ''
    },
    gallery: [s.image, s.interiorImage].filter(Boolean),
    status: s.status || 'open',
    hasPromo: Boolean(s.hasPromo),
    promoTitle: s.promoTitle || '',
    promoDescription: s.promoDescription || '',
    promoDiscount: s.promoDiscount || '',
    createdAt: now,
    updatedAt: now
  }));

  const products = (seedProducts || []).map((p) => ({
    id: p.id || generateId(),
    store_id: p.storeId || '',
    name: p.name || 'Product',
    description: p.description || '',
    category: p.category || '',
    price: p.price !== undefined && p.price !== null ? String(p.price) : '',
    gallery: p.image ? [p.image] : [],
    stock: 'available',
    tag: p.tag || '',
    specifications: '',
    createdAt: now,
    updatedAt: now
  }));

  return {
    users: [
      {
        id: '1',
        email: 'admin@samarkand.com',
        password: '$2a$10$4U9tVBbXk.IpBd.dWn4IJuvqdI5zRaBn1stRDYqojwGJgz.j4G0NG', // 'admin123'
        name: 'Admin',
        role: 'admin',
        createdAt: now
      }
    ],
    malls,
    stores,
    products,
    banners: [
      {
        id: 'welcome-banner',
        title: 'Xush kelibsiz!',
        description: 'Family Park Mall ga xush kelibsiz',
        image: malls.find((m) => m.id === 'family-park')?.banner || '',
        link: '/mall/family-park',
        position: 'top',
        isActive: true,
        startDate: '2024-01-01',
        endDate: '2026-12-31',
        createdAt: now,
        updatedAt: now
      }
    ],
    settings: {
      theme: 'light',
      primaryColor: '#D4AF37',
      darkColor: 'rgba(37, 40, 54, 1)',
      lightTextColor: '#ffffff',
      companyName: 'Mega Travel Center (MTC)',
      aboutText: 'Premium Digital Experience',
      contactEmail: 'info@megatravelcenter.com',
      contactPhone: '+998 99 689 24 80',
      address: 'Samarkand shahri'
    }
  };
};

let database = seedDatabase();

const loadDatabase = async () => {
  try {
    const raw = await fs.readFile('database.json', 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      database = {
        ...database,
        ...parsed
      };
    }
  } catch {
    // database.json not found or invalid; use seed
  }
};

const saveDatabase = async (meta) => {
  try {
    await fs.writeFile('database.json', JSON.stringify(database, null, 2));
    broadcastSseEvent('update', {
      ...meta,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database save error:', error);
  }
};

// ==================== AUTH ====================
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

// ==================== REALTIME PUBLIC STREAM ====================
app.get('/api/public/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.flushHeaders?.();

  sseClients.add(res);
  writeSseEvent(res, 'connected', { timestamp: new Date().toISOString() });

  const keepAlive = setInterval(() => {
    writeSseEvent(res, 'ping', { timestamp: new Date().toISOString() });
  }, 20000);

  req.on('close', () => {
    clearInterval(keepAlive);
    sseClients.delete(res);
    res.end();
  });
});

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = database.users.find((u) => u.email === email);
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
  const user = database.users.find((u) => u.id === req.user.id);
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

// ==================== PUBLIC READ-ONLY ROUTES ====================
app.get('/api/public/snapshot', (req, res) => {
  res.json({
    malls: database.malls,
    stores: database.stores,
    products: database.products,
    banners: database.banners,
    settings: database.settings
  });
});

app.get('/api/public/malls', (req, res) => {
  res.json(database.malls);
});

app.get('/api/public/malls/:id', (req, res) => {
  const mall = database.malls.find((m) => m.id === req.params.id);
  if (!mall) return res.status(404).json({ message: 'Mall not found' });
  res.json(mall);
});

app.get('/api/public/stores', (req, res) => {
  const { mall_id } = req.query;
  let stores = database.stores;
  if (mall_id) stores = stores.filter((s) => s.mall_id === mall_id);
  res.json(stores);
});

app.get('/api/public/stores/:id', (req, res) => {
  const store = database.stores.find((s) => s.id === req.params.id);
  if (!store) return res.status(404).json({ message: 'Store not found' });
  res.json(store);
});

app.get('/api/public/products', (req, res) => {
  const { store_id } = req.query;
  let products = database.products;
  if (store_id) products = products.filter((p) => p.store_id === store_id);
  res.json(products);
});

app.get('/api/public/products/:id', (req, res) => {
  const product = database.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.get('/api/public/banners', (req, res) => {
  res.json(database.banners.filter((b) => b.isActive));
});

app.get('/api/public/settings', (req, res) => {
  res.json(database.settings);
});

// ==================== MALL ROUTES (ADMIN) ====================
app.get('/api/malls', authenticateToken, (req, res) => {
  res.json(database.malls);
});

app.get('/api/malls/:id', authenticateToken, (req, res) => {
  const mall = database.malls.find((m) => m.id === req.params.id);
  if (!mall) {
    return res.status(404).json({ message: 'Mall not found' });
  }
  res.json(mall);
});

app.post('/api/malls', authenticateToken, async (req, res) => {
  try {
    const mall = {
      id: req.body.id || generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    database.malls.push(mall);
    await saveDatabase({ resource: 'malls', action: 'create', id: mall.id });
    res.status(201).json(mall);
  } catch (error) {
    res.status(500).json({ message: 'Error creating mall', error: error.message });
  }
});

app.put('/api/malls/:id', authenticateToken, async (req, res) => {
  try {
    const mallIndex = database.malls.findIndex((m) => m.id === req.params.id);
    if (mallIndex === -1) {
      return res.status(404).json({ message: 'Mall not found' });
    }

    database.malls[mallIndex] = {
      ...database.malls[mallIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveDatabase({ resource: 'malls', action: 'update', id: req.params.id });
    res.json(database.malls[mallIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating mall', error: error.message });
  }
});

app.delete('/api/malls/:id', authenticateToken, async (req, res) => {
  try {
    const mallIndex = database.malls.findIndex((m) => m.id === req.params.id);
    if (mallIndex === -1) {
      return res.status(404).json({ message: 'Mall not found' });
    }

    database.malls.splice(mallIndex, 1);
    database.stores = database.stores.filter((s) => s.mall_id !== req.params.id);

    await saveDatabase({ resource: 'malls', action: 'delete', id: req.params.id });
    res.json({ message: 'Mall deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting mall', error: error.message });
  }
});

// ==================== STORE ROUTES (ADMIN) ====================
app.get('/api/stores', authenticateToken, (req, res) => {
  const { mall_id } = req.query;
  let stores = database.stores;

  if (mall_id) {
    stores = stores.filter((s) => s.mall_id === mall_id);
  }

  res.json(stores);
});

app.get('/api/stores/:id', authenticateToken, (req, res) => {
  const store = database.stores.find((s) => s.id === req.params.id);
  if (!store) {
    return res.status(404).json({ message: 'Store not found' });
  }
  res.json(store);
});

app.post('/api/stores', authenticateToken, async (req, res) => {
  try {
    const store = {
      id: req.body.id || generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    database.stores.push(store);
    await saveDatabase({ resource: 'stores', action: 'create', id: store.id });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Error creating store', error: error.message });
  }
});

app.put('/api/stores/:id', authenticateToken, async (req, res) => {
  try {
    const storeIndex = database.stores.findIndex((s) => s.id === req.params.id);
    if (storeIndex === -1) {
      return res.status(404).json({ message: 'Store not found' });
    }

    database.stores[storeIndex] = {
      ...database.stores[storeIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveDatabase({ resource: 'stores', action: 'update', id: req.params.id });
    res.json(database.stores[storeIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating store', error: error.message });
  }
});

app.delete('/api/stores/:id', authenticateToken, async (req, res) => {
  try {
    const storeIndex = database.stores.findIndex((s) => s.id === req.params.id);
    if (storeIndex === -1) {
      return res.status(404).json({ message: 'Store not found' });
    }

    database.stores.splice(storeIndex, 1);
    database.products = database.products.filter((p) => p.store_id !== req.params.id);

    await saveDatabase({ resource: 'stores', action: 'delete', id: req.params.id });
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting store', error: error.message });
  }
});

// ==================== PRODUCT ROUTES (ADMIN) ====================
app.get('/api/products', authenticateToken, (req, res) => {
  const { store_id } = req.query;
  let products = database.products;

  if (store_id) {
    products = products.filter((p) => p.store_id === store_id);
  }

  res.json(products);
});

app.get('/api/products/:id', authenticateToken, (req, res) => {
  const product = database.products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const product = {
      id: req.body.id || generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    database.products.push(product);
    await saveDatabase({ resource: 'products', action: 'create', id: product.id });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const productIndex = database.products.findIndex((p) => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    database.products[productIndex] = {
      ...database.products[productIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveDatabase({ resource: 'products', action: 'update', id: req.params.id });
    res.json(database.products[productIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const productIndex = database.products.findIndex((p) => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    database.products.splice(productIndex, 1);
    await saveDatabase({ resource: 'products', action: 'delete', id: req.params.id });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// ==================== BANNER ROUTES (ADMIN) ====================
app.get('/api/banners', authenticateToken, (req, res) => {
  res.json(database.banners);
});

app.get('/api/banners/:id', authenticateToken, (req, res) => {
  const banner = database.banners.find((b) => b.id === req.params.id);
  if (!banner) {
    return res.status(404).json({ message: 'Banner not found' });
  }
  res.json(banner);
});

app.post('/api/banners', authenticateToken, async (req, res) => {
  try {
    const banner = {
      id: req.body.id || generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    database.banners.push(banner);
    await saveDatabase({ resource: 'banners', action: 'create', id: banner.id });
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Error creating banner', error: error.message });
  }
});

app.put('/api/banners/:id', authenticateToken, async (req, res) => {
  try {
    const bannerIndex = database.banners.findIndex((b) => b.id === req.params.id);
    if (bannerIndex === -1) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    database.banners[bannerIndex] = {
      ...database.banners[bannerIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveDatabase({ resource: 'banners', action: 'update', id: req.params.id });
    res.json(database.banners[bannerIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating banner', error: error.message });
  }
});

app.delete('/api/banners/:id', authenticateToken, async (req, res) => {
  try {
    const bannerIndex = database.banners.findIndex((b) => b.id === req.params.id);
    if (bannerIndex === -1) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    database.banners.splice(bannerIndex, 1);
    await saveDatabase({ resource: 'banners', action: 'delete', id: req.params.id });
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting banner', error: error.message });
  }
});

// ==================== SETTINGS ROUTES (ADMIN) ====================
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

    await saveDatabase({ resource: 'settings', action: 'update' });
    res.json(database.settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

// ==================== DASHBOARD STATISTICS ====================
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {
    totalMalls: database.malls.length,
    totalStores: database.stores.length,
    totalProducts: database.products.length,
    totalBanners: database.banners.length,
    activeBanners: database.banners.filter((b) => b.isActive).length,
    recentActivities: [
      ...database.malls.slice(-5).map((m) => ({ type: 'mall', item: m, date: m.updatedAt })),
      ...database.stores.slice(-5).map((s) => ({ type: 'store', item: s, date: s.updatedAt })),
      ...database.products.slice(-5).map((p) => ({ type: 'product', item: p, date: p.updatedAt })),
      ...database.banners.slice(-5).map((b) => ({ type: 'banner', item: b, date: b.updatedAt }))
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
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
(async () => {
  await loadDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
  });
})();

module.exports = app;
