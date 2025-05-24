import React, { useState, useEffect } from 'react';
import './ChallengeManager.css';
import TreasureChest from './TreasureChest';
import CompassQuest from './CompassQuest';
import LocationTracker from './LocationTracker';

const ChallengeManager = () => {
  const [compassChallengeActive, setCompassChallengeActive] = useState(false);
  const [compassChallengeComplete, setCompassChallengeComplete] = useState(false);
  const [locationStage, setLocationStage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load saved progress on mount
  useEffect(() => {
    try {
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
    } catch (error) {
      console.error('Error loading challenge manager data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Simple one-time check on mount and storage event listener
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const compassActive = localStorage.getItem('compassChallengeActive') === 'true';
        const compassComplete = localStorage.getItem('compassChallengeComplete') === 'true';
        const locationStageData = localStorage.getItem('locationStage');
        const newLocationStage = locationStageData ? parseInt(locationStageData, 10) : 0;
        
        setCompassChallengeActive(compassActive);
        setCompassChallengeComplete(compassComplete);
        setLocationStage(newLocationStage);
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    };

    // Check once immediately
    handleStorageChange();

    // Listen for storage events and custom events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdate', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleStorageChange);
    };
  }, []); // Empty dependency array - only run once

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="challenge-manager">
        <div className="loading-state">
          <h2>🌟 Loading Your Adventure...</h2>
          <p>Preparing your Italian journey details...</p>
        </div>
      </div>
    );
  }
  
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
          
          <div className={`chapter ${compassChallengeComplete ? 'completed' : compassChallengeActive ? 'active' : 'upcoming'}`}>
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

          {locationStage >= 8 && (
            <div className="chapter current">
              <div className="chapter-icon">💎</div>
              <div className="chapter-content">
                <h3>Chapter 6: The Final Treasure</h3>
                <p>You've reached the treasure location! The physical chest awaits your discovery at the exact coordinates.</p>
              </div>
            </div>
          )}
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
      
      {/* Show final treasure message when at location */}
      {locationStage >= 8 && (
        <>
          <div className="challenge-divider">
            <div className="divider-line"></div>
            <div className="divider-icon">🏛️</div>
            <div className="divider-line"></div>
          </div>
          
          <div className="challenge-section final-treasure-section">
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
                <p className="coordinates-text">44.424156, 12.304828</p>
                <p className="location-name">Lido Adriano, Italy</p>
              </div>
              <div className="final-instructions">
                <p>🗝️ Look for the distinctive markers mentioned in your clues</p>
                <p>📦 The physical treasure chest awaits your discovery</p>
                <p>🎉 Your Italian adventure reaches its climax!</p>
              </div>
              <div className="treasure-hunt-tips">
                <h4>🔍 Final Treasure Hunt Tips:</h4>
                <ul>
                  <li>Search within a 100-meter radius of the coordinates</li>
                  <li>Look for unique landmarks or features mentioned in previous clues</li>
                  <li>The chest may be hidden but accessible - think like a pirate!</li>
                  <li>Take photos of your discovery to commemorate this moment</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Future adventures teaser for intermediate stages */}
      {locationStage > 0 && locationStage < 8 && (
        <>
          <div className="challenge-divider">
            <div className="divider-line"></div>
            <div className="divider-icon">🗺️</div>
            <div className="divider-line"></div>
          </div>
          
          <div className="challenge-section journey-progress-section">
            <h2 className="challenge-header">
              <span className="challenge-icon">🛤️</span>
              Journey in Progress
            </h2>
            <div className="challenge-description">
              <p>Your real-world adventure to Italy is underway! Each milestone brings you closer to the treasure and unlocks new chapters in your Mediterranean journey.</p>
            </div>
            <div className="journey-status">
              <div className="current-progress">
                <h4>🚀 Current Status: Stage {locationStage} of 8</h4>
                <div className="progress-descriptions">
                  {locationStage >= 1 && <p>✅ Journey has begun from Bedford</p>}
                  {locationStage >= 2 && <p>✅ Moving closer to Italy</p>}
                  {locationStage >= 3 && <p>✅ Approaching Italian territory</p>}
                  {locationStage >= 4 && <p>✅ Arrived in Bologna region</p>}
                  {locationStage >= 5 && <p>✅ Approaching the Adriatic coast</p>}
                  {locationStage >= 6 && <p>✅ Near Lido Adriano</p>}
                  {locationStage >= 7 && <p>✅ Very close to treasure location</p>}
                </div>
              </div>
              <div className="upcoming-milestone">
                <h4>🎯 Next Milestone:</h4>
                <p>
                  {locationStage < 8 && `Stage ${locationStage + 1} - Get even closer to the treasure location`}
                  {locationStage >= 8 && "You've reached the final destination!"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChallengeManager;