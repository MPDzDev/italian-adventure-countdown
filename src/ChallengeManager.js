import React, { useState, useEffect } from 'react';
import './ChallengeManager.css';
import TreasureChest from './TreasureChest';
import LocationTracker from './LocationTracker';
import DailyEmojiGuesser from './DailyEmojiGuesser';
import RosewoodRumor from './RosewoodRumor';

const ChallengeManager = () => {
  const [locationStage, setLocationStage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    try {
      const locationStageData = localStorage.getItem('locationStage');
      if (locationStageData) {
        setLocationStage(parseInt(locationStageData, 10));
      }
    } catch (error) {
      console.error('Error loading challenge manager data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const locationStageData = localStorage.getItem('locationStage');
        const newLocationStage = locationStageData ? parseInt(locationStageData, 10) : 0;
        setLocationStage(newLocationStage);
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdate', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="challenge-manager compact">
        <div className="loading-state compact">
          <h3>🌟 Loading Adventures...</h3>
        </div>
      </div>
    );
  }
  
  return (
    <div className="challenge-manager compact">
      {/* Compact Adventure Summary */}
      <div className="adventure-summary compact">
        <h3>🌟 Completed Adventures</h3>
        <div className="completed-stages compact">
          <div className="stage-badge">
            <span className="stage-icon">🏴‍☠️</span>
            <span className="stage-name">Pirates</span>
          </div>
          <div className="stage-badge">
            <span className="stage-icon">🍕</span>
            <span className="stage-name">Pizzeria</span>
          </div>
          <div className="stage-badge">
            <span className="stage-icon">🏄‍♂️</span>
            <span className="stage-name">Waterpark</span>
          </div>
        </div>
      </div>

      {/* Daily Emoji Guesser Game */}
      <div className="daily-game-section">
        <DailyEmojiGuesser />
      </div>

      {/* Rosewood Rumors */}
      <RosewoodRumor />

      {/* Location Tracker - Journey Progress */}
      <div className="journey-section">
        <LocationTracker />
      </div>

      {/* Polaroid Photo Challenge Hint */}
      <div className="polaroid-section compact">
        <h3>📸 Polaroid Photo Challenge</h3>
        <p>
          Capture snapshots of your adventure. The full challenge unlocks once
          you reach the treasure.
        </p>
      </div>

      {/* Final Treasure Message when at location */}
      {locationStage >= 6 && (
        <div className="final-treasure-section compact">
          <h3>🌅 Treasure Found!</h3>
          <div className="treasure-message">
            <p>🎉 You've reached the exact treasure location! The physical chest containing your Italian adventure rewards is within reach.</p>
            <div className="final-coordinates compact">
              <strong>📍 Lido Adriano, Italy</strong>
            </div>
            <p className="polaroid-link">
              <a
                href="https://photochallange.netflify.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                📸 Begin the Polaroid Challenge
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Compact Treasure Chest at bottom */}
      <div className="treasure-section compact">
        <h3>💰 Adventure Chest</h3>
        <TreasureChest isUnlocked={true} />
      </div>
    </div>
  );
};

export default ChallengeManager;