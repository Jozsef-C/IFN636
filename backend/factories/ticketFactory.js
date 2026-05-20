class TicketFactory {
    static createTicket(data, userId = null) {
        return {
            eventId: data.eventId,
            name: data.name,
            description: data.description,
            price: data.price,
            quantityAvailable: data.quantityAvailable,
            saleStart: data.saleStart,
            saleEnd: data.saleEnd,
            status: data.status || 'active',
            createdBy: userId,
        };
    }
}

module.exports = TicketFactory;