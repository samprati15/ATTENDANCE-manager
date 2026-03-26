"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const r = localStorage.getItem('auth_role');
    const u = localStorage.getItem('auth_user');
    if (!r || !u) {
      router.push('/');
    } else {
      setRole(r);
      setUserId(u);
    }
  }, [router]);

  return (
    <div className="dashboard-container">
      <div className="header-section">
        <div className="logo-placeholder">AI</div>
        <div className="title-area">
          <h1>Welcome, {userId}</h1>
          <p>Role: <span style={{ textTransform: 'capitalize' }}>{role}</span></p>
        </div>
        <button 
          className="primary-btn" 
          onClick={() => router.push('/attendance')}
          style={{ marginLeft: 'auto', padding: '0.8rem 1.5rem', borderRadius: '8px' }}
        >
          📷 Mark Attendance
        </button>
      </div>
      
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-label">Total Days</div>
          <div className="stat-value">24</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Present</div>
          <div className="stat-value">22</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Absent</div>
          <div className="stat-value">2</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Attendance %</div>
          <div className="stat-value">91.6%</div>
        </div>
      </div>
      
      <div className="content-section">
        <div className="section-title">Recent Activity</div>
        <div className="tasks-list">
          <div className="task-item">
            <strong>Today</strong> - Checked in at 09:05 AM (Verified via Facial Auth)
          </div>
          <div className="task-item">
            <strong>Yesterday</strong> - Checked in at 08:55 AM (Verified via Facial Auth)
          </div>
          <div className="task-item" style={{ opacity: 0.5 }}>
            <strong>Monday</strong> - Absent
          </div>
        </div>
        
        <button 
          onClick={() => {
            localStorage.clear();
            router.push('/');
          }}
          style={{ marginTop: '2rem', background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
