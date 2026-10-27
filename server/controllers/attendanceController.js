const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// GET /api/attendance?date=YYYY-MM-DD&employee=id
const getAttendance = async (req, res) => {
  try {
    const filter = {};
    if (req.query.date) filter.date = req.query.date;
    if (req.query.employee) filter.employee = req.query.employee;

    const records = await Attendance.find(filter)
      .populate('employee', 'name department jobTitle')
      .sort({ date: -1, createdAt: -1 });

    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// POST /api/attendance
const markAttendance = async (req, res) => {
  try {
    const { employee, date, status, note } = req.body;

    if (!employee || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'employee, date and status are required',
      });
    }

    // Validate employee exists
    const emp = await Employee.findById(employee);
    if (!emp) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const record = await Attendance.create({ employee, date, status, note });
    const populated = await record.populate('employee', 'name department jobTitle');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this employee on this date',
      });
    }
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

// PUT /api/attendance/:id  — update status
const updateAttendance = async (req, res) => {
  try {
    const { status, note } = req.body;
    const record = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status, note },
      { returnDocument: 'after', runValidators: true }
    ).populate('employee', 'name department jobTitle');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid record ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// DELETE /api/attendance/:id
const deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, message: 'Attendance record deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid record ID' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getAttendance, markAttendance, updateAttendance, deleteAttendance };
