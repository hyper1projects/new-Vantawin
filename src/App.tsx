"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import Games from './pages/Games';
import Pools from './pages/Pools';
import Leaderboard from './pages/Leaderboard';
import Wallet from './pages/Wallet';
import NotFound from './pages/NotFound';
import Terms from './pages/Terms';
import Help from './pages/Help';
import Contact from './pages/Contact';
import Users from './pages/Users';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Support from './pages/Support';
import GameDetails from './pages/GameDetails';
import AllTopGames from './pages/AllTopGames';
import AllLiveGames from './pages/AllLiveGames'; // New import
import AllPremierLeagueGames from './pages/AllPremierLeagueGames'; // New import
import AllLaLigaGames from './pages/AllLaLigaGames'; // New import
import EmailConfirmation from './pages/EmailConfirmation';
import Insights from './pages/Insights';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import EditProfile from './pages/EditProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { MatchSelectionProvider } from './context/MatchSelectionContext';
import { AuthContextProvider, useAuth } from './context/AuthContext';
import PoolDetails from './pages/PoolDetails';
import { Navigate } from 'react-router-dom';

import { MatchesProvider } from './context/MatchesContext';

// Wrapper component to redirect Telegram users away from auth pages
function AuthRouteGuard({ children }: { children: React.ReactElement }) {
  const { isTelegram, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-vanta-blue-dark">
      <div className="text-vanta-neon-blue">Loading...</div>
    </div>;
  }

  if (isTelegram) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <MatchSelectionProvider>
          <MatchesProvider>
            <Routes>
              {/* Standalone routes (no layout) - redirect if in Telegram */}
              <Route path="/login" element={<AuthRouteGuard><Login /></AuthRouteGuard>} />
              <Route path="/register" element={<AuthRouteGuard><SignUp /></AuthRouteGuard>} />
              <Route path="/forgot-password" element={<AuthRouteGuard><ForgotPassword /></AuthRouteGuard>} />
              <Route path="/email-confirmation" element={<AuthRouteGuard><EmailConfirmation /></AuthRouteGuard>} />
              <Route path="/update-password" element={<AuthRouteGuard><div>Update Password Page</div></AuthRouteGuard>} />

              {/* Routes with the main layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="games" element={<Games />} />
                <Route path="games/:gameId" element={<GameDetails />} />
                <Route path="games/top-games" element={<AllTopGames />} />
                <Route path="games/live-games" element={<AllLiveGames />} /> {/* New route */}
                <Route path="games/premier-league" element={<AllPremierLeagueGames />} /> {/* New route */}
                <Route path="games/la-liga" element={<AllLaLigaGames />} /> {/* New route */}
                <Route path="pools" element={<Pools />} />
                <Route path="pools/:poolId" element={<PoolDetails />} />
                <Route path="terms-of-use" element={<Terms />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="help" element={<Help />} />
                <Route path="contact" element={<Contact />} />
                <Route path="support" element={<Support />} />
                <Route path="how-it-works" element={<div>How It Works Page</div>} />

                {/* Protected routes, now nested within the Layout route */}
                <Route element={<ProtectedRoute />}>
                  <Route path="wallet" element={<Wallet />} />
                  <Route path="leaderboard" element={<Leaderboard />} />
                  <Route path="users" element={<Users />} />
                  <Route path="users/insights" element={<Insights />} />
                  <Route path="users/edit-profile" element={<EditProfile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </MatchesProvider>
        </MatchSelectionProvider>
      </AuthContextProvider>
    </Router>
  );
}

export default App;