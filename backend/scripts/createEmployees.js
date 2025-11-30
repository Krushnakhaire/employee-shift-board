const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Employee = require('../models/Employee');

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    const count = await Employee.countDocuments();
    if (count > 0) {
      console.log('Employees already exist');
      process.exit(0);
    }

    await Employee.insertMany([
      {
        name: 'HR Admin',
        employeeCode: 'EMP001',
        department: 'HR'
      },
      {
        name: 'Normal User',
        employeeCode: 'EMP002',
        department: 'Engineering'
      }
    ]);

    console.log('Employees inserted');
    process.exit(0);
  } catch (err) {
    console.error('Error inserting employees:', err.message);
    process.exit(1);
  }
};

run();
