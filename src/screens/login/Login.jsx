import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../protectedroute/AuthContext'; // Update the path to AuthContext
import Signup from '../signup/Signup'; // Import the Signup component

import './_Login.css';
import ForgotPassword from '../forgetpassword/ForgotPassword';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false); // State to control the visibility of the signup form
  const { login } = useContext(AuthContext); // Use the login function from the AuthContext
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const BaseUrl = "https://personalmangerbackend.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BaseUrl}/api/users/login`, { email, password });
      const { token , user} = res.data;
      localStorage.setItem('token', token);
      login(token , user); // Update the authentication state using the login function
      // console.log(user);
      setError('');
      setLoggedIn(true);
    } catch (err) {
      setError('Invalid credentials');
      console.error('Login failed:', err);
    }
  };
  
  if (isLoggedIn) {
    return <Navigate replace to="/" />;
  }
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };
  return (
    <div className="login-container">
      {showForgotPassword ? (
        <ForgotPassword onBackToLogin={handleBackToLogin} />
      ) : showSignup ? (
        <Signup />
      ) : 
       (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          {error && <div className="error">{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
          <button type="submit" className="login-button">Login</button>
          <p className="forgot-password-link signup-link" style={{cursor:'pointer'}} onClick={() => setShowForgotPassword(true)}>Forgot Password?</p>

        </form>
      ) }
      <p className="signup-link" onClick={() => setShowSignup(!showSignup)}>
        {!showForgotPassword&& (showSignup ? 'Already have an account? Login' : 'New User? Sign Up')}
      </p>
    </div>
  );
};

export default Login;
