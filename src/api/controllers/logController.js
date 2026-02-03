const LogService = require('../../services/log');
const logServiceInstance = new LogService();

const createLog = async (req, res, next) => {
  try {
    const { studentId, type, hostelId } = req.body;
    // Guard ID usually from req.user (middleware), for now passed or ignored
    const guardId = req.user ? req.user._id : null; 
    
    const log = await logServiceInstance.LogEntryExit(studentId, type, hostelId, guardId);
    return res.status(201).json(log);
  } catch (e) {
    return next(e);
  }
};

const getLogs = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const logs = await logServiceInstance.GetStudentLogs(studentId);
    return res.status(200).json(logs);
  } catch (e) {
    return next(e);
  }
};

module.exports = { createLog, getLogs };
