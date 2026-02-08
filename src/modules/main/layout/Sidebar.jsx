import React from "react";
import { Mic, Clock } from "lucide-react";
import { useNavigate } from "react-router";

const Sidebar = ({
  isOpen,
  activeTab,
  setActiveTab,
  setSidebarOpen,
  meetingHistory,
}) => {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    if (tab === "live") {
      navigate("/");
    } else {
      navigate("/");
    }

    if (typeof setActiveTab === "function") {
      setActiveTab(tab);
    }

    if (typeof setSidebarOpen === "function") {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      className={`${
        isOpen ? "block" : "hidden"
      } lg:block w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex-shrink-0`}
    >
      <nav className="space-y-2">
        <button
          onClick={() => handleTabClick("live")}
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
          onClick={() => handleTabClick("history")}
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

      {/* Recent Meetings Mini-List */}
      {meetingHistory && meetingHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">
            Recent Meetings
          </h3>
          <div className="space-y-1">
            {meetingHistory.slice(0, 5).map((meeting) => (
              <div
                key={meeting.id}
                onClick={() => navigate(`/meeting/${meeting.id}`)}
                className="group p-3 hover:bg-indigo-50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-indigo-100"
              >
                <div className="font-semibold text-xs text-gray-700 group-hover:text-indigo-700 truncate">
                  {meeting.title}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {meeting.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
