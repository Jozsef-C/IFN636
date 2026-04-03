import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await axiosInstance.get(`/api/events/${id}`);
        setEvent(eventRes.data);

        const ticketRes = await axiosInstance.get(`/api/tickets/event/${id}`);
        setTickets(ticketRes.data);

        const initialQuantities = {};
        ticketRes.data.forEach((ticket) => {
          initialQuantities[ticket._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error(error);
        alert('Failed to load event details.');
      }
    };

    fetchData();
  }, [id]);

  const handleQuantityChange = (ticketId, value, maxAvailable) => {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue) || parsedValue < 1) {
      setQuantities((prev) => ({ ...prev, [ticketId]: 1 }));
      return;
    }

    if (parsedValue > maxAvailable) {
      setQuantities((prev) => ({ ...prev, [ticketId]: maxAvailable }));
      return;
    }

    setQuantities((prev) => ({ ...prev, [ticketId]: parsedValue }));
  };

  const handleBooking = async (ticket) => {
    try {
      if (!user || !user.token) {
        alert('Please log in before booking tickets.');
        return;
      }

      const quantity = quantities[ticket._id] || 1;

      await axiosInstance.post(
        '/api/bookings',
        {
          eventId: id,
          ticketId: ticket._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert('Booking successful!');

      const ticketRes = await axiosInstance.get(`/api/tickets/event/${id}`);
      setTickets(ticketRes.data);

      const updatedQuantities = {};
      ticketRes.data.forEach((updatedTicket) => {
        updatedQuantities[updatedTicket._id] =
          quantities[updatedTicket._id] &&
          quantities[updatedTicket._id] <= updatedTicket.quantityAvailable
            ? quantities[updatedTicket._id]
            : 1;
      });
      setQuantities(updatedQuantities);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Booking failed.');
    }
  };

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

            <div className="mt-3 flex items-center gap-3">
              <input
                type="number"
                min="1"
                max={ticket.quantityAvailable}
                value={quantities[ticket._id] || 1}
                onChange={(e) =>
                  handleQuantityChange(ticket._id, e.target.value, ticket.quantityAvailable)
                }
                className="border p-2 rounded w-24"
                disabled={ticket.quantityAvailable === 0}
              />

              <button
                onClick={() => handleBooking(ticket)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                disabled={ticket.quantityAvailable === 0}
              >
                {ticket.quantityAvailable === 0 ? 'Sold Out' : 'Book Ticket'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EventDetails;