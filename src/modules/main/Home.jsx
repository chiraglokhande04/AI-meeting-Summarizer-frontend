import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import MeetingHistory from "./components/MeetingHistory";
import { Play, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";

import api from "../api/api";
import { meetHistory, startBot } from "../api/meet";

const Home = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("live");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [botStatus, setBotStatus] = useState(null);
  const [meetingHistoryData, setMeetingHistoryData] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/api/users/logout");
      setUser(null);
    } catch (e) {
      console.error("Logout error", e);
      setUser(null);
    }
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await meetHistory();
      const rawData = data.meetings || [];

      const formattedData = rawData.map((m) => ({
        id: m._id,
        title: m.title || `Meeting ${m._id.slice(-4)}`,
        date: new Date(m.createdAt).toLocaleDateString(),
        duration: m.duration || "Unknown",
        summary: m.summary || "Processing...",

        // ❌ OLD: actionItems: m.actionItems || [],
        // ✅ NEW: Extract just the 'task' text from the object
        actionItems: (m.actionItems || []).map((item) => item.task || item),

        transcript: m.transcript,
      }));
      setMeetingHistoryData(formattedData);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  const handleStartBot = async (e) => {
    e.preventDefault();
    if (!meetingUrl) return;

    setBotStatus({ type: "info", message: "🚀 Launching bot... Please wait." });

    try {
      // 2. Use your new 'startBot' helper here
      await startBot(meetingUrl);

      setBotStatus({
        type: "success",
        message:
          "✅ Bot joined! You can leave this tab. Check History later for results.",
      });
      setMeetingUrl("");
    } catch (err) {
      setBotStatus({
        type: "error",
        message: err.response?.data?.error || "❌ Failed to launch bot.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userEmail={user?.email || "User"}
        onLogout={handleLogout}
      />

      <div className="flex max-w-7xl mx-auto">
        <Sidebar
          isOpen={sidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSidebarOpen={setSidebarOpen}
          meetingHistory={meetingHistoryData}
        />

        <main className="flex-1 p-6">
          {activeTab === "live" ? (
            <div className="max-w-2xl mx-auto space-y-8 mt-10">
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
                <div className="inline-block p-4 bg-indigo-50 rounded-full mb-6">
                  <MessageSquare className="w-12 h-12 text-indigo-600" />
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  AI Meeting Assistant
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Paste your Google Meet URL below. Our bot will join, record,
                  and summarize everything for you.
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://meet.google.com/abc-defg-hij"
                      className="flex-1 px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                      value={meetingUrl}
                      onChange={(e) => setMeetingUrl(e.target.value)}
                    />
                    <button
                      onClick={handleStartBot}
                      disabled={!meetingUrl}
                      className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      Launch Bot
                    </button>
                  </div>
                </div>

                {/* Status Messages */}
                {botStatus && (
                  <div
                    className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-left ${
                      botStatus.type === "error"
                        ? "bg-red-50 text-red-700 border border-red-100"
                        : botStatus.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-blue-50 text-blue-700 border border-blue-100"
                    }`}
                  >
                    {botStatus.type === "error" && (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    {botStatus.type === "success" && (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="font-medium">{botStatus.message}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-gray-500">
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  🤖 <strong>Auto-Join</strong>
                  <br />
                  Bot enters securely
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  📝 <strong>Transcribe</strong>
                  <br />
                  Speaker detection included
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  📊 <strong>Analyze</strong>
                  <br />
                  Summary & Action items
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Meeting History
              </h2>
              {isLoadingHistory ? (
                <div className="p-12 text-center text-gray-500">
                  Loading your meetings...
                </div>
              ) : (
                <MeetingHistory
                  history={meetingHistoryData}
                  onExport={() => alert("PDF Export coming soon!")}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
