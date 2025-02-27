import React, { useState, useEffect } from 'react';
import './PizzaioloStages.css';

const RansomNoteStage = ({ onComplete }) => {
  const [userAnswers, setUserAnswers] = useState({
    blank1: '',
    blank2: '',
    blank3: '',
    blank4: '',
    blank5: '',
    blank6: '',
    blank7: '',
    blank8: '',
  });
  
  const [feedback, setFeedback] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  
  // Correct answers for validation
  const correctAnswers = {
    blank1: 'recipes',
    blank2: 'midnight',
    blank3: 'leaning',
    blank4: 'payment',
    blank5: 'Sofia',
    blank6: 'simple',
    blank7: 'smile',
    blank8: 'treasure'
  };
  
  // Load saved answers from localStorage if available
  useEffect(() => {
    const savedAnswers = localStorage.getItem('pizzaioloRansomNoteAnswers');
    if (savedAnswers) {
      setUserAnswers(JSON.parse(savedAnswers));
    }
    
    const savedAttempts = localStorage.getItem('pizzaioloRansomNoteAttempts');
    if (savedAttempts) {
      setAttemptCount(parseInt(savedAttempts, 10));
    }
    
    // Check if already completed
    const isComplete = localStorage.getItem('pizzaioloStage1Complete') === 'true';
    if (isComplete) {
      setIsSuccess(true);
    }
  }, []);
  
  // Save answers to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pizzaioloRansomNoteAnswers', JSON.stringify(userAnswers));
  }, [userAnswers]);
  
  // Handle input changes
  const handleInputChange = (event, blankId) => {
    const { value } = event.target;
    setUserAnswers(prev => ({
      ...prev,
      [blankId]: value
    }));
    
    // Clear feedback when user changes an answer
    if (feedback) {
      setFeedback('');
    }
  };
  
  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Increment attempt count
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    localStorage.setItem('pizzaioloRansomNoteAttempts', newAttemptCount.toString());
    
    // Check answers
    let allCorrect = true;
    let incorrectCount = 0;
    
    for (const key in correctAnswers) {
      if (userAnswers[key].toLowerCase().trim() !== correctAnswers[key].toLowerCase()) {
        allCorrect = false;
        incorrectCount++;
      }
    }
    
    if (allCorrect) {
      setFeedback('Excellent! You\'ve decoded the ransom note!');
      setIsSuccess(true);
      onComplete();
    } else {
      if (incorrectCount === 1) {
        setFeedback('Almost there! Just one answer is incorrect.');
      } else {
        setFeedback(`${incorrectCount} answers are incorrect. Try again!`);
      }
    }
  };
  
  // Simple cipher decoder
  const [cipherInput, setCipherInput] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  
  const handleCipherInputChange = (event) => {
    const { value } = event.target;
    setCipherInput(value);
    
    // Simple substitution cipher (shift 3 positions)
    const decoded = value.split('').map(char => {
      // Only process letters
      if (/[a-zA-Z]/.test(char)) {
        const code = char.charCodeAt(0);
        // Handle uppercase
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 - 3 + 26) % 26) + 65);
        }
        // Handle lowercase
        else if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 - 3 + 26) % 26) + 97);
        }
      }
      return char;
    }).join('');
    
    setDecodedMessage(decoded);
  };
  
  return (
    <div className="stage-content ransom-note-stage">
      <h3 className="stage-title">Decoding the Ransom Note</h3>
      
      {isSuccess ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h4>The Ransom Note Has Been Decoded!</h4>
          <p>Antonio is thrilled! The note reveals the pirates have hidden the first part of the recipe book in a small cave near the Leaning Tower of Pisa. Now we can begin the search for the stolen recipes!</p>
          <div className="next-stage-hint">
            <p>Antonio will need to gather supplies for the journey to Pisa. The next stage will unlock soon...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="stage-instructions">
            <p>The pirates have left a mysterious ransom note. Help Antonio decode it to find where they've hidden his recipes!</p>
          </div>
          
          <div className="ransom-note">
            <form onSubmit={handleSubmit}>
              <div className="note-content">
                <p>
                  To the foolish pizzaiolo,
                </p>
                <p>
                  We have taken your precious <input 
                    type="text" 
                    value={userAnswers.blank1} 
                    onChange={(e) => handleInputChange(e, 'blank1')} 
                    className="blank-input"
                    placeholder="____"
                  />. If you want them back, meet us at <input 
                    type="text" 
                    value={userAnswers.blank2} 
                    onChange={(e) => handleInputChange(e, 'blank2')} 
                    className="blank-input"
                    placeholder="____"
                  /> by the <input 
                    type="text" 
                    value={userAnswers.blank3} 
                    onChange={(e) => handleInputChange(e, 'blank3')} 
                    className="blank-input"
                    placeholder="____"
                  /> tower.
                </p>
                <p>
                  Bring 10,000 gold coins as <input 
                    type="text" 
                    value={userAnswers.blank4} 
                    onChange={(e) => handleInputChange(e, 'blank4')} 
                    className="blank-input"
                    placeholder="____"
                  /> or you'll never cook again!
                </p>
                <p>
                  We even have the special recipe you made for <input 
                    type="text" 
                    value={userAnswers.blank5} 
                    onChange={(e) => handleInputChange(e, 'blank5')} 
                    className="blank-input"
                    placeholder="____"
                  />, that <input 
                    type="text" 
                    value={userAnswers.blank6} 
                    onChange={(e) => handleInputChange(e, 'blank6')} 
                    className="blank-input"
                    placeholder="____"
                  /> one that makes her <input 
                    type="text" 
                    value={userAnswers.blank7} 
                    onChange={(e) => handleInputChange(e, 'blank7')} 
                    className="blank-input"
                    placeholder="____"
                  />!
                </p>
                <p>
                  If you can decode this message, maybe you deserve your <input 
                    type="text" 
                    value={userAnswers.blank8} 
                    onChange={(e) => handleInputChange(e, 'blank8')} 
                    className="blank-input"
                    placeholder="____"
                  /> after all.
                </p>
                <div className="pirate-signature">
                  <p>- Captain Marinara & The Dough Raiders</p>
                </div>
              </div>
              
              <div className="cipher-section">
                <h4>Secret Pirate Code</h4>
                <p>There's a coded message at the bottom of the note. Try to decode it:</p>
                <div className="cipher-input-group">
                  <textarea
                    value={cipherInput}
                    onChange={handleCipherInputChange}
                    placeholder="Enter the coded text..."
                    className="cipher-input"
                  ></textarea>
                  <div className="decoded-output">
                    <h5>Decoded:</h5>
                    <p>{decodedMessage}</p>
                  </div>
                </div>
                <div className="cipher-hint">
                  <p>Hint: The pirates always shift their alphabet by 3 positions...</p>
                  <p>Try decoding: "Zh kdyh klgghq wkh iluvw sdjh lq wkh fdyh"</p>
                </div>
              </div>
              
              {feedback && (
                <div className={`feedback-message ${isSuccess ? 'success' : 'error'}`}>
                  {feedback}
                </div>
              )}
              
              <div className="submit-container">
                <button type="submit" className="submit-button">Decode the Note</button>
                <div className="attempts-counter">
                  Attempts: {attemptCount}
                </div>
              </div>
            </form>
          </div>
          
          <div className="word-bank">
            <h4>Possible Words:</h4>
            <div className="word-list">
              <span className="word-option">recipes</span>
              <span className="word-option">midnight</span>
              <span className="word-option">morning</span>
              <span className="word-option">leaning</span>
              <span className="word-option">falling</span>
              <span className="word-option">payment</span>
              <span className="word-option">ransom</span>
              <span className="word-option">Sofia</span>
              <span className="word-option">Maria</span>
              <span className="word-option">simple</span>
              <span className="word-option">secret</span>
              <span className="word-option">smile</span>
              <span className="word-option">laugh</span>
              <span className="word-option">treasure</span>
              <span className="word-option">cookbook</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RansomNoteStage;