import React, { useState, useEffect } from 'react';
import './TreasureChest.css';

// Helper function to add treasure item (can be imported by other components)
export const addTreasureItem = (item) => {
  const savedItems = localStorage.getItem('treasureChestItems');
  let items = [];
  
  if (savedItems) {
    items = JSON.parse(savedItems);
  }
  
  items.push(item);
  localStorage.setItem('treasureChestItems', JSON.stringify(items));
  
  // Return updated items array
  return items;
};

const TreasureChest = ({ isUnlocked = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [treasureItems, setTreasureItems] = useState([]);
  const [isRealChest, setIsRealChest] = useState(false);
  
  // Load saved treasure items from localStorage
  useEffect(() => {
    // Add default items for completed challenges
    const defaultItems = [
      {
        icon: "🏴‍☠️",
        name: "Pirate Victory",
        description: "Defeated the pirates and solved their riddles"
      },
      {
        icon: "📜",
        name: "Antonio's Recipes",
        description: "Recovered the stolen family pizza recipes"
      },
      {
        icon: "🏆",
        name: "Waterpark Champion",
        description: "Mastered the word challenges at Alpine Splash"
      },
      {
        icon: "🧭",
        name: "Journey Compass",
        description: "Guides your path to Italian treasure"
      },
      {
        icon: "🇮🇹",
        name: "Italian Adventure",
        description: "Memories from your Mediterranean journey"
      }
    ];
    
    const savedItems = localStorage.getItem('treasureChestItems');
    if (savedItems) {
      const parsed = JSON.parse(savedItems);
      setTreasureItems([...defaultItems, ...parsed]);
    } else {
      setTreasureItems(defaultItems);
    }
    
    // Check if all challenges complete to show real chest
    const isPizzaioloComplete = localStorage.getItem('pizzaioloChallengeComplete') === 'true';
    const isPirateComplete = localStorage.getItem('pirateRiddleStates');
    const isWordleComplete = localStorage.getItem('wordleChallengeCompleted') === 'true';
    
    if (isPizzaioloComplete && isPirateComplete && isWordleComplete) {
      setIsRealChest(true);
    }
  }, []);
  
  // Function to toggle chest open/closed
  const toggleChest = () => {
    if (isUnlocked) {
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <div className={`treasure-chest-container ${isUnlocked ? 'unlocked' : 'locked'}`}>
      {isRealChest ? (
        <div className="real-chest">
          <img 
            src="/images/real-chest.jpg" 
            alt="Real pirate chest" 
            className="real-chest-image" 
          />
          <div className="real-chest-message">
            The digital adventure has created something real! Your Italian journey rewards await discovery.
          </div>
          <div className="chest-lock-hint">
            Look for the physical chest at your final destination...
          </div>
        </div>
      ) : (
        <div className={`chest ${isOpen ? 'chest-open' : 'chest-closed'}`} onClick={toggleChest}>
          <div className="chest-lid">
            <div className="chest-lock"></div>
          </div>
          <div className="chest-body"></div>
        </div>
      )}
      
      {isUnlocked && !isRealChest && (
        <p className="chest-hint">
          {isOpen 
            ? "Your adventure memories and rewards"
            : "Click to open your treasure chest"}
        </p>
      )}
      
      {isOpen && treasureItems.length > 0 && !isRealChest && (
        <div className="treasure-contents">
          <h4>Adventure Rewards</h4>
          <ul className="treasure-list">
            {treasureItems.map((item, index) => (
              <li key={index} className="treasure-item">
                <div className="treasure-icon">{item.icon}</div>
                <div className="treasure-details">
                  <h5>{item.name}</h5>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {!isUnlocked && !isRealChest && (
        <div className="locked-message">
          <p>Complete challenges to unlock!</p>
        </div>
      )}
    </div>
  );
};

export default TreasureChest;