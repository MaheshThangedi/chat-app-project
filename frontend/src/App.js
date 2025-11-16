import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';

// Import our new page components
import NewChatView from './pages/NewChatView';
import ChatInterfaceView from './pages/ChatInterfaceView';

// Hamburger Menu Icon
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

// Your new Chat App Logo for the Top Bar
const AppLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-blue-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  </svg>
);


// --- Main App Layout ---
function App() {
  const [sessions, setSessions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Used for new chat button state
  
  const API_URL = '/api';

  // Fetch all sessions on load
  useEffect(() => {
    fetch(`${API_URL}/sessions`)
      .then((res) => res.json())
      .then((data) => {
        setSessions(data || []);
      })
      .catch(console.error);
  }, []);

  const navigate = useNavigate();

  // Handle "New Chat" button click
  const handleNewChat = () => {
    setIsLoading(true); // Disable button immediately
    fetch(`${API_URL}/new-chat`)
      .then((res) => res.json())
      .then((data) => {
        setSessions((prevSessions) => [...prevSessions, { id: data.sessionId, title: data.title, dateTime: data.dateTime }]);
        navigate(`/${data.sessionId}`); // Navigate to root + new ID
        setIsSidebarOpen(false); // Close sidebar
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false); // Re-enable button
      });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      <Sidebar 
        sessions={sessions} 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        onNewChat={handleNewChat}
        isLoadingNewChat={isLoading} // Pass loading state to sidebar
      />
      
      {/* Main Content Area (This layout is key) */}
      <div className="flex-1 flex flex-col h-screen">
        
        {/* Top Bar (Fixed Height) */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-10">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <MenuIcon />
            </button>
            <div className="flex items-center gap-2">
              <AppLogo />
              <span className="font-bold text-lg text-gray-800 dark:text-gray-200">My Chat App</span>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<NewChatView onNewChat={handleNewChat} isLoading={isLoading} />} />
            <Route 
              path="/:sessionId" 
              element={<ChatInterfaceView apiUrl={API_URL} setSessions={setSessions} />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>

      {/* Overlay for mobile (or when sidebar is open) */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 z-20 bg-black opacity-50"
        ></div>
      )}
    </div>
  );
}

// --- Wrapper for BrowserRouter ---
const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;