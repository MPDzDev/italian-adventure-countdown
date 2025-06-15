import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './DailyEmojiGuesser.css';
import { sendCompletionEmail, wasCompletionEmailSent } from './EmailService';

const DailyEmojiGuesser = () => {
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [revealedLetters, setRevealedLetters] = useState(new Set());
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [todaysChallenge, setTodaysChallenge] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // All emoji challenges with categories
  const emojiChallenges = useMemo(() => [
    { emojis: '🌊👁️', answer: 'OCEAN EYES', category: 'Billie Eilish Song', hint: 'Her breakout hit about blue eyes' },
    { emojis: '🧑‍🚀🪐', answer: 'THE MARTIAN', category: 'Movie', hint: 'Man-Planet - stranded on Mars' },
    { emojis: '👶🐼🥋', answer: 'KUNG FU PANDA', category: 'Movie', hint: 'Baby-Panda-Karate - unlikely kung fu master' },
    { emojis: '🐟🌊👴', answer: 'OLD MAN AND THE SEA', category: 'Book', hint: 'Fish-Ocean-Old - Hemingway classic' },
    { emojis: '🕊️🔫', answer: 'TO KILL A MOCKINGBIRD', category: 'Book', hint: 'Harper Lee\'s masterpiece' },
    { emojis: '🌊🐋', answer: 'MOBY DICK', category: 'Book', hint: 'Call me Ishmael' },
    { emojis: '🍎📱', answer: 'APPLE', category: 'Tech Brand', hint: 'Apple-Phone - think different' },
    { emojis: '🏠🎉🔚', answer: 'WHEN THE PARTYS OVER', category: 'Billie Eilish Song', hint: 'House-Party-Over - time to go home' },
    { emojis: '📱💬', answer: 'WHATSAPP', category: 'Social Media', hint: 'Phone-Chat - messaging app' },
    { emojis: '👎👨', answer: 'BAD GUY', category: 'Billie Eilish Song', hint: 'Duh! This song made her famous' },
    { emojis: '🦁👑', answer: 'LION KING', category: 'Movie', hint: 'Hakuna Matata' },
    { emojis: '🕷️👨', answer: 'SPIDER MAN', category: 'Movie', hint: 'Your friendly neighborhood hero' },
    { emojis: '🏠⬆️', answer: 'UP', category: 'Movie', hint: 'House lifted by balloons' }, 
    { emojis: '🍭💀', answer: 'CANDY CRUSH', category: 'Mobile Game', hint: 'Candy-Skull - match three sweets' },
    { emojis: '👨‍🔬🧪🧠', answer: 'OPPENHEIMER', category: 'Movie', hint: 'Scientist-Chemical-Brain - father of the atomic bomb' },
    { emojis: '🌆🦇🕶️', answer: 'THE DARK KNIGHT', category: 'Movie', hint: 'City-Bat-Sunglasses - Batman\'s darkest hour' },
    { emojis: '🧙‍♂️⚡📚', answer: 'HARRY POTTER', category: 'Book', hint: 'Wizard-Lightning-Book - magical school adventures' },
    { emojis: '💍👑📖', answer: 'LORD OF THE RINGS', category: 'Book', hint: 'Ring-Crown-Book - epic fantasy quest' },
    { emojis: '🦅🔥📚', answer: 'HUNGER GAMES', category: 'Book', hint: 'Bird-Fire-Book - dystopian survival story' },
    { emojis: '🐠🔍📺', answer: 'FINDING NEMO', category: 'Movie', hint: 'Fish-Find-TV - lost clownfish adventure' },
    { emojis: '🦇👨', answer: 'BATMAN', category: 'Movie', hint: 'Dark Knight of Gotham' },
    { emojis: '🚗⚡', answer: 'CARS', category: 'Movie', hint: 'Lightning McQueen\'s story' },
    { emojis: '🌟⚔️', answer: 'STAR WARS', category: 'Movie', hint: 'May the Force be with you' },
    { emojis: '🔔🤢', answer: 'BELLYACHE', category: 'Billie Eilish Song', hint: 'Bell-Y-Ache - stomach pain from this early hit' },
    { emojis: '🐦🐦', answer: 'TWITTER', category: 'Social Media', hint: 'Bird-Bird - tweet tweet' },
    { emojis: '🔴📺', answer: 'YOUTUBE', category: 'Video Platform', hint: 'Red-TV - red play button' },
    { emojis: '🍟🤡', answer: 'MCDONALDS', category: 'Fast Food', hint: 'Fries-Clown - I\'m lovin\' it' },
    { emojis: '😡🐦', answer: 'ANGRY BIRDS', category: 'Mobile Game', hint: 'Mad-Bird - launch birds at pigs' },
    { emojis: '🌹🐻', answer: 'BEAUTY AND THE BEAST', category: 'Book', hint: 'Tale as old as time' },
    { emojis: '🐰🕳️', answer: 'ALICE IN WONDERLAND', category: 'Book', hint: 'Down the rabbit hole' },
    { emojis: '🌪️🏠📖', answer: 'WIZARD OF OZ', category: 'Book', hint: 'Tornado-House-Book - follow the yellow brick road' },
    { emojis: '⭐💰', answer: 'STARBUCKS', category: 'Coffee Brand', hint: 'Star-Bucks - green mermaid logo' },
    { emojis: '🎯🎯', answer: 'TARGET', category: 'Retail Brand', hint: 'Target-Target - bullseye!' },
    { emojis: '🧊👸', answer: 'FROZEN', category: 'Movie', hint: 'Let it go!' },
    { emojis: '🌪️🏠', answer: 'WIZARD OF OZ', category: 'Movie', hint: 'Tornado-House - there\'s no place like home' },
    { emojis: '🧙‍♂️⚡', answer: 'HARRY POTTER', category: 'Movie', hint: 'Wizard-Lightning - the boy who lived' },
    { emojis: '💍👑', answer: 'LORD OF THE RINGS', category: 'Movie', hint: 'One ring to rule them all' },
    { emojis: '🦅🔥', answer: 'HUNGER GAMES', category: 'Movie', hint: 'Bird-Fire - may the odds be ever in your favor' },
    { emojis: '🏃‍♂️💨', answer: 'SUBWAY SURFERS', category: 'Mobile Game', hint: 'Run-Wind - endless runner' },
    { emojis: '🌍4️⃣👁️🅰️Ⓜ️', answer: 'THEREFORE I AM', category: 'Billie Eilish Song', hint: 'There-4-I-Am - philosophical statement' },
    { emojis: '🧠🌀', answer: 'INCEPTION', category: 'Movie', hint: 'Mind-Spiral - dreams within dreams' },
    { emojis: '🐻🍯', answer: 'WINNIE THE POOH', category: 'Movie', hint: 'Bear who loves honey' },
    { emojis: '🎵🎵🎭', answer: 'LA LA LAND', category: 'Movie', hint: 'Music-Theater - city of stars' },
    { emojis: '👨‍🚀🌕', answer: 'INTERSTELLAR', category: 'Movie', hint: 'Astronaut-Moon - space and time' },
    { emojis: '🦕🌴', answer: 'JURASSIC PARK', category: 'Movie', hint: 'Dino-Palm Tree - dinosaurs return' },
    { emojis: '🐧❄️', answer: 'HAPPY FEET', category: 'Movie', hint: 'Penguin-Ice - dancing penguin' },
    { emojis: '👻🚫', answer: 'GHOSTBUSTERS', category: 'Movie', hint: 'Ghost-Stop - who you gonna call?' },
    { emojis: '🐈‍⬛📋', answer: 'COPYCAT', category: 'Billie Eilish Song', hint: 'Copy-Cat - imitation isn\'t flattery' },
    { emojis: '👋🍯', answer: 'LOVELY', category: 'Billie Eilish Song', hint: 'Wave-Bee sounds like this collaboration with Khalid' },
    { emojis: '🦈🌊', answer: 'JAWS', category: 'Movie', hint: 'Shark-Ocean - you\'re gonna need a bigger boat' },
    { emojis: '🍫🏭', answer: 'CHARLIE AND THE CHOCOLATE FACTORY', category: 'Movie', hint: 'Golden ticket adventure' },
    { emojis: '🌌🚀', answer: 'GUARDIANS OF THE GALAXY', category: 'Movie', hint: 'Space heroes with awesome soundtrack' },
    { emojis: '📷📸', answer: 'INSTAGRAM', category: 'Social Media', hint: 'Camera-Photo - photo sharing app' },
    { emojis: '🕵️🚀', answer: 'AMONG US', category: 'Video Game', hint: 'Spy-Spaceship - find the impostor' },
    { emojis: '🎮🎯', answer: 'FORTNITE', category: 'Video Game', hint: 'Game-Target - battle royale' },
    { emojis: '🚢❄️', answer: 'TITANIC', category: 'Movie', hint: 'Ship-Ice - unsinkable ship meets iceberg' },
    { emojis: '🚗💨', answer: 'MARIO KART', category: 'Video Game', hint: 'Car-Speed - racing with power-ups' }
  ], []);

  // Get today's challenge based on date
  useEffect(() => {
    const getTodaysChallenge = () => {
      setIsLoading(true);
      try {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 0);
        const dayOfYear = Math.floor((today - startOfYear) / 86400000);

        const seed = today.getFullYear() * 1000 + dayOfYear;
        const index = seed % emojiChallenges.length;
        const challenge = emojiChallenges[index];

        const dateKey = `${today.getFullYear()}_${dayOfYear}`;
        
        setTodaysChallenge(challenge);
        
        // Load saved game state for today
        const savedState = localStorage.getItem(`emojiGuesser_${dateKey}`);
        if (savedState) {
          const state = JSON.parse(savedState);
          setGuesses(state.guesses || []);
          setRevealedLetters(new Set(state.revealedLetters || []));
          setIsGameComplete(state.isGameComplete || false);
          setIsWin(state.isWin || false);
        }
      } catch (error) {
        console.error('Error setting up daily emoji challenge:', error);
        setTodaysChallenge(emojiChallenges[0]);
      }
      setIsLoading(false);
    };

    getTodaysChallenge();
  }, [emojiChallenges]);

  // Save game state
  useEffect(() => {
    if (todaysChallenge && guesses.length > 0) {
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 0);
      const dayOfYear = Math.floor((today - startOfYear) / 86400000);
      const dateKey = `${today.getFullYear()}_${dayOfYear}`;

      localStorage.setItem(`emojiGuesser_${dateKey}`, JSON.stringify({
        guesses,
        revealedLetters: Array.from(revealedLetters),
        isGameComplete,
        isWin
      }));
    }
  }, [guesses, revealedLetters, isGameComplete, isWin, todaysChallenge]);

  // Send completion notification
  const sendCompletionNotification = useCallback(async (attempts, won) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const result = await sendCompletionEmail('DailyEmojiGuesser', {
        emojis: todaysChallenge.emojis,
        answer: todaysChallenge.answer,
        category: todaysChallenge.category,
        attempts,
        won,
        date: new Date().toLocaleDateString(),
        completionTime: new Date().toLocaleString()
      });
      
      if (result.success) {
        console.log('Emoji guesser completion notification sent!');
      }
    } catch (error) {
      console.error('Error sending emoji guesser completion notification:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, todaysChallenge]);

  // Reveal a random letter
  const revealRandomLetter = useCallback(() => {
    if (!todaysChallenge) return;
    
    const answer = todaysChallenge.answer;
    const unrevealedLetters = answer
      .split('')
      .filter((char, index) => !revealedLetters.has(index) && char !== ' ')
      .map((char, arrayIndex) => {
        const originalIndex = answer.split('').findIndex((c, i) => 
          c === char && !revealedLetters.has(i) && 
          answer.split('').slice(0, i).filter(prev => prev === char).length === 
          answer.split('').slice(0, arrayIndex + revealedLetters.size).filter(prev => prev === char).length
        );
        return originalIndex;
      })
      .filter(index => index !== -1);
    
    if (unrevealedLetters.length > 0 && revealedLetters.size < Math.floor(answer.replace(/\s/g, '').length / 2)) {
      const randomIndex = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
      setRevealedLetters(prev => new Set([...prev, randomIndex]));
    }
  }, [todaysChallenge, revealedLetters]);

  // Handle guess submission
  const handleGuessSubmit = useCallback(() => {
    if (!currentGuess.trim() || !todaysChallenge) return;
    
    const normalizedGuess = currentGuess.toUpperCase().trim();
    const normalizedAnswer = todaysChallenge.answer.toUpperCase();
    
    // Check for duplicate guesses
    if (guesses.includes(normalizedGuess)) {
      setFeedback('You already tried that guess!');
      setTimeout(() => setFeedback(''), 2000);
      return;
    }

    const newGuesses = [...guesses, normalizedGuess];
    setGuesses(newGuesses);
    
    if (normalizedGuess === normalizedAnswer) {
      setIsWin(true);
      setIsGameComplete(true);
      setFeedback('🎉 Correct! You decoded the emoji clue!');
      
      if (!wasCompletionEmailSent('DailyEmojiGuesser')) {
        sendCompletionNotification(newGuesses.length, true);
      }
    } else {
      // Wrong guess - reveal a letter and check if max guesses reached
      revealRandomLetter();
      
      if (newGuesses.length >= 6) {
        setIsGameComplete(true);
        setFeedback(`Game over! The answer was: ${todaysChallenge.answer}`);
        sendCompletionNotification(newGuesses.length, false);
      } else {
        setFeedback('Not quite right. A letter has been revealed!');
        setTimeout(() => setFeedback(''), 2000);
      }
    }
    
    setCurrentGuess('');
  }, [currentGuess, todaysChallenge, guesses, revealRandomLetter, sendCompletionNotification]);

  // Handle key press
  const handleKeyDown = useCallback((e) => {
    if (isGameComplete) return;
    
    if (e.key === 'Enter') {
      handleGuessSubmit();
    }
  }, [isGameComplete, handleGuessSubmit]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Display word with revealed letters
  const displayWord = () => {
    if (!todaysChallenge) return '';
    
    return todaysChallenge.answer
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' ';
        if (revealedLetters.has(index) || isGameComplete) return char;
        return '_';
      })
      .join('');
  };

  if (isLoading) {
    return <div className="emoji-guesser-container loading">Loading today's emoji puzzle...</div>;
  }

  if (!todaysChallenge) {
    return <div className="emoji-guesser-container">Error loading puzzle. Try refreshing!</div>;
  }

  const todayString = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="emoji-guesser-container">
      <h2 className="emoji-guesser-title">Daily Emoji Decoder</h2>
      <p className="emoji-guesser-date">{todayString}</p>
      
      <div className="category-display">
        <p>Category: <span className="category-text">{todaysChallenge.category}</span></p>
      </div>
      
      <div className="emoji-display">
        <div className="emoji-clue">{todaysChallenge.emojis}</div>
      </div>
      
      <div className="word-display">
        <div className="word-letters">
          {displayWord().split('').map((char, index) => (
            <span 
              key={index} 
              className={`letter ${char === '_' ? 'hidden' : char === ' ' ? 'space' : 'revealed'}`}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </div>
      
      <div className="hint-section">
        <p className="hint">💡 Hint: {todaysChallenge.hint}</p>
      </div>
      
      {!isGameComplete && (
        <div className="guess-input-section">
          <div className="guess-input-group">
            <input
              type="text"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
              placeholder="Enter your guess..."
              className="guess-input"
              maxLength={50}
            />
            <button 
              onClick={handleGuessSubmit}
              disabled={!currentGuess.trim()}
              className="guess-submit-btn"
            >
              Guess
            </button>
          </div>
        </div>
      )}
      
      {feedback && (
        <div className={`feedback-message ${isWin ? 'success' : 'info'}`}>
          {feedback}
        </div>
      )}
      
      <div className="game-stats">
        <div className="stat">
          <span className="stat-label">Guesses:</span>
          <span className="stat-value">{guesses.length}/6</span>
        </div>
        <div className="stat">
          <span className="stat-label">Letters Revealed:</span>
          <span className="stat-value">{revealedLetters.size}</span>
        </div>
      </div>
      
      {guesses.length > 0 && (
        <div className="previous-guesses">
          <h4>Your Guesses:</h4>
          <div className="guess-list">
            {guesses.map((guess, index) => (
              <span key={index} className="guess-item">
                {guess}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {isGameComplete && (
        <div className="game-complete">
          {isWin ? (
            <p className="win-message">
              🎉 Congratulations! You decoded it in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}!
            </p>
          ) : (
            <p className="lose-message">
              Better luck tomorrow! The answer was: <strong>{todaysChallenge.answer}</strong>
            </p>
          )}
          <p className="next-day-msg">Come back tomorrow for a new emoji challenge!</p>
        </div>
      )}
    </div>
  );
};

export default DailyEmojiGuesser;