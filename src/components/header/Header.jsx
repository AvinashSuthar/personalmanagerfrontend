// Header.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../protectedroute/AuthContext';
import './_Header.css';

function Header() {
  const { isLoggedIn, logout, user, handleDeleteAccount } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = () => {
    handleDeleteAccount();
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    <div className="header background" style={{  color: '#fff' }}>
      <h1 className="brand">Personal Manager</h1>
      {isLoggedIn ? (
        <div className="user">
          <div className="avatar text-white" style={{ backgroundColor: '#007bff', borderRadius: '50%', padding: '7px 15px' }}>
            {getInitials(user && user.username)}
            <div className="user-actions">
              <button className="btn text-white" onClick={handleDelete}>Delete Account</button>
              <button className="btn text-white" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      ) : (
        <div className='d-flex'>
          <button className="btn text-white" onClick={() => navigate('/login')}>Login</button>
          
        </div>
      )}
    </div>
  );
}

export default Header;
