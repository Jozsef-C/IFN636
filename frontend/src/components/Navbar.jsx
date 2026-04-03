import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      
      {/* Logo */}
      <Link to="/events" className="text-2xl font-bold">
        Your apps name
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/events">Events</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/profile">Profile</Link>

            {/* Admin button */}
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="bg-purple-500 px-3 py-1 rounded hover:bg-purple-700"
              >
                Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;