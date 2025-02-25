import React, { useState, useEffect } from 'react';
import GlitchingMessages from './GlitchingMessages';

const GlitchingMessagesWrapper = () => {
  const [instances, setInstances] = useState(1);
  
  useEffect(() => {
    // Start with one instance
    setInstances(1);
    
    // Randomly add more instances occasionally
    const randomAddInterval = setInterval(() => {
      // 20% chance to add a new instance if less than 3 are showing
      if (Math.random() < 0.2 && instances < 3) {
        setInstances(prev => Math.min(prev + 1, 3));
      }
      
      // 30% chance to reduce instances if more than 1 showing
      if (Math.random() < 0.3 && instances > 1) {
        setInstances(prev => Math.max(prev - 1, 1));
      }
    }, 5000);
    
    return () => clearInterval(randomAddInterval);
  }, [instances]);
  
  return (
    <>
      {Array.from({ length: instances }).map((_, i) => (
        <GlitchingMessages key={i} />
      ))}
    </>
  );
};

export default GlitchingMessagesWrapper;