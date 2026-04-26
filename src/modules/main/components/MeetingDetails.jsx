import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  Download,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  CheckSquare,
  BarChart2,
  Users,
  HelpCircle,
  ClipboardList,
  Gavel,
  List,
} from "lucide-react";

import { getMeetingDetails } from "../../api/meet";
import { useAuth } from "../hooks/useAuth";
import Header from "../layout/Header";

const MeetingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  // NEW: State for Inner Layout Tabs
  const [activeInnerTab, setActiveInnerTab] = useState("summary");

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await getMeetingDetails(id);
        setMeeting(res.data || res);
      } catch (err) {
        console.error(err);
        alert("Failed to load meeting");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchMeeting();
  }, [id, navigate]);

  const handleExport = () => {
    if (!meeting) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxLineWidth = pageWidth - margin * 2;
    let y = 20;

    const addText = (
      text,
      fontSize = 10,
      isBold = false,
      color = "#000000",
    ) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(color);
      const textLines = doc.splitTextToSize(String(text || ""), maxLineWidth);
      const lineHeight = fontSize * 0.5;
      const blockHeight = textLines.length * lineHeight;
      if (y + blockHeight > pageHeight - margin) {
        doc.addPage();
        y = 20;
      }
      doc.text(textLines, margin, y);
      y += blockHeight + 2;
    };

    const addSectionHeader = (title) => {
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }
      y += 5;
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, y - 6, maxLineWidth, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(44, 62, 80);
      doc.text(title.toUpperCase(), margin + 2, y);
      y += 10;
    };

    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.text("Meeting Minutes", margin, y);
    y += 10;
    doc.setFontSize(16);
    doc.text(meeting.title || "Untitled Meeting", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    const dateStr =
      new Date(meeting.createdAt).toLocaleDateString() +
      " " +
      new Date(meeting.createdAt).toLocaleTimeString();
    doc.text(
      `${dateStr}  |  Duration: ${meeting.duration || "N/A"}`,
      margin,
      y,
    );
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    const attendees = meeting.minutesOfMeeting?.attendees || [];
    if (attendees.length > 0) {
      addText("Attendees: " + attendees.join(", "), 10, true, "#444444");
      y += 5;
    }
    if (meeting.executiveSummary) {
      addSectionHeader("Executive Summary");
      addText(meeting.executiveSummary, 11, false, "#333333");
      y += 5;
    }
    const actions = meeting.minutesOfMeeting?.actionItems || [];
    if (actions.length > 0) {
      addSectionHeader("Action Items");
      actions.forEach((item) => {
        const assignee = item.assignee ? `  [👤 ${item.assignee}]` : "";
        const deadline = item.deadline ? `  [📅 ${item.deadline}]` : "";
        const taskLine = `•  ${item.task}${assignee}${deadline}`;
        addText(taskLine, 11, false, "#C0392B");
      });
      y += 5;
    }
    if (meeting.detailedSummary) {
      addSectionHeader("Detailed Breakdown");
      addText(meeting.detailedSummary, 11, false, "#333333");
      y += 5;
    }
    const topics = meeting.minutesOfMeeting?.topicsDiscussed || [];
    if (topics.length > 0) {
      addSectionHeader("Key Topics Discussed");
      topics.forEach((t) => {
        addText(`• ${t.topic}`, 11, true, "#2980B9");
        if (t.discussion) {
          doc.text("", margin + 5, y);
          addText(`${t.discussion}`, 10, false, "#555555");
        }
        y += 2;
      });
    }
    const decisions = meeting.minutesOfMeeting?.decisions || [];
    if (decisions.length > 0) {
      addSectionHeader("Decisions Made");
      decisions.forEach((d) => addText(`• ${d}`, 11, false, "#27AE60"));
    }
    const questions = meeting.minutesOfMeeting?.openQuestions || [];
    if (questions.length > 0) {
      addSectionHeader("Open Questions");
      questions.forEach((q) => addText(`? ${q}`, 11, false, "#D35400"));
    }
    if (meeting.sentiment) {
      addSectionHeader("Sentiment Analysis");
      const { positive, neutral, negative } = meeting.sentiment;
      addText(
        `Positive: ${positive}%   |   Neutral: ${neutral}%   |   Negative: ${negative}%`,
        11,
        true,
      );
    }
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
    }
    doc.save(
      `${meeting.title || "meeting_report"}_${new Date().toISOString().slice(0, 10)}.pdf`,
    );
  };

  const handleLogout = () => setUser(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">
            Loading meeting details...
          </div>
        </div>
      </div>
    );
  }

  if (!meeting) return null;

  const mom = meeting.minutesOfMeeting || {};

  // Define inner tabs
  const INNER_TABS = [
    {
      id: "summary",
      label: "Executive Summary",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "breakdown",
      label: "Detailed Breakdown",
      icon: <ClipboardList className="w-4 h-4" />,
    },
    { id: "topics", label: "Key Topics", icon: <List className="w-4 h-4" /> },
    {
      id: "action-items",
      label: "Action Items",
      icon: <CheckSquare className="w-4 h-4" />,
    },
    {
      id: "decisions",
      label: "Decisions Made",
      icon: <Gavel className="w-4 h-4" />,
    },
    {
      id: "sentiment",
      label: "Sentiment",
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      id: "attendees",
      label: "Attendees",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "questions",
      label: "Open Questions",
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      id: "transcript",
      label: "Transcript",
      icon: <MessageSquare className="w-4 h-4" />,
    },
  ];

  // Helper to render specific content based on active tab
  const renderTabContent = () => {
    switch (activeInnerTab) {
      case "summary":
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Executive Summary
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              {meeting.executiveSummary || "No summary generated."}
            </p>
          </div>
        );
      case "breakdown":
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Detailed Breakdown
            </h3>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm prose prose-sm max-w-none text-gray-700">
              <p className="whitespace-pre-wrap leading-relaxed">
                {meeting.detailedSummary || "No detailed breakdown available."}
              </p>
            </div>
          </div>
        );
      case "topics":
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Key Topics Discussed
            </h3>
            <div className="space-y-4">
              {mom.topicsDiscussed?.length > 0 ? (
                mom.topicsDiscussed.map((t, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <h4 className="font-semibold text-gray-900 text-lg mb-2">
                      {t.topic}
                    </h4>
                    <p className="text-gray-600">{t.discussion}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  No key topics identified.
                </p>
              )}
            </div>
          </div>
        );
      case "action-items":
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Action Items
            </h3>
            {mom.actionItems?.length > 0 ? (
              <ul className="space-y-4">
                {mom.actionItems.map((a, i) => (
                  <li
                    key={i}
                    className="flex flex-col bg-green-50/50 p-5 rounded-2xl border border-green-100"
                  >
                    <span className="font-semibold text-gray-900 text-lg">
                      {a.task}
                    </span>
                    <div className="flex items-center gap-3 mt-3 text-sm text-green-800">
                      <span className="bg-white px-3 py-1 rounded-md border border-green-200 flex items-center gap-2">
                        <Users className="w-4 h-4" />{" "}
                        {a.assignee || "Unassigned"}
                      </span>
                      <span className="bg-white px-3 py-1 rounded-md border border-green-200 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {a.deadline || "TBD"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No actions detected.</p>
            )}
          </div>
        );
      case "decisions":
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Decisions Made
            </h3>
            {mom.decisions?.length > 0 ? (
              <ul className="space-y-3">
                {mom.decisions.map((d, i) => (
                  <li
                    key={i}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3 text-gray-800"
                  >
                    <Gavel className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{d}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No decisions recorded.</p>
            )}
          </div>
        );
      case "sentiment":
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Meeting Sentiment
            </h3>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-xl">
              <div className="space-y-6">
                <SentimentBar
                  label="Positive"
                  value={meeting.sentiment?.positive}
                  color="bg-green-500"
                />
                <SentimentBar
                  label="Neutral"
                  value={meeting.sentiment?.neutral}
                  color="bg-gray-400"
                />
                <SentimentBar
                  label="Negative"
                  value={meeting.sentiment?.negative}
                  color="bg-red-500"
                />
              </div>
            </div>
          </div>
        );
      case "attendees":
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Attendees</h3>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap gap-3">
              {mom.attendees?.length > 0 ? (
                mom.attendees.map((a, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg flex items-center gap-2"
                  >
                    <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-xs">
                      {a.charAt(0).toUpperCase()}
                    </div>
                    {a}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">Unknown speakers</span>
              )}
            </div>
          </div>
        );
      case "questions":
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Open Questions
            </h3>
            {mom.openQuestions?.length > 0 ? (
              <ul className="space-y-3">
                {mom.openQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex items-start gap-3 text-orange-900"
                  >
                    <HelpCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-lg italic">"{q}"</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                No open questions detected.
              </p>
            )}
          </div>
        );
      case "transcript":
        return (
          <div className="animate-fade-in h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Full Transcript
            </h3>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1 overflow-y-auto max-h-[600px]">
              <p className="whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed">
                {meeting.transcript || "No transcript available."}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      <Header userEmail={user?.email} onLogout={handleLogout} />

      {/* Main Content Container - Takes full width since Sidebar is gone */}
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 lg:p-8 overflow-hidden h-[calc(100vh-73px)]">
        
        {/* --- TOP HEADER BAR --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {meeting.title || "Untitled Meeting"}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1.5">
                <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  {new Date(meeting.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  {meeting.duration || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>

        {/* --- SPLIT PANE LAYOUT --- */}
        <div className="flex flex-col md:flex-row flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* INNER SIDEBAR (Navigation) */}
          <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-200 flex-shrink-0 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {INNER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveInnerTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    activeInnerTab === tab.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 bg-gray-50/30 p-6 lg:p-10 overflow-y-auto relative">
             <div className="max-w-4xl mx-auto h-full pb-10">
                {renderTabContent()}
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// Small Helper Component for Sentiment Bars
const SentimentBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-2">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-gray-900 font-bold">{value || 0}%</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${value || 0}%` }}
      />
    </div>
  </div>
);

export default MeetingDetails;