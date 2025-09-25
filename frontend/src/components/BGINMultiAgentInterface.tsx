import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Plus, Search, Filter, Hash, Shield, Users, Mic, Square, 
  Upload, ChevronDown, ChevronRight, MessageSquare, BookOpen, FileText, 
  Database, Download, Share, ExternalLink, Settings, Globe, GitBranch,
  Calendar, Clock, Network, Brain, Target, BarChart3, Layers, Lock, Eye, EyeOff,
  Key, Fingerprint, Activity, AlertTriangle, CheckCircle, XCircle, Minimize2,
  Maximize2, RefreshCw, UserCheck, ShieldCheck, Globe2, Cpu, Archive,
  Gavel, Users2, MessageCircle, FileSearch, Code, Scale, Zap, Menu,
  Bell, Heart, Star, TrendingUp, Award, Coffee, Lightbulb, X, Home,
  PieChart, LineChart, Workflow, TreePine, Link, BookOpenCheck, 
  Play, Pause, Volume2, VolumeX, Wifi, WifiOff, Monitor, Smartphone,
  Laptop, Tablet, Server, Cloud, HardDrive, Zap as Lightning,
  Trash2, Edit3, Copy, Save, FolderOpen, FilePlus, Image, Video,
  Music, File, Folder, ChevronLeft, ChevronUp, MoreHorizontal,
  RotateCcw, RotateCw, Maximize, Minimize, Move, GripVertical
} from 'lucide-react';

const BGINMultiAgentInterface = () => {
  const [selectedAgent, setSelectedAgent] = useState('archive');
  const [selectedSession, setSelectedSession] = useState('regulatory');
  const [messages, setMessages] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showLexicon, setShowLexicon] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeUsers, setActiveUsers] = useState([]);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [multiAgentMode, setMultiAgentMode] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState('selective');
  const [kwaaiConnected, setKwaaiConnected] = useState(false);
  const [fpProjectConnected, setFpProjectConnected] = useState(false);
  const [userDID, setUserDID] = useState('');
  const [reputationScore, setReputationScore] = useState(0);
  const [trustRelationships, setTrustRelationships] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showTrustNetwork, setShowTrustNetwork] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [activeView, setActiveView] = useState('chat');
  const [crossSessionInsights, setCrossSessionInsights] = useState(0);
  const [consensusItems, setConsensusItems] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showModelConfig, setShowModelConfig] = useState(false);
  const [showConversationHistory, setShowConversationHistory] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [currentModel, setCurrentModel] = useState('bgin-multi-agent-v1');
  const [modelTemperature, setModelTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const messagesEndRef = useRef(null);

  // Enhanced Three-Agent System Configuration with ToIP Framework
  const agentTypes = {
    archive: {
      id: 'archive',
      name: 'Archive Agent',
      description: 'Knowledge & RAG Systems',
      color: 'from-blue-500 to-cyan-600',
      icon: Archive,
      capabilities: ['Document Analysis', 'Knowledge Synthesis', 'Cross-Session Search', 'Research Correlation'],
      primaryFunction: 'Research and knowledge management',
      status: 'inactive',
      lastResponse: 'Never',
      performance: { accuracy: 0, speed: 0, correlations: 0 },
      recentActivity: 'Agent not yet initialized',
      // ToIP Framework Integration
      did: '', // Decentralized Identifier
      trustScore: 0,
      reputation: { overall: 0, accuracy: 0, reliability: 0, collaboration: 0, privacy: 0 },
      credentials: [], // Verifiable Credentials
      trustRelationships: [] // Trust network connections
    },
    codex: {
      id: 'codex',
      name: 'Codex Agent', 
      description: 'Policy & Standards Management',
      color: 'from-purple-500 to-pink-600',
      icon: Scale,
      capabilities: ['Policy Analysis', 'Standards Development', 'Compliance Check', 'Impact Assessment'],
      primaryFunction: 'Policy framework and governance modeling',
      status: 'inactive',
      lastResponse: 'Never',
      performance: { accuracy: 0, speed: 0, frameworks: 0 },
      recentActivity: 'Agent not yet initialized',
      // ToIP Framework Integration
      did: '', // Decentralized Identifier
      trustScore: 0,
      reputation: { overall: 0, accuracy: 0, reliability: 0, collaboration: 0, privacy: 0 },
      credentials: [], // Verifiable Credentials
      trustRelationships: [] // Trust network connections
    },
    discourse: {
      id: 'discourse',
      name: 'Discourse Agent',
      description: 'Communications & Collaboration',
      color: 'from-green-500 to-teal-600', 
      icon: MessageCircle,
      capabilities: ['Forum Integration', 'Consensus Building', 'Community Management', 'Discussion Facilitation'],
      primaryFunction: 'Community engagement and collaboration',
      status: 'inactive',
      lastResponse: 'Never',
      performance: { accuracy: 0, speed: 0, consensus: 0 },
      recentActivity: 'Agent not yet initialized',
      // ToIP Framework Integration
      did: '', // Decentralized Identifier
      trustScore: 0,
      reputation: { overall: 0, accuracy: 0, reliability: 0, collaboration: 0, privacy: 0 },
      credentials: [], // Verifiable Credentials
      trustRelationships: [] // Trust network connections
    }
  };

  // Session Configuration - Ready for Block 13
  const sessions = {
    keynote: {
      id: 'keynote',
      name: 'Opening Keynote',
      description: 'Strategic governance frameworks',
      status: 'planning',
      participants: 0,
      trending: false,
      agents: {
        archive: { knowledgeBase: 'No documents loaded', documents: 0, correlations: 0 },
        codex: { policyDomains: [], frameworks: 0, assessments: 0 },
        discourse: { activeThreads: 0, consensusItems: 0, engagementRate: 0 }
      }
    },
    technical: {
      id: 'technical',
      name: 'Technical Standards',
      description: 'Protocol development and standardization',
      status: 'planning',
      participants: 0,
      trending: false,
      agents: {
        archive: { knowledgeBase: 'No documents loaded', documents: 0, correlations: 0 },
        codex: { policyDomains: [], frameworks: 0, assessments: 0 },
        discourse: { activeThreads: 0, consensusItems: 0, engagementRate: 0 }
      }
    },
    regulatory: {
      id: 'regulatory',
      name: 'Regulatory Landscape',
      description: 'Policy analysis and compliance frameworks',
      status: 'planning',
      participants: 0,
      trending: false,
      agents: {
        archive: { knowledgeBase: 'No documents loaded', documents: 0, correlations: 0 },
        codex: { policyDomains: [], frameworks: 0, assessments: 0 },
        discourse: { activeThreads: 0, consensusItems: 0, engagementRate: 0 }
      }
    },
    privacy: {
      id: 'privacy',
      name: 'Privacy & Digital Rights',
      description: 'Privacy preservation and rights advocacy',
      status: 'planning',
      participants: 0,
      trending: false,
      agents: {
        archive: { knowledgeBase: 'No documents loaded', documents: 0, correlations: 0 },
        codex: { policyDomains: [], frameworks: 0, assessments: 0 },
        discourse: { activeThreads: 0, consensusItems: 0, engagementRate: 0 }
      }
    },
    governance: {
      id: 'governance',
      name: 'Cross-Chain Governance',
      description: 'Multi-chain governance mechanisms',
      status: 'planning',
      participants: 0,
      trending: false,
      agents: {
        archive: { knowledgeBase: 'No documents loaded', documents: 0, correlations: 0 },
        codex: { policyDomains: [], frameworks: 0, assessments: 0 },
        discourse: { activeThreads: 0, consensusItems: 0, engagementRate: 0 }
      }
    }
  };

  const currentAgent = agentTypes[selectedAgent];
  const currentSession = sessions[selectedSession];
  const currentSessionAgent = currentSession.agents[selectedAgent];

  // Trust network data - will be populated when users connect
  const trustNetwork = [];

  // Open WebUI-inspired model configuration
  const availableModels = [
    { id: 'bgin-multi-agent-v1', name: 'BGIN Multi-Agent v1.0', provider: 'BGIN', type: 'multi-agent', status: 'active' },
    { id: 'bgin-archive-v1', name: 'BGIN Archive Agent', provider: 'BGIN', type: 'archive', status: 'active' },
    { id: 'bgin-codex-v1', name: 'BGIN Codex Agent', provider: 'BGIN', type: 'codex', status: 'active' },
    { id: 'bgin-discourse-v1', name: 'BGIN Discourse Agent', provider: 'BGIN', type: 'discourse', status: 'active' },
    { id: 'ollama-llama2', name: 'Llama 2 70B', provider: 'Ollama', type: 'general', status: 'available' },
    { id: 'ollama-codellama', name: 'Code Llama 34B', provider: 'Ollama', type: 'code', status: 'available' },
    { id: 'openai-gpt4', name: 'GPT-4', provider: 'OpenAI', type: 'general', status: 'connected' },
    { id: 'anthropic-claude', name: 'Claude 3', provider: 'Anthropic', type: 'general', status: 'connected' }
  ];

  // Conversation history data - will be populated as users interact
  const conversationHistoryData = [];

  // Initialize messages for each agent-session combination
  useEffect(() => {
    const initialMessages = {};
    Object.keys(sessions).forEach(sessionId => {
      Object.keys(agentTypes).forEach(agentId => {
        const key = `${sessionId}-${agentId}`;
        const agent = agentTypes[agentId];
        const session = sessions[sessionId];
        
        initialMessages[key] = [
          {
            id: 1,
            type: 'assistant',
            content: `**${agent.name} Ready for Configuration** - ${session.name}\n\n**Status**: ${agent.status}\n**Specialization**: ${agent.description}\n**Primary Function**: ${agent.primaryFunction}\n\n**Current Capabilities**:\n${agent.capabilities.map(cap => `• ${cap}`).join('\n')}\n\n**Session Context**: ${session.description}\n\n**Data Population Required**:\n• Connect to external APIs and services\n• Load knowledge base and policy frameworks\n• Configure real-time data feeds\n• Set up user authentication and trust networks\n\n**See OPERATIONAL_DATA_GUIDE.md for detailed implementation steps**`,
            timestamp: new Date().toLocaleTimeString(),
            author: agent.name,
            agentType: agentId,
            sessionId
          }
        ];
      });
    });
    setMessages(initialMessages);
  }, []);

  const currentMessages = messages[`${selectedSession}-${selectedAgent}`] || [];

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const messageKey = multiAgentMode ? `${selectedSession}-multi` : `${selectedSession}-${selectedAgent}`;
      const newMessage = {
        id: Date.now(),
        type: 'user',
        content: inputValue,
        timestamp: new Date().toLocaleTimeString(),
        sessionId: selectedSession,
        agentType: selectedAgent,
        multiAgent: multiAgentMode,
        privacyLevel: privacyLevel
      };
      
      setMessages(prev => ({
        ...prev,
        [messageKey]: [...(prev[messageKey] || []), newMessage]
      }));
      
      setIsTyping(true);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'assistant',
          content: generateAgentResponse(inputValue, selectedAgent, selectedSession, multiAgentMode),
          timestamp: new Date().toLocaleTimeString(),
          author: multiAgentMode ? 'Multi-Agent System' : currentAgent.name,
          agentType: selectedAgent,
          sessionId: selectedSession,
          multiAgent: multiAgentMode,
          confidence: Math.random() * 0.3 + 0.7,
          sources: Math.floor(Math.random() * 8) + 3
        };
        setMessages(prev => ({
          ...prev,
          [messageKey]: [...(prev[messageKey] || []), aiResponse]
        }));
        setIsTyping(false);
      }, 1500);
      
      setInputValue('');
    }
  };

  const generateAgentResponse = (input, agentType, sessionId, isMultiAgent) => {
    const agent = agentTypes[agentType];
    const session = sessions[sessionId];
    
    if (isMultiAgent) {
      return `**Multi-Agent Collaboration Response**\n\n**Status**: System ready for ToIP framework implementation\n\n**Trust over IP Integration**:\n• **Layer 1 (Utility)**: Agent DIDs and verifiable credentials ready for deployment\n• **Layer 2 (Governance)**: Agent governance policies and trust protocols configured\n• **Layer 3 (Credential)**: Capability credentials and research verification ready\n• **Layer 4 (Application)**: Multi-agent interface with trust visualization\n\n**Agent Status**:\n• **Archive Agent**: Ready for DID creation and knowledge credential issuance\n• **Codex Agent**: Ready for policy analysis credential verification\n• **Discourse Agent**: Ready for community trust relationship establishment\n\n**ToIP Implementation Steps**:\n1. **Agent Identity**: Create DIDs for each agent using ToIP standards\n2. **Credential Issuance**: Issue verifiable credentials for agent capabilities\n3. **Trust Network**: Establish trust relationships between agents\n4. **Privacy Controls**: Implement selective disclosure and zero-knowledge proofs\n5. **Consensus Building**: Deploy ToIP-compliant consensus mechanisms\n\n**Implementation Guide**: See TOIP_AGENT_FRAMEWORK.md for detailed ToIP integration\n\n**Current Status**: All agents initialized with ToIP framework ready for deployment.`;
    }
    
    switch (agentType) {
      case 'archive':
        return `**Archive Agent Response**\n\n**Status**: ${agent.status}\n**DID**: ${agent.did || 'Not yet created'}\n**Trust Score**: ${agent.trustScore}\n**Knowledge Base**: ${currentSessionAgent.knowledgeBase}\n**Documents Available**: ${currentSessionAgent.documents}\n\n**Current Capabilities**:\n• Document analysis and processing\n• Knowledge synthesis and correlation\n• Cross-session research discovery\n• RAG (Retrieval Augmented Generation) queries\n\n**ToIP Framework Integration**:\n• **DID Creation**: Ready to create decentralized identifier\n• **Capability Credentials**: Ready for verifiable credential issuance\n• **Trust Relationships**: Ready to establish trust with other agents\n• **Privacy Controls**: Ready for selective disclosure protocols\n\n**Implementation Steps**:\n1. **Create Agent DID** - Generate decentralized identifier using ToIP standards\n2. **Issue Capability Credentials** - Create verifiable credentials for research capabilities\n3. **Connect to Trust Registry** - Register agent in ToIP trust registry\n4. **Set up Privacy Controls** - Implement selective disclosure for research data\n\n**Implementation**: Follow TOIP_AGENT_FRAMEWORK.md Section 2.1\n\n**Ready for**: ToIP framework deployment and knowledge base population`;
        
      case 'codex':
        return `**Codex Agent Response**\n\n**Status**: ${agent.status}\n**DID**: ${agent.did || 'Not yet created'}\n**Trust Score**: ${agent.trustScore}\n**Policy Domains**: ${currentSessionAgent.policyDomains.length > 0 ? currentSessionAgent.policyDomains.join(', ') : 'None configured'}\n**Frameworks Available**: ${currentSessionAgent.frameworks}\n\n**Current Capabilities**:\n• Policy analysis and compliance checking\n• Standards development and management\n• Governance modeling and assessment\n• Multi-jurisdictional impact analysis\n\n**ToIP Framework Integration**:\n• **Governance Layer**: Ready to implement ToIP governance policies\n• **Credential Verification**: Ready for policy analysis credential verification\n• **Trust Protocols**: Ready for consensus building with other agents\n• **Privacy Compliance**: Ready for privacy-preserving policy analysis\n\n**Implementation Steps**:\n1. **Create Agent DID** - Generate decentralized identifier for policy agent\n2. **Issue Policy Credentials** - Create verifiable credentials for policy analysis capabilities\n3. **Set up Governance Policies** - Implement ToIP-compliant governance rules\n4. **Configure Trust Protocols** - Establish trust relationships for policy collaboration\n\n**Implementation**: Follow TOIP_AGENT_FRAMEWORK.md Section 2.2\n\n**Ready for**: ToIP framework deployment and policy framework loading`;
        
      case 'discourse':
        return `**Discourse Agent Response**\n\n**Status**: ${agent.status}\n**DID**: ${agent.did || 'Not yet created'}\n**Trust Score**: ${agent.trustScore}\n**Active Threads**: ${currentSessionAgent.activeThreads}\n**Participants**: ${session.participants}\n**Engagement Rate**: ${currentSessionAgent.engagementRate}%\n\n**Current Capabilities**:\n• Community engagement and facilitation\n• Consensus building and polling\n• Discussion thread management\n• Trust relationship establishment\n\n**ToIP Framework Integration**:\n• **Trust Network**: Ready to establish trust relationships with community members\n• **Consensus Protocols**: Ready for ToIP-compliant consensus building\n• **Privacy Controls**: Ready for privacy-preserving community interactions\n• **Credential Exchange**: Ready for community member credential verification\n\n**Implementation Steps**:\n1. **Create Agent DID** - Generate decentralized identifier for community agent\n2. **Set up Trust Network** - Establish trust relationships with community members\n3. **Configure Consensus Mechanisms** - Implement ToIP-compliant consensus protocols\n4. **Enable Privacy Controls** - Set up selective disclosure for community interactions\n\n**Implementation**: Follow TOIP_AGENT_FRAMEWORK.md Section 2.3\n\n**Ready for**: ToIP framework deployment and community platform connection`;
        
      default:
        return `**Agent Response**: ${agent.name} is ${agent.status}. Please configure external service connections to activate full functionality.`;
    }
  };

  // Enhanced UI Components
  const AgentStatusBar = () => (
    <div className="bg-slate-800/30 backdrop-blur border-b border-blue-400/20 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Object.values(agentTypes).map((agent) => {
            const Icon = agent.icon;
            const isActive = selectedAgent === agent.id || multiAgentMode;
            return (
              <div key={agent.id} className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                isActive ? 'bg-gradient-to-r ' + agent.color + ' text-white' : 'text-slate-400'
              }`}>
                <Icon className="w-4 h-4" />
                <div className="text-xs">
                  <div className="font-medium">{agent.name}</div>
                  <div className="opacity-70">{agent.performance.accuracy}% • {agent.lastResponse}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`} />
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('analytics')}
            className={`p-2 rounded-lg transition-colors ${
              activeView === 'analytics' ? 'bg-blue-600' : 'bg-slate-700/50 hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowTrustNetwork(!showTrustNetwork)}
            className={`p-2 rounded-lg transition-colors ${
              showTrustNetwork ? 'bg-green-600' : 'bg-slate-700/50 hover:bg-slate-700'
            }`}
          >
            <Network className="w-4 h-4" />
          </button>
          <button className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors relative">
            <Bell className="w-4 h-4" />
            {notifications > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                {notifications}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const AgentSelector = () => (
    <div className="bg-slate-800/50 backdrop-blur border-b border-blue-400/30 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          Multi-Agent System
        </h2>
        <button
          onClick={() => setMultiAgentMode(!multiAgentMode)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            multiAgentMode 
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <Network className="w-4 h-4" />
          {multiAgentMode ? 'Multi-Agent Active' : 'Multi-Agent Mode'}
        </button>
      </div>
      
      {/* Agent Type Selector */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Object.values(agentTypes).map(agent => {
          const Icon = agent.icon;
          const isSelected = selectedAgent === agent.id;
          
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg text-center transition-all relative ${
                isSelected
                  ? 'bg-gradient-to-r ' + agent.color + ' text-white shadow-lg transform scale-105'
                  : 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 hover:scale-102'
              }`}
            >
              <Icon className="w-6 h-6" />
              <div>
                <div className="font-medium text-sm">{agent.name}</div>
                <div className="text-xs opacity-70">{agent.description}</div>
              </div>
              <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                agent.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              }`} />
              <div className="text-xs opacity-60 mt-1">
                {agent.performance.accuracy}% accuracy
              </div>
            </button>
          );
        })}
      </div>

      {/* Session Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-300">Block 13 Sessions</h3>
          <div className="text-xs text-slate-400">{crossSessionInsights} cross-session insights</div>
        </div>
        {Object.values(sessions).map(session => {
          const isSelected = selectedSession === session.id;
          const sessionAgent = session.agents[selectedAgent];
          
          return (
            <button
              key={session.id}
              onClick={() => setSelectedSession(session.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-r ' + currentAgent.color + ' text-white shadow-lg'
                  : 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-300'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{session.name}</span>
                  {session.trending && <TrendingUp className="w-3 h-3 text-orange-400" />}
                </div>
                <div className="text-xs opacity-70">{session.description}</div>
                {sessionAgent && (
                  <div className="text-xs mt-1 opacity-60 flex items-center gap-3">
                    {selectedAgent === 'archive' && (
                      <>
                        <span>{sessionAgent.documents} docs</span>
                        <span>{sessionAgent.correlations} correlations</span>
                      </>
                    )}
                    {selectedAgent === 'codex' && (
                      <>
                        <span>{sessionAgent.frameworks} frameworks</span>
                        <span>{sessionAgent.assessments} assessments</span>
                      </>
                    )}
                    {selectedAgent === 'discourse' && (
                      <>
                        <span>{sessionAgent.activeThreads} threads</span>
                        <span>{sessionAgent.engagementRate}% engagement</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  session.status === 'live' ? 'bg-red-400 animate-pulse' :
                  session.status === 'active' ? 'bg-green-400' :
                  session.status === 'upcoming' ? 'bg-yellow-400' :
                  'bg-gray-400'
                }`} />
                <span className="text-xs">{session.participants}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const PrivacyStatusBar = () => (
    <div className="bg-slate-800/50 backdrop-blur border-b border-blue-400/30 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-300">DID: {userDID.slice(-8)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-300">{trustRelationships} Trust Links</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-300">Rep: {reputationScore}</span>
          </div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-300">{crossSessionInsights} Insights</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={privacyLevel}
            onChange={(e) => setPrivacyLevel(e.target.value)}
            className="px-2 py-1 bg-slate-700/50 border border-slate-500/30 rounded text-xs text-slate-200 focus:border-blue-400 focus:outline-none"
            title="Select privacy level"
          >
            <option value="maximum">Maximum Privacy</option>
            <option value="high">High Privacy</option>
            <option value="selective">Selective Disclosure</option>
            <option value="minimal">Minimal Privacy</option>
          </select>
          
          <div className="flex items-center gap-1 text-xs">
            <div className={`w-2 h-2 rounded-full ${kwaaiConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-slate-300">Kwaai</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs">
            <div className={`w-2 h-2 rounded-full ${fpProjectConnected ? 'bg-blue-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-slate-300">FPP</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 bg-slate-800/50 backdrop-blur border-r border-blue-400/30 overflow-hidden`}>
        <AgentSelector />
        
        {/* Agent Capabilities Summary */}
        {!multiAgentMode && showLexicon && (
          <div className="p-4 border-t border-blue-400/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-blue-100">
                {currentAgent.name} Status
              </h3>
              <button
                onClick={() => setShowLexicon(false)}
                className="text-slate-400 hover:text-slate-200"
                title="Collapse capabilities"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {currentAgent.capabilities.map((capability, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-slate-700/20 rounded text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-slate-300">{capability}</span>
                </div>
              ))}
            </div>
            
            {currentSessionAgent && (
              <div className="mt-3 p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-lg">
                <div className="text-xs text-blue-200 mb-1">Current Activity</div>
                <div className="text-xs text-slate-300 mb-2">{currentAgent.recentActivity}</div>
                <div className="text-xs text-slate-400">
                  {selectedAgent === 'archive' && `${currentSessionAgent.documents} documents • ${currentSessionAgent.correlations} correlations`}
                  {selectedAgent === 'codex' && `${currentSessionAgent.frameworks} frameworks • ${currentSessionAgent.assessments} assessments`}
                  {selectedAgent === 'discourse' && `${currentSessionAgent.activeThreads} threads • ${currentSessionAgent.engagementRate}% engagement`}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Interface */}
      <div className="flex-1 flex flex-col">
        <PrivacyStatusBar />
        <AgentStatusBar />
        
        {/* Agent Header */}
        <div className="bg-slate-800/50 backdrop-blur border-b border-blue-400/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!showSidebar && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Show sidebar"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}
              <div className={`p-3 bg-gradient-to-r ${currentAgent.color} rounded-xl shadow-lg`}>
                <currentAgent.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {multiAgentMode ? 'Multi-Agent Collaboration Hub' : currentAgent.name}
                </h1>
                <p className="text-slate-300 text-sm">
                  {multiAgentMode ? 'Archive + Codex + Discourse Integration' : currentAgent.description}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-slate-400 text-xs">
                    Session: {currentSession.name} • {currentSession.participants} participants
                  </p>
                  {isTyping && (
                    <div className="flex items-center gap-1 text-xs text-blue-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>Agent responding...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {multiAgentMode && (
                <div className="flex items-center gap-1">
                  {Object.values(agentTypes).map((agent, index) => {
                    const Icon = agent.icon;
                    return (
                      <div key={agent.id} className="relative">
                        <div className={`p-2 bg-gradient-to-r ${agent.color} rounded-lg shadow-lg`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        {index < Object.values(agentTypes).length - 1 && (
                          <div className="absolute -right-2 top-1/2 w-4 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform -translate-y-1/2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-4xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center relative ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                      : message.multiAgent
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                      : `bg-gradient-to-r ${currentAgent.color}`
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-6 h-6" />
                    ) : message.multiAgent ? (
                      <Network className="w-6 h-6" />
                    ) : (
                      <currentAgent.icon className="w-6 h-6" />
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Lock className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 text-center max-w-20 truncate">
                    {message.type === 'user' ? 'You' : message.author}
                  </span>
                </div>
                
                <div className={`rounded-2xl px-6 py-4 backdrop-blur border ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white border-indigo-400/30'
                    : 'bg-slate-700/50 text-slate-100 border-blue-400/20'
                }`}>
                  <div className="text-sm leading-relaxed whitespace-pre-line mb-3">
                    {message.content}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{message.timestamp}</span>
                    <div className="flex items-center gap-3">
                      {message.type === 'assistant' && (
                        <>
                          <div className="flex items-center gap-1 text-blue-300">
                            <Brain className="w-3 h-3" />
                            <span>{message.multiAgent ? 'Multi-Agent' : message.agentType.charAt(0).toUpperCase() + message.agentType.slice(1)}</span>
                          </div>
                          {message.confidence && (
                            <div className="flex items-center gap-1 text-green-300">
                              <Target className="w-3 h-3" />
                              <span>{Math.round(message.confidence * 100)}%</span>
                            </div>
                          )}
                          {message.sources && (
                            <div className="flex items-center gap-1 text-yellow-300">
                              <BookOpenCheck className="w-3 h-3" />
                              <span>{message.sources} sources</span>
                            </div>
                          )}
                        </>
                      )}
                      <div className="flex items-center gap-1 text-green-300">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Privacy Protected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div className="bg-slate-800/50 backdrop-blur border-t border-blue-400/30 p-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <button className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </button>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                    isRecording 
                      ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                      : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                  }`}
                >
                  {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isRecording ? 'Stop Recording' : 'Voice Input'}
                </button>
                <button className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg text-sm hover:bg-orange-500/30 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  Forum Integration
                </button>
                <button className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
                  <Link className="w-4 h-4" />
                  Cross-Session Link
                </button>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={
                    multiAgentMode 
                      ? "Ask all agents to collaborate on your research question..."
                      : `Ask the ${currentAgent.name} about ${currentSession.name.toLowerCase()}...`
                  }
                  className="w-full p-4 bg-slate-700/50 border border-blue-400/30 rounded-xl text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 pr-20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-green-300">
                    <Lock className="w-3 h-3" />
                    <span className="text-xs capitalize">{privacyLevel}</span>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            {multiAgentMode ? (
              <>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  🔄 Cross-agent synthesis
                </button>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  📊 Comprehensive analysis
                </button>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  🏛️ Policy + Research + Community
                </button>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  🌐 Global consensus building
                </button>
              </>
            ) : selectedAgent === 'archive' ? (
              <>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  📚 Search knowledge base
                </button>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  🔍 Cross-session discovery
                </button>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  📄 Generate research summary
                </button>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  🔗 Find correlations
                </button>
              </>
            ) : selectedAgent === 'codex' ? (
              <>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  ⚖️ Analyze policy framework
                </button>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  🏛️ Compliance assessment  
                </button>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  📋 Standards development
                </button>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  🌍 Jurisdiction analysis
                </button>
              </>
            ) : (
              <>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  💬 Facilitate discussion
                </button>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  🗳️ Build consensus
                </button>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  🌐 Community engagement
                </button>
                <button className="px-3 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-sm rounded-lg transition-colors">
                  🤝 Build trust relationships
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BGINMultiAgentInterface;
