const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee is required'],
    },
    leaveType: {
      type: String,
      enum: {
        values: ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Other'],
        message: 'Invalid leave type',
      },
      required: [true, 'Leave type is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    reviewNote: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leave', leaveSchema);
