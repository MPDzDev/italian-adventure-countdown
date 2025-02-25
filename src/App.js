import React, { useState, useEffect } from 'react';
import './App.css';
import italyTrivia from './italyTrivia';
import AnimatedVespa from './AnimatedVespa';

function App() {
  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [currentTrivia, setCurrentTrivia] = useState('');
  const [triviaIndex, setTriviaIndex] = useState(0);

  useEffect(() => {
    // Calculate progress and days left
    const calculateProgress = () => {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const targetDate = new Date(now.getFullYear(), 6, 20); // July is month 6 (0-indexed)
      
      const totalDays = Math.floor((targetDate - startOfYear) / (1000 * 60 * 60 * 24));
      const daysPassed = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
      
      const calculatedProgress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
      const calculatedDaysLeft = Math.max(0, Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24)));
      
      setProgress(calculatedProgress);
      setDaysLeft(calculatedDaysLeft);
    };

    calculateProgress();
    const timer = setInterval(calculateProgress, 86400000); // Update once per day

    // Get trivia for today
    const todayIndex = new Date().getDate() % italyTrivia.length;
    setTriviaIndex(todayIndex);
    setCurrentTrivia(italyTrivia[todayIndex]);

    return () => clearInterval(timer);
  }, []);

  const handleNextTrivia = () => {
    const newIndex = (triviaIndex + 1) % italyTrivia.length;
    setTriviaIndex(newIndex);
    setCurrentTrivia(italyTrivia[newIndex]);
  };

  return (
    <div className="app">
      <header>
        <h1>Countdown to Italian Adventure!</h1>
        <h2>{daysLeft} days until we meet in Italy!</h2>
      </header>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }} className="progress-fill"></div>
          <AnimatedVespa position={progress} />
        </div>
        <div className="progress-labels">
          <span>January 1</span>
          <span>July 20</span>
        </div>
      </div>
      
      <div className="trivia-section">
        <h3>Today's Italian Treasure:</h3>
        <div className="trivia-card">
          <p>{currentTrivia}</p>
        </div>
        <button onClick={handleNextTrivia}>Discover Another Treasure</button>
      </div>
      
      <div className="treasure-map">
        <h3>Places We'll Explore:</h3>
        <ul>
          <li>Rome: The Eternal City with ancient ruins</li>
          <li>Venice: The floating city of canals</li>
          <li>Florence: Home to Renaissance art</li>
          <li>Pisa: See the famous leaning tower</li>
          <li>Amalfi Coast: Beautiful seaside villages</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
