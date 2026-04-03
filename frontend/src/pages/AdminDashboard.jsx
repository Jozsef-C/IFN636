import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [ticketsByEvent, setTicketsByEvent] = useState({});
  const [editingEventId, setEditingEventId] = useState(null);

  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    venue: '',
    eventDate: '',
    category: '',
    totalTickets: '',
    price: '',
  });

  const [ticketFormData, setTicketFormData] = useState({
    eventId: '',
    name: '',
    description: '',
    price: '',
    quantityAvailable: '',
    saleStart: '',
    saleEnd: '',
    status: 'active',
  });

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/api/events');
      setEvents(response.data);

      const ticketMap = {};
      for (const event of response.data) {
        const ticketResponse = await axiosInstance.get(`/api/tickets/event/${event._id}`);
        ticketMap[event._id] = ticketResponse.data;
      }
      setTicketsByEvent(ticketMap);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch events.');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      alert('Admin access required.');
      navigate('/events');
      return;
    }

    fetchEvents();
  }, [user, navigate]);

  const handleEventChange = (e) => {
    setEventFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTicketChange = (e) => {
    setTicketFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetEventForm = () => {
    setEditingEventId(null);
    setEventFormData({
      title: '',
      description: '',
      venue: '',
      eventDate: '',
      category: '',
      totalTickets: '',
      price: '',
    });
  };

  const resetTicketForm = () => {
    setTicketFormData({
      eventId: '',
      name: '',
      description: '',
      price: '',
      quantityAvailable: '',
      saleStart: '',
      saleEnd: '',
      status: 'active',
    });
  };

  const handleCreateOrUpdateEvent = async (e) => {
    e.preventDefault();

    try {
      if (editingEventId) {
        await axiosInstance.put(`/api/events/${editingEventId}`, eventFormData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        alert('Event updated successfully.');
      } else {
        await axiosInstance.post('/api/events', eventFormData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        alert('Event created successfully.');
      }

      resetEventForm();
      fetchEvents();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to save event.');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEventId(event._id);
    setEventFormData({
      title: event.title || '',
      description: event.description || '',
      venue: event.venue || '',
      eventDate: event.eventDate
        ? new Date(event.eventDate).toISOString().slice(0, 16)
        : '',
      category: event.category || '',
      totalTickets: event.totalTickets || '',
      price: event.price || '',
    });
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert('Event deleted successfully.');

      if (editingEventId === eventId) {
        resetEventForm();
      }

      fetchEvents();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to delete event.');
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/api/tickets', ticketFormData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert('Ticket created successfully.');
      resetTicketForm();
      fetchEvents();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to create ticket.');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this ticket?');
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert('Ticket deleted successfully.');
      fetchEvents();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to delete ticket.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingEventId ? 'Edit Event' : 'Create Event'}
        </h2>

        <form onSubmit={handleCreateOrUpdateEvent} className="grid gap-4">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={eventFormData.title}
            onChange={handleEventChange}
            className="border p-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={eventFormData.description}
            onChange={handleEventChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={eventFormData.venue}
            onChange={handleEventChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="datetime-local"
            name="eventDate"
            value={eventFormData.eventDate}
            onChange={handleEventChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={eventFormData.category}
            onChange={handleEventChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="totalTickets"
            placeholder="Total Tickets"
            value={eventFormData.totalTickets}
            onChange={handleEventChange}
            className="border p-2 rounded"
            min="0"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={eventFormData.price}
            onChange={handleEventChange}
            className="border p-2 rounded"
            min="0"
            step="0.01"
            required
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingEventId ? 'Update Event' : 'Create Event'}
            </button>

            {editingEventId && (
              <button
                type="button"
                onClick={resetEventForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create Ticket</h2>

        <form onSubmit={handleCreateTicket} className="grid gap-4">
          <select
            name="eventId"
            value={ticketFormData.eventId}
            onChange={handleTicketChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="Ticket Name"
            value={ticketFormData.name}
            onChange={handleTicketChange}
            className="border p-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Ticket Description"
            value={ticketFormData.description}
            onChange={handleTicketChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="price"
            placeholder="Ticket Price"
            value={ticketFormData.price}
            onChange={handleTicketChange}
            className="border p-2 rounded"
            min="0"
            step="0.01"
            required
          />

          <input
            type="number"
            name="quantityAvailable"
            placeholder="Quantity Available"
            value={ticketFormData.quantityAvailable}
            onChange={handleTicketChange}
            className="border p-2 rounded"
            min="0"
            required
          />

          <input
            type="datetime-local"
            name="saleStart"
            value={ticketFormData.saleStart}
            onChange={handleTicketChange}
            className="border p-2 rounded"
          />

          <input
            type="datetime-local"
            name="saleEnd"
            value={ticketFormData.saleEnd}
            onChange={handleTicketChange}
            className="border p-2 rounded"
          />

          <select
            name="status"
            value={ticketFormData.status}
            onChange={handleTicketChange}
            className="border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="sold_out">Sold Out</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Ticket
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Manage Events & Tickets</h2>

        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <div key={event._id} className="border rounded p-4">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p>{event.description}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleString()}</p>
                <p><strong>Category:</strong> {event.category}</p>
                <p><strong>Price:</strong> ${event.price}</p>
                <p><strong>Available Tickets:</strong> {event.availableTickets}</p>

                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit Event
                  </button>

                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete Event
                  </button>
                </div>

                <div className="mt-5">
                  <h4 className="text-lg font-semibold mb-2">Tickets</h4>

                  {ticketsByEvent[event._id] && ticketsByEvent[event._id].length > 0 ? (
                    ticketsByEvent[event._id].map((ticket) => (
                      <div key={ticket._id} className="border rounded p-3 mb-2 bg-gray-50">
                        <p><strong>{ticket.name}</strong></p>
                        <p>{ticket.description}</p>
                        <p><strong>Price:</strong> ${ticket.price}</p>
                        <p><strong>Available:</strong> {ticket.quantityAvailable}</p>
                        <p><strong>Status:</strong> {ticket.status}</p>

                        <button
                          onClick={() => handleDeleteTicket(ticket._id)}
                          className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete Ticket
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No tickets for this event yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;