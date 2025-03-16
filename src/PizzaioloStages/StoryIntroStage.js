// StoryIntroStage.js
import React, { useState, useEffect } from 'react';
import './PizzaioloStages.css';

const StoryIntroStage = ({ onComplete, onStoryEvent, storyProgress }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [userChoices, setUserChoices] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  
  // Cipher puzzle state
  const [cipherInput, setCipherInput] = useState('');
  const [cipherAttempts, setCipherAttempts] = useState(0);
  const [cipherSolved, setCipherSolved] = useState(false);
  const [cipherHintLevel, setCipherHintLevel] = useState(0);
  const correctCipherSolution = "SEEK THE HIDDEN ENTRANCE";
  
  // The story scenes
  const scenes = [
    {
      id: 'intro',
      background: 'coastal-village',
      content: <>
        <p>The salty breeze carries the aroma of fresh dough as you approach the small coastal Italian village. 
        Suddenly, you notice a commotion near the harbor. An older man is frantically gesturing at a ship 
        sailing away in the distance, a black flag with a pizza-shaped skull fluttering in the wind.</p>
        
        <p>As you get closer, you can hear the man's distressed voice:</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Mamma mia! They've taken everything! All my family recipes... generations of pizza secrets... gone!"</p>
          </div>
        </div>
      </>,
      choices: null // No choices yet, just continue
    },
    {
      id: 'meet-antonio',
      background: 'pizzeria-exterior',
      content: <>
        <p>The man introduces himself as Antonio, owner of the village's beloved pizzeria. His eyes are red with tears.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Those pirates... the Dough Raiders they call themselves! They've stolen my recipe book that's been in my family for generations. Without those recipes, I'll have to close my pizzeria! My daughter Sofia... she'll be heartbroken."</p>
          </div>
        </div>
        
        <p>A small girl appears in the doorway of the pizzeria, her eyes wide with concern.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👧</div>
          <div className="dialogue-bubble">
            <p className="character-name">Sofia</p>
            <p>"Papa? Who is this? Did they help you find our recipes?"</p>
          </div>
        </div>
        
        <p>Antonio looks at you pleadingly. "Please, will you help us?"</p>
      </>,
      choices: [
        {
          id: 'help-decision',
          options: [
            { 
              text: "Of course I'll help you recover your recipes!", 
              nextScene: 'accept-help',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 20 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: 15 });
              }
            },
            { 
              text: "What's in it for me if I help?", 
              nextScene: 'negotiate-help',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: -5 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 5 });
              }
            },
            { 
              text: "I'm not sure I can take on pirates...", 
              nextScene: 'hesitate-help',
              effect: () => {
                // Neutral choice
              }
            }
          ]
        }
      ]
    },
    {
      id: 'accept-help',
      background: 'pizzeria-interior',
      content: <>
        <p>Antonio's face brightens with hope.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Grazie mille! You have the heart of a true hero! Come inside, let me explain everything."</p>
          </div>
        </div>
        
        <p>Sofia beams at you and takes your hand, leading you into the cozy pizzeria.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👧</div>
          <div className="dialogue-bubble">
            <p className="character-name">Sofia</p>
            <p>"I knew you would help us! Papa makes the best schiacciatina in the world, and I want to learn to make it just like him when I grow up!"</p>
          </div>
        </div>
        
        <p>Inside the pizzeria, Antonio shows you a ransom note left by the pirates.</p>
      </>,
      choices: [
        {
          id: 'ransom-reaction',
          options: [
            { 
              text: "We'll outsmart these pirates, don't worry.", 
              nextScene: 'examine-note',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 10 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: 5 });
              }
            },
            { 
              text: "Let me read the note carefully for clues.", 
              nextScene: 'examine-note',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 });
                onStoryEvent('ADD_INVENTORY', { 
                  item: {
                    icon: "📝",
                    name: "Pirate Ransom Note",
                    description: "A cryptic message from Captain Marinara demanding payment for the stolen recipes."
                  }
                });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'negotiate-help',
      background: 'pizzeria-interior',
      content: <>
        <p>Antonio's face falls slightly at your question, but he nods in understanding.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Of course, of course. I don't have much money, but I can offer you free pizzas for life at my restaurant. And when we recover the recipes, I'll teach you some of our family's secret techniques."</p>
          </div>
        </div>
        
        <div className="dialogue">
          <div className="character-avatar">👧</div>
          <div className="dialogue-bubble">
            <p className="character-name">Sofia</p>
            <p>Sofia looks at you with big, hopeful eyes. "Please help us. Papa's pizza is the best in the world!"</p>
          </div>
        </div>
      </>,
      choices: [
        {
          id: 'negotiate-response',
          options: [
            { 
              text: "That sounds fair. I'll help you recover the recipes.", 
              nextScene: 'examine-note',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: 5 });
              }
            },
            { 
              text: "I want something more valuable than just pizzas.", 
              nextScene: 'more-payment',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: -10 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: -5 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 10 });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'more-payment',
      background: 'pizzeria-interior',
      content: <>
        <p>Antonio's expression darkens, and Sofia shrinks behind her father.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"I have very little to offer beyond what I've said... but wait. There is one thing. My family has an old treasure map that's been passed down for generations. No one has ever found the treasure, but the map is real. Help us recover our recipes, and the map is yours."</p>
          </div>
        </div>
      </>,
      choices: [
        {
          id: 'treasure-response',
          options: [
            { 
              text: "A treasure map sounds interesting. You have a deal.", 
              nextScene: 'examine-note',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 5 });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'hesitate-help',
      background: 'pizzeria-interior',
      content: <>
        <p>Antonio nods understandingly.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"I understand your hesitation. These pirates are dangerous. But we're not asking you to fight them - just help us solve their puzzles and find where they've hidden the recipes. The ransom note they left has clues."</p>
          </div>
        </div>
        
        <div className="dialogue">
          <div className="character-avatar">👧</div>
          <div className="dialogue-bubble">
            <p className="character-name">Sofia</p>
            <p>"Please? I miss Papa's special bread he makes just for me..."</p>
          </div>
        </div>
      </>,
      choices: [
        {
          id: 'hesitate-response',
          options: [
            { 
              text: "I can help solve puzzles and find clues. That I can do.", 
              nextScene: 'examine-note',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: 10 });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'examine-note',
      background: 'pizzeria-table',
      content: <>
        <p>You carefully examine the ransom note:</p>
        
        <div className="pirate-note">
          <p>To the foolish pizzaiolo,</p>
          <p>We have your precious recipes! If you want them back, solve our puzzles and follow the map to the LEANING tower.</p>
          <p>Your special recipe for the little one? That'll cost extra!</p>
          <p>- Captain Marinara & The Dough Raiders</p>
          <div className="note-decoration">🏴‍☠️ 🍕 ☠️</div>
        </div>
        
        <p>At the bottom of the note is a cipher - a series of symbols and letters that appear to be hiding a message.</p>
        
        <div className="cipher-puzzle">
          <p>VHHN WKH KLGGHQ HQWUDQFH</p>
        </div>
        
        <div className="cipher-hints">
          <p><strong>Hints:</strong></p>
          <p>- This appears to be a simple substitution cipher.</p>
          <p>- Each letter might be shifted by the same number of positions in the alphabet.</p>
          {cipherHintLevel >= 1 && <p>- The most common shift is 3 positions, as used by Julius Caesar.</p>}
          {cipherHintLevel >= 2 && <p>- Try shifting each letter backward in the alphabet.</p>}
          {cipherHintLevel >= 3 && <p>- S → P, E → B, K → H (shifting 3 positions back)</p>}
        </div>
        
        <div className="cipher-decoder">
          <p>Try to decode the message:</p>
          <input 
            type="text" 
            value={cipherInput} 
            onChange={(e) => setCipherInput(e.target.value.toUpperCase())}
            placeholder="Enter your solution..."
            className={`cipher-input ${cipherSolved ? 'correct' : ''}`}
          />
          
          <div className="cipher-buttons">
            <button 
              className="check-cipher-btn"
              onClick={() => {
                setCipherAttempts(cipherAttempts + 1);
                
                // Check if the solution is correct (ignoring spaces and case)
                const normalizedInput = cipherInput.toUpperCase().replace(/\s+/g, '');
                const normalizedSolution = correctCipherSolution.toUpperCase().replace(/\s+/g, '');
                
                if (normalizedInput === normalizedSolution) {
                  setCipherSolved(true);
                  // Give bonus for solving it with fewer hints
                  const hintBonus = 3 - cipherHintLevel;
                  onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 + hintBonus * 3 });
                } else {
                  // Increase hint level after failed attempts
                  if (cipherAttempts === 2 && cipherHintLevel < 1) {
                    setCipherHintLevel(1);
                  } else if (cipherAttempts === 4 && cipherHintLevel < 2) {
                    setCipherHintLevel(2);
                  } else if (cipherAttempts === 6 && cipherHintLevel < 3) {
                    setCipherHintLevel(3);
                  }
                }
              }}
            >
              Check Solution
            </button>
            
            <button 
              className="hint-btn" 
              onClick={() => setCipherHintLevel(Math.min(cipherHintLevel + 1, 3))}
              disabled={cipherHintLevel >= 3 || cipherSolved}
            >
              Get Hint
            </button>
          </div>
          
          {cipherAttempts > 0 && !cipherSolved && (
            <p className="attempt-feedback">
              Not quite right. Keep trying! {cipherAttempts > 1 ? `(Attempt ${cipherAttempts})` : ''}
            </p>
          )}
          
          {cipherSolved && (
            <div className="solved-cipher">
              <p>Correct! The message reads: "{correctCipherSolution}"</p>
              <button 
                className="continue-button"
                onClick={() => setCurrentSceneIndex(currentSceneIndex + 1)}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </>,
      choices: null // No choices - must solve cipher
    },
    {
      id: 'cipher-solved',
      background: 'pizzeria-table-solved',
      content: <>
        <p>Antonio's eyes widen as you decode the cipher.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"'Seek the hidden entrance!' Brilliant! You've decoded the first clue! This must refer to the hidden caves near the tower of Pisa. We must prepare for a journey!"</p>
          </div>
        </div>
        
        <div className="dialogue">
          <div className="character-avatar">👧</div>
          <div className="dialogue-bubble">
            <p className="character-name">Sofia</p>
            <p>"You're so smart! Can I come too, Papa? Please?"</p>
          </div>
        </div>
        
        <p>Antonio looks worried about bringing his daughter, but also concerned about leaving her behind.</p>
      </>,
      choices: [
        {
          id: 'sofia-journey',
          options: [
            { 
              text: "Sofia should come with us - she might notice things we miss.", 
              nextScene: 'stage-end',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: 20 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: -5 });
                onStoryEvent('MAKE_CHOICE', { choiceId: 'sofia_journey', option: 'bring_along' });
              }
            },
            { 
              text: "Sofia should stay where it's safe - we'll recover her recipe.", 
              nextScene: 'stage-end',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 15 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: -10 });
                onStoryEvent('MAKE_CHOICE', { choiceId: 'sofia_journey', option: 'leave_behind' });
              }
            },
            { 
              text: "Antonio should decide - he knows what's best for his daughter.", 
              nextScene: 'stage-end',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 10 });
                onStoryEvent('MAKE_CHOICE', { choiceId: 'sofia_journey', option: 'parent_decides' });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'stage-end',
      background: 'journey-preparation',
      content: <>
        <div className="story-transition">
          <h3>Chapter 1 Complete</h3>
          <p>You have successfully decoded the first clue and are preparing for the journey ahead. Antonio is gathering supplies for the trip to Pisa, where you hope to find the next clue to recovering the stolen recipes.</p>
          
          {userChoices['sofia_journey'] === 'bring_along' && (
            <p>Sofia is excitedly packing her small backpack, ready for the adventure ahead. Antonio seems nervous about bringing her, but trusts your judgment.</p>
          )}
          
          {userChoices['sofia_journey'] === 'leave_behind' && (
            <p>Sofia is staying with her aunt in the village. She seems disappointed, but Antonio assures her they'll return with her special recipe soon.</p>
          )}
          
          {userChoices['sofia_journey'] === 'parent_decides' && (
            <p>After much consideration, Antonio decided to bring Sofia along, but only if she promises to obey all safety instructions. She eagerly agreed, thrilled to be part of the adventure.</p>
          )}
          
          <p>The journey to uncover the secret recipes begins in earnest...</p>
        </div>
      </>,
      choices: null // End of stage
    }
  ];

  // Check if previously completed
  useEffect(() => {
    const isStageComplete = localStorage.getItem('pizzaioloStage1Complete') === 'true';
    if (isStageComplete) {
      setIsComplete(true);
      setCurrentSceneIndex(scenes.length - 1); // Show the final scene
    }
    
    // Load previous choices if available
    const savedChoices = localStorage.getItem('pizzaioloStage1Choices');
    if (savedChoices) {
      setUserChoices(JSON.parse(savedChoices));
    }
  }, [scenes.length]);
  
  // Save choices when they change
  useEffect(() => {
    if (Object.keys(userChoices).length > 0) {
      localStorage.setItem('pizzaioloStage1Choices', JSON.stringify(userChoices));
    }
  }, [userChoices]);
  
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
      setIsComplete(true);
      
      // Pass story updates to parent component
      onComplete(1, {
        choices: userChoices,
        newItems: [
          {
            icon: "🗺️",
            name: "Map to Pisa",
            description: "A rough map showing the way to the Leaning Tower of Pisa, where the next clue awaits."
          }
        ],
        newLocations: ["Coastal Village", "Antonio's Pizzeria"]
      });
    }
  };

  return (
    <div className="stage-content story-stage">
      {isComplete ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h4>Chapter Complete: The Adventure Begins!</h4>
          <p>You've successfully decoded the first clue from the pirate's ransom note. Now, a journey to the famous Leaning Tower awaits!</p>
          <p>The recipes are still out there, and with each step, you're getting closer to helping Antonio and Sofia restore their family legacy.</p>
          <div className="next-stage-hint">
            <p>Prepare for your journey to Pisa. The next chapter will unlock soon...</p>
          </div>
        </div>
      ) : (
        <div className={`story-scene ${currentScene.background}`}>
          <div className="scene-content">
            {currentScene.content}
          </div>
          
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
          
          {!currentScene.choices && currentScene.id !== 'stage-end' && !currentScene.id.includes('examine-note') && (
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

export default StoryIntroStage;