const FeeService = require('../../services/fee');

const feeServiceInstance = new FeeService();

const payFee = async (req, res, next) => {
  try {
    const { studentId, amount, type, month, financialYear, remarks } = req.body;
    
    // Basic validation
    if (!studentId || !amount || !type || !month || !financialYear) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const transaction = await feeServiceInstance.PayFee(
      studentId,
      amount,
      type,
      month,
      financialYear,
      remarks
    );

    return res.status(200).json({ 
        message: 'Payment Successful', 
        transaction: transaction 
    });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  payFee
};
