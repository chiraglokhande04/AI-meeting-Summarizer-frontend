import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import Header from "./layout/Header";
import MeetingHistory from "./components/MeetingHistory";
import { Play, MessageSquare, AlertCircle, CheckCircle, Zap, Shield, FileText } from "lucide-react";

import api from "../api/api";
import { meetHistory, startBot } from "../api/meet";

const Home = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("live");
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
        summary: m.summary || m.executiveSummary || "No summary available",
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
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header
        userEmail={user?.email || "User"}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <main className="w-full h-full">
          {activeTab === "live" ? (
            <div className="max-w-4xl mx-auto space-y-12 mt-8">
              {/* HERO SECTION */}
              <div className="bg-white rounded-3xl shadow-sm p-10 md:p-14 text-center border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-8 shadow-inner">
                  <MessageSquare className="w-8 h-8 text-indigo-600" />
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                  Never miss a detail again.
                </h2>
                <p className="text-gray-500 mb-10 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  Paste your Google Meet URL below. Our AI assistant will silently join, transcribe, and generate actionable insights while you focus on the conversation.
                </p>

                <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="https://meet.google.com/abc-defg-hij"
                    className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-lg transition-all shadow-sm"
                    value={meetingUrl}
                    onChange={(e) => setMeetingUrl(e.target.value)}
                  />
                  <button
                    onClick={handleStartBot}
                    disabled={!meetingUrl}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Launch Bot
                  </button>
                </div>

                {/* Status Messages */}
                {botStatus && (
                  <div className={`mt-8 p-4 rounded-xl flex items-center gap-3 text-left max-w-2xl mx-auto animate-fade-in ${
                      botStatus.type === "error" ? "bg-red-50 text-red-700 border border-red-100"
                        : botStatus.type === "success" ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-blue-50 text-blue-700 border border-blue-100"
                    }`}
                  >
                    {botStatus.type === "error" && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    {botStatus.type === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                    <span className="font-medium">{botStatus.message}</span>
                  </div>
                )}
              </div>

              {/* FEATURES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Auto-Join</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">The bot enters your meeting seamlessly and silently, ensuring your privacy remains intact.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Transcription</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Advanced speaker detection mapping out exactly who said what, in real-time.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Actionable Analysis</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Instant generation of executive summaries, action items, and sentiment analysis.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-6xl mx-auto mt-4">
              <h2 className="text-2xl font-bold text-gray-900">Meeting History</h2>
              {isLoadingHistory ? (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-4">
                   <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
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