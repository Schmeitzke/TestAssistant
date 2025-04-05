import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  // Mock data - would come from API in real implementation
  const [userRole, setUserRole] = useState('teacher'); // Toggle between 'teacher' and 'student' to see different views
  const [userData, setUserData] = useState({
    name: 'John Smith',
    role: userRole,
    stats: userRole === 'teacher' 
      ? { tests: 12, students: 87, graded: 45 }
      : { completed: 8, average: '85%', pending: 2 }
  });

  const [recentItems, setRecentItems] = useState(
    userRole === 'teacher'
      ? [
          { id: 1, title: 'Physics Midterm', date: '2023-04-01', status: 'Published', studentsCompleted: 18 },
          { id: 2, title: 'Chemistry Quiz', date: '2023-03-28', status: 'Grading', studentsCompleted: 22 },
          { id: 3, title: 'Math Final', date: '2023-03-15', status: 'Draft', studentsCompleted: 0 }
        ]
      : [
          { id: 1, title: 'Physics Midterm', date: '2023-04-01', status: 'Completed', score: '92%' },
          { id: 2, title: 'Chemistry Quiz', date: '2023-03-28', status: 'Pending Grading', score: '-' },
          { id: 3, title: 'Biology Test', date: '2023-03-10', status: 'Completed', score: '78%' }
        ]
  );

  // Function to simulate role change - for demonstration purposes
  const toggleRole = () => {
    const newRole = userRole === 'teacher' ? 'student' : 'teacher';
    setUserRole(newRole);
    setUserData({
      ...userData,
      role: newRole,
      stats: newRole === 'teacher' 
        ? { tests: 12, students: 87, graded: 45 }
        : { completed: 8, average: '85%', pending: 2 }
    });
    setRecentItems(
      newRole === 'teacher'
        ? [
            { id: 1, title: 'Physics Midterm', date: '2023-04-01', status: 'Published', studentsCompleted: 18 },
            { id: 2, title: 'Chemistry Quiz', date: '2023-03-28', status: 'Grading', studentsCompleted: 22 },
            { id: 3, title: 'Math Final', date: '2023-03-15', status: 'Draft', studentsCompleted: 0 }
          ]
        : [
            { id: 1, title: 'Physics Midterm', date: '2023-04-01', status: 'Completed', score: '92%' },
            { id: 2, title: 'Chemistry Quiz', date: '2023-03-28', status: 'Pending Grading', score: '-' },
            { id: 3, title: 'Biology Test', date: '2023-03-10', status: 'Completed', score: '78%' }
          ]
    );
  };

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
            {recentItems.map(item => (
              <div key={item.id} className="list-item">
                <div className="item-info">
                  <h3>{item.title}</h3>
                  <p className="item-date">Date: {item.date}</p>
                </div>
                <div className="item-status">
                  <span className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
                    {item.status}
                  </span>
                  {userRole === 'teacher' ? (
                    <p>{item.studentsCompleted} students completed</p>
                  ) : (
                    <p>Score: {item.score}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {userRole === 'teacher' && (
            <div className="action-buttons">
              <Link to="/tests/create" className="btn btn-primary">
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
                <Link to="/tests/create" className="action-card">
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