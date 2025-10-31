"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const FooterSection: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-vanta-blue-dark text-vanta-text-light py-8 px-4 md:px-8 lg:px-16 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="flex flex-col items-start">
          <Link to="/" className="flex items-center mb-4">
            <span className="text-2xl font-bold text-vanta-text-light">VANTA</span>
            <span className="text-2xl font-bold text-vanta-neon-blue">WIN</span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your ultimate destination for sports predictions and thrilling challenges. Join our community and win big!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/games" className="text-gray-400 hover:text-vanta-neon-blue transition-colors text-sm">Games</Link></li>
            <li><Link to="/pools" className="text-gray-400 hover:text-vanta-neon-blue transition-colors text-sm">Pools</Link></li>
            <li><Link to="/leaderboard" className="text-gray-400 hover:text-vanta-neon-blue transition-colors text-sm">Leaderboard</Link></li>
            <li><Link to="/wallet" className="text-gray-400 hover:text-vanta-neon-blue transition-colors text-sm">Wallet</Link></li>
            <li><Link to="/how-it-works" className="text-gray-400 hover:text-vanta-neon-blue transition-colors text-sm">How It Works</Link></li>
          </ul>
        </div>

        {/* Legal & Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Legal & Support</h3>
          <ul className="space-y-2">
            <li><Link to="/terms-of-use" className="text-gray-400 hover:text-vanta-neon-blue transition-colors text-sm">Terms of Use</Link></li>
            <li><Link to="/privacy-policy" className="text-gray-400 hover:text-vanta-neon-blue transition-colors text-sm">Privacy Policy</Link></li>
            <li><Link to="/help" className="text-gray-400 hover:text-vanta-neon-blue transition-colors text-sm">Help & FAQ</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-vanta-neon-blue transition-colors text-sm">Contact Us</Link></li>
            <li><Link to="/support" className="text-gray-400 hover:text-vanta-neon-blue transition-colors text-sm">Support</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-vanta-neon-blue transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-vanta-neon-blue transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-vanta-neon-blue transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-vanta-neon-blue transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
        &copy; {currentYear} VantaWin. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterSection;