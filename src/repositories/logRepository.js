const HostelLog = require('../models/log');

class LogRepository {
  async create(logData) {
    return await HostelLog.create(logData);
  }

  async findByStudent(studentId, limit = 50) {
    return await HostelLog.find({ studentId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('studentId', 'firstName lastName rollNumber');
  }
}

module.exports = new LogRepository();
