import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await axiosInstance.get(`/api/events/${id}`);
        setEvent(eventRes.data);

        const ticketRes = await axiosInstance.get(`/api/tickets/event/${id}`);
        setTickets(ticketRes.data);
      } catch (error) {
        console.error(error);
        alert('Failed to load event details.');
      }
    };

    fetchData();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p>{event.description}</p>
      <p><strong>Venue:</strong> {event.venue}</p>
      <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleString()}</p>

      <h2 className="text-2xl mt-6 mb-4">Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets available.</p>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket._id} className="border p-4 mb-3 rounded">
            <h3 className="text-xl">{ticket.name}</h3>
            <p>{ticket.description}</p>
            <p><strong>Price:</strong> ${ticket.price}</p>
            <p><strong>Available:</strong> {ticket.quantityAvailable}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default EventDetails;