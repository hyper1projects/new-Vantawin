"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainHeader from './components/MainHeader'; // Renamed from Navbar
import Index from './pages/Index';
import Games from './pages/Games';
import Pools from './pages/Pools'; // Added Pools import
import Leaderboard from './pages/Leaderboard';
import Wallet from './pages/Wallet';
import NotFound from './pages/NotFound'; // Import NotFound page
import Terms from './pages/Terms'; // Renamed from Terms of Use
import Help from './pages/Help'; // Renamed from Help & Information
import Contact from './pages/Contact';
import Users from './pages/Users'; // Added Users import
import PrivacyPolicy from './pages/PrivacyPolicy'; // Added PrivacyPolicy import
import Support from './pages/Support'; // Added Support import

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-vanta-blue-dark text-vanta-text-light">
        <Sidebar />
        <div className="flex-1 ml-72"> {/* Adjusted margin-left for wider sidebar */}
          <MainHeader /> {/* Render MainHeader here */}
          <div className="p-4"> {/* Added padding to the main content area */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/games" element={<Games />} />
              <Route path="/pools" element={<Pools />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/users" element={<Users />} /> {/* New route */}
              <Route path="/terms-of-use" element={<Terms />} /> {/* Updated route */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* New route */}
              <Route path="/help" element={<Help />} /> {/* Updated route */}
              <Route path="/contact" element={<Contact />} /> {/* Updated route */}
              <Route path="/support" element={<Support />} /> {/* New route */}
              <Route path="/sports/:category" element={<div>Sport Category Page</div>} />
              <Route path="/how-it-works" element={<div>How It Works Page</div>} />
              <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;