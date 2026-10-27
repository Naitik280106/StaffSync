const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee is required'],
    },
    date: {
      type: String, // stored as YYYY-MM-DD string for easy duplicate checking
      required: [true, 'Date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    status: {
      type: String,
      enum: {
        values: ['Present', 'Absent', 'On Leave'],
        message: 'Status must be Present, Absent or On Leave',
      },
      required: [true, 'Status is required'],
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

// Compound unique index: one record per employee per date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
