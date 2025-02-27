import React, { useState, useEffect } from 'react';
import './PizzaioloStages.css';

const IngredientHuntStage = ({ onComplete }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  
  // All ingredients with their details
  const ingredientsList = [
    {
      id: 1,
      name: "San Marzano Tomatoes",
      image: "🍅",
      description: "Grown in the volcanic soil near Naples, these sweet tomatoes are essential for authentic pizza sauce.",
      authentic: true
    },
    {
      id: 2,
      name: "Mozzarella di Bufala",
      image: "🧀",
      description: "Made from Italian buffalo milk, this cheese has a soft texture and delicate flavor.",
      authentic: true
    },
    {
      id: 3,
      name: "Regular Canned Tomatoes",
      image: "🥫",
      description: "Generic tomatoes from unknown origins, lacking the rich flavor of Italian varieties.",
      authentic: false
    },
    {
      id: 4,
      name: "Extra Virgin Olive Oil",
      image: "🫒",
      description: "First cold-pressed Italian olives with a rich golden color. Sofia loves when Antonio drizzles it on her schiacciatina.",
      authentic: true
    },
    {
      id: 5,
      name: "Processed Shredded Cheese",
      image: "🧀",
      description: "Pre-packaged cheese with added preservatives and anti-caking agents.",
      authentic: false
    },
    {
      id: 6,
      name: "Fresh Basil",
      image: "🌿",
      description: "Aromatic Italian Genovese basil with bright green leaves and a sweet fragrance.",
      authentic: true
    },
    {
      id: 7,
      name: "Dried Oregano Flakes",
      image: "🌱",
      description: "Mass-produced dried herbs with diminished flavor compared to fresh Italian varieties.",
      authentic: false
    },
    {
      id: 8,
      name: "00 Flour",
      image: "🌾",
      description: "Finely ground Italian flour with low protein content, perfect for Neapolitan pizza dough.",
      authentic: true
    },
    {
      id: 9,
      name: "All-Purpose Flour",
      image: "🌾",
      description: "Generic flour that lacks the fine texture needed for authentic Italian pizza.",
      authentic: false
    },
    {
      id: 10,
      name: "Sea Salt from Sicily",
      image: "🧂",
      description: "Harvested from the Mediterranean Sea around Sicily, adding a clean, mineral taste.",
      authentic: true
    },
    {
      id: 11,
      name: "Table Salt",
      image: "🧂",
      description: "Regular iodized salt with anti-caking agents and a harsh flavor profile.",
      authentic: false
    },
    {
      id: 12,
      name: "Fresh Yeast",
      image: "🧫",
      description: "Artisanal fresh yeast that Antonio gets from a local Italian bakery, providing a complex fermentation.",
      authentic: true
    }
  ];
  
  // Get correct authentic ingredients
  const authenticIngredients = ingredientsList.filter(ingredient => ingredient.authentic).map(ingredient => ingredient.id);
  
  // Load saved progress from localStorage
  useEffect(() => {
    const savedSelections = localStorage.getItem('pizzaioloIngredientSelections');
    if (savedSelections) {
      setSelectedIngredients(JSON.parse(savedSelections));
    }
    
    const savedAttempts = localStorage.getItem('pizzaioloIngredientAttempts');
    if (savedAttempts) {
      setAttemptCount(parseInt(savedAttempts, 10));
    }
    
    // Check if already completed
    const isComplete = localStorage.getItem('pizzaioloStage2Complete') === 'true';
    if (isComplete) {
      setIsSuccess(true);
    }
  }, []);
  
  // Save selections to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pizzaioloIngredientSelections', JSON.stringify(selectedIngredients));
  }, [selectedIngredients]);
  
  // Handle ingredient selection
  const toggleIngredient = (ingredientId) => {
    if (isSuccess) return; // Prevent changes if already successful
    
    setSelectedIngredients(prev => {
      if (prev.includes(ingredientId)) {
        return prev.filter(id => id !== ingredientId);
      } else {
        return [...prev, ingredientId];
      }
    });
    
    // Clear feedback when selection changes
    setFeedback('');
  };
  
  // Handle submission
  const handleSubmit = () => {
    // Increment attempt count
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    localStorage.setItem('pizzaioloIngredientAttempts', newAttemptCount.toString());
    
    // Check if all selected ingredients are authentic
    const allAuthentic = selectedIngredients.every(id => authenticIngredients.includes(id));
    
    // Check if all authentic ingredients are selected
    const allSelected = authenticIngredients.every(id => selectedIngredients.includes(id));
    
    if (allAuthentic && allSelected) {
      setFeedback('Perfect! You\'ve identified all the authentic ingredients!');
      setIsSuccess(true);
      onComplete();
    } else if (allAuthentic && !allSelected) {
      setFeedback('You\'ve chosen only authentic ingredients, but you\'re missing some essential ones!');
    } else {
      setFeedback('Some of your selections aren\'t authentic Italian ingredients. Try again!');
    }
  };
  
  return (
    <div className="stage-content ingredient-hunt-stage">
      <h3 className="stage-title">The Authentic Ingredients Hunt</h3>
      
      {isSuccess ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h4>You've Found All Authentic Ingredients!</h4>
          <p>Antonio is impressed with your knowledge of authentic Italian ingredients! With these quality components, we can begin recreating the stolen recipes.</p>
          <p>"Sofia always helps me pick the best tomatoes at the market," Antonio shares proudly. "She has an amazing talent for finding the sweetest ones!"</p>
          <div className="next-stage-hint">
            <p>Antonio needs to prepare the kitchen for the next step in recovering his recipes. The next stage will unlock soon...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="stage-instructions">
            <p>Antonio needs your help identifying the authentic Italian ingredients needed to recreate his recipes. Choose all the genuine ingredients and avoid the imposters!</p>
          </div>
          
          <div className="ingredients-grid">
            {ingredientsList.map(ingredient => (
              <div 
                key={ingredient.id}
                className={`ingredient-card ${selectedIngredients.includes(ingredient.id) ? 'selected' : ''}`}
                onClick={() => toggleIngredient(ingredient.id)}
              >
                <div className="ingredient-icon">{ingredient.image}</div>
                <h4 className="ingredient-name">{ingredient.name}</h4>
                <p className="ingredient-description">{ingredient.description}</p>
                <div className="selection-indicator">
                  {selectedIngredients.includes(ingredient.id) ? '✓' : '+'}
                </div>
              </div>
            ))}
          </div>
          
          {feedback && (
            <div className={`feedback-message ${isSuccess ? 'success' : 'error'}`}>
              {feedback}
            </div>
          )}
          
          <div className="submit-container">
            <button 
              className="submit-button"
              onClick={handleSubmit}
              disabled={selectedIngredients.length === 0}
            >
              Verify Ingredients
            </button>
            <div className="attempts-counter">
              Attempts: {attemptCount}
            </div>
          </div>
          
          <div className="ingredient-hint">
            <p>Hint: Look for details about the origins and quality. Sofia's favorite schiacciatina requires the purest ingredients!</p>
          </div>
        </>
      )}
    </div>
  );
};

export default IngredientHuntStage