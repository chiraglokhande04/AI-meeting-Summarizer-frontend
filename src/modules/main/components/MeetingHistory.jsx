import React from "react";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router"; // Import hook

const MeetingHistory = ({ history }) => {
  const navigate = useNavigate(); // Initialize hook

  return (
    <div className="space-y-4">
      {history.map((meeting) => (
        <div
          key={meeting.id}
          // ✅ CLICK HANDLER: Navigate to details page
          onClick={() => navigate(`/meeting/${meeting.id}`)}
          className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {meeting.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {meeting.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {meeting.duration}
                </span>
              </div>
            </div>

            {/* Visual cue that it's clickable */}
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600" />
          </div>

          <p className="text-gray-600 mt-4 line-clamp-2">{meeting.summary}</p>
        </div>
      ))}

      {history.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
          No meeting history found. Start a bot to see results here!
        </div>
      )}
    </div>
  );
};

export default MeetingHistory;
