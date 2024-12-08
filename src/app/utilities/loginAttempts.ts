// utilities/loginAttempts.ts
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { app } from './firebase/config';

const firestore = getFirestore(app);

export interface LoginAttempt {
  attempts: number;
  lastAttempt: number;
  isLocked: boolean;
  lockUntil?: number;
  userName: string; // New field to store username
}

export const LOGIN_ATTEMPT_LIMIT = 3;
export const LOCK_DURATION = 3 * 60 * 1000; // 5 minutes in milliseconds

export async function trackLoginAttempt(username: string, success: boolean): Promise<{
  isLocked: boolean;
  remainingAttempts?: number;
  lockTimeRemaining?: number;
}> {
  const userRef = doc(firestore, 'loginAttempts', username);
  const historyRef = collection(firestore, 'loginHistory'); // New collection for login history

  try {
    const userDoc = await getDoc(userRef);
    const currentData: LoginAttempt = userDoc.exists()
      ? (userDoc.data() as LoginAttempt)
      : { attempts: 0, lastAttempt: 0, isLocked: false, userName: username };

    const now = Date.now();

    // Log the attempt in the new collection
    await addDoc(historyRef, {
      userName: username,
      success,
      timestamp: now,
      reason: success
        ? 'Login successful'
        : currentData.isLocked
        ? 'Account locked'
        : 'Invalid credentials',
    });

    // Existing logic for tracking attempts
    if (currentData.isLocked && currentData.lockUntil && currentData.lockUntil > now) {
      const lockTimeRemaining = Math.ceil((currentData.lockUntil - now) / 1000);
      return { isLocked: true, lockTimeRemaining };
    }

    if (success) {
      await setDoc(userRef, {
        attempts: 0,
        lastAttempt: now,
        isLocked: false,
        userName: username,
      });
      return { isLocked: false };
    }

    const newAttempts = currentData.attempts + 1;
    const updateData: LoginAttempt = {
      attempts: newAttempts,
      lastAttempt: now,
      isLocked: newAttempts >= LOGIN_ATTEMPT_LIMIT,
      ...(newAttempts >= LOGIN_ATTEMPT_LIMIT && { lockUntil: now + LOCK_DURATION }),
      userName: username,
    };

    await setDoc(userRef, updateData, { merge: true });

    if (newAttempts >= LOGIN_ATTEMPT_LIMIT) {
      return { isLocked: true, lockTimeRemaining: LOCK_DURATION / 1000 };
    }

    return { isLocked: false, remainingAttempts: LOGIN_ATTEMPT_LIMIT - newAttempts };
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
      return { 
        isLocked: false,
        remainingAttempts: LOGIN_ATTEMPT_LIMIT 
      };
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
      remainingAttempts: Math.max(LOGIN_ATTEMPT_LIMIT - loginData.attempts, 0)
    };
  } catch (error) {
    console.error('Error checking login attempts:', error);
    return { 
      isLocked: false,
      remainingAttempts: LOGIN_ATTEMPT_LIMIT 
    };
  }
}