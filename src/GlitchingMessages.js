import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './GlitchingMessages.css';
import { getMessageAppearanceProbability } from './TimeUtils';

const GlitchingMessages = () => {
  const [visible, setVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [glitchClass, setGlitchClass] = useState('');

  // Billie Eilish song title wordplay - wrapped in useMemo
  const messages = useMemo(() => [
    "bury a chest. don't say i didn't warn ya.",
    "ocean maps. when the island comes...",
    "therefore I map...",
    "you should see me with a crown... of shells",
    "bad treasures. duh.",
    "all the good maps fade...",
    "when the island sinks, where do we go?",
    "strange beach treasures",
    "idontwanttobe hidden anymore",
    "listen before I go... digging",
    "ilomilo ways to find it",
    "my future... is buried in sand",
    "getting sand in my shoes",
    "everything I wanted... is in that chest",
    "lost at the beach",
    "no time to map",
    "wish you were here... to help dig",
    "the party is over... time to hunt",
    "not my responsibility... to find it alone",
    "your power... leads to treasure",
    "happier than ever... once it's found",
    "oxytocin rush... from discovery",
    "lovely day for a hunt",
    "hostage of the X on the map",
    "bellyache from digging too much",
    "ocean eyes scanning the horizon",
    "copycat treasures are fake",
    "8 steps from the palm tree",
    "watch out for the deep end",
    "everything strange about the map",
    "come out and play... treasure hunt",
    "when I was older... I found treasures too",
    "bittersand taste of success",
    "metal & sand treasures await",
    "NDA required for this mystery",
    "halley's compass points the way"
  ], []); // Empty dependency array since this never changes

  // Function to show a random message with glitch effect
  const showRandomMessage = useCallback(() => {
    // Hide current message if visible
    if (visible) {
      setGlitchClass('glitch-out');
      setTimeout(() => {
        setVisible(false);
        setGlitchClass('');
      }, 1000);
      return;
    }
    
    // Higher probability to show a message when hidden based on days left
    if (Math.random() < getMessageAppearanceProbability()) {
      // Select random message
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage);
      
      // Show with glitch effect
      setGlitchClass('glitch-in');
      setVisible(true);
      
      // Set timeout to remove after random duration (1.5-5 seconds) - shorter durations for quicker turnover
      setTimeout(() => {
        setGlitchClass('glitch-out');
        setTimeout(() => {
          setVisible(false);
          setGlitchClass('');
        }, 1000);
      }, Math.random() * 3500 + 1500);
    }
  }, [visible, messages]);

  useEffect(() => {
    // Check for showing/hiding message every 1.5-5 seconds (more frequent)
    const interval = setInterval(showRandomMessage, Math.random() * 3500 + 1500);
    
    return () => clearInterval(interval);
  }, [showRandomMessage]);

  if (!visible) return null;

  return (
    <div className={`glitching-message ${glitchClass}`} data-text={currentMessage}>
      {currentMessage}
    </div>
  );
};

export default GlitchingMessages;