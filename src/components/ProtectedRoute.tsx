"use client";

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user, isLoading, isTelegram, telegramUser } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-vanta-text-light">Loading...</div>;
  }

  // If in Telegram, user is always authenticated via Telegram initData
  if (isTelegram && telegramUser) {
    return <Outlet />;
  }

  // If not in Telegram, check for regular Supabase authentication
  if (!user && !isTelegram) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated (either via Telegram or Supabase)
  return <Outlet />;
};

export default ProtectedRoute;