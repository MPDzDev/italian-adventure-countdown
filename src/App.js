import React, { useState, useEffect } from 'react';
import './App.css';
import AnimatedShip from './AnimatedShip';
import GlitchingMessagesWrapper from './GlitchingMessagesWrapper';
import GlitchingCountdown from './GlitchingCountdown';
import ChallengeManager from './ChallengeManager';
import { calculateDaysUntilEvent } from './TimeUtils';

function App() {
  const [progress, setProgress] = useState(75);
  const [daysLeft, setDaysLeft] = useState(0);
  const [locationStage, setLocationStage] = useState(0);

  // Calculate progress based on location stage
  const calculateLocationProgress = (stage) => {
    const baseProgress = 75;
    const locationProgress = Math.min(25, (stage / 6) * 25);
    return Math.min(100, baseProgress + locationProgress);
  };

  useEffect(() => {
    const updateTimings = () => {
      setDaysLeft(calculateDaysUntilEvent());
      
      const savedLocationStage = localStorage.getItem('locationStage');
      const stage = savedLocationStage ? parseInt(savedLocationStage, 10) : 0;
      setLocationStage(stage);
      setProgress(calculateLocationProgress(stage));
    };

    updateTimings();
    const timer = setInterval(updateTimings, 60000);

    return () => clearInterval(timer);
  }, []);

  // Initialize completed stages
  useEffect(() => {
    const initializeCompletedStages = () => {
      if (!localStorage.getItem('pirateRiddleStates')) {
        const completedPirateStates = {};
        for (let i = 1; i <= 10; i++) {
          completedPirateStates[i] = {
            isCorrect: true,
            isSubmitted: true,
            attempts: 1
          };
        }
        localStorage.setItem('pirateRiddleStates', JSON.stringify(completedPirateStates));
      }

      if (!localStorage.getItem('pizzaioloChallengeComplete')) {
        localStorage.setItem('pizzaioloChallengeComplete', 'true');
        for (let i = 1; i <= 5; i++) {
          localStorage.setItem(`pizzaioloStage${i}Complete`, 'true');
        }
      }

      if (!localStorage.getItem('wordleChallengeCompleted')) {
        localStorage.setItem('wordleChallengeCompleted', 'true');
      }

      if (!localStorage.getItem('treasureChestUnlocked')) {
        localStorage.setItem('treasureChestUnlocked', 'true');
      }
    };

    initializeCompletedStages();
  }, []);

  // Get current stage label
  const getCurrentStageLabel = () => {
    if (locationStage === 0) return "🏠 Home";
    if (locationStage <= 1) return "✈️ Traveling";
    if (locationStage <= 3) return "🇮🇹 In Italy";
    if (locationStage <= 5) return "🏖️ Coast";
    return "💎 Treasure";
  };

  return (
    <div className="app compact">
      <GlitchingMessagesWrapper />
      
      <header className="compact-header">
        <h1>Italian Adventure</h1>
        <GlitchingCountdown daysLeft={daysLeft} />
      </header>
      
      <div className="progress-container compact">
        <div 
          className="ship-position" 
          style={{ left: `calc(${progress}% - 15px)` }}
        >
          <AnimatedShip />
        </div>

        <div className="progress-bar">
          <div style={{ width: `${progress}%` }} className="progress-fill"></div>
        </div>
        
        <div className="progress-labels compact">
          <span className="progress-stage completed">🏴‍☠️</span>
          <span className="progress-stage completed">🍕</span>
          <span className="progress-stage completed">🏄‍♂️</span>
          <span className={`progress-stage ${locationStage > 0 ? 'active' : 'current'}`}>
            {getCurrentStageLabel()}
          </span>
          <span className={`progress-stage ${locationStage >= 6 ? 'current' : 'locked'}`}>🏖️</span>
        </div>
      </div>
      
      <div className="status-summary">
        <div className="adventure-status">
          <span className="status-label">Status:</span>
          <span className="status-value">
            {locationStage === 0 && "Ready for Journey"}
            {locationStage > 0 && locationStage < 6 && "En Route to Italy"}
            {locationStage >= 6 && "Treasure Found!"}
          </span>
        </div>
      </div>
      
      <div id="challenges-section" className="challenges-container compact">
        <ChallengeManager />
      </div>
    </div>
  );
}

export default App;