import React, { useState, useEffect } from 'react';
import { getDoctors, bookAppointment, getCurrentUser } from '../services/firebaseService';

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '',
    reason: ''
  });
  const [bookingMessage, setBookingMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      const result = await getDoctors();
      if (result.success) {
        setDoctors(result.data);
      } else {
        console.error('Error fetching doctors:', result.error);
      }
      setLoading(false);
    };

    fetchDoctors();
    getCurrentUser().then(setCurrentUser);
  }, []);

  const handleBookAppointment = (doctor) => {
    if (!currentUser) {
      alert('Please login to book an appointment');
      return;
    }
    setSelectedDoctor(doctor);
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        patientId: currentUser.uid,
        patientEmail: currentUser.email,
        date: appointmentForm.date,
        time: appointmentForm.time,
        reason: appointmentForm.reason,
        status: 'confirmed',
        createdAt: new Date()
      };

      const result = await bookAppointment(appointmentData);

      if (result.success) {
        setBookingMessage('Appointment booked successfully!');
        setSelectedDoctor(null);
        setAppointmentForm({ date: '', time: '', reason: '' });
      } else {
        setBookingMessage('Failed to book appointment: ' + result.error);
      }
      setTimeout(() => setBookingMessage(''), 3000);
    } catch (error) {
      setBookingMessage('Failed to book appointment. Please try again.');
      setTimeout(() => setBookingMessage(''), 3000);
    }
  };

  if (loading) {
    return <div className="loading">Loading doctors...</div>;
  }

  return (
    <div className="all-doctors">
      <h2>All Doctors</h2>
      {bookingMessage && (
        <div className={`message ${bookingMessage.includes('successfully') ? 'success' : 'error'}`}>
          {bookingMessage}
        </div>
      )}

      <div className="doctors-grid">
        {doctors.map(doctor => (
          <div key={doctor.id} className="doctor-card">
            <h3>{doctor.name}</h3>
            <p>Specialty: {doctor.specialty}</p>
            <p>Experience: {doctor.experience} years</p>
            <p>Email: {doctor.email}</p>
            <button
              className="btn-secondary"
              onClick={() => handleBookAppointment(doctor)}
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="appointment-modal">
          <div className="modal-content">
            <h3>Book Appointment with {selectedDoctor.name}</h3>
            <form onSubmit={handleAppointmentSubmit}>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Time:</label>
                <input
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reason for visit:</label>
                <textarea
                  value={appointmentForm.reason}
                  onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})}
                  required
                  rows="3"
                  placeholder="Please describe your symptoms or reason for visit"
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Book Appointment</button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedDoctor(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDoctors;
