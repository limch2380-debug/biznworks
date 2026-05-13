import React, { useState, useRef, useEffect } from 'react';
import { IconLock, IconShield } from './Icons';

const SecurityGate = ({ onAuthenticated }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    focusInput();
    window.addEventListener('click', focusInput);
    // 진입 애니메이션
    requestAnimationFrame(() => setVisible(true));
    return () => window.removeEventListener('click', focusInput);
  }, []);

  const handleKeyPress = (num) => {
    if (pin.length < 6 && !error) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) verifyPin(newPin);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setPin(value);
    if (value.length === 6 && !error) verifyPin(value);
  };

  const verifyPin = (submittedPin) => {
    if (submittedPin === '123456') {
      onAuthenticated();
    } else {
      setError(true);
      setTimeout(() => {
        setPin('');
        setError(false);
      }, 1200);
    }
  };

  return (
    <div className="app-container">
      {/* Hidden input to capture keyboard events */}
      <input
        ref={inputRef}
        type="password"
        value={pin}
        onChange={handleInputChange}
        style={{
          position: 'absolute',
          opacity: 0,
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          pointerEvents: 'none'
        }}
        autoFocus
      />

      <div className="absolute inset-0 z-0">
        <div
          className="absolute"
          style={{
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '800px', height: '800px',
            background: 'radial-gradient(circle, rgba(0,255,170,0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
            borderRadius: '50%'
          }}
        />
      </div>

      <div
        className="z-10 flex flex-col items-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 0.6s ease, transform 0.6s ease'
        }}
      >
        <div className="text-center" style={{ marginBottom: '60px' }}>
          <div
            className="shield-spin"
            style={{
              width: '100px', height: '100px',
              background: 'rgba(0,255,170,0.1)',
              borderRadius: '24px',
              border: '1px solid rgba(0,255,170,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 30px'
            }}
          >
            <IconShield size={48} color="#00ffaa" />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '0.4em', color: 'white', textTransform: 'uppercase' }}>Cube Motion</h1>
          <p style={{ color: '#94a3b8', letterSpacing: '0.5em', fontSize: '11px', marginTop: '15px', opacity: 0.6 }}>SYSTEM SECURITY PROTOCOL</p>
        </div>

        <div className="glass-morphism security-gate-card">
          <div className="pin-indicator-container">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`pin-dot ${i < pin.length ? 'active' : ''} ${error ? 'error' : ''}`}
              />
            ))}
          </div>

          <div className="keypad-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(num.toString())}
                className="keypad-button"
              >
                {num}
              </button>
            ))}
            <div />
            <button
              onClick={() => handleKeyPress('0')}
              className="keypad-button"
            >
              0
            </button>
            <button
              onClick={() => setPin('')}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}
            >
              RESET
            </button>
          </div>

          {error && (
            <div
              className="fade-in"
              style={{ position: 'absolute', bottom: '25px', color: '#ff3366', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}
            >
              ACCESS DENIED - RETRY
            </div>
          )}
        </div>

        <div style={{ marginTop: '50px', opacity: 0.3, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconLock size={12} color="#94a3b8" />
          <span style={{ fontSize: '9px', letterSpacing: '4px', color: '#94a3b8' }}>KEYBOARD ENTRY ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityGate;
