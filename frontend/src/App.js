import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';

// Import Page Components (Create these files next)
import DashboardPage from './pages/Dashboard';
import LoginPage from './pages/Login';
import NotFound from './pages/NotFound';

// Basic Auth Check (Temporarily disabled for development)
// const isAuthenticated = () => !!localStorage.getItem('token');

function App() {
  return (
    <Router>
      <div className="App glassmorphism-background">
        {/* Navbar - Only shown when authenticated */}
        <nav style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
          <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
          <Link to="/test/new">Create New Test</Link>
        </nav>
        
        <main className="main-content">
          <Routes>
            {/* Temporarily default to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} /> 
            <Route path="/login" element={<LoginPage />} />
            {/* Temporarily remove auth check */}
            <Route 
              path="/dashboard" 
              element={<DashboardPage />} 
            />
            {/* Use the proper NotFound component */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 