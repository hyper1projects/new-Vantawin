"use client";

import { retrieveLaunchParams } from '@telegram-apps/sdk';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            photo_url?: string;
            allows_write_to_pm?: boolean;
          };
          [key: string]: any;
        };
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

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

export function isTelegramEnvironment(): boolean {
  // Check window.Telegram.WebApp first as it's the most direct way
  // Check for WebApp existence, not just initData (which might be empty in dev/test)
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    console.log('Telegram WebApp detected via window.Telegram.WebApp');
    console.log('initData:', window.Telegram.WebApp.initData);
    console.log('initDataUnsafe:', window.Telegram.WebApp.initDataUnsafe);
    return true;
  }

  try {
    const params = retrieveLaunchParams();
    console.log('Telegram params from SDK:', params);
    return !!params.initData;
  } catch (error) {
    console.log('Not in Telegram environment, error:', error);
    return false;
  }
}

export function getTelegramUser(): TelegramUser | null {
  console.log('getTelegramUser() called');

  // Try getting user from window.Telegram.WebApp first
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    console.log('Got Telegram user from window.Telegram.WebApp.initDataUnsafe:', user);
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      languageCode: user.language_code,
      isPremium: user.is_premium,
      photoUrl: user.photo_url,
      allowsWriteToPm: user.allows_write_to_pm,
    };
  }

  console.log('No user in window.Telegram.WebApp.initDataUnsafe, checking SDK...');

  // If not from window.Telegram.WebApp, try SDK's retrieveLaunchParams
  try {
    const { user: sdkUser } = retrieveLaunchParams(); // Directly get user from SDK
    if (!sdkUser) {
      console.log('No user in SDK launch params');
      return null;
    }

    console.log('Got user from SDK launch params:', sdkUser);
    return {
      id: sdkUser.id,
      firstName: sdkUser.first_name,
      lastName: sdkUser.last_name,
      username: sdkUser.username,
      languageCode: sdkUser.language_code,
      isPremium: sdkUser.is_premium,
      photoUrl: sdkUser.photo_url,
      allowsWriteToPm: sdkUser.allows_write_to_pm,
    };
  } catch (error) {
    console.error('Error getting Telegram user from SDK:', error);
    return null;
  }
}

export function getTelegramInitData(): string | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData) {
    return window.Telegram.WebApp.initData;
  }

  if (!isTelegramEnvironment()) {
    return null;
  }

  try {
    const { initDataRaw } = retrieveLaunchParams();
    return (initDataRaw as string) || null;
  } catch (error) {
    console.error('Error getting Telegram init data:', error);
    return null;
  }
}

export function getTelegramDisplayName(user: TelegramUser | null): string {
  if (!user) return 'Guest';

  if (user.username) {
    return `@${user.username}`;
  }

  return user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName;
}