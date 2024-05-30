import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../protectedroute/AuthContext';
import './_Signup.css';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const BaseUrl = "https://personalmangerbackend.onrender.com";


  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BaseUrl}/api/users/signup`, { email });
      setStep(2);
    } catch (err) {
      setError('Email Already exists!');
      console.error('Failed to send OTP:', err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BaseUrl}/api/users/verify-otp`, { email, otp });
      setStep(3);
    } catch (err) {
      setError('Invalid OTP');
      console.error('Invalid OTP:', err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BaseUrl}/api/users/create-account`, { username, email, password });
      const { token } = res.data;

      login(token);
      setSuccess('User registered successfully!');
      setError('');

      navigate('/');
    } catch (err) {
      setError('Failed to register');
      setSuccess('');
      console.error('Signup failed:', err);
    }
  };

  return (
    <div className="signup-container">
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="signup-form">
          <h2>Sign Up</h2>
          {error && <div className="error">{error}</div>}
          <div className='form-group'>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          </div>
          <button type="submit" className="signup-button">Send OTP</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="signup-form">
          <h2>Enter OTP</h2>
          {error && <div className="error">{error}</div>}
          <div className='form-group'>
          <label>Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          /></div>
          <button type="submit" className="signup-button">Verify OTP</button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleSignup} className="signup-form">
          <h2>Sign Up</h2>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      )}
    </div>
  );
};

export default Signup;
