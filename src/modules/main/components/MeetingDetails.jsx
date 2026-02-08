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
import Sidebar from "../layout/Sidebar";

const MeetingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

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
      color = "#000000"
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
      doc.setTextColor(44, 62, 80); // Dark Blue/Gray
      doc.text(title.toUpperCase(), margin + 2, y);

      y += 10; // Space after header
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
      y
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
        addText(taskLine, 11, false, "#C0392B"); // Dark Red
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
          const originalMargin = margin;
          doc.text("", margin + 5, y);

          addText(`${t.discussion}`, 10, false, "#555555");
        }
        y += 2;
      });
    }

    const decisions = meeting.minutesOfMeeting?.decisions || [];
    if (decisions.length > 0) {
      addSectionHeader("Decisions Made");
      decisions.forEach((d) => {
        addText(`• ${d}`, 11, false, "#27AE60");
      });
    }

    // 8. OPEN QUESTIONS
    const questions = meeting.minutesOfMeeting?.openQuestions || [];
    if (questions.length > 0) {
      addSectionHeader("Open Questions");
      questions.forEach((q) => {
        addText(`? ${q}`, 11, false, "#D35400");
      });
    }

    if (meeting.sentiment) {
      addSectionHeader("Sentiment Analysis");
      const { positive, neutral, negative } = meeting.sentiment;
      addText(
        `Positive: ${positive}%   |   Neutral: ${neutral}%   |   Negative: ${negative}%`,
        11,
        true
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
      `${meeting.title || "meeting_report"}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userEmail={user?.email}
        onLogout={handleLogout}
      />

      <div className="flex max-w-7xl mx-auto">
        <Sidebar
          isOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          meetingHistory={[]} // Or pass history if you have it
        />

        <main className="flex-1 p-6 lg:p-10">
          {/* --- HEADER --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
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
                  <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    {new Date(meeting.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100">
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

          {/* --- DASHBOARD GRID --- */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* === LEFT COLUMN (2/3 Width) === */}
            <div className="xl:col-span-2 space-y-8">
              {/* 1. Executive Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Executive Summary
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-base">
                  {meeting.executiveSummary || "No summary generated."}
                </p>
              </div>

              {/* 2. Detailed Summary */}
              {meeting.detailedSummary && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <ClipboardList className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Detailed Breakdown
                    </h3>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-600">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {meeting.detailedSummary}
                    </p>
                  </div>
                </div>
              )}

              {/* 3. Topics Discussed */}
              {mom.topicsDiscussed && mom.topicsDiscussed.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <List className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Key Topics
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {mom.topicsDiscussed.map((t, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {t.topic}
                        </h4>
                        <p className="text-sm text-gray-600">{t.discussion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Full Transcript */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Transcript
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-[500px] overflow-y-auto">
                  <p className="whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed">
                    {meeting.transcript || "No transcript available."}
                  </p>
                </div>
              </div>
            </div>

            {/* === RIGHT COLUMN (1/3 Width) === */}
            <div className="space-y-6">
              {/* 1. Action Items (High Priority) */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-green-500">
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Action Items
                  </h3>
                </div>
                {mom.actionItems && mom.actionItems.length > 0 ? (
                  <ul className="space-y-3">
                    {mom.actionItems.map((a, i) => (
                      <li
                        key={i}
                        className="flex flex-col bg-green-50/50 p-3 rounded-xl border border-green-100"
                      >
                        <span className="font-medium text-gray-800 text-sm">
                          {a.task}
                        </span>
                        <div className="flex items-center gap-2 mt-2 text-xs text-green-700 font-medium">
                          <span className="bg-white px-2 py-0.5 rounded border border-green-100">
                            👤 {a.assignee || "Unassigned"}
                          </span>
                          <span className="bg-white px-2 py-0.5 rounded border border-green-100">
                            📅 {a.deadline || "TBD"}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No actions detected.
                  </p>
                )}
              </div>

              {/* 2. Decisions */}
              {mom.decisions && mom.decisions.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Gavel className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-800">
                      Decisions Made
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {mom.decisions.map((d, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3. Sentiment */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-bold text-gray-800">Sentiment</h3>
                </div>
                <div className="space-y-4">
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

              {/* 4. Attendees */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-800">Attendees</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mom.attendees && mom.attendees.length > 0 ? (
                    mom.attendees.map((a, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">
                      Unknown speakers
                    </span>
                  )}
                </div>
              </div>

              {/* 5. Open Questions */}
              {mom.openQuestions && mom.openQuestions.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-bold text-gray-800">
                      Open Questions
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {mom.openQuestions.map((q, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700 italic"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" />
                        "{q}"
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Small Helper Component for Sentiment Bars
const SentimentBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1.5">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="text-gray-900 font-bold">{value || 0}%</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${value || 0}%` }}
      />
    </div>
  </div>
);

export default MeetingDetails;
