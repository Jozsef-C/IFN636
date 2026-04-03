const express = require('express');
const {
    getTicketsByEvent,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
} = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/event/:eventId', getTicketsByEvent);
router.get('/:id', getTicketById);
router.post('/', protect, admin, createTicket);
router.put('/:id', protect, admin, updateTicket);
router.delete('/:id', protect, admin, deleteTicket);

module.exports = router;