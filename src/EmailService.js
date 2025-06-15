// This service handles email notifications using Formspree
// With subtle visitor identification

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mwpvdzjp';

// Get device information to subtly identify the visitor
const getVisitorFingerprint = () => {
  try {
    // Generate a persistent visitor ID if not already present
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
      localStorage.setItem('visitor_id', visitorId);
    }

    // Collect non-intrusive device information
    return {
      id: visitorId,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.language,
      platform: navigator.platform,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      userAgent: navigator.userAgent,
      visitTime: new Date().toISOString(),
      referrer: document.referrer || 'direct'
    };
  } catch (error) {
    console.error("Error getting visitor information:", error);
    return { id: "unknown", timeZone: "unknown", visitTime: new Date().toISOString() };
  }
};

// Log a completion event to localStorage for weekly summaries
const logCompletionEvent = (challenge, details) => {
  try {
    const history = JSON.parse(localStorage.getItem('completionHistory') || '[]');
    history.push({
      challenge,
      details,
      visitor: getVisitorFingerprint().id,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('completionHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error logging completion event:', error);
  }
};

// Send completion notification and record it
export const sendCompletionEmail = async (challenge, details = {}) => {
  // Check if already sent to prevent duplicate emails
  const sentKey = `completionEmailSent_${challenge}`;
  if (localStorage.getItem(sentKey) === 'true') {
    console.log(`Email for ${challenge} already sent, preventing duplicate`);
    return { success: true, alreadySent: true };
  }

  // Log the completion for weekly summaries
  logCompletionEvent(challenge, details);

  try {
    // Get visitor fingerprint without asking for personal info
    const visitorInfo = getVisitorFingerprint();
    
    // Using Formspree
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'mdziedzic97@gmail.com',
        subject: `${challenge} Challenge Completed!`,
        message: `Someone has completed the ${challenge} challenge!`,
        visitorInfo: visitorInfo,
        challengeDetails: JSON.stringify(details, null, 2),
        completedAt: new Date().toLocaleString()
      })
    });
    
    if (response.ok) {
      localStorage.setItem(sentKey, 'true');
      console.log(`Success! Completion notification sent for ${challenge}`);
      return { success: true };
    }
    
    console.error('Failed to send notification:', await response.text());
    return { 
      success: false, 
      error: `Failed to send notification: ${response.status} ${response.statusText}` 
    };
  } catch (error) {
    console.error('Error sending completion notification:', error);
    return { success: false, error: error.message };
  }
};

// Check if completion notification was already sent
export const wasCompletionEmailSent = (challenge) => {
  const sentKey = `completionEmailSent_${challenge}`;
  return localStorage.getItem(sentKey) === 'true';
};

// Reset notification status (for testing)
export const resetEmailNotificationStatus = (challenge) => {
  const sentKey = `completionEmailSent_${challenge}`;
  localStorage.removeItem(sentKey);
  console.log(`Reset notification status for ${challenge}`);
};

// Send a weekly summary email with a list of completion events
export const sendWeeklySummaryEmail = async (events, startDate, endDate) => {
  try {
    const visitorInfo = getVisitorFingerprint();
    const summaryLines = events.map(ev => `- ${ev.challenge} by ${ev.visitor} at ${new Date(ev.timestamp).toLocaleString()}`);
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'mdziedzic97@gmail.com',
        subject: 'Weekly Challenge Summary',
        message: `Completions from ${startDate} to ${endDate}:\n\n${summaryLines.join('\n')}`,
        visitorInfo,
        events
      })
    });

    if (response.ok) {
      console.log('Weekly summary email sent');
      return { success: true };
    }

    console.error('Failed to send weekly summary:', await response.text());
    return { success: false };
  } catch (error) {
    console.error('Error sending weekly summary:', error);
    return { success: false };
  }
};

// Export named functions directly instead of using a default export
