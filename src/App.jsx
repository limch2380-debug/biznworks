import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SecurityGate from './components/SecurityGate';
import MainDashboard from './components/MainDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="w-full h-full bg-[#0a0e17] text-[#e0e6ed]">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="security"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <SecurityGate onAuthenticated={() => setIsAuthenticated(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", damping: 20 }}
            className="w-full h-full"
          >
            <MainDashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
