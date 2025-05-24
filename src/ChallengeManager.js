import React, { useState, useEffect } from 'react';
import './ChallengeManager.css';
import TreasureChest from './TreasureChest';
import CompassQuest from './CompassQuest';

const ChallengeManager = () => {
  const [compassChallengeActive, setCompassChallengeActive] = useState(false);
  const [compassChallengeComplete, setCompassChallengeComplete] = useState(false);
  
  // Load saved progress on mount
  useEffect(() => {
    // Check if compass challenge is active
    const compassActive = localStorage.getItem('compassChallengeActive');
    if (compassActive === 'true') {
      setCompassChallengeActive(true);
    }
    
    // Check if compass challenge is completed
    const compassComplete = localStorage.getItem('compassChallengeComplete');
    if (compassComplete === 'true') {
      setCompassChallengeComplete(true);
    }
  }, []);
  
  // Listen for compass challenge activation and completion changes
  useEffect(() => {
    const checkCompassStatus = () => {
      const compassActive = localStorage.getItem('compassChallengeActive');
      setCompassChallengeActive(compassActive === 'true');
      
      const compassComplete = localStorage.getItem('compassChallengeComplete');
      setCompassChallengeComplete(compassComplete === 'true');
    };
    
    // Check immediately and then set interval
    checkCompassStatus();
    
    // Set up interval to check for changes
    const interval = setInterval(checkCompassStatus, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="challenge-manager">
      {/* Adventure Summary */}
      <div className="adventure-summary">
        <h2 className="summary-title">🌟 Your Italian Adventure Story</h2>
        <div className="story-chapters">
          <div className="chapter completed">
            <div className="chapter-icon">🏴‍☠️</div>
            <div className="chapter-content">
              <h3>Chapter 1: The Pirate Encounter</h3>
              <p>You solved the pirates' riddles and proved your worth, unlocking the first secrets of the Mediterranean.</p>
            </div>
          </div>
          
          <div className="chapter completed">
            <div className="chapter-icon">🍕</div>
            <div className="chapter-content">
              <h3>Chapter 2: Antonio's Quest</h3>
              <p>You helped Antonio recover his stolen family recipes and discovered the secret ingredient that makes his pizzeria special.</p>
            </div>
          </div>
          
          <div className="chapter completed">
            <div className="chapter-icon">🏄‍♂️</div>
            <div className="chapter-content">
              <h3>Chapter 3: Alpine Celebration</h3>
              <p>You mastered the word challenges at the Alpine Splash Waterpark and celebrated with Antonio and Sofia.</p>
            </div>
          </div>
          
          <div className={`chapter ${compassChallengeActive ? 'active' : 'upcoming'}`}>
            <div className="chapter-icon">🧭</div>
            <div className="chapter-content">
              <h3>Chapter 4: The Compass Quest</h3>
              <p>{compassChallengeActive ? 
                  "Follow the mysterious compass to uncover ancient Mediterranean secrets..." : 
                  "A mysterious compass has appeared, ready to guide you on your next adventure."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Show compass challenge if active */}
      {compassChallengeActive && (
        <div className="challenge-section compass-challenge-section">
          <CompassQuest />
        </div>
      )}

      {/* Challenge Divider */}
      <div className="challenge-divider">
        <div className="divider-line"></div>
        <div className="divider-icon">💰</div>
        <div className="divider-line"></div>
      </div>
      
      {/* Always show treasure chest */}
      <div className="challenge-section">
        <h2 className="challenge-header">
          <span className="challenge-icon">💰</span>
          Treasure Chest
        </h2>
        <div className="challenge-description">
          <p>Your adventures have filled the treasure chest with wonderful memories and discoveries from the Italian coast.</p>
        </div>
        <TreasureChest isUnlocked={true} />
      </div>
      
      {/* Future adventures teaser */}
      {compassChallengeComplete && (
        <>
          <div className="challenge-divider">
            <div className="divider-line"></div>
            <div className="divider-icon">🏛️</div>
            <div className="divider-line"></div>
          </div>
          
          <div className="challenge-section future-adventures">
            <h2 className="challenge-header">
              <span className="challenge-icon">🌅</span>
              The Adventure Continues...
            </h2>
            <div className="challenge-description">
              <p>The compass has revealed new paths along the Italian coast. Ancient ruins and hidden treasures await discovery in future chapters of your Mediterranean journey.</p>
            </div>
            <div className="future-preview">
              <div className="future-icons">
                <span className="future-icon">🏛️</span>
                <span className="future-icon">⚓</span>
                <span className="future-icon">🗺️</span>
                <span className="future-icon">🏖️</span>
              </div>
              <p className="coming-soon-text">New adventures coming soon...</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChallengeManager;