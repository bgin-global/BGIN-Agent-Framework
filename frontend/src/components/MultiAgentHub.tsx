import React, { useState } from 'react'
import { Archive, BookOpen, MessageSquare, Shield, Users, Zap } from 'lucide-react'

const MultiAgentHub: React.FC = () => {
  const [activeAgent, setActiveAgent] = useState<string | null>(null)

  const agents = [
    {
      id: 'archive',
      name: 'Archive Agent',
      description: 'Knowledge management and RAG system',
      icon: Archive,
      status: 'active',
      privacy: 'strict',
      trust: 'high',
      capabilities: ['Document Processing', 'Knowledge Synthesis', 'RAG Queries']
    },
    {
      id: 'codex',
      name: 'Codex Agent',
      description: 'Policy analysis and standards management',
      icon: BookOpen,
      status: 'active',
      privacy: 'strict',
      trust: 'high',
      capabilities: ['Policy Analysis', 'Standards Management', 'Governance Modeling']
    },
    {
      id: 'discourse',
      name: 'Discourse Agent',
      description: 'Community engagement and consensus building',
      icon: MessageSquare,
      status: 'active',
      privacy: 'moderate',
      trust: 'medium',
      capabilities: ['Forum Integration', 'Consensus Facilitation', 'Community Management']
    }
  ]

  const getPrivacyColor = (level: string) => {
    switch (level) {
      case 'strict': return 'privacy-strict'
      case 'moderate': return 'privacy-moderate'
      case 'relaxed': return 'privacy-relaxed'
      default: return 'privacy-strict'
    }
  }

  const getTrustColor = (level: string) => {
    switch (level) {
      case 'high': return 'trust-high'
      case 'medium': return 'trust-medium'
      case 'low': return 'trust-low'
      default: return 'trust-medium'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Multi-Agent <span className="gradient-text">Consciousness Hub</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Kyra's distributed consciousness system with privacy by design and dignity-based economics
        </p>
      </div>

      {/* System Status */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full agent-pulse"></div>
              <span className="text-white font-medium">System Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Privacy Enforced</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">Trust Network Active</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-sm text-gray-400">Active Agents</div>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const IconComponent = agent.icon
          return (
            <div
              key={agent.id}
              className={`agent-card cursor-pointer ${
                activeAgent === agent.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setActiveAgent(activeAgent === agent.id ? null : agent.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <IconComponent className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                    <p className="text-sm text-gray-400">{agent.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className={`privacy-indicator ${getPrivacyColor(agent.privacy)}`}>
                    {agent.privacy}
                  </span>
                  <span className={`trust-level ${getTrustColor(agent.trust)}`}>
                    {agent.trust}
                  </span>
                </div>
              </div>

              {activeAgent === agent.id && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-medium text-white mb-2">Capabilities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map((capability, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/10 text-white text-xs rounded-full"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Collaboration Features */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          Cross-Agent Collaboration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-purple-400 mb-2">Real-time</div>
            <div className="text-sm text-gray-300">Knowledge Synthesis</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-2">Privacy</div>
            <div className="text-sm text-gray-300">Selective Disclosure</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-2">Trust</div>
            <div className="text-sm text-gray-300">Network Consensus</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiAgentHub

