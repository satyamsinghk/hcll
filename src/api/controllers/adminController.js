const AdminService = require('../../services/admin');
const adminServiceInstance = new AdminService();

const getDashboard = async (req, res, next) => {
  try {
    const { month, financialYear } = req.query;
    const data = await adminServiceInstance.GetAllStudentsDashboard(month, financialYear);
    return res.status(200).json(data);
  } catch (e) {
    return next(e);
  }
};

const getUnpaid = async (req, res, next) => {
  try {
    const { month } = req.query;
    const data = await adminServiceInstance.GetUnpaidStudents(month);
    return res.status(200).json(data);
  } catch (e) {
    return next(e);
  }
};

module.exports = { getDashboard, getUnpaid };
