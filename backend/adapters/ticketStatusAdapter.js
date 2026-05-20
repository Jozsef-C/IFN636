class TicketStatusAdapter {
    static adapt(status) {
        if (!status) {
            return 'active';
        }

        const statusMap = {
            'Active': 'active',
            'Inactive': 'inactive',
            'Sold Out': 'sold_out',
            'active': 'active',
            'inactive': 'inactive',
            'sold_out': 'sold_out',
        };

        return statusMap[status] || 'active';
    }
}

module.exports = TicketStatusAdapter;