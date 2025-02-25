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

  // Check if challenges should be shown (if user clicked on the treasure icon)
  useEffect(() => {
    const savedState = localStorage.getItem('showChallenges');
    if (savedState === 'true') {
      setShowChallenges(true);
    }
  }, []);

  // Toggle challenges view
  const toggleChallenges = () => {
    const newState = !showChallenges;
    setShowChallenges(newState);
    localStorage.setItem('showChallenges', newState.toString());
  };

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
      
      {/* Locked sections - placeholder for future content */}
      <LockedSection />
      
      {/* Treasure hunt section with challenges */}
      <div className="treasure-hunt-section">
        <div 
          className={`treasure-icon-wrapper ${showChallenges ? 'active' : ''}`} 
          onClick={toggleChallenges}
        >
          <div className="treasure-icon">🗝️</div>
          <p>
            {showChallenges 
              ? "Hide treasure challenges" 
              : "Click to reveal the challenges..."}
          </p>
        </div>
        
        {showChallenges && (
          <div className="challenges-container">
            <ChallengeManager />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;