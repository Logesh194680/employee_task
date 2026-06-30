const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Employee = require('../models/Employee');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee_dashboard';
    console.log(`Connecting to database at ${mongoUri} for seeding...`);
    await mongoose.connect(mongoUri);

    // Clear existing data
    await User.deleteMany();
    await Employee.deleteMany();

    console.log('Database cleared.');

    // Seed default admin
    const adminUser = await User.create({
      email: 'admin@dashboard.com',
      password: 'admin123', // Will be hashed automatically by pre-save hook
    });

    console.log(`Admin user seeded: ${adminUser.email}`);

    // Seed employees
    const employees = [
      {
        name: 'Sarah Connor',
        email: 'sarah.c@company.com',
        department: 'Engineering',
        designation: 'Staff Software Engineer',
        status: 'Active',
        joiningDate: new Date('2025-08-15'),
      },
      {
        name: 'John Miller',
        email: 'john.m@company.com',
        department: 'Engineering',
        designation: 'Senior Frontend Engineer',
        status: 'Active',
        joiningDate: new Date('2025-10-10'),
      },
      {
        name: 'David Chen',
        email: 'david.c@company.com',
        department: 'Engineering',
        designation: 'QA Specialist',
        status: 'Active',
        joiningDate: new Date('2025-11-05'),
      },
      {
        name: 'Emily Watson',
        email: 'emily.w@company.com',
        department: 'HR',
        designation: 'HR Manager',
        status: 'Active',
        joiningDate: new Date('2025-06-20'),
      },
      {
        name: 'Michael Scott',
        email: 'michael.s@company.com',
        department: 'Sales',
        designation: 'Regional Sales Manager',
        status: 'Active',
        joiningDate: new Date('2025-04-12'),
      },
      {
        name: 'Dwight Schrute',
        email: 'dwight.s@company.com',
        department: 'Sales',
        designation: 'Assistant to the Regional Manager',
        status: 'Inactive',
        joiningDate: new Date('2025-05-15'),
      },
      {
        name: 'Pam Beesly',
        email: 'pam.b@company.com',
        department: 'Design',
        designation: 'UX/UI Designer',
        status: 'Active',
        joiningDate: new Date('2025-09-01'),
      },
      {
        name: 'Jim Halpert',
        email: 'jim.h@company.com',
        department: 'Sales',
        designation: 'Senior Sales Representative',
        status: 'Active',
        joiningDate: new Date('2025-09-12'),
      },
      {
        name: 'Angela Martin',
        email: 'angela.m@company.com',
        department: 'Finance',
        designation: 'Head Accountant',
        status: 'Active',
        joiningDate: new Date('2025-07-25'),
      },
      {
        name: 'Kevin Malone',
        email: 'kevin.m@company.com',
        department: 'Finance',
        designation: 'Junior Accountant',
        status: 'Inactive',
        joiningDate: new Date('2025-12-15'),
      },
      {
        name: 'Ryan Howard',
        email: 'ryan.h@company.com',
        department: 'Marketing',
        designation: 'Social Media Specialist',
        status: 'Inactive',
        joiningDate: new Date('2026-01-10'),
      },
      {
        name: 'Kelly Kapoor',
        email: 'kelly.k@company.com',
        department: 'Marketing',
        designation: 'Customer Relations Lead',
        status: 'Active',
        joiningDate: new Date('2025-11-20'),
      },
      {
        name: 'Oscar Martinez',
        email: 'oscar.m@company.com',
        department: 'Finance',
        designation: 'Senior Accountant',
        status: 'Active',
        joiningDate: new Date('2025-08-01'),
      },
      {
        name: 'Toby Flenderson',
        email: 'toby.f@company.com',
        department: 'HR',
        designation: 'HR Representative',
        status: 'Active',
        joiningDate: new Date('2025-03-01'),
      },
      {
        name: 'Stanley Hudson',
        email: 'stanley.h@company.com',
        department: 'Sales',
        designation: 'Sales Executive',
        status: 'Active',
        joiningDate: new Date('2025-07-15'),
      },
      {
        name: 'Creed Bratton',
        email: 'creed.b@company.com',
        department: 'Engineering',
        designation: 'Quality Assurance Manager',
        status: 'Active',
        joiningDate: new Date('2026-02-18'),
      }
    ];

    await Employee.insertMany(employees);
    console.log(`${employees.length} employees seeded successfully.`);

    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
