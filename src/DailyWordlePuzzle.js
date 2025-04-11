import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './DailyWordlePuzzle.css';
import { sendCompletionEmail, wasCompletionEmailSent } from './EmailService';

const DailyWordlePuzzle = () => {
  // State to manage guesses, current attempt, game status, etc.
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [dailyWord, setDailyWord] = useState('');
  const [wordInfo, setWordInfo] = useState({ category: '', info: '' });
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Word lists
  const italyWords = useMemo (() => [
    { word: 'PIZZA', category: 'Italian Food', info: 'Italy\'s most famous dish, originating in Naples.' },
    { word: 'PASTA', category: 'Italian Food', info: 'A staple of Italian cuisine, comes in hundreds of shapes.' },
    { word: 'ROME', category: 'Italian City', info: 'The capital of Italy and home to the Colosseum.' },
    { word: 'VENICE', category: 'Italian City', info: 'Famous city built on water with gondolas instead of cars.' },
    { word: 'TUSCANY', category: 'Italian Region', info: 'Known for its landscapes, traditions, history and wines.' },
    { word: 'FERRARI', category: 'Italian Brand', info: 'Luxury sports car manufacturer founded in 1939.' },
    { word: 'VESPA', category: 'Italian Product', info: 'Iconic Italian scooter that transformed urban mobility.' },
    { word: 'GELATO', category: 'Italian Food', info: 'Italy\'s delicious answer to ice cream.' },
    { word: 'FLORENCE', category: 'Italian City', info: 'Birthplace of the Renaissance, home to many masterpieces.' },
    { word: 'RISOTTO', category: 'Italian Food', info: 'Creamy rice dish originating from northern Italy.' },
    { word: 'CAPRI', category: 'Italian Island', info: 'Island in the Bay of Naples known for its Blue Grotto.' },
    { word: 'TIRAMISU', category: 'Italian Dessert', info: 'Popular coffee-flavored dessert made with ladyfingers.' },
    { word: 'SICILY', category: 'Italian Island', info: 'Largest Mediterranean island with rich history.' },
    { word: 'PISA', category: 'Italian City', info: 'Home to the famous Leaning Tower.' },
    { word: 'VATICAN', category: 'Italian Location', info: 'World\'s smallest country, located within Rome.' }
  ], []);

  const billieWords = useMemo (() => [
    { word: 'OCEAN', category: 'Billie Eilish Song', info: 'Eyes reference in one of her earliest hits.' },
    { word: 'BAD', category: 'Billie Eilish Song', info: 'Guy followed by "duh" in one of her most famous songs.' },
    { word: 'HAPPIER', category: 'Billie Eilish Song', info: 'Than ever in this 2021 hit.' },
    { word: 'BURY', category: 'Billie Eilish Song', info: 'A friend in this dark track.' },
    { word: 'ILOMILO', category: 'Billie Eilish Song', info: 'Named after a puzzle video game, about fear of separation.' },
    { word: 'EVERYTHING', category: 'Billie Eilish Song', info: 'I wanted in this dreamy track about desires.' },
    { word: 'BELLYACHE', category: 'Billie Eilish Song', info: 'Physical discomfort is the title of this early hit.' },
    { word: 'PARTY', category: 'Billie Eilish Song', info: 'Over in this slow, melancholic track.' },
    { word: 'COPYCAT', category: 'Billie Eilish Song', info: 'Imitation isn\'t flattery in this confrontational song.' },
    { word: 'OXYTOCIN', category: 'Billie Eilish Song', info: 'Named after the love hormone, this is one of her darker tracks.' },
    { word: 'THEREFORE', category: 'Billie Eilish Song', info: 'I am in this philosophical track title.' },
    { word: 'BORED', category: 'Billie Eilish Song', info: 'Feeling of tedium titled this track from "13 Reasons Why".' },
    { word: 'XANNY', category: 'Billie Eilish Song', info: 'Prescription drug referenced in this song about substance abuse.' },
    { word: 'LOST', category: 'Billie Eilish Song', info: 'Cause in this track about being out of options.' },
    { word: 'HALLEY', category: 'Billie Eilish Song', info: 'The comet referenced in this dreamy track.' }
  ],[]);

  // Combine the word lists
  const allWords = useMemo(() => [...italyWords, ...billieWords], [italyWords, billieWords]);

  // Generate a seeded random number based on the date
  const getSeededRandom = (seed) => {
    let m = 2**35 - 31;
    let a = 185852;
    let s = seed % m;
    return function() {
      return (s = s * a % m) / m;
    };
  };

  // Update keyboard status based on guesses
  const updateKeyboardFromGuesses = useCallback((existingGuesses, word) => {
    const newKeyboardStatus = {};
    
    existingGuesses.forEach(guess => {
      const upperGuess = guess.toUpperCase();
      const upperWord = word.toUpperCase();
      
      for (let i = 0; i < upperGuess.length; i++) {
        const letter = upperGuess[i];
        
        if (upperWord[i] === letter) {
          // Correct position
          newKeyboardStatus[letter] = 'correct';
        } else if (upperWord.includes(letter) && newKeyboardStatus[letter] !== 'correct') {
          // Included but wrong position, don't override 'correct'
          newKeyboardStatus[letter] = 'present';
        } else if (!upperWord.includes(letter)) {
          // Not in word
          newKeyboardStatus[letter] = 'absent';
        }
      }
    });
    
    setKeyboardStatus(newKeyboardStatus);
  }, []);

  // Send notification for completed puzzle
  const sendCompletionNotification = useCallback(async (attempts) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const result = await sendCompletionEmail('DailyWordle', {
        word: dailyWord,
        category: wordInfo.category,
        attempts,
        date: new Date().toLocaleDateString(),
        completionTime: new Date().toLocaleString()
      });
      
      if (result.success) {
        console.log('Wordle completion notification sent!');
      } else {
        console.error('Failed to send wordle completion notification:', result.error);
      }
    } catch (error) {
      console.error('Error sending wordle completion notification:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, dailyWord, wordInfo]);

  // Submit the current guess
  const submitGuess = useCallback(() => {
    if (currentGuess.length !== dailyWord.length) {
      setFeedback(`Word must be ${dailyWord.length} letters!`);
      setTimeout(() => setFeedback(''), 2000);
      return;
    }

    // Checking for duplicate guesses
    if (guesses.includes(currentGuess)) {
      setFeedback('You already tried this word!');
      setTimeout(() => setFeedback(''), 2000);
      return;
    }

    // Add guess to the list
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    
    // Update keyboard status
    updateKeyboardFromGuesses(newGuesses, dailyWord);

    // Check if correct
    if (currentGuess.toUpperCase() === dailyWord.toUpperCase()) {
      setIsWin(true);
      setIsGameOver(true);
      setFeedback('Congratulations! You found the word!');
      
      // Send completion notification
      if (!wasCompletionEmailSent('DailyWordle')) {
        sendCompletionNotification(newGuesses.length);
      }
    } else if (newGuesses.length >= 6) {
      // Out of attempts
      setIsGameOver(true);
      setFeedback(`Game over! The word was ${dailyWord}.`);
    }

    // Clear current guess
    setCurrentGuess('');
  }, [
    currentGuess, 
    dailyWord, 
    guesses, 
    updateKeyboardFromGuesses, 
    sendCompletionNotification
  ]);

  // Get today's word based on the date
  useEffect(() => {
    const fetchDailyWord = () => {
      setIsLoading(true);
      try {
        // Get current date as seed
        const today = new Date();
        const dateString = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
        const seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Use seeded random to get consistent word for the day
        const random = getSeededRandom(seed);
        const index = Math.floor(random() * allWords.length);
        const todaysWord = allWords[index];
        
        // Set today's word and info
        setDailyWord(todaysWord.word);
        setWordInfo({
          category: todaysWord.category,
          info: todaysWord.info
        });

        // Load saved game state for today
        const savedState = localStorage.getItem(`wordlePuzzle_${dateString}`);
        if (savedState) {
          const state = JSON.parse(savedState);
          setGuesses(state.guesses || []);
          setIsGameOver(state.isGameOver || false);
          setIsWin(state.isWin || false);

          // Reconstruct keyboard status
          if (state.guesses && state.guesses.length > 0) {
            updateKeyboardFromGuesses(state.guesses, todaysWord.word);
          }
        }
      } catch (error) {
        console.error('Error setting up daily word:', error);
        // Fallback to a default word if something goes wrong
        setDailyWord('PIZZA');
        setWordInfo({
          category: 'Italian Food',
          info: 'Default word due to error.'
        });
      }
      setIsLoading(false);
    };

    fetchDailyWord();
  }, [allWords, updateKeyboardFromGuesses]);

  // Save game state to localStorage
  useEffect(() => {
    if (dailyWord && guesses.length > 0) {
      const today = new Date();
      const dateString = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
      
      localStorage.setItem(`wordlePuzzle_${dateString}`, JSON.stringify({
        guesses,
        isGameOver,
        isWin
      }));
    }
  }, [guesses, isGameOver, isWin, dailyWord]);

  // Handle key press
  const handleKeyDown = useCallback((e) => {
    if (isGameOver) return;
    
    if (e.key === 'Enter') {
      submitGuess();
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      if (currentGuess.length < dailyWord.length) {
        setCurrentGuess(prev => prev + e.key.toUpperCase());
      }
    }
  }, [currentGuess, isGameOver, dailyWord, submitGuess]);

  // Attach keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle virtual keyboard click
  const handleKeyClick = (key) => {
    if (isGameOver) return;
    
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < dailyWord.length) {
      setCurrentGuess(prev => prev + key);
    }
  };

  // Get letter tile status (correct, present, absent)
  const getLetterStatus = (guess, index) => {
    if (!dailyWord) return '';
    
    const guessLetter = guess[index].toUpperCase();
    const wordLetter = dailyWord[index].toUpperCase();
    
    if (guessLetter === wordLetter) {
      return 'correct';
    } else if (dailyWord.toUpperCase().includes(guessLetter)) {
      return 'present';
    }
    return 'absent';
  };

  // Render empty tile row
  const renderEmptyRow = (length, rowIndex) => {
    return (
      <div className="word-row" key={`empty-${rowIndex}`}>
        {Array.from({ length }).map((_, i) => (
          <div className="letter-tile empty" key={`empty-${rowIndex}-${i}`}>
            {rowIndex === guesses.length && i < currentGuess.length ? currentGuess[i] : ''}
          </div>
        ))}
      </div>
    );
  };

  // Keyboard layout
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  // Loading state
  if (isLoading) {
    return <div className="wordle-container loading">Loading today's word puzzle...</div>;
  }

  // Get today's date string
  const todayString = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="wordle-container">
      <h2 className="wordle-title">Daily Word Puzzle</h2>
      <p className="wordle-date">{todayString}</p>
      <div className="category-display">
        <p>Category: <span className="category-text">{wordInfo.category}</span></p>
      </div>
      
      <div className="wordle-grid">
        {/* Rendered guesses */}
        {guesses.map((guess, rowIndex) => (
          <div className="word-row" key={rowIndex}>
            {Array.from({ length: dailyWord.length }).map((_, i) => (
              <div 
                className={`letter-tile ${i < guess.length ? getLetterStatus(guess, i) : 'empty'}`} 
                key={`${rowIndex}-${i}`}
              >
                {i < guess.length ? guess[i] : ''}
              </div>
            ))}
          </div>
        ))}
        
        {/* Current guess row */}
        {!isGameOver && guesses.length < 6 && renderEmptyRow(dailyWord.length, guesses.length)}
        
        {/* Empty rows */}
        {Array.from({ length: Math.max(0, 5 - guesses.length) }).map((_, i) => (
          renderEmptyRow(dailyWord.length, guesses.length + i + 1)
        ))}
      </div>
      
      {/* Feedback message */}
      {feedback && <div className="feedback-message">{feedback}</div>}
      
      {/* Show answer if game over */}
      {isGameOver && (
        <div className="game-over-info">
          {isWin ? (
            <p className="win-message">You found today's word in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}! A coin was added to the chest! 🪙</p>
          ) : (
            <p className="lose-message">The word was: <span className="answer-word">{dailyWord}</span></p>
          )}
          <p className="word-info">{wordInfo.info}</p>
          <p className="next-day-msg"> Come back tomorrow for a new word!</p>
        </div>
      )}
      
      {/* Virtual keyboard */}
      <div className="virtual-keyboard">
        {keyboardRows.map((row, rowIndex) => (
          <div className="keyboard-row" key={rowIndex}>
            {row.map(key => (
              <button 
                key={key} 
                className={`keyboard-key ${key.length > 1 ? 'special-key' : ''} ${keyboardStatus[key] || ''}`}
                onClick={() => handleKeyClick(key)}
              >
                {key === 'BACKSPACE' ? '←' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyWordlePuzzle;