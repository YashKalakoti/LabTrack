
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Calendar, 
  Settings, 
  ChartPie, 
  Menu, 
  X 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Inventory', path: '/', icon: <Database className="mr-2 h-5 w-5" /> },
    { name: 'Bookings', path: '/bookings', icon: <Calendar className="mr-2 h-5 w-5" /> },
    { name: 'Maintenance', path: '/maintenance', icon: <Settings className="mr-2 h-5 w-5" /> },
    { name: 'Analytics', path: '/analytics', icon: <ChartPie className="mr-2 h-5 w-5" /> },
  ];

  return (
    <aside 
      className={`lab-sidebar bg-white shadow-md transition-all duration-300 fixed md:relative h-full z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <h1 className="text-xl font-semibold text-primary">LabTrack</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="p-2">
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => 
              `flex items-center px-4 py-3 rounded-md transition-all ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-secondary text-foreground'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
