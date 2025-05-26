import React, { useState, useEffect } from 'react';
import './LockedSection.css';

const LockedSection = () => {
  const [hoverLock, setHoverLock] = useState(null);
  const [activeLocks, setActiveLocks] = useState({
    1: false, // Compass Challenge - the new active one
    2: false, // Future Content
    3: false, // Future Content
  });

  // Load active state on mount
  useEffect(() => {
    // Check if compass challenge is active
    const compassActive = localStorage.getItem('compassChallengeActive');
    if (compassActive === 'true') {
      setActiveLocks(prev => ({
        ...prev,
        1: true
      }));
    }

    // Set up interval to check for changes
    const lockStateInterval = setInterval(() => {
      const compassActive = localStorage.getItem('compassChallengeActive');
      setActiveLocks(prev => ({
        ...prev,
        1: compassActive === 'true'
      }));
    }, 500);

    return () => clearInterval(lockStateInterval);
  }, []);

  // Simplified locked sections - just show what's next
  const lockedSections = [
    { 
      id: 1, 
      name: "Compass Quest", 
      hint: "A mysterious compass has appeared! Follow its guidance to discover ancient Mediterranean secrets.",
      icon: "🧭"
    },
    { 
      id: 2, 
      name: "Ancient Ruins", 
      hint: "Hidden ruins along the Italian coast await discovery...",
      icon: "🏛️"
    },
    { 
      id: 3, 
      name: "Final Destination", 
      hint: "The ultimate treasure lies at journey's end...",
      icon: "🏖️"
    }
  ];

  // Handle clicking on a lock
  const handleLockClick = (id) => {
    // Only handle compass challenge lock for now
    if (id === 1) {
      const newValue = !activeLocks[id];
      
      // Update state
      setActiveLocks(prev => ({
        ...prev,
        [id]: newValue
      }));
      
      // Save to localStorage
      localStorage.setItem('compassChallengeActive', newValue.toString());
      
      // Force scroll to show the challenges
      if (newValue) {
        setTimeout(() => {
          const challengeSection = document.querySelector('.challenges-container');
          if (challengeSection) {
            challengeSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    }
  };

  return (
    <div className="locked-section">
      <h3 className="locked-title">The Journey Continues</h3>
      <p className="locked-description">Three adventures completed, new mysteries await discovery...</p>
      
      {/* Achievement Summary */}
      <div className="achievement-summary">
        <h4>Your Achievements</h4>
        <div className="completed-stages">
          <div className="achievement-item">
            <span className="achievement-icon">🏴‍☠️</span>
            <span className="achievement-name">Pirate Riddle Master</span>
            <span className="achievement-status">✓ Complete</span>
          </div>
          <div className="achievement-item">
            <span className="achievement-icon">🍕</span>
            <span className="achievement-name">Recipe Recoverer</span>
            <span className="achievement-status">✓ Complete</span>
          </div>
          <div className="achievement-item">
            <span className="achievement-icon">🏄‍♂️</span>
            <span className="achievement-name">Waterpark Champion</span>
            <span className="achievement-status">✓ Complete</span>
          </div>
        </div>
      </div>
      
      <div className="locks-container">
        {lockedSections.map((section) => {
          const isCompassLock = section.id === 1;
          const isClickable = section.id === 1; // Only compass is clickable for now
          
          return (
            <div 
              key={section.id} 
              className={`lock-item ${activeLocks[section.id] ? 'lock-active' : ''} 
                         ${isCompassLock ? 'compass-lock' : 'future-lock'}
                         ${isClickable ? 'clickable' : 'not-ready'}`}
              onMouseEnter={() => setHoverLock(section.id)}
              onMouseLeave={() => setHoverLock(null)}
              onClick={() => isClickable && handleLockClick(section.id)}
            >
              <div className="lock-icon">
                {activeLocks[section.id] ? '🔓' : section.icon}
              </div>
              <div className="lock-name">{section.name}</div>
              
              {/* Click indicator for compass lock */}
              {isCompassLock && !activeLocks[section.id] && (
                <div className="click-indicator">Click to begin</div>
              )}
              
              {/* Coming soon indicator for future locks */}
              {section.id > 1 && (
                <div className="coming-soon-indicator">Coming Soon</div>
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
        <div className="warning-icon">🧭</div>
        <p>The compass needle trembles with anticipation. Your next adventure awaits...</p>
      </div>
    </div>
  );
};

export default LockedSection;