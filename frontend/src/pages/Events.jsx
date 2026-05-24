import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/api/events',{
          params: { search }
        });
        setEvents(response.data);
      } catch (error) {
        alert('Failed to fetch events.');
      }
    };

    fetchEvents();
  }, [search]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Festival Events</h1>
      <input type="text"
        placeholder="Search events by keyword"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded p-2 mb-4 w-full"
      />

      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
               <div
               key={event._id}
               className="border rounded-lg p-4 shadow cursor-pointer hover:bg-gray-100"
               onClick={() => navigate(`/events/${event._id}`)}
>             <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-700">{event.description}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(event.eventDate).toLocaleString()}
              </p>
              <p><strong>Category:</strong> {event.category}</p>
              <p><strong>Price:</strong> ${event.price}</p>
              <p><strong>Available Tickets:</strong> {event.availableTickets}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;