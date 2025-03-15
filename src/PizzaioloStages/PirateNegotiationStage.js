// PirateNegotiationStage.js
import React, { useState, useEffect } from 'react';
import './PizzaioloStages.css';

const PirateNegotiationStage = ({ onComplete, onStoryEvent, storyProgress }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [userChoices, setUserChoices] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [puzzleState, setPuzzleState] = useState({
    sequence: [],
    // The correct sequence is now based on strict, non-interchangeable steps
    correctSequence: ['knead', 'rise', 'preheat', 'roll', 'sauce', 'cheese', 'bake'],
    attempts: 0,
    solved: false
  });
  
  // Is Sofia present based on previous choices?
  const isSofiaPresent = storyProgress.storyChoices.sofia_journey === 'bring_along' || 
                         storyProgress.storyChoices.sofia_journey === 'parent_decides';
  
  // Save choices and puzzle state when they change
  useEffect(() => {
    if (Object.keys(userChoices).length > 0) {
      localStorage.setItem('pizzaioloStage3Choices', JSON.stringify(userChoices));
    }
    
    if (puzzleState.attempts > 0 || puzzleState.solved) {
      localStorage.setItem('pizzaioloStage3PuzzleState', JSON.stringify(puzzleState));
    }
  }, [userChoices, puzzleState]);
  
  // Mobile-friendly Recipe Sequence Puzzle component using clicks
  const RecipeSequencePuzzle = () => {
    const recipeSteps = [
      { id: 'knead', name: 'Mix & Knead Dough', icon: '🥖' },
      { id: 'rise', name: 'Let Dough Rise', icon: '⏳' },
      { id: 'preheat', name: 'Preheat Oven', icon: '🌡️' },
      { id: 'roll', name: 'Roll Out Dough', icon: '🔄' },
      { id: 'sauce', name: 'Spread Tomato Sauce', icon: '🍅' },
      { id: 'cheese', name: 'Add Mozzarella Cheese', icon: '🧀' },
      { id: 'bake', name: 'Bake Pizza', icon: '🔥' }
    ];
    
    // Add a step to the sequence if it hasn't been selected
    const addStep = (step) => {
      if (puzzleState.sequence.includes(step.id)) return;
      setPuzzleState(prev => ({
        ...prev,
        sequence: [...prev.sequence, step.id]
      }));
    };

    // Remove a step from the sequence by its index
    const removeStep = (index) => {
      setPuzzleState(prev => ({
        ...prev,
        sequence: prev.sequence.filter((_, i) => i !== index)
      }));
    };

    // Validate the selected sequence
    const checkSequence = () => {
      const isCorrect = puzzleState.sequence.length === puzzleState.correctSequence.length &&
                        puzzleState.sequence.every((id, index) => id === puzzleState.correctSequence[index]);
      
      setPuzzleState(prev => ({
        ...prev,
        attempts: prev.attempts + 1,
        solved: isCorrect
      }));
      
      if (isCorrect) {
        onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 15 });
        // Move to the next scene after a brief delay
        setTimeout(() => {
          setCurrentSceneIndex(currentSceneIndex + 1);
        }, 2000);
      }
    };
    
    return (
      <div className="recipe-puzzle">
        <h3>Captain's Challenge: Recipe Sequence</h3>
        <p>
          For the perfect pizza, the steps must be done in a specific order.
          Select the steps in the correct sequence:
        </p>
        
        <div className="available-steps">
          <h4>Available Steps:</h4>
          {recipeSteps.map(step => (
            <button 
              key={step.id} 
              onClick={() => addStep(step)}
              disabled={puzzleState.sequence.includes(step.id)}
              className="step-button"
            >
              {step.icon} {step.name}
            </button>
          ))}
        </div>
        
        <div className="sequence-container">
          <h4>Your Recipe Sequence:</h4>
          {puzzleState.sequence.length === 0 ? (
            <p>No steps selected. Tap a step to add it.</p>
          ) : (
            <div className="sequence-list">
              {puzzleState.sequence.map((stepId, index) => {
                const step = recipeSteps.find(s => s.id === stepId);
                return (
                  <div key={index} className="sequence-item">
                    <span>{index + 1}. {step.icon} {step.name}</span>
                    <button onClick={() => removeStep(index)} className="remove-step">
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {puzzleState.sequence.length === puzzleState.correctSequence.length && !puzzleState.solved && (
          <button onClick={checkSequence} className="check-sequence">
            Check Sequence
          </button>
        )}
        
        {puzzleState.attempts > 0 && !puzzleState.solved && (
          <div className="puzzle-feedback error">
            That's not quite right. Try again!
          </div>
        )}
        
        {puzzleState.solved && (
          <div className="puzzle-feedback success">
            Perfect! You've proven your pizza mastery!
          </div>
        )}
      </div>
    );
  };
  
  // Define the scenes for this stage
  const scenes = [
    {
      id: 'pirate-hideout',
      background: 'cave-entrance',
      content: <>
        <h3>The Pirates' Hideout</h3>
        <p>
          After following the clues from the market, you've arrived at a hidden cave near the base of the Leaning Tower.
          A small pirate flag flutters outside the entrance.
        </p>
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"This must be it. But how do we approach them? These pirates are dangerous..."</p>
          </div>
        </div>
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"I'm scared, Papa. What if they don't give us our recipes back?"</p>
            </div>
          </div>
        )}
        <p>As you contemplate your approach, a gruff voice calls out from inside the cave.</p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Pirate Guard</p>
            <p>"We know you're out there! State your business or walk the plank!"</p>
          </div>
        </div>
      </>,
      choices: [
        {
          id: 'hideout-approach',
          options: [
            { 
              text: "We're here to negotiate for Antonio's stolen recipes.", 
              nextScene: 'captain-meeting',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 10 });
              }
            },
            { 
              text: "We demand the return of the stolen recipes immediately!", 
              nextScene: 'captain-meeting-hostile',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: -15 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 });
              }
            },
            { 
              text: "We heard Captain Marinara appreciates fine Italian cuisine.", 
              nextScene: 'captain-meeting-intrigued',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 20 });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'captain-meeting',
      background: 'pirate-cave',
      content: <>
        <h3>Meeting the Captain</h3>
        <p>
          The pirate guards lead you deeper into the cave, which opens into a surprisingly cozy chamber.
          Maps and cooking utensils hang on the walls alongside traditional pirate flags.
        </p>
        <p>
          At a large wooden table sits a robust woman with a magnificent hat adorned with pasta shapes.
          She looks up from a puzzle box she's been manipulating.
        </p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"So, you've come for the recipes, eh? Antonio himself has graced us with his presence! I'm Captain Marinara of the Dough Raiders."</p>
          </div>
        </div>
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Please, Captain. Those recipes have been in my family for generations. My pizzeria will fail without them."</p>
          </div>
        </div>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"That's precisely why they're valuable! But I might consider a trade... if you can prove you're worthy of these recipes.
            Let's test your pizza knowledge first."</p>
          </div>
        </div>
      </>,
      choices: [
        {
          id: 'captain-response',
          options: [
            { 
              text: "We accept your challenge.", 
              nextScene: 'recipe-puzzle',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 5 });
              }
            },
            { 
              text: "Why do we need to prove ourselves? They're our recipes!", 
              nextScene: 'recipe-puzzle-reluctant',
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
      id: 'captain-meeting-hostile',
      background: 'pirate-cave',
      content: <>
        <h3>A Tense Encounter</h3>
        <p>
          The pirates roughly escort you into their hideout. The atmosphere is tense as you're brought before their captain—
          a robust woman with a magnificent hat adorned with pasta shapes.
        </p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"Demanding things from pirates? Bold but foolish. These recipes are my treasure now, and pirates don't give up treasure easily."</p>
          </div>
        </div>
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Please, Captain. Those recipes are my livelihood. My family depends on them."</p>
          </div>
        </div>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"Hmm. Perhaps I might reconsider... if you can pass my test.
            Let's see if you truly deserve these recipes."</p>
          </div>
        </div>
      </>,
      choices: [
        {
          id: 'hostile-response',
          options: [
            { 
              text: "Fine. What's your test?", 
              nextScene: 'recipe-puzzle',
              effect: () => { }
            },
            { 
              text: "We'll prove our worth.", 
              nextScene: 'recipe-puzzle',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 5 });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'captain-meeting-intrigued',
      background: 'pirate-cave',
      content: <>
        <h3>A Culinary Pirate</h3>
        <p>
          The pirates warmly welcome you into their hideout, intrigued by your comment.
          The cave opens into a surprisingly cozy chamber with maps and cooking utensils hanging alongside traditional pirate flags.
        </p>
        <p>
          A robust woman with a magnificent hat adorned with pasta shapes stands up from her chair, clearly delighted.
        </p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"Well, well! Someone who appreciates the finer things! I'm Captain Marinara, collector of treasures both golden and... delicious."</p>
          </div>
        </div>
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Captain, I understand your appreciation for fine cuisine. But my recipes are my legacy—my gift to my daughter Sofia."</p>
          </div>
        </div>
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"I miss my papa's schiacciatina. It's my favorite food in the whole world."</p>
            </div>
          </div>
        )}
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"The famous Antonio himself! I took your recipes to learn your secrets, but perhaps we can come to an arrangement.
            First, let me test your knowledge—prove you truly understand the art of pizza-making."</p>
          </div>
        </div>
      </>,
      choices: [
        {
          id: 'intrigued-response',
          options: [
            { 
              text: "We'd be happy to demonstrate our expertise.", 
              nextScene: 'recipe-puzzle',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 10 });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'recipe-puzzle',
      background: 'pirate-galley',
      content: <>
        <h3>The Captain's Challenge</h3>
        <p>
          Captain Marinara leads you to the pirate galley—a surprisingly well-equipped kitchen at the back of the cave.
        </p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"My crew and I have been trying to recreate these recipes, but something's always missing.
            Show me you understand the proper, unalterable sequence of making the perfect pizza, and I might reconsider my treasure acquisition."</p>
          </div>
        </div>
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"Papa knows all about making pizza! He's the best!"</p>
            </div>
          </div>
        )}
        <p>The captain now challenges you to select the steps in the correct order.</p>
      </>,
      choices: null, // No choices – show puzzle component
      puzzle: <RecipeSequencePuzzle />
    },
    {
      id: 'recipe-puzzle-reluctant',
      background: 'pirate-galley',
      content: <>
        <h3>The Captain's Challenge</h3>
        <p>
          Captain Marinara frowns at your reluctance but leads you to the pirate galley nonetheless.
        </p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"If you want your precious recipes back, you'll play by my rules.
            Pirates don't respond well to demands. Show me you know your craft—then we'll talk."</p>
          </div>
        </div>
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Let's just do as she says. It's our best chance to recover my recipes."</p>
          </div>
        </div>
        <p>The captain challenges you to select the steps in the correct order.</p>
      </>,
      choices: null, // No choices – show puzzle component
      puzzle: <RecipeSequencePuzzle />
    },
    {
      id: 'negotiation',
      background: 'pirate-table',
      content: <>
        <h3>A Pirate's Proposal</h3>
        <p>
          With the challenge completed, Captain Marinara seems impressed.
          She retrieves Antonio's recipe book from a locked chest and thumbs through its pages.
        </p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"You know your craft, I'll give you that.
            But I can't simply hand these over for nothing—pirates have a reputation to maintain."</p>
          </div>
        </div>
        <p>She taps her finger on the table thoughtfully, then smiles.</p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"I propose a trade.
            I'll return your recipes, but in exchange, you must teach my crew how to make proper Neapolitan pizza AND provide us with supplies whenever we dock near your village."</p>
          </div>
        </div>
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>Antonio looks to you for advice on how to respond.</p>
          </div>
        </div>
      </>,
      choices: [
        {
          id: 'negotiation-response',
          options: [
            { 
              text: "We accept your terms, Captain.", 
              nextScene: 'agreement',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 25 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 10 });
                onStoryEvent('MAKE_CHOICE', { choiceId: 'pirate_deal', option: 'accepted' });
              }
            },
            { 
              text: "We'll teach your crew, but no ongoing supplies.", 
              nextScene: 'partial-agreement',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: 5 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 });
                onStoryEvent('MAKE_CHOICE', { choiceId: 'pirate_deal', option: 'partial' });
              }
            },
            { 
              text: "We refuse. The recipes belong to Antonio.", 
              nextScene: 'standoff',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'pirateRespect', amount: -20 });
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 15 });
                onStoryEvent('MAKE_CHOICE', { choiceId: 'pirate_deal', option: 'refused' });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'agreement',
      background: 'handshake',
      content: <>
        <h3>An Unlikely Alliance</h3>
        <p>Captain Marinara breaks into a broad smile and extends her hand to shake on the deal.</p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"A fine arrangement! My crew will eat like kings instead of the slop our current cook serves.
            And we'll protect your village from other pirate crews, as a bonus."</p>
          </div>
        </div>
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Thank you for being reasonable, Captain. I believe this can work out for both of us."</p>
          </div>
        </div>
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"Does this mean we can make schiacciatina again, Papa?"</p>
            </div>
          </div>
        )}
        <p>Captain Marinara hands over the recipe book, but holds back one page.</p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"Almost everything is here.
            But there's one last secret—the special ingredient for Sofia's schiacciatina.
            For that, you'll need to speak with my first mate who's hidden it elsewhere."</p>
          </div>
        </div>
      </>,
      choices: [
        {
          id: 'final-clue',
          options: [
            { 
              text: "Where can we find your first mate?", 
              nextScene: 'stage-end',
              effect: () => {
                onStoryEvent('ADD_INVENTORY', { 
                  item: {
                    icon: "📘",
                    name: "Antonio's Recipe Book",
                    description: "The recovered family recipe book, missing only the special schiacciatina recipe."
                  }
                });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'partial-agreement',
      background: 'compromise',
      content: <>
        <h3>A Compromise</h3>
        <p>Captain Marinara narrows her eyes, considering your counteroffer.</p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"Half a deal is better than no deal, I suppose.
            We'll accept the lessons, but remember who holds the power when we sail near your shores."</p>
          </div>
        </div>
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"I'll teach your crew everything they need to know about proper pizza-making.
            It's a fair exchange."</p>
          </div>
        </div>
        <p>The captain hands over most of the recipe book, but keeps several pages.</p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"I'll keep a few recipes as... insurance. Including the special one for the little girl.
            If you want it back, you'll need to find my first mate who's guarding our most valuable treasures."</p>
          </div>
        </div>
      </>,
      choices: [
        {
          id: 'partial-next',
          options: [
            { 
              text: "Where is your first mate?", 
              nextScene: 'stage-end',
              effect: () => {
                onStoryEvent('ADD_INVENTORY', { 
                  item: {
                    icon: "📔",
                    name: "Partial Recipe Book",
                    description: "Most of Antonio's recipes have been recovered, but several important pages are still missing."
                  }
                });
              }
            }
          ]
        }
      ]
    },
    {
      id: 'standoff',
      background: 'tension',
      content: <>
        <h3>A Tense Standoff</h3>
        <p>Captain Marinara's expression darkens as she slams the recipe book shut.</p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"You dare refuse a pirate captain's generous offer? Bold, but foolish! Guards! Escort them out!"</p>
          </div>
        </div>
        <p>Several pirates move toward you menacingly, but Antonio steps forward.</p>
        <div className="dialogue">
          <div className="character-avatar">👨‍🍳</div>
          <div className="dialogue-bubble">
            <p className="character-name">Antonio</p>
            <p>"Wait! Captain, those recipes are worthless without knowing the special ingredient—a secret I keep only in my head.
            You'll never recreate them properly."</p>
          </div>
        </div>
        <p>The captain pauses, considering Antonio's words.</p>
        <div className="dialogue">
          <div className="character-avatar">🏴‍☠️</div>
          <div className="dialogue-bubble">
            <p className="character-name">Captain Marinara</p>
            <p>"Clever... very clever. Fine! Take your book of common recipes.
            But the page with the child's special recipe stays with me.
            My first mate has hidden it with our greatest treasures."</p>
          </div>
        </div>
        {isSofiaPresent && (
          <div className="dialogue">
            <div className="character-avatar">👧</div>
            <div className="dialogue-bubble">
              <p className="character-name">Sofia</p>
              <p>"But that's MY special recipe! Please give it back!"</p>
            </div>
          </div>
        )}
      </>,
      choices: [
        {
          id: 'standoff-next',
          options: [
            { 
              text: "Where can we find your first mate?", 
              nextScene: 'stage-end',
              effect: () => {
                onStoryEvent('ADD_INVENTORY', { 
                  item: {
                    icon: "📑",
                    name: "Incomplete Recipe Book",
                    description: "The main recipe book has been recovered, but Sofia's special schiacciatina recipe is still missing."
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
      background: 'departure',
      content: <>
        <div className="story-transition">
          <h3>Chapter 3 Complete</h3>
          <p>
            After your negotiation with Captain Marinara, she provides you with important information.
          </p>
          <div className="dialogue">
            <div className="character-avatar">🏴‍☠️</div>
            <div className="dialogue-bubble">
              <p className="character-name">Captain Marinara</p>
              <p>"My first mate, Breadbeard, is guarding our special treasures in an old olive mill in the hills.
              The last recipe page is with him, along with the secret ingredient you'll need."</p>
            </div>
          </div>
          <p>
            As you leave the pirates' hideout with {userChoices.pirate_deal === 'accepted' ? 'most of the recipes and a new alliance' : userChoices.pirate_deal === 'partial' ? 'most of the recipes' : 'only part of the recipe book'}, you know your next destination.
          </p>
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"We've made progress, but we still need to find Sofia's special recipe.
              Let's head to the hills and find this Breadbeard."</p>
            </div>
          </div>
          {isSofiaPresent && (
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"I hope we find my recipe soon. I miss my schiacciatina!"</p>
              </div>
            </div>
          )}
          <p>Your journey continues to the hidden olive mill in the Tuscan hills...</p>
        </div>
      </>,
      choices: null // End of stage
    }
  ];
  
  // Check if previously completed
  useEffect(() => {
    const isStageComplete = localStorage.getItem('pizzaioloStage3Complete') === 'true';
    if (isStageComplete) {
      setIsComplete(true);
      setCurrentSceneIndex(scenes.length - 1);
    }
    const savedChoices = localStorage.getItem('pizzaioloStage3Choices');
    if (savedChoices) {
      setUserChoices(JSON.parse(savedChoices));
    }
    const savedPuzzleState = localStorage.getItem('pizzaioloStage3PuzzleState');
    if (savedPuzzleState) {
      setPuzzleState(JSON.parse(savedPuzzleState));
    }
  }, [scenes.length]);

  const currentScene = scenes[currentSceneIndex];
  
  const handleChoice = (choiceId, option) => {
    const choiceSet = currentScene.choices.find(choice => choice.id === choiceId);
    const selectedOption = choiceSet.options.find(opt => opt.text === option);
    
    if (selectedOption.effect) {
      selectedOption.effect();
    }
    
    setUserChoices(prev => ({
      ...prev,
      [choiceId]: selectedOption.nextScene === 'stage-end' 
        ? option.toLowerCase().replace(/\s+/g, '_')
        : selectedOption.nextScene 
    }));
    
    const nextSceneIndex = scenes.findIndex(scene => scene.id === selectedOption.nextScene);
    if (nextSceneIndex !== -1) {
      setCurrentSceneIndex(nextSceneIndex);
    }
    
    if (selectedOption.nextScene === 'stage-end') {
      completeStage();
    }
  };
  
  const completeStage = () => {
    setIsComplete(true);
    onComplete(3, {
      choices: userChoices,
      newItems: [],
      newLocations: ["Pirate Hideout", "Tuscan Hills"],
      characterRelationships: { }
    });
  };
  
  return (
    <div className="stage-content story-stage">
      {isComplete ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h4>Chapter Complete: Pirate Negotiations</h4>
          <p>You've successfully negotiated with Captain Marinara and recovered most of Antonio's recipes!</p>
          <p>
            However, Sofia's special schiacciatina recipe is still missing, guarded by the pirate first mate somewhere in the Tuscan hills.
          </p>
          <div className="next-stage-hint">
            <p>Your adventure continues in the next chapter, coming soon...</p>
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

export default PirateNegotiationStage;
