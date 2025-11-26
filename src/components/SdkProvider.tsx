"use client";

import { SDKProvider } from '@telegram-apps/sdk-react';
import type { FC, PropsWithChildren } from 'react';

export const SdkProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SDKProvider acceptCustomStyles debug>
      {children}
    </SDKProvider>
  );
};