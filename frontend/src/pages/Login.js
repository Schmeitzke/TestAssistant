import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' // Default role
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    // In a real app, would call API to authenticate
    // For demonstration, set a dummy token and redirect
    localStorage.setItem('token', 'dummy-auth-token'); // Simulate login
    setError(''); // Clear any previous errors
    navigate('/dashboard'); // Navigate to dashboard after login
  };
  
  return (
    <div className="login-page">
      <div className="login-container glass-card">
        <div className="login-header">
          <h1>Welcome to TestAssistant<span className="ai-text">AI</span></h1>
          <p>Log in to access your account</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          
          <div className="form-control">
            <label>I am a:</label>
            <div className="role-selector">
              <label className={`role-option ${formData.role === 'student' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={handleChange}
                />
                <span>Student</span>
              </label>
              <label className={`role-option ${formData.role === 'teacher' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={formData.role === 'teacher'}
                  onChange={handleChange}
                />
                <span>Teacher</span>
              </label>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary login-btn">
            Log In
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 