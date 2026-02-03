const mongoose = require('mongoose');
const Hostel = require('../models/hostel');
const Room = require('../models/room');
const config = require('../config');
const path = require('path');

// Load environment variables manually
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function seed() {
  console.log('🌱 Seeding Hostel & Rooms...');
  
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hcl_project';
  
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to DB');

    // 1. Create Default Hostel
    let hostel = await Hostel.findOne({ name: 'HCL Boys Hostel' });
    if (!hostel) {
        hostel = await Hostel.create({
            name: 'HCL Boys Hostel',
            location: 'Main Campus',
            capacity: 500
        });
        console.log('✅ Created Hostel:', hostel.name);
    } else {
        console.log('ℹ️  Hostel already exists');
    }

    // 2. Create Some Rooms
    const roomCount = await Room.countDocuments({ hostelId: hostel._id });
    if (roomCount === 0) {
        const rooms = [];
        for (let i = 1; i <= 20; i++) {
            rooms.push({
                roomNumber: `A-${100 + i}`,
                hostelId: hostel._id,
                capacity: 2,
                occupancy: 0,
                block: 'A',
                floor: 1,
                type: 'DOUBLE'
            });
        }
        await Room.insertMany(rooms);
        console.log(`✅ Created ${rooms.length} Rooms`);
    } else {
        console.log(`ℹ️  Rooms already exist (${roomCount})`);
    }

    process.exit(0);
  } catch (e) {
      console.error('❌ Seeding Failed:', e);
      process.exit(1);
  }
}

seed();
