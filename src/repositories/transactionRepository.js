const Transaction = require('../models/transaction');
const Student = require('../models/student');

class TransactionRepository {
  async create(transactionData, session) {
    const transaction = new Transaction(transactionData);
    return await transaction.save({ session });
  }

  async findByStudentMonthType(studentId, month, type, status = 'SUCCESS') {
    return await Transaction.findOne({ studentId, month, type, status });
  }

  async findStudentById(studentId) {
     return await Student.findById(studentId);
  }
}

module.exports = new TransactionRepository();
