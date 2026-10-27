const Announcement = require('../models/Announcement');

// GET /api/announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// POST /api/announcements
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, date } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }
    const announcement = await Announcement.create({ title, message, date: date || Date.now() });
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// PUT /api/announcements/:id
const updateAnnouncement = async (req, res) => {
  try {
    const { title, message, date } = req.body;
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, message, date },
      { returnDocument: 'after', runValidators: true }
    );
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.json({ success: true, data: announcement });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid announcement ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// DELETE /api/announcements/:id
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid announcement ID' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
