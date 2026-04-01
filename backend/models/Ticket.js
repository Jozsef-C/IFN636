const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
    {
        eventId: {type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true},
        name: {type: String, required: true, trim: true},
        description: {type: String, trim: true},
        price: {type: Number, required: true, min: 0},
        quantityAvailable: {type: Number,required: true,min: 0},
        saleStart: {type: Date},
        saleEnd: {type: Date},
        status: {type: String, enum: ['active', 'inactive', 'sold_out'], default: 'active'},
        createdBy: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    },
    { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);