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
    const savedItems = localStorage.getItem('treasureChestItems');
    if (savedItems) {
      setTreasureItems(JSON.parse(savedItems));
    }
    
    // Check if Pizzaiolo challenge is complete to show real chest
    const isPizzaioloComplete = localStorage.getItem('pizzaioloChallengeComplete') === 'true';
    if (isPizzaioloComplete) {
      setIsRealChest(true);
    }
  }, []);
  
  // Function to toggle chest open/closed
  const toggleChest = () => {
    if (isUnlocked) {
      // Check for challenge completion when chest is clicked
      const isPizzaioloComplete = localStorage.getItem('pizzaioloChallengeComplete') === 'true';
      if (isPizzaioloComplete && !isRealChest) {
        // Transform to real chest
        setIsRealChest(true);
        
        // Add transformation animation class
        const chestContainer = document.querySelector('.treasure-chest-container');
        if (chestContainer) {
          chestContainer.classList.add('transforming');
          setTimeout(() => {
            chestContainer.classList.remove('transforming');
          }, 3000);
        }
      } else {
        // Just toggle open/close
        setIsOpen(!isOpen);
      }
    }
  };
  
  return (
    <div className={`treasure-chest-container ${isUnlocked ? 'unlocked' : 'locked'}`}>
      <h3 className="chest-title">
        {isRealChest ? "The Chest Becomes Real!" : isUnlocked ? "Mysterious Treasure Chest" : "??? Locked ???"}
      </h3>
      
      {isRealChest ? (
        <div className="real-chest">
          <img 
            src="/images/real-chest.jpg" 
            alt="Real pirate chest" 
            className="real-chest-image" 
          />
          <p className="real-chest-message">
            "As you complete the final challenge, something miraculous happens! The digital chest 
            shimmers and transforms into a real physical chest before your eyes. Locked with a golden pirate padlock. What treasures might be inside?"
          </p>
          <div className="chest-lock-hint">
            "The lock has a mysterious skull symbol. Perhaps your adventure isn't over yet..."
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
      
      {isRealChest && (
        <div className="next-adventure-teaser">
          <h4>The Final Chapter</h4>
          <p>
            "The digital quest has manifested something real in your world! 
            The treasure chest from your adventure now sits before you, tangible and mysterious. 
            Inside are special treasures to accompany you on your journey to Italy."
          </p>
          <p>
            "The chest requires a special key - look for clues at the Alpine Splash Waterpark..."
          </p>
        </div>
      )}
      
      {isUnlocked && !isRealChest && (
        <p className="chest-hint">
          {isOpen 
            ? "The chest appears empty... or is it? Perhaps more challenges will reveal its contents."
            : "Click the chest to open it..."}
        </p>
      )}
      
      {isOpen && treasureItems.length > 0 && !isRealChest && (
        <div className="treasure-contents">
          <h4>Discovered Treasures:</h4>
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
          <p>Defeat the pirates to unlock this chest!</p>
          <p className="locked-hint">Solve the riddle challenges to progress...</p>
        </div>
      )}
    </div>
  );
};

export default TreasureChest;