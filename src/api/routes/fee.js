const { Router } = require('express');
const feeController = require('../controllers/feeController');
const { isAuth } = require('../middlewares');

const route = Router();

module.exports = (app) => {
  app.use('/fees', route);

  route.post(
    '/pay',
    isAuth, // Only authenticated users (Admin/Student) can pay/record payment
    feeController.payFee
  );
};
