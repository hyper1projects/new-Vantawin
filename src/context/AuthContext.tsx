"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client'; // Import your Supabase client

interface AuthContextType {
  session: Session | null;
  user: User | null;
  username: string | null;
  isLoading: boolean;
  signIn: (identifier: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, username: string, password: string) => Promise<{ data: { user: User | null } | null; error: any }>; // Changed phoneNumber to email
  signOut: () => Promise<{ error: any }>;
  // Removed verifyOtp and resendOtp as they are no longer used for email sign-up
  resetPasswordForEmail: (email: string) => Promise<{ error: any }>;
  fetchUserProfile: (userId: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        if (currentSession?.user) {
          const fetchedUsername = await fetchUserProfile(currentSession.user.id);
          setUsername(fetchedUsername);
        } else {
          setUsername(null);
        }
        setIsLoading(false);
      }
    );

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user || null);
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id).then(fetchedUsername => {
          setUsername(fetchedUsername);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    return data?.username || null;
  };

  const signIn = async (identifier: string, password: string) => {
    // Supabase signInWithPassword expects email and password
    // Assuming identifier is email for signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password: password,
    });
    if (error) {
      console.error('Sign In Error:', error);
    } else if (data.user) {
      const fetchedUsername = await fetchUserProfile(data.user.id);
      setUsername(fetchedUsername);
    }
    return { error };
  };

  const signUp = async (email: string, username: string, password: string) => { // Changed phoneNumber to email
    // Supabase signUp with email
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });
    if (error) {
      console.error('Sign Up Error:', error);
    }
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign Out Error:', error);
    } else {
      setSession(null);
      setUser(null);
      setUsername(null);
    }
    return { error };
  };

  // Removed verifyOtp and resendOtp functions

  const resetPasswordForEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`, // You might need a dedicated page for password reset
    });
    if (error) {
      console.error('Reset Password Error:', error);
    }
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        username,
        isLoading,
        signIn,
        signUp,
        signOut,
        // Removed verifyOtp and resendOtp from context value
        resetPasswordForEmail,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};