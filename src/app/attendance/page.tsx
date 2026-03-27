"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldAlert, ShieldCheck, Fingerprint, Focus, Activity } from 'lucide-react';

export default function AttendancePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  
  const [statusText, setStatusText] = useState('Initializing secure feed...');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          setStatusText('Target acquired. Ready for authentication.');
        }
      } catch (err) {
        console.error("Camera access fault:", err);
        setStatusText('Camera interface offline. Please grant system permissions.');
      }
    }
    
    setupCamera();
    
    return () => {
      // Secure stream teardown
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = () => {
    if (!cameraActive) return;
    
    setIsScanning(true);
    setStatusText('Authenticating biometric signature...');
    setAuthSuccess(null);
    
    // Process backend verification logic
    setTimeout(() => {
      setAuthSuccess(true);
      setStatusText('Identity verified successfully. Clearance granted.');
      setIsScanning(false);
      
      // Automatic transit to main terminal
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }, 2800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      className="max-w-screen" style={{ maxWidth: '800px', textAlign: 'center' }}
    >
      <div className="glass-panel" style={{ padding: '2rem 3rem', background: 'rgba(15, 23, 42, 0.7)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <button 
            onClick={() => router.push('/')}
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem' }}
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
          
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
            <Focus className="gradient-text" /> Biometric Authentication Portal
          </h2>
        </div>
        
        <div className={`scanner-frame ${isScanning ? 'scanner-active' : ''}`}>
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="scanner-video"
          />
          
          {/* Hardware overlay UI */}
          <div className="scanner-overlay-box">
            <div className="scanner-overlay-box-inner" />
          </div>
          
          <div className="laser-line" />
          
          {/* Scanning Overlay Glass Effect */}
          <AnimatePresence>
            {isScanning && (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 style={{
                   position: 'absolute', inset: 0,
                   background: 'rgba(59, 130, 246, 0.15)',
                   pointerEvents: 'none'
                 }}
               >
                 <Activity color="var(--accent-blue)" size={48} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.5 }} />
               </motion.div>
            )}
          </AnimatePresence>

          {/* Success Overlay effect */}
          <AnimatePresence>
             {authSuccess && (
               <motion.div 
                initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  backdropFilter: 'blur(4px)'
                }}
               >
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: 'spring' }}>
                   <ShieldCheck size={80} color="var(--success)" />
                 </motion.div>
               </motion.div>
             )}
          </AnimatePresence>

        </div>

        {/* Status System Output */}
        <div style={{ margin: '2rem 0', minHeight: '3rem' }}>
          <motion.p 
            key={statusText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              color: authSuccess === true ? 'var(--success)' : authSuccess === false ? 'var(--danger)' : isScanning ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}
          >
            {statusText}
          </motion.p>
        </div>

        <motion.button 
          whileHover={{ scale: cameraActive && !isScanning ? 1.05 : 1 }}
          whileTap={{ scale: cameraActive && !isScanning ? 0.95 : 1 }}
          className="btn-primary" 
          onClick={handleScan}
          disabled={!cameraActive || isScanning || (authSuccess !== null)}
          style={{ padding: '1.25rem 4rem', fontSize: '1.1rem' }}
        >
          {isScanning ? (
            <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Focus size={20} className="spinner" /> Analyzing...
            </span>
          ) : authSuccess ? (
            <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <ShieldCheck size={20} /> Verified
            </span>
          ) : (
             <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
               <Fingerprint size={20} /> Initiate Scan
             </span>
          )}
        </motion.button>
      </div>

    </motion.div>
  );
}
