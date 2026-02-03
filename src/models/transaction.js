const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionId: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  }, // Bank Ref / UUID
  
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true, 
    index: true 
  },
  
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'INR' 
  },
  
  type: { 
    type: String, 
    enum: ['HOSTEL_FEE', 'MESS_FEE', 'FINE'], 
    required: true 
  },
  month: { 
    type: String, 
    required: true 
  }, // e.g., "2023-10"
  financialYear: { 
    type: String, 
    required: true 
  }, // e.g., "2023-24"
  
  status: { 
    type: String, 
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'], 
    default: 'PENDING',
    index: true 
  },
  
  remarks: String,
  hostelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hostel' 
  }
}, { timestamps: true });

// Prevent duplicate successful payments for same Month + Type + StudentId
// Using compound index: { studentId: 1, type: 1, month: 1, status: 1 } 
// Since we want to allow retries if FAILED, but strictly one SUCCESS, this is tricky at DB level uniqueness alone.
// We will bank on Business Logic + Transaction isolation for strictness, but an index helps lookup.
TransactionSchema.index({ studentId: 1, type: 1, month: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
