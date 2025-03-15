// StoryIntroStage.js
import React, { useState, useEffect } from 'react';
import './PizzaioloStages.css';

const StoryIntroStage = ({ onComplete, onStoryEvent, storyProgress }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [userChoices, setUserChoices] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  
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
        // More scenes would follow...
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
            
            <p>At the bottom of the note is a cipher - a series of symbols that appear to be hiding a message.</p>
            
            <div className="cipher-puzzle">
            <p>🍕🍕🔍 ⛵️⚓️🎯 🏠🔑🔓</p>
            </div>
        </>,
        choices: [
            {
            id: 'cipher-approach',
            options: [
                { 
                text: "I think I can decode this cipher...", 
                nextScene: 'complete-stage',
                effect: () => {
                    onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 10 });
                    onStoryEvent('MAKE_CHOICE', { choiceId: 'decoder_approach', option: 'analytical' });
                }
                },
                { 
                text: "Sofia, do you recognize any of these symbols?", 
                nextScene: 'complete-stage',
                effect: () => {
                    onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: 15 });
                    onStoryEvent('MAKE_CHOICE', { choiceId: 'decoder_approach', option: 'collaborative' });
                }
                },
                { 
                text: "These pirates think they're clever... I'll show them!", 
                nextScene: 'complete-stage',
                effect: () => {
                    onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 5 });
                    onStoryEvent('MAKE_CHOICE', { choiceId: 'decoder_approach', option: 'competitive' });
                }
                }
            ]
            }
        ]
        },
        {
        id: 'complete-stage',
        background: 'pizzeria-table-solved',
        content: <>
            <p>After careful examination, you decode the cipher!</p>
            
            <div className="solved-cipher">
            <p>The clue reads: "SEEK THE HIDDEN ENTRANCE"</p>
            </div>
            
            <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
                <p className="character-name">Antonio</p>
                <p>"Brilliant! You've decoded the first clue! This must refer to the hidden caves near the tower of Pisa. We must prepare for a journey!"</p>
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
        
        {!currentScene.choices && currentScene.id !== 'stage-end' && (
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