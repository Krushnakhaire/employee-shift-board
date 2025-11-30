const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Employee = require('../models/Employee');

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    const emp = await Employee.findOne({ employeeCode: 'EMP002' });
    if (!emp) {
      console.log('Employee with code EMP002 not found');
      process.exit(1);
    }

    const existing = await User.findOne({ email: 'user@example.com' });
    if (existing) {
      console.log('Normal user already exists');
      process.exit(0);
    }

    const user = new User({
      name: 'Normal Employee',
      email: 'user@example.com',
      password: 'User@1234', 
      role: 'user',
      employeeCode: emp.employeeCode
    });

    await user.save();
    console.log('Normal user created:', user.email);
    process.exit(0);
  } catch (err) {
    console.error('Error creating normal user:', err.message);
    process.exit(1);
  }
};

run();
