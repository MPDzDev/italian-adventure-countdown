import React, { useState, useEffect } from 'react';
import './LockedSection.css';
import { isPiratesChallengeUnlocked } from './ChallengeManager';

const LockedSection = () => {
  const [hoverLock, setHoverLock] = useState(null);
  const [activeLocks, setActiveLocks] = useState({
    1: false, // Pirate Challenge
    2: false,
    3: false,
    4: false,
    5: false
  });
  
  // Load active state on mount and whenever localStorage changes
  const updateLockStates = () => {
    // Check if pirate challenge is active
    const isPirateActive = isPiratesChallengeUnlocked();
    
    setActiveLocks(prev => ({
      ...prev,
      1: isPirateActive
    }));
    
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
  };
  
  // Initial load
  useEffect(() => {
    updateLockStates();
    
    // Set up interval to check for changes
    const interval = setInterval(updateLockStates, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  // Sections that will be "unlocked" over time
  const lockedSections = [
    { id: 1, name: "Pirate Challenge", unlockDate: null, hint: "Click to begin the pirate challenge!" },
    { id: 2, name: "Locked Content", unlockDate: null, hint: "Patience..." },
    { id: 3, name: "Locked Content", unlockDate: null, hint: "Not yet revealed..." },
    { id: 4, name: "Locked Content", unlockDate: null, hint: "Waiting..." },
    { id: 5, name: "Locked Content", unlockDate: null, hint: "Mysteries await..." }
  ];

  // Handle clicking on a lock
  const handleLockClick = (id) => {
    // Only the pirate challenge lock is clickable for now
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
  };

  return (
    <div className="locked-section">
      <h3 className="locked-title">Mysterious Contents</h3>
      <p className="locked-description">Discover what lies behind these locks as your journey unfolds...</p>
      
      <div className="locks-container">
        {lockedSections.map((section) => (
          <div 
            key={section.id} 
            className={`lock-item ${activeLocks[section.id] ? 'lock-active' : ''} ${section.id === 1 ? 'pirate-lock' : ''}`}
            onMouseEnter={() => setHoverLock(section.id)}
            onMouseLeave={() => setHoverLock(null)}
            onClick={() => handleLockClick(section.id)}
          >
            <div className="lock-icon">{activeLocks[section.id] ? '🔓' : '🔒'}</div>
            <div className="lock-name">{section.name}</div>
            
            {section.id === 1 && !activeLocks[section.id] && (
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
        ))}
      </div>
      
      <div className="locked-warning">
        <div className="warning-icon">⚠️</div>
        <p>These locks will open when the time is right...</p>
      </div>
    </div>
  );
};

export default LockedSection;