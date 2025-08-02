import React, { useEffect, useRef, useState } from 'react';

export default function ChatHeader({
  setShowSidebar,
  showMobileMenu,
  setShowMobileMenu,
  handleLogout,
  isOnChatPage,
}) {
  const mobileMenuRef = useRef();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    }
    if (showMobileMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showMobileMenu, setShowMobileMenu]);

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const confirmLogoutAction = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  // Smooth navigation function
  const handleNavigation = (path, callback) => {
    // Get current path to check if we're already on the page
    const currentPath = window.location.pathname;

    // Don't navigate if already on the page
    if (currentPath === path) {
      return;
    }

    setIsTransitioning(true);
    setShowMobileMenu(false);

    // Add transition overlay to body
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.className = 'page-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0f172a, #1e293b, #0f172a);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(8px);
    `;

    const spinner = document.createElement('div');
    spinner.innerHTML = `
      <div style="
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: white;
        font-weight: 500;
      ">
        <div style="
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        <span>Loading...</span>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);

    // Trigger the fade in
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });

    // Navigate after transition
    setTimeout(() => {
      if (callback) {
        callback();
      } else {
        window.location.href = path;
      }
    }, 300);
  };

  // Handle chat navigation
  const handleChatClick = (e) => {
    e.preventDefault();
    handleNavigation('/chat');
  };

  // Handle profile navigation
  const handleProfileClick = (e) => {
    e.preventDefault();
    handleNavigation('/profile');
  };

  // Handle settings navigation
  const handleSettingsClick = (e) => {
    e.preventDefault();
    handleNavigation('/settings');
  };

  // Handle home navigation
  const handleHomeClick = (e) => {
    e.preventDefault();
    handleNavigation('/');
  };

  // Handle help click
  const handleHelpClick = () => {
    alert('Help functionality coming soon!');
  };

  // Get current page for active state styling
  const currentPath = window.location.pathname;
  const isOnSettingsPage = currentPath === '/settings';
  const isOnProfilePage = currentPath === '/profile';
  const isOnChatPageCurrent = currentPath === '/chat';

  return (
    <>
      <header className={`flex justify-between items-center p-4 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 flex-shrink-0 relative z-30 h-16 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
        {isOnChatPage && (
          <button
            className="p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors md:hidden"
            onClick={() => setShowSidebar(true)}
          >
            <img src="layouting.png" alt="Layouting" className="w-6 h-6" />
          </button>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mt-8 mb-8">
          <a
            href="/"
            onClick={handleHomeClick}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <div className="flex items-center gap-4 bg-white bg-opacity-90 border border-white border-opacity-20 rounded-xl p-2 shadow-lg">
              <img src='7EDGE.png' alt="SET Mate Logo" className="h-5" />
            </div>
          </a>
          <h1 className="text-[30px] font-bold p-2">SET Mate</h1>
        </div>

        <div className="relative z-50">
          {/* Mobile Menu Toggle */}
          <button
            className="p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-7">
            <a
              href="/chat"
              onClick={handleChatClick}
              className={`transition-colors px-2 py-1 rounded-md ${isOnChatPageCurrent
                  ? 'bg-white text-gray-700'
                  : 'text-white hover:text-gray-300'
                }`}
            >
              Chat
            </a>
            <a
              href="/profile"
              onClick={handleProfileClick}
              className={`transition-colors px-2 py-1 rounded-md ${isOnProfilePage
                  ? 'bg-white text-gray-700'
                  : 'text-white hover:text-gray-300'
                }`}
            >
              Profile
            </a>
            <a
              href="/settings"
              onClick={handleSettingsClick}
              className={`transition-colors px-2 py-1 rounded-md ${isOnSettingsPage
                  ? 'bg-white text-gray-700'
                  : 'text-white hover:text-gray-300'
                }`}
            >
              Settings
            </a>
            <button
              onClick={handleHelpClick}
              className="text-white hover:text-gray-300 transition-colors px-2 py-1 rounded-md"
            >
              Help
            </button>
            <button
              onClick={confirmLogout}
              className="block w-full text-left px-4 py-2 text-white hover:bg-red-50 hover:bg-opacity-50 transition-colors rounded-md"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div
              ref={mobileMenuRef}
              className="absolute top-14 right-0 bg-gray-800 text-white rounded-lg shadow-lg z-40 w-40 py-2 md:hidden animate-fade-in"
            >
              <a
                href="/chat"
                onClick={handleChatClick}
                className={`block px-4 py-2 text-white hover:bg-gray-700 transition-colors ${isOnChatPageCurrent ? 'bg-gray-700' : ''}`}
              >
                Chat
              </a>
              <a
                href="/profile"
                onClick={handleProfileClick}
                className={`block px-4 py-2 text-white hover:bg-gray-700 transition-colors ${isOnProfilePage ? 'bg-gray-700' : ''}`}
              >
                Profile
              </a>
              <a
                href="/settings"
                onClick={handleSettingsClick}
                className={`block px-4 py-2 text-white hover:bg-gray-700 transition-colors ${isOnSettingsPage ? 'bg-gray-700' : ''}`}
              >
                Settings
              </a>
              <button
                onClick={() => {
                  handleHelpClick();
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                Help
              </button>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  confirmLogout();
                }}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 border border-gray-600 transform animate-scale-in">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Logout</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to log out? You will need to log in again to continue.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogoutAction}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}