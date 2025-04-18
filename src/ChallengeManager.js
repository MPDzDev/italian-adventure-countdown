import React, { useState, useEffect } from 'react';
import './ChallengeManager.css';
import PirateBattle from './PirateBattle';
import PizzaioloChallenge from './PizzaioloChallenge';
import TreasureChest from './TreasureChest';
import DailyWordlePuzzle from './DailyWordlePuzzle';
import { isSecondChallengeUnlocked } from './TimeUtils';

const ChallengeManager = () => {
  // Challenge states
  const [piratesChallengeComplete, setPiratesChallengeComplete] = useState(false);
  const [piratesChallengeActive, setPiratesChallengeActive] = useState(false);
  const [pizzaioloChallengeActive, setPizzaioloChallengeActive] = useState(false);
  const [pizzaioloChallengeComplete, setPizzaioloChallengeComplete] = useState(false);
  const [wordleChallengeActive, setWordleChallengeActive] = useState(false);
  const [secondChallengeUnlocked, setSecondChallengeUnlocked] = useState(false);
  
  // Load saved progress on mount
  useEffect(() => {
    // Check if second challenge is unlocked based on date
    setSecondChallengeUnlocked(isSecondChallengeUnlocked());
    
    // Check if pirates challenge is completed
    const piratesComplete = localStorage.getItem('pirateRiddleStates');
    let isPirateCompleted = false;
    
    if (piratesComplete) {
      try {
        const states = JSON.parse(piratesComplete);
        isPirateCompleted = Object.values(states).every(state => state.isCorrect);
        setPiratesChallengeComplete(isPirateCompleted);
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
      
      // FIX: Auto-activate pizzaiolo challenge if pirate challenge is completed
      // and the second challenge is unlocked by time but pizzaiolo not yet activated
      if (!pizzaioloActive && isPirateCompleted) {
        localStorage.setItem('pizzaioloChallengeActive', 'true');
        setPizzaioloChallengeActive(true);
      } else if (pizzaioloActive === 'true') {
        setPizzaioloChallengeActive(true);
      }
      
      const pizzaioloComplete = localStorage.getItem('pizzaioloChallengeComplete');
      if (pizzaioloComplete === 'true') {
        setPizzaioloChallengeComplete(true);
      }
    }
    
    // Check if Wordle challenge is active
    const wordleActive = localStorage.getItem('wordleChallengeActive');
    if (wordleActive === 'true') {
      setWordleChallengeActive(true);
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
      
      // Check if Wordle challenge is active
      const wordleActive = localStorage.getItem('wordleChallengeActive');
      setWordleChallengeActive(wordleActive === 'true');
    };
    
    // Check immediately and then set interval
    checkChallengeActive();
    
    // Set up interval to check for activation changes
    const interval = setInterval(checkChallengeActive, 500);
    
    return () => clearInterval(interval);
  }, [secondChallengeUnlocked]);
  
  return (
    <div className="challenge-manager">
      {/* Show only one challenge at a time - prioritize the Wordle challenge if active */}
      {wordleChallengeActive ? (
        // If Wordle challenge is active, show only it
        <div className="challenge-section wordle-section">
          <h2 className="challenge-header">
            <span className="challenge-icon">🏄‍♂️</span>
            Alpine Splash Word Challenge
          </h2>
          <div className="challenge-description">
            <p>Solve the daily word puzzles at Alpine Splash Waterpark! Each correct solution earns you a special token for the celebration with Antonio and Sofia.</p>
          </div>
          <div className="waterpark-story">
            <p>As you arrive at the Alpine Splash Waterpark, you're greeted by Antonio and Sofia at the entrance. The waterpark is a dazzling blend of mountain scenery and water attractions.</p>
            <p>"Welcome to the celebration!" Antonio exclaims. "Now that you've helped us recover our family recipes, it's time for some fun!"</p>
            <p>Sofia points excitedly to a word puzzle booth near the wave pool. "Look! They have special word games! If you solve them, you can win prizes!"</p>
            <div className="story-character-quotes">
              <div className="story-quote">
                <span className="character-emoji">👨‍🍳</span> <span className="quote-text">"Each day brings a new word to solve. It's like finding the secret ingredients in a recipe!"</span>
              </div>
              <div className="story-quote">
                <span className="character-emoji">👧</span> <span className="quote-text">"I've been practicing all week! Let's do this!"</span>
              </div>
            </div>
          </div>
          <DailyWordlePuzzle />
        </div>
      ) : pizzaioloChallengeActive && secondChallengeUnlocked ? (
        // If Pizzaiolo challenge is active, show it
        <div className="challenge-section pizzaiolo-challenge-section">
          <PizzaioloChallenge />
        </div>
      ) : piratesChallengeActive ? (
        // Otherwise, if Pirate challenge is active, show it
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
      ) : null}
      
      {/* Always show treasure chest section */}
      <div className="challenge-divider">
        <div className="divider-line"></div>
        <div className="divider-icon">💰</div>
        <div className="divider-line"></div>
      </div>
      
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
      
      {/* Waterpark teaser section - ONLY shown if Pizzaiolo challenge complete AND Wordle NOT active */}
      {pizzaioloChallengeComplete && !wordleChallengeActive && (
        <>
          <div className="challenge-divider">
            <div className="divider-line"></div>
            <div className="divider-icon">🏄‍♂️</div>
            <div className="divider-line"></div>
          </div>
          
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
        </>
      )}
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