import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainHeader from './components/MainHeader';
import Index from './pages/Index';
import HowItWorks from './pages/HowItWorks'; // Import the new page

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-vanta-blue-dark text-vanta-text-light">
        <MainHeader />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/how-it-works" element={<HowItWorks />} /> {/* New route */}
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;