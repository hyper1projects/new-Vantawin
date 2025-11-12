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
import MobileSportsSubNavbar from './MobileSportsSubNavbar'; // Import the new MobileSportsSubNavbar

const Layout = () => {
  const location = useLocation();
  const { selectedGame, setSelectedMatch } = useMatchSelection();
  const isMobile = useIsMobile();

  // Added '/users' to the excludedPaths array
  const excludedPaths = ['/pools', '/leaderboard', '/wallet', '/users'];
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

  // Calculate dynamic margin-top and height for the main content area
  // On mobile, header is 16px (MainHeader) + 12px (MobileSportsSubNavbar) = 28px (7rem)
  // On desktop, header is 16px (MainHeader) = 4rem
  const contentMarginTopClass = isMobile ? 'mt-[7rem]' : 'mt-16'; // 7rem = 28px, 4rem = 16px
  const contentHeightClass = isMobile ? 'h-[calc(100vh-7rem)]' : 'h-[calc(100vh-4rem)]';

  return (
    <SidebarProvider>
      <div className="relative h-screen bg-vanta-blue-dark text-vanta-text-light overflow-x-hidden w-full">
        <MainHeader />
        {isMobile && <MobileSportsSubNavbar />} {/* Conditionally render MobileSportsSubNavbar */}
        <div className={`flex ${contentHeightClass} ${contentMarginTopClass} w-full`}>
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