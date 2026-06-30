const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide employee name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide employee email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    department: {
      type: String,
      required: [true, 'Please provide department'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Please provide designation'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Please provide status'],
      enum: {
        values: ['Active', 'Inactive'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Active',
    },
    joiningDate: {
      type: Date,
      required: [true, 'Please provide joining date'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
