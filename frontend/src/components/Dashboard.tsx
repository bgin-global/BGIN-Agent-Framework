// =====================================
// frontend/src/components/Dashboard.tsx
// =====================================

import React from 'react';
import { useAgents } from '../contexts/AgentContext';
import { usePrivacy } from '../contexts/PrivacyContext';

const Dashboard: React.FC = () => {
  const { agents } = useAgents();
  const { settings } = usePrivacy();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">BGIN AI Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Multi-agent privacy-preserving research platform for blockchain governance
        </p>
      </div>

      {/* Agent Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Agent Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{agent.name}</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    agent.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : agent.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {agent.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Session: {agent.sessionId}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Privacy Level:</span>
            <span className="text-sm font-medium text-gray-900 capitalize">
              {settings.level}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Anonymization:</span>
            <span className="text-sm font-medium text-gray-900">
              {settings.anonymization ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Data Retention:</span>
            <span className="text-sm font-medium text-gray-900">
              {settings.dataRetention} days
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Start New Session
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Upload Document
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Join Discussion
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
