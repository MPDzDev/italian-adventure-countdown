import React, { useState, useEffect } from 'react';
import './PizzaioloChallenge.css';
import { 
  isPizzaioloStageAvailable, 
  isPizzaioloStageComplete, 
  markPizzaioloStageComplete,
  getNextPizzaioloStage,
  getTimeUntilNextPizzaioloStage
} from './TimeUtils';
import { sendCompletionEmail, wasCompletionEmailSent } from './EmailService';
import { addTreasureItem } from './TreasureChest';

// Import stage components
import RansomNoteStage from './PizzaioloStages/RansomNoteStage';
import IngredientHuntStage from './PizzaioloStages/IngredientHuntStage';
import RecipeSequenceStage from './PizzaioloStages/RecipeSequenceStage';
import SecretIngredientStage from './PizzaioloStages/SecretIngredientStage';
import RecipeAssemblyStage from './PizzaioloStages/RecipeAssemblyStage';

const PizzaioloChallenge = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [nextStageTimer, setNextStageTimer] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [allStagesComplete, setAllStagesComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check which stage should be showing initially
  useEffect(() => {
    const updateStage = () => {
      const nextStage = getNextPizzaioloStage();
      
      // Only set the current stage on initial load
      // This allows users to stay on completed stages if they want
      setCurrentStage(prevStage => {
        // If this is the initial load (prevStage is default 1)
        // or if currently on a locked stage, update to next available
        if (prevStage === 1 && !isPizzaioloStageComplete(1)) {
          return nextStage;
        }
        // Otherwise keep current stage selection
        return prevStage;
      });
      
      // If all stages complete
      if (nextStage > 5) {
        setAllStagesComplete(true);
      }
      
      // Set the timer for next stage
      setNextStageTimer(getTimeUntilNextPizzaioloStage());
    };
    
    // Update immediately and set interval
    updateStage();
    const stageInterval = setInterval(() => {
      setNextStageTimer(getTimeUntilNextPizzaioloStage());
    }, 1000);
    
    return () => clearInterval(stageInterval);
  }, []);
  
  // Send email notification when all stages are complete
  useEffect(() => {
    const notifyCompletion = async () => {
      if (allStagesComplete && !isSubmitting && !wasCompletionEmailSent('PizzaioloChallenge')) {
        setIsSubmitting(true);
        
        try {
          // Get all the completed stages to include in the email
          const stageDetails = {};
          for (let i = 1; i <= 5; i++) {
            stageDetails[`stage${i}`] = {
              completed: isPizzaioloStageComplete(i),
              completionTime: localStorage.getItem(`pizzaioloStage${i}CompletionTime`) || 'unknown'
            };
          }
          
          // Send email with completion details
          const result = await sendCompletionEmail('PizzaioloChallenge', {
            stages: stageDetails,
            completionTime: new Date().toLocaleString()
          });
          
          if (result.success) {
            console.log('Pizzaiolo challenge completion email sent successfully!');
            
            // Add treasure items to chest
            addTreasureItem({
              icon: "📜",
              name: "Antonio's Pizza Recipe",
              description: "The authentic recipe recovered from the pirates. A treasured family secret passed down through generations."
            });
            
            addTreasureItem({
              icon: "🍕",
              name: "Sofia's Schiacciatina Recipe",
              description: "A simple yet delicious flatbread pizza without toppings, created by Antonio for his daughter Sofia."
            });
            
            addTreasureItem({
              icon: "🎟️",
              name: "Mountain Waterpark Invitation",
              description: "Antonio and Sofia invite you to join them at the Alpine Splash Waterpark to celebrate saving the recipes!"
            });
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
    
    if (allStagesComplete) {
      notifyCompletion();
    }
  }, [allStagesComplete, isSubmitting]);
  
  // Handle stage completion
  const handleStageComplete = (stageNumber) => {
    // Save completion time
    localStorage.setItem(`pizzaioloStage${stageNumber}CompletionTime`, new Date().toLocaleString());
    // Mark stage as complete
    markPizzaioloStageComplete(stageNumber);
    
    // Do NOT automatically move to the next stage
    // This allows users to see their completion message
    // They can manually navigate to the next stage using the navigation buttons
  };
  
  // Render appropriate stage based on currentStage
  const renderCurrentStage = () => {
    // If stage isn't available yet, show countdown
    if (!isPizzaioloStageAvailable(currentStage)) {
      return (
        <div className="stage-locked">
          <h3>Next stage unlocks in:</h3>
          <div className="countdown">
            {nextStageTimer.days}d {nextStageTimer.hours}h {nextStageTimer.minutes}m {nextStageTimer.seconds}s
          </div>
          <p>Antonio is preparing the next challenge...</p>
          <div className="waiting-animation">
            <span className="emoji">👨‍🍳</span>
          </div>
        </div>
      );
    }
    
    // Render appropriate stage component
    switch(currentStage) {
      case 1:
        return <RansomNoteStage onComplete={() => handleStageComplete(1)} />;
      case 2:
        return <IngredientHuntStage onComplete={() => handleStageComplete(2)} />;
      case 3:
        return <RecipeSequenceStage onComplete={() => handleStageComplete(3)} />;
      case 4:
        return <SecretIngredientStage onComplete={() => handleStageComplete(4)} />;
      case 5:
        return <RecipeAssemblyStage onComplete={() => handleStageComplete(5)} />;
      default:
        return null;
    }
  };
  
  // Show completion message and waterpark invitation if all stages complete
  if (allStagesComplete) {
    return (
      <div className="challenge-complete">
        <h2>Challenge Complete!</h2>
        <div className="celebration-animation">🎉👨‍🍳👧🍕🎉</div>
        <p className="completion-message">
          Thanks to your help, Antonio has recovered all his stolen recipes! 
          His pizzeria is saved, and little Sofia can enjoy her favorite schiacciatina again!
        </p>
        
        <div className="waterpark-invitation">
          <h3>You're Invited!</h3>
          <p>Antonio and Sofia are hosting a celebration at the Alpine Splash Waterpark!</p>
          <div className="invitation-image">🏔️🏊‍♂️🌊🎢🍕</div>
          <p>Join them for a day of water slides, pizza, and fun in the mountains!</p>
          <p className="small-text">Wait... is that a pirate ship in the distance? 👀</p>
        </div>
      </div>
    );
  }
  
  // Progress bar for stages
  const calculateProgress = () => {
    let completedStages = 0;
    for (let i = 1; i <= 5; i++) {
      if (isPizzaioloStageComplete(i)) {
        completedStages++;
      }
    }
    return (completedStages / 5) * 100;
  };
  
  return (
    <div className="pizzaiolo-challenge">
      <div className="challenge-header">
        <h2><span className="challenge-icon">🍕</span> Antonio's Stolen Recipes!</h2>
        <p className="challenge-description">
          The pirates have stolen Antonio's secret family recipes! Help him recover them before his pizzeria closes forever.
        </p>
      </div>
      
      <div className="stage-progress">
        <div className="progress-label">Challenge Progress:</div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${calculateProgress()}%` }}></div>
        </div>
        <div className="progress-percentage">{Math.round(calculateProgress())}%</div>
      </div>
      
      <div className="stage-navigation">
        {[1, 2, 3, 4, 5].map(stageNum => (
          <div 
            key={stageNum}
            className={`stage-indicator ${isPizzaioloStageComplete(stageNum) ? 'completed' : ''} ${currentStage === stageNum ? 'current' : ''} ${!isPizzaioloStageAvailable(stageNum) ? 'locked' : ''}`}
            onClick={() => {
              // Allow navigating to available or completed stages
              if (isPizzaioloStageAvailable(stageNum) || isPizzaioloStageComplete(stageNum)) {
                setCurrentStage(stageNum);
              }
            }}
          >
            {isPizzaioloStageComplete(stageNum) ? '✓' : stageNum}
          </div>
        ))}
      </div>
      
      <div className="stage-container">
        {renderCurrentStage()}
      </div>
    </div>
  );
};

export default PizzaioloChallenge;