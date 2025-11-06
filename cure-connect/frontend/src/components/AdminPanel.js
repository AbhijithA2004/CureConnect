import React, { useState, useEffect } from 'react';
import { getDoctors, addDoctor, getAllAppointments, getCurrentUser } from '../services/firebaseService';

const AdminPanel = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: '',
    experience: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('doctors');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = await getCurrentUser();
      if (!user) {
        alert('Please login first');
        window.location.href = '/login';
        return;
      }

      if (user.email !== 'admin@cureconnect.com') {
        alert('Access denied. Admin only.');
        window.location.href = '/';
        return;
      }

      setCurrentUser(user);
      fetchData();
    };

    checkAdmin();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const doctorsResult = await getDoctors();
    const appointmentsResult = await getAllAppointments();

    if (doctorsResult.success) {
      setDoctors(doctorsResult.data);
    } else {
      setError('Failed to fetch doctors');
    }

    if (appointmentsResult.success) {
      setAppointments(appointmentsResult.data);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setNewDoctor({
      ...newDoctor,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const doctorData = {
        ...newDoctor,
        experience: parseInt(newDoctor.experience)
      };

      const result = await addDoctor(doctorData);

      if (result.success) {
        setSuccess('Doctor added successfully!');
        setNewDoctor({ name: '', specialty: '', experience: '', email: '' });
        fetchData();
      } else {
        setError('Failed to add doctor: ' + result.error);
      }
    } catch (err) {
      setError('Failed to add doctor');
    }
  };

  if (loading) {
    return <div className="loading">Loading admin panel...</div>;
  }

  if (!currentUser) {
    return <div className="error">Access denied. Please login as admin.</div>;
  }

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Cure Connect</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="admin-tabs">
        <button
          className={activeTab === 'doctors' ? 'active' : ''}
          onClick={() => setActiveTab('doctors')}
        >
          Manage Doctors
        </button>
        <button
          className={activeTab === 'appointments' ? 'active' : ''}
          onClick={() => setActiveTab('appointments')}
        >
          View Appointments
        </button>
      </div>

      {activeTab === 'doctors' && (
        <>
          <div className="add-doctor-form">
            <h3>Add New Doctor</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newDoctor.name}
                  onChange={handleChange}
                  required
                  placeholder="Doctor's full name"
                />
              </div>
              <div className="form-group">
                <label>Specialty:</label>
                <input
                  type="text"
                  name="specialty"
                  value={newDoctor.specialty}
                  onChange={handleChange}
                  required
                  placeholder="Medical specialty"
                />
              </div>
              <div className="form-group">
                <label>Experience (years):</label>
                <input
                  type="number"
                  name="experience"
                  value={newDoctor.experience}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Years of experience"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newDoctor.email}
                  onChange={handleChange}
                  required
                  placeholder="doctor@cureconnect.com"
                />
              </div>
              <button type="submit" className="btn-primary">Add Doctor</button>
            </form>
          </div>

          <div className="doctors-list">
            <h3>All Doctors ({doctors.length})</h3>
            <div className="doctors-grid">
              {doctors.map(doctor => (
                <div key={doctor.id} className="doctor-card">
                  <h4>{doctor.name}</h4>
                  <p>Specialty: {doctor.specialty}</p>
                  <p>Experience: {doctor.experience} years</p>
                  <p>Email: {doctor.email}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'appointments' && (
        <div className="appointments-view">
          <h3>All Appointments ({appointments.length})</h3>
          <div className="appointments-list">
            {appointments.map(appointment => (
              <div key={appointment.id} className="appointment-item">
                <h4>Dr. {appointment.doctorName}</h4>
                <p>Patient: {appointment.patientEmail}</p>
                <p>Date: {appointment.date}</p>
                <p>Time: {appointment.time}</p>
                <p>Reason: {appointment.reason}</p>
                <p>Status: <span className={`status ${appointment.status}`}>{appointment.status}</span></p>
                <p>Booked: {appointment.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
