import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './PizzaioloStages.css';

// Simple Market Exploration Component
const SimpleMarketExploration = ({ onStoryEvent, isSofiaPresent, onMarketComplete }) => {
  const [selectedStall, setSelectedStall] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showCompletionButton, setShowCompletionButton] = useState(false);
  
  // Load any saved progress
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('pizzaioloStage2Market') || '{"clues":[],"ingredients":[]}');
    
    if (savedState.clues && savedState.clues.includes('hideout-location') && savedState.clues.includes('puzzle-box')) {
      setShowCompletionButton(true);
    } else if ((savedState.ingredients || []).length >= 3) {
      setShowCompletionButton(true);
    }
    
    if (savedState.messages && savedState.messages.length > 0) {
      setMessages(savedState.messages);
    }
  }, []);
  
  // Market stalls data
  const stalls = [
    {
      id: 'produce',
      name: 'Fresh Produce',
      vendor: 'Maria',
      description: 'Vibrant fruits and vegetables from local farms',
      image: '🍅'
    },
    {
      id: 'spices',
      name: 'Spice Merchant',
      vendor: 'Giuseppe',
      description: 'Aromatic herbs and spices from around the Mediterranean',
      image: '🌿'
    },
    {
      id: 'cheese',
      name: 'Cheese Shop',
      vendor: 'Francesca',
      description: 'Artisanal cheeses aged to perfection',
      image: '🧀'
    },
    {
      id: 'bakery',
      name: 'Village Bakery',
      vendor: 'Marco',
      description: 'Fresh-baked bread and pastries',
      image: '🍞'
    },
    {
      id: 'fishmonger',
      name: 'Fish Market',
      vendor: 'Paolo',
      description: 'Seafood caught fresh from the Mediterranean',
      image: '🐟'
    }
  ];
  
  // Function to add messages
  const addMessage = (text) => {
    setMessages([text]);
    
    const savedState = JSON.parse(localStorage.getItem('pizzaioloStage2Market') || '{"clues":[],"ingredients":[],"messages":[]}');
    savedState.messages = [text];
    localStorage.setItem('pizzaioloStage2Market', JSON.stringify(savedState));
  };
  
  // Function to handle ingredient questions
  const askAboutIngredients = (stallId) => {
    const stall = stalls.find(s => s.id === stallId);
    if (!stall) return;
    
    let message = `You ask ${stall.vendor} about special ingredients for pizza. `;
    
    if (stallId === 'produce') {
      message += `"The freshest San Marzano tomatoes are key," ${stall.vendor} whispers. "And I may have heard the pirates talking about wild honey while they were in town."`;
      
      const savedState = JSON.parse(localStorage.getItem('pizzaioloStage2Market') || '{"clues":[],"ingredients":[]}');
      if (!savedState.ingredients.includes('tomatoes')) {
        savedState.ingredients.push('tomatoes');
        localStorage.setItem('pizzaioloStage2Market', JSON.stringify(savedState));
        
        if (savedState.ingredients.length >= 3) {
          setShowCompletionButton(true);
        }
      }
    } else if (stallId === 'spices') {
      message += `"A touch of wild oregano from the hills makes Antonio's pizza special," says ${stall.vendor}. "I sold him some just before the pirates came."`;
      
      const savedState = JSON.parse(localStorage.getItem('pizzaioloStage2Market') || '{"clues":[],"ingredients":[]}');
      if (!savedState.ingredients.includes('oregano')) {
        savedState.ingredients.push('oregano');
        localStorage.setItem('pizzaioloStage2Market', JSON.stringify(savedState));
        
        if (savedState.ingredients.length >= 3) {
          setShowCompletionButton(true);
        }
      }
    } else {
      message += `${stall.vendor} shares some common ingredients but nothing particularly special.`;
    }
    
    addMessage(message);
  };
  
  // Function to handle pirate questions
  const askAboutPirates = (stallId) => {
    const stall = stalls.find(s => s.id === stallId);
    if (!stall) return;
    
    let message = `You ask ${stall.vendor} if they've seen the pirates. `;
    
    if (stallId === 'fishmonger') {
      message += `"Those Dough Raiders? I saw their ship heading south toward Pisa last night," ${stall.vendor} says quietly. "Their captain was boasting about some puzzle box they acquired."`;
      
      onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 5 });
      
      const savedState = JSON.parse(localStorage.getItem('pizzaioloStage2Market') || '{"clues":[],"ingredients":[]}');
      if (!savedState.clues.includes('puzzle-box')) {
        savedState.clues.push('puzzle-box');
        localStorage.setItem('pizzaioloStage2Market', JSON.stringify(savedState));
        
        if (savedState.clues.includes('hideout-location') && savedState.clues.includes('puzzle-box')) {
          setShowCompletionButton(true);
        }
      }
    } else if (stallId === 'bakery') {
      message += `${stall.vendor} leans in close. "They tried to recruit me! Said they needed a baker who knows Italian techniques. I refused, but they mentioned a hideout near the tower."`;
      
      const savedState = JSON.parse(localStorage.getItem('pizzaioloStage2Market') || '{"clues":[],"ingredients":[]}');
      if (!savedState.clues.includes('hideout-location')) {
        savedState.clues.push('hideout-location');
        localStorage.setItem('pizzaioloStage2Market', JSON.stringify(savedState));
        
        if (savedState.clues.includes('hideout-location') && savedState.clues.includes('puzzle-box')) {
          setShowCompletionButton(true);
        }
      }
    } else {
      message += `${stall.vendor} hasn't seen the pirates personally but heard they were causing trouble at the harbor.`;
    }
    
    addMessage(message);
  };

  // Function to handle buying items
  const buySomething = (stallId) => {
    const stall = stalls.find(s => s.id === stallId);
    if (!stall) return;
    
    let message = `You purchase something from ${stall.vendor}. `;
    
    if (stallId === 'spices') {
      message += `You buy a small pouch of special herbs. ${stall.vendor} smiles. "These will come in handy if you're trying to recreate Antonio's flavors."`;
      
      onStoryEvent('ADD_INVENTORY', { 
        item: {
          icon: "🌿",
          name: "Italian Herb Blend",
          description: "A special mix of herbs that might help identify authentic ingredients."
        }
      });
    } else if (stallId === 'produce') {
      message += `You buy some ripe tomatoes. ${stall.vendor} slips you an extra one. "For the little one," she whispers with a wink at Sofia.`;
      
      if (isSofiaPresent) {
        onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: 5 });
      }
    } else {
      message += `You purchase some local specialties that might come in handy later.`;
    }
    
    addMessage(message);
  };
  
  return (
    <div className="market-exploration">
      <h3>Pisa Market Exploration</h3>
      <p>Explore the local market to gather information about the pirates and recipe ingredients.</p>
      
      {/* Market stalls */}
      <div className="market-stalls" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {stalls.map(stall => (
          <div 
            key={stall.id}
            className="market-stall"
            style={{
              padding: '10px', 
              border: selectedStall === stall.id ? '2px solid #ff9f9f' : '1px solid #6a3a3a',
              borderRadius: '8px',
              width: 'calc(33% - 10px)',
              minWidth: '120px',
              backgroundColor: selectedStall === stall.id ? 'rgba(50, 20, 20, 0.7)' : 'rgba(30, 10, 10, 0.5)',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedStall(stall.id)}
          >
            <div style={{ fontSize: '24px', textAlign: 'center', marginBottom: '5px' }}>{stall.image}</div>
            <h4 style={{ margin: '0 0 5px 0', textAlign: 'center' }}>{stall.name}</h4>
            <p style={{ margin: '0', fontSize: '14px', textAlign: 'center', color: '#bfbfbf' }}>{stall.vendor}</p>
          </div>
        ))}
      </div>
      
      {/* Selected stall details and actions */}
      {selectedStall && (
        <div className="stall-interaction" style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: 'rgba(30, 10, 10, 0.5)',
          border: '1px solid #ff6b6b',
          borderRadius: '8px'
        }}>
          <h4>{stalls.find(s => s.id === selectedStall)?.name}</h4>
          <p>{stalls.find(s => s.id === selectedStall)?.description}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
            <button 
              style={{ 
                padding: '8px', 
                backgroundColor: 'rgba(50, 20, 20, 0.7)', 
                border: '1px solid #ff6b6b',
                color: '#e0c9a6',
                cursor: 'pointer'
              }}
              onClick={() => askAboutIngredients(selectedStall)}
            >
              Ask about special ingredients
            </button>
            <button 
              style={{ 
                padding: '8px', 
                backgroundColor: 'rgba(50, 20, 20, 0.7)', 
                border: '1px solid #ff6b6b',
                color: '#e0c9a6',
                cursor: 'pointer'
              }}
              onClick={() => askAboutPirates(selectedStall)}
            >
              Ask about the pirates
            </button>
            <button 
              style={{ 
                padding: '8px', 
                backgroundColor: 'rgba(50, 20, 20, 0.7)', 
                border: '1px solid #ff6b6b',
                color: '#e0c9a6',
                cursor: 'pointer'
              }}
              onClick={() => buySomething(selectedStall)}
            >
              Buy something
            </button>
          </div>
        </div>
      )}
      
      {/* Conversations log */}
      <div style={{ marginBottom: '20px' }}>
        <h4>Conversations</h4>
        <div style={{ 
          height: '200px', 
          overflowY: 'auto', 
          backgroundColor: 'rgba(10, 5, 5, 0.5)',
          border: '1px solid #6a3a3a',
          borderRadius: '8px',
          padding: '10px'
        }}>
          {messages.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#8a8a8a' }}>Click on a market stall to begin exploring</p>
          ) : (
            <div>
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  style={{ 
                    marginBottom: '10px', 
                    paddingBottom: '10px', 
                    borderBottom: index < messages.length - 1 ? '1px solid rgba(255, 107, 107, 0.3)' : 'none' 
                  }}
                >
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Completion button */}
      {showCompletionButton && (
        <button 
          style={{
            display: 'block',
            margin: '0 auto',
            padding: '12px 25px',
            backgroundColor: 'rgba(50, 100, 50, 0.5)',
            border: '1px solid #6adb6a',
            color: '#e0c9a6',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          onClick={() => onMarketComplete()}
        >
          Continue the Journey
        </button>
      )} 
    </div>
  );
};

const VillageExplorationStage = ({ onComplete, onStoryEvent, storyProgress }) => {
  // Main state
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Is Sofia present based on previous choices?
  const isSofiaPresent = storyProgress.storyChoices.sofia_journey === 'bring_along' || 
                        storyProgress.storyChoices.sofia_journey === 'parent_decides';
                         
  const scenes = useMemo(() => [
    {
      id: 'arrival-pisa',
      background: 'pisa-town',
      content: <>
        <h3>Arrival in Pisa</h3>
        <p>After a long journey, you and Antonio {isSofiaPresent ? 'and Sofia ' : ''}arrive in the bustling town of Pisa. The famous leaning tower is visible in the distance, its tilt immediately recognizable.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"We made it! But where do we start looking? The tower is always surrounded by tourists. The pirates must have left the next clue somewhere specific."</p>
          </div>
        </div>
        
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"Papa, I'm hungry. Can we get something to eat at the market? Maybe someone there has seen the pirates!"</p>
            </div>
          </div>
        )}
        
        <p>The local market is bustling with activity, and might be a good place to gather information.</p>
      </>,
      choices: [
        {
          id: 'pisa-plan',
          options: [
            { 
              text: "Let's explore the market first for information.", 
              nextScene: 'market-exploration',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 });
                if (isSofiaPresent) {
                  onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: 10 });
                }
              }
            },
            { 
              text: "We should go directly to the tower.", 
              nextScene: 'tower-detour',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: -5 });
                if (isSofiaPresent) {
                  onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: -5 });
                }
              }
            },
            { 
              text: "Let's split up to cover more ground.", 
              nextScene: 'split-up-trouble',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: -10 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 5 });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'tower-detour',
      background: 'leaning-tower',
      content: <>
        <h3>The Famous Leaning Tower</h3>
        <p>You make your way directly to the Leaning Tower of Pisa, but the area is swarming with tourists. After hours of searching around the tower, you find no sign of pirates or clues.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"This isn't working. There are too many people here, and we don't even know what we're looking for exactly. Perhaps we should have asked around first..."</p>
          </div>
        </div>
        
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"I'm tired and hungry, Papa. Can we please get something to eat now?"</p>
            </div>
          </div>
        )}
        
        <p>As the sun begins to set, you decide to head to the market before it closes for the day.</p>
      </>,
      choices: [
        {
          id: 'market-redirect',
          options: [
            { 
              text: "The market is our best option now.", 
              nextScene: 'market-exploration',
              effect: () => {
                // No relationship changes - already lost some points from the detour
              }
            }
          ]
        }
      ]
    },
    {
      id: 'split-up-trouble',
      background: 'pisa-alley',
      content: <>
        <h3>An Unexpected Encounter</h3>
        <p>You decide to split up to cover more ground. Antonio{isSofiaPresent ? ' and Sofia' : ''} head to the market, while you explore near the tower.</p>
        
        <p>As you wander through a quiet alley, you notice a figure watching you from the shadows. Before you can react, you're confronted by a rough-looking man with a bandana.</p>
        
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Pirate Scout</p>
            <p>"Well, well... you're not from around here, are you? Word is someone's been asking about Captain Marinara's crew. That wouldn't be you, would it?"</p>
          </div>
        </div>
      </>,
      choices: [
        {
          id: 'pirate-encounter',
          options: [
            { 
              text: "I'm just a tourist admiring the tower.", 
              nextScene: 'pirate-skeptical',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: -10 });
              }
            },
            { 
              text: "I'm looking for the Dough Raiders. I have business with your captain.", 
              nextScene: 'pirate-interested',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 20 });
              }
            },
            { 
              text: "You're with the pirates who stole Antonio's recipes!", 
              nextScene: 'pirate-alarmed',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: -5 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'market-exploration',
      background: 'pisa-market',
      content: <>
        <h3>The Vibrant Pisa Market</h3>
        <p>The market is bustling with local vendors selling fresh produce, spices, cheeses, and more. If anyone has information about the pirates or special recipe ingredients, this would be the place to find it.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Many of these vendors know me - I've sourced ingredients from them for years. Let's split up and ask around."</p>
          </div>
        </div>
        
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"Can I help too? I remember what goes in my special schiacciatina!"</p>
            </div>
          </div>
        )}
        
        <p>Time to explore the market and gather information...</p>
      </>,
      choices: null, // No choices - show minigame component
      minigame: true
    },
    {
      id: 'stage-end',
      background: 'pisa-sunset',
      content: <>
        <div className="story-transition">
          <h3>Chapter 2 Complete</h3>
          <p>Your exploration of Pisa has yielded valuable information. You've learned about special ingredients in Antonio's recipes and discovered clues about the pirates' whereabouts.</p>
          
          <p>As the sun sets over Pisa, you gather with Antonio{isSofiaPresent ? ' and Sofia' : ''} to share what you've learned.</p>
          
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"So the pirates have a hideout near the tower, and they're using some kind of puzzle box to protect the recipes. We're making progress!"</p>
            </div>
          </div>
          
          {isSofiaPresent && (
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"I can't wait to get my special recipe back. Do you think we'll have to fight the pirates?"</p>
              </div>
            </div>
          )}
          
          <p>Tomorrow, you'll approach the pirates' hideout. But first, you need to prepare a strategy...</p>
        </div>
      </>,
      choices: null // End of stage
    }
  ], [isSofiaPresent, onStoryEvent]);

  // Function to complete the stage
  const completeStage = useCallback(() => {
    // Only proceed if not already complete
    if (isComplete) return;
    
    console.log('Completing stage 2...');
    setIsComplete(true);
    
    
    // Mark the stage as complete in localStorage
    localStorage.setItem('pizzaioloStage2Complete', 'true');
    
    // Move to the final scene
    setCurrentSceneIndex(scenes.length - 1);
    
    // Pass story updates to parent component
    onComplete(2, {
      choices: {
        market_explored: true
      },
      newItems: [
        {
          icon: "📜",
          name: "Ingredient Notes",
          description: "Notes about the special ingredients used in Antonio's pizza recipes."
        },
        {
          icon: "🔍",
          name: "Pirate Hideout Location",
          description: "Information about where the Dough Raiders might be hiding near the Leaning Tower."
        }
      ],
      newLocations: ["Pisa", "Leaning Tower", "Pisa Market"],
      characterRelationships: {
        // Small bonus for positive vendor interactions in the market
        antonioBond: 5
      }
    });
  }, [isComplete, scenes.length, onComplete]);
  
  // Handle market completion
  const handleMarketComplete = useCallback(() => {
    // Store market completion flag
    localStorage.setItem('pizzaioloStage2Market_completed', 'true');
    completeStage();
  }, [completeStage]);
  
  // Check for stage completion on mount
  useEffect(() => {
    const isStageComplete = localStorage.getItem('pizzaioloStage2Complete') === 'true';
    if (isStageComplete) {
      setIsComplete(true);
      setCurrentSceneIndex(scenes.length - 1);
    } else {
      const isMarketCompleted = localStorage.getItem('pizzaioloStage2Market_completed') === 'true';
      if (isMarketCompleted) {
        completeStage();
      }
    }
  }, [completeStage, scenes.length]);
  
  // Handle user choice selection
  const handleChoice = (choiceId, option) => {
    // Find the selected option object
    const choiceSet = currentScene.choices.find(choice => choice.id === choiceId);
    const selectedOption = choiceSet.options.find(opt => opt.text === option);
    
    // Execute any effects from this choice
    if (selectedOption.effect) {
      selectedOption.effect();
    }
    
    // Move to the next scene
    const nextSceneIndex = scenes.findIndex(scene => scene.id === selectedOption.nextScene);
    if (nextSceneIndex !== -1) {
      setCurrentSceneIndex(nextSceneIndex);
    }
  };
  
  // Current scene based on index
  const currentScene = scenes[currentSceneIndex];
  
  return (
    <div className="stage-content story-stage">
      {isComplete ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h4>Chapter Complete: The Pisa Investigation</h4>
          <p>Your exploration of Pisa has yielded valuable information about the pirates' hideout and Antonio's special ingredients.</p>
          <p>Now you must prepare to confront the Dough Raiders directly to recover the stolen recipes!</p>
          <div className="next-stage-hint">
            <p>The next chapter of your adventure will unlock soon...</p>
          </div>
        </div>
      ) : (
        <div className={`story-scene ${currentScene.background}`}>
          <div className="scene-content">
            {currentScene.content}
          </div>
          
          {/* Render market exploration minigame if current scene has minigame flag */}
          {currentScene.minigame && (
            <SimpleMarketExploration 
              onStoryEvent={onStoryEvent}
              isSofiaPresent={isSofiaPresent}
              onMarketComplete={handleMarketComplete}
            />
          )}
          
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
 
export default VillageExplorationStage;