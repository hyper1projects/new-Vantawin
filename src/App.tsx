import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-vanta-blue-dark">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64"> {/* Added ml-64 to offset the fixed sidebar */}
          <Header />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Index />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;