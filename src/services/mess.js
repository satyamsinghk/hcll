const MessRepository = require('../repositories/messRepository');
const Student = require('../models/student');

class MessService {
  async RegisterStudent(studentId, month, dietPreference, hostelId) {
    // 1. Check duplicate
    const existing = await MessRepository.findByStudentAndMonth(studentId, month);
    if (existing) {
      throw new Error(`Student already registered for mess in ${month}`);
    }

    // 2. Create Registration
    const registration = await MessRepository.create({
      studentId,
      month,
      dietPreference,
      isRegistered: true,
      hostelId
    });

    // 3. Update Student Profile (optional)
    await Student.findByIdAndUpdate(studentId, { messStatus: 'REGISTERED' });

    return registration;
  }

  async CheckStatus(studentId, month) {
    const reg = await MessRepository.findByStudentAndMonth(studentId, month);
    return {
      registered: !!reg,
      details: reg
    };
  }
}

module.exports = MessService;
