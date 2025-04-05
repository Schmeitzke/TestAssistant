import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Will be replaced with actual auth state
  const [userRole, setUserRole] = useState('student'); // Will be replaced with actual user role
  const navigate = useNavigate();

  const handleLogout = () => {
    // Will handle actual logout logic
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">TestAssistant</span>
          <span className="logo-ai">AI</span>
        </Link>

        <div className="nav-menu">
          {isLoggedIn ? (
            <>
              <Link to="/" className="nav-link">Dashboard</Link>
              
              {userRole === 'teacher' && (
                <>
                  <Link to="/tests" className="nav-link">My Tests</Link>
                  <Link to="/tests/create" className="nav-link">Create Test</Link>
                  <Link to="/grading" className="nav-link">Grading</Link>
                </>
              )}
              
              {userRole === 'student' && (
                <>
                  <Link to="/my-tests" className="nav-link">My Tests</Link>
                  <Link to="/results" className="nav-link">Results</Link>
                </>
              )}
              
              <button className="nav-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-button">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
