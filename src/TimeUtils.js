// Utility functions for time and date calculations

// Calculate days until the event
export const calculateDaysUntilEvent = () => {
  const now = new Date();
  const eventDate = new Date(now.getFullYear(), 6, 20); // July 20
  const timeLeft = eventDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)));
};

// Calculate progress percentage from start of year to event date
export const calculateProgressPercentage = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const eventDate = new Date(now.getFullYear(), 6, 20); // July 20
  
  const totalDays = Math.floor((eventDate - startOfYear) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
  
  return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
};

// Get glitch frequency based on days left - higher chance when further away
export const getGlitchFrequency = () => {
  const daysLeft = calculateDaysUntilEvent();
  
  if (daysLeft > 120) return 0.25;    // Very high early on (>4 months out)
  if (daysLeft > 90) return 0.20;     // Still high (3-4 months out)
  if (daysLeft > 60) return 0.15;     // Moderate (2-3 months out)
  if (daysLeft > 30) return 0.10;     // Less frequent (1-2 months out)
  if (daysLeft > 14) return 0.05;     // Sparse (2 weeks-1 month out)
  return 0.02;                        // Rare in final two weeks
};

// Get message appearance probability - higher when further away
export const getMessageAppearanceProbability = () => {
  const daysLeft = calculateDaysUntilEvent();
  
  if (daysLeft > 120) return 0.85;    // Very high early on (>4 months out)
  if (daysLeft > 90) return 0.75;     // Still high (3-4 months out)
  if (daysLeft > 60) return 0.65;     // Moderate (2-3 months out)
  if (daysLeft > 30) return 0.55;     // Less frequent (1-2 months out)
  if (daysLeft > 14) return 0.45;     // Sparse (2 weeks-1 month out)
  return 0.35;                        // Rare in final two weeks
};

// Get number of simultaneous messages to show based on days left
export const getSimultaneousMessageCount = () => {
  const daysLeft = calculateDaysUntilEvent();
  
  if (daysLeft > 120) return { min: 3, max: 5 };    // 3-5 messages (>4 months out)
  if (daysLeft > 90) return { min: 2, max: 4 };     // 2-4 messages (3-4 months out)
  if (daysLeft > 60) return { min: 2, max: 3 };     // 2-3 messages (2-3 months out)
  if (daysLeft > 30) return { min: 1, max: 3 };     // 1-3 messages (1-2 months out)
  if (daysLeft > 14) return { min: 1, max: 2 };     // 1-2 messages (2 weeks-1 month out)
  return { min: 1, max: 1 };                        // Just 1 message in final two weeks
};

// Calculate and check if the second challenge should be unlocked (4 months before event)
export const isSecondChallengeUnlocked = () => {
  return true;
};

// Calculate time remaining until second challenge unlocks
export const calculateTimeUntilSecondChallenge = () => {
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

// PIZZAIOLO CHALLENGE TIME UTILITIES

// Hard-coded release dates for each stage
// For testing purposes, we can set these closer to current date
// In production, these would be spaced weekly
// export const pizzaioloStageDates = {
//   // Set all dates to yesterday for testing
//   stage1: new Date(new Date().setDate(new Date().getDate() - 1)),
//   stage2: new Date(new Date().setDate(new Date().getDate() - 1)),
//   stage3: new Date(new Date().setDate(new Date().getDate() - 1)),
//   stage4: new Date(new Date().setDate(new Date().getDate() - 1)),
//   stage5: new Date(new Date().setDate(new Date().getDate() - 1))
// };

export const pizzaioloStageDates = {
  // Get current year to make this adaptable
  stage1: new Date(new Date().getFullYear(), 2, 19),  // March 1
  stage2: new Date(new Date().getFullYear(), 2, 27),  // March 8
  stage3: new Date(new Date().getFullYear(), 3, 4), // March 15
  stage4: new Date(new Date().getFullYear(), 3, 9), // March 22
  stage5: new Date(new Date().getFullYear(), 3, 16)  // March 29
};

// Check if a particular stage is available yet
export const isPizzaioloStageAvailable = (stageNumber) => {
  if (stageNumber < 1 || stageNumber > 5) return false;
  
  const now = new Date();
  const stageDateKey = `stage${stageNumber}`;
  
  // For stage 1, also check if pizzaiolo challenge is active
  if (stageNumber === 1) {
    const isPizzaioloActive = localStorage.getItem('pizzaioloChallengeActive') === 'true';
    return isPizzaioloActive && now >= pizzaioloStageDates[stageDateKey];
  }
  
  // For stages 2-5, also check if previous stage is completed
  return now >= pizzaioloStageDates[stageDateKey] && isPizzaioloStageComplete(stageNumber - 1);
};

// Mark stage as complete
export const markPizzaioloStageComplete = (stageNumber) => {
  if (stageNumber < 1 || stageNumber > 5) return;
  
  localStorage.setItem(`pizzaioloStage${stageNumber}Complete`, 'true');
  
  // If this is the final stage, mark the entire challenge as complete
  if (stageNumber === 5) {
    localStorage.setItem('pizzaioloChallengeComplete', 'true');
  }
};

// Check if a stage is completed
export const isPizzaioloStageComplete = (stageNumber) => {
  if (stageNumber < 1 || stageNumber > 5) return false;
  
  return localStorage.getItem(`pizzaioloStage${stageNumber}Complete`) === 'true';
};

// Get next available stage
export const getNextPizzaioloStage = () => {
  // First check for incomplete available stages
  for (let i = 1; i <= 5; i++) {
    if (!isPizzaioloStageComplete(i) && isPizzaioloStageAvailable(i)) {
      return i;
    }
  }
  
  // If all available stages are complete, check if there's an unavailable stage
  for (let i = 1; i <= 5; i++) {
    if (!isPizzaioloStageComplete(i)) {
      return i;
    }
  }
  
  // All stages complete
  return 6;
};

// Calculate time until next stage unlocks
export const getTimeUntilNextPizzaioloStage = () => {
  const nextStage = getNextPizzaioloStage();
  
  // If all stages complete or no next stage
  if (nextStage > 5) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  const now = new Date();
  const nextDate = pizzaioloStageDates[`stage${nextStage}`];
  
  // If stage is already available
  if (now >= nextDate && isPizzaioloStageAvailable(nextStage)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  // Calculate time difference
  const timeDiff = nextDate - now;
  
  // If negative, return zero (meaning it's available)
  if (timeDiff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};