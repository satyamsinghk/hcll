const { Router } = require('express');
const messController = require('../controllers/messController');
const { isAuth } = require('../middlewares');

const route = Router();

module.exports = (app) => {
  app.use('/mess', route);

  route.post('/register', isAuth, messController.registerMess);
  route.get('/status', isAuth, messController.getStatus);
};
