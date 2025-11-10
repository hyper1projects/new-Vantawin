"use client";

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from './Sidebar';
import MainHeader from './MainHeader';
import RightSidebar from './RightSidebar';
import BottomNavbar from './BottomNavbar';
import PredictionBottomSheet from './PredictionBottomSheet'; // Import the new PredictionBottomSheet
import { useMatchSelection } from '../context/MatchSelectionContext'; // Import useMatchSelection
import { useIsMobile } from '../hooks/use-mobile'; // Import useIsMobile

const Layout = () => {
  const location = useLocation();
  const { selectedGame, setSelectedMatch } = useMatchSelection(); // Get selectedGame and setSelectedMatch
  const isMobile = useIsMobile(); // Determine if it's a mobile screen

  const excludedPaths = ['/pools', '/leaderboard', '/wallet'];
  const showRightSidebar = !excludedPaths.includes(location.pathname);

  // State to control the visibility of the bottom sheet
  const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);

  // Open bottom sheet when a game is selected on mobile
  React.useEffect(() => {
    if (isMobile && selectedGame) {
      setIsBottomSheetOpen(true);
    } else if (!selectedGame) {
      setIsBottomSheetOpen(false);
    }
  }, [isMobile, selectedGame]);

  // Close bottom sheet and clear selection if user closes it manually
  const handleBottomSheetOpenChange = (open: boolean) => {
    setIsBottomSheetOpen(open);
    if (!open) {
      setSelectedMatch(null, null); // Clear selected match when sheet closes
    }
  };

  return (
    <SidebarProvider>
      <div className="relative min-h-screen bg-vanta-blue-dark text-vanta-text-light overflow-x-hidden w-full">
        <MainHeader />
        <div className="flex h-[calc(100vh-4rem)] mt-16 w-full">
          <div className="hidden md:block h-full flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1 h-full overflow-y-auto [-webkit-scrollbar:none] [scrollbar-width:none] overflow-x-hidden min-w-0 pb-16 md:pb-0">
            <Outlet />
          </div>
          {showRightSidebar && !isMobile && ( // Only show RightSidebar on non-mobile and if not excluded
            <div className="hidden lg:block h-full w-72 flex-shrink-0">
              <RightSidebar />
            </div>
          )}
        </div>
        <BottomNavbar />
        {isMobile && ( // Only render PredictionBottomSheet on mobile
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