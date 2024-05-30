
import React, { useState } from 'react';
import axios from 'axios';
import './_ForgotPassword.css';
const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BaseUrl}/api/users/forgetpassword`, { email });
      setStep(2);
    } catch (err) {
      setError('Failed to send OTP');
      console.error('Failed to send OTP:', err);
    }
  };
  const BaseUrl = "https://personalmangerbackend.onrender.com";

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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BaseUrl}/api/users/resetpassword`, { email, password });
      setSuccessMessage('Password reset successfully. Please login with your new password.');
      setTimeout(() => {
        onBackToLogin();
      }, 3000);
    } catch (err) {
      setError('Failed to reset password');
      console.error('Failed to reset password:', err);
    }
  };

  return (
    <div className="forgot-password-container" >
      {step === 1 && (
        <form onSubmit={handleSendOtp} className='signup-form '>
          <h2>Enter your email</h2>
          <div className='form-group'>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          /></div>
          <button type="submit" className="signup-button">Send OTP</button>
          {error && <div className="error">{error}</div>}
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className='signup-form '>
          <h2>Enter OTP </h2>
          <div className='form-group'>
          <label>Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          /></div>
          <button className="signup-button" type="submit">Verify OTP</button>
          {error && <div className="error">{error}</div>}
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className='signup-form '> 
          <h2>Enter new password</h2>
          <div className='form-group'>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
          /></div>
          <button className="signup-button" type="submit">Reset Password</button>
          {error && <div className="error">{error}</div>}
        </form>
      )}
      {successMessage && <div className="success">{successMessage}</div>}
      <p onClick={onBackToLogin} className="signup-link">
      Back to Login
      </p>
     

    </div>
  );
};

export default ForgotPassword;
