const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');

router.route('/').get(getAnnouncements).post(createAnnouncement);
router.route('/:id').put(updateAnnouncement).delete(deleteAnnouncement);

module.exports = router;
