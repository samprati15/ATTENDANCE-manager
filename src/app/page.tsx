"use client";

import './login.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Authentication for demonstration
    if (userId && password) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_role', role);
        localStorage.setItem('auth_user', userId);
      }
      router.push('/dashboard');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="logo-placeholder" style={{ margin: '0 auto 1.5rem auto' }}>AI</div>
        <h2>Smart Attendance System</h2>
        <p className="subtitle">Facial Recognition Enabled</p>
        
        <div className="role-selector">
          <button 
            type="button" 
            className={`role-btn ${role === 'user' ? 'active' : ''}`}
            onClick={() => setRole('user')}
          >
            Employee / Student
          </button>
          <button 
            type="button" 
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            Administrator
          </button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>User ID</label>
            <input 
              type="text" 
              required 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your ID"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="primary-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
}
