import React from 'react';

const AnimatedVespa = ({ position }) => {
  // Animation state
  const [bounce, setBounce] = React.useState(0);
  
  // Create a small bounce effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setBounce(prev => (prev === 0 ? 1 : 0));
    }, 600); // Slightly slower for a more mysterious feel
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="vespa" 
      style={{ 
        left: `${position}%`,
        transform: `translateX(-50%) translateY(${bounce * -3}px)`
      }}
    >
      <div className="vespa-emoji">🛵</div>
      <div className="vespa-shadow"></div>
    </div>
  );
};

export default AnimatedVespa;