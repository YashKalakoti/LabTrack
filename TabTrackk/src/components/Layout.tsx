
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Chatbot from './Chatbot';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleChatbot = () => setChatbotOpen(!chatbotOpen);

  return (
    <div className={`lab-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <Header 
        toggleSidebar={toggleSidebar}
        openChatbot={() => setChatbotOpen(true)}
      />
      
      <main className="lab-main p-6 overflow-auto bg-secondary">
        <Outlet />
      </main>

      <Chatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </div>
  );
};

export default Layout;
