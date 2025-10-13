// =====================================
// frontend/src/components/collaboration/Collaboration.tsx
// =====================================

import React, { useState } from 'react';

const Collaboration: React.FC = () => {
  const [activeSession, setActiveSession] = useState<string>('keynote');

  const sessions = [
    { id: 'keynote', name: 'Opening Keynote', participants: 189, status: 'live' },
    { id: 'technical', name: 'Technical Standards', participants: 123, status: 'active' },
    { id: 'regulatory', name: 'Regulatory Landscape', participants: 156, status: 'active' },
    { id: 'privacy', name: 'Privacy & Digital Rights', participants: 87, status: 'upcoming' },
    { id: 'governance', name: 'Cross-Chain Governance', participants: 98, status: 'planning' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Multi-Agent Collaboration</h1>
        <p className="mt-2 text-gray-600">
          Real-time collaboration across archive, codex, and discourse agents
        </p>
      </div>

      {/* Session Selector */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                activeSession === session.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActiveSession(session.id)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{session.name}</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    session.status === 'live'
                      ? 'bg-red-100 text-red-800'
                      : session.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : session.status === 'upcoming'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {session.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {session.participants} participants
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Collaboration Interface */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Collaboration Workspace - {sessions.find(s => s.id === activeSession)?.name}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Archive Agent */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Archive Agent</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Documents:</span> 1,247
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Correlations:</span> 34
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Status:</span> Active
              </div>
            </div>
            <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium">
              Query Knowledge
            </button>
          </div>

          {/* Codex Agent */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Codex Agent</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Frameworks:</span> 23
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Assessments:</span> 12
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Status:</span> Active
              </div>
            </div>
            <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium">
              Analyze Policy
            </button>
          </div>

          {/* Discourse Agent */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Discourse Agent</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Active Threads:</span> 8
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Consensus Items:</span> 4
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Status:</span> Active
              </div>
            </div>
            <button className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium">
              Join Discussion
            </button>
          </div>
        </div>
      </div>

      {/* Synthesis Results */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Synthesis Results</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">
            Multi-agent synthesis results will appear here when agents collaborate on shared tasks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
