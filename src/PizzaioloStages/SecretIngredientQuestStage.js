// SecretIngredientQuestStage.js
import React, { useState, useEffect } from 'react';
import './PizzaioloStages.css';

const SecretIngredientQuestStage = ({ onComplete, onStoryEvent, storyProgress }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [userChoices, setUserChoices] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [clueState, setClueState] = useState({
    discoveredClues: [],
    requiredClues: ['dawn', 'mountain', 'flower', 'bee', 'wild'],
    attempts: 0,
    secretIngredient: '',
    solved: false
  });
  
  // Is Sofia present based on previous choices?
  const isSofiaPresent = storyProgress.storyChoices.sofia_journey === 'bring_along' || 
                         storyProgress.storyChoices.sofia_journey === 'parent_decides';
  
  

  
  // Save choices and clue state when they change
  useEffect(() => {
    if (Object.keys(userChoices).length > 0) {
      localStorage.setItem('pizzaioloStage4Choices', JSON.stringify(userChoices));
    }
    
    if (clueState.discoveredClues.length > 0 || clueState.attempts > 0 || clueState.secretIngredient !== '') {
      localStorage.setItem('pizzaioloStage4ClueState', JSON.stringify(clueState));
    }
  }, [userChoices, clueState]);
  
  // Stories and Clues component
  const StoryCluesComponent = () => {
    const [activeStory, setActiveStory] = useState(0);
    const [feedback, setFeedback] = useState('');
    
    const stories = [
      {
        id: 1,
        title: "Antonio's Childhood Memory",
        content: <>
          <p>Antonio leans back against an olive tree, remembering his childhood:</p>
          <p>"My grandmother would wake before <strong>dawn</strong> to begin baking. She always said the morning air added magic to the dough. She would take me to gather ingredients from the <strong>mountain</strong> slopes, where the purest things grow. That's where I first learned about baking."</p>
        </>,
        clues: ['dawn', 'mountain']
      },
      {
        id: 2,
        title: "Sofia's Discovery",
        content: <>
          {isSofiaPresent ? (
            <>
              <p>Sofia tugs at your sleeve excitedly:</p>
              <p>"I remember when I discovered Papa's secret ingredient! We were walking in the hills and I saw a <strong>bee</strong> going from <strong>flower</strong> to flower. I followed it and found where it lived! Papa said that's where the magic comes from."</p>
            </>
          ) : (
            <>
              <p>Antonio smiles, remembering a story about Sofia:</p>
              <p>"Sofia discovered my secret ingredient by accident. We were walking in the hills when she spotted a <strong>bee</strong> moving from <strong>flower</strong> to flower. She was so curious that she followed it, and that's when I showed her where the special ingredient comes from."</p>
            </>
          )}
        </>,
        clues: ['bee', 'flower']
      },
      {
        id: 3,
        title: "The Pirate's Observation",
        content: <>
          <p>You remember something Breadbeard mentioned during your encounter:</p>
          <p>"The first mate said he tried to use regular honey in the recipe, but it wasn't the same. He specifically mentioned that it needed to be <strong>wild</strong> - something about the flavor being different when the bees gather nectar from the hillside herbs."</p>
        </>,
        clues: ['wild']
      },
      {
        id: 4,
        title: "A Foraging Lesson",
        content: <>
          <p>Antonio points to the various plants growing around you:</p>
          <p>"My father taught me which ingredients were best for each recipe. He always said that the most precious ingredients cannot be bought in stores - they must be found in nature, unchanged by human hands. The untamed flavors are what make a dish truly special."</p>
        </>,
        clues: []
      }
    ];
    
    const handleStorySelection = (index) => {
      setActiveStory(index);
    };
    
    const collectClue = (clue) => {
      if (clueState.discoveredClues.includes(clue)) {
        setFeedback(`You've already noted this clue about "${clue}".`);
        return;
      }
      
      setClueState(prev => ({
        ...prev,
        discoveredClues: [...prev.discoveredClues, clue]
      }));
      
      setFeedback(`You've noted an important clue about "${clue}"!`);
      
      // Increase relationship with the character who provided the clue
      if (stories[activeStory].id === 1) {
        // Antonio's story
        onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 });
      } else if (stories[activeStory].id === 2) {
        // Sofia's story
        onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: 5 });
      }
    };
    
    const handleSecretIngredientGuess = () => {
      const normalized = clueState.secretIngredient.toLowerCase().trim();
      
      setClueState(prev => ({
        ...prev,
        attempts: prev.attempts + 1
      }));
      
      if (normalized === 'wild honey') {
        setFeedback("That's it! 'Wild honey' is the secret ingredient in Sofia's schiacciatina!");
        setClueState(prev => ({
          ...prev,
          solved: true
        }));
        
        // Move to the next scene after a delay
        setTimeout(() => {
          setCurrentSceneIndex(currentSceneIndex + 1);
        }, 2000);
      } else if (normalized.includes('wild') && normalized.includes('honey')) {
        setFeedback("You're very close! Just adjust your wording slightly...");
      } else if (normalized.includes('honey')) {
        setFeedback("You're on the right track with honey, but there's an important adjective missing...");
      } else if (normalized.includes('wild')) {
        setFeedback("'Wild' is part of it, but what specific ingredient is wild?");
      } else {
        setFeedback("That's not right. Try combining the clues you've collected.");
      }
    };
    
    return (
      <div className="story-clues-component">
        <div className="clues-collected">
          <h4>Clues Collected:</h4>
          {clueState.discoveredClues.length === 0 ? (
            <p className="no-clues">No clues collected yet. Listen to stories to find clues.</p>
          ) : (
            <div className="clue-tags">
              {clueState.discoveredClues.map((clue) => (
                <span key={clue} className="clue-tag">{clue}</span>
              ))}
            </div>
          )}
        </div>
        
        <div className="story-selector">
          <h4>Explore Memories and Conversations:</h4>
          <div className="story-tabs">
            {stories.map((story, index) => (
              <button 
                key={story.id}
                className={`story-tab ${activeStory === index ? 'active' : ''}`}
                onClick={() => handleStorySelection(index)}
              >
                {story.title}
              </button>
            ))}
          </div>
        </div>
        
        <div className="story-content">
          {stories[activeStory].content}
          
          {stories[activeStory].clues.length > 0 && (
            <div className="collect-clues">
              <p>This story contains clues. Click on a word to collect it:</p>
              <div className="clue-buttons">
                {stories[activeStory].clues.map(clue => (
                  <button 
                    key={clue}
                    className={`clue-button ${clueState.discoveredClues.includes(clue) ? 'collected' : ''}`}
                    onClick={() => collectClue(clue)}
                  >
                    {clue}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="secret-ingredient-guess">
          <h4>The Secret Ingredient</h4>
          <p>Using the clues you've collected, what do you think is the secret ingredient in Sofia's schiacciatina?</p>
          <div className="guess-input-group">
            <input 
              type="text"
              value={clueState.secretIngredient}
              onChange={(e) => setClueState(prev => ({ ...prev, secretIngredient: e.target.value }))}
              placeholder="Enter your guess..."
              className="guess-input"
            />
            <button 
              className="guess-button"
              onClick={handleSecretIngredientGuess}
              disabled={!clueState.secretIngredient.trim()}
            >
              Check
            </button>
          </div>
          
          {feedback && (
            <div className={`feedback-message ${clueState.solved ? 'success' : 'hint'}`}>
              {feedback}
            </div>
          )}
          
          {clueState.attempts > 0 && !clueState.solved && (
            <div className="attempts-counter">
              Attempts: {clueState.attempts}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Define the scenes for this stage
  const scenes = [
    {
      id: 'hillside-arrival',
      background: 'tuscan-hillside',
      content: <>
        <h3>The Hillside Search</h3>
        <p>Following the directions from Captain Marinara, you've arrived in the Tuscan countryside. Rolling hills covered in wildflowers stretch out before you, with groves of olive trees dotting the landscape.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"These hills remind me of where I grew up. My family has gathered ingredients from places like this for generations."</p>
          </div>
        </div>
        
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"Papa, look at all the flowers! Can we make schiacciatina soon? I miss it so much!"</p>
            </div>
          </div>
        )}
        
        <p>As you search for clues to the secret ingredient, you decide to discuss what you know so far.</p>
      </>,
      choices: [
        {
          id: 'hillside-approach',
          options: [
            { 
              text: "Let's share stories and memories to find clues", 
              nextScene: 'story-exploration',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 });
              }
            },
            { 
              text: "We should methodically search the area", 
              nextScene: 'systematic-search',
              effect: () => {
                // No additional effects
              }
            }
          ]
        }
      ]
    },
    {
      id: 'systematic-search',
      background: 'herb-gathering',
      content: <>
        <h3>A Systematic Approach</h3>
        <p>You decide to methodically explore the hillside, examining the local flora and discussing potential ingredients.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Good idea. Let me share what I know about ingredients from these hills while we look."</p>
          </div>
        </div>
        
        <p>As you walk, Antonio points out various herbs and plants, sharing stories about his family recipes and traditions.</p>
        
        <p>After some exploration, you find yourselves in a sunny clearing surrounded by wildflowers. The gentle buzzing of bees fills the air.</p>
        
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"Papa! Look at the bees! Remember when you showed me where they make the special sweet stuff for my bread?"</p>
            </div>
          </div>
        )}
      </>,
      choices: [
        {
          id: 'search-response',
          options: [
            { 
              text: "Let's share memories about making schiacciatina", 
              nextScene: 'story-exploration',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: 5 });
                // Already discovered some clues
                setClueState(prev => ({
                  ...prev,
                  discoveredClues: [...new Set([...prev.discoveredClues, 'bee', 'flower'])]
                }));
              }
            }
          ]
        }
      ]
    },
    {
      id: 'story-exploration',
      background: 'hillside-rest',
      content: <>
        <h3>Gathering Clues</h3>
        <p>You find a peaceful spot under an olive tree to rest and share stories. The afternoon sun casts a golden glow over the Tuscan hills as you discuss recipes, memories, and traditions.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"The secret ingredient in Sofia's schiacciatina is something very special - it's been part of my family's recipes for generations."</p>
          </div>
        </div>
        
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"It makes the bread taste sweet and special! I helped Papa find it once, remember?"</p>
            </div>
          </div>
        )}
        
        <p>Through your conversations, you hope to gather enough clues to identify the secret ingredient.</p>
      </>,
      choices: null, // No choices - show clue-gathering component
      minigame: <StoryCluesComponent />
    },
    {
      id: 'ingredient-discovery',
      background: 'honey-discovery',
      content: <>
        <h3>Eureka Moment</h3>
        <p>As you piece together the clues from the various stories and memories, it all becomes clear!</p>
        
        <div className="dialogue">
          <div className="character-avatar person">👤</div>
          <div className="dialogue-bubble">
            <p className="character-name">You</p>
            <p>"Wild honey! That's the secret ingredient in Sofia's schiacciatina!"</p>
          </div>
        </div>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Exactly! Not just any honey - wild honey from bees that feed on the mountain herbs and flowers. It gives the bread a subtle sweetness and depth you can't get from store-bought honey."</p>
          </div>
        </div>
        
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"That's it! I discovered it when I followed a bee to its hive in the hills. Papa says it's magic honey because the bees visit all the special flowers!"</p>
            </div>
          </div>
        )}
        
        <p>With this knowledge, you'll be able to recreate Sofia's special schiacciatina and complete Antonio's recipe collection.</p>
      </>,
      choices: [
        {
          id: 'discovery-response',
          options: [
            { 
              text: "Now we need to find Breadbeard to get the final recipe!", 
              nextScene: 'stage-end',
              effect: () => {
                onStoryEvent('ADD_INVENTORY', { 
                  item: {
                    icon: "🍯",
                    name: "Knowledge of Wild Honey",
                    description: "The discovery that wild honey from mountain flowers is the secret ingredient in Sofia's schiacciatina."
                  }
                });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'stage-end',
      background: 'sunset-hills',
      content: <>
        <div className="story-transition">
          <h3>Chapter 4 Complete</h3>
          <p>With the secret ingredient identified, you now have a crucial piece of knowledge for your quest.</p>
          
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"Now that we know the secret ingredient is wild honey, we can finally confront Breadbeard and complete my recipe book. We're so close to success!"</p>
            </div>
          </div>
          
          {isSofiaPresent && (
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"I can't wait to taste my special bread again! Do you think the pirates have tried to make it?"</p>
              </div>
            </div>
          )}
          
          <p>As the sun sets over the Tuscan hills, you prepare for your final confrontation with the pirate first mate, Breadbeard, who holds the last page of Antonio's treasured recipe book...</p>
        </div>
      </>,
      choices: null // End of stage
    }
  ];
  
  // Check if previously completed
  useEffect(() => {
    const isStageComplete = localStorage.getItem('pizzaioloStage4Complete') === 'true';
    if (isStageComplete) {
      setIsComplete(true);
      setCurrentSceneIndex(scenes.length - 1); // Show the final scene
    }
    
    // Load previous choices if available
    const savedChoices = localStorage.getItem('pizzaioloStage4Choices');
    if (savedChoices) {
      setUserChoices(JSON.parse(savedChoices));
    }
    
    // Load clue state if available
    const savedClueState = localStorage.getItem('pizzaioloStage4ClueState');
    if (savedClueState) {
      setClueState(JSON.parse(savedClueState));
    }
  }, [scenes.length]);

  // Current scene based on index
  const currentScene = scenes[currentSceneIndex];
  
  // Handle user choice selection
  const handleChoice = (choiceId, option) => {
    // Find the selected option object
    const choiceSet = currentScene.choices.find(choice => choice.id === choiceId);
    const selectedOption = choiceSet.options.find(opt => opt.text === option);
    
    // Execute any effects from this choice
    if (selectedOption.effect) {
      selectedOption.effect();
    }
    
    // Save the user's choice
    setUserChoices(prev => ({
      ...prev,
      [choiceId]: selectedOption.nextScene === 'stage-end' 
        ? option.toLowerCase().replace(/\s+/g, '_') // Convert option text to a key
        : selectedOption.nextScene 
    }));
    
    // Move to the next scene
    const nextSceneIndex = scenes.findIndex(scene => scene.id === selectedOption.nextScene);
    if (nextSceneIndex !== -1) {
      setCurrentSceneIndex(nextSceneIndex);
    }
    
    // If moving to the final scene, complete the stage
    if (selectedOption.nextScene === 'stage-end') {
      completeStage();
    }
  };
  
  // Function to complete the stage
  const completeStage = () => {
    setIsComplete(true);
    
    // Pass story updates to parent component
    onComplete(4, {
      choices: userChoices,
      newItems: [], // Items already added through scene effects
      newLocations: ["Tuscan Countryside", "Hillside"],
      characterRelationships: {
        // No additional relationship changes - already handled in scene effects
      }
    });
  };
  
  return (
    <div className="stage-content story-stage">
      {isComplete ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h4>Chapter Complete: The Secret Ingredient</h4>
          <p>You've discovered that wild honey from mountain flowers is the secret ingredient in Sofia's special schiacciatina!</p>
          <p>Now you must find Breadbeard to recover the final recipe page and complete Antonio's recipe book.</p>
          <div className="next-stage-hint">
            <p>Your adventure continues in the next chapter, coming soon...</p>
          </div>
        </div>
      ) : (
        <div className={`story-scene ${currentScene.background}`}>
          <div className="scene-content">
            {currentScene.content}
          </div>
          
          {currentScene.minigame && currentScene.minigame}
          
          {currentScene.choices && (
            <div className="choice-container">
              <h4>What will you do?</h4>
              {currentScene.choices.map(choice => (
                <div key={choice.id} className="choice-set">
                  {choice.options.map(option => (
                    <button 
                      key={option.text}
                      className="choice-button"
                      onClick={() => handleChoice(choice.id, option.text)}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
          
          {!currentScene.choices && !currentScene.minigame && currentScene.id !== 'stage-end' && (
            <button 
              className="continue-button"
              onClick={() => setCurrentSceneIndex(currentSceneIndex + 1)}
            >
              Continue
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SecretIngredientQuestStage;