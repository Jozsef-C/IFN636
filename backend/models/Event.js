const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        venue: { type: String, required: true, trim: true },
        eventDate: { type: Date, required: true },
        category: { type: String, trim: true },
        totalTickets: { type: Number, required: true, min: 0 },
        availableTickets: { type: Number, required: true, min: 0 },
        price: { type: Number, required: true, min: 0 },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);