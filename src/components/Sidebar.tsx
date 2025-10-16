"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ChevronRight, Home, Settings, Users, FileText, Gift, HelpCircle, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 flex flex-col h-full">
      <div className="flex items-center mb-6">
        <img src="/logo.png" alt="Vanta Logo" className="h-8 w-8 mr-2" />
        <h1 className="text-xl font-bold">Vanta</h1>
      </div>

      <nav className="flex-grow">
        <ul>
          <li className="mb-2">
            <Link to="/" className="flex items-center p-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200">
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/users" className="flex items-center p-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200">
              <Users className="h-5 w-5 mr-3" />
              Users
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/settings" className="flex items-center p-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200">
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </li>
        </ul>

        {/* The Rewards Hub section has been removed from here */}

        <div className="mt-4">
          <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Legal</h3>
          <ul>
            <li className="mb-2">
              <Link to="/terms-of-use" className="flex items-center p-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200">
                <FileText className="h-5 w-5 mr-3" />
                Terms of Use
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/privacy-policy" className="flex items-center p-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200">
                <FileText className="h-5 w-5 mr-3" />
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="mt-auto">
        <ul>
          <li className="mb-2">
            <Link to="/support" className="flex items-center p-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200">
              <HelpCircle className="h-5 w-5 mr-3" />
              Support
            </Link>
          </li>
          <li>
            <button className="flex items-center p-2 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-md transition-colors duration-200 w-full">
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;