import React from 'react';

const AnimatedShip = () => {
  // Animation state for bobbing on waves
  const [bob, setBob] = React.useState(0);
  
  // Create a bobbing effect like a ship on waves
  React.useEffect(() => {
    const interval = setInterval(() => {
      setBob(prev => (prev === 0 ? 1 : 0));
    }, 1000); // Slower for a ship-like movement
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ship-emoji" style={{ transform: `translateY(${bob * -3}px) rotate(${bob * 2}deg)` }}>
      {/* Ship emoji */}
      ⛵
      {/* Pirate flag */}
      <span className="ship-flag">🏴‍☠️</span>
    </div>
  );
};

export default AnimatedShip;