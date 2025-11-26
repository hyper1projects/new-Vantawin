"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

export interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  photoUrl?: string;
  allowsWriteToPm?: boolean;
}

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
  displayName: string;
  signIn: (identifier: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, username: string, password: string) => Promise<{ data: { user: User | null } | null; error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: any }>;
  fetchUserProfile: (userId: string) => Promise<{ username: string | null; firstName: string | null; lastName: string | null; mobileNumber: string | null; dateOfBirth: string | null; gender: string | null; avatarUrl: string | null; telegramId: number | null }>;
  updateUserProfile: (userId: string, updates: { username?: string; first_name?: string; last_name?: string; mobile_number?: string; date_of_birth?: string; gender?: string; avatar_url?: string; telegram_id?: number }) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
AuthContext.displayName = 'AuthContext';

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
  const [displayName, setDisplayName] = useState<string>('Guest');
  const navigate = useNavigate();

  const [initData, setInitData] = useState<any>(undefined);
  const [webApp, setWebApp] = useState<any>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const app = (window as any).Telegram.WebApp;
      setWebApp(app);
      try {
        const { initData } = retrieveLaunchParams();
        setInitData(initData);
      } catch (e) {
        console.error('Error retrieving launch params:', e);
        setInitData(app.initDataUnsafe);
      }
    } else {
      setInitData(null);
      setWebApp(null);
    }
  }, []);

  const setUserState = (profile: { username: string | null; firstName: string | null; lastName: string | null; mobileNumber: string | null; dateOfBirth: string | null; gender: string | null; avatarUrl: string | null; telegramId: number | null } | null) => {
    setUsername(profile?.username || null);
    setFirstName(profile?.firstName || null);
    setLastName(profile?.lastName || null);
    setMobileNumber(profile?.mobileNumber || null);
    setDateOfBirth(profile?.dateOfBirth || null);
    setGender(profile?.gender || null);
    setAvatarUrl(profile?.avatarUrl || null);
    setTelegramId(profile?.telegramId || null);

    if (!isTelegram) {
      setDisplayName(profile?.username || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'Guest');
    }
  };

  const fetchUserProfile = async (userId: string): Promise<{ username: string | null; firstName: string | null; lastName: string | null; mobileNumber: string | null; dateOfBirth: string | null; gender: string | null; avatarUrl: string | null; telegramId: number | null }> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, first_name, last_name, mobile_number, date_of_birth, gender, avatar_url, telegram_id')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore 'PGRST116' (no rows found)
      console.error('Error fetching user profile:', error);
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

  const signInWithTelegram = async (tgUser: TelegramUser) => {
    const email = `${tgUser.id}@telegram.user`;
    const password = `telegram_${tgUser.id}`;

    let { data: userData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError && signInError.message.includes('Invalid login credentials')) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
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
        console.error('Error signing up Telegram user:', signUpError);
        setIsLoading(false);
        return;
      }
      userData = signUpData;
    } else if (signInError) {
      console.error('Error signing in Telegram user:', signInError);
      setIsLoading(false);
      return;
    }

    setSession(userData?.session || null);
    setUser(userData?.user || null);

    if (userData?.user) {
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.user.id,
          username: tgUser.username || userData.user.user_metadata.username,
          first_name: tgUser.firstName,
          last_name: tgUser.lastName,
          avatar_url: tgUser.photoUrl,
          telegram_id: tgUser.id,
        }, { onConflict: 'id' });

      if (upsertError) console.error('Error upserting Telegram profile:', upsertError);

      const profile = await fetchUserProfile(userData.user.id);
      setUserState(profile);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (initData === undefined) {
      setIsLoading(true);
      return;
    }

    if (initData && initData.user) {
      setIsTelegram(true);
      if (webApp) { // Check if webApp is available
        webApp.ready();
        webApp.expand();
      }

      const tgUser: TelegramUser = {
        id: initData.user.id,
        firstName: initData.user.firstName,
        lastName: initData.user.lastName,
        username: initData.user.username,
        languageCode: initData.user.languageCode,
        isPremium: initData.user.isPremium,
        photoUrl: initData.user.photoUrl,
        allowsWriteToPm: initData.user.allowsWriteToPm,
      };
      setTelegramUser(tgUser);

      if (tgUser.username) setDisplayName(`@${tgUser.username}`);
      else setDisplayName(tgUser.lastName ? `${tgUser.firstName} ${tgUser.lastName}` : tgUser.firstName);

      signInWithTelegram(tgUser);
    } else {
      setIsTelegram(false);
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_, currentSession) => {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          if (currentSession?.user) {
            const profile = await fetchUserProfile(currentSession.user.id);
            setUserState(profile);
          } else {
            setUserState(null);
            setDisplayName('Guest');
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
        } else {
          setDisplayName('Guest');
        }
        setIsLoading(false);
      });

      return () => authListener.subscription.unsubscribe();
    }
  }, [initData, webApp]);

  const updateUserProfile = async (userId: string, updates: any) => {
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    if (!error) {
      const profile = await fetchUserProfile(userId);
      setUserState(profile);
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, username: string, password: string) => {
    return supabase.auth.signUp({ email, password, options: { data: { username } } });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  const resetPasswordForEmail = async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/update-password` });
  };

  const value = {
    session, user, username, firstName, lastName, mobileNumber, dateOfBirth, gender, avatarUrl,
    isLoading, isTelegram, telegramUser, telegramId, displayName,
    signIn, signUp, signOut, resetPasswordForEmail, fetchUserProfile, updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};