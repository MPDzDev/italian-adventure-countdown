import { useEffect } from 'react';
import { APP_VERSION } from './version';

const VERSION_URL = '/version.json';

export default function useVersionCheck() {
  useEffect(() => {
    let cancelled = false;

    const checkVersion = async () => {
      try {
        const resp = await fetch(VERSION_URL, { cache: 'no-cache' });
        const data = await resp.json();
        if (!cancelled && data.version && data.version !== APP_VERSION) {
          window.location.reload();
        }
      } catch (err) {
        console.error('Version check failed', err);
      }
    };

    const handleVisibility = () => {
      if (!document.hidden) {
        checkVersion();
      }
    };

    const interval = setInterval(checkVersion, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', handleVisibility);
    checkVersion();

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);
}
