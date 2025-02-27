import React, { useState, useEffect } from 'react';
import './ChallengeManager.css';
import PirateBattle from './PirateBattle';
import PizzaioloChallenge from './PizzaioloChallenge';
import TreasureChest from './TreasureChest';
import { isSecondChallengeUnlocked } from './TimeUtils';

const ChallengeManager = () => {
  // Challenge states
  const [piratesChallengeComplete, setPiratesChallengeComplete] = useState(false);
  const [piratesChallengeActive, setPiratesChallengeActive] = useState(false);
  const [pizzaioloChallengeActive, setPizzaioloChallengeActive] = useState(false);
  const [pizzaioloChallengeComplete, setPizzaioloChallengeComplete] = useState(false);
  const [secondChallengeUnlocked, setSecondChallengeUnlocked] = useState(false);
  
  // Load saved progress on mount
  useEffect(() => {
    // Check if second challenge is unlocked based on date
    setSecondChallengeUnlocked(isSecondChallengeUnlocked());
    
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
    
    // Check if pizzaiolo challenge is active and completed
    if (secondChallengeUnlocked) {
      const pizzaioloActive = localStorage.getItem('pizzaioloChallengeActive');
      if (pizzaioloActive === 'true') {
        setPizzaioloChallengeActive(true);
      }
      
      const pizzaioloComplete = localStorage.getItem('pizzaioloChallengeComplete');
      if (pizzaioloComplete === 'true') {
        setPizzaioloChallengeComplete(true);
      }
    }
  }, [secondChallengeUnlocked]);
  
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
  
  // Listen for pizzaiolo challenge completion
  useEffect(() => {
    const checkPizzaioloCompletion = () => {
      const pizzaioloComplete = localStorage.getItem('pizzaioloChallengeComplete');
      setPizzaioloChallengeComplete(pizzaioloComplete === 'true');
    };
    
    // Set up interval to check completion
    const interval = setInterval(checkPizzaioloCompletion, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Listen for challenge activation changes
  useEffect(() => {
    const checkChallengeActive = () => {
      const piratesActive = localStorage.getItem('piratesChallengeActive');
      setPiratesChallengeActive(piratesActive === 'true');
      
      if (secondChallengeUnlocked) {
        const pizzaioloActive = localStorage.getItem('pizzaioloChallengeActive');
        setPizzaioloChallengeActive(pizzaioloActive === 'true');
      }
    };
    
    // Check immediately and then set interval
    checkChallengeActive();
    
    // Set up interval to check for activation changes
    const interval = setInterval(checkChallengeActive, 500);
    
    return () => clearInterval(interval);
  }, [secondChallengeUnlocked]);
  
  return (
    <div className="challenge-manager">
      {piratesChallengeActive && (
        <div className="challenge-section">
          <h2 className="challenge-header">
            <span className="challenge-icon">🏴‍☠️</span>
            Pirate Attack!
          </h2>
          <div className="challenge-description">
            <p>Arrrr! Pirates be attackin' yer ship! Solve these riddles to defeat the scurvy dogs and claim the treasure chest!</p>
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
      
      {/* Pizzaiolo Challenge Section - only show if active and unlocked by date */}
      {pizzaioloChallengeActive && secondChallengeUnlocked && (
        <div className="challenge-section pizzaiolo-challenge-section">
          <PizzaioloChallenge />
        </div>
      )}
      
      {pizzaioloChallengeActive && secondChallengeUnlocked && (
        <div className="challenge-divider">
          <div className="divider-line"></div>
          <div className="divider-icon">🍕</div>
          <div className="divider-line"></div>
        </div>
      )}
      
      <div className="challenge-section">
        <h2 className="challenge-header">
          <span className="challenge-icon">💰</span>
          Treasure Chest
        </h2>
        <div className="challenge-description">
          <p>A mysterious chest has washed ashore. What treasures could be hidden inside?</p>
        </div>
        <TreasureChest isUnlocked={piratesChallengeComplete} />
      </div>
      
      {/* Next challenge teaser - will appear after Pizzaiolo challenge is complete */}
      {pizzaioloChallengeComplete && (
        <div className="challenge-divider">
          <div className="divider-line"></div>
          <div className="divider-icon">🏄‍♂️</div>
          <div className="divider-line"></div>
        </div>
      )}
      
      {pizzaioloChallengeComplete && (
        <div className="challenge-section waterpark-teaser">
          <h2 className="challenge-header">
            <span className="challenge-icon">🏊‍♂️</span>
            Alpine Splash Waterpark
          </h2>
          <div className="challenge-description">
            <p>Your invitation to Antonio and Sofia's celebration at the mountain waterpark awaits! The adventure will continue soon...</p>
          </div>
          <div className="waterpark-preview">
            <div className="waterpark-animation">
              <span className="waterpark-icon">🏔️</span>
              <span className="waterpark-icon">🌊</span>
              <span className="waterpark-icon">🎢</span>
              <span className="waterpark-icon">🏄‍♂️</span>
              <span className="waterpark-icon">🍕</span>
            </div>
            <p className="coming-soon">Coming Next Month</p>
            <p className="pirate-warning">Wait... is that a pirate ship in the distance? 👀</p>
          </div>
        </div>
      )}
      
      {/* Future challenges will be added here */}
    </div>
  );
};

// Export a function to check if pirate challenge is unlocked
export const isPiratesChallengeUnlocked = () => {
  return localStorage.getItem('piratesChallengeActive') === 'true';
};

// Export a function to check if pizzaiolo challenge is unlocked
export const isPizzaioloChallengeUnlocked = () => {
  return localStorage.getItem('pizzaioloChallengeActive') === 'true' && isSecondChallengeUnlocked();
};

export default ChallengeManager;