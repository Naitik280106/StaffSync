const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create employee
// @route   POST /api/employees
const createEmployee = async (req, res) => {
  try {
    const { name, email, department, jobTitle, phone, joiningDate } = req.body;

    // Check required fields manually for a clear error message
    if (!name || !email || !department || !jobTitle || !phone || !joiningDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, department, jobTitle, phone, joiningDate',
      });
    }

    const employee = await Employee.create({ name, email, department, jobTitle, phone, joiningDate });
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    // Duplicate email
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'An employee with this email already exists' });
    }
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'An employee with this email already exists' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };
