const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (you'll need to set up MongoDB)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cureconnect';

// Connect to MongoDB (optional - using mock data for now)
if (process.env.USE_MONGODB === 'true') {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('Using mock data (MongoDB not connected)');
}

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, 'your-secret-key');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Routes

// Mock users for now
const mockUsers = [
  { id: 1, username: 'admin', email: 'admin@cureconnect.com', password: '$2a$10$DjLhATlmfZurjmphPBqnHuiy0fTo169sz7KyTwNOpBiiwC7gjks0y', role: 'admin' },
  { id: 2, username: 'patient', email: 'patient@cureconnect.com', password: bcrypt.hashSync('patient123', 10), role: 'patient' },
  { id: 3, username: 'doctor', email: 'doctor@cureconnect.com', password: bcrypt.hashSync('doctor123', 10), role: 'doctor' }
];

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists (mock check)
    const existingUser = mockUsers.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      username,
      email,
      password: hashedPassword,
      role: role || 'patient'
    };

    mockUsers.push(newUser);

    // Create token
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, 'your-secret-key');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  try {
    const { email, password } = req.body;

    // Find user (mock check)
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      console.log('Invalid password');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user.id, role: user.role }, 'your-secret-key');

    console.log('Login successful for user:', user.username);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mock doctors data
const mockDoctors = [
  { id: 1, name: 'Dr. John Doe', specialty: 'Cardiology', experience: 10, email: 'john.doe@cureconnect.com' },
  { id: 2, name: 'Dr. Jane Smith', specialty: 'Dermatology', experience: 8, email: 'jane.smith@cureconnect.com' },
  { id: 3, name: 'Dr. Bob Johnson', specialty: 'Pediatrics', experience: 12, email: 'bob.johnson@cureconnect.com' },
  { id: 4, name: 'Dr. Alice Brown', specialty: 'Neurology', experience: 15, email: 'alice.brown@cureconnect.com' },
  { id: 5, name: 'Dr. Charlie Wilson', specialty: 'Orthopedics', experience: 9, email: 'charlie.wilson@cureconnect.com' }
];

// Mock appointments data
const mockAppointments = [];

// Get all doctors
app.get('/api/doctors', (req, res) => {
  res.json(mockDoctors);
});

// Book appointment
app.post('/api/appointments', authenticateToken, (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const doctor = mockDoctors.find(d => d.id === doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newAppointment = {
      id: mockAppointments.length + 1,
      patientId: req.user.id,
      doctorId,
      doctorName: doctor.name,
      date,
      time,
      reason,
      status: 'confirmed',
      createdAt: new Date()
    };

    mockAppointments.push(newAppointment);
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: newAppointment
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user appointments
app.get('/api/appointments', authenticateToken, (req, res) => {
  try {
    const userAppointments = mockAppointments.filter(apt => apt.patientId === req.user.id);
    res.json(userAppointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
app.get('/api/admin/doctors', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  res.json(mockDoctors);
});

app.post('/api/admin/doctors', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  const newDoctor = { id: mockDoctors.length + 1, ...req.body };
  mockDoctors.push(newDoctor);
  res.json(newDoctor);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cure Connect Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
