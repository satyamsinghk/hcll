const checkRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      const user = req.currentUser; // Set by attachCurrentUser
      
      if (!user) {
          return res.status(401).json({ message: 'User context missing' });
      }

      if (user.role !== requiredRole) {
          return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
      }

      return next();
    } catch (e) {
      return next(e);
    }
  };
};

module.exports = checkRole;
