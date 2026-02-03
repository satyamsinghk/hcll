const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  rollNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true,
    trim: true
  }, 
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: { 
    type: String, 
    required: true 
  },
  
  // Relationships
  roomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    default: null, 
    index: true 
  },
  
  // Status Tracking
  isActive: { 
    type: Boolean, 
    default: true 
  }, 
  messStatus: { 
     type: String, 
     enum: ['REGISTERED', 'NOT_REGISTERED'], 
     default: 'NOT_REGISTERED' 
  },
  
  hostelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hostel', 
    required: true, 
    index: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
