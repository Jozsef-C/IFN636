const Booking = require('../models/Booking');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

class BookingFacade {
    static async createBooking(userId, eventId, ticketId, quantity) {

        const event = await Event.findById(eventId);

        if (!event) {
            throw new Error('Event not found');
        }

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        if (ticket.eventId.toString() !== eventId) {
            throw new Error('Ticket does not belong to selected event');
        }

        if (ticket.status !== 'active') {
            throw new Error('Ticket is not available for booking');
        }

        if (ticket.quantityAvailable < quantity) {
            throw new Error('Not enough tickets available');
        }

        const totalPrice = ticket.price * quantity;

        const booking = await Booking.create({
            userId,
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

        return booking;
    }
}

module.exports = BookingFacade;