import React from 'react';

const AnimatedShip = () => {
  // Animation state
  const [bounce] = React.useState(0);
  
  return (
    <div className="ship-emoji" style={{ 
      transform: `translateY(${bounce * -3}px)` 
    }}>
      🛞
      <span className="ship-flag">🦜</span>
    </div>
  );

};

export default AnimatedShip;