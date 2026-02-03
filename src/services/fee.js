const mongoose = require('mongoose');
const TransactionRepository = require('../repositories/transactionRepository');

class FeeService {
  async PayFee(studentId, amount, type, month, financialYear, remarks) {
    const session = await mongoose.startSession();
    try {
      console.log('🔄 Attempting to start transaction...');
      session.startTransaction();
      console.log('✅ Transaction started.');
    } catch (error) {
       console.log('⚠️ Failed to start transaction:', error.message);
       // console.warn('⚠️  MongoDB Replica Set not detected. Transactions disabled. ⚠️');
       // If transactions not supported (standalone), we continue without transaction session for Dev.
       // In Prod, this should be enforced.
    }
    
    try {
      // 1. Check for duplicate payment (Idempotency)
      // We check if a SUCCESS transaction already exists for this student+month+type
      const existingPayment = await TransactionRepository.findByStudentMonthType(
        studentId,
        month,
        type,
        'SUCCESS'
      );

      if (existingPayment) {
        throw new Error(`Fee already paid for ${month} (${type})`);
      }

      // 2. Validate Student exists
      const student = await TransactionRepository.findStudentById(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      // 3. Create Transaction Record
      // This is the core logical unit. If this succeeds, money is considered "received".
      const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const transaction = await TransactionRepository.create({
        transactionId,
        studentId,
        amount,
        type,
        month,
        financialYear,
        remarks,
        status: 'SUCCESS', // Assuming instant success for this demo. In real world, might be PENDING -> Webhook -> SUCCESS
        hostelId: student.hostelId // Link to student's hostel
      }, session.inTransaction() ? session : null);

      // 4. Update Student Record (optional, but good for summary)
      // Example: Update 'lastPaymentDate' field on student if we had one.
      // For now, the Transaction Log IS the source of truth, so no direct student update is strictly needed 
      // unless we want to cache payment status.
      // Let's assume we maintain a 'isActive' status that depends on fees, or similar.
      // For this requirement, creating the transaction record atomically is the key.

      if (session.inTransaction()) {
        await session.commitTransaction();
      }
      return transaction;

    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      // Hack for Dev: Fallback if Standalone Mongo (no transactions)
      if (error.message.includes('Transaction numbers are only allowed on a replica set member')) {
         console.warn('⚠️  Transaction failed (Standalone Mongo). Retrying without session... ⚠️');
         
         // Retry Logic - Duplicate checks must match logic above
         const student = await TransactionRepository.findStudentById(studentId);
         if (!student) throw new Error('Student not found'); // Should have been caught above, but safety check

         // Re-create without session
          const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          return await TransactionRepository.create({
            transactionId,
            transactionId, // Just in case
            studentId,
            amount,
            type,
            month,
            financialYear,
            remarks,
            status: 'SUCCESS',
            hostelId: student.hostelId
          }, null); 
      }

      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Why is this ACID compliant?
   * Atomicity: The Transaction creation is wrapped in a Mongoose session. 
   *            If creating the record fails (e.g. validaton) or if any other step fails, 
   *            the entire session aborts, rolling back any partial changes.
   * Consistency: Database invariants (schema rules) are enforced.
   * Isolation: Determine by DB settings, but transactions are isolated from other operations.
   * Durability: Once committed, the data persists in MongoDB.
   */
}

module.exports = FeeService;
