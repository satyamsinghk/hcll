const crypto = require('crypto');
const User = require('../models/user');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = class AuthService {
  constructor() {}

  async SignUp(userInputDTO) {
    try {
      const salt = crypto.randomBytes(32);
      const hashedPassword = await argon2.hash(userInputDTO.password, { salt });

      const userRecord = await User.create({
        ...userInputDTO,
        password: hashedPassword,
      });

      const token = this.generateToken(userRecord);

      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      
      return { user, token };
    } catch (e) {
      throw e;
    }
  }

  async SignIn(email, password) {
    const userRecord = await User.findOne({ email });
    if (!userRecord) {
      const error = new Error('User not registered');
      error.status = 404;
      throw error;
    }
    
    // Check password
    const validPassword = await argon2.verify(userRecord.password, password);
    if (validPassword) {
      const token = this.generateToken(userRecord);
      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      return { user, token };
    } else {
      const error = new Error('Invalid Password');
      error.status = 401;
      throw error;
    }
  }

  generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        _id: user._id,
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }
}
