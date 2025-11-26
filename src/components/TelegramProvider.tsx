"use client";

import React, { type PropsWithChildren, useEffect, useState } from 'react';
import { miniApp, viewport, themeParams, init, retrieveLaunchParams } from '@telegram-apps/sdk';

export function TelegramProvider({ children }: PropsWithChildren) {
  const [isTelegramEnv, setIsTelegramEnv] = useState(false);

  // Effect to detect Telegram environment, runs once on mount
  useEffect(() => {
    let telegramDetected = false;
    try {
      const params = retrieveLaunchParams();
      telegramDetected = !!params.initData;
    } catch {
      telegramDetected = false;
    }
    setIsTelegramEnv(telegramDetected);
  }, []);

  // Effect for Telegram Mini App initialization and viewport expansion
  // This hook is always called, but its logic is conditional
  useEffect(() => {
    if (!isTelegramEnv) return; // Only run if in Telegram environment

    try {
      // Initialize the SDK
      init();
      
      // Signal that the mini app is ready to be displayed
      if (miniApp.mount.isAvailable()) {
        miniApp.mount();
        miniApp.ready();
      }
      
      // Expand the viewport to full height
      if (viewport.mount.isAvailable()) {
        viewport.mount();
        if (viewport.expand.isAvailable()) {
          viewport.expand();
        }
      }

      // Mount theme params
      if (themeParams.mount.isAvailable()) {
        themeParams.mount();
      }
    } catch (error) {
      console.error('Error initializing Telegram Mini App:', error);
    }
  }, [isTelegramEnv]); // Dependency on isTelegramEnv ensures it runs when the environment is determined

  // Effect to apply Telegram theme colors
  // This hook is always called, but its logic is conditional
  useEffect(() => {
    if (!isTelegramEnv) return; // Only run if in Telegram environment

    try {
      if (themeParams.isMounted()) {
        const params = themeParams.state();
        const root = document.documentElement;
        
        if (params.backgroundColor) {
          root.style.setProperty('--tg-theme-bg-color', params.backgroundColor);
        }
        if (params.textColor) {
          root.style.setProperty('--tg-theme-text-color', params.textColor);
        }
        if (params.hintColor) {
          root.style.setProperty('--tg-theme-hint-color', params.hintColor);
        }
        if (params.linkColor) {
          root.style.setProperty('--tg-theme-link-color', params.linkColor);
        }
        if (params.buttonColor) {
          root.style.setProperty('--tg-theme-button-color', params.buttonColor);
        }
        if (params.buttonTextColor) {
          root.style.setProperty('--tg-theme-button-text-color', params.buttonTextColor);
        }
        if (params.secondaryBackgroundColor) {
          root.style.setProperty('--tg-theme-secondary-bg-color', params.secondaryBackgroundColor);
        }
      }
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [isTelegramEnv]); // Dependency on isTelegramEnv

  return <>{children}</>;
}