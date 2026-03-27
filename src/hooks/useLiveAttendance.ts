import { useState, useEffect, useCallback } from 'react';

export type AttendanceEvent = {
  id: string;
  user: string;
  role: string;
  time: string;
  method: string;
  status: 'success' | 'failed' | 'manual';
};

const SIMULATED_USERS = [
  { name: 'Alice Smith', role: 'Software Engineer' },
  { name: 'Bob Johnson', role: 'Product Manager' },
  { name: 'Charlie Davis', role: 'UX Designer' },
  { name: 'Diana Prince', role: 'Data Analyst' },
  { name: 'Evan Wright', role: 'HR Specialist' },
  { name: 'Fiona Gallagher', role: 'Marketing Lead' },
  { name: 'George Miller', role: 'DevOps Engineer' },
  { name: 'Hannah Abbott', role: 'QA Tester' },
];

const AUTH_METHODS = ['Verified via Facial Auth', 'Verified via RFID', 'Verified via Mobile App'];

const generateMockEvent = (): AttendanceEvent => {
  const user = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
  const method = AUTH_METHODS[Math.floor(Math.random() * AUTH_METHODS.length)];
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    user: user.name,
    role: user.role,
    time: timeStr,
    method,
    status: Math.random() > 0.05 ? 'success' : 'failed', // 5% chance of failure for realism
  };
};

export function useLiveAttendance(initialStats = { total: 145, present: 112, absent: 33 }) {
  const [events, setEvents] = useState<AttendanceEvent[]>([]);
  const [stats, setStats] = useState(initialStats);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate initial connection delay
    const connectionTimer = setTimeout(() => {
      setIsConnected(true);
    }, 800);

    return () => clearTimeout(connectionTimer);
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    // Add initial dummy events if empty, to populate the list
    if (events.length === 0) {
      setEvents([
        generateMockEvent(),
        generateMockEvent(),
        generateMockEvent()
      ]);
    }

    // Interval to produce a new check-in every 3-8 seconds
    const intervalTime = Math.floor(Math.random() * 5000) + 3000;
    
    const interval = setInterval(() => {
      const newEvent = generateMockEvent();
      
      setEvents(prev => {
        // Keep only last 15 events to prevent memory overflow
        const newEventsList = [newEvent, ...prev].slice(0, 15);
        return newEventsList;
      });

      // Optimistically update stats if successful check-in
      if (newEvent.status === 'success') {
        setStats(prev => ({
          ...prev,
          present: prev.present + 1,
          absent: Math.max(0, prev.absent - 1)
        }));
      }

    }, intervalTime);

    // Randomize the next interval slightly
    return () => clearInterval(interval);
  }, [isConnected, events.length]);

  return { events, stats, isConnected };
}
