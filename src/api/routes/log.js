const { Router } = require('express');
const logController = require('../controllers/logController');
const { isAuth } = require('../middlewares');

const route = Router();

module.exports = (app) => {
  app.use('/logs', route);

  route.post('/', isAuth, logController.createLog);
  route.get('/:studentId', isAuth, logController.getLogs);
};
