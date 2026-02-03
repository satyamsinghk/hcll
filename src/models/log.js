const mongoose = require('mongoose');

const HostelLogSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true, 
    index: true 
  },
  type: { 
    type: String, 
    enum: ['ENTRY', 'EXIT'], 
    required: true 
  },
  
  timestamp: { 
    type: Date, 
    default: Date.now, 
    index: true 
  },
  
  // Verification details
  guardId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }, 
  gateNumber: { 
    type: String 
  },
  
  hostelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hostel', 
    index: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('HostelLog', HostelLogSchema);
