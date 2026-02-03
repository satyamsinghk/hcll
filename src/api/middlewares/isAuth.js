const { expressjwt: jwt } = require('express-jwt');
const config = require('../../config');

const getTokenFromHeader = (req) => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const isAuth = jwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  requestProperty: 'token',
  getToken: getTokenFromHeader,
});

module.exports = isAuth;
