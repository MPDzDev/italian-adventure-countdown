import React, { useState, useEffect } from 'react';
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

  // Simplified stage definitions
  const stages = [
    { id: 0, name: 'Home', threshold: Infinity, icon: '🏠' },
    { id: 1, name: 'Journey Started', threshold: 1400, icon: '✈️' },
    { id: 2, name: 'In Italy', threshold: 200, icon: '🇮🇹' },
    { id: 3, name: 'Bologna Region', threshold: 100, icon: '🏛️' },
    { id: 4, name: 'Adriatic Coast', threshold: 50, icon: '🌊' },
    { id: 5, name: 'Lido Adriano', threshold: 10, icon: '🏖️' },
    { id: 6, name: 'Treasure Found!', threshold: 0, icon: '💎' }
  ];

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

  // Get current stage
  const getCurrentStage = () => stages.find(s => s.id === locationStage) || stages[0];

  // Permission denied view
  if (permissionDenied) {
    return (
      <div className="location-tracker compact">
        <div className="permission-denied compact">
          <h3>🌍 Journey Tracker</h3>
          <p>Location access required to track your journey to Italy.</p>
          <button className="permission-btn" onClick={() => { setPermissionDenied(false); requestLocationPermission(); }}>
            Enable Location
          </button>
        </div>
      </div>
    );
  }

  // Permission request view
  if (hasLocationPermission === null || hasLocationPermission === false) {
    return (
      <div className="location-tracker compact">
        <div className="permission-request compact">
          <h3>🌍 Journey to Italy</h3>
          <p>Track your progress from Bedford to the treasure location.</p>
          <p><strong>Destination:</strong> Lido Adriano, Italy</p>
          <button 
            className="permission-btn" 
            onClick={requestLocationPermission}
            disabled={isUpdating}
          >
            {isUpdating ? 'Getting Location...' : 'Start Tracking'}
          </button>
        </div>
      </div>
    );
  }

  const currentStage = getCurrentStage();

  return (
    <div className="location-tracker compact">
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="password-modal">
          <div className="password-content">
            <h4>🔒 Final Coordinates</h4>
            <p>Enter the treasure password to reveal the exact location:</p>
            <div className="password-input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="password-input"
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />
              <button onClick={handlePasswordSubmit} className="password-submit">
                Enter
              </button>
            </div>
            <button onClick={() => setShowPasswordModal(false)} className="password-cancel">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="compact-header">
        <h3>🌍 Journey Tracker</h3>
      </div>

      <div className="compact-status">
        <div className="distance-section">
          <div className="distance-display">
            <div className="distance-value">{formatDistance(currentDistance)}</div>
            <div className="distance-label">to treasure</div>
            <button 
              className="refresh-btn"
              onClick={requestLocationPermission}
              disabled={isUpdating}
              title="Update location"
            >
              {isUpdating ? '⏳' : '🔄'}
            </button>
          </div>
        </div>

        <div className="stage-section">
          <div className="current-stage-compact">
            <span className="stage-icon">{currentStage.icon}</span>
            <div className="stage-info">
              <div className="stage-name">{currentStage.name}</div>
              <div className="stage-number">Stage {currentStage.id}/6</div>
            </div>
          </div>
        </div>

        {/* Show coordinates for final stage with password protection */}
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
                <div className="coords-label">🔒 Final Coordinates:</div>
                <button 
                  className="reveal-coords-btn"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Enter Password to Reveal
                </button>
              </div>
            )}
          </div>
        )}

        {lastUpdate && (
          <div className="last-update">
            Updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationTracker;