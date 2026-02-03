const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  }, // Will be hashed
  
  role: { 
    type: String, 
    enum: ['ADMIN', 'WARDEN', 'GUARD', 'STUDENT'], 
    default: 'STUDENT' 
  },
  
  name: { 
    type: String, 
    required: true 
  },
  
  hostelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hostel' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
