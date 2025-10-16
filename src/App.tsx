import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainHeader from './components/MainHeader';
import Index from './pages/Index'; // Assuming this is your main page
import FootballPage from './pages/FootballPage'; // Example page
import BasketballPage from './pages/BasketballPage'; // Example page
import TennisPage from './pages/TennisPage'; // Example page
import AFootballPage from './pages/AFootballPage'; // Example page
import GolfPage from './pages/GolfPage'; // Example page
import HowItWorksPage from './pages/HowItWorksPage'; // Example page

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-vanta-bg-dark text-vanta-text-light">
        <MainHeader />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sports/football" element={<FootballPage />} />
            <Route path="/sports/basketball" element={<BasketballPage />} />
            <Route path="/sports/tennis" element={<TennisPage />} />
            <Route path="/sports/afootball" element={<AFootballPage />} />
            <Route path="/sports/golf" element={<GolfPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;