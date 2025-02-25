import React, { useState, useEffect } from 'react';
import './TreasureChest.css';

// Creating a context for treasure chest functions would be ideal,
// but for simplicity we'll export helper functions

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
  
  // Load saved treasure items from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('treasureChestItems');
    if (savedItems) {
      setTreasureItems(JSON.parse(savedItems));
    }
  }, []);
  
  // Function to toggle chest open/closed
  const toggleChest = () => {
    if (isUnlocked) {
      setIsOpen(!isOpen);
    }
  };
  
  // Using our exported function directly rather than defining it here
  // This avoids the ESLint warning about an unused function
  
  return (
    <div className={`treasure-chest-container ${isUnlocked ? 'unlocked' : 'locked'}`}>
      <h3 className="chest-title">
        {isUnlocked ? "Mysterious Treasure Chest" : "??? Locked ???"}
      </h3>
      
      <div className={`chest ${isOpen ? 'chest-open' : 'chest-closed'}`} onClick={toggleChest}>
        <div className="chest-lid">
          <div className="chest-lock"></div>
        </div>
        <div className="chest-body"></div>
      </div>
      
      {isUnlocked && (
        <p className="chest-hint">
          {isOpen 
            ? "The chest appears empty... or is it? Perhaps more challenges will reveal its contents."
            : "Click the chest to open it..."}
        </p>
      )}
      
      {isOpen && treasureItems.length > 0 && (
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
      
      {!isUnlocked && (
        <div className="locked-message">
          <p>Defeat the pirates to unlock this chest!</p>
          <p className="locked-hint">Solve the riddle challenges to progress...</p>
        </div>
      )}
    </div>
  );
};

export default TreasureChest;