import React, { useState, useEffect, useMemo } from 'react';
import './LocationTracker.css';
import { sendCompletionEmail, wasCompletionEmailSent } from './EmailService';

const LocationTracker = () => {
  const [locationStage, setLocationStage] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [activeHint, setActiveHint] = useState(null);
  const [showRefreshHint, setShowRefreshHint] = useState(false);

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

  // Enhanced stage definitions with hints - memoized to prevent re-renders
  const stages = useMemo(() => [
    { 
      id: 0, 
      name: 'Home Base', 
      threshold: Infinity, 
      icon: '🏠',
      hint: 'Journey begins'
    },
    { 
      id: 1, 
      name: 'Journey Started', 
      threshold: 1272, 
      icon: '✈️',
      hint: 'Adventure awaits'
    },
    { 
      id: 2, 
      name: 'In Italy', 
      threshold: 100, 
      icon: '🇮🇹',
      hint: 'Ancient lands'
    },
    { 
      id: 3, 
      name: 'Bologna Region', 
      threshold: 77, 
      icon: '🏛️',
      hint: 'City of wisdom'
    },
    { 
      id: 4, 
      name: 'Adriatic Coast', 
      threshold: 10, 
      icon: '🌊',
      hint: 'Sparkling waters'
    },
    { 
      id: 5, 
      name: 'Lido Adriano', 
      threshold: 5, 
      icon: '🏖️',
      hint: 'Almost there'
    },
    { 
      id: 6, 
      name: 'Treasure Found!', 
      threshold: 0, 
      icon: '💎',
      hint: 'X marks the spot'
    }
  ], []);

  // Load saved progress
  useEffect(() => {
    const savedStage = localStorage.getItem('locationStage');
    const savedDistance = localStorage.getItem('currentDistance');
    const savedUpdate = localStorage.getItem('lastLocationUpdate');
    const savedPasswordState = localStorage.getItem('treasurePasswordVerified');
    
    if (savedStage) setLocationStage(parseInt(savedStage, 10));
    if (savedDistance) setCurrentDistance(parseFloat(savedDistance));
    if (savedUpdate) setLastUpdate(new Date(savedUpdate));
    if (savedPasswordState === 'true') setPasswordVerified(true);

    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setHasLocationPermission(result.state === 'granted');
        setPermissionDenied(result.state === 'denied');
      });
    }
  }, []);

  // Simple hint cycling effect - just sets active hint index
  useEffect(() => {
    if (hasLocationPermission && locationStage < 6) {
      const hintInterval = setInterval(() => {
        // Show hints for nearby stages (current and next 2)
        const availableStageIds = stages
          .filter(stage => stage.id >= locationStage && stage.id <= Math.min(locationStage + 2, 6))
          .map(stage => stage.id);
        
        if (availableStageIds.length > 0) {
          const randomStageId = availableStageIds[Math.floor(Math.random() * availableStageIds.length)];
          setActiveHint(randomStageId);
          
          // Hide hint after 3 seconds
          setTimeout(() => setActiveHint(null), 3000);
        }
      }, 6000); // Show hint every 6 seconds
      
      return () => clearInterval(hintInterval);
    }
  }, [hasLocationPermission, locationStage, stages]);

  // Refresh button hint - show after user has been on the page for a while
  useEffect(() => {
    if (hasLocationPermission) {
      const refreshHintTimer = setTimeout(() => {
        setShowRefreshHint(true);
        // Hide after 4 seconds
        setTimeout(() => setShowRefreshHint(false), 4000);
      }, 15000); // Show after 15 seconds
      
      // Show refresh hint periodically
      const refreshHintInterval = setInterval(() => {
        setShowRefreshHint(true);
        setTimeout(() => setShowRefreshHint(false), 4000);
      }, 45000); // Every 45 seconds
      
      return () => {
        clearTimeout(refreshHintTimer);
        clearInterval(refreshHintInterval);
      };
    }
  }, [hasLocationPermission]);

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Determine stage based on distance
  const determineStage = (distance, userLat, userLng) => {
    const distanceFromHome = calculateDistance(userLat, userLng, startingCoords.lat, startingCoords.lng);
    
    if (distanceFromHome > 1 && locationStage === 0) return 1;
    
    for (let i = stages.length - 1; i >= 1; i--) {
      if (distance <= stages[i].threshold) return stages[i].id;
    }
    
    return distanceFromHome <= 1 ? 0 : Math.max(1, locationStage);
  };

  // Send stage notification
  const sendStageNotification = async (newStage) => {
    const stageInfo = stages.find(s => s.id === newStage);
    const notificationId = `LocationStage${newStage}`;
    
    if (!wasCompletionEmailSent(notificationId)) {
      try {
        await sendCompletionEmail(notificationId, {
          stageName: stageInfo.name,
          currentDistance: currentDistance,
          completionTime: new Date().toLocaleString()
        });
      } catch (error) {
        console.error('Error sending stage completion notification:', error);
      }
    }
  };

  // Request location
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
        const distance = calculateDistance(userLat, userLng, targetCoords.lat, targetCoords.lng);
        const newStage = determineStage(distance, userLat, userLng);
        
        setCurrentDistance(distance);
        setHasLocationPermission(true);
        setPermissionDenied(false);
        setLastUpdate(new Date());
        
        if (newStage !== locationStage) {
          setLocationStage(newStage);
          localStorage.setItem('locationStage', newStage.toString());
          sendStageNotification(newStage);
          
          const event = new CustomEvent('localStorageUpdate');
          window.dispatchEvent(event);
        }
        
        localStorage.setItem('currentDistance', distance.toString());
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
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Handle password verification
  const handlePasswordSubmit = () => {
    if (password.toLowerCase() === 'treasure2024') {
      setPasswordVerified(true);
      setShowPasswordModal(false);
      localStorage.setItem('treasurePasswordVerified', 'true');
    } else {
      alert('Incorrect password. Try again!');
    }
  };

  // Format distance
  const formatDistance = (distance) => {
    if (distance === null) return '---';
    if (distance < 1) return `${Math.round(distance * 1000)}m`;
    return `${Math.round(distance)}km`;
  };

  // Calculate progress percentage based on current stage
  const calculateProgress = () => {
    if (locationStage === 0) return 0;
    
    // Progress runs from first marker to current stage marker
    const totalStages = stages.length - 1; // 6 total stage transitions
    const currentProgress = locationStage / totalStages;
    
    return Math.min(100, currentProgress * 100);
  };

  // Permission denied view
  if (permissionDenied) {
    return (
      <div className="location-tracker treasure-theme">
        <div className="permission-denied">
          <div className="treasure-icon">🗺️</div>
          <h3>Treasure Map Requires Location</h3>
          <p>Grant location access to track your journey to the Italian treasure.</p>
          <button className="permission-btn golden" onClick={() => { setPermissionDenied(false); requestLocationPermission(); }}>
            Enable Treasure Map
          </button>
        </div>
      </div>
    );
  }

  // Permission request view
  if (hasLocationPermission === null || hasLocationPermission === false) {
    return (
      <div className="location-tracker treasure-theme">
        <div className="permission-request">
          <div className="treasure-icon">🧭</div>
          <h3>Begin Treasure Hunt</h3>
          <p>Follow the ancient map from Home to the Italian treasure.</p>
          <p><strong>Destination:</strong> Lido Adriano, Italy</p>
          <button 
            className="permission-btn golden" 
            onClick={requestLocationPermission}
            disabled={isUpdating}
          >
            {isUpdating ? 'Reading Map...' : 'Start Treasure Hunt'}
          </button>
        </div>
      </div>
    );
  }

  const currentStage = stages.find(s => s.id === locationStage) || stages[0];
  const progress = calculateProgress();

  return (
    <div className="location-tracker treasure-theme">
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="password-modal">
          <div className="password-content">
            <h4>🔐 Final Treasure Coordinates</h4>
            <p>Enter the sacred password to reveal the exact treasure location:</p>
            <div className="password-input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="password-input"
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />
              <button onClick={handlePasswordSubmit} className="password-submit golden">
                Unlock
              </button>
            </div>
            <button onClick={() => setShowPasswordModal(false)} className="password-cancel">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="tracker-header">
        <h3>🗺️ Treasure Hunt Progress</h3>
        <div className="distance-display">
          <span className="distance-value">{formatDistance(currentDistance)}</span>
          <span className="distance-label">to treasure</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
          
          {/* Stage markers */}
          <div className="stage-markers">
            {stages.map((stage, index) => {
              const stageProgress = (index / (stages.length - 1)) * 100;
              const isCompleted = locationStage >= stage.id;
              const isCurrent = locationStage === stage.id;
              const showHint = activeHint === stage.id;
              
              return (
                <div 
                  key={stage.id}
                  className={`stage-marker ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${showHint ? 'show-hint' : ''}`}
                  style={{ left: `${stageProgress}%` }}
                  data-hint={stage.hint}
                >
                  <div className="marker-icon">{stage.icon}</div>
                  <div className="marker-name">{stage.name}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="progress-labels">
          <span>🏠 Home</span>
          <span>🏖️ Lido Adriano</span>
        </div>
      </div>

      {/* Current Stage Info */}
      <div className="current-stage-info">
        <div className="stage-card">
          <span className="stage-icon-large">{currentStage.icon}</span>
          <div className="stage-details">
            <h4>{currentStage.name}</h4>
            <p>Stage {currentStage.id} of 6</p>
          </div>
          <button 
            className={`update-btn ${showRefreshHint ? 'show-hint' : ''}`}
            onClick={requestLocationPermission}
            disabled={isUpdating}
            title="Update your location"
            data-hint="Tap to update location"
          >
            {isUpdating ? '⏳' : '🔄'}
          </button>
        </div>
      </div>

      {/* Hint Popup - removed, now using CSS ::after on markers */}

      {/* Final Coordinates */}
      {locationStage >= 6 && (
        <div className="treasure-coords">
          {passwordVerified ? (
            <div className="coords-revealed">
              <div className="coords-label">📍 Treasure Coordinates:</div>
              <div className="coords-text">44.424156, 12.304828</div>
              <div className="coords-location">Lido Adriano, Italy</div>
            </div>
          ) : (
            <div className="coords-locked">
              <div className="coords-label">🔐 Final Coordinates Locked</div>
              <button 
                className="reveal-coords-btn golden"
                onClick={() => setShowPasswordModal(true)}
              >
                Enter Sacred Password
              </button>
            </div>
          )}
        </div>
      )}

      {lastUpdate && (
        <div className="last-update">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default LocationTracker;