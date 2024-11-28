// SessionHandler.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function SessionHandler() {
  const router = useRouter();

  useEffect(() => {
    const checkSessionExpiry = () => {
      const isExpired = document.cookie.includes('session-expired=true');
      if (isExpired) {
        // Clear the expired cookie
        document.cookie = 'session-expired=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Reload the page or redirect to login
        router.push('/login');
      }
    };

    // Check on initial load and set up interval
    checkSessionExpiry();
    const intervalId = setInterval(checkSessionExpiry, 1000); // Check every second

    // Cleanup
    return () => clearInterval(intervalId);
  }, [router]);

  return null;
}