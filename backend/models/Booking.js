const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
        eventId: {type: mongoose.Schema.Types.ObjectId,ref: 'Event',required: true},
        ticketId: {type: mongoose.Schema.Types.ObjectId,ref: 'Ticket',required: true},
        quantity: {type: Number,required: true,min: 1},
        totalPrice: {type: Number,required: true,min: 0},
        status: {type: String,enum: ['active', 'cancelled'],default: 'active'},
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);