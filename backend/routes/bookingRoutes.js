const express = require('express');
const {
    getMyBookings,
    getBookingById,
    createBooking,
    updateBooking,
    cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.post('/', protect, createBooking);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, cancelBooking);

module.exports = router;