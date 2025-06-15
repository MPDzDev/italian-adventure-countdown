import { sendWeeklySummaryEmail } from './EmailService';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const checkAndSendWeeklySummary = async () => {
  try {
    const now = new Date();
    const lastSent = localStorage.getItem('lastWeeklySummarySent');
    const lastDate = lastSent ? new Date(lastSent) : null;
    if (lastDate && now - lastDate < ONE_WEEK_MS) {
      return;
    }

    const history = JSON.parse(localStorage.getItem('completionHistory') || '[]');
    const weekStart = new Date(now.getTime() - ONE_WEEK_MS);
    const events = history.filter(e => new Date(e.timestamp) >= weekStart);
    if (events.length === 0) {
      localStorage.setItem('lastWeeklySummarySent', now.toISOString());
      return;
    }

    await sendWeeklySummaryEmail(
      events,
      weekStart.toLocaleDateString(),
      now.toLocaleDateString()
    );
    localStorage.setItem('lastWeeklySummarySent', now.toISOString());
  } catch (error) {
    console.error('Error in weekly summary service:', error);
  }
};

