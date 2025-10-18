"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Import the new Layout component
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}> {/* Use Layout as the parent route */}
          <Route index element={<Index />} /> {/* Default route for / */}
          <Route path="games" element={<Games />} />
          <Route path="pools" element={<Pools />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="users" element={<Users />} />
          <Route path="terms-of-use" element={<Terms />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="help" element={<Help />} />
          <Route path="contact" element={<Contact />} />
          <Route path="support" element={<Support />} />
          <Route path="sports/:category" element={<div>Sport Category Page</div>} />
          <Route path="how-it-works" element={<div>How It Works Page</div>} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all for unmatched routes */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;