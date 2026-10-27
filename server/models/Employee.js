const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, 'Please enter a valid phone number'],
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Employee', employeeSchema);
