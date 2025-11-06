import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { logoutUser, getCurrentUser } from '../services/firebaseService';

const Navbar = () => {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      setCurrentUser(null);
      history.push('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Cure Connect
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/doctors" className="nav-link">Doctors</Link>
          <Link to="/about" className="nav-link">About</Link>

          {currentUser ? (
            <>
              <Link to="/my-appointments" className="nav-link">My Appointments</Link>
              {currentUser.email === 'admin@cureconnect.com' && (
                <Link to="/admin" className="nav-link">Admin Panel</Link>
              )}
              <span className="nav-user">Welcome, {currentUser.email.split('@')[0]}</span>
              <button onClick={handleLogout} className="nav-link btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
