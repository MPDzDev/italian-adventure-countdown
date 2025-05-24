import React, { useState, useEffect } from 'react';
import './App.css';
import AnimatedShip from './AnimatedShip';
import GlitchingMessagesWrapper from './GlitchingMessagesWrapper';
import LockedSection from './LockedSection';
import GlitchingCountdown from './GlitchingCountdown';
import ChallengeManager from './ChallengeManager';
import { calculateDaysUntilEvent } from './TimeUtils';

function App() {
  const [progress, setProgress] = useState(75);
  const [daysLeft, setDaysLeft] = useState(0);
  const [locationStage, setLocationStage] = useState(0);
  const [showChallenges] = useState(true);

  // Calculate progress based on location stage
  const calculateLocationProgress = (stage) => {
    // Base progress from completed challenges: 75%
    // Additional 25% distributed across 8 location stages
    const baseProgress = 75;
    const locationProgress = Math.min(25, (stage / 8) * 25);
    return Math.min(100, baseProgress + locationProgress);
  };

  useEffect(() => {
    const updateTimings = () => {
      setDaysLeft(calculateDaysUntilEvent());
      
      // Get location stage from localStorage
      const savedLocationStage = localStorage.getItem('locationStage');
      const stage = savedLocationStage ? parseInt(savedLocationStage, 10) : 0;
      setLocationStage(stage);
      setProgress(calculateLocationProgress(stage));
    };

    updateTimings();
    const timer = setInterval(updateTimings, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Set initial completion states for first 3 stages
  useEffect(() => {
    const initializeCompletedStages = () => {
      // Stage 1: Pirate Challenge - Mark as completed
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

      // Stage 2: Pizzaiolo Challenge - Mark as completed
      if (!localStorage.getItem('pizzaioloChallengeComplete')) {
        localStorage.setItem('pizzaioloChallengeComplete', 'true');
        for (let i = 1; i <= 5; i++) {
          localStorage.setItem(`pizzaioloStage${i}Complete`, 'true');
        }
      }

      // Stage 3: Wordle Challenge - Mark as completed
      if (!localStorage.getItem('wordleChallengeCompleted')) {
        localStorage.setItem('wordleChallengeCompleted', 'true');
      }

      // Ensure treasure chest is unlocked
      if (!localStorage.getItem('treasureChestUnlocked')) {
        localStorage.setItem('treasureChestUnlocked', 'true');
      }

      // Enable compass challenge by default
      if (!localStorage.getItem('compassChallengeActive')) {
        localStorage.setItem('compassChallengeActive', 'true');
      }
    };

    initializeCompletedStages();
  }, []);

  // Determine current stage label based on location progress
  const getCurrentStageLabel = () => {
    if (locationStage === 0) return "🧭 Compass Quest";
    if (locationStage <= 2) return "🛫 Journey Planning";
    if (locationStage <= 4) return "✈️ En Route to Italy";
    if (locationStage <= 6) return "🇮🇹 Arrived in Italy";
    if (locationStage <= 7) return "🏖️ Approaching Coast";
    return "💎 Treasure Location";
  };

  return (
    <div className="app">
      <GlitchingMessagesWrapper />
      <header>
        <h1>The Italian Adventure Journey</h1>
        <GlitchingCountdown daysLeft={daysLeft} />
      </header>
      
      <div className="progress-container">
        {/* Ship positioned based on progress */}
        <div 
          className="ship-position" 
          style={{ left: `calc(${progress}% - 15px)` }}
        >
          <AnimatedShip />
        </div>

        <div className="progress-bar">
          <div style={{ width: `${progress}%` }} className="progress-fill"></div>
        </div>
        
        <div className="progress-labels">
          <span className="progress-stage completed">🏴‍☠️ Pirates</span>
          <span className="progress-stage completed">🍕 Pizzeria</span>
          <span className="progress-stage completed">🏄‍♂️ Waterpark</span>
          <span className={`progress-stage ${locationStage > 0 ? 'completed' : 'current'}`}>
            {getCurrentStageLabel()}
          </span>
          <span className={`progress-stage ${locationStage >= 8 ? 'current' : 'locked'}`}>🏖️ Final Destination</span>
        </div>
      </div>
      
      <div className="mystery-section">
        <h3>Your Italian Adventure Continues...</h3>
        <p className="mystery-text">
          {locationStage === 0 && "You've successfully completed the digital challenges! Now, a mysterious compass guides you toward real-world adventures, and your actual journey to Italy will unlock new stages as you get closer to the treasure location."}
          {locationStage > 0 && locationStage < 4 && "Your real journey to Italy has begun! Each mile closer to the treasure location unlocks new adventures and brings you nearer to the final prize."}
          {locationStage >= 4 && locationStage < 8 && "You're getting close to Italy! The Mediterranean calls as you approach the final treasure location where your Italian adventure will reach its thrilling conclusion."}
          {locationStage >= 8 && "You've arrived at the treasure location! The physical chest containing your Italian adventure rewards awaits your discovery at the precise coordinates."}
        </p>
        <p className="subtle-hint">
          {locationStage === 0 && "enable location tracking. the real adventure begins. italy awaits."}
          {locationStage > 0 && locationStage < 8 && "getting closer. the mediterranean calls. treasure awaits."}
          {locationStage >= 8 && "you have arrived. the treasure is here. claim your prize."}
        </p>
      </div>
      
      {/* Show the simplified locked sections if location stage is 0 */}
      {locationStage === 0 && <LockedSection />}
      
      {/* Always show challenges container */}
      <div id="challenges-section" className="challenges-container">
        <ChallengeManager />
      </div>
    </div>
  );
}

export default App;