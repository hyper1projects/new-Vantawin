import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings, Users, Folder, Bell, HelpCircle, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const primaryNavItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Analytics', icon: BarChart2, path: '/analytics' },
  { name: 'Projects', icon: Folder, path: '/projects' },
  { name: 'Team', icon: Users, path: '/team' },
];

const secondaryNavItems = [
  { name: 'Notifications', icon: Bell, path: '/notifications' },
  { name: 'Settings', icon: Settings, path: '/settings' },
  { name: 'Help & Support', icon: HelpCircle, path: '/help' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar-background text-sidebar-foreground p-6 flex flex-col h-full border-r border-sidebar-border">
      <div className="flex items-center mb-8">
        <span className="text-2xl font-bold text-vanta-accent-blue">Vanta</span>
      </div>

      <nav className="mb-8">
        <ul className="space-y-2">
          {primaryNavItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-md transition-colors duration-200 text-sm
                  ${location.pathname === item.path
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-vanta-text-light hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Separator className="bg-sidebar-border mb-8" />

      <nav className="mb-auto">
        <ul className="space-y-2">
          {secondaryNavItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-md transition-colors duration-200 text-sm
                  ${location.pathname === item.path
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-vanta-text-light hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8">
        <Button
          variant="ghost"
          className="w-full justify-start text-vanta-text-light hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;