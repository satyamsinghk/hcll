const User = require('../../models/user');

const attachCurrentUser = async (req, res, next) => {
  try {
    const decodedToken = req.token; // Set by isAuth (express-jwt)
    if (!decodedToken) {
        return res.status(401).json({ message: 'Token invalid or missing' });
    }
    
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.currentUser = user;
    return next();
  } catch (e) {
    return next(e);
  }
};

module.exports = attachCurrentUser;
