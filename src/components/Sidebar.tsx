import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings, Users, HelpCircle, LogOut, Bell, MessageSquare, Folder, Calendar, FileText, CreditCard, ShoppingCart, Package, Truck, TrendingUp, Briefcase, DollarSign, Layers, Shield, LifeBuoy, BookOpen, Code, Database, Server, Cloud, Zap, Globe, Monitor, HardDrive, Cpu, GitBranch, Terminal, LayoutDashboard, User, Mail, BellRing, Settings as SettingsIcon, LogOut as LogOutIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const primaryNavItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Projects', href: '/projects', icon: Folder },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Shipments', href: '/shipments', icon: Truck },
  { name: 'Sales', href: '/sales', icon: TrendingUp },
  { name: 'Tasks', href: '/tasks', icon: Briefcase },
  { name: 'Finance', href: '/finance', icon: DollarSign },
  { name: 'Integrations', href: '/integrations', icon: Layers },
  { name: 'Security', href: '/security', icon: Shield },
  { name: 'Support', href: '/support', icon: LifeBuoy },
];

const secondaryNavItems = [
  { name: 'Documentation', href: '/docs', icon: BookOpen },
  { name: 'API Reference', href: '/api', icon: Code },
  { name: 'Database', href: '/database', icon: Database },
  { name: 'Server Status', href: '/server-status', icon: Server },
  { name: 'Cloud Services', href: '/cloud', icon: Cloud },
  { name: 'Automation', href: '/automation', icon: Zap },
  { name: 'Global Access', href: '/global', icon: Globe },
  { name: 'Monitoring', href: '/monitoring', icon: Monitor },
  { name: 'Storage', href: '/storage', icon: HardDrive },
  { name: 'Compute', href: '/compute', icon: Cpu },
  { name: 'Version Control', href: '/version-control', icon: GitBranch },
  { name: 'Terminal', href: '/terminal', icon: Terminal },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-vanta-blue-medium text-vanta-text-light border-r border-vanta-border shadow-lg">
      {/* Logo and App Name */}
      <div className="flex items-center justify-center h-16 border-b border-vanta-border px-4">
        <span className="text-2xl font-bold text-vanta-accent-blue">Vanta</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {/* Primary Navigation */}
        <nav className="mb-8">
          <h3 className="text-vanta-text-muted text-xs font-semibold uppercase mb-3 tracking-wider">Main Menu</h3>
          <ul className="space-y-2">
            {primaryNavItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center p-2 rounded-md text-sm transition-colors duration-200 
                    ${location.pathname === item.href
                      ? 'bg-vanta-active-bg text-vanta-accent-blue font-medium'
                      : 'hover:bg-vanta-active-bg text-vanta-text-light'
                    }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Secondary Navigation */}
        <nav>
          <h3 className="text-vanta-text-muted text-xs font-semibold uppercase mb-3 tracking-wider">Tools & Services</h3>
          <ul className="space-y-2">
            {secondaryNavItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center p-2 rounded-md text-sm transition-colors duration-200 
                    ${location.pathname === item.href
                      ? 'bg-vanta-active-bg text-vanta-accent-blue font-medium'
                      : 'hover:bg-vanta-active-bg text-vanta-text-light'
                    }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* User Profile and Settings */}
      <div className="p-4 border-t border-vanta-border flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-full justify-start px-2 py-1 text-vanta-text-light hover:bg-vanta-active-bg">
              <Avatar className="h-7 w-7 mr-2">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-xs text-vanta-text-muted">johndoe@example.com</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-vanta-blue-medium border-vanta-border text-vanta-text-light" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-vanta-text-muted">
                  johndoe@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-vanta-border" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="focus:bg-vanta-active-bg focus:text-vanta-accent-blue">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-vanta-active-bg focus:text-vanta-accent-blue">
                <Mail className="mr-2 h-4 w-4" />
                <span>Inbox</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-vanta-active-bg focus:text-vanta-accent-blue">
                <BellRing className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-vanta-active-bg focus:text-vanta-accent-blue">
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-vanta-border" />
            <DropdownMenuItem className="focus:bg-vanta-active-bg focus:text-vanta-accent-blue">
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;