const express = require('express');
const {
    getTicketsByEvent,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/event/:eventId', getTicketsByEvent);
router.get('/:id', getTicketById);
router.post('/', protect, createTicket);
router.put('/:id', protect, updateTicket);
router.delete('/:id', protect, deleteTicket);

module.exports = router;