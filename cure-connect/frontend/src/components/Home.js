import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getCurrentUser } from '../services/firebaseService';
import { seedDoctors } from '../data/seedData';

const Home = () => {
  const history = useHistory();
  const hasSeededRef = useRef(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    checkUser();

    // Only seed if explicitly requested via URL parameter and not already seeded
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('seed') === 'doctors' && !hasSeededRef.current) {
      hasSeededRef.current = true;
      seedDoctors().then(result => {
        console.log('Doctors seeded:', result);
        // Remove the seed parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      });
    }
  }, []);

  const handleBookAppointment = () => {
    if (user) {
      // If logged in, go to doctors page
      history.push('/doctors');
    } else {
      // If not logged in, go to login page
      history.push('/login');
    }
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Cure Connect</h1>
        <p>Your trusted doctor appointment system</p>
        <button className="btn-primary" onClick={handleBookAppointment}>
          Book Appointment
        </button>
      </div>
      <div className="features">
        <div className="feature">
          <h3>Find Doctors</h3>
          <p>Search and find the best doctors in your area</p>
        </div>
        <div className="feature">
          <h3>Easy Booking</h3>
          <p>Book appointments with just a few clicks</p>
        </div>
        <div className="feature">
          <h3>24/7 Support</h3>
          <p>Get help whenever you need it</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
