import React, { useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, FileText } from "lucide-react";

const LiveSession = ({
  isRecording,
  recordingStatus,
  audioSource,
  onStartRecording,
  onStopRecording,
  currentMeeting,
  transcript,
}) => {
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Live Meeting</h2>
          {isRecording && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-600">
                Recording
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            {audioSource === "mic" && <Mic className="w-4 h-4" />}
            {audioSource === "system" && <Volume2 className="w-4 h-4" />}
            {audioSource === "both" && (
              <>
                <Mic className="w-4 h-4" />+<Volume2 className="w-4 h-4" />
              </>
            )}
            <span>
              {audioSource === "mic"
                ? "Microphone"
                : audioSource === "system"
                ? "System Audio"
                : "Mic + System"}
            </span>
          </div>

          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`flex items-center space-x-3 px-8 py-4 rounded-full font-semibold text-white transition-all transform hover:scale-105 ${
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-6 h-6" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6" />
                <span>Start Recording</span>
              </>
            )}
          </button>

          {recordingStatus && (
            <div className="text-sm text-gray-600 mt-2">{recordingStatus}</div>
          )}
        </div>
      </div>

      {/* Transcript Area */}
      {(transcript || isRecording) && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Live Transcript
            </h3>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap">
              {transcript || "Waiting for audio..."}
            </p>
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSession;
