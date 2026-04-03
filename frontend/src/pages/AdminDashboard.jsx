import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    eventDate: '',
    category: '',
    totalTickets: '',
    price: '',
  });

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/api/events');
      setEvents(response.data);
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/api/events', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert('Event created successfully.');

      setFormData({
        title: '',
        description: '',
        venue: '',
        eventDate: '',
        category: '',
        totalTickets: '',
        price: '',
      });

      fetchEvents();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to create event.');
    }
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
      fetchEvents();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to delete event.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create Event</h2>

        <form onSubmit={handleCreateEvent} className="grid gap-4">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={formData.venue}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="datetime-local"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="totalTickets"
            placeholder="Total Tickets"
            value={formData.totalTickets}
            onChange={handleChange}
            className="border p-2 rounded"
            min="0"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded"
            min="0"
            step="0.01"
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Event
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Manage Events</h2>

        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div key={event._id} className="border rounded p-4">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p>{event.description}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleString()}</p>
                <p><strong>Category:</strong> {event.category}</p>
                <p><strong>Price:</strong> ${event.price}</p>
                <p><strong>Available Tickets:</strong> {event.availableTickets}</p>

                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete Event
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;