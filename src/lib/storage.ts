// Local storage utilities for persistent authentication
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from './supabase';

const STORAGE_KEYS = {
  USER: 'contentgen_user',
  USER_PROFILE: 'contentgen_user_profile',
  SESSION: 'contentgen_session',
  LAST_SYNC: 'contentgen_last_sync',
} as const;

export interface StoredSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: SupabaseUser;
}

export interface StoredAuthState {
  user: SupabaseUser | null;
  userProfile: User | null;
  lastSync: number;
}

// Helper function to check if data is expired (24 hours)
const isExpired = (timestamp: number): boolean => {
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  return now - timestamp > twentyFourHours;
};

// Safe JSON parse with error handling
const safeJsonParse = <T>(data: string | null, fallback: T): T => {
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch (error) {
    console.warn('Failed to parse stored data:', error);
    return fallback;
  }
};

// Safe JSON stringify with error handling
const safeJsonStringify = (data: any): string | null => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.warn('Failed to stringify data:', error);
    return null;
  }
};

// User storage functions
export const saveUser = (user: SupabaseUser | null): void => {
  if (user) {
    const userData = safeJsonStringify(user);
    if (userData) {
      localStorage.setItem(STORAGE_KEYS.USER, userData);
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
    }
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
  }
};

export const getUser = (): SupabaseUser | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  
  if (!userData || !lastSync) return null;
  
  const lastSyncTime = parseInt(lastSync, 10);
  if (isExpired(lastSyncTime)) {
    console.log('Stored user data is expired, clearing...');
    clearUser();
    return null;
  }
  
  return safeJsonParse<SupabaseUser>(userData, null);
};

// User profile storage functions
export const saveUserProfile = (profile: User | null): void => {
  if (profile) {
    const profileData = safeJsonStringify(profile);
    if (profileData) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, profileData);
    }
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  }
};

export const getUserProfile = (): User | null => {
  const profileData = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  
  if (!profileData || !lastSync) return null;
  
  const lastSyncTime = parseInt(lastSync, 10);
  if (isExpired(lastSyncTime)) {
    console.log('Stored profile data is expired, clearing...');
    clearUserProfile();
    return null;
  }
  
  return safeJsonParse<User>(profileData, null);
};

// Session storage functions
export const saveSession = (session: StoredSession): void => {
  const sessionData = safeJsonStringify(session);
  if (sessionData) {
    localStorage.setItem(STORAGE_KEYS.SESSION, sessionData);
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
  }
};

export const getSession = (): StoredSession | null => {
  const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
  const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  
  if (!sessionData || !lastSync) return null;
  
  const lastSyncTime = parseInt(lastSync, 10);
  if (isExpired(lastSyncTime)) {
    console.log('Stored session data is expired, clearing...');
    clearSession();
    return null;
  }
  
  return safeJsonParse<StoredSession>(sessionData, null);
};

// Complete auth state storage
export const saveAuthState = (authState: StoredAuthState): void => {
  saveUser(authState.user);
  saveUserProfile(authState.userProfile);
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, authState.lastSync.toString());
};

export const getAuthState = (): StoredAuthState => {
  const user = getUser();
  const userProfile = getUserProfile();
  const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  
  return {
    user,
    userProfile,
    lastSync: lastSync ? parseInt(lastSync, 10) : 0,
  };
};

// Clear functions
export const clearUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
};

export const clearUserProfile = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
};

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

export const clearAll = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Check if we have valid stored auth data
export const hasValidStoredAuth = (): boolean => {
  const user = getUser();
  const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  
  if (!user || !lastSync) return false;
  
  const lastSyncTime = parseInt(lastSync, 10);
  return !isExpired(lastSyncTime);
};

// Force refresh stored data (useful when we know data is stale)
export const refreshStoredData = (): void => {
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
};
