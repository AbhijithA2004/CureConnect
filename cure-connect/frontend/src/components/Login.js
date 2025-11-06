import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { loginUser, getCurrentUser } from '../services/firebaseService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        history.push('/');
      }
    };
    checkAuth();
  }, [history]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await loginUser(formData.email, formData.password);

    if (result.success) {
      // Check if this is an admin user
      if (formData.email === 'admin@cureconnect.com') {
        history.push('/admin');
      } else {
        history.push('/');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-form">
      <h2>Login to Cure Connect</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>Don't have an account? <a href="/register">Register here</a></p>
      <p>Demo: admin@cureconnect.com / admin123</p>
    </div>
  );
};

export default Login;
