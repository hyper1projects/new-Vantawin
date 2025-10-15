import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Users, Settings, LogOut, Trophy, Gift, HelpCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Leaderboard', icon: BarChart2, path: '/leaderboard' },
    { name: 'My Teams', icon: Users, path: '/my-teams' },
    { name: 'Rewards', icon: Trophy, path: '/rewards' },
    { name: 'Free Bets', icon: Gift, path: '/free-bets' },
  ];

  const supportItems = [
    { name: 'Help Center', icon: HelpCircle, path: '/help' },
    { name: 'Contact Us', icon: MessageSquare, path: '/contact' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 flex-col border-r border-vanta-border bg-vanta-blue-dark p-4 z-50">
      <div className="flex items-center justify-center h-16 mb-6">
        <h1 className="text-2xl font-bold text-vanta-text-light">VANTA WIN</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-vanta-text-muted transition-all hover:text-vanta-text-light ${
                  location.pathname === item.path ? 'bg-vanta-active-bg text-vanta-text-light' : ''
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-8 border-t border-vanta-border">
          <h3 className="text-sm font-semibold text-vanta-text-muted mb-3">SUPPORT</h3>
          <ul className="space-y-2">
            {supportItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-vanta-text-muted transition-all hover:text-vanta-text-light ${
                    location.pathname === item.path ? 'bg-vanta-active-bg text-vanta-text-light' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mt-auto space-y-2 pt-4 border-t border-vanta-border">
        <Link
          to="/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-vanta-text-muted transition-all hover:text-vanta-text-light ${
            location.pathname === '/settings' ? 'bg-vanta-active-bg text-vanta-text-light' : ''
          }`}
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-vanta-text-muted hover:text-vanta-text-light hover:bg-vanta-active-bg"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;