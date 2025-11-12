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

  // Updated logic: hide RightSidebar if path starts with /pools or is in the excludedPaths array
  const excludedPaths = ['/leaderboard', '/wallet', '/users']; // Paths where RightSidebar should not appear
  const showRightSidebar = !location.pathname.startsWith('/pools') && !excludedPaths.includes(location.pathname);

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

  // Calculate dynamic padding-top for the main content area to account for fixed headers
  // On mobile, header is 16px (MainHeader) + 12px (MobileSportsSubNavbar) = 28px (7rem)
  // On desktop, header is 16px (MainHeader) = 4rem
  const headerPaddingTopClass = isMobile ? 'pt-[7rem]' : 'pt-16';

  return (
    <SidebarProvider>
      {/* This div now fills the full height of its parent (#root) and acts as a flex column */}
      <div className="relative h-full flex flex-col bg-vanta-blue-dark text-vanta-text-light overflow-x-hidden w-full">
        <MainHeader />
        {isMobile && <MobileSportsSubNavbar />}

        {/* This div is the main content area, pushed down by padding-top */}
        {/* It takes the remaining flexible height and manages its own overflow */}
        <div className={`flex flex-1 ${headerPaddingTopClass} w-full overflow-hidden`}>
          <div className="hidden md:block h-full flex-shrink-0">
            <Sidebar />
          </div>
          {/* This is the scrollable content area */}
          <div className="flex-1 h-full overflow-y-auto [-webkit-scrollbar:none] [scrollbar-width:none] overflow-x-hidden min-w-0 pb-16 md:pb-0 relative"> {/* Added relative here */}
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