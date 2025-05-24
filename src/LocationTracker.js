import React, { useState, useEffect } from 'react';
import './LocationTracker.css';
import { sendCompletionEmail, wasCompletionEmailSent } from './EmailService';

const LocationTracker = () => {
  const [locationStage, setLocationStage] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(null);
  const [distanceFromHome, setDistanceFromHome] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Starting coordinates (Bedford, UK)
  const startingCoords = {
    lat: 52.137154,
    lng: -0.431901
  };

  // Target coordinates (Lido Adriano, Italy)
  const targetCoords = {
    lat: 44.424156,
    lng: 12.304828
  };

  // Stage definitions with distance thresholds (in km from target)
  const stages = [
    { 
      id: 0, 
      name: 'At Home in Bedford', 
      description: 'Your adventure begins at home in Bedford', 
      threshold: Infinity,
      icon: '🏠'
    },
    { 
      id: 1, 
      name: 'Journey Begins', 
      description: 'You\'ve stepped out and started your Italian adventure!', 
      threshold: 1400, // Still very far from Italy, just moved from house
      icon: '✈️'
    },
    { 
      id: 2, 
      name: 'En Route to Italy', 
      description: 'Flying towards your Italian destination', 
      threshold: 1000,
      icon: '🛫'
    },
    { 
      id: 3, 
      name: 'Approaching Italy', 
      description: 'Getting closer to Italian airspace', 
      threshold: 500,
      icon: '🌍'
    },
    { 
      id: 4, 
      name: 'Arrived in Italy', 
      description: 'Welcome to Italy! The adventure intensifies', 
      threshold: 200,
      icon: '🇮🇹'
    },
    { 
      id: 5, 
      name: 'Bologna Region', 
      description: 'In the Emilia-Romagna region, close to your destination', 
      threshold: 100,
      icon: '🏛️'
    },
    { 
      id: 6, 
      name: 'Adriatic Coast', 
      description: 'The Mediterranean coast is in sight!', 
      threshold: 50,
      icon: '🌊'
    },
    { 
      id: 7, 
      name: 'Lido Adriano Area', 
      description: 'Very close to the treasure location now!', 
      threshold: 10,
      icon: '🏖️'
    },
    { 
      id: 8, 
      name: 'Treasure Location', 
      description: 'You\'ve arrived at the exact treasure coordinates!', 
      threshold: 0,
      icon: '💎'
    }
  ];

  // Load saved progress on mount
  useEffect(() => {
    const savedStage = localStorage.getItem('locationStage');
    const savedDistance = localStorage.getItem('currentDistance');
    const savedDistanceFromHome = localStorage.getItem('distanceFromHome');
    const savedUpdate = localStorage.getItem('lastLocationUpdate');
    
    if (savedStage) {
      setLocationStage(parseInt(savedStage, 10));
    }
    
    if (savedDistance) {
      setCurrentDistance(parseFloat(savedDistance));
    }
    
    if (savedDistanceFromHome) {
      setDistanceFromHome(parseFloat(savedDistanceFromHome));
    }
    
    if (savedUpdate) {
      setLastUpdate(new Date(savedUpdate));
    }

    // Check initial location permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setHasLocationPermission(result.state === 'granted');
        setPermissionDenied(result.state === 'denied');
      });
    }
  }, []);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Determine stage based on distance from target and special logic for stage 1
  const determineStage = (distance, userLat, userLng) => {
    // Special logic for stage 1: check if they've moved away from the exact house location
    const distanceFromHome = calculateDistance(userLat, userLng, startingCoords.lat, startingCoords.lng);
    
    // If they're more than 1km from home, they get stage 1 (even if still very far from Italy)
    if (distanceFromHome > 1 && locationStage === 0) {
      return 1;
    }
    
    // For other stages, use distance to target as normal
    for (let i = stages.length - 1; i >= 1; i--) {
      if (distance <= stages[i].threshold) {
        return stages[i].id;
      }
    }
    
    // If still at home (within 1km), stay at stage 0
    return distanceFromHome <= 1 ? 0 : Math.max(1, locationStage);
  };

  // Send notification for stage completion
  const sendStageNotification = async (newStage) => {
    const stageInfo = stages.find(s => s.id === newStage);
    const notificationId = `LocationStage${newStage}`;
    
    if (!wasCompletionEmailSent(notificationId)) {
      try {
        await sendCompletionEmail(notificationId, {
          stageName: stageInfo.name,
          stageDescription: stageInfo.description,
          currentDistance: currentDistance,
          coordinates: `${targetCoords.lat}, ${targetCoords.lng}`,
          completionTime: new Date().toLocaleString()
        });
      } catch (error) {
        console.error('Error sending stage completion notification:', error);
      }
    }
  };

  // Request location permission
  const requestLocationPermission = () => {
    setIsUpdating(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      setIsUpdating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        // Calculate distance to target
        const distance = calculateDistance(userLat, userLng, targetCoords.lat, targetCoords.lng);
        const newStage = determineStage(distance, userLat, userLng);
        
        // Update state
        setCurrentDistance(distance);
        setHasLocationPermission(true);
        setPermissionDenied(false);
        setLastUpdate(new Date());
        
        // Calculate distance from home for display
        const distanceFromHome = calculateDistance(userLat, userLng, startingCoords.lat, startingCoords.lng);
        
        // Check if stage has changed
        if (newStage !== locationStage) {
          setLocationStage(newStage);
          localStorage.setItem('locationStage', newStage.toString());
          
          // Send notification for new stage
          sendStageNotification(newStage);
          
          // Dispatch custom event to update other components
          const event = new CustomEvent('localStorageUpdate');
          window.dispatchEvent(event);
        }
        
        // Save to localStorage
        localStorage.setItem('currentDistance', distance.toString());
        localStorage.setItem('distanceFromHome', distanceFromHome.toString());
        localStorage.setItem('lastLocationUpdate', new Date().toISOString());
        
        setIsUpdating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setPermissionDenied(true);
        setHasLocationPermission(false);
        setIsUpdating(false);
        
        if (error.code === error.PERMISSION_DENIED) {
          alert('Location access denied. Please enable location permissions and try again.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert('Location information is unavailable.');
        } else if (error.code === error.TIMEOUT) {
          alert('Location request timed out.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Retry after permission denied
  const retryLocationRequest = () => {
    setPermissionDenied(false);
    requestLocationPermission();
  };

  // Get current stage info
  const getCurrentStage = () => stages.find(s => s.id === locationStage) || stages[0];
  const getNextStage = () => stages.find(s => s.id === locationStage + 1);

  // Format distance display
  const formatDistance = (distance) => {
    if (distance === null) return '---';
    if (distance < 1) return `${Math.round(distance * 1000)}m`;
    return `${Math.round(distance)}km`;
  };

  // Permission denied view
  if (permissionDenied) {
    return (
      <div className="location-tracker">
        <div className="tracker-header">
          <h2>🌍 Journey to Italy</h2>
          <p>Track your real-world progress to the treasure location</p>
        </div>
        
        <div className="permission-denied">
          <h3>Location Access Required</h3>
          <p>To track your journey to Italy, we need access to your location. Please enable location permissions in your browser settings and try again.</p>
          <button className="retry-btn" onClick={retryLocationRequest}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Permission request view
  if (hasLocationPermission === null || hasLocationPermission === false) {
    return (
      <div className="location-tracker">
        <div className="tracker-header">
          <h2>🌍 Journey to Italy</h2>
                      <p>Track your real-world progress as you journey from Bedford to the treasure location in Lido Adriano</p>
        </div>
        
        <div className="permission-request">
          <div className="permission-content">
            <h3>Enable Location Tracking</h3>
            <p>To track your journey from your home in Bedford to the Italian treasure location, we need access to your location. This will help unlock new stages as you get closer to the treasure!</p>
            <p><strong>Target Destination:</strong> Lido Adriano, Italy<br />
            <strong>Coordinates:</strong> 44.424156, 12.304828</p>
            <button 
              className="permission-btn" 
              onClick={requestLocationPermission}
              disabled={isUpdating}
            >
              {isUpdating ? 'Getting Location...' : 'Enable Location Tracking'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main tracker view
  const currentStage = getCurrentStage();
  const nextStage = getNextStage();

  return (
    <div className="location-tracker">
      <div className="tracker-header">
        <h2>🌍 Journey to Italy</h2>
        <p>Track your real-world progress to the treasure in Lido Adriano</p>
      </div>

      <div className="tracker-content">
        <div className="current-status">
          <div className="status-card">
            <h3>Current Status</h3>
            
            <div className="distance-display">
              <div className="distance-value">
                {formatDistance(currentDistance)}
              </div>
              <div className="distance-label">
                to treasure location
              </div>
            </div>

            <div className="stage-info">
              <div className="current-stage">
                <div className="stage-badge">Stage {currentStage.id}</div>
                <div className="stage-name">{currentStage.name}</div>
              </div>
              <p className="stage-description">{currentStage.description}</p>
              
              {/* Show distance from home for early stages */}
              {(locationStage === 0 || locationStage === 1) && distanceFromHome !== null && (
                <div className="home-distance">
                  <small>Distance from home: {formatDistance(distanceFromHome)}</small>
                  {locationStage === 0 && distanceFromHome < 1 && (
                    <small className="stage-hint">💡 Move more than 1km from home to unlock the first stage!</small>
                  )}
                </div>
              )}
            </div>

            {lastUpdate && (
              <div className="last-update">
                Last updated: {lastUpdate.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {nextStage && (
          <div className="next-stage">
            <h4>🎯 Next Milestone</h4>
            <div className="next-stage-info">
              <div className="next-stage-name">{nextStage.name}</div>
              <div className="next-stage-distance">
                Unlock when within {nextStage.threshold}km of destination
              </div>
            </div>
            <p className="next-stage-description">{nextStage.description}</p>
          </div>
        )}

        <div className="journey-progress">
          <h4>🗺️ Journey Progress</h4>
          <div className="stages-list">
            {stages.map(stage => (
              <div 
                key={stage.id}
                className={`stage-item ${
                  stage.id < locationStage ? 'unlocked' :
                  stage.id === locationStage ? 'current' : 'locked'
                }`}
              >
                <div className="stage-indicator">
                  {stage.id < locationStage ? '✓' : 
                   stage.id === locationStage ? stage.icon : 
                   stage.id}
                </div>
                <div className="stage-content">
                  <div className="stage-header">
                    <div className="stage-title">{stage.name}</div>
                    {stage.threshold !== Infinity && stage.threshold !== 0 && (
                      <div className="stage-threshold">≤{stage.threshold}km</div>
                    )}
                  </div>
                  <p className="stage-desc">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="manual-update">
          <button 
            className="update-location-btn"
            onClick={requestLocationPermission}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating Location...' : '🔄 Refresh My Location'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationTracker;