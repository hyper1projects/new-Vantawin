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
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData) {
    return true;
  }

  try {
    const params = retrieveLaunchParams();
    return !!params.initData;
  } catch {
    return false;
  }
}

export function getTelegramUser(): TelegramUser | null {
  // Try getting user from window.Telegram.WebApp first
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
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

  if (!isTelegramEnvironment()) {
    return null;
  }

  try {
    const { initData } = retrieveLaunchParams();
    const data = initData as any;

    if (!data?.user) {
      return null;
    }

    return {
      id: data.user.id,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      username: data.user.username,
      languageCode: data.user.languageCode,
      isPremium: data.user.isPremium,
      photoUrl: data.user.photoUrl,
      allowsWriteToPm: data.user.allowsWriteToPm,
    };
  } catch (error) {
    console.error('Error getting Telegram user:', error);
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
