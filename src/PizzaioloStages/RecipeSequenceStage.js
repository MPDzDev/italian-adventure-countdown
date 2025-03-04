import React, { useState, useEffect } from 'react';
import './PizzaioloStages.css';

const RecipeSequenceStage = ({ onComplete }) => {
  // Recipe steps in correct order wrapped in useMemo
  const correctSequence = React.useMemo(() => [
    {
      id: 1,
      text: "Activate yeast in warm water with a pinch of sugar",
      image: "🧫"
    },
    {
      id: 2,
      text: "Mix flour, salt, and activated yeast mixture",
      image: "🌾"
    },
    {
      id: 3,
      text: "Knead dough until smooth and elastic",
      image: "👐"
    },
    {
      id: 4,
      text: "Let dough rise covered in a warm place (first rise)",
      image: "⏲️"
    },
    {
      id: 5,
      text: "Punch down dough to release air bubbles",
      image: "👊"
    },
    {
      id: 6,
      text: "Divide and shape dough into balls for second rise",
      image: "🔄"
    },
    {
      id: 7,
      text: "Flatten dough into discs using Sofia's fingertip technique",
      image: "👧"
    },
    {
      id: 8,
      text: "Add sauce in a spiral motion from center outward",
      image: "🍅"
    },
    {
      id: 9,
      text: "Add toppings (or leave plain for Sofia's schiacciatina)",
      image: "🧀"
    },
    {
      id: 10,
      text: "Bake in very hot oven until edges are golden",
      image: "🔥"
    }
  ], []);
  
  // State for current sequence (initially randomized)
  const [sequence, setSequence] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [draggedStep, setDraggedStep] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Check if sequence is correct - wrapped in useCallback
  const checkSequence = React.useCallback((seq) => {
    return seq.every((step, index) => step.id === correctSequence[index].id);
  }, [correctSequence]);

  // Function to randomize sequence - wrapped in useCallback
  const randomizeSequence = React.useCallback(() => {
    // Create a copy and shuffle
    const shuffled = [...correctSequence].sort(() => Math.random() - 0.5);
    setSequence(shuffled);
  }, [correctSequence]);
  
  // Load saved progress or initialize
  useEffect(() => {
    const savedSequence = localStorage.getItem('pizzaioloRecipeSequence');
    const savedAttempts = localStorage.getItem('pizzaioloRecipeAttempts');
    
    if (savedSequence) {
      setSequence(JSON.parse(savedSequence));
    } else {
      // Initialize with randomized sequence
      randomizeSequence();
    }
    
    if (savedAttempts) {
      setAttemptCount(parseInt(savedAttempts, 10));
    }
    
    // Check if already completed
    const isComplete = localStorage.getItem('pizzaioloStage3Complete') === 'true';
    if (isComplete) {
      setIsSuccess(true);
      
      // If complete but sequence not in correct order, restore correct order
      if (savedSequence) {
        const parsedSequence = JSON.parse(savedSequence);
        const isCorrectOrder = checkSequence(parsedSequence);
        
        if (!isCorrectOrder) {
          setSequence([...correctSequence]);
        }
      } else {
        setSequence([...correctSequence]);
      }
    }
  }, [correctSequence, checkSequence, randomizeSequence]);
  
  // Save sequence to localStorage when it changes
  useEffect(() => {
    if (sequence.length > 0) {
      localStorage.setItem('pizzaioloRecipeSequence', JSON.stringify(sequence));
    }
  }, [sequence]);
  
  // Handle drag start
  const handleDragStart = (e, step) => {
    setDraggedStep(step);
    e.dataTransfer.setData('text/plain', step.id);
    // Add some styles to indicate dragging
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };
  
  // Handle drag end
  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedStep(null);
  };
  
  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  // Handle drop
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    
    if (!draggedStep) return;
    
    // Create a new sequence without the dragged step
    const newSequence = sequence.filter(step => step.id !== draggedStep.id);
    
    // Insert the dragged step at the target index
    newSequence.splice(targetIndex, 0, draggedStep);
    
    // Update the sequence
    setSequence(newSequence);
    
    // Clear feedback when sequence changes
    setFeedback('');
  };

  // Mobile-friendly function to move a step up
  const moveStepUp = (index) => {
    if (index === 0) return; // Can't move the first item up
    
    const newSequence = [...sequence];
    const temp = newSequence[index];
    newSequence[index] = newSequence[index - 1];
    newSequence[index - 1] = temp;
    
    setSequence(newSequence);
    setFeedback('');
  };
  
  // Mobile-friendly function to move a step down
  const moveStepDown = (index) => {
    if (index === sequence.length - 1) return; // Can't move the last item down
    
    const newSequence = [...sequence];
    const temp = newSequence[index];
    newSequence[index] = newSequence[index + 1];
    newSequence[index + 1] = temp;
    
    setSequence(newSequence);
    setFeedback('');
  };
  
  // Handle sequence verification
  const handleVerifySequence = () => {
    // Increment attempt count
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    localStorage.setItem('pizzaioloRecipeAttempts', newAttemptCount.toString());
    
    // Check if sequence is correct
    const isCorrect = checkSequence(sequence);
    
    if (isCorrect) {
      setFeedback('Perfect! You\'ve arranged the steps in the correct order!');
      setIsSuccess(true);
      onComplete();
    } else {
      // Find the first wrong position
      const firstWrongIndex = sequence.findIndex((step, index) => step.id !== correctSequence[index].id);
      
      setFeedback(`Not quite right. Double-check step ${firstWrongIndex + 1} and try again!`);
    }
  };
  
  // Handle reset sequence
  const handleResetSequence = () => {
    randomizeSequence();
    setFeedback('');
  };
  
  return (
    <div className="stage-content recipe-sequence-stage">
      <h3 className="stage-title">The Recipe Sequence</h3>
      
      {isSuccess ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h4>Recipe Sequence Restored!</h4>
          <p>Antonio is delighted! You've successfully restored the correct order of steps for his famous pizza dough.</p>
          <p>"Sofia's technique for flattening the dough is special," Antonio says proudly. "She uses her fingertips to create little dimples that catch the olive oil perfectly in her schiacciatina."</p>
          <div className="next-stage-hint">
            <p>Now that we understand the process, Antonio needs to remember the secret ingredient. The next stage will unlock soon...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="stage-instructions">
            <p>The pirates have scrambled Antonio's recipe steps! {isMobile ? 'Use the up and down arrows' : 'Drag and drop the steps'} to restore the pizza-making sequence.</p>
          </div>
          
          <div className="sequence-container">
            {sequence.map((step, index) => (
              <div 
                key={step.id}
                className="sequence-step"
                draggable={!isMobile}
                onDragStart={!isMobile ? (e) => handleDragStart(e, step) : undefined}
                onDragEnd={!isMobile ? handleDragEnd : undefined}
                onDragOver={!isMobile ? handleDragOver : undefined}
                onDrop={!isMobile ? (e) => handleDrop(e, index) : undefined}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-image">{step.image}</div>
                <div className="step-text">{step.text}</div>
                
                {/* Mobile friendly controls */}
                {isMobile ? (
                  <div className="mobile-controls">
                    <button 
                      className="mobile-control-btn up-btn"
                      onClick={() => moveStepUp(index)}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button 
                      className="mobile-control-btn down-btn"
                      onClick={() => moveStepDown(index)}
                      disabled={index === sequence.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                ) : (
                  <div className="drag-handle">⋮⋮</div>
                )}
              </div>
            ))}
          </div>
          
          {feedback && (
            <div className={`feedback-message ${isSuccess ? 'success' : 'error'}`}>
              {feedback}
            </div>
          )}
          
          <div className="action-buttons">
            <button 
              className="reset-button"
              onClick={handleResetSequence}
            >
              Shuffle Steps
            </button>
            
            <button 
              className="submit-button"
              onClick={handleVerifySequence}
            >
              Verify Sequence
            </button>
            
            <div className="attempts-counter">
              Attempts: {attemptCount}
            </div>
          </div>
          
          <div className="sequence-hint">
            <p>Hint: Think about the logical order of making pizza dough. Sofia's special technique for schiacciatina comes after the dough has been shaped but before adding toppings!</p>
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeSequenceStage;