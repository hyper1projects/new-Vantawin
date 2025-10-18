"use client";

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MainHeader from './MainHeader';
import RightSidebar from './RightSidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-vanta-blue-dark text-vanta-text-light">
      <Sidebar />
      <MainHeader />
      <div className="flex-1 ml-60 mt-16 mr-80 mb-4 rounded-xl overflow-hidden">
        <div className="p-4">
          <Outlet /> {/* This is where your route components will be rendered */}
        </div>
      </div>
      <RightSidebar />
    </div>
  );
};

export default Layout;