// Enhanced PizzaioloChallenge.js
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
import StoryIntroStage from './PizzaioloStages/StoryIntroStage';
import VillageExplorationStage from './PizzaioloStages/VillageExplorationStage';
import PirateNegotiationStage from './PizzaioloStages/PirateNegotiationStage';
import SecretIngredientQuestStage from './PizzaioloStages/SecretIngredientQuestStage';
import FinalShowdownStage from './PizzaioloStages/FinalShowdownStage';

const PizzaioloChallenge = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [nextStageTimer, setNextStageTimer] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [allStagesComplete, setAllStagesComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storyProgress, setStoryProgress] = useState({
    characterRelationships: {
      antonioBond: 0, // 0-100 relationship meter with Antonio
      sofiaTrust: 0,  // 0-100 trust level with Sofia
      pirateRespect: 0 // 0-100 respect level with pirates
    },
    inventory: [],
    discoveredLocations: [],
    storyChoices: {}
  });
  
  // useEffect for initial setup
useEffect(() => {
  // Load saved story progress
  const savedProgress = localStorage.getItem('pizzaioloStoryProgress');
  if (savedProgress) {
    setStoryProgress(JSON.parse(savedProgress));
  }
  
  const updateStage = () => {
    // Get the next stage that should be active
    const nextStage = getNextPizzaioloStage();
    console.log(`Next available stage: ${nextStage}`);
    
    setCurrentStage(prevStage => {
      // If we're at stage 1 and it's not completed, use the next available stage
      if (prevStage === 1 && !isPizzaioloStageComplete(1)) {
        return nextStage;
      }
      
      // If we just completed a stage, move to the next available one
      if (isPizzaioloStageComplete(prevStage)) {
        return nextStage;
      }
      
      return prevStage;
    });
    
    // Check if all stages are complete
    if (nextStage > 5) {
      setAllStagesComplete(true);
    }
    
    // Update the timer for next stage
    setNextStageTimer(getTimeUntilNextPizzaioloStage());
  };
  
  updateStage();
  

  const timerInterval = setInterval(() => {
    setNextStageTimer(getTimeUntilNextPizzaioloStage());
  }, 1000);
  
  // Also respond to storage events (which might be triggered by other components)
  const handleStorageChange = () => {
    console.log("Storage change detected, updating stage info");
    updateStage();
  };
  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    clearInterval(timerInterval);
    window.removeEventListener('storage', handleStorageChange);
  };
}, []);
  
  // Save story progress whenever it changes
  useEffect(() => {
    if (Object.keys(storyProgress.storyChoices).length > 0) {
      localStorage.setItem('pizzaioloStoryProgress', JSON.stringify(storyProgress));
    }
  }, [storyProgress]);
  
  // Send email notification when all stages are complete
  useEffect(() => {
    const notifyCompletion = async () => {
      if (allStagesComplete && !isSubmitting && !wasCompletionEmailSent('PizzaioloChallenge')) {
        setIsSubmitting(true);
        
        try {
          // Include story progress and choices in the completion email
          const result = await sendCompletionEmail('PizzaioloChallenge', {
            storyProgress,
            completionTime: new Date().toLocaleString()
          });
          
          if (result.success) {
            console.log('Pizzaiolo challenge completion email sent successfully!');
            
            // Add treasure items to chest based on story choices
            const rewardItems = determineRewards(storyProgress);
            rewardItems.forEach(item => addTreasureItem(item));
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
  }, [allStagesComplete, isSubmitting, storyProgress]);
  
  // Determine rewards based on story choices and relationships
  const determineRewards = (progress) => {
    const rewards = [];
    
    // Base recipe reward that everyone gets
    rewards.push({
      icon: "📜",
      name: "Antonio's Pizza Recipe",
      description: "The authentic recipe recovered from the pirates. A treasured family secret passed down through generations."
    });
    
    // Rewards based on relationship with Sofia
    if (progress.characterRelationships.sofiaTrust > 70) {
      rewards.push({
        icon: "🍕",
        name: "Sofia's Special Schiacciatina Recipe",
        description: "A simple yet delicious flatbread pizza that Sofia has personalized with a special twist just for you."
      });
    }
    
    // Rewards based on relationship with pirates
    if (progress.characterRelationships.pirateRespect > 60) {
      rewards.push({
        icon: "🏴‍☠️",
        name: "Honorary Pirate Flag",
        description: "Captain Marinara has deemed you worthy of flying the Dough Raiders colors. The small flag is embroidered with a pizza slice crossbones design."
      });
    }
    
    // Rewards based on relationship with Antonio
    if (progress.characterRelationships.antonioBond > 80) {
      rewards.push({
        icon: "🎟️",
        name: "VIP Waterpark Invitation",
        description: "Antonio has granted you and a friend all-access passes to the Alpine Splash Waterpark celebration!"
      });
    } else {
      rewards.push({
        icon: "🎟️",
        name: "Waterpark Invitation",
        description: "Antonio and Sofia invite you to join them at the Alpine Splash Waterpark to celebrate saving the recipes!"
      });
    }
    
    return rewards;
  };
  
  // Handle stage completion with story progress updates
  const handleStageComplete = (stageNumber, storyUpdates = {}) => {
    console.log(`Stage ${stageNumber} completed!`);
    
    // Save completion time
    localStorage.setItem(`pizzaioloStage${stageNumber}CompletionTime`, new Date().toLocaleString());
    
    // Mark stage as complete
    markPizzaioloStageComplete(stageNumber);
    
    // Update story progress with any new developments
    setStoryProgress(prev => {
      const updatedProgress = {
        ...prev,
        characterRelationships: {
          ...prev.characterRelationships,
          ...storyUpdates.characterRelationships
        },
        inventory: [
          ...prev.inventory,
          ...(storyUpdates.newItems || [])
        ],
        discoveredLocations: [
          ...prev.discoveredLocations,
          ...(storyUpdates.newLocations || [])
        ],
        storyChoices: {
          ...prev.storyChoices,
          ...storyUpdates.choices
        }
      };
      
      return updatedProgress;
    });
    
    // Force update of current stage and progress after a short delay
    setTimeout(() => {
      // Check which stage should be active now after completion
      const nextStage = getNextPizzaioloStage();
      setCurrentStage(nextStage);
      
      // Update completion status
      if (nextStage > 5) {
        setAllStagesComplete(true);
      }
      
      // Force a UI update by refreshing the next stage timer
      setNextStageTimer(getTimeUntilNextPizzaioloStage());
      
      console.log(`After completion, next available stage is: ${nextStage}`);
    }, 300);
  };

  // Story event handler - triggered by player choices
  const handleStoryEvent = (eventType, eventData) => {
    switch(eventType) {
      case 'RELATIONSHIP_CHANGE':
        setStoryProgress(prev => ({
          ...prev,
          characterRelationships: {
            ...prev.characterRelationships,
            [eventData.character]: Math.max(0, Math.min(100, prev.characterRelationships[eventData.character] + eventData.amount))
          }
        }));
        break;
        
      case 'ADD_INVENTORY':
        setStoryProgress(prev => ({
          ...prev,
          inventory: [...prev.inventory, eventData.item]
        }));
        break;
        
      case 'DISCOVER_LOCATION':
        setStoryProgress(prev => ({
          ...prev,
          discoveredLocations: [...prev.discoveredLocations, eventData.location]
        }));
        break;
        
      case 'MAKE_CHOICE':
        setStoryProgress(prev => ({
          ...prev,
          storyChoices: {
            ...prev.storyChoices,
            [eventData.choiceId]: eventData.option
          }
        }));
        break;
        
      default:
        console.warn('Unknown story event type:', eventType);
    }
  };
  
  // Render appropriate stage based on currentStage
  const renderCurrentStage = () => {
    // If stage isn't available yet, show countdown
    if (!isPizzaioloStageAvailable(currentStage)) {
      return (
        <div className="stage-locked">
          <h3>Next chapter unlocks in:</h3>
          <div className="countdown">
            {nextStageTimer.days}d {nextStageTimer.hours}h {nextStageTimer.minutes}m {nextStageTimer.seconds}s
          </div>
          <p>The story continues soon... Antonio and Sofia are waiting!</p>
          <div className="waiting-animation">
            <span className="emoji">👨‍🍳</span>
            <span className="emoji child">👧</span>
          </div>
        </div>
      );
    }
    
    // Render appropriate stage component with story props
    const commonProps = {
      onComplete: handleStageComplete,
      onStoryEvent: handleStoryEvent,
      storyProgress: storyProgress
    };
    
    switch(currentStage) {
      case 1:
        return <StoryIntroStage {...commonProps} />;
      case 2:
        return <VillageExplorationStage {...commonProps} />;
      case 3:
        return <PirateNegotiationStage {...commonProps} />;
      case 4:
        return <SecretIngredientQuestStage {...commonProps} />;
      case 5:
        return <FinalShowdownStage {...commonProps} />;
      default:
        return null;
    }
  };
  
  // Show completion message and waterpark invitation if all stages complete
  if (allStagesComplete) {
    // Different endings based on story choices
    const isFriendlyWithPirates = storyProgress.characterRelationships.pirateRespect > 70;
    const hasStrongBondWithAntonio = storyProgress.characterRelationships.antonioBond > 80;
    const hasSofiasTrust = storyProgress.characterRelationships.sofiaTrust > 75;
    
    return (
      <div className="challenge-complete">
        <h2>Adventure Complete!</h2>
        <div className="celebration-animation">
          {isFriendlyWithPirates ? '🎉👨‍🍳👧🍕🏴‍☠️🎉' : '🎉👨‍🍳👧🍕🎉'}
        </div>
        
        <div className="story-epilogue">
          <h3>Epilogue</h3>
          
          {/* Different epilogues based on relationships */}
          {hasStrongBondWithAntonio && hasSofiasTrust && isFriendlyWithPirates ? (
            <p className="epilogue-text">
              Through your clever diplomacy, you managed to unite the pirates and Antonio's family in an unlikely alliance! 
              Antonio now supplies Captain Marinara's crew with fresh pizza during their voyages, and in return, the pirates 
              protect the coastal trade routes for Antonio's ingredients. Sofia considers you her hero and has created a 
              special pizza named after you on Antonio's menu!
            </p>
          ) : hasStrongBondWithAntonio && hasSofiasTrust ? (
            <p className="epilogue-text">
              Thanks to your help, Antonio's pizzeria is thriving once again! Sofia has recovered from the pirate ordeal 
              and enjoys making schiacciatina with her father every morning. The pirates haven't been seen in these waters since 
              your confrontation, though sometimes Sofia wonders if they might return someday...
            </p>
          ) : isFriendlyWithPirates ? (
            <p className="epilogue-text">
              Your unusual friendship with Captain Marinara and the Dough Raiders has resulted in an unexpected career change! 
              While Antonio reopened his pizzeria, you occasionally join the pirates on weekend adventures, serving as their 
              official "pizza consultant" and treasure-hunting advisor. Sofia still waves to you from the shore whenever your 
              ship passes by.
            </p>
          ) : (
            <p className="epilogue-text">
              With the recipes recovered and the pirates driven away, life has returned to normal in the small coastal town. 
              Antonio's pizzeria has reopened to great fanfare, and Sofia is once again enjoying her father's special schiacciatina. 
              Though your adventure has concluded, the bonds formed during this quest will last a lifetime.
            </p>
          )}
        </div>
        
        <div className="waterpark-invitation">
          <h3>You're Invited!</h3>
          <p>{hasStrongBondWithAntonio ? "As Antonio's honored guest" : "Antonio and Sofia"} invite you to join the celebration at the Alpine Splash Waterpark!</p>
          <div className="invitation-image">🏔️🏊‍♂️🌊🎢🍕</div>
          <p>A day of water slides, pizza, and fun in the mountains awaits!</p>
          <p className="small-text">
            {isFriendlyWithPirates ? 
              "Is that Captain Marinara's ship anchored near the waterpark? It seems the pirates are joining the party!" : 
              "Wait... is that a pirate ship in the distance? 👀"}
          </p>
        </div>
      </div>
    );
  }
  
  // Progress indicators showing relationship stats
  const renderRelationshipMeters = () => {
    const { antonioBond, sofiaTrust, pirateRespect } = storyProgress.characterRelationships;
    
    return (
      <div className="relationship-meters">
        <div className="relationship-meter">
          <div className="meter-character">👨‍🍳 Antonio</div>
          <div className="meter-background">
            <div className="meter-fill antonio" style={{ width: `${antonioBond}%` }}></div>
          </div>
        </div>
        
        <div className="relationship-meter">
          <div className="meter-character">👧 Sofia</div>
          <div className="meter-background">
            <div className="meter-fill sofia" style={{ width: `${sofiaTrust}%` }}></div>
          </div>
        </div>
        
        <div className="relationship-meter">
          <div className="meter-character">🏴‍☠️ Pirates</div>
          <div className="meter-background">
            <div className="meter-fill pirates" style={{ width: `${pirateRespect}%` }}></div>
          </div>
        </div>
      </div>
    );
  };
  
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
        <h2><span className="challenge-icon">🍕</span> The Secret Recipe Adventure</h2>
        <p className="challenge-description">
          Help Antonio recover his stolen family recipes from Captain Marinara and the Dough Raiders in this Italian adventure!
        </p>
      </div>
      
      {renderRelationshipMeters()}
      
      <div className="story-progress">
        <div className="progress-label">Story Progress:</div>
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
              if (isPizzaioloStageAvailable(stageNum) || isPizzaioloStageComplete(stageNum)) {
                setCurrentStage(stageNum);
              }
            }}
          >
            {isPizzaioloStageComplete(stageNum) ? '✓' : stageNum}
          </div>
        ))}
      </div>
      
      {/* Inventory display */}
      {storyProgress.inventory.length > 0 && (
        <div className="inventory-display">
          <h4>Your Inventory:</h4>
          <div className="inventory-items">
            {storyProgress.inventory.map((item, index) => (
              <div key={index} className="inventory-item" title={item.description}>
                <span className="item-icon">{item.icon}</span>
                <span className="item-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="stage-container">
        {renderCurrentStage()}
      </div>
    </div>
  );
};

export default PizzaioloChallenge;