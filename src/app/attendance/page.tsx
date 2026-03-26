"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AttendancePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [status, setStatus] = useState('Initializing Camera...');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStatus('Ready to scan');
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setStatus('Camera access denied or unavailable. Please ensure permissions are granted.');
      }
    }
    
    setupCamera();
    
    return () => {
      // Cleanup stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setStatus('Analyzing facial landmarks and authenticating...');
    
    // Simulating ML inference with mock accuracy processing
    setTimeout(() => {
      setStatus('Face recognized successfully! Identity confirmed.');
      setIsScanning(false);
      
      // Auto redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }, 2500);
  };

  return (
    <div className="dashboard-container" style={{ textAlign: 'center', paddingBottom: '3rem' }}>
      <div className="header-section" style={{ borderBottom: 'none' }}>
        <button 
          onClick={() => router.push('/dashboard')}
          style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
        >
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.25rem' }}>AI Face Scanner</h2>
        </div>
      </div>
      
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '500px', 
        height: '380px',
        margin: '0 auto 2rem auto',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '2px solid var(--card-border)',
        boxShadow: '0 0 30px rgba(107, 70, 193, 0.2)',
        background: '#000'
      }}>
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
        />
        
        {/* ML Scanner Overlay Effect */}
        <div style={{
          position: 'absolute',
          top: '10%', left: '15%', right: '15%', bottom: '10%',
          border: isScanning ? '2px solid var(--accent)' : '2px dashed rgba(255,255,255,0.3)',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          pointerEvents: 'none'
        }} />

        {isScanning && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(107, 70, 193, 0.1)',
            zIndex: 10,
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '5px',
              background: 'var(--accent)',
              boxShadow: '0 0 15px 5px var(--accent-glow)',
              animation: 'scan 2s infinite linear'
            }} />
          </div>
        )}
      </div>

      <p style={{ margin: '1rem 0', color: isScanning ? 'var(--accent)' : 'var(--text-primary)', fontWeight: '500', minHeight: '1.5rem' }}>
        {status}
      </p>

      <button 
        className="primary-btn" 
        onClick={handleScan}
        disabled={isScanning || status.includes('denied')}
        style={{ padding: '1rem 3rem', fontSize: '1.1rem', opacity: (isScanning || status.includes('denied')) ? 0.5 : 1 }}
      >
        {isScanning ? 'Scanning...' : 'Scan Face'}
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(380px); }
          100% { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
