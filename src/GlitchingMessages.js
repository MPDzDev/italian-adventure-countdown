import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './GlitchingMessages.css';
import { getMessageAppearanceProbability } from './TimeUtils';

const GlitchingMessages = () => {
  const [visible, setVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [glitchClass, setGlitchClass] = useState('');
  const colorOptions = useMemo(
    () => [
      '#ff5bde',
      '#22d3ee',
      '#facc15',
      '#34d399',
      '#a78bfa'
    ],
    []
  );
  const [messageColor, setMessageColor] = useState(colorOptions[0]);
  const glitchTransitions = useMemo(
    () => ({
      "rosewood's secrets always surface. -A": "Lido Adriano's secrets always surface. -A",
      "meet me in Rosewood's town square. -A": "meet me in Lido Adriano's town square. -A",
    }),
    []
  );

  // Billie Eilish song title wordplay with a dash of A's warnings - wrapped in useMemo
  const messages = useMemo(() => [
    "got a secret, can you keep it? -A",
    "i'm watching you, little liars. -A",
    "time's almost up, better confess. -A",
    "tick-tock, bitches. -A",
    "i know everything you're hiding. -A",
    "rosewood's secrets always surface. -A",
    "hanna's heels can't outrun me. -A",
    "spencer won't puzzle this out in time. -A",
    "aria's typewriter can't rewrite your past. -A",
    "emily knows what you did at the pool. -A",
    "mona sends her regards. -A",
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
    "lost at the beach... near Pisa",
    "no time to map... the Italian coast",
    "wish you were here... for pizza by the sea",
    "the party is over... the pizzeria awaits",
    "not my responsibility... to knead the dough alone",
    "your power... leads to secret recipes",
    "happier than ever... with flour on my hands",
    "oxytocin rush... from fresh-baked crust",
    "lovely day for a hunt... in Italian hills",
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
    "halley's compass points the way",
    "x marks the spot where billie lies",
    "plunder the bad guy's treasure",
    "set sail before the ocean rises",
    "15 paces from the lonely island",
    "pirate's crown of gold and bones",
    "seize the booty before the party's over",
    "walk the plank into the deep end",
    "a pirate's life for me... and you?",
    "the kraken awaits in the ilomilo depths",
    "captains log: treasure buried at dawn",
    "all ye good sailors must surrender",
    "black sails on the horizon, don't blink",
    "a cutlass and a compass to guide ye",
    "pieces of eight hidden in plain sight",
    "maritime law: finders keepers",
    "yo ho ho and a bottle of lovely treasures",
    "marooned with nothing but time to dig",
    "hoist the jolly roger before sunrise",
    "mutiny against the tides of time",
    "saltwater pearls for your ocean eyes",
    "shipwrecked on strange fantasy shores",
    "the sea swallows all secrets eventually",
    "when we all fall asleep, the pirates come",
    "listen to the siren's song before you go",
    "therefore I am the captain now",
    "seven seas, seven treasures, one map",
    "lost in davy jones' locker forever",
    "a pirate's oath: no buried treasure left behind",
    "your power won't save ye from the depths",
    "dead men tell no tales, but maps do",
    "shiver me timbers, the chest is empty",
    "avast ye! xanny marks the spot",
    "what was promised is burried 'neath the waves",
    "all hands on deck! treasure be near",
    "a golden doubloon for your thoughts",
    "meet me in Rosewood's town square. -A",
    "Ezra's chapters hide more than words. -A",
    "Radley has room for secrets. -A",
    "Mona's game isn't over. -A",
    "what would Spencer do? -A"
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

      // Choose a new color different from the last one
      if (colorOptions.length > 1) {
        let nextColor = messageColor;
        while (nextColor === messageColor) {
          nextColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        }
        setMessageColor(nextColor);
      }

      // Show with glitch effect
      setGlitchClass('glitch-in');
      setVisible(true);

      if (glitchTransitions[randomMessage]) {
        setTimeout(() => {
          setGlitchClass('glitch-out');
          setTimeout(() => {
            setCurrentMessage(glitchTransitions[randomMessage]);
            setGlitchClass('glitch-in');
          }, 150);
        }, 700);
      }
      
      // Set timeout to remove after random duration (1.5-5 seconds) - shorter durations for quicker turnover
      setTimeout(() => {
        setGlitchClass('glitch-out');
        setTimeout(() => {
          setVisible(false);
          setGlitchClass('');
        }, 1000);
      }, Math.random() * 3500 + 1500);
    }
  }, [visible, messages, glitchTransitions, messageColor, colorOptions]);

  useEffect(() => {
    // Check for showing/hiding message every 1.5-5 seconds (more frequent)
    const interval = setInterval(showRandomMessage, Math.random() * 3500 + 1500);
    
    return () => clearInterval(interval);
  }, [showRandomMessage]);

  if (!visible) return null;

  return (
    <div
      className={`glitching-message ${glitchClass}`}
      data-text={currentMessage}
      style={{
        color: messageColor,
        textShadow: `0 0 5px ${messageColor}`,
        '--message-color': messageColor
      }}
    >
      {currentMessage}
    </div>
  );
};

export default GlitchingMessages;