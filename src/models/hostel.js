const mongoose = require('mongoose');

const HostelSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    index: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  contactEmail: String,
  contactPhone: String,
  
  // Configuration for this hostel
  capacity: { type: Number, default: 200 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Hostel', HostelSchema);
