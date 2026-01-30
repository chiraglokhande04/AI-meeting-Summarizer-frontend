import React from "react";

const SettingsModal = ({
  backendUrl,
  setBackendUrl,
  audioSource,
  setAudioSource,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backend URL
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audio Source
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={audioSource}
              onChange={(e) => setAudioSource(e.target.value)}
            >
              <option value="mic">Microphone Only</option>
              <option value="system">System Audio Only</option>
              <option value="both">Both (Microphone + System Audio)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
