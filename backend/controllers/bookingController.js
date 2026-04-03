const Booking = require('../models/Booking');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('eventId', 'title venue eventDate')
            .populate('ticketId', 'name price')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('eventId', 'title venue eventDate')
            .populate('ticketId', 'name price');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBooking = async (req, res) => {
    const { eventId, ticketId, quantity } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        if (ticket.eventId.toString() !== eventId) {
            return res.status(400).json({ message: 'Ticket does not belong to the selected event' });
        }

        if (ticket.status !== 'active') {
            return res.status(400).json({ message: 'Ticket is not available for booking' });
        }

        if (ticket.quantityAvailable < quantity) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        const totalPrice = ticket.price * quantity;

        const booking = await Booking.create({
            userId: req.user.id,
            eventId,
            ticketId,
            quantity,
            totalPrice,
            status: 'active',
        });

        ticket.quantityAvailable -= quantity;

        if (ticket.quantityAvailable === 0) {
            ticket.status = 'sold_out';
        }

        await ticket.save();

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBooking = async (req, res) => {
    const { quantity } = req.body;

    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Cancelled booking cannot be updated' });
        }

        const ticket = await Ticket.findById(booking.ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Associated ticket not found' });
        }

        const quantityDifference = quantity - booking.quantity;

        if (quantityDifference > 0 && ticket.quantityAvailable < quantityDifference) {
            return res.status(400).json({ message: 'Not enough tickets available for update' });
        }

        ticket.quantityAvailable -= quantityDifference;
        if (ticket.quantityAvailable < 0) {
            return res.status(400).json({ message: 'Invalid ticket quantity update' });
        }

        if (ticket.quantityAvailable === 0) {
            ticket.status = 'sold_out';
        } else if (ticket.status === 'sold_out') {
            ticket.status = 'active';
        }

        booking.quantity = quantity;
        booking.totalPrice = ticket.price * quantity;

        await ticket.save();
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        const ticket = await Ticket.findById(booking.ticketId);
        if (ticket) {
            ticket.quantityAvailable += booking.quantity;
            if (ticket.status === 'sold_out') {
                ticket.status = 'active';
            }
            await ticket.save();
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyBookings,
    getBookingById,
    createBooking,
    updateBooking,
    cancelBooking,
};