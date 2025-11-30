const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ email: 'hire-me@anshumat.org' });

    if (existing) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = new User({
      name: 'Anshumat Admin',
      email: 'hire-me@anshumat.org',
      password: 'HireMe@2025!', 
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
};

run();
