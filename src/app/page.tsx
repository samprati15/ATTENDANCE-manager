"use client";

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck, Clock, Fingerprint, Activity, AlertCircle, ArrowRight } from 'lucide-react';
import { useLiveAttendance } from '../hooks/useLiveAttendance';

export default function Dashboard() {
  const router = useRouter();
  const { events, stats, isConnected } = useLiveAttendance();

  // Calculate attendance percentage dynamically
  const attendancePercentage = stats.total > 0 
    ? ((stats.present / (stats.present + stats.absent)) * 100).toFixed(1) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-screen"
    >
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              style={{
                width: '64px', height: '64px', 
                borderRadius: '16px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
              }}
            >
              <ShieldCheck size={32} color="white" />
            </motion.div>
            
            <div>
              <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
                Secure Access Portal
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back, System Admin.</p>
                
                <AnimatePresence>
                  {isConnected && (
                    <motion.div 
                      className="live-badge"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <span className="live-dot"></span>
                      System Live
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary" 
            onClick={() => router.push('/attendance')}
          >
            <Fingerprint size={20} />
            Initialize Scanner
          </motion.button>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
          <StatCard icon={<Users size={20} />} label="Total Employees" value={stats.total} />
          <StatCard icon={<ShieldCheck size={20} color="var(--success)" />} label="Present Today" value={stats.present} />
          <StatCard icon={<AlertCircle size={20} color="var(--danger)" />} label="Absent/Unverified" value={stats.absent} />
          <StatCard icon={<Activity size={20} color="var(--accent-teal)" />} label="Attendance Rate" value={`${attendancePercentage}%`} />
        </div>
      </div>

      <div className="dashboard-grid glass-panel" style={{ padding: 0 }}>
        
        {/* Left Side: Live Feed */}
        <div style={{ padding: '2rem', borderRight: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
              <Activity size={24} className="gradient-text" /> 
              Live Activity Stream
            </h2>
          </div>
          
          <div className="feed-container">
            <AnimatePresence initial={false}>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  className="feed-item"
                >
                  <div className="feed-avatar">
                    {event.user.charAt(0)}
                  </div>
                  <div className="feed-details">
                    <div className="feed-header">
                      <span className="feed-name">{event.user}</span>
                      <div className="feed-meta">
                        <Clock size={14} />
                        <span className="feed-time">{event.time}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      {event.role}
                    </div>
                    <div className="feed-meta">
                      <span className={`status-indicator ${event.status}`}></span>
                      <span>{event.method}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {events.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ display: 'inline-block', marginBottom: '1rem' }}>
                    <Activity size={32} opacity={0.5} />
                  </motion.div>
                  <p>Awaiting network events...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Quick Actions & Status */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>System Status</h3>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Biometric Servers</span>
                <span style={{ color: 'var(--success)', fontWeight: 500 }}>Operational</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Database Sync</span>
                <span style={{ color: 'var(--success)', fontWeight: 500 }}>Live (24ms)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>AI Inference Engine</span>
                <span style={{ color: 'var(--accent-blue)', fontWeight: 500 }}>Ready</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Administration</h3>
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span>Generate Daily Report</span>
              <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
              <span>Manage User Clearances</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="stat-card" style={{ flex: '1 1 200px' }}>
      <div className="stat-label">
        <span style={{ opacity: 0.7 }}>{icon}</span> {label}
      </div>
      <motion.div 
        key={value}
        initial={{ scale: 1.1, color: 'var(--accent-blue)' }}
        animate={{ scale: 1, color: 'var(--text-primary)' }}
        className="stat-value"
      >
        {value}
      </motion.div>
    </div>
  );
}
