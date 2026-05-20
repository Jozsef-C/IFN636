const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const TicketFactory = require('../factories/ticketFactory');
const TicketStatusAdapter = require('../adapters/ticketStatusAdapter');

const getTicketsByEvent = async (req, res) => {
    try {
        const tickets = await Ticket.find({ eventId: req.params.eventId }).sort({ createdAt: 1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTicket = async (req, res) => {
    const {
        eventId,
        name,
        description,
        price,
        quantityAvailable,
        saleStart,
        saleEnd,
        status,
    } = req.body;

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Associated event not found' });
        }

        const ticketData = TicketFactory.createTicket(
            {
                eventId,
                name,
                description,
                price,
                quantityAvailable,
                saleStart,
                saleEnd,
                status,
            },
            req.user ? req.user.id : null
        );

        const ticket = await Ticket.create(ticketData);

        res.status(201).json(ticket);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTicket = async (req, res) => {
    const {
        name,
        description,
        price,
        quantityAvailable,
        saleStart,
        saleEnd,
        status,
    } = req.body;

    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.name = name ?? ticket.name;
        ticket.description = description ?? ticket.description;
        ticket.price = price ?? ticket.price;
        ticket.quantityAvailable = quantityAvailable ?? ticket.quantityAvailable;
        ticket.saleStart = saleStart ?? ticket.saleStart;
        ticket.saleEnd = saleEnd ?? ticket.saleEnd;
        ticket.status = status ? TicketStatusAdapter.adapt(status) : ticket.status;

        const updatedTicket = await ticket.save();
        res.json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        await ticket.deleteOne();
        res.json({ message: 'Ticket removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTicketsByEvent,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
};