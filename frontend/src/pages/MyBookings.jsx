import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get('/api/bookings', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch bookings.');
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-semibold">
              {booking.eventId?.title || 'Event'}
            </h2>
            <p><strong>Ticket:</strong> {booking.ticketId?.name || 'Ticket'}</p>
            <p><strong>Quantity:</strong> {booking.quantity}</p>
            <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;