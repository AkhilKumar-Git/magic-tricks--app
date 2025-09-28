import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { supabase, User } from '../lib/supabase';
import { 
  saveUser, 
  getUser, 
  saveUserProfile, 
  getUserProfile, 
  saveAuthState, 
  getAuthState, 
  clearAll, 
  hasValidStoredAuth,
  refreshStoredData 
} from '../lib/storage';

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string, bio?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: Error | null }>;
  retryProfileCreation: () => Promise<void>;
  redirectAfterLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize auth state from local storage first for faster loading
  useEffect(() => {
    let isInitialized = false;
    let timeoutId: NodeJS.Timeout;

    // Set a maximum timeout to prevent infinite loading
    const maxTimeout = setTimeout(() => {
      if (!isInitialized) {
        console.warn('Auth initialization timeout, forcing loading to false');
        setLoading(false);
        isInitialized = true;
      }
    }, 10000); // 10 second timeout

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // First, try to restore from local storage for immediate UI response
        if (hasValidStoredAuth()) {
          const storedAuth = getAuthState();
          setUser(storedAuth.user);
          setUserProfile(storedAuth.userProfile);
          console.log('Restored auth state from local storage');
          // Set loading to false immediately for better UX
          setLoading(false);
          isInitialized = true;
          clearTimeout(maxTimeout);
        }

        // Then verify with Supabase and sync if needed
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(`Authentication error: ${error.message}`);
          // If there's an error, clear local storage and show login
          clearAll();
          setUser(null);
          setUserProfile(null);
          if (!isInitialized) {
            setLoading(false);
            isInitialized = true;
            clearTimeout(maxTimeout);
          }
          return;
        }

        if (session?.user) {
          // Update local storage with fresh data
          saveUser(session.user);
          setUser(session.user);
          
          // Fetch and save user profile (don't await to avoid blocking)
          fetchUserProfile(session.user.id).catch(error => {
            console.error('Error fetching user profile during init:', error);
            // Don't set loading to false here as it might be set elsewhere
          });
        } else {
          // No session, clear everything
          clearAll();
          setUser(null);
          setUserProfile(null);
        }
        
        if (!isInitialized) {
          setLoading(false);
          isInitialized = true;
          clearTimeout(maxTimeout);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(`Initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // On error, clear everything and show login
        clearAll();
        setUser(null);
        setUserProfile(null);
        if (!isInitialized) {
          setLoading(false);
          isInitialized = true;
          clearTimeout(maxTimeout);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes (but don't interfere with initial loading)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        // Only handle auth changes after initial load
        if (isInitialized) {
          if (session?.user) {
            saveUser(session.user);
            setUser(session.user);
            // Fetch profile in background
            fetchUserProfile(session.user.id).catch(error => {
              console.error('Error fetching user profile on auth change:', error);
            });
          } else {
            // User signed out, clear everything
            clearAll();
            setUser(null);
            setUserProfile(null);
          }
        }
      }
    );

    return () => {
      clearTimeout(maxTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // If user profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('User profile not found, creating new profile...');
          await createUserProfile(userId);
        }
      } else {
        setUserProfile(data);
        saveUserProfile(data);
        console.log('User profile fetched and saved to local storage');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    // Don't set loading to false here - let the main auth flow handle it
  };

  const createUserProfile = async (userId: string, retryCount = 0) => {
    try {
      // Get user data from auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Error getting authenticated user:', authError);
        return;
      }
      
      if (!authUser) {
        console.error('No authenticated user found');
        return;
      }

      console.log('Creating user profile for:', userId, 'with email:', authUser.email);

      // Create user profile with basic info
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            email: authUser.email || '',
            profile: '',
            bio: authUser.user_metadata?.bio || '',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // If it's a permission error and we haven't retried yet, wait a bit and try again
        if ((error.code === '42501' || error.message.includes('permission')) && retryCount < 2) {
          console.log('Permission error, retrying in 2 seconds...');
          setTimeout(() => {
            createUserProfile(userId, retryCount + 1);
          }, 2000);
        } else {
          // If all retries failed, create a temporary profile for the user to continue using the app
          console.log('Creating temporary user profile due to database error');
          const tempProfile: User = {
            id: userId,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            email: authUser.email || '',
            profile: '',
            bio: authUser.user_metadata?.bio || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUserProfile(tempProfile);
          saveUserProfile(tempProfile);
        }
      } else {
        setUserProfile(data);
        saveUserProfile(data);
        console.log('User profile created successfully and saved to local storage:', data);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      // Create a temporary profile even on error to prevent loading loops
      const tempProfile: User = {
        id: userId,
        name: authUser?.user_metadata?.name || authUser?.email?.split('@')[0] || 'User',
        email: authUser?.email || '',
        profile: '',
        bio: authUser?.user_metadata?.bio || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUserProfile(tempProfile);
      saveUserProfile(tempProfile);
    }
  };

  const signUp = async (email: string, password: string, name: string, bio: string = '') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          bio,
        },
      },
    });

    // Note: User profile will be created automatically when user confirms email and signs in
    // This is handled in the createUserProfile function called from fetchUserProfile

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    clearAll();
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (!error && userProfile) {
        const updatedProfile = { ...userProfile, ...updates };
        setUserProfile(updatedProfile);
        saveUserProfile(updatedProfile);
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const retryProfileCreation = async () => {
    if (!user) {
      console.error('No user logged in to retry profile creation');
      return;
    }
    
    console.log('Retrying profile creation for user:', user.id);
    await createUserProfile(user.id);
  };

  const redirectAfterLogin = () => {
    if (user) {
      navigate('/magic-tricks');
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    retryProfileCreation,
    redirectAfterLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
