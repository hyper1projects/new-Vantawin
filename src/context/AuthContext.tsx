"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { isTelegramEnvironment, getTelegramUser, type TelegramUser } from '../utils/telegram';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  mobileNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  avatarUrl: string | null;
  isLoading: boolean;
  isTelegram: boolean;
  telegramUser: TelegramUser | null;
  telegramId: number | null;
  signIn: (identifier: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, username: string, password: string) => Promise<{ data: { user: User | null } | null; error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: any }>;
  fetchUserProfile: (userId: string) => Promise<{ username: string | null; firstName: string | null; lastName: string | null; mobileNumber: string | null; dateOfBirth: string | null; gender: string | null; avatarUrl: string | null; telegramId: number | null }>;
  updateUserProfile: (userId: string, updates: { username?: string; first_name?: string; last_name?: string; mobile_number?: string; date_of_birth?: string; gender?: string; avatar_url?: string; telegram_id?: number }) => Promise<{ error: any }>;
  signInWithTelegram: () => Promise<void>;
  setUserState: (profile: { username: string | null; firstName: string | null; lastName: string | null; mobileNumber: string | null; dateOfBirth: string | null; gender: string | null; avatarUrl: string | null; telegramId: number | null } | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTelegram, setIsTelegram] = useState(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const navigate = useNavigate();

  const setUserState = (profile: { username: string | null; firstName: string | null; lastName: string | null; mobileNumber: string | null; dateOfBirth: string | null; gender: string | null; avatarUrl: string | null; telegramId: number | null } | null) => {
    setUsername(profile?.username || null);
    setFirstName(profile?.firstName || null);
    setLastName(profile?.lastName || null);
    setMobileNumber(profile?.mobileNumber || null);
    setDateOfBirth(profile?.dateOfBirth || null);
    setGender(profile?.gender || null);
    setAvatarUrl(profile?.avatarUrl || null);
    setTelegramId(profile?.telegramId || null);
  };

  const fetchUserProfile = async (userId: string): Promise<{ username: string | null; firstName: string | null; lastName: string | null; mobileNumber: string | null; dateOfBirth: string | null; gender: string | null; avatarUrl: string | null; telegramId: number | null }> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, first_name, last_name, mobile_number, date_of_birth, gender, avatar_url, telegram_id')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return { username: null, firstName: null, lastName: null, mobileNumber: null, dateOfBirth: null, gender: null, avatarUrl: null, telegramId: null };
    }
    return {
      username: data?.username || null,
      firstName: data?.first_name || null,
      lastName: data?.last_name || null,
      mobileNumber: data?.mobile_number || null,
      dateOfBirth: data?.date_of_birth || null,
      gender: data?.gender || null,
      avatarUrl: data?.avatar_url || null,
      telegramId: data?.telegram_id || null,
    };
  };

  const signInWithTelegram = async () => {
    console.log('Attempting to sign in with Telegram...');
    const tgUser = getTelegramUser();
    if (!tgUser) {
      console.log('No Telegram user found during sign in.');
      setIsLoading(false);
      return;
    }

    setTelegramUser(tgUser);

    const email = `${tgUser.id}@telegram.user`;
    const password = `telegram_${tgUser.id}`;

    let { data: userData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (signInError && signInError.message.includes('Invalid login credentials')) {
      console.log('Telegram user not found in Supabase, attempting to sign up...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: tgUser.username,
            first_name: tgUser.firstName,
            last_name: tgUser.lastName,
            avatar_url: tgUser.photoUrl,
            telegram_id: tgUser.id,
          },
        },
      });

      if (signUpError) {
        console.error('Error signing up user with Telegram:', signUpError);
        setIsLoading(false);
        return;
      }

      userData = signUpData;
    } else if (signInError) {
      console.error('Error signing in user with Telegram:', signInError);
      setIsLoading(false);
      return;
    }

    setSession(userData?.session || null);
    setUser(userData?.user || null);

    if (userData?.user && tgUser) {
      // Ensure profile exists and is updated with Telegram data
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.user.id,
          username: tgUser.username || userData.user.user_metadata.username, // Use Telegram username or existing metadata
          first_name: tgUser.firstName,
          last_name: tgUser.lastName,
          avatar_url: tgUser.photoUrl,
          telegram_id: tgUser.id,
        }, { onConflict: 'id' }); // Upsert based on user ID

      if (upsertError) {
        console.error('Error upserting Telegram user profile:', upsertError);
      }

      const profile = await fetchUserProfile(userData.user.id);
      setUserState(profile);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const telegramEnv = isTelegramEnvironment();
    console.log('Is Telegram Environment:', telegramEnv);
    setIsTelegram(telegramEnv);

    if (telegramEnv) {
      // Notify Telegram that the app is ready
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        try {
          window.Telegram.WebApp.expand();
        } catch (e) {
          console.error('Failed to expand Telegram WebApp:', e);
        }
      }

      const tgUser = getTelegramUser();
      console.log('Telegram User:', tgUser);
      setTelegramUser(tgUser);
      signInWithTelegram();
    } else {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          if (currentSession?.user) {
            const profile = await fetchUserProfile(currentSession.user.id);
            setUserState(profile);
          } else {
            setUserState(null);
          }
          setIsLoading(false);
        }
      );

      supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
        setSession(initialSession);
        setUser(initialSession?.user || null);
        if (initialSession?.user) {
          const profile = await fetchUserProfile(initialSession.user.id);
          setUserState(profile);
        }
        setIsLoading(false);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const updateUserProfile = async (userId: string, updates: { username?: string; first_name?: string; last_name?: string; mobile_number?: string; date_of_birth?: string; gender?: string; avatar_url?: string; telegram_id?: number }) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (!error) {
      const profile = await fetchUserProfile(userId);
      setUserState(profile);
    } else {
      console.error('Error updating user profile:', error);
    }
    return { error };
  };

  const signIn = async (identifier: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password: password,
    });
    if (error) {
      console.error('Sign In Error:', error);
    } else if (data.user) {
      const profile = await fetchUserProfile(data.user.id);
      setUserState(profile);
    }
    return { error };
  };

  const signUp = async (email: string, username: string, password: string) => {
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
    } else if (data.user && !data.user.confirmed_at) {
      navigate('/email-confirmation');
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
      setUserState(null);
    }
    return { error };
  };

  const resetPasswordForEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
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
        firstName,
        lastName,
        mobileNumber,
        dateOfBirth,
        gender,
        avatarUrl,
        isLoading,
        isTelegram,
        telegramUser,
        telegramId,
        signIn,
        signUp,
        signOut,
        resetPasswordForEmail,
        fetchUserProfile,
        updateUserProfile,
        signInWithTelegram,
        setUserState,
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