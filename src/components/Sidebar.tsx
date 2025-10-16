import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, Settings, Users, BarChart3, Bell, MessageSquare, HelpCircle, LogOut } from 'lucide-react';

const primaryNavItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Games', icon: Gamepad2, path: '/games' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const secondaryNavItems = [
  { name: 'Players', icon: Users, path: '/players' },
  { name: 'Analytics', icon: BarChart3, path: '/analytics' },
  { name: 'Notifications', icon: Bell, path: '/notifications' },
  { name: 'Messages', icon: MessageSquare, path: '/messages' },
  { name: 'Help', icon: HelpCircle, path: '/help' },
];

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    // If the current path is the root, make 'Games' active and 'Home' not active.
    if (location.pathname === '/') {
      return path === '/games';
    }
    // For all other paths, use the standard comparison.
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-screen p-4">
      <div className="flex items-center mb-8">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
        <h1 className="text-2xl font-bold">GamePortal</h1>
      </div>

      <nav className="mb-8">
        <ul className="space-y-2">
          {primaryNavItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-md transition-colors duration-200 
                  ${isActive(item.path) ? 'bg-gray-700 text-white active-nav' : 'hover:bg-gray-700 text-gray-300'}`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">Management</h2>
        <ul className="space-y-2">
          {secondaryNavItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-md transition-colors duration-200 
                  ${isActive(item.path) ? 'bg-gray-700 text-white active-nav' : 'hover:bg-gray-700 text-gray-300'}`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <Link
          to="/logout"
          className="flex items-center p-2 rounded-md transition-colors duration-200 hover:bg-gray-700 text-gray-300"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;