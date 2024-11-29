// utilities/loginAttempts.ts
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { app } from './firebase/config';

const firestore = getFirestore(app);

export interface LoginAttempt {
  attempts: number;
  lastAttempt: number;
  isLocked: boolean;
  lockUntil?: number;
}

export const LOGIN_ATTEMPT_LIMIT = 3;
export const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function trackLoginAttempt(username: string, success: boolean): Promise<{
  isLocked: boolean;
  remainingAttempts?: number;
  lockTimeRemaining?: number;
}> {
  const userRef = doc(firestore, 'loginAttempts', username);

  try {
    // Fetch current login attempt data
    const userDoc = await getDoc(userRef);
    const currentData: LoginAttempt = userDoc.exists() 
      ? userDoc.data() as LoginAttempt 
      : { attempts: 0, lastAttempt: 0, isLocked: false };

    // Check if account is currently locked
    if (currentData.isLocked && currentData.lockUntil && currentData.lockUntil > Date.now()) {
      const lockTimeRemaining = Math.ceil((currentData.lockUntil - Date.now()) / 1000);
      return {
        isLocked: true,
        lockTimeRemaining
      };
    }

    // If login is successful, reset attempts
    if (success) {
      await setDoc(userRef, {
        attempts: 0,
        lastAttempt: Date.now(),
        isLocked: false
      });
      return { isLocked: false };
    }

    // Track failed login attempts
    const newAttempts = (currentData.attempts || 0) + 1;
    const updateData: LoginAttempt = {
      attempts: newAttempts,
      lastAttempt: Date.now(),
      isLocked: newAttempts >= LOGIN_ATTEMPT_LIMIT,
      ...(newAttempts >= LOGIN_ATTEMPT_LIMIT && { lockUntil: Date.now() + LOCK_DURATION })
    };

    // Update login attempts in Firestore
    await setDoc(userRef, updateData);

    // Return remaining attempts or lock status
    if (newAttempts >= LOGIN_ATTEMPT_LIMIT) {
      return {
        isLocked: true,
        lockTimeRemaining: LOCK_DURATION / 1000
      };
    }

    return {
      isLocked: false,
      remainingAttempts: LOGIN_ATTEMPT_LIMIT - newAttempts
    };
  } catch (error) {
    console.error('Error tracking login attempts:', error);
    return { isLocked: false };
  }
}

export async function checkLoginAttempts(username: string): Promise<{
  isLocked: boolean;
  remainingAttempts?: number;
  lockTimeRemaining?: number;
}> {
  const userRef = doc(firestore, 'loginAttempts', username);

  try {
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { isLocked: false };
    }

    const loginData = userDoc.data() as LoginAttempt;

    // Check if account is locked
    if (loginData.isLocked && loginData.lockUntil && loginData.lockUntil > Date.now()) {
      const lockTimeRemaining = Math.ceil((loginData.lockUntil - Date.now()) / 1000);
      return {
        isLocked: true,
        lockTimeRemaining
      };
    }

    // Return remaining attempts
    return {
      isLocked: false,
      remainingAttempts: Math.max(LOGIN_ATTEMPT_LIMIT - (loginData.attempts || 0), 0)
    };
  } catch (error) {
    console.error('Error checking login attempts:', error);
    return { isLocked: false };
  }
}