import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Building, Tag } from 'lucide-react';
import api from '../api/axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT', // Default to STUDENT for new signups
    username: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Direct API call first to register
      await api.post('/auth/signup', formData);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="icon-bg">
            <UserPlus size={32} color="white" />
          </div>
          <h2>Create Account</h2>
          <p>Join the Hostel Management System</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="status-pill success" style={{textAlign: 'center', marginBottom: '1rem', display: 'block'}}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input 
              name="name"
              type="text" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
           <div className="input-group">
            <Tag className="input-icon" size={20} />
            <input 
              name="username"
              type="text" 
              placeholder="Username" 
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              name="email"
              type="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              name="password"
              type="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
           <div className="input-group">
            <Building className="input-icon" size={20} />
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                background: '#0f172a',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none',
                appearance: 'none'
              }}
            >
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
                <option value="WARDEN">Warden</option>
                <option value="GUARD">Guard</option>
            </select>
          </div>

          <button type="submit" className="login-btn">
            Sign Up
          </button>
        </form>
         <div style={{textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
            Already have an account? <Link to="/login" style={{color: 'var(--primary)', textDecoration: 'none'}}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
