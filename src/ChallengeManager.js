import React, { useState, useEffect } from 'react';
import './ChallengeManager.css';
import PirateBattle from './PirateBattle';
import TreasureChest from './TreasureChest';

const ChallengeManager = () => {
  // Challenge states
  const [piratesChallengeComplete, setPiratesChallengeComplete] = useState(false);
  const [piratesChallengeActive, setPiratesChallengeActive] = useState(false);
  
  // Load saved progress on mount
  useEffect(() => {
    // Check if pirates challenge is completed
    const piratesComplete = localStorage.getItem('pirateRiddleStates');
    if (piratesComplete) {
      try {
        const states = JSON.parse(piratesComplete);
        const allComplete = Object.values(states).every(state => state.isCorrect);
        setPiratesChallengeComplete(allComplete);
      } catch (error) {
        console.error('Error parsing pirate riddle states:', error);
      }
    }
    
    // Check if pirates challenge is active
    const piratesActive = localStorage.getItem('piratesChallengeActive');
    if (piratesActive === 'true') {
      setPiratesChallengeActive(true);
    }
  }, []);
  
  // Listen for pirate battle completion
  useEffect(() => {
    const checkPirateCompletion = () => {
      const piratesComplete = localStorage.getItem('pirateRiddleStates');
      if (piratesComplete) {
        try {
          const states = JSON.parse(piratesComplete);
          const allComplete = Object.values(states).every(state => state.isCorrect);
          setPiratesChallengeComplete(allComplete);
        } catch (error) {
          console.error('Error parsing pirate riddle states:', error);
        }
      }
    };
    
    // Set up interval to check completion
    const interval = setInterval(checkPirateCompletion, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Listen for challenge activation changes
  useEffect(() => {
    const checkChallengeActive = () => {
      const piratesActive = localStorage.getItem('piratesChallengeActive');
      setPiratesChallengeActive(piratesActive === 'true');
    };
    
    // Check immediately and then set interval
    checkChallengeActive();
    
    // Set up interval to check for activation changes
    const interval = setInterval(checkChallengeActive, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="challenge-manager">
      {piratesChallengeActive && (
        <div className="challenge-section">
          <h2 className="challenge-header">
            <span className="challenge-icon">🏴‍☠️</span>
            Pirate Attack!
          </h2>
          <div className="challenge-description">
            <p>Pirates are attacking! Solve their riddles to defeat them and unlock the treasure chest.</p>
          </div>
          <PirateBattle />
        </div>
      )}
      
      {piratesChallengeActive && (
        <div className="challenge-divider">
          <div className="divider-line"></div>
          <div className="divider-icon">⚓</div>
          <div className="divider-line"></div>
        </div>
      )}
      
      <div className="challenge-section">
        <h2 className="challenge-header">
          <span className="challenge-icon">💰</span>
          Mysterious Chest
        </h2>
        <div className="challenge-description">
          <p>A mysterious chest has washed ashore. What treasures could be inside?</p>
        </div>
        <TreasureChest isUnlocked={piratesChallengeComplete} />
      </div>
      
      {/* Future challenges will be added here */}
    </div>
  );
};

// Export a function to check if pirate challenge is unlocked
export const isPiratesChallengeUnlocked = () => {
  return localStorage.getItem('piratesChallengeActive') === 'true';
};

export default ChallengeManager;