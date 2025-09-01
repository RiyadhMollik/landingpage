'use strict';

require('dotenv').config();
const db = require('../models');
const bcrypt = require('bcrypt');

async function initDatabase() {
  try {
    // Sync all models with database
    await db.sequelize.sync({ force: true });
    console.log('Database synchronized successfully');

    // Create admin user
    const adminUser = await db.User.create({
      username: 'admin',
      password: 'admin123', // This will be hashed by the model hooks
      email: 'admin@bdmaps.com',
      role: 'admin'
    });
    console.log('Admin user created:', adminUser.username);

    // Create default product
    const product = await db.Product.create({
      name: 'সারা বাংলাদেশের মৌজা ম্যাপ',
      description: 'বাংলাদেশের সকল জেলার মৌজা ম্যাপ সংগ্রহ করুন',
      price: 200.00,
      campaignEndDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
      imageUrl: '/file.svg',
      isActive: true
    });
    console.log('Default product created:', product.name);

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    process.exit();
  }
}

initDatabase();