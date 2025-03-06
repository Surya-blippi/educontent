'use client';

import { useState } from 'react';

export default function VideoForm({ onSubmit, disabled }) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            Educational Topic
          </label>
          <input
            id="topic"
            type="text"
            placeholder="Enter a topic (e.g., Photosynthesis, The Water Cycle, Gravity)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            disabled={disabled}
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={disabled || !topic.trim()}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors duration-200"
          >
            {disabled ? 'Generating...' : 'Generate Video'}
          </button>
        </div>
      </form>
    </div>
  );
}