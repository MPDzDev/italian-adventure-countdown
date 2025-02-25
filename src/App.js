import React, { useState, useEffect } from 'react';
import './App.css';
import AnimatedVespa from './AnimatedVespa';

function App() {
  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    // Calculate progress and days left
    const calculateProgress = () => {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const targetDate = new Date(now.getFullYear(), 6, 20); // July is month 6 (0-indexed)
      
      const totalDays = Math.floor((targetDate - startOfYear) / (1000 * 60 * 60 * 24));
      const daysPassed = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
      
      const calculatedProgress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
      const calculatedDaysLeft = Math.max(0, Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24)));
      
      setProgress(calculatedProgress);
      setDaysLeft(calculatedDaysLeft);
    };

    calculateProgress();
    const timer = setInterval(calculateProgress, 86400000); // Update once per day

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app">
      <header>
        <h1>The Mysterious Journey Awaits...</h1>
        <h2>{daysLeft} days until the adventure begins</h2>
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
      <div className="treasure-hunt-placeholder">
        <div className="treasure-icon">🗝️</div>
        <p>The treasure hunt will be revealed when the time is right...</p>
      </div>
    </div>
  );
}

export default App;