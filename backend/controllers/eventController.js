const Event = require('../models/Event');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ eventDate: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEvent = async (req, res) => {
    const {
        title,
        description,
        venue,
        eventDate,
        category,
        totalTickets,
        price,
    } = req.body;

    try {
        const event = await Event.create({
            title,
            description,
            venue,
            eventDate,
            category,
            totalTickets,
            availableTickets: totalTickets,
            price,
            createdBy: req.user ? req.user.id : null,
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEvent = async (req, res) => {
    const {
        title,
        description,
        venue,
        eventDate,
        category,
        totalTickets,
        availableTickets,
        price,
    } = req.body;

    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.title = title ?? event.title;
        event.description = description ?? event.description;
        event.venue = venue ?? event.venue;
        event.eventDate = eventDate ?? event.eventDate;
        event.category = category ?? event.category;
        event.totalTickets = totalTickets ?? event.totalTickets;
        event.availableTickets = availableTickets ?? event.availableTickets;
        event.price = price ?? event.price;

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await event.deleteOne();
        res.json({ message: 'Event removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};