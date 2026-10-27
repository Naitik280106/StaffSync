const express = require('express');
const router = express.Router();
const {
  getLeaves,
  createLeave,
  updateLeaveStatus,
  deleteLeave,
} = require('../controllers/leaveController');

router.route('/').get(getLeaves).post(createLeave);
router.route('/:id').delete(deleteLeave);
router.route('/:id/status').put(updateLeaveStatus).patch(updateLeaveStatus);

module.exports = router;
