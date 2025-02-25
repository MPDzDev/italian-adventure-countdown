import React, { useState, useEffect, useMemo } from 'react';
import './PirateBattle.css';
import { sendCompletionEmail, wasCompletionEmailSent } from './EmailService';

const PirateBattle = () => {
  // Riddles with answers - wrapped in useMemo
  const riddles = useMemo(() => [
    {
      id: 1,
      text: "I stare with ocean eyes, guiding sailors through the dark. Standing tall where land meets sea, my light creates a spark.",
      answer: "lighthouse"
    },
    {
      id: 2,
      text: "I bury a friend beneath golden grains, where Italian shores meet salty blue. Castles rise and fall on me daily.",
      answer: "sand"
    },
    {
      id: 3,
      text: "The bad guy's Italian steed with wheels instead of hooves, buzzing through Roman streets leaving tracks behind.",
      answer: "vespa"
    },
    {
      id: 4,
      text: "When the party's over and the Italian sky turns dark, I'm the queen of night watching over Venice canals.",
      answer: "moon"
    },
    {
      id: 5,
      text: "You should see me with a crown of stone arches. Once where gladiators fought, now I stand in Roma's heart.",
      answer: "colosseum"
    },
    {
      id: 6,
      text: "ilomilo, lost at sea. The sailor's guide when stars aren't visible, pointing always north.",
      answer: "compass"
    },
    {
      id: 7,
      text: "Everything I wanted beneath the Italian boot, this volcanic island's blue grotto shines with magic light.",
      answer: "capri"
    },
    {
      id: 8,
      text: "Therefore I am essential for pirates seeking gold. Without me, X never marks the spot of treasures to be found.",
      answer: "map"
    },
    {
      id: 9,
      text: "My future is written in the burning mountain's shadow, this ancient Italian city frozen in time by ash.",
      answer: "pompeii"
    },
    {
      id: 10,
      text: "Causing bellyache when eaten too quickly, this circular Italian treasure topped with cheese and tomato.",
      answer: "pizza"
    }
  ], []); // Empty dependency array since this never changes

  // State for current answers and battle progress
  const [answers, setAnswers] = useState({});
  const [battlePercentage, setBattlePercentage] = useState(0);
  const [riddleStates, setRiddleStates] = useState({});
  const [battleComplete, setBattleComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem('pirateRiddleAnswers');
    const savedStates = localStorage.getItem('pirateRiddleStates');
    
    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers);
      setAnswers(parsedAnswers);
      
      // Calculate battle percentage based on correct answers
      const correctCount = Object.values(parsedAnswers).filter(answer => {
        const riddle = riddles.find(r => r.id === parseInt(answer.riddleId));
        return riddle && answer.text.toLowerCase() === riddle.answer.toLowerCase();
      }).length;
      
      const newPercentage = (correctCount / riddles.length) * 100;
      setBattlePercentage(newPercentage);
      
      // Check if battle is complete
      if (newPercentage === 100) {
        setBattleComplete(true);
      }
    }
    
    if (savedStates) {
      setRiddleStates(JSON.parse(savedStates));
    } else {
      // Initialize states for all riddles
      const initialStates = {};
      riddles.forEach(riddle => {
        initialStates[riddle.id] = {
          isCorrect: false,
          isSubmitted: false,
          attempts: 0
        };
      });
      setRiddleStates(initialStates);
      localStorage.setItem('pirateRiddleStates', JSON.stringify(initialStates));
    }
  }, [riddles]); // Added riddles to dependency array

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('pirateRiddleAnswers', JSON.stringify(answers));
    }
  }, [answers]);

  // Save riddle states to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(riddleStates).length > 0) {
      localStorage.setItem('pirateRiddleStates', JSON.stringify(riddleStates));
    }
  }, [riddleStates]);

  // Send email notification when battle is complete
  useEffect(() => {
    const notifyCompletion = async () => {
      if (battleComplete && !isSubmitting && !wasCompletionEmailSent('PirateRiddles')) {
        setIsSubmitting(true);
        
        try {
          // Get all the correct answers to include in the email
          const allAnswers = {};
          riddles.forEach(riddle => {
            if (riddleStates[riddle.id]?.isCorrect) {
              allAnswers[riddle.id] = {
                riddle: riddle.text,
                answer: riddle.answer,
                attempts: riddleStates[riddle.id].attempts
              };
            }
          });
          
          // Send email with completion details
          const result = await sendCompletionEmail('PirateRiddles', {
            answers: allAnswers,
            completionTime: new Date().toLocaleString(),
            totalAttempts: Object.values(riddleStates).reduce((sum, state) => sum + state.attempts, 0)
          });
          
          if (result.success) {
            console.log('Completion email sent successfully!');
          } else {
            console.error('Failed to send completion email:', result.error);
          }
        } catch (error) {
          console.error('Error in completion notification:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    };
    
    if (battleComplete) {
      notifyCompletion();
    }
  }, [battleComplete, isSubmitting, riddleStates, riddles]);

  // Handle answer input change
  const handleAnswerChange = (riddleId, value) => {
    setAnswers(prev => ({
      ...prev,
      [riddleId]: {
        riddleId,
        text: value
      }
    }));
  };

  // Handle answer submission
  const handleSubmitAnswer = (riddleId) => {
    const userAnswer = answers[riddleId]?.text || '';
    const riddle = riddles.find(r => r.id === riddleId);
    
    if (!riddle) return;
    
    const isCorrect = userAnswer.toLowerCase().trim() === riddle.answer.toLowerCase();
    
    // Update riddle state
    setRiddleStates(prev => ({
      ...prev,
      [riddleId]: {
        ...prev[riddleId],
        isSubmitted: true,
        isCorrect,
        attempts: prev[riddleId].attempts + 1
      }
    }));
    
    // Recalculate battle percentage
    const updatedStates = {
      ...riddleStates,
      [riddleId]: {
        ...riddleStates[riddleId],
        isCorrect,
        isSubmitted: true,
        attempts: riddleStates[riddleId].attempts + 1
      }
    };
    
    const correctCount = Object.values(updatedStates).filter(state => state.isCorrect).length;
    const newPercentage = (correctCount / riddles.length) * 100;
    
    setBattlePercentage(newPercentage);
    
    // Check if battle is complete
    if (newPercentage === 100) {
      setBattleComplete(true);
    }
  };

  return (
    <div className="pirate-battle">
      <h2 className="battle-title">Pirate Riddle Challenge</h2>
      
      <div className="battle-progress">
        <div className="battle-meter">
          <div 
            className="battle-meter-fill" 
            style={{ width: `${battlePercentage}%` }}
          ></div>
        </div>
        <div className="battle-percentage">{Math.round(battlePercentage)}% Complete</div>
      </div>
      
      {battleComplete ? (
        <div className="victory-message">
          <h3>Victory! You've defeated the pirates!</h3>
          <p>The treasure chest has appeared on the shore. What mysteries await inside?</p>
          <div className="treasure-icon">🏆🏴‍☠️💰</div>
        </div>
      ) : (
        <div className="riddles-container">
          {riddles.map((riddle) => (
            <div 
              key={riddle.id} 
              className={`riddle-card ${riddleStates[riddle.id]?.isCorrect ? 'riddle-solved' : ''}`}
            >
              <p className="riddle-text">{riddle.text}</p>
              
              <div className="riddle-input-group">
                <input
                  type="text"
                  className={`riddle-input ${
                    riddleStates[riddle.id]?.isSubmitted && !riddleStates[riddle.id]?.isCorrect 
                      ? 'input-incorrect' 
                      : riddleStates[riddle.id]?.isCorrect 
                      ? 'input-correct' 
                      : ''
                  }`}
                  placeholder="Enter your answer..."
                  value={answers[riddle.id]?.text || ''}
                  onChange={(e) => handleAnswerChange(riddle.id, e.target.value)}
                  disabled={riddleStates[riddle.id]?.isCorrect}
                />
                <button 
                  className="riddle-submit"
                  onClick={() => handleSubmitAnswer(riddle.id)}
                  disabled={riddleStates[riddle.id]?.isCorrect || !answers[riddle.id]?.text}
                >
                  {riddleStates[riddle.id]?.isCorrect ? '✓' : 'Submit'}
                </button>
              </div>
              
              {riddleStates[riddle.id]?.isSubmitted && !riddleStates[riddle.id]?.isCorrect && (
                <div className="riddle-feedback incorrect">Try again! That's not quite right.</div>
              )}
              
              {riddleStates[riddle.id]?.isCorrect && (
                <div className="riddle-feedback correct">Correct! You've solved this riddle!</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PirateBattle;