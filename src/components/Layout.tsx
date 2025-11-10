"use client";

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from './Sidebar';
import MainHeader from './MainHeader';
import RightSidebar from './RightSidebar';
import BottomNavbar from './BottomNavbar'; // Import the new BottomNavbar

const Layout = () => {
  const location = useLocation();
  const excludedPaths = ['/pools', '/leaderboard', '/wallet'];
  const showRightSidebar = !excludedPaths.includes(location.pathname);

  return (
    <SidebarProvider>
      <div className="relative min-h-screen bg-vanta-blue-dark text-vanta-text-light overflow-x-hidden w-full">
        <MainHeader />
        <div className="flex h-[calc(100vh-4rem)] mt-16 w-full">
          <div className="hidden md:block h-full flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1 h-full overflow-y-auto [-webkit-scrollbar:none] [scrollbar-width:none] overflow-x-hidden min-w-0 pb-16 md:pb-0"> {/* Added pb-16 for mobile */}
            <Outlet />
          </div>
          {showRightSidebar && (
            <div className="hidden lg:block h-full w-72 flex-shrink-0">
              <RightSidebar />
            </div>
          )}
        </div>
        <BottomNavbar /> {/* Render the BottomNavbar */}
      </div>
    </SidebarProvider>
  );
};

export default Layout;