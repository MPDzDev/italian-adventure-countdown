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