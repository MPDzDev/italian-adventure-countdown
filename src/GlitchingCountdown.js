import React, { useState, useEffect } from 'react';
import './GlitchingCountdown.css';
import { getGlitchFrequency } from './TimeUtils';

const GlitchingCountdown = ({ daysLeft }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [displayedValue, setDisplayedValue] = useState(daysLeft);
  const [glitchVariant, setGlitchVariant] = useState(0);
  
  // Random messages to display during glitches
  const glitchMessages = [
    "ERROR_TIMESTREAM_CORRUPTED",
    "COUNTDOWN_COMPROMISED",
    "SYNCHRONIZING...",
    "TIMELINE_FRACTURED",
    "QUANTUM_DISPLACEMENT",
    "RECALIBRATING_VECTORS",
    "TEMPORAL_ANOMALY",
    "INTERFERENCE_DETECTED",
    "COUNTDOWN.EXE_FAILED",
    "PATH_UNCERTAIN",
    "CONNECTION_UNSTABLE",
    "COORDINATES_SHIFTING"
  ];
  
  // Random days to display during glitches
  const getRandomDays = () => {
    // 50% chance to show a date close to real value
    if (Math.random() < 0.5) {
      // Within 10 days of actual value
      return Math.max(0, daysLeft + Math.floor(Math.random() * 21) - 10);
    } else {
      // Completely random value between 0 and 365
      return Math.floor(Math.random() * 366);
    }
  };
  
  // Random glitching effect
  useEffect(() => {
    // Update display value when days left changes
    setDisplayedValue(daysLeft);
    
    // Calculate probability of glitching based on days left
    const getGlitchProbability = () => {
      // Higher probability when further from the date, lower as we get closer
      if (daysLeft > 120) return 0.25;    // Very high early on (>4 months out)
      if (daysLeft > 90) return 0.20;     // Still high (3-4 months out)
      if (daysLeft > 60) return 0.15;     // Moderate (2-3 months out)
      if (daysLeft > 30) return 0.10;     // Less frequent (1-2 months out)
      if (daysLeft > 14) return 0.05;     // Sparse (2 weeks-1 month out)
      return 0.02;                        // Rare in final two weeks
    };
    
    // Randomly trigger glitch effect (probability based on time left, checked every 5 seconds)
    const glitchInterval = setInterval(() => {
      if (Math.random() < getGlitchFrequency()) {
        triggerGlitch();
      }
    }, 5000);
    
    return () => clearInterval(glitchInterval);
  }, [daysLeft]);
  
  const triggerGlitch = () => {
    // Start glitching
    setIsGlitching(true);
    
    // Determine which type of glitch to show
    const variant = Math.floor(Math.random() * 3);
    setGlitchVariant(variant);
    
    // If showing random number or message
    if (variant === 1) {
      setDisplayedValue(getRandomDays());
    } else if (variant === 2) {
      // Random message
      const randomMessage = glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
      setDisplayedValue(randomMessage);
    }
    
    // Create a series of rapid changes for visual effect
    const glitchDuration = 2000; // 2 seconds of glitching
    const changes = 10; // Number of visual changes
    
    // Create rapid changes
    for (let i = 0; i < changes; i++) {
      setTimeout(() => {
        if (variant === 0) {
          // Flicker between correct and incorrect
          setDisplayedValue(i % 2 === 0 ? daysLeft : getRandomDays());
        } else if (variant === 1) {
          // Continuously show random numbers
          setDisplayedValue(getRandomDays());
        }
        // If variant 2, keep showing the same message
      }, (glitchDuration / changes) * i);
    }
    
    // End glitching after duration
    setTimeout(() => {
      setIsGlitching(false);
      setDisplayedValue(daysLeft);
    }, glitchDuration);
  };
  
  return (
    <div className={`countdown-container ${isGlitching ? 'glitching' : ''}`}>
      <span 
        className={`days-value ${isGlitching ? `glitching-variant-${glitchVariant}` : ''}`}
      >
        {displayedValue}
      </span>
      <span className="days-label">
        {isGlitching && glitchVariant === 2 
          ? "ANOMALY" 
          : isGlitching && glitchVariant === 1 
            ? "CORRUPTED"
            : "days until the adventure begins"}
      </span>
    </div>
  );
};

export default GlitchingCountdown;