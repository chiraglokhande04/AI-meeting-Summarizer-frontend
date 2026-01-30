import React from "react";
import { Menu, X, MessageSquare, Settings, User, LogOut } from "lucide-react";

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  setShowSettings,
  showSettings,
  userEmail,
  onLogout,
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <MessageSquare className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            AI Meeting Summarizer
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{userEmail}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
