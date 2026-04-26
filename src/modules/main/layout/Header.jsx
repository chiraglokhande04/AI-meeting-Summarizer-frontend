import React from "react";
import { MessageSquare, User, LogOut, Mic, Clock } from "lucide-react";

const Header = ({
  userEmail,
  onLogout,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* LEFT: Logo & Branding */}
        <div className="flex items-center space-x-3 w-1/4">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 hidden lg:block tracking-tight">
            AI Summarizer
          </h1>
        </div>

        {/* CENTER: Navigation Tabs (Only renders if setActiveTab is passed) */}
        {setActiveTab && (
          <div className="flex-1 flex justify-center w-2/4">
            <div className="flex items-center bg-gray-100/80 p-1.5 rounded-xl border border-gray-200/50 shadow-inner">
              <button
                onClick={() => setActiveTab("live")}
                className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "live"
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5 scale-100"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>Live Meeting</span>
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "history"
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5 scale-100"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>History</span>
              </button>
            </div>
          </div>
        )}

        {/* RIGHT: User Profile & Actions */}
        <div className="flex items-center justify-end space-x-4 w-1/4">
          <div className="hidden md:flex items-center space-x-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <User className="w-4 h-4 text-gray-400" />
            <span className="truncate max-w-[150px]">{userEmail}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;