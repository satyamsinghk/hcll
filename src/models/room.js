const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: { 
    type: String, 
    required: true,
    trim: true
  },
  floor: { 
    type: Number, 
    required: true 
  },
  block: { 
    type: String, 
    required: true,
    trim: true
  },
  
  capacity: { 
    type: Number, 
    default: 2 
  },
  occupied: { 
    type: Number, 
    default: 0 
  },
  
  type: { 
    type: String, 
    enum: ['SINGLE', 'DOUBLE', 'DORM'], 
    default: 'DOUBLE' 
  },
  
  hostelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hostel', 
    required: true,
    index: true
  }
}, { timestamps: true });

// Ensure unique room number per hostel
RoomSchema.index({ hostelId: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', RoomSchema);
