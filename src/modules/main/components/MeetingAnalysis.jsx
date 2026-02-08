import React from "react";
import { Download, CheckSquare, BarChart3, FileText } from "lucide-react";

const MeetingAnalysis = ({ summary, actionItems, sentiment, onExport }) => {
  if (!summary) return null;

  return (
    <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          Analysis Results
        </h2>
        <button
          onClick={onExport}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium shadow-sm active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* --- Summary Card --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Executive Summary</h3>
          </div>
          <div className="p-6 flex-1">
            <p className="text-gray-600 leading-relaxed text-base">{summary}</p>
          </div>
        </div>

        {/* --- Action Items Card --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckSquare className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Action Items</h3>
            <span className="ml-auto text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
              {actionItems?.length || 0} Tasks
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
            {actionItems && actionItems.length > 0 ? (
              <div className="space-y-3">
                {actionItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="group flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all"
                  >
                    <div className="mt-1">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 group-hover:text-indigo-900 transition-colors leading-snug">
                        {typeof item === "string" ? item : item.task}
                      </p>
                      {(item.assignee || item.deadline) && (
                        <div className="flex items-center gap-3 mt-2">
                          {item.assignee && (
                            <span className="text-xs flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                              👤 {item.assignee}
                            </span>
                          )}
                          {item.deadline && (
                            <span className="text-xs flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                              📅 {item.deadline}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
                <CheckSquare className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">No action items detected</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Sentiment Bar --- */}
      {sentiment && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            Sentiment Analysis
          </h3>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                label: "Positive",
                value: sentiment.positive,
                color: "bg-green-500",
                text: "text-green-600",
                bg: "bg-green-50",
              },
              {
                label: "Neutral",
                value: sentiment.neutral,
                color: "bg-gray-400",
                text: "text-gray-600",
                bg: "bg-gray-50",
              },
              {
                label: "Negative",
                value: sentiment.negative,
                color: "bg-red-500",
                text: "text-red-600",
                bg: "bg-red-50",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white p-4 rounded-xl border border-gray-100"
              >
                <div className="flex justify-between items-end mb-2">
                  <span className={`text-sm font-medium ${item.text}`}>
                    {item.label}
                  </span>
                  <span className="text-2xl font-bold text-gray-800">
                    {item.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingAnalysis;
