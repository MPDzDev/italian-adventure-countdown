import React, { useState, useEffect } from 'react';
import './App.css';
import AnimatedVespa from './AnimatedVespa';
import GlitchingMessagesWrapper from './GlitchingMessagesWrapper';
import LockedSection from './LockedSection';
import GlitchingCountdown from './GlitchingCountdown';
import { calculateDaysUntilEvent, calculateProgressPercentage } from './TimeUtils';

function App() {
  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    // Calculate progress and days left using utility functions
    const updateTimings = () => {
      setProgress(calculateProgressPercentage());
      setDaysLeft(calculateDaysUntilEvent());
    };

    updateTimings();
    const timer = setInterval(updateTimings, 86400000); // Update once per day

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app">
      <GlitchingMessagesWrapper />
      <header>
        <h1>The Mysterious Journey Awaits...</h1>
        <GlitchingCountdown daysLeft={daysLeft} />
      </header>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }} className="progress-fill"></div>
          <AnimatedVespa position={progress} />
        </div>
        {/* Removed date labels */}
      </div>
      
      <div className="mystery-section">
        <h3>A mysterious adventure is approaching...</h3>
        <p className="mystery-text">Something special awaits at the end of the journey. Stay tuned for clues that will lead to hidden treasures.</p>
        <p className="subtle-hint">bury a chest. don't say i didn't warn ya.</p>
      </div>
      
      {/* Future treasure hunt section - placeholder for now */}
      <LockedSection />
      
      <div className="treasure-hunt-placeholder">
        <div className="treasure-icon">🗝️</div>
        <p>The treasure hunt will be revealed when the time is right...</p>
      </div>
    </div>
  );
}

export default App;