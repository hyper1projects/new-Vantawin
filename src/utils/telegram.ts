import { retrieveLaunchParams } from '@telegram-apps/sdk';

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
  try {
    const params = retrieveLaunchParams();
    return !!params.initData;
  } catch {
    return false;
  }
}

export function getTelegramUser(): TelegramUser | null {
  if (!isTelegramEnvironment()) {
    return null;
  }

  try {
    const { initData } = retrieveLaunchParams();
    if (!initData?.user) {
      return null;
    }

    return {
      id: initData.user.id,
      firstName: initData.user.firstName,
      lastName: initData.user.lastName,
      username: initData.user.username,
      languageCode: initData.user.languageCode,
      isPremium: initData.user.isPremium,
      photoUrl: initData.user.photoUrl,
      allowsWriteToPm: initData.user.allowsWriteToPm,
    };
  } catch (error) {
    console.error('Error getting Telegram user:', error);
    return null;
  }
}

export function getTelegramInitData(): string | null {
  if (!isTelegramEnvironment()) {
    return null;
  }

  try {
    const { initDataRaw } = retrieveLaunchParams();
    return initDataRaw || null;
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
