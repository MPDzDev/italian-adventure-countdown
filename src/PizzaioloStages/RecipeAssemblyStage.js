import React, { useState, useEffect, useMemo } from 'react';
import './PizzaioloStages.css';

const RecipeAssemblyStage = ({ onComplete }) => {
  // Recipe sections wrapped in useMemo to prevent recreating on every render
  const sections = useMemo(() => [
    {
      id: "ingredients",
      title: "Ingredients",
      options: [
        "500g 00 flour, 300ml warm water, 7g active dry yeast, 10g sea salt from Sicily, 15ml extra virgin olive oil, 5g wild honey",
        "500g all-purpose flour, 300ml water, 7g yeast, 10g table salt, 15ml vegetable oil",
        "500g bread flour, 300ml lukewarm water, 7g instant yeast, 10g salt, 15ml olive oil, 1 tbsp sugar",
        "450g 00 flour, 50g semolina, 300ml water, 7g yeast, 10g sea salt, 15ml olive oil, 5g wild honey from Italian hillsides"
      ],
      correct: 3
    },
    {
      id: "dough",
      title: "Dough Preparation",
      options: [
        "Mix all dry ingredients, then add liquids. Knead for 5 minutes until combined.",
        "Dissolve yeast in warm water with wild honey. Let sit for 10 minutes until foamy. Mix flour and salt, then add yeast mixture and oil. Knead for 10-15 minutes until smooth and elastic.",
        "Combine flour, salt and yeast, then add water and oil. Mix until dough forms, then let rest without kneading.",
        "Add yeast directly to flour, then mix in water, honey and salt. Knead briefly until combined."
      ],
      correct: 1
    },
    {
      id: "proofing",
      title: "Proofing Method",
      options: [
        "Single rise for 30 minutes at room temperature.",
        "Rise for 1 hour, punch down, then use immediately.",
        "First rise for 2 hours until doubled. Punch down, divide into balls, and let rise again for 1 hour.",
        "Quick 20-minute rise using warm oven, then refrigerate overnight."
      ],
      correct: 2
    },
    {
      id: "technique",
      title: "Sofia's Special Technique",
      options: [
        "Roll the dough with a rolling pin until very thin and even.",
        "Stretch dough by holding it up and letting gravity pull it down.",
        "Gently press dough with fingertips to create dimples that catch the olive oil, especially for schiacciatina.",
        "Toss the dough in the air to stretch it evenly."
      ],
      correct: 2
    },
    {
      id: "cooking",
      title: "Cooking Method",
      options: [
        "Bake at 350°F (175°C) for 25-30 minutes until golden brown.",
        "Bake at 475°F (245°C) for 10-12 minutes on a pizza stone or steel.",
        "Cook in a pan on stovetop for 5 minutes each side.",
        "Preheat oven to highest setting (500-550°F/260-290°C) with stone or steel for 1 hour. Bake for 6-8 minutes until edges are charred and bubbly."
      ],
      correct: 3
    },
    {
      id: "secret",
      title: "Family Secret",
      options: [
        "Always let the dough rest in the refrigerator overnight for best flavor development.",
        "Add a tablespoon of sugar to feed the yeast and make the crust brown better.",
        "Sprinkle cornmeal on the baking surface to prevent sticking.",
        "For the best crust, start making the dough before sunrise, when the morning air adds magic, and use wild honey from the Italian hillsides."
      ],
      correct: 3
    }
  ], []);
  
  // State for user selections
  const [selections, setSelections] = useState({});
  const [feedback, setFeedback] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  
  // Load saved progress from localStorage
  useEffect(() => {
    const savedSelections = localStorage.getItem('pizzaioloRecipeSelections');
    if (savedSelections) {
      setSelections(JSON.parse(savedSelections));
    }
    
    const savedAttempts = localStorage.getItem('pizzaioloAssemblyAttempts');
    if (savedAttempts) {
      setAttemptCount(parseInt(savedAttempts, 10));
    }
    
    // Check if already completed
    const isComplete = localStorage.getItem('pizzaioloStage5Complete') === 'true';
    if (isComplete) {
      setIsSuccess(true);
      
      // If complete, set all correct selections
      const correctSelections = {};
      sections.forEach(section => {
        correctSelections[section.id] = section.correct;
      });
      setSelections(correctSelections);
    }
  }, [sections]);
  
  // Save selections to localStorage when they change
  useEffect(() => {
    if (Object.keys(selections).length > 0) {
      localStorage.setItem('pizzaioloRecipeSelections', JSON.stringify(selections));
    }
  }, [selections]);
  
  // Handle selection change
  const handleSelectionChange = (sectionId, optionIndex) => {
    setSelections(prev => ({
      ...prev,
      [sectionId]: optionIndex
    }));
    
    // Clear feedback when selections change
    if (feedback) {
      setFeedback('');
    }
  };
  
  // Handle recipe submission
  const handleSubmitRecipe = () => {
    // Check if all sections are selected
    const allSelected = sections.every(section => selections[section.id] !== undefined);
    
    if (!allSelected) {
      setFeedback('Please make a selection for all recipe sections!');
      return;
    }
    
    // Increment attempt count
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    localStorage.setItem('pizzaioloAssemblyAttempts', newAttemptCount.toString());
    
    // Check if all selections are correct
    const incorrectSections = sections.filter(
      section => selections[section.id] !== section.correct
    );
    
    if (incorrectSections.length === 0) {
      // All correct!
      setFeedback('Perfect! You\'ve assembled the complete recipe correctly!');
      setIsSuccess(true);
      onComplete();
    } else {
      // Some incorrect
      if (incorrectSections.length === 1) {
        setFeedback(`Almost there! Double-check the "${incorrectSections[0].title}" section.`);
      } else {
        setFeedback(`${incorrectSections.length} sections need adjustment. Keep trying!`);
      }
    }
  };
  
  return (
    <div className="stage-content recipe-assembly-stage">
      <h3 className="stage-title">The Complete Recipe Assembly</h3>
      
      {isSuccess ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h4>Recipe Successfully Assembled!</h4>
          <p>Antonio is overjoyed! "That's exactly right! You've completely restored my family's treasured pizza recipe!"</p>
          <p>Sofia jumps with excitement. "Now we can make my favorite schiacciatina again! Thank you for helping us!"</p>
          <p>Antonio smiles proudly. "To show our gratitude, Sofia and I would like to invite you to join us for a celebration at the Alpine Splash Waterpark next month!"</p>
          <div className="invitation-preview">
            <h5>You're Invited!</h5>
            <p>Join Antonio & Sofia at the Alpine Splash Waterpark</p>
            <div className="invitation-icons">🏔️🏊‍♂️🌊🎢🍕</div>
          </div>
        </div>
      ) : (
        <>
          <div className="stage-instructions">
            <p>It's time to assemble the complete recipe using everything we've learned! Select the correct option for each section to recreate Antonio's famous pizza recipe.</p>
          </div>
          
          <div className="recipe-form">
            {sections.map(section => (
              <div key={section.id} className="recipe-section">
                <h4 className="section-title">{section.title}</h4>
                <div className="section-options">
                  {section.options.map((option, index) => (
                    <div 
                      key={index}
                      className={`option-card ${selections[section.id] === index ? 'selected' : ''}`}
                      onClick={() => handleSelectionChange(section.id, index)}
                    >
                      <div className="option-content">
                        <p>{option}</p>
                      </div>
                      <div className="option-selector">
                        <div className="selector-dot"></div>
                      </div>
                    </div>
                  ))}
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
              onClick={handleSubmitRecipe}
            >
              Complete Recipe
            </button>
            <div className="attempts-counter">
              Attempts: {attemptCount}
            </div>
          </div>
          
          <div className="assembly-hint">
            <p>Hint: Remember the special ingredients and techniques we've discovered. Sofia's schiacciatina technique and the wild honey are key elements!</p>
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeAssemblyStage;