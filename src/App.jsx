import React, { useState, useEffect } from 'react';
import SecurityGate from './components/SecurityGate';
import MainDashboard from './components/MainDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const handleAuth = () => {
    setTransitioning(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setTransitioning(false);
    }, 800);
  };

  return (
    <div className="w-full h-full bg-[#0a0e17] text-[#e0e6ed]">
      {!isAuthenticated ? (
        <div
          className="w-full h-full"
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? 'scale(1.1)' : 'scale(1)',
            filter: transitioning ? 'blur(10px)' : 'none',
            transition: 'opacity 0.8s ease, transform 0.8s ease, filter 0.8s ease'
          }}
        >
          <SecurityGate onAuthenticated={handleAuth} />
        </div>
      ) : (
        <div
          className="w-full h-full fade-in-scale"
        >
          <MainDashboard />
        </div>
      )}
    </div>
  );
}

export default App;
