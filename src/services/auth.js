const crypto = require('crypto');
const User = require('../models/user');
const Student = require('../models/student');
const Hostel = require('../models/hostel');
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

      // [NEW] If role is STUDENT, create a Student profile automatically
      if (user.role === 'STUDENT' || user.role === 'student') {
        // Fetch default Hostel
        const hostel = await Hostel.findOne(); 
        
        await Student.create({
            firstName: user.name.split(' ')[0] || user.name,
            lastName: user.name.split(' ').slice(1).join(' ') || '.',
            email: user.email,
            rollNumber: 'TEMP-' + Date.now().toString().slice(-6), // Temporary Roll No
            phone: '0000000000', // Placeholder
            hostelId: hostel ? hostel._id : null,
            // Ensure userId is linked if schema supports it, strictly Student model doesn't have it explicitly shown in previous `view_file` 
            // but relying on email match for now or we should add userId reference to Student model.
            // Wait, previous `view_file` of Student model didn't show `userId`. 
            // The Admin Dashboard joins on WHAT? 
            // Ah, Admin Dashboard joins purely on `Student` collection. 
            // It doesn't seem to join regular `User` at all!
            // Wait, if `User` and `Student` are separate, how are they linked? 
            // Email is the common key.
        });
      }
      
      return { user, token };
    } catch (e) {
      if (e.code === 11000) {
        const error = new Error('Email or Username already exists');
        error.status = 409;
        throw error;
      }
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
