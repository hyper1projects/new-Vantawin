"use client";

import React, { type PropsWithChildren, useEffect } from 'react';
import { miniApp, viewport, themeParams, init, retrieveLaunchParams } from '@telegram-apps/sdk';

function TelegramApp({ children }: PropsWithChildren) {
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    // Apply Telegram theme colors to CSS variables if needed
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
  }, []);

  return <>{children}</>;
}

export function TelegramProvider({ children }: PropsWithChildren) {
  // Check if we're in Telegram environment
  let isTelegram = false;
  try {
    const params = retrieveLaunchParams();
    isTelegram = !!params.initData;
  } catch {
    isTelegram = false;
  }

  // Only wrap with TelegramApp if in Telegram
  if (isTelegram) {
    return <TelegramApp>{children}</TelegramApp>;
  }

  return <>{children}</>;
}
