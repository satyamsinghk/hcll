const { Router } = require('express');
const adminController = require('../controllers/adminController');
const { isAuth, attachCurrentUser, checkRole } = require('../middlewares');

const route = Router();

module.exports = (app) => {
  app.use('/admin', route);

  // Protect all admin routes:
  // 1. Check valid token (isAuth)
  // 2. Load user context (attachCurrentUser)
  // 3. Verify Role (checkRole)
  route.use(isAuth, attachCurrentUser, checkRole('ADMIN'));

  route.get('/dashboard', adminController.getDashboard);
  route.get('/unpaid', adminController.getUnpaid);
};
