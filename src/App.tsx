"use client";

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainHeader from './components/MainHeader';
import Index from './pages/Index';
import Games from './pages/Games';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <MainHeader />
      {/* Removed the div with p-4 padding */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/games" element={<Games />} />
      </Routes>
    </div>
  );
}

export default App;