import React from "react";
import { Mic, Clock } from "lucide-react";

const Sidebar = ({
  isOpen,
  activeTab,
  setActiveTab,
  setSidebarOpen,
  meetingHistory,
}) => {
  return (
    <aside
      className={`${
        isOpen ? "block" : "hidden"
      } lg:block w-64 bg-white border-r border-gray-200 min-h-screen p-4`}
    >
      <nav className="space-y-2">
        <button
          onClick={() => {
            setActiveTab("live");
            setSidebarOpen(false); // Close sidebar on mobile after selection
          }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "live"
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Mic className="w-5 h-5" />
          <span className="font-medium">Live Meeting</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("history");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "history"
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="font-medium">History</span>
        </button>
      </nav>

      {/* Recent Meetings Mini-List (Only visible when on History tab) */}
      {meetingHistory.length > 0 && activeTab === "history" && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Recent Meetings
          </h3>
          <div className="space-y-2">
            {meetingHistory.slice(0, 5).map((meeting) => (
              <div
                key={meeting.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <div className="font-medium text-sm text-gray-800">
                  {meeting.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">{meeting.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
