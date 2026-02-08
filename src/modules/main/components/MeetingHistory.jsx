import React from "react";
import { Calendar, Clock, ChevronRight, FileText } from "lucide-react";
import { useNavigate } from "react-router";

const MeetingHistory = ({ history }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4">
      {history.map((meeting) => (
        <div
          key={meeting.id}
          onClick={() => navigate(`/meeting/${meeting.id}`)}
          className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer group flex items-start gap-4"
        >
          {/* Icon Badge */}
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex-shrink-0">
            <FileText size={24} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                {meeting.title}
              </h3>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                {meeting.date}
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                {meeting.duration}
              </span>
            </div>

            <div className="mt-4 relative">
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {meeting.summary}
              </p>
              {/* Optional: Visual indicator if text is processing */}
              {meeting.summary === "Processing..." && (
                <span className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center italic text-indigo-600 animate-pulse">
                  AI is generating summary...
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      {history.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-300" size={32} />
          </div>
          <p className="text-gray-500 font-medium">No meeting history found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Start a bot to see your first analysis here!
          </p>
        </div>
      )}
    </div>
  );
};

export default MeetingHistory;
