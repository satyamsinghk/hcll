const MessService = require('../../services/mess');
const messServiceInstance = new MessService();

const registerMess = async (req, res, next) => {
  try {
    const { studentId, month, dietPreference, hostelId } = req.body;
    const reg = await messServiceInstance.RegisterStudent(studentId, month, dietPreference, hostelId);
    return res.status(201).json(reg);
  } catch (e) {
    return next(e);
  }
};

const getStatus = async (req, res, next) => {
  try {
    const { studentId, month } = req.query;
    if (!studentId || !month) return res.status(400).json({message: 'studentId and month required'});
    
    const status = await messServiceInstance.CheckStatus(studentId, month);
    return res.status(200).json(status);
  } catch (e) {
    return next(e);
  }
};

module.exports = { registerMess, getStatus };
