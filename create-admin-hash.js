const bcrypt = require('bcryptjs');

// Admin user ma'lumotlari
const adminData = {
  email: 'admin@samarkand.com',
  password: 'admin123'
};

// Parolni hash qilish
bcrypt.hash(adminData.password, 10)
  .then(hash => {
    console.log('✅ Admin paroli hash qilindi:');
    console.log('Email:', adminData.email);
    console.log('Hash:', hash);
    console.log('');
    console.log('💾 Server.js faylda ishlatish uchun:');
    console.log(`password: '${hash}'`);
  })
  .catch(err => {
    console.error('Hash yaratishda xato:', err);
  });