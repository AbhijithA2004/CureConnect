import React, { useState, useEffect } from 'react';
import { getAppointments, getCurrentUser } from '../services/firebaseService';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const result = await getAppointments(currentUser.uid);
          if (result.success) {
            setAppointments(result.data);
          } else {
            setError(result.error);
          }
        } else {
          setError('Please login to view your appointments');
        }
      } catch (err) {
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="my-appointments">
        <h2>My Appointments</h2>
        <div className="loading">Loading your appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-appointments">
        <h2>My Appointments</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="my-appointments">
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <div className="no-appointments">
          <p>You haven't booked any appointments yet.</p>
          <a href="/doctors" className="btn-primary">Book an Appointment</a>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-header">
                <h3>{appointment.doctorName}</h3>
                <span className={`status ${appointment.status || 'pending'}`}>
                  {appointment.status || 'Pending'}
                </span>
              </div>
              <div className="appointment-details">
                <p><strong>Specialty:</strong> {appointment.specialty}</p>
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Reason:</strong> {appointment.reason}</p>
                {appointment.notes && (
                  <p><strong>Notes:</strong> {appointment.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
