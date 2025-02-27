import React, { useState, useEffect } from 'react';
import './PizzaioloStages.css';

const SecretIngredientStage = ({ onComplete }) => {
  const [puzzleAnswers, setPuzzleAnswers] = useState({
    puzzle1: '',
    puzzle2: '',
    puzzle3: ''
  });
  
  const [secretIngredient, setSecretIngredient] = useState('');
  const [collectedClues, setCollectedClues] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showStory, setShowStory] = useState(1); // To cycle through family stories
  
  // Correct answers and clues
  const correctAnswers = {
    puzzle1: 'tradition',
    puzzle2: 'honey',
    puzzle3: 'sunrise'
  };
  
  // The secret ingredient
  const correctSecretIngredient = 'wild honey';
  
  // Family stories with clues
  const familyStories = [
    {
      id: 1,
      text: "When Antonio was young, his grandmother would wake up before <strong>sunrise</strong> to bake bread in the stone oven. She always said the early morning air added something special to the dough.",
      clue: "sunrise"
    },
    {
      id: 2,
      text: "Antonio's father taught him that <strong>tradition</strong> is the foundation of Italian cooking. 'What makes our pizza special isn't just ingredients, but the love and history behind them,' he would say.",
      clue: "tradition"
    },
    {
      id: 3,
      text: "One summer, Sofia accidentally spilled some <strong>honey</strong> into the pizza dough. Instead of starting over, Antonio decided to bake it anyway. To their surprise, the crust developed a beautiful golden color and subtle sweetness that customers loved!",
      clue: "honey"
    },
    {
      id: 4,
      text: "Antonio's family has always sourced ingredients from the hills near their village. The flowers there bloom with spectacular colors, and the bees produce something truly special compared to store-bought varieties.",
      clue: "wild"
    }
  ];
  
  // Load saved progress from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem('pizzaioloSecretPuzzleAnswers');
    const savedClues = localStorage.getItem('pizzaioloCollectedClues');
    const savedIngredient = localStorage.getItem('pizzaioloSecretIngredient');
    const savedAttempts = localStorage.getItem('pizzaioloSecretAttempts');
    
    if (savedAnswers) {
      setPuzzleAnswers(JSON.parse(savedAnswers));
    }
    
    if (savedClues) {
      setCollectedClues(JSON.parse(savedClues));
    }
    
    if (savedIngredient) {
      setSecretIngredient(savedIngredient);
    }
    
    if (savedAttempts) {
      setAttemptCount(parseInt(savedAttempts, 10));
    }
    
    // Check if already completed
    const isComplete = localStorage.getItem('pizzaioloStage4Complete') === 'true';
    if (isComplete) {
      setIsSuccess(true);
      setSecretIngredient(correctSecretIngredient);
    }
    
    // Set up story cycling interval
    const storyInterval = setInterval(() => {
      setShowStory(prev => (prev % familyStories.length) + 1);
    }, 8000);
    
    return () => clearInterval(storyInterval);
  }, [familyStories.length, correctSecretIngredient]);
  
  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('pizzaioloSecretPuzzleAnswers', JSON.stringify(puzzleAnswers));
  }, [puzzleAnswers]);
  
  useEffect(() => {
    localStorage.setItem('pizzaioloCollectedClues', JSON.stringify(collectedClues));
  }, [collectedClues]);
  
  useEffect(() => {
    localStorage.setItem('pizzaioloSecretIngredient', secretIngredient);
  }, [secretIngredient]);
  
  // Handle puzzle input changes
  const handlePuzzleInputChange = (e, puzzleId) => {
    const { value } = e.target;
    
    setPuzzleAnswers(prev => ({
      ...prev,
      [puzzleId]: value
    }));
    
    // Clear feedback when answers change
    if (feedback) {
      setFeedback('');
    }
  };
  
  // Handle puzzle submission
  const handlePuzzleSubmit = (puzzleId) => {
    const userAnswer = puzzleAnswers[puzzleId].toLowerCase().trim();
    const correctAnswer = correctAnswers[puzzleId];
    
    if (userAnswer === correctAnswer) {
      // Add clue if not already collected
      if (!collectedClues.includes(correctAnswer)) {
        setCollectedClues(prev => [...prev, correctAnswer]);
      }
      
      setFeedback(`Correct! You've discovered the clue: "${correctAnswer}"`);
    } else {
      setFeedback('That\'s not quite right. Try again!');
    }
  };
  
  // Handle clue collection from family stories
  const handleCollectClue = (clue) => {
    // Add clue if not already collected
    if (!collectedClues.includes(clue)) {
      setCollectedClues(prev => [...prev, clue]);
      setFeedback(`You found a new clue: "${clue}"!`);
    }
  };
  
  // Handle secret ingredient submission
  const handleSecretIngredientSubmit = () => {
    // Increment attempt count
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    localStorage.setItem('pizzaioloSecretAttempts', newAttemptCount.toString());
    
    const normalized = secretIngredient.toLowerCase().trim();
    
    if (normalized === correctSecretIngredient) {
      setFeedback('That\'s it! You\'ve discovered the secret ingredient!');
      setIsSuccess(true);
      onComplete();
    } else if (normalized.includes('honey') && normalized.includes('wild')) {
      setFeedback('Almost there! The wording isn\'t quite right...');
    } else if (normalized.includes('honey')) {
      setFeedback('You\'re on the right track! The honey is special in some way...');
    } else {
      setFeedback('That\'s not the secret ingredient. Look at your clues again!');
    }
  };
  
  // Word puzzles
  const puzzles = [
    {
      id: 'puzzle1',
      question: "I am passed down through generations, more valuable than gold. I connect the past and future in stories that are told. What am I?",
      hint: "Antonio's father believed this was the foundation of Italian cooking."
    },
    {
      id: 'puzzle2',
      question: "Bees create me with nectar sweet, Golden amber is my hue. I make bread rise and add flavor neat, In Sofia's accident, I became the breakthrough.",
      hint: "Sofia accidentally spilled this into the dough with surprising results."
    },
    {
      id: 'puzzle3',
      question: "Grandmother's secret time, when the world is still asleep. First light brings magic to the dough, a moment to keep.",
      hint: "Grandmother would wake up at this time to bake bread."
    }
  ];
  
  return (
    <div className="stage-content secret-ingredient-stage">
      <h3 className="stage-title">The Secret Family Ingredient</h3>
      
      {isSuccess ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h4>The Secret Ingredient Discovered: Wild Honey!</h4>
          <p>Antonio is amazed! "That's exactly right! We use wild honey from the hills near our village. The bees there feed on wildflowers that only grow in that region."</p>
          <p>"Sofia discovered it by accident," Antonio laughs. "She knocked over a jar while helping me in the kitchen. The dough was already mixed, but rather than waste it, we baked it anyway. The result was magical!"</p>
          <div className="next-stage-hint">
            <p>With the secret ingredient rediscovered, we can now assemble the complete recipe. The final stage will unlock soon...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="stage-instructions">
            <p>Antonio's recipes contain a secret family ingredient that gives his pizzas their unique flavor. Solve the word puzzles and uncover family stories to discover what it is!</p>
          </div>
          
          <div className="clues-container">
            <h4>Your Collected Clues:</h4>
            {collectedClues.length > 0 ? (
              <div className="clues-list">
                {collectedClues.map((clue, index) => (
                  <span key={index} className="clue-tag">{clue}</span>
                ))}
              </div>
            ) : (
              <p className="no-clues">No clues collected yet. Solve puzzles and find hints in the family stories!</p>
            )}
          </div>
          
          <div className="family-story-section">
            <h4>Family Stories</h4>
            {familyStories.map(story => (
              <div 
                key={story.id} 
                className={`family-story ${showStory === story.id ? 'visible' : 'hidden'}`}
              >
                <p dangerouslySetInnerHTML={{ __html: story.text }}></p>
                <button 
                  className="collect-clue-button"
                  onClick={() => handleCollectClue(story.clue)}
                >
                  Remember this detail
                </button>
              </div>
            ))}
            <div className="story-pagination">
              {familyStories.map(story => (
                <span 
                  key={story.id}
                  className={`story-dot ${showStory === story.id ? 'active' : ''}`}
                  onClick={() => setShowStory(story.id)}
                ></span>
              ))}
            </div>
          </div>
          
          <div className="puzzles-section">
            <h4>Word Puzzles</h4>
            {puzzles.map(puzzle => (
              <div key={puzzle.id} className="puzzle-card">
                <p className="puzzle-question">{puzzle.question}</p>
                <div className="puzzle-input-group">
                  <input 
                    type="text"
                    value={puzzleAnswers[puzzle.id]}
                    onChange={(e) => handlePuzzleInputChange(e, puzzle.id)}
                    className="puzzle-input"
                    placeholder="Your answer..."
                  />
                  <button 
                    className="puzzle-submit"
                    onClick={() => handlePuzzleSubmit(puzzle.id)}
                  >
                    Check
                  </button>
                </div>
                <p className="puzzle-hint">Hint: {puzzle.hint}</p>
              </div>
            ))}
          </div>
          
          <div className="secret-ingredient-section">
            <h4>The Secret Ingredient</h4>
            <p className="ingredient-instruction">Based on your collected clues, what is Antonio's secret ingredient?</p>
            <div className="ingredient-input-group">
              <input 
                type="text"
                value={secretIngredient}
                onChange={(e) => setSecretIngredient(e.target.value)}
                className="ingredient-input"
                placeholder="Enter the secret ingredient..."
              />
              <button 
                className="submit-button"
                onClick={handleSecretIngredientSubmit}
                disabled={!secretIngredient.trim()}
              >
                Submit
              </button>
            </div>
          </div>
          
          {feedback && (
            <div className={`feedback-message ${isSuccess ? 'success' : 'error'}`}>
              {feedback}
            </div>
          )}
          
          <div className="attempts-counter ingredient-attempts">
            Attempts: {attemptCount}
          </div>
        </>
      )}
    </div>
  );
};

export default SecretIngredientStage;