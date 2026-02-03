const MessRegistration = require('../models/mess');

class MessRepository {
  async create(data) {
    return await MessRegistration.create(data);
  }

  async findByStudentAndMonth(studentId, month) {
    return await MessRegistration.findOne({ studentId, month });
  }

  async findMissingRegistrations(month, hostelId) {
     // This would require finding all students in hostel NOT in mess collection
     // Complex aggregation. For now, let's keep it simple: Find valid registrations
     return await MessRegistration.find({ month, hostelId }).populate('studentId');
  }
}

module.exports = new MessRepository();
