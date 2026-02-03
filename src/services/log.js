const LogRepository = require('../repositories/logRepository');

class LogService {
  async LogEntryExit(studentId, type, hostelId, guardId) {
    // Validation: Check if student exists (omitted for brevity, assume valid ID or catch DB error)
    
    const log = await LogRepository.create({
      studentId,
      type, // 'ENTRY' or 'EXIT'
      hostelId,
      guardId,
      timestamp: new Date()
    });
    
    return log;
  }

  async GetStudentLogs(studentId) {
    return await LogRepository.findByStudent(studentId);
  }
}

module.exports = LogService;
