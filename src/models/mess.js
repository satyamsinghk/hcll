const mongoose = require('mongoose');

const MessRegistrationSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true, 
    index: true 
  },
  month: { 
    type: String, 
    required: true 
  }, // "2023-10"
  
  isRegistered: { 
    type: Boolean, 
    default: false 
  },
  dietPreference: { 
    type: String, 
    enum: ['VEG', 'NON-VEG'], 
    default: 'VEG' 
  },
  
  hostelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hostel' 
  }
}, { timestamps: true });

// One record per student per month
MessRegistrationSchema.index({ studentId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('MessRegistration', MessRegistrationSchema);
