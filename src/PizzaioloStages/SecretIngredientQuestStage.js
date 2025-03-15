import React, { useState, useEffect, memo, useCallback} from 'react';
import './PizzaioloStages.css';

// Memoized minigame component to keep state stable between renders
const StoryCluesComponent = memo(({ clueState, setClueState, onStoryEvent, isSofiaPresent }) => {
  const [activeStory, setActiveStory] = useState(0);
  const [feedback, setFeedback] = useState('');

  const stories = [
    {
      id: 1,
      title: "Antonio's Childhood Memory",
      content: (
        <>
          <p>Antonio leans back against an olive tree, remembering his childhood:</p>
          <p>
            "My grandmother would wake before <strong>dawn</strong> to begin baking. She always said the morning air added magic to the dough. She would take me to gather ingredients from the <strong>mountain</strong> slopes."
          </p>
        </>
      ),
      clues: ['dawn', 'mountain']
    },
    {
      id: 2,
      title: "Sofia's Discovery",
      content: isSofiaPresent ? (
        <>
          <p>Sofia tugs at your sleeve excitedly:</p>
          <p>
            "I remember when I discovered Papa's secret ingredient! We were walking in the hills and I saw a <strong>bee</strong> going from <strong>flower</strong> to flower. I followed it and found where it lived!"
          </p>
        </>
      ) : (
        <>
          <p>Antonio smiles as he recounts a story about Sofia:</p>
          <p>
            "Sofia discovered my secret ingredient by accident. We were walking in the hills when she spotted a <strong>bee</strong> moving from <strong>flower</strong> to flower."
          </p>
        </>
      ),
      clues: ['bee', 'flower']
    },
    {
      id: 3,
      title: "The Pirate's Observation",
      content: (
        <>
          <p>You recall something Breadbeard mentioned during your encounter:</p>
          <p>
            "The first mate said he tried regular honey but it wasn’t right. It needed to be <strong>wild</strong>—collected from mountain herbs and flowers."
          </p>
        </>
      ),
      clues: ['wild']
    },
    {
      id: 4,
      title: "A Foraging Lesson",
      content: (
        <>
          <p>Antonio points to the plants around you:</p>
          <p>
            "The best ingredients are found in nature and are untouched by man. That’s what makes them so special."
          </p>
        </>
      ),
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

    if (stories[activeStory].id === 1) {
      onStoryEvent('RELATIONSHIP_CHANGE', { character: 'antonioBond', amount: 5 });
    } else if (stories[activeStory].id === 2) {
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
      // Instead of just advancing the scene, we let the parent know that stage 4 is complete.
      setTimeout(() => {
        // Trigger stage completion when the secret ingredient is correctly guessed.
        if (typeof window.completeStageForSecretIngredient === 'function') {
          window.completeStageForSecretIngredient();
        }
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
            {clueState.discoveredClues.map(clue => (
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
            onChange={(e) =>
              setClueState(prev => ({ ...prev, secretIngredient: e.target.value }))
            }
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
          <div className="attempts-counter">Attempts: {clueState.attempts}</div>
        )}
      </div>
    </div>
  );
});

const SecretIngredientQuestStage = ({ onComplete, onStoryEvent, storyProgress }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [userChoices, setUserChoices] = useState(() => {
    const saved = localStorage.getItem('pizzaioloStage4Choices');
    return saved ? JSON.parse(saved) : {};
  });
  const [clueState, setClueState] = useState(() => {
    const saved = localStorage.getItem('pizzaioloStage4ClueState');
    return saved
      ? JSON.parse(saved)
      : {
          discoveredClues: [],
          requiredClues: ['dawn', 'mountain', 'flower', 'bee', 'wild'],
          attempts: 0,
          secretIngredient: '',
          solved: false
        };
  });
  const [isComplete, setIsComplete] = useState(false);

  const isSofiaPresent =
    storyProgress.storyChoices.sofia_journey === 'bring_along' ||
    storyProgress.storyChoices.sofia_journey === 'parent_decides';

  useEffect(() => {
    if (Object.keys(userChoices).length > 0) {
      localStorage.setItem('pizzaioloStage4Choices', JSON.stringify(userChoices));
    }
    if (
      clueState.discoveredClues.length > 0 ||
      clueState.attempts > 0 ||
      clueState.secretIngredient !== ''
    ) {
      localStorage.setItem('pizzaioloStage4ClueState', JSON.stringify(clueState));
    }
  }, [userChoices, clueState]);

 
  // Function to mark the stage as complete and notify the parent
  const completeStage = useCallback(() => {
    if (isComplete) return;
    setIsComplete(true);
    localStorage.setItem('pizzaioloStage4Complete', 'true');
    localStorage.setItem('pizzaioloStage4CompletionTime', new Date().toISOString());
    onComplete(4, {
      choices: userChoices,
      newItems: [],
      newLocations: ['Tuscan Countryside', 'Hillside'],
      characterRelationships: {}
    });
    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
    }, 200);
  }, [isComplete, onComplete, userChoices]);

  // Expose the completeStage function to the minigame so it can call it upon a correct guess.
  useEffect(() => {
    window.completeStageForSecretIngredient = completeStage;
    return () => {
      delete window.completeStageForSecretIngredient;
    };
  }, [completeStage]);

  const StoryCluesComponentRendered = (
    <StoryCluesComponent
      key="story-clues"
      clueState={clueState}
      setClueState={setClueState}
      onStoryEvent={onStoryEvent}
      isSofiaPresent={isSofiaPresent}
    />
  );

  const scenes = [
    {
      id: 'hillside-arrival',
      background: 'tuscan-hillside',
      content: (
        <>
          <h3>The Hillside Search</h3>
          <p>
            Following Captain Marinara's directions, you've arrived in the Tuscan countryside. Rolling hills and wildflowers surround ancient olive groves.
          </p>
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"These hills hold many memories. My family has gathered ingredients here for generations."</p>
            </div>
          </div>
          {isSofiaPresent && (
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"Papa, look at all the flowers! Can we make schiacciatina soon?"</p>
              </div>
            </div>
          )}
          <p>As you search for clues, you begin sharing stories about old recipes.</p>
        </>
      ),
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
              effect: () => {}
            }
          ]
        }
      ]
    },
    {
      id: 'systematic-search',
      background: 'herb-gathering',
      content: (
        <>
          <h3>A Systematic Approach</h3>
          <p>You methodically explore the hillside, discussing potential ingredients while Antonio points out local herbs.</p>
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"These hills are full of natural wonders. Let me share some family recipes."</p>
            </div>
          </div>
          <p>After a while, you find yourselves in a sunny clearing where bees buzz among wildflowers.</p>
          {isSofiaPresent && (
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"Remember when you showed me the bees making sweet things for our bread?"</p>
              </div>
            </div>
          )}
        </>
      ),
      choices: [
        {
          id: 'search-response',
          options: [
            {
              text: "Let's share memories about making schiacciatina",
              nextScene: 'story-exploration',
              effect: () => {
                onStoryEvent('RELATIONSHIP_CHANGE', { character: 'sofiaTrust', amount: 5 });
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
      content: (
        <>
          <h3>Gathering Clues</h3>
          <p>You settle under an olive tree as the warm afternoon sun bathes the hills. Memories and recipes are shared.</p>
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"The secret ingredient in Sofia's schiacciatina has been in our family for generations."</p>
            </div>
          </div>
          {isSofiaPresent && (
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"It makes the bread so special—I remember when I helped find it!"</p>
              </div>
            </div>
          )}
          <p>Now, listen closely and use the clues you’ve gathered.</p>
        </>
      ),
      // Render the minigame component with a stable key.
      minigame: StoryCluesComponentRendered
    },
    {
      id: 'ingredient-discovery',
      background: 'honey-discovery',
      content: (
        <>
          <h3>Eureka Moment</h3>
          <p>The clues come together: the secret ingredient is wild honey collected from mountain flowers!</p>
          <div className="dialogue">
            <div className="character-avatar person">👤</div>
            <div className="dialogue-bubble">
              <p className="character-name">You</p>
              <p>"Wild honey! That's it!"</p>
            </div>
          </div>
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"Exactly! Wild honey from bees that feed on mountain herbs and flowers. It gives our schiacciatina a unique sweetness."</p>
            </div>
          </div>
          {isSofiaPresent && (
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"I remember following a bee to its hive—Papa said it was magic honey!"</p>
              </div>
            </div>
          )}
          <p>With this revelation, you’re one step closer to completing the recipe.</p>
        </>
      ),
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
      content: (
        <div className="story-transition">
          <h3>Chapter 4 Complete</h3>
          <p>
            With the secret ingredient uncovered, you now hold the key to Antonio’s treasured recipes.
          </p>
          <div className="dialogue">
            <div className="character-avatar">👨‍🍳</div>
            <div className="dialogue-bubble">
              <p className="character-name">Antonio</p>
              <p>"Now that we know it's wild honey, we can finally confront Breadbeard and complete our recipe book."</p>
            </div>
          </div>
          {isSofiaPresent && (
            <div className="dialogue">
              <div className="character-avatar">👧</div>
              <div className="dialogue-bubble">
                <p className="character-name">Sofia</p>
                <p>"I can't wait to taste my special bread again!"</p>
              </div>
            </div>
          )}
          <p>Your next destination awaits—find Breadbeard to retrieve the final recipe page.</p>
        </div>
      ),
      choices: null
    }
  ];

  const currentScene = scenes[currentSceneIndex];

  useEffect(() => {
    const complete = localStorage.getItem('pizzaioloStage4Complete') === 'true';
    if (complete) {
      setIsComplete(true);
      setCurrentSceneIndex(scenes.length - 1);
    }
  }, [scenes.length]);


  const handleChoice = (choiceId, optionText) => {
    const choiceSet = currentScene.choices.find(choice => choice.id === choiceId);
    const selectedOption = choiceSet.options.find(opt => opt.text === optionText);

    if (selectedOption.effect) {
      selectedOption.effect();
    }

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
    if (selectedOption.nextScene === 'stage-end') {
      completeStage();
    }
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
