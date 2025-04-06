import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  // Keep userRole state for toggling demo view, but remove mock data
  const [userRole, setUserRole] = useState('teacher'); 
  const [userData, setUserData] = useState({
    name: 'Demo User', // Placeholder name
    role: userRole,
    stats: userRole === 'teacher' 
      ? { tests: 0, students: 0, graded: 0 } // Default empty stats
      : { completed: 0, average: 'N/A', pending: 0 }
  });

  // State for fetched tests
  const [recentItems, setRecentItems] = useState([]); 
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch data when component mounts or userRole changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch tests if role is teacher
        if (userRole === 'teacher') {
          // Use environment variable for API URL or default
          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'; 
          const response = await fetch(`${apiUrl}/api/tests`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setRecentItems(data); // Update state with fetched tests
          // Update stats based on fetched data (example)
          setUserData(prev => ({
            ...prev,
            stats: { ...prev.stats, tests: data.length }
          }));
        } else {
          // Clear items if role is student (implement student data fetch later)
          setRecentItems([]);
          setUserData(prev => ({
            ...prev,
            stats: { completed: 0, average: 'N/A', pending: 0 } 
          }));
        }
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole]); // Re-fetch when userRole changes


  // Function to simulate role change - for demonstration purposes
  const toggleRole = () => {
    const newRole = userRole === 'teacher' ? 'student' : 'teacher';
    setUserRole(newRole); // This will trigger the useEffect hook
  };

  // Update user data immediately when role toggles for responsiveness
  useEffect(() => {
    setUserData(prev => ({
      ...prev,
      name: 'Demo User',
      role: userRole,
      // Reset stats until data is fetched
      stats: userRole === 'teacher' 
        ? { tests: 0, students: 0, graded: 0 }
        : { completed: 0, average: 'N/A', pending: 0 }
    }));
  }, [userRole]);

  return (
    <div className="dashboard">
      <div className="dashboard-header glass-card">
        <div className="welcome-message">
          <h1>Welcome, {userData.name}</h1>
          <p>{userRole === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard'}</p>
          <button onClick={toggleRole} className="role-toggle">
            Switch to {userRole === 'teacher' ? 'Student' : 'Teacher'} View
          </button>
        </div>

        <div className="stats-container">
          {userRole === 'teacher' ? (
            <>
              <div className="stat-card">
                <h3>{userData.stats.tests}</h3>
                <p>Tests Created</p>
              </div>
              <div className="stat-card">
                <h3>{userData.stats.students}</h3>
                <p>Students</p>
              </div>
              <div className="stat-card">
                <h3>{userData.stats.graded}</h3>
                <p>Tests Graded</p>
              </div>
            </>
          ) : (
            <>
              <div className="stat-card">
                <h3>{userData.stats.completed}</h3>
                <p>Tests Completed</p>
              </div>
              <div className="stat-card">
                <h3>{userData.stats.average}</h3>
                <p>Average Score</p>
              </div>
              <div className="stat-card">
                <h3>{userData.stats.pending}</h3>
                <p>Pending Tests</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="dashboard-main">
        <div className="recent-section glass-card">
          <div className="section-header">
            <h2>{userRole === 'teacher' ? 'Recent Tests' : 'My Tests'}</h2>
            <Link to={userRole === 'teacher' ? '/tests' : '/my-tests'} className="view-all">
              View All
            </Link>
          </div>

          <div className="items-list">
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">Error loading data: {error}</p>}
            {!loading && !error && recentItems.length === 0 && (
              <p>No tests found.</p> // Show message if no tests
            )}
            {!loading && !error && recentItems.map(item => (
              <div key={item.id} className="list-item">
                <div className="item-info">
                  <h3>{item.title}</h3>
                  {/* Assuming 'created_at' from backend */} 
                  <p className="item-date">Created: {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <div className="item-status">
                   {/* Display relevant status info from item, e.g., item.is_published */} 
                   <span className={`status ${item.is_published ? 'published' : 'draft'}`}>
                    {item.is_published ? 'Published' : 'Draft'}
                  </span>
                  {userRole === 'teacher' ? (
                    <p>Questions: {item.question_count}</p> // Example using fetched data
                  ) : (
                     <p>Score: {item.score || 'N/A'}</p> // Placeholder for student score
                  )}
                </div>
              </div>
            ))}
          </div>

          {userRole === 'teacher' && (
            <div className="action-buttons">
              <Link to="/test/new" className="btn btn-primary">
                Create New Test
              </Link>
              <Link to="/tests/generate" className="glass-button">
                Generate with AI
              </Link>
            </div>
          )}
        </div>

        <div className="quick-actions glass-card">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {userRole === 'teacher' ? (
              <>
                <Link to="/test/new" className="action-card">
                  <h3>Create Test</h3>
                  <p>Design a new test from scratch</p>
                </Link>
                <Link to="/grading" className="action-card">
                  <h3>Grade Tests</h3>
                  <p>Review and grade submitted tests</p>
                </Link>
                <Link to="/tests/upload" className="action-card">
                  <h3>Upload Scans</h3>
                  <p>Upload scanned test papers</p>
                </Link>
                <Link to="/analytics" className="action-card">
                  <h3>Analytics</h3>
                  <p>View performance insights</p>
                </Link>
              </>
            ) : (
              <>
                <Link to="/my-tests" className="action-card">
                  <h3>My Tests</h3>
                  <p>View all assigned tests</p>
                </Link>
                <Link to="/results" className="action-card">
                  <h3>Results</h3>
                  <p>View your test results</p>
                </Link>
                <Link to="/resources" className="action-card">
                  <h3>Resources</h3>
                  <p>Learning materials</p>
                </Link>
                <Link to="/profile" className="action-card">
                  <h3>Profile</h3>
                  <p>Update your information</p>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 