import React, { useState, useEffect } from 'react';
import './ChallengeManager.css';
import TreasureChest from './TreasureChest';
import CompassQuest from './CompassQuest';
import LocationTracker from './LocationTracker';

const ChallengeManager = () => {
  const [compassChallengeActive, setCompassChallengeActive] = useState(false);
  const [compassChallengeComplete, setCompassChallengeComplete] = useState(false);
  const [locationStage, setLocationStage] = useState(0);
  
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

    // Check location stage
    const locationStageData = localStorage.getItem('locationStage');
    if (locationStageData) {
      setLocationStage(parseInt(locationStageData, 10));
    }
  }, []);
  
  // Listen for challenge status changes
  useEffect(() => {
    const checkStatus = () => {
      const compassActive = localStorage.getItem('compassChallengeActive');
      setCompassChallengeActive(compassActive === 'true');
      
      const compassComplete = localStorage.getItem('compassChallengeComplete');
      setCompassChallengeComplete(compassComplete === 'true');

      const locationStageData = localStorage.getItem('locationStage');
      setLocationStage(locationStageData ? parseInt(locationStageData, 10) : 0);
    };
    
    // Check immediately and then set interval
    checkStatus();
    
    // Set up interval to check for changes
    const interval = setInterval(checkStatus, 1000);
    
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
          
          <div className={`chapter ${compassChallengeActive ? 'completed' : 'active'}`}>
            <div className="chapter-icon">🧭</div>
            <div className="chapter-content">
              <h3>Chapter 4: The Compass Quest</h3>
              <p>{compassChallengeComplete ? 
                  "You followed the ancient compass and discovered hidden Mediterranean secrets." : 
                  compassChallengeActive ?
                  "Following the mysterious compass to uncover ancient Mediterranean secrets..." : 
                  "A mysterious compass has appeared, ready to guide you on your next adventure."}</p>
            </div>
          </div>

          <div className={`chapter ${locationStage > 0 ? 'active' : 'upcoming'}`}>
            <div className="chapter-icon">🌍</div>
            <div className="chapter-content">
              <h3>Chapter 5: The Real Journey</h3>
              <p>{locationStage > 0 ? 
                  `Your real journey to Italy has begun! You're currently at stage ${locationStage}.` : 
                  "Track your real journey from Bedford to the treasure location in Italy."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Show compass challenge if active */}
      {compassChallengeActive && !compassChallengeComplete && (
        <div className="challenge-section compass-challenge-section">
          <CompassQuest />
        </div>
      )}

      {/* Show Location Tracker */}
      <div className="challenge-section location-challenge-section">
        <LocationTracker />
      </div>

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
      {locationStage >= 8 && (
        <>
          <div className="challenge-divider">
            <div className="divider-line"></div>
            <div className="divider-icon">🏛️</div>
            <div className="divider-line"></div>
          </div>
          
          <div className="challenge-section future-adventures">
            <h2 className="challenge-header">
              <span className="challenge-icon">🌅</span>
              The Final Treasure Awaits!
            </h2>
            <div className="challenge-description">
              <p>You've reached the exact treasure location! The physical chest containing your Italian adventure rewards is now within reach. Look for the distinctive landmarks and follow the final clues to claim your prize!</p>
            </div>
            <div className="treasure-location-final">
              <div className="final-coordinates">
                <h4>📍 Treasure Coordinates:</h4>
                <p>44.424156, 12.304828</p>
                <p>Lido Adriano, Italy</p>
              </div>
              <div className="final-instructions">
                <p>🗝️ Look for the distinctive markers mentioned in your clues</p>
                <p>📦 The physical treasure chest awaits your discovery</p>
                <p>🎉 Your Italian adventure reaches its climax!</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChallengeManager;