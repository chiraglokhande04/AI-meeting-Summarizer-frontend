import React from "react";
import { Download, CheckSquare, BarChart3 } from "lucide-react";

const MeetingAnalysis = ({ summary, actionItems, sentiment, onExport }) => {
  if (!summary) return null;

  return (
    <div className="space-y-6 mt-6">
      {/* Summary & Actions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Summary</h3>
            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export PDF</span>
            </button>
          </div>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Action Items
            </h3>
            <CheckSquare className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-indigo-600 rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {item.task}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>👤 {item.assignee}</span>
                    <span>📅 {item.deadline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sentiment */}
      {sentiment && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Sentiment Analysis
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {["positive", "neutral", "negative"].map((type) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${
                      type === "positive"
                        ? "text-green-600"
                        : type === "negative"
                        ? "text-red-600"
                        : "text-gray-600"
                    } capitalize`}
                  >
                    {type}
                  </span>
                  <span className="text-sm font-semibold">
                    {sentiment[type]}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      type === "positive"
                        ? "bg-green-500"
                        : type === "negative"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                    style={{ width: `${sentiment[type]}%` }}
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
