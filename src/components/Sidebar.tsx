"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, Wallet, Trophy, Users, BookText, HelpCircle, Mail, ChevronRight } from 'lucide-react';
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from '@/components/ui/sidebar';

const Sidebar = () => {
  const location = useLocation();

  const primaryNavItems = [
    { name: "Ho", icon: Home, path: "/" },
    { name: "Games", icon: Gamepad2, path: "/games" },
    { name: "Pools", icon: Trophy, path: "/pools" },
    { name: "Leaderboard", icon: Users, path: "/leaderboard" },
    { name: "Wallet", icon: Wallet, path: "/wallet" },
  ];

  const secondaryNavItems = [
    { name: "Terms of Use", icon: BookText, path: "/terms" },
    { name: "Help and Information", icon: HelpCircle, path: "/help" },
    { name: "Contact Us", icon: Mail, path: "/contact" },
  ];

  return (
    <ShadcnSidebar className="border-r border-vanta-blue-medium" collapsible="none">

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="pt-4">
            <SidebarMenu>
              {primaryNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={isActive ? 'bg-vanta-accent-dark-blue' : ''}
                    >
                      <Link to={item.path}>
                        <item.icon size={24} />
                        <span className="text-lg">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {secondaryNavItems.map((item) => {
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link to={item.path} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <item.icon size={18} />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-vanta-text-light" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;