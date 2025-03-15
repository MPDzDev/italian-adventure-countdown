// FinalShowdownStage.js
import React, { useState, useEffect } from 'react';
import './PizzaioloStages.css';

const FinalShowdownStage = ({ onComplete, onStoryEvent, storyProgress }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [userChoices, setUserChoices] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [finalPuzzleState, setFinalPuzzleState] = useState({
    ingredients: [],
    correctIngredients: ['flour', 'water', 'salt', 'yeast', 'olive oil', 'wild honey'],
    attempts: 0,
    solved: false
  });
  
  // Is Sofia present based on previous choices?
  const isSofiaPresent = storyProgress.storyChoices.sofia_journey === 'bring_along' || 
                         storyProgress.storyChoices.sofia_journey === 'parent_decides';
  
  // Relationship with pirates based on previous choices
  const isPirateFriendly = storyProgress.characterRelationships.pirateRespect > 50;
  
 // Define the scenes for this stage
 const scenes = [
    {
      id: 'olive-mill',
      background: 'tuscan-hills',
      content: <>
        <h3>The Old Olive Mill</h3>
        <p>After a journey through the rolling Tuscan hills, you arrive at an ancient olive mill. The stone building sits nestled among olive groves, with a weathered pirate flag hanging from one window.</p>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"This must be where Breadbeard is hiding. The final piece of my recipe book should be inside."</p>
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
        
        <p>As you approach the mill, you notice the door is slightly ajar.</p>
      </>,
      choices: [
        {
          id: 'mill-approach',
          options: [
            { 
              text: "Knock politely and announce yourselves", 
              nextScene: isPirateFriendly ? 'breadbeard-friendly' : 'breadbeard-cautious',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 5 });
              }
            },
            { 
              text: "Sneak in quietly to catch Breadbeard by surprise", 
              nextScene: 'breadbeard-surprise',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: -10 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 });
              }
            },
            { 
              text: "Have Sofia call out - a child might seem less threatening", 
              nextScene: 'breadbeard-sofia',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: 15 });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'breadbeard-friendly',
      background: 'olive-mill-interior',
      content: <>
        <h3>A Warm Welcome</h3>
        <p>You knock on the door and announce yourselves, mentioning Captain Marinara sent you. A deep voice calls from inside.</p>
        
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Voice Inside</p>
            <p>"Ah, the pizza man and friends! The Captain radioed ahead about ye. Come in, come in!"</p>
          </div>
        </div>
        
        <p>Inside, you find a large man with an impressive beard dusted with flour. He's kneading dough at a rustic wooden table.</p>
        
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Breadbeard</p>
            <p>"I be First Mate Breadbeard! Was a baker before I turned pirate. Been tryin' to recreate your recipes, but somethin's always missin'. The Captain says we struck a deal?"</p>
          </div>
        </div>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Yes, we've come for Sofia's special recipe. Captain Marinara said you have it, along with the secret ingredient."</p>
          </div>
        </div>
        
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"That's my schiacciatina recipe! Papa makes it just for me."</p>
            </div>
          </div>
        )}
      </>,
      choices: [
        {
          id: 'breadbeard-response',
          options: [
            { 
              text: "We'll gladly share our knowledge in return for the recipe", 
              nextScene: 'recipe-challenge',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 10 });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'breadbeard-cautious',
      background: 'olive-mill-interior',
      content: <>
        <h3>A Cautious Reception</h3>
        <p>You knock on the door and call out. After a moment of silence, you hear heavy footsteps approaching.</p>
        
        <p>The door creaks open to reveal a large man with an impressive beard dusted with flour. He eyes you suspiciously.</p>
        
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Bearded Man</p>
            <p>"Who goes there? What business do ye have at me mill?"</p>
          </div>
        </div>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"We've spoken with Captain Marinara. She told us you have the final page of my recipe book - my daughter's special schiacciatina."</p>
          </div>
        </div>
        
        <p>The man's expression softens slightly as he strokes his flour-dusted beard.</p>
        
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Breadbeard</p>
            <p>"Aye, I be First Mate Breadbeard. I've got the page, but the Captain didn't say nothin' about givin' it away for free. Ye'll have to prove yer worthy."</p>
          </div>
        </div>
      </>,
      choices: [
        {
          id: 'cautious-response',
          options: [
            { 
              text: "What do we need to do to get the recipe back?", 
              nextScene: 'recipe-challenge',
              effect: () => {
                // No additional effects
              }
            },
            { 
              text: "We've already proven ourselves to Captain Marinara", 
              nextScene: 'recipe-challenge',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: -5 });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'breadbeard-surprise',
      background: 'olive-mill-interior-dark',
      content: <>
        <h3>A Failed Surprise</h3>
        <p>You carefully push the door open and slip inside. The mill is dimly lit, with flour dust floating in the air. Suddenly, the door slams shut behind you!</p>
        
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Voice in the Dark</p>
            <p>"ARRRR! Tryin' to sneak up on a pirate, are ye? We invented sneakin'!"</p>
          </div>
        </div>
        
        <p>A lantern flares to life, revealing a large man with an impressive flour-dusted beard. He's holding a rolling pin like a weapon.</p>
        
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Bearded Pirate</p>
            <p>"State yer business before I make ye walk the plank! There ain't no plank here, but I'll find something suitable!"</p>
          </div>
        </div>
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"We mean no harm! Captain Marinara sent us. We're looking for my daughter's recipe and the secret ingredient."</p>
          </div>
        </div>
        
        <p>The pirate lowers his rolling pin, looking disappointed at the missed opportunity for a scuffle.</p>
        
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Breadbeard</p>
            <p>"Ah, ye be the pizza man. I be First Mate Breadbeard. Ye won't get the recipe by sneakin' around. Ye'll have to prove yerself worthy of it!"</p>
          </div>
        </div>
      </>,
      choices: [
        {
          id: 'surprise-response',
          options: [
            { 
              text: "Sorry for sneaking in. How can we prove ourselves?", 
              nextScene: 'recipe-challenge',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 5 });
              }
            },
            { 
              text: "Fine. What's your challenge?", 
              nextScene: 'recipe-challenge',
              effect: () => {
                // No additional effects
              }
            }
          ]
        }
      ]
    },
    {
      id: 'breadbeard-sofia',
      background: 'olive-mill-interior-warm',
      content: <>
        <h3>A Child's Approach</h3>
        {isSofiaPresent ? (
          <>
            <p>You ask Sofia to call out. She steps forward bravely.</p>
            
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"Hello? Mr. Pirate? Can I please have my special bread recipe back? My papa made it just for me."</p>
              </div>
            </div>
            
            <p>There's a moment of silence, then heavy footsteps approach. The door swings open to reveal a large man with a flour-dusted beard. His stern expression softens when he sees Sofia.</p>
            
            <div className="dialogue">
              <div className="character-avatar">🏴‍☠️</div>
              <div className="dialogue-bubble">
                <p className="character-name">Bearded Pirate</p>
                <p>"Well, blow me down! A little lass! Reminds me of me own daughter back in port. Come in, come in!"</p>
              </div>
            </div>
            
            <p>Inside, the mill is cozy and warm. Several loaves of bread are baking in a stone oven.</p>
            
            <div className="dialogue">
              <div className="character-avatar">🏴‍☠️</div>
              <div className="dialogue-bubble">
                <p className="character-name">Breadbeard</p>
                <p>"I be First Mate Breadbeard, formerly the best baker in Portsmouth before I took to pirating! The Captain told me ye might be comin'. That recipe's mighty special - makes the lightest bread I've ever tasted!"</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p>Without Sofia present, you realize this approach won't work. You knock on the door instead.</p>
            
            <p>After a moment, a large man with a flour-dusted beard opens the door, looking suspicious.</p>
            
            <div className="dialogue">
              <div className="character-avatar">🏴‍☠️</div>
              <div className="dialogue-bubble">
                <p className="character-name">Bearded Pirate</p>
                <p>"Who goes there? State yer business!"</p>
              </div>
            </div>
            
            <div className="dialogue">
              <div className="character-avatar">👨‍🍳</div>
              <div className="dialogue-bubble">
                <p className="character-name">Antonio</p>
                <p>"We come from Captain Marinara. We're here for my daughter's special recipe."</p>
              </div>
            </div>
            
            <p>The pirate studies you for a moment before opening the door wider.</p>
            
            <div className="dialogue">
              <div className="character-avatar">🏴‍☠️</div>
              <div className="dialogue-bubble">
                <p className="character-name">Breadbeard</p>
                <p>"Ah, the pizza man! I be First Mate Breadbeard. Where's the little lass this recipe belongs to?"</p>
              </div>
            </div>
            
            <div className="dialogue">
              <div className="character-avatar">👨‍🍳</div>
              <div className="dialogue-bubble">
                <p className="character-name">Antonio</p>
                <p>"Sofia is safe at home. I didn't want to bring her on such a dangerous journey."</p>
              </div>
            </div>
            
            <div className="dialogue">
              <div className="character-avatar">🏴‍☠️</div>
              <div className="dialogue-bubble">
                <p className="character-name">Breadbeard</p>
                <p>"Wise decision, perhaps. But ye'll still need to prove yerself worthy of this special recipe!"</p>
              </div>
            </div>
          </>
        )}
      </>,
      choices: [
        {
          id: 'sofia-approach-response',
          options: [
            { 
              text: "We'll do whatever it takes to get the recipe back", 
              nextScene: 'recipe-challenge',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'recipe-challenge',
      background: 'olive-mill-kitchen',
      content: <>
        <h3>The Final Challenge</h3>
        <p>Breadbeard leads you to a makeshift kitchen with a stone oven and ingredients spread across a wooden table.</p>
        
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Breadbeard</p>
            <p>"Here's me challenge: I've been trying to recreate the little lass's special bread, but somethin's always missing. Show me you know the proper ingredients, and the recipe is yours!"</p>
          </div>
        </div>
        
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"I know what goes in my schiacciatina! Can I help, Papa?"</p>
            </div>
          </div>
        )}
        
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>{isSofiaPresent ? "Of course, Sofia. Let's show Breadbeard how it's done!" : "I've made that schiacciatina for Sofia hundreds of times. I know exactly what we need."}</p>
          </div>
        </div>
        
        <p>Breadbeard gestures to the ingredients on the table.</p>
        
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Breadbeard</p>
            <p>"Select the right ingredients, and don't forget the secret one that makes it special! Get it right, and the recipe is yours!"</p>
          </div>
        </div>
      </>,
      choices: null, // No choices - show puzzle component
      puzzle: <SecretIngredientPuzzle />
    },
    {
      id: 'recipe-success',
      background: 'olive-mill-celebration',
      content: <>
        <h3>The Secret Revealed</h3>
        <p>Breadbeard watches in amazement as you combine the ingredients perfectly, including the secret wild honey that gives Sofia's schiacciatina its distinctive flavor.</p>
        
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Breadbeard</p>
            <p>"Wild honey! That's the secret ingredient! I tried regular honey, but it wasn't the same. Of course, it needs to be from the wild herbs of the Italian hillsides!"</p>
          </div>
        </div>
        
        <p>The pirate slaps his forehead, then reaches into his coat to pull out a folded page.</p>
        
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
            <p>"Thank you, Breadbeard. My recipe book is finally complete again."</p>
          </div>
        </div>
        
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"Yay! Can we make schiacciatina when we get home, Papa?"</p>
            </div>
          </div>
        )}
        
        <p>Breadbeard strokes his beard thoughtfully.</p>
        
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Breadbeard</p>
            <p>"Before ye go, I've something else for ye. Captain says we're to be business partners now, and I agree it's a fine idea. Here's a jar of the wild honey I collected from these very hills!"</p>
          </div>
        </div>
      </>,
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
                    description: "The special flatbread recipe created just for Sofia, featuring wild honey."
                  }
                });
                onStoryEvent('ADD_INVENTORY', { 
                  item: {
                    icon: "🍯",
                    name: "Wild Tuscan Honey",
                    description: "A jar of special honey from the Tuscan hills, collected by Breadbeard himself."
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
      content: <>
        <div className="story-transition">
          <h3>Final Chapter Complete</h3>
          <p>With the recipe book complete and the secret ingredient discovered, your adventure with Antonio{isSofiaPresent ? ' and Sofia' : ''} comes to a successful end.</p>
          
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
          
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"To celebrate, I'm taking Sofia to the Alpine Splash Waterpark next month. You must join us! It will be my way of thanking you for saving our family legacy."</p>
            </div>
          </div>
         <p>Your Italian adventure has come to an end, but the bonds you've formed with Antonio, Sofia, and even the pizza-loving pirates will last a lifetime.</p>
         
         <p>And who knows what other adventures await at the Alpine Splash Waterpark...</p>
       </div>
     </>,
     choices: null // End of stage
   }
 ];

  // Check if previously completed
  useEffect(() => {
    const isStageComplete = localStorage.getItem('pizzaioloStage5Complete') === 'true';
    if (isStageComplete) {
      setIsComplete(true);
      setCurrentSceneIndex(scenes.length - 1); // Show the final scene
    }
    
    // Load previous choices if available
    const savedChoices = localStorage.getItem('pizzaioloStage5Choices');
    if (savedChoices) {
      setUserChoices(JSON.parse(savedChoices));
    }
    
    // Load puzzle state if available
    const savedPuzzleState = localStorage.getItem('pizzaioloStage5PuzzleState');
    if (savedPuzzleState) {
      setFinalPuzzleState(JSON.parse(savedPuzzleState));
    }
  }, [scenes.length]);
  
  // Save choices and puzzle state when they change
  useEffect(() => {
    if (Object.keys(userChoices).length > 0) {
      localStorage.setItem('pizzaioloStage5Choices', JSON.stringify(userChoices));
    }
    
    if (finalPuzzleState.attempts > 0 || finalPuzzleState.solved) {
      localStorage.setItem('pizzaioloStage5PuzzleState', JSON.stringify(finalPuzzleState));
    }
  }, [userChoices, finalPuzzleState]);
  
  // Final Recipe Puzzle component
  const SecretIngredientPuzzle = () => {
    const [selectedIngredient, setSelectedIngredient] = useState('');
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
    
    const handleIngredientSelect = (ingredient) => {
      setSelectedIngredient(ingredient.id);
    };
    
    const handleAddIngredient = () => {
      if (!selectedIngredient) return;
      
      if (finalPuzzleState.ingredients.includes(selectedIngredient)) {
        setFeedback(`${selectedIngredient} is already in your recipe!`);
        return;
      }
      
      setFinalPuzzleState(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, selectedIngredient]
      }));
      
      setSelectedIngredient('');
      setFeedback(`Added ${selectedIngredient} to the recipe.`);
    };
    
    const handleRemoveIngredient = (ingredientId) => {
      setFinalPuzzleState(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter(id => id !== ingredientId)
      }));
      
      setFeedback(`Removed ${ingredientId} from the recipe.`);
    };
    
    const handleTestRecipe = () => {
      // Check if all correct ingredients are included
      const allCorrectIncluded = finalPuzzleState.correctIngredients.every(
        ingredient => finalPuzzleState.ingredients.includes(ingredient)
      );
      
      // Check if any incorrect ingredients are included
      const hasIncorrectIngredients = finalPuzzleState.ingredients.some(
        ingredient => !finalPuzzleState.correctIngredients.includes(ingredient)
      );
      
      setFinalPuzzleState(prev => ({
        ...prev,
        attempts: prev.attempts + 1,
        solved: allCorrectIncluded && !hasIncorrectIngredients
      }));
      
      if (allCorrectIncluded && !hasIncorrectIngredients) {
        setFeedback("Perfect! You've identified all the correct ingredients for Sofia's schiacciatina!");
        
        // Move to the next scene after a delay
        setTimeout(() => {
          setCurrentSceneIndex(currentSceneIndex + 1);
        }, 2000);
      } else if (allCorrectIncluded) {
        setFeedback("Almost there! You have all the right ingredients, but there's something extra that doesn't belong.");
      } else if (!hasIncorrectIngredients) {
        setFeedback("You're missing some key ingredients, but what you've chosen looks good so far.");
      } else {
        setFeedback("The recipe doesn't seem right yet. Some ingredients are missing, and some don't belong.");
      }
    };
    
    return (
      <div className="secret-recipe-puzzle">
        <h3>Sofia's Special Schiacciatina</h3>
        <p>Using clues from your journey, identify the correct ingredients for Sofia's special recipe.</p>
        
        <div className="ingredient-selection">
          <h4>Available Ingredients:</h4>
          <div className="ingredient-grid">
            {allIngredients.map(ingredient => (
              <div 
                key={ingredient.id}
                className={`ingredient-option ${selectedIngredient === ingredient.id ? 'selected' : ''}`}
                onClick={() => handleIngredientSelect(ingredient)}
              >
                <div className="ingredient-icon">{ingredient.icon}</div>
                <div className="ingredient-name">{ingredient.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        {selectedIngredient && (
          <button 
            className="add-ingredient"
            onClick={handleAddIngredient}
          >
            Add to Recipe
          </button>
        )}
        
        <div className="recipe-ingredients">
          <h4>Your Recipe Ingredients:</h4>
          {finalPuzzleState.ingredients.length === 0 ? (
            <p className="no-ingredients">No ingredients selected yet</p>
          ) : (
            <div className="selected-ingredients">
              {finalPuzzleState.ingredients.map(ingredientId => {
                const ingredient = allIngredients.find(i => i.id === ingredientId);
                return (
                  <div key={ingredientId} className="selected-ingredient">
                    <div className="ingredient-icon">{ingredient.icon}</div>
                    <div className="ingredient-name">{ingredient.name}</div>
                    <button 
                      className="remove-ingredient"
                      onClick={() => handleRemoveIngredient(ingredientId)}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {finalPuzzleState.ingredients.length > 0 && (
          <button 
            className="test-recipe"
            onClick={handleTestRecipe}
          >
            Test Recipe
          </button>
        )}
        
        {feedback && (
          <div className={`puzzle-feedback ${finalPuzzleState.solved ? 'success' : 'hint'}`}>
            {feedback}
          </div>
        )}
        
        {finalPuzzleState.attempts > 0 && !finalPuzzleState.solved && (
          <div className="attempts-counter">
            Attempts: {finalPuzzleState.attempts}
          </div>
        )}
      </div>
    );
  };

 
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
   onComplete(5, {
     choices: userChoices,
     newItems: [], // Items already added through scene effects
     newLocations: ["Olive Mill", "Tuscan Hills"],
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
         <h4>Adventure Complete!</h4>
         <p>You've successfully recovered all of Antonio's recipes, including Sofia's special schiacciatina with its secret wild honey ingredient!</p>
         <p>The pizzeria is saved, and Antonio has invited you to join their celebration at the Alpine Splash Waterpark.</p>
         <div className="next-stage-hint">
           <p>Your Italian adventure is complete! Check your treasure chest for rewards.</p>
         </div>
       </div>
     ) : (
       <div className={`story-scene ${currentScene.background}`}>
         <div className="scene-content">
           {currentScene.content}
         </div>
         
         {currentScene.puzzle && currentScene.puzzle}
         
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
         
         {!currentScene.choices && !currentScene.puzzle && currentScene.id !== 'stage-end' && (
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

export default FinalShowdownStage;