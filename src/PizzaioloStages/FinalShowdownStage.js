import React, { useState, useMemo } from 'react';
import './PizzaioloStages.css';

const FinalShowdownStage = ({ onComplete, onStoryEvent, storyProgress }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [userChoices, setUserChoices] = useState({});
  const [finalPuzzleState, setFinalPuzzleState] = useState({
    ingredients: [],
    correctIngredients: ['flour', 'water', 'salt', 'yeast', 'olive oil', 'wild honey'],
    attempts: 0,
    solved: false
  });
  
  const isSofiaPresent =
    storyProgress.storyChoices.sofia_journey === 'bring_along' ||
    storyProgress.storyChoices.sofia_journey === 'parent_decides';
  const isPirateFriendly = storyProgress.characterRelationships.pirateRespect > 50;

  // Puzzle component: each ingredient in the grid displays a plus and a minus button.
  const SecretIngredientPuzzle = () => {
    const [feedback, setFeedback] = useState('');

    const allIngredients = [
      { id: 'flour', name: 'Flour', icon: '🌾' },
      { id: 'water', name: 'Water', icon: '💧' },
      { id: 'salt', name: 'Salt', icon: '🧂' },
      { id: 'sugar', name: 'Sugar', icon: '🍬' },
      { id: 'yeast', name: 'Yeast', icon: '🧫' },
      { id: 'olive oil', name: 'Olive Oil', icon: '🫒' },
      { id: 'butter', name: 'Butter', icon: '🧈' },
      { id: 'wild honey', name: 'Wild Honey', icon: '🍯' },
      { id: 'eggs', name: 'Eggs', icon: '🥚' },
      { id: 'milk', name: 'Milk', icon: '🥛' },
      { id: 'thyme', name: 'Thyme', icon: '🌿' },
      { id: 'rosemary', name: 'Rosemary', icon: '🌱' }
    ];

    const handleAddIngredient = (ingredient) => {
      if (finalPuzzleState.ingredients.includes(ingredient.id)) {
        setFeedback(`${ingredient.name} is already in your recipe.`);
        return;
      }
      setFinalPuzzleState(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient.id]
      }));
      setFeedback(`Added ${ingredient.name}.`);
    };

    const handleRemoveIngredient = (ingredient) => {
      if (!finalPuzzleState.ingredients.includes(ingredient.id)) {
        setFeedback(`${ingredient.name} is not in your recipe.`);
        return;
      }
      setFinalPuzzleState(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter(id => id !== ingredient.id)
      }));
      setFeedback(`Removed ${ingredient.name}.`);
    };

    const handleTestRecipe = () => {
      const allCorrect = finalPuzzleState.correctIngredients.every(ing =>
        finalPuzzleState.ingredients.includes(ing)
      );
      const extra = finalPuzzleState.ingredients.some(
        ing => !finalPuzzleState.correctIngredients.includes(ing)
      );
      const attempts = finalPuzzleState.attempts + 1;
      const solved = allCorrect && !extra;
      setFinalPuzzleState(prev => ({ ...prev, attempts, solved }));

      if (solved) {
        setFeedback("Perfect! You've got the correct ingredients!");
        setTimeout(() => {
          setCurrentSceneIndex(currentSceneIndex + 1);
        }, 2000);
      } else if (allCorrect) {
        setFeedback("Almost there! Extra ingredient detected.");
      } else if (!extra) {
        setFeedback("Missing some key ingredients.");
      } else {
        setFeedback("The recipe isn't right yet.");
      }
    };

    return (
      <div className="secret-recipe-puzzle">
        <h3>Sofia's Special Schiacciatina</h3>
        <p>Select ingredients for the recipe using the plus and minus buttons.</p>
        
        <div className="ingredient-selection">
          <h4>Available Ingredients:</h4>
          <div className="ingredient-grid">
            {allIngredients.map(ingredient => (
              <div key={ingredient.id} className="ingredient-option">
                <div className="ingredient-info">
                  <span className="ingredient-icon">{ingredient.icon}</span>
                  <span className="ingredient-name">{ingredient.name}</span>
                </div>
                <div className="ingredient-controls">
                  <button 
                    className="plus-button obvious-button"
                    onClick={() => handleAddIngredient(ingredient)}
                  >
                    +
                  </button>
                  <button 
                    className="minus-button obvious-button"
                    onClick={() => handleRemoveIngredient(ingredient)}
                  >
                    −
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="recipe-ingredients">
          <h4>Your Recipe Ingredients:</h4>
          {finalPuzzleState.ingredients.length === 0 ? (
            <p>No ingredients selected.</p>
          ) : (
            <ul>
              {finalPuzzleState.ingredients.map(id => {
                const ingredient = allIngredients.find(item => item.id === id);
                return (
                  <li key={id}>
                    {ingredient.icon} {ingredient.name}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {finalPuzzleState.ingredients.length > 0 && (
          <button className="test-recipe obvious-button" onClick={handleTestRecipe}>
            Test Recipe
          </button>
        )}
        
        {feedback && (
          <div className={`puzzle-feedback ${finalPuzzleState.solved ? 'success' : 'hint'}`}>
            {feedback}
          </div>
        )}
        
        {finalPuzzleState.attempts > 0 && !finalPuzzleState.solved && (
          <div className="attempts-counter">Attempts: {finalPuzzleState.attempts}</div>
        )}
      </div>
    );
  };

  // Story scenes with narrative content and choices.
  const scenes = useMemo(() => ([
    {
      id: 'olive-mill',
      background: 'tuscan-hills',
      content: (
        <>
          <h3>The Old Olive Mill</h3>
          <p>
            After a journey through rolling Tuscan hills, you arrive at an ancient olive mill with a weathered pirate flag hanging in one window.
          </p>
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"This must be where Breadbeard is hiding. The final piece of my recipe book is inside."</p>
            </div>
          </div>
          {isSofiaPresent && (
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"I hope we can get my special recipe back. I'm getting hungry!"</p>
              </div>
            </div>
          )}
          <p>You notice the door is slightly ajar.</p>
        </>
      ),
      choices: [
        {
          id: 'mill-approach',
          options: [
            {
              text: "Knock politely and announce yourselves",
              nextScene: isPirateFriendly ? 'breadbeard-friendly' : 'breadbeard-cautious',
              effect: () => onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 5 })
            },
            {
              text: "Sneak in quietly",
              nextScene: 'breadbeard-surprise',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: -10 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 });
              }
            },
            {
              text: "Have Sofia call out",
              nextScene: 'breadbeard-sofia',
              effect: () => onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: 15 })
            }
          ]
        }
      ]
    },
    {
      id: 'breadbeard-friendly',
      background: 'olive-mill-interior',
      content: (
        <>
          <h3>A Warm Welcome</h3>
          <p>You announce yourselves, and a deep voice welcomes you inside.</p>
          <div className="dialogue">
            <div className="character-avatar">🏴‍☠️</div>
            <div className="dialogue-bubble">
              <p className="character-name">Voice Inside</p>
              <p>"Ah, the pizza man and friends! Come in, come in!"</p>
            </div>
          </div>
          <p>Inside, you see a man with a flour-dusted beard kneading dough.</p>
          <div className="dialogue">
            <div className="character-avatar">🏴‍☠️</div>
            <div className="dialogue-bubble">
              <p className="character-name">Breadbeard</p>
              <p>"I be Breadbeard! I used to be a baker before I turned pirate. We struck a deal, didn't we?"</p>
            </div>
          </div>
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"Yes, we've come for Sofia's special recipe and the secret ingredient."</p>
            </div>
          </div>
          {isSofiaPresent && (
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"That's my recipe! Papa makes it just for me."</p>
              </div>
            </div>
          )}
        </>
      ),
      choices: [
        {
          id: 'breadbeard-response',
          options: [
            {
              text: "We'll share our knowledge for the recipe",
              nextScene: 'recipe-challenge',
              effect: () => onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 10 })
            }
          ]
        }
      ]
    },
    {
      id: 'breadbeard-cautious',
      background: 'olive-mill-interior',
      content: (
        <>
          <h3>A Cautious Reception</h3>
          <p>You knock and a large man with a flour-dusted beard answers cautiously.</p>
          <div className="dialogue">
            <div className="character-avatar">🏴‍☠️</div>
            <div className="dialogue-bubble">
              <p className="character-name">Bearded Man</p>
              <p>"Who goes there? What business at my mill?"</p>
            </div>
          </div>
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"Captain Marinara said you have the final page of my recipe book."</p>
            </div>
          </div>
          <div className="dialogue">
            <div className="character-avatar">🏴‍☠️</div>
            <div className="dialogue-bubble">
              <p className="character-name">Breadbeard</p>
              <p>"I got it, but ye must prove yer worthy."</p>
            </div>
          </div>
        </>
      ),
      choices: [
        {
          id: 'cautious-response',
          options: [
            {
              text: "What must we do?",
              nextScene: 'recipe-challenge'
            },
            {
              text: "We've proven ourselves already",
              nextScene: 'recipe-challenge',
              effect: () => onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: -5 })
            }
          ]
        }
      ]
    },
    {
      id: 'breadbeard-surprise',
      background: 'olive-mill-interior-dark',
      content: (
        <>
          <h3>A Failed Surprise</h3>
          <p>You sneak in, but the door slams shut behind you!</p>
          <div className="dialogue">
            <div className="character-avatar">🏴‍☠️</div>
            <div className="dialogue-bubble">
              <p className="character-name">Voice in the Dark</p>
              <p>"ARRRR! Sneakin' on a pirate? We invented sneakin'!"</p>
            </div>
          </div>
          <p>A lantern reveals a man with a rolling pin.</p>
          <div className="dialogue">
            <div className="character-avatar">🏴‍☠️</div>
            <div className="dialogue-bubble">
              <p className="character-name">Bearded Pirate</p>
              <p>"State yer business before I make ye walk the plank!"</p>
            </div>
          </div>
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"Captain Marinara sent us for the recipe and secret ingredient."</p>
            </div>
          </div>
          <div className="dialogue">
            <div className="character-avatar">🏴‍☠️</div>
            <div className="dialogue-bubble">
              <p className="character-name">Breadbeard</p>
              <p>"Ye won't get the recipe by sneakin' around. Prove yerself worthy!"</p>
            </div>
          </div>
        </>
      ),
      choices: [
        {
          id: 'surprise-response',
          options: [
            {
              text: "How can we prove ourselves?",
              nextScene: 'recipe-challenge',
              effect: () => onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 5 })
            },
            {
              text: "What's your challenge?",
              nextScene: 'recipe-challenge'
            }
          ]
        }
      ]
    },
    {
      id: 'breadbeard-sofia',
      background: 'olive-mill-interior-warm',
      content: (
        <>
          <h3>A Child's Approach</h3>
          {isSofiaPresent ? (
            <>
              <p>Sofia steps forward to speak.</p>
              <div className="dialogue">
                <div className="character-avatar">👧</div>
                <div className="dialogue-bubble">
                  <p className="character-name">Sofia</p>
                  <p>"Can I have my special recipe back? My papa made it just for me."</p>
                </div>
              </div>
              <p>The door opens to reveal a man with a flour-dusted beard, softened by the sight of Sofia.</p>
              <div className="dialogue">
                <div className="character-avatar">🏴‍☠️</div>
                <div className="dialogue-bubble">
                  <p className="character-name">Breadbeard</p>
                  <p>"Well, blow me down! A little lass! Come in!"</p>
                </div>
              </div>
              <p>Inside, the mill is cozy with loaves baking.</p>
            </>
          ) : (
            <>
              <p>Without Sofia, you knock on the door.</p>
              <p>A man with a flour-dusted beard answers suspiciously.</p>
              <div className="dialogue">
                <div className="character-avatar">🏴‍☠️</div>
                <div className="dialogue-bubble">
                  <p className="character-name">Bearded Pirate</p>
                  <p>"Who goes there?"</p>
                </div>
              </div>
              <div className="dialogue">
                <div className="character-avatar">👨‍🍳</div>
                <div className="dialogue-bubble">
                  <p className="character-name">Antonio</p>
                  <p>"We come for the special recipe."</p>
                </div>
              </div>
              <p>The door opens wider.</p>
              <div className="dialogue">
                <div className="character-avatar">🏴‍☠️</div>
                <div className="dialogue-bubble">
                  <p className="character-name">Breadbeard</p>
                  <p>"Where is Sofia?"</p>
                </div>
              </div>
              <div className="dialogue">
                <div className="character-avatar">👨‍🍳</div>
                <div className="dialogue-bubble">
                  <p className="character-name">Antonio</p>
                  <p>"She's safe at home."</p>
                </div>
              </div>
              <div className="dialogue">
                <div className="character-avatar">🏴‍☠️</div>
                <div className="dialogue-bubble">
                  <p className="character-name">Breadbeard</p>
                  <p>"Wise decision, but ye must still prove yerself worthy."</p>
                </div>
              </div>
            </>
          )}
        </>
      ),
      choices: [
        {
          id: 'sofia-approach-response',
          options: [
            {
              text: "We'll do whatever it takes",
              nextScene: 'recipe-challenge',
              effect: () => onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 })
            }
          ]
        }
      ]
    },
    {
      id: 'recipe-challenge',
      background: 'olive-mill-kitchen',
      content: (
        <>
          <h3>The Final Challenge</h3>
          <p>Breadbeard leads you to a kitchen with a stone oven and ingredients on a wooden table.</p>
          <div className="dialogue">
            <div className="character-avatar">🏴‍☠️</div>
            <div className="dialogue-bubble">
              <p className="character-name">Breadbeard</p>
              <p>"I've been trying to recreate the special bread, but something's missing. Show me you know the proper ingredients, and the recipe is yours!"</p>
            </div>
          </div>
          {isSofiaPresent && (
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"I know what goes in my schiacciatina! Can I help?"</p>
              </div>
            </div>
          )}
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>{isSofiaPresent ? "Of course, Sofia. Let's show Breadbeard how it's done!" : "I've made that schiacciatina many times. I know what we need."}</p>
            </div>
          </div>
          <p>Breadbeard gestures to the ingredients on the table.</p>
          <div className="dialogue">
            <div className="character-avatar">🏴‍☠️</div>
            <div className="dialogue-bubble">
              <p className="character-name">Breadbeard</p>
              <p>"Select the right ingredients, including the secret one!"</p>
            </div>
          </div>
          <div className="puzzle-container">
            <SecretIngredientPuzzle />
          </div>
        </>
      ),
      choices: null
    },
    {
      id: 'recipe-success',
      background: 'olive-mill-celebration',
      content: (
        <>
          <h3>The Secret Revealed</h3>
          <p>Breadbeard watches as you combine the ingredients perfectly, including the secret wild honey.</p>
          <div className="dialogue">
            <div className="character-avatar">🏴‍☠️</div>
            <div className="dialogue-bubble">
              <p className="character-name">Breadbeard</p>
              <p>"Wild honey! That's the secret ingredient! I tried regular honey, but it wasn't the same."</p>
            </div>
          </div>
          <p>The pirate slaps his forehead, then produces a folded page.</p>
          <div className="dialogue">
            <div className="character-avatar">🏴‍☠️</div>
            <div className="dialogue-bubble">
              <p className="character-name">Breadbeard</p>
              <p>"Ye've earned this fair and square. The final recipe page is yours."</p>
            </div>
          </div>
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"Thank you, Breadbeard. My recipe book is complete again."</p>
            </div>
          </div>
          {isSofiaPresent && (
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"Yay! Can we make schiacciatina when we get home?"</p>
              </div>
            </div>
          )}
          <p>Breadbeard strokes his beard.</p>
          <div className="dialogue">
            <div className="character-avatar">🏴‍☠️</div>
            <div className="dialogue-bubble">
              <p className="character-name">Breadbeard</p>
              <p>"Before ye go, here's a jar of wild honey from these hills!"</p>
            </div>
          </div>
        </>
      ),
      choices: [
        {
          id: 'final-response',
          options: [
            {
              text: "Thank you for your generosity",
              nextScene: 'stage-end',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 10 });
                onStoryEvent('ADD_INVENTORY', {
                  item: {
                    icon: "📄",
                    name: "Sofia's Schiacciatina Recipe",
                    description: "The special flatbread recipe featuring wild honey."
                  }
                });
                onStoryEvent('ADD_INVENTORY', {
                  item: {
                    icon: "🍯",
                    name: "Wild Tuscan Honey",
                    description: "A jar of special honey collected by Breadbeard."
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
      background: 'journey-home',
      content: (
        <div className="story-transition">
          <h3>Chapter Complete: The Secret Ingredient</h3>
          <p>
            With the recipe book complete and the secret ingredient discovered, your adventure with Antonio
            {isSofiaPresent ? ' and Sofia' : ''} comes to a successful end.
          </p>
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"I can't thank you enough for helping us recover my family recipes. The pizzeria will flourish once again!"</p>
            </div>
          </div>
          {isSofiaPresent && (
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"And I'll get to eat my special schiacciatina again! You're our hero!"</p>
              </div>
            </div>
          )}
          <p>As you journey back to the coastal village, Antonio makes plans for a celebration...</p>
        </div>
      ),
      choices: null
    }
  ]), [isSofiaPresent, isPirateFriendly, onStoryEvent]);

  const completeStage = () => {
    setIsComplete(true);
    onComplete(5, {
      choices: userChoices,
      newItems: [],
      newLocations: ["Olive Mill", "Tuscan Hills"],
      characterRelationships: {}
    });
  };

  const handleChoice = (choiceId, optionText) => {
    const choiceSet = scenes[currentSceneIndex].choices.find(choice => choice.id === choiceId);
    const selectedOption = choiceSet.options.find(opt => opt.text === optionText);
    if (selectedOption.effect) selectedOption.effect();
    setUserChoices(prev => ({
      ...prev,
      [choiceId]:
        selectedOption.nextScene === 'stage-end'
          ? optionText.toLowerCase().replace(/\s+/g, '_')
          : selectedOption.nextScene
    }));
    const nextSceneIndex = scenes.findIndex(scene => scene.id === selectedOption.nextScene);
    if (nextSceneIndex !== -1) {
      setCurrentSceneIndex(nextSceneIndex);
    }
    if (selectedOption.nextScene === 'stage-end') completeStage();
  };

  const currentScene = scenes[currentSceneIndex];

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
          <div className="scene-content">{currentScene.content}</div>
          {currentScene.minigame && currentScene.minigame}
          {currentScene.choices && (
            <div className="choice-container">
              <h4>What will you do?</h4>
              {currentScene.choices.map(choice => (
                <div key={choice.id} className="choice-set">
                  {choice.options.map(option => (
                    <button
                      key={option.text}
                      className="choice-button obvious-button"
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
              className="continue-button obvious-button"
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

export default FinalShowdownStage;
