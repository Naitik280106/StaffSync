const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

// GET /api/employees        — list all
// POST /api/employees       — create new
router.route('/').get(getEmployees).post(createEmployee);

// GET /api/employees/:id    — get one
// PUT /api/employees/:id    — update one
// DELETE /api/employees/:id — delete one
router.route('/:id').get(getEmployee).put(updateEmployee).delete(deleteEmployee);

module.exports = router;
