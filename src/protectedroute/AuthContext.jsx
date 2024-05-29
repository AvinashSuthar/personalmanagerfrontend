import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const BaseUrl = "https://personalmangerbackend.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (token && storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
    if (!token || !storedUser) {
      // return <Navigate to="/login" />;
      // navigate('/login', { replace: true });

      
    }
    const fetchUserDetails = async (token ) => {
      
      try {
        const response = await axios.get(`${BaseUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      // <Navigate to="/login" />;
      // navigate('/login', { replace: true });

      }
    };
     fetchUserDetails(token);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (token && storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
    if (!token || !storedUser) {
      // return <Navigate to="/login" />;
      // navigate('/login', { replace: true });

      
    }
    const fetchUserDetails = async (token ) => {
      
      try {
        const response = await axios.get(`${BaseUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      // <Navigate to="/login" />;
      navigate('/login', { replace: true });

      }
    };
     fetchUserDetails(token);
  }, [navigate]);

  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get(`${BaseUrl}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      navigate('/login', { replace: true });
      // console.error('Failed to fetch user details:', error);
    }
  };
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.delete(`${BaseUrl}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 204) {
        // Successfully deleted the account
        // localStorage.removeItem('token');
        logout();
        // setUser(null);
        
        // Redirect to signup or home page
      } else {
        // Handle non-200 status codes
        console.error('Failed to delete account', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const login = async (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    await fetchUserDetails(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user,fetchUserDetails, handleDeleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};
