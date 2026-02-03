const mongoose = require('mongoose');
const User = require('../models/user');
const argon2 = require('argon2');
const path = require('path');

// Load environment variables manually since dotenv might need absolute path
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function seed() {
  console.log('🌱 Seeding Database...');
  
  // Use config port if possible, else 5001 fallback
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hcl_project';
  
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to DB:', uri);

    // 1. Check/Create Admin
    const adminEmail = 'admin@hms.com';
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
        const salt = require('crypto').randomBytes(32);
        const hashedPassword = await argon2.hash('pass', { salt });
        
        await User.create({
            name: 'System Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
            username: 'admin'
        });
        console.log('✅ Created Admin: admin@hms.com / pass');
    } else {
        console.log('ℹ️  Admin already exists:', adminEmail);
        // Force update password to 'pass' to be sure
        const salt = require('crypto').randomBytes(32);
        const hashedPassword = await argon2.hash('pass', { salt });
        adminExists.password = hashedPassword;
        await adminExists.save();
        console.log('🔄 Reset Admin Password to: pass');
    }

    process.exit(0);
  } catch (e) {
      console.error('❌ Seeding Failed:', e);
      process.exit(1);
  }
}

seed();
