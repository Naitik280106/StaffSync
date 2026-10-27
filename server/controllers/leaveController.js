const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

// GET /api/leaves?employee=id&status=Pending
const getLeaves = async (req, res) => {
  try {
    const filter = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.status) filter.status = req.query.status;

    const leaves = await Leave.find(filter)
      .populate('employee', 'name department jobTitle')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// POST /api/leaves
const createLeave = async (req, res) => {
  try {
    const { employee, leaveType, startDate, endDate, reason } = req.body;

    if (!employee || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'employee, leaveType, startDate, endDate and reason are required',
      });
    }

    // Validate employee exists
    const emp = await Employee.findById(employee);
    if (!emp) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Validate date range
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be on or after start date',
      });
    }

    const leave = await Leave.create({ employee, leaveType, startDate, endDate, reason });
    const populated = await leave.populate('employee', 'name department jobTitle');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// PUT /api/leaves/:id/status — approve or reject
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, reviewNote } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Approved or Rejected',
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, reviewNote: reviewNote || '' },
      { returnDocument: 'after', runValidators: true }
    ).populate('employee', 'name department jobTitle');

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }
    res.json({ success: true, data: leave });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid leave ID' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// DELETE /api/leaves/:id
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }
    res.json({ success: true, message: 'Leave request deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid leave ID' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getLeaves, createLeave, updateLeaveStatus, deleteLeave };
