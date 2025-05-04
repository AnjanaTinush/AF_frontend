import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Globe,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import sideBarMenuItems from '../constent/sideBarMenuItems'; // ← Update path to your actual file

const CountryExplorerSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [activePath, setActivePath] = useState('/');
  const [userData, setUserData] = useState({ fullName: 'Guest User', role: 'Free Account' });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = sideBarMenuItems; // ✅ Use imported menu

  // Handle responsive behavior based on window size
  useEffect(() => {
    const handleResize = () => {
      // Check if window width is below the mobile breakpoint (768px)
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto collapse sidebar on smaller screens
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Set initial state on component mount
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsCollapsed]);

  useEffect(() => {
    // Load user data from localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setUserData({
          fullName: user.fullName || 'Guest User',
          role: user.role || 'Free Account'
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    setActivePath(location.pathname);
    for (const item of menuItems) {
      if (item.submenu && item.submenu.length > 0) {
        const hasActiveSubmenu = item.submenu.some(
          (subItem) => subItem.path === location.pathname
        );
        if (hasActiveSubmenu) {
          setOpenSubmenu(item.id);
        }
      }
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const promptLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Close mobile sidebar when navigating
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const confirmLogout = () => {
    // Clear session data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Navigate to login page
    navigate('/signin');
    
    // Close confirmation dialog
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Get user initials for the avatar
  const getInitials = (name) => {
    if (!name || name === 'Guest User') return 'GU';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Handle submenu toggle
  const toggleSubmenu = (itemId) => {
    setOpenSubmenu(openSubmenu === itemId ? null : itemId);
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed z-50 p-2 bg-white rounded-full shadow-lg text-gray-800 top-4 left-4 ring-2 ring-blue-600"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {isMobile && isOpen && (
        <div className="fixed inset-0 z-40 " onClick={toggleSidebar} />
      )}

      {/* Custom Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-5 m-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Confirm Logout</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={cancelLogout} 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout} 
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <aside
        className={`fixed top-0 left-0 transition-all duration-300 ease-in-out h-screen z-50 ${
          isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}
      >
        <div className="fixed flex h-full">
          <div
            className={`bg-gray-800 py-6 rounded-r-2xl shadow-xl flex flex-col items-center transition-all duration-300 ${
              isCollapsed ? "w-20" : "w-72"
            }`}
          >
            <div className="flex items-center justify-center px-4 mb-8">
              <div className={`flex items-center ${isCollapsed ? "justify-center" : ""}`}>
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                {!isCollapsed && (
                  <div className="ml-3">
                    <span className="text-xl font-bold tracking-wide text-white">
                      Country<span className="text-blue-400">Explorer</span>
                    </span>
                    <p className="text-xs text-gray-300 opacity-70">Discover the world</p>
                  </div>
                )}
              </div>
            </div>

            {!isMobile && (
              <button
                onClick={toggleCollapse}
                className="absolute p-1.5 bg-white rounded-full shadow-lg text-gray-800 -right-3 top-24 ring-2 ring-blue-500"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}

            <div className="w-full px-3 mt-2 mb-6">
              <div className="px-2 mb-2">
                <p className={`text-xs uppercase tracking-wider text-gray-400 text-opacity-50 ${isCollapsed ? "text-center" : ""}`}>
                  {isCollapsed ? "Menu" : "Main Menu"}
                </p>
              </div>
              <div className="justify-between">
                <div className="flex flex-col space-y-1.5 w-full overflow-y-auto max-h-[calc(100vh-240px)] pr-1">
                  {menuItems.map((item) => (
                    <div key={item.id} className="w-full">
                      {item.submenu && item.submenu.length > 0 ? (
                        <div>
                          <button
                            onClick={() => toggleSubmenu(item.id)}
                            className={`relative ${isCollapsed ? "w-full h-10 px-2" : "w-full h-11 px-3"} flex items-center ${
                              isCollapsed ? "justify-center" : "justify-between"
                            } rounded-xl transition-all duration-150 ${
                              openSubmenu === item.id
                                ? "bg-gradient-to-r from-blue-500/90 to-blue-600 text-white"
                                : "text-gray-300 hover:bg-white/10"
                            } group`}
                            title={isCollapsed ? item.label : ""}
                          >
                            <div className="flex items-center">
                              <div className={`flex items-center justify-center ${
                                openSubmenu === item.id
                                  ? "text-white"
                                  : "text-gray-300 group-hover:text-blue-400"
                              }`}>
                                <item.icon className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"}`} />
                              </div>
                              {!isCollapsed && <span className="font-medium">{item.label}</span>}
                            </div>
                            {!isCollapsed && (
                              openSubmenu === item.id
                                ? <ChevronDown className="w-5 h-5 ml-2 transition-transform duration-200" />
                                : <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-200" />
                            )}
                          </button>

                          {!isCollapsed && openSubmenu === item.id && (
                            <div className="pl-10 mt-1 mb-2 ml-2 space-y-1 border-l-2 border-blue-500/30">
                              {item.submenu.map((subItem) => (
                                <div key={subItem.id} className="animate-fadeIn">
                                  <button
                                    onClick={() => handleNavigation(subItem.path)}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-150 ${
                                      activePath === subItem.path
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "text-gray-300/80 hover:bg-white/10 hover:text-blue-400"
                                    }`}
                                  >
                                    <subItem.icon className="flex-shrink-0 w-4 h-4" />
                                    <span className="ml-3 text-sm">{subItem.label}</span>
                                    {subItem.badge && (
                                      <span className="flex items-center justify-center w-5 h-5 ml-auto text-xs font-bold text-white rounded-full bg-blue-600">
                                        {subItem.badge}
                                      </span>
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <button
                            onClick={() => handleNavigation(item.path)}
                            className={`relative ${isCollapsed ? "w-full h-10 px-2" : "w-full h-11 px-3"} flex items-center ${
                              isCollapsed ? "justify-center" : "justify-between"
                            } rounded-xl transition-all duration-150 ${
                              activePath === item.path
                                ? "bg-gradient-to-r from-blue-400/90 to-blue-500 text-gray-800 font-medium"
                                : "text-gray-300 hover:bg-white/10 hover:text-blue-400"
                            }`}
                            title={isCollapsed ? item.label : ""}
                          >
                            <div className="flex items-center">
                              <item.icon className={`flex-shrink-0 w-5 h-5 ${isCollapsed ? "" : "mr-3"}`} />
                              {!isCollapsed && <span className="font-medium">{item.label}</span>}
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full px-4 pt-4 mt-auto border-t border-white/10">
                {!isCollapsed && (
                  <div className="flex items-center px-2 mb-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-blue-500">
                      <span className="font-medium text-white">{getInitials(userData.fullName)}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{userData.fullName}</p>
                      <p className="text-xs text-gray-400/70">{userData.role}</p>
                    </div>
                  </div>
                )}
                <button
                  className={`${isCollapsed ? "w-full h-10 justify-center" : "w-full h-10 justify-start px-3"} flex items-center text-gray-300 hover:bg-red-500/70 hover:text-white rounded-xl transition-all duration-200 mt-1`}
                  title={isCollapsed ? "Logout" : ""}
                  onClick={promptLogout}
                >
                  <LogOut className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"}`} />
                  {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #3B82F6;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3B82F6;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #fff;
          transition: all 0.3s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default CountryExplorerSidebar;