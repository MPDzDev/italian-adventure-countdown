import React, { useState, useEffect } from 'react';
import './CompassQuest.css';
import { sendCompletionEmail, wasCompletionEmailSent } from './EmailService';

const CompassQuest = () => {
  const [compassDirection, setCompassDirection] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('starting-point');
  const [discoveredLocations, setDiscoveredLocations] = useState([]);
  const [questComplete, setQuestComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [compassClues, setCompassClues] = useState([]);
  const [currentClue, setCurrentClue] = useState(0);

  // Mediterranean locations with compass directions
  const locations = {
    'starting-point': {
      name: 'Alpine Waterpark Shore',
      description: 'Where your compass quest begins, overlooking the Mediterranean.',
      coordinates: { lat: 43.7, lng: 7.3 },
      discovered: true,
      icon: '🏄‍♂️'
    },
    'hidden-cove': {
      name: 'Hidden Cove',
      description: 'A secluded inlet where ancient sailors once sheltered from storms.',
      coordinates: { lat: 43.8, lng: 7.4 },
      discovered: false,
      icon: '🏖️',
      compassDirection: 45
    },
    'lighthouse-ruins': {
      name: 'Ancient Lighthouse',
      description: 'Crumbling ruins of a lighthouse that once guided ships to safety.',
      coordinates: { lat: 43.6, lng: 7.2 },
      discovered: false,
      icon: '🗼',
      compassDirection: 135
    },
    'merchant-port': {
      name: 'Old Merchant Port',
      description: 'A forgotten trading post where spices and stories were exchanged.',
      coordinates: { lat: 43.9, lng: 7.5 },
      discovered: false,
      icon: '⚓',
      compassDirection: 315
    },
    'temple-island': {
      name: 'Temple Island',
      description: 'A mysterious island with ancient ruins dedicated to Mediterranean gods.',
      coordinates: { lat: 43.7, lng: 7.6 },
      discovered: false,
      icon: '🏛️',
      compassDirection: 270
    }
  };

  // Compass clues that guide the player
  const clues = [
    {
      text: "The compass needle trembles towards the northeast, where calm waters hide beneath towering cliffs.",
      targetLocation: 'hidden-cove',
      direction: 45
    },
    {
      text: "Ancient mariners spoke of a beacon to the southeast, now silent but still watching over forgotten ships.",
      targetLocation: 'lighthouse-ruins',
      direction: 135
    },
    {
      text: "The compass spins towards the northwest, where merchants once counted coins and shared tales from distant lands.",
      targetLocation: 'merchant-port',
      direction: 315
    },
    {
      text: "Finally, the needle points west to sacred ground, where gods and mortals once walked together on marble steps.",
      targetLocation: 'temple-island',
      direction: 270
    }
  ];

  // Load saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem('compassQuestProgress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setCurrentLocation(parsed.currentLocation || 'starting-point');
        setDiscoveredLocations(parsed.discoveredLocations || []);
        setCompassClues(parsed.compassClues || []);
        setCurrentClue(parsed.currentClue || 0);
        setQuestComplete(parsed.questComplete || false);
      } catch (error) {
        console.error('Error loading compass quest progress:', error);
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    const progress = {
      currentLocation,
      discoveredLocations,
      compassClues,
      currentClue,
      questComplete
    };
    localStorage.setItem('compassQuestProgress', JSON.stringify(progress));
  }, [currentLocation, discoveredLocations, compassClues, currentClue, questComplete]);

  // Start the quest
  const startQuest = () => {
    setCompassClues([clues[0]]);
    setCurrentClue(0);
    setCompassDirection(clues[0].direction);
  };

  // Follow compass to location
  const followCompass = () => {
    if (currentClue < clues.length) {
      const targetLocation = clues[currentClue].targetLocation;
      
      // Discover the new location
      if (!discoveredLocations.includes(targetLocation)) {
        setDiscoveredLocations(prev => [...prev, targetLocation]);
      }
      
      setCurrentLocation(targetLocation);
      
      // Move to next clue or complete quest
      if (currentClue < clues.length - 1) {
        const nextClue = currentClue + 1;
        setCurrentClue(nextClue);
        setCompassClues(prev => [...prev, clues[nextClue]]);
        setCompassDirection(clues[nextClue].direction);
      } else {
        // Quest complete!
        completeQuest();
      }
    }
  };

  // Complete the quest
  const completeQuest = async () => {
    setQuestComplete(true);
    localStorage.setItem('compassChallengeComplete', 'true');
    
    // Send completion notification
    if (!wasCompletionEmailSent('CompassQuest') && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await sendCompletionEmail('CompassQuest', {
          locationsDiscovered: discoveredLocations.length + 1,
          questPath: discoveredLocations.join(' → '),
          completionTime: new Date().toLocaleString()
        });
      } catch (error) {
        console.error('Error sending compass quest completion:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Convert direction to compass reading
  const getCompassReading = (direction) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(direction / 22.5) % 16;
    return directions[index];
  };

  if (questComplete) {
    return (
      <div className="compass-quest">
        <div className="quest-header">
          <h2>🧭 Compass Quest Complete!</h2>
        </div>
        
        <div className="quest-complete">
          <div className="completion-icon">🌟</div>
          <h3>The Mediterranean Secrets Revealed!</h3>
          <p>You've successfully followed the ancient compass and discovered {discoveredLocations.length + 1} hidden locations along the Italian coast. The compass has revealed its secrets, and your understanding of the Mediterranean's mysteries has deepened.</p>
          
          <div className="discovered-locations">
            <h4>Your Journey:</h4>
            <div className="location-path">
              <div className="location-item">
                <span className="location-icon">🏄‍♂️</span>
                <span className="location-name">Alpine Waterpark Shore</span>
              </div>
              {discoveredLocations.map((locationKey, index) => (
                <React.Fragment key={locationKey}>
                  <div className="path-arrow">→</div>
                  <div className="location-item">
                    <span className="location-icon">{locations[locationKey].icon}</span>
                    <span className="location-name">{locations[locationKey].name}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="completion-reward">
            <p>🏆 <strong>Compass Master Achievement Unlocked!</strong></p>
            <p>The ancient compass now rests in your treasure chest, a symbol of your navigation skills and adventurous spirit.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="compass-quest">
      <div className="quest-header">
        <h2>🧭 The Compass Quest</h2>
        <p>A mysterious compass has washed ashore near the waterpark. Follow its guidance to discover ancient Mediterranean secrets!</p>
      </div>

      {compassClues.length === 0 ? (
        <div className="quest-start">
          <div className="compass-discovery">
            <div className="compass-container static">
              <div className="compass">
                <div className="compass-face">
                  <div className="compass-needle"></div>
                  <div className="compass-directions">
                    <span className="direction north">N</span>
                    <span className="direction east">E</span>
                    <span className="direction south">S</span>
                    <span className="direction west">W</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="discovery-text">
              <h3>A Mysterious Discovery</h3>
              <p>While walking along the shore after your waterpark celebration, you notice something glinting in the sand. It's an ancient-looking compass, its brass surface weathered by countless Mediterranean storms.</p>
              <p>As you pick it up, the needle begins to move with purpose, as if it knows exactly where it wants to lead you...</p>
            </div>
            
            <button className="start-quest-btn" onClick={startQuest}>
              Begin the Compass Quest
            </button>
          </div>
        </div>
      ) : (
        <div className="quest-active">
          <div className="current-location">
            <h3>📍 Current Location: {locations[currentLocation].name}</h3>
            <p>{locations[currentLocation].description}</p>
          </div>

          <div className="compass-section">
            <div className="compass-container">
              <div className="compass">
                <div 
                  className="compass-face"
                  style={{ transform: `rotate(${-compassDirection}deg)` }}
                >
                  <div className="compass-needle"></div>
                  <div className="compass-directions">
                    <span className="direction north">N</span>
                    <span className="direction east">E</span>
                    <span className="direction south">S</span>
                    <span className="direction west">W</span>
                  </div>
                </div>
              </div>
              <div className="compass-reading">
                {getCompassReading(compassDirection)}
              </div>
            </div>
          </div>

          {currentClue < clues.length && (
            <div className="current-clue">
              <h4>🗒️ Compass Reading:</h4>
              <p className="clue-text">{clues[currentClue].text}</p>
              <button className="follow-compass-btn" onClick={followCompass}>
                Follow the Compass
              </button>
            </div>
          )}

          <div className="quest-progress">
            <h4>🗺️ Discovered Locations:</h4>
            <div className="locations-grid">
              {Object.entries(locations).map(([key, location]) => (
                <div 
                  key={key}
                  className={`location-card ${discoveredLocations.includes(key) || key === 'starting-point' ? 'discovered' : 'undiscovered'}`}
                >
                  <div className="location-icon">{location.icon}</div>
                  <div className="location-name">{location.name}</div>
                  {(discoveredLocations.includes(key) || key === 'starting-point') && (
                    <div className="discovered-badge">✓</div>
                  )}
                </div>
              ))}
            </div>
            <div className="progress-counter">
              Progress: {discoveredLocations.length + 1} / {Object.keys(locations).length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompassQuest;