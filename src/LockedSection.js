import React, { useState, useEffect } from 'react';
import './LockedSection.css';

const LockedSection = () => {
  const [hoverLock, setHoverLock] = useState(null);
  
  // Sections that will be "unlocked" over time
  const lockedSections = [
    { id: 1, name: "Locked Content", unlockDate: null, hint: "Coming soon..." },
    { id: 2, name: "Locked Content", unlockDate: null, hint: "Patience..." },
    { id: 3, name: "Locked Content", unlockDate: null, hint: "Not yet revealed..." },
    { id: 4, name: "Locked Content", unlockDate: null, hint: "Waiting..." },
    { id: 5, name: "Locked Content", unlockDate: null, hint: "Mysteries await..." }
  ];

  return (
    <div className="locked-section">
      <h3 className="locked-title">Mysterious Contents</h3>
      <p className="locked-description">Discover what lies behind these locks as your journey unfolds...</p>
      
      <div className="locks-container">
        {lockedSections.map((section) => (
          <div 
            key={section.id} 
            className="lock-item"
            onMouseEnter={() => setHoverLock(section.id)}
            onMouseLeave={() => setHoverLock(null)}
          >
            <div className="lock-icon">🔒</div>
            <div className="lock-name">{section.name}</div>
            
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