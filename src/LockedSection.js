import React, { useState, useEffect } from 'react';
import './LockedSection.css';
import { isPiratesChallengeUnlocked } from './ChallengeManager';

const LockedSection = () => {
  const [hoverLock, setHoverLock] = useState(null);
  const [activeLocks, setActiveLocks] = useState({
    1: false, // Pirate Challenge
    2: false, // Pizzaiolo Challenge - locked with timer
    3: false,
    4: false,
    5: false
  });
  const [secondLockCountdown, setSecondLockCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [secondLockUnlocked, setSecondLockUnlocked] = useState(false);
  
  // Calculate time until the second lock unlocks (4 months before July 20th)
  const calculateTimeUntilSecondLock = () => {
    const now = new Date();
    const eventDate = new Date(now.getFullYear(), 6, 20); // July 20th
    const unlockDate = new Date(eventDate);
    unlockDate.setMonth(unlockDate.getMonth() - 4); // 4 months before
    
    // If current date is past unlock date, the lock is unlocked
    if (now >= unlockDate) {
      setSecondLockUnlocked(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    // Calculate time difference
    const timeDiff = unlockDate - now;
    
    // Convert to days, hours, minutes, seconds
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };
  
  // Load active state on mount and whenever localStorage changes
  const updateLockStates = React.useCallback(() => {
    // Check if pirate challenge is active
    const isPirateActive = isPiratesChallengeUnlocked();
    
    setActiveLocks(prev => ({
      ...prev,
      1: isPirateActive
    }));
    
    // Check if second lock should be active based on timer
    if (secondLockUnlocked) {
      // Only activate second lock if first one is already active
      const savedLock2 = localStorage.getItem('pizzaioloChallengeActive');
      if (savedLock2 === 'true') {
        setActiveLocks(prev => ({
          ...prev,
          2: true
        }));
      }
    }
    
    // Check localStorage for other active locks
    const savedLocks = localStorage.getItem('activeLocks');
    if (savedLocks) {
      try {
        const parsedLocks = JSON.parse(savedLocks);
        setActiveLocks(prev => ({
          ...prev,
          ...parsedLocks
        }));
      } catch (error) {
        console.error('Error parsing active locks:', error);
      }
    }
  }, [secondLockUnlocked]);
  
  // Initial load and set up interval for countdown
  useEffect(() => {
    updateLockStates();
    
    // Set up interval to check for changes
    const lockStateInterval = setInterval(updateLockStates, 500);
    
    // Set up interval for countdown
    const countdownInterval = setInterval(() => {
      setSecondLockCountdown(calculateTimeUntilSecondLock());
    }, 1000);
    
    return () => {
      clearInterval(lockStateInterval);
      clearInterval(countdownInterval);
    };
  }, [secondLockUnlocked, updateLockStates]);
  
  // Check if pirate challenge is completed
  const isPirateCompleted = () => {
    const piratesComplete = localStorage.getItem('pirateRiddleStates');
    if (piratesComplete) {
      try {
        const states = JSON.parse(piratesComplete);
        return Object.values(states).every(state => state.isCorrect);
      } catch (error) {
        console.error('Error parsing pirate riddle states:', error);
      }
    }
    return false;
  };
  
  const pirateCompleted = isPirateCompleted();
  
  // Sections that will be "unlocked" over time
  const lockedSections = [
    { id: 1, name: "Pirate Challenge", unlockDate: null, hint: "Click to begin the pirate challenge!" },
    { 
      id: 2, 
      name: "Antonio's Pizzeria",
      unlockDate: null, 
      hint: secondLockUnlocked ? 
            "Help Antonio recover his stolen recipes!" : 
            pirateCompleted ? 
            `Unlocks in ${secondLockCountdown.days} days, ${secondLockCountdown.hours} hours, ${secondLockCountdown.minutes} min` :
            "Complete the Pirate Challenge first"
    },
    { id: 3, name: "Locked Content", unlockDate: null, hint: "Not yet revealed..." },
    { id: 4, name: "Locked Content", unlockDate: null, hint: "Waiting..." },
    { id: 5, name: "Locked Content", unlockDate: null, hint: "Mysteries await..." }
  ];

  // Handle clicking on a lock
  const handleLockClick = (id) => {
    // Handle pirate challenge lock
    if (id === 1) {
      const newValue = !activeLocks[id];
      
      // Update state
      setActiveLocks(prev => ({
        ...prev,
        [id]: newValue
      }));
      
      // Save to localStorage
      localStorage.setItem('piratesChallengeActive', newValue.toString());
      
      // Force scroll to show the challenges
      if (newValue) {
        setTimeout(() => {
          const challengeSection = document.querySelector('.challenge-section');
          if (challengeSection) {
            challengeSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    }
    // Handle pizzaiolo challenge lock - only if unlocked by timer and pirate challenge is completed
    else if (id === 2 && secondLockUnlocked && pirateCompleted) {
      const newValue = !activeLocks[id];
      
      // Update state
      setActiveLocks(prev => ({
        ...prev,
        [id]: newValue
      }));
      
      // Save to localStorage
      localStorage.setItem('pizzaioloChallengeActive', newValue.toString());
      
      // Force scroll to show the challenges
      if (newValue) {
        setTimeout(() => {
          const challengeSection = document.querySelector('.pizzaiolo-challenge-section');
          if (challengeSection) {
            challengeSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    }
  };

  return (
    <div className="locked-section">
      <h3 className="locked-title">Mysterious Contents</h3>
      <p className="locked-description">Discover what lies behind these locks as your journey unfolds...</p>
      
      <div className="locks-container">
        {lockedSections.map((section) => {
          // Special class for the second lock if it has a timer - only if pirate challenge is completed
          const isTimerLock = section.id === 2 && !secondLockUnlocked && pirateCompleted;
          
          return (
            <div 
              key={section.id} 
              className={`lock-item ${activeLocks[section.id] ? 'lock-active' : ''} 
                         ${section.id === 1 ? 'pirate-lock' : ''} 
                         ${isTimerLock ? 'timer-lock' : ''} 
                         ${section.id === 2 && secondLockUnlocked ? 'pizzaiolo-lock' : ''}`}
              onMouseEnter={() => setHoverLock(section.id)}
              onMouseLeave={() => setHoverLock(null)}
              onClick={() => handleLockClick(section.id)}
            >
              <div className="lock-icon">{activeLocks[section.id] ? '🔓' : section.id === 2 && secondLockUnlocked ? '🍕' : '🔒'}</div>
              <div className="lock-name">{section.name}</div>
              
              {/* Timer for second lock - only show if pirate challenge is completed */}
              {section.id === 2 && !secondLockUnlocked && !activeLocks[section.id] && pirateCompleted && (
                <div className="lock-timer">
                  <div className="timer-display">
                    {secondLockCountdown.days}d {secondLockCountdown.hours}h {secondLockCountdown.minutes}m
                  </div>
                </div>
              )}
              
              {/* Click indicator for active locks */}
              {((section.id === 1 && !activeLocks[section.id]) || 
                (section.id === 2 && secondLockUnlocked && !activeLocks[section.id])) && (
                <div className="click-indicator">Click to unlock</div>
              )}
              
              {hoverLock === section.id && (
                <div className="lock-hint">
                  <p>{section.hint}</p>
                  <div className="lock-hint-arrow"></div>
                </div>
              )}
              
              <div className="lock-chain"></div>
            </div>
          );
        })}
      </div>
      
      <div className="locked-warning">
        <div className="warning-icon">⚠️</div>
        <p>These locks will open when the time is right...</p>
      </div>
    </div>
  );
};

export default LockedSection;