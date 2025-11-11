"use client";

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from './Sidebar';
import MainHeader from './MainHeader';
import RightSidebar from './RightSidebar';
import BottomNavbar from './BottomNavbar';
import PredictionBottomSheet from './PredictionBottomSheet';
import { useMatchSelection } from '../context/MatchSelectionContext';
import { useIsMobile } from '../hooks/use-mobile';
// Removed SportsSubNavbar import

const Layout = () => {
  const location = useLocation();
  const { selectedGame, setSelectedMatch } = useMatchSelection();
  const isMobile = useIsMobile();

  const excludedPaths = ['/pools', '/leaderboard', '/wallet'];
  const showRightSidebar = !excludedPaths.includes(location.pathname);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMobile && selectedGame) {
      setIsBottomSheetOpen(true);
    } else if (!selectedGame) {
      setIsBottomSheetOpen(false);
    }
  }, [isMobile, selectedGame]);

  const handleBottomSheetOpenChange = (open: boolean) => {
    setIsBottomSheetOpen(open);
    if (!open) {
      setSelectedMatch(null, null);
    }
  };

  return (
    <SidebarProvider>
      <div className="relative min-h-screen bg-vanta-blue-dark text-vanta-text-light overflow-x-hidden w-full">
        <MainHeader />
        {/* Removed SportsSubNavbar rendering */}
        <div className="flex h-[calc(100vh-4rem)] mt-16 w-full"> {/* Reverted height and mt */}
          <div className="hidden md:block h-full flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1 h-full overflow-y-auto [-webkit-scrollbar:none] [scrollbar-width:none] overflow-x-hidden min-w-0 pb-16 md:pb-0">
            <Outlet />
          </div>
          {showRightSidebar && !isMobile && (
            <div className="hidden lg:block h-full w-72 flex-shrink-0">
              <RightSidebar />
            </div>
          )}
        </div>
        <BottomNavbar />
        {isMobile && (
          <PredictionBottomSheet 
            isOpen={isBottomSheetOpen} 
            onOpenChange={handleBottomSheetOpenChange} 
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Layout;