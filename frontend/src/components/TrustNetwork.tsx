import React, { useState } from 'react'
import { Users, Shield, Star, TrendingUp, Network, Award, Zap } from 'lucide-react'

const TrustNetwork: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const trustNodes = [
    {
      id: 'archive-agent',
      name: 'Archive Agent',
      type: 'agent',
      trustScore: 95,
      reputation: 'excellent',
      connections: 12,
      lastActive: '2 minutes ago',
      capabilities: ['Knowledge Management', 'RAG Processing', 'Document Analysis']
    },
    {
      id: 'codex-agent',
      name: 'Codex Agent',
      type: 'agent',
      trustScore: 92,
      reputation: 'excellent',
      connections: 15,
      lastActive: '1 minute ago',
      capabilities: ['Policy Analysis', 'Standards Management', 'Governance Modeling']
    },
    {
      id: 'discourse-agent',
      name: 'Discourse Agent',
      type: 'agent',
      trustScore: 88,
      reputation: 'good',
      connections: 8,
      lastActive: '5 minutes ago',
      capabilities: ['Community Management', 'Consensus Building', 'Forum Integration']
    },
    {
      id: 'kwaai-service',
      name: 'Kwaai Identity Service',
      type: 'service',
      trustScore: 98,
      reputation: 'excellent',
      connections: 25,
      lastActive: '30 seconds ago',
      capabilities: ['Identity Management', 'Privacy Controls', 'DID Verification']
    },
    {
      id: 'community-member-1',
      name: 'Community Member #1',
      type: 'user',
      trustScore: 75,
      reputation: 'good',
      connections: 5,
      lastActive: '1 hour ago',
      capabilities: ['Policy Contributions', 'Community Feedback']
    },
    {
      id: 'community-member-2',
      name: 'Community Member #2',
      type: 'user',
      trustScore: 82,
      reputation: 'good',
      connections: 7,
      lastActive: '30 minutes ago',
      capabilities: ['Knowledge Sharing', 'Trust Building']
    }
  ]

  const getReputationColor = (reputation: string) => {
    switch (reputation) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'fair': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 75) return 'text-blue-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'agent': return <Zap className="w-4 h-4" />
      case 'service': return <Shield className="w-4 h-4" />
      case 'user': return <Users className="w-4 h-4" />
      default: return <Network className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
          <Network className="w-10 h-10 mr-3 text-purple-400" />
          Trust <span className="gradient-text">Network</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Decentralized trust network with reputation-based consensus and dignity-based economics
        </p>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">6</div>
          <div className="text-sm text-gray-400">Active Nodes</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">89.2</div>
          <div className="text-sm text-gray-400">Avg Trust Score</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
          <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">72</div>
          <div className="text-sm text-gray-400">Total Connections</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
          <Shield className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">98%</div>
          <div className="text-sm text-gray-400">Network Health</div>
        </div>
      </div>

      {/* Trust Network Visualization */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Network Topology</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trustNodes.map((node) => (
            <div
              key={node.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedNode === node.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  {getNodeTypeIcon(node.type)}
                </div>
                <div className="font-medium text-white text-sm mb-1">{node.name}</div>
                <div className={`text-xs font-semibold ${getTrustScoreColor(node.trustScore)}`}>
                  {node.trustScore}/100
                </div>
                <div className={`text-xs ${getReputationColor(node.reputation)}`}>
                  {node.reputation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {(() => {
            const node = trustNodes.find(n => n.id === selectedNode)
            if (!node) return null
            
            return (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">{node.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReputationColor(node.reputation)}`}>
                      {node.reputation}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrustScoreColor(node.trustScore)}`}>
                      {node.trustScore}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Node Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white capitalize">{node.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Connections:</span>
                        <span className="text-white">{node.connections}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Active:</span>
                        <span className="text-white">{node.lastActive}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Capabilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {node.capabilities.map((capability, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/10 text-white text-xs rounded-full"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-medium text-white mb-3">Trust Score Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Reliability</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div className="bg-green-400 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                        <span className="text-white text-sm">95%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Consistency</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-400 h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                        <span className="text-white text-sm">88%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Transparency</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="text-white text-sm">92%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Trust Metrics */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Star className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Trust Network Status: Healthy</h3>
        </div>
        <p className="text-gray-300">
          The trust network is operating optimally with high reliability and strong consensus mechanisms. 
          All nodes are maintaining excellent reputation scores and contributing to the network's integrity.
        </p>
      </div>
    </div>
  )
}

export default TrustNetwork

