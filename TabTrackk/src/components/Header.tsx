
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Menu, 
  Bell, 
  Search,
  User
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  toggleSidebar: () => void;
  openChatbot: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, openChatbot }) => {
  const { toast } = useToast();
  
  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications",
    });
  };

  return (
    <header className="lab-header bg-white shadow-sm border-b p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="mr-4 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search equipment..." 
            className="pl-8" 
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={openChatbot}
          className="hidden sm:flex"
        >
          <span className="mr-2">Lab Assistant</span>
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse-light"></span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleNotificationClick}
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
