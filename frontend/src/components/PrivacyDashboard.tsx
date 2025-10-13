import React, { useState } from 'react'
import { Shield, Eye, EyeOff, Lock, Unlock, AlertTriangle, CheckCircle } from 'lucide-react'

const PrivacyDashboard: React.FC = () => {
  const [privacyMode, setPrivacyMode] = useState<'strict' | 'moderate' | 'relaxed'>('strict')
  const [anonymizationLevel, setAnonymizationLevel] = useState<'high' | 'medium' | 'low'>('high')

  const privacySettings = [
    {
      id: 'data-collection',
      name: 'Data Collection',
      description: 'Control what data is collected and stored',
      enabled: true,
      level: 'strict'
    },
    {
      id: 'selective-disclosure',
      name: 'Selective Disclosure',
      description: 'Choose what information to share with other agents',
      enabled: true,
      level: 'strict'
    },
    {
      id: 'anonymization',
      name: 'Anonymization',
      description: 'Automatically anonymize personal information',
      enabled: true,
      level: 'high'
    },
    {
      id: 'encryption',
      name: 'End-to-End Encryption',
      description: 'All communications encrypted by default',
      enabled: true,
      level: 'strict'
    },
    {
      id: 'consent',
      name: 'Consent Management',
      description: 'Granular consent for data processing',
      enabled: true,
      level: 'strict'
    }
  ]

  const trustMetrics = [
    { name: 'Privacy Score', value: 95, max: 100, color: 'text-green-400' },
    { name: 'Anonymization Level', value: 90, max: 100, color: 'text-blue-400' },
    { name: 'Encryption Strength', value: 100, max: 100, color: 'text-purple-400' },
    { name: 'Consent Compliance', value: 98, max: 100, color: 'text-yellow-400' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
          <Shield className="w-10 h-10 mr-3 text-purple-400" />
          Privacy <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Privacy by design with granular controls and real-time monitoring
        </p>
      </div>

      {/* Privacy Mode Selector */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Privacy Mode</h2>
        <div className="flex space-x-4">
          {[
            { value: 'strict', label: 'Strict', description: 'Maximum privacy protection' },
            { value: 'moderate', label: 'Moderate', description: 'Balanced privacy and functionality' },
            { value: 'relaxed', label: 'Relaxed', description: 'Minimal privacy restrictions' }
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => setPrivacyMode(mode.value as any)}
              className={`flex-1 p-4 rounded-lg border transition-all ${
                privacyMode === mode.value
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <div className="font-medium">{mode.label}</div>
              <div className="text-sm opacity-75">{mode.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Privacy Controls</h3>
          <div className="space-y-4">
            {privacySettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    {setting.enabled ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white">{setting.name}</div>
                    <div className="text-sm text-gray-400">{setting.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`privacy-indicator ${
                    setting.level === 'strict' ? 'privacy-strict' :
                    setting.level === 'moderate' ? 'privacy-moderate' :
                    'privacy-relaxed'
                  }`}>
                    {setting.level}
                  </span>
                  <button className="p-1 hover:bg-white/10 rounded">
                    {setting.enabled ? (
                      <Unlock className="w-4 h-4 text-green-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Privacy Metrics</h3>
          <div className="space-y-4">
            {trustMetrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{metric.name}</span>
                  <span className={`font-semibold ${metric.color}`}>
                    {metric.value}/{metric.max}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(metric.value / metric.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anonymization Controls */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Anonymization Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'high', label: 'High', description: 'Maximum anonymization' },
            { value: 'medium', label: 'Medium', description: 'Balanced anonymization' },
            { value: 'low', label: 'Low', description: 'Minimal anonymization' }
          ].map((level) => (
            <button
              key={level.value}
              onClick={() => setAnonymizationLevel(level.value as any)}
              className={`p-4 rounded-lg border transition-all ${
                anonymizationLevel === level.value
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {level.value === 'high' ? (
                  <EyeOff className="w-5 h-5" />
                ) : level.value === 'medium' ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
                <span className="font-medium">{level.label}</span>
              </div>
              <div className="text-sm opacity-75">{level.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Status */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Privacy Status: Secure</h3>
        </div>
        <p className="text-gray-300">
          All privacy controls are active and functioning correctly. Your data is protected with 
          end-to-end encryption and selective disclosure is enabled.
        </p>
      </div>
    </div>
  )
}

export default PrivacyDashboard

