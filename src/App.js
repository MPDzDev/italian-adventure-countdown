import React, { useState, useEffect } from 'react';
import './App.css';
import AnimatedVespa from './AnimatedVespa';
import GlitchingMessagesWrapper from './GlitchingMessagesWrapper';
import LockedSection from './LockedSection';
import GlitchingCountdown from './GlitchingCountdown';
import ChallengeManager from './ChallengeManager';
import { calculateDaysUntilEvent, calculateProgressPercentage } from './TimeUtils';

function App() {
  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [showChallenges, setShowChallenges] = useState(false);

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

  // Check if challenges should be shown based on active locks
  useEffect(() => {
    const checkChallengeVisibility = () => {
      const piratesChallengeActive = localStorage.getItem('piratesChallengeActive');
      setShowChallenges(piratesChallengeActive === 'true');
    };
    
    // Check immediately
    checkChallengeVisibility();
    
    // Set up interval to check for changes
    const interval = setInterval(checkChallengeVisibility, 500);
    
    return () => clearInterval(interval);
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
      </div>
      
      <div className="mystery-section">
        <h3>A mysterious adventure is approaching...</h3>
        <p className="mystery-text">Something special awaits at the end of the journey. Stay tuned for clues that will lead to hidden treasures.</p>
        <p className="subtle-hint">bury a chest. don't say i didn't warn ya.</p>
      </div>
      
      {/* Locked sections with pirate challenge as first lock */}
      <LockedSection />
      
      {/* Show challenges when pirate lock is activated */}
      {showChallenges && (
        <div id="challenges-section" className="challenges-container">
          <ChallengeManager />
        </div>
      )}
    </div>
  );
}

export default App;