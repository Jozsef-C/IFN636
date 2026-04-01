const express = require('express');
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getEvents)
    .post(protect, createEvent);

router.route('/:id')
    .get(getEventById)
    .put(protect, updateEvent)
    .delete(protect, deleteEvent);

module.exports = router;