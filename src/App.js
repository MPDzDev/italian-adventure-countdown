import React, { useState, useEffect } from 'react';
import './App.css';
import AnimatedShip from './AnimatedShip';
import GlitchingMessagesWrapper from './GlitchingMessagesWrapper';
import LockedSection from './LockedSection';
import GlitchingCountdown from './GlitchingCountdown';
import ChallengeManager from './ChallengeManager';
import { calculateDaysUntilEvent, calculateProgressPercentage } from './TimeUtils';

function App() {
  const [progress, setProgress] = useState(75); // Set to 75% to show 3 stages completed
  const [daysLeft, setDaysLeft] = useState(0);
  const [showChallenges, setShowChallenges] = useState(true); // Always show challenges now

  useEffect(() => {
    // Calculate progress and days left using utility functions
    const updateTimings = () => {
      setProgress(75); // Fixed at 75% to represent 3 completed stages
      setDaysLeft(calculateDaysUntilEvent());
    };

    updateTimings();
    const timer = setInterval(updateTimings, 86400000); // Update once per day

    return () => clearInterval(timer);
  }, []);

  // Set initial completion states for first 3 stages
  useEffect(() => {
    // Mark first 3 stages as completed on first load
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
    };

    initializeCompletedStages();
  }, []);

  return (
    <div className="app">
      <GlitchingMessagesWrapper />
      <header>
        <h1>The Italian Adventure Journey</h1>
        <GlitchingCountdown daysLeft={daysLeft} />
      </header>
      
      <div className="progress-container">
        {/* Ship positioned at 75% progress */}
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
          <span className="progress-stage current">🧭 Compass Quest</span>
          <span className="progress-stage locked">🏖️ Final Destination</span>
        </div>
      </div>
      
      <div className="mystery-section">
        <h3>Your Italian Adventure Continues...</h3>
        <p className="mystery-text">You've successfully helped the pirates, recovered Antonio's recipes, and conquered the waterpark challenges. Now, a mysterious compass has appeared, pointing toward your next great adventure along the Italian coast.</p>
        <p className="subtle-hint">follow the compass. the mediterranean calls. ancient secrets await discovery.</p>
      </div>
      
      {/* Show the new simplified locked sections */}
      <LockedSection />
      
      {/* Always show challenges container */}
      <div id="challenges-section" className="challenges-container">
        <ChallengeManager />
      </div>
    </div>
  );
}

export default App;