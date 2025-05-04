import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import CountryExplorerSidebar from '../components/CountryExplorerSidebar'; // Adjust path as needed
import Footer from '../components/Footer'; // Import the Footer component

// Layout component that includes the sidebar and footer
const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        {/* Sidebar */}
        <CountryExplorerSidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
        
        {/* Main Content */}
        <div 
          className={`flex-1 transition-all duration-300 ${
            isSidebarCollapsed ? 'ml-20' : 'ml-72'
          } flex flex-col`}
        >
          <main className="flex-1">
            <Outlet/> {/* This is where nested routes will render */}
          </main>
          
          {/* Footer */}
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
};

export default Layout;