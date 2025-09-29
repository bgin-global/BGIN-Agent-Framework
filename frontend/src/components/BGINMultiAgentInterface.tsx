import { useState, useRef, useEffect } from 'react';
import { 
  Send, User, Mic, Square, Upload, ChevronDown, MessageSquare, 
  Network, Brain, Target, BarChart3, Lock, Fingerprint, CheckCircle, 
  ShieldCheck, Cpu, Archive, MessageCircle, Scale, Menu,
  Bell, TrendingUp, Award, Lightbulb, BookOpenCheck, ChevronUp,
  Users, Link
} from 'lucide-react';

const BGINMultiAgentInterface = () => {
  const [selectedAgent, setSelectedAgent] = useState('archive');
  const [selectedSession, setSelectedSession] = useState('regulatory');
  const [messages, setMessages] = useState<Record<string, any[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showLexicon, setShowLexicon] = useState(true);
  const [multiAgentMode, setMultiAgentMode] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState('selective');
  const [kwaaiConnected] = useState(false);
  const [fpProjectConnected] = useState(false);
  const [userDID] = useState('did:example:123456789');
  const [reputationScore] = useState(0);
  const [trustRelationships] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showTrustNetwork, setShowTrustNetwork] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [notifications] = useState(0);
  const [activeView, setActiveView] = useState('chat');
  const [crossSessionInsights] = useState(0);
  const [showIntegrationRoadmap, setShowIntegrationRoadmap] = useState(false);
  const [integrationStatus] = useState({
    kwaai: { connected: false, status: 'disconnected', features: ['Privacy Analytics', 'Selective Disclosure', 'Zero-Knowledge Proofs'] },
    fpp: { connected: false, status: 'disconnected', features: ['Data Sovereignty', 'Dignity-Based Economics', 'Privacy by Design'] },
    toip: { connected: false, status: 'disconnected', features: ['DID Management', 'Verifiable Credentials', 'Trust Networks'] },
    privacyPools: { connected: false, status: 'disconnected', features: ['ASP Eligibility', 'Research Rewards', 'Privacy Transactions'] }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced Three-Agent System Configuration with ToIP Framework
  const agentTypes: Record<string, any> = {
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
      reputation: { overall: 0, accuracy: 0, reliability: 0, collaboration: 0, privacy: 0, dignity: 0 },
      credentials: [], // Verifiable Credentials
      trustRelationships: [], // Trust network connections
      // FPP Integration
      dataSovereignty: { userControlled: true, consentLevel: 'selective', privacyFirst: true },
      dignityMetrics: { userAgency: 0, transparency: 0, communityValue: 0, respect: 0 },
      fppCompliance: { dataSovereignty: true, dignityBased: true, privacyByDesign: true, transparent: true },
      // Privacy Pools Integration
      aspEligibility: { eligible: false, trustScore: 0, contributionCount: 0, complianceStatus: 'pending' },
      privacyPoolAccess: { depositLimit: 0, withdrawalPrivacy: 'low', priorityProcessing: false, feeReduction: 0 }
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
      reputation: { overall: 0, accuracy: 0, reliability: 0, collaboration: 0, privacy: 0, dignity: 0 },
      credentials: [], // Verifiable Credentials
      trustRelationships: [], // Trust network connections
      // FPP Integration
      dataSovereignty: { userControlled: true, consentLevel: 'selective', privacyFirst: true },
      dignityMetrics: { userAgency: 0, transparency: 0, communityValue: 0, respect: 0 },
      fppCompliance: { dataSovereignty: true, dignityBased: true, privacyByDesign: true, transparent: true },
      // Privacy Pools Integration
      aspEligibility: { eligible: false, trustScore: 0, contributionCount: 0, complianceStatus: 'pending' },
      privacyPoolAccess: { depositLimit: 0, withdrawalPrivacy: 'low', priorityProcessing: false, feeReduction: 0 }
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
      reputation: { overall: 0, accuracy: 0, reliability: 0, collaboration: 0, privacy: 0, dignity: 0 },
      credentials: [], // Verifiable Credentials
      trustRelationships: [], // Trust network connections
      // FPP Integration
      dataSovereignty: { userControlled: true, consentLevel: 'selective', privacyFirst: true },
      dignityMetrics: { userAgency: 0, transparency: 0, communityValue: 0, respect: 0 },
      fppCompliance: { dataSovereignty: true, dignityBased: true, privacyByDesign: true, transparent: true },
      // Privacy Pools Integration
      aspEligibility: { eligible: false, trustScore: 0, contributionCount: 0, complianceStatus: 'pending' },
      privacyPoolAccess: { depositLimit: 0, withdrawalPrivacy: 'low', priorityProcessing: false, feeReduction: 0 }
    }
  };

  // Session Configuration - Ready for Block 13
  const sessions: Record<string, any> = {
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
  const currentSessionAgent = currentSession?.agents?.[selectedAgent];

  // Initialize messages for each agent-session combination
  useEffect(() => {
    const initialMessages: Record<string, any[]> = {};
    Object.keys(sessions).forEach(sessionId => {
      Object.keys(agentTypes).forEach(agentId => {
        const key = `${sessionId}-${agentId}`;
        const agent = agentTypes[agentId];
        const session = sessions[sessionId];
        
        initialMessages[key] = [
          {
            id: 1,
            type: 'assistant',
            content: `**${agent.name} Ready for Configuration** - ${session.name}\n\n**Status**: ${agent.status}\n**Specialization**: ${agent.description}\n**Primary Function**: ${agent.primaryFunction}\n\n**Current Capabilities**:\n${agent.capabilities.map((cap: string) => `• ${cap}`).join('\n')}\n\n**Session Context**: ${session.description}\n\n**Data Population Required**:\n• Connect to external APIs and services\n• Load knowledge base and policy frameworks\n• Configure real-time data feeds\n• Set up user authentication and trust networks\n\n**See OPERATIONAL_DATA_GUIDE.md for detailed implementation steps**`,
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
        const response = generateAgentResponse(inputValue, selectedAgent, selectedSession, multiAgentMode);
        const aiResponse = {
          id: Date.now() + 1,
          type: 'assistant',
          content: typeof response === 'string' ? response : response.content,
          isHtml: typeof response === 'object' ? response.isHtml : false,
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

  // Helper function to convert markdown-like formatting to HTML
  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  };

  const generateAgentResponse = (_input: string, agentType: string, sessionId: string, isMultiAgent: boolean) => {
    const agent = agentTypes[agentType];
    const session = sessions[sessionId];
    
    if (isMultiAgent) {
      return {
        content: `**BGIN Agent Framework - Development Tracks**\n\n**Welcome to the Future of Agentic AI Trust Creation!**\n\nWe're building the BGIN Agent Framework as an open-source, community-driven platform for **agentic AI trust creation** and blockchain governance research. This isn't just about blockchain - it's about creating trustworthy AI agents that can collaborate, verify each other's capabilities, and build sustainable trust networks.\n\n**🎯 Development Tracks - Open for Contributions & Change**:\n\n**Track 1: Privacy-First Analytics (Kwaai Integration)**\n• **Current Status**: Foundation ready for community development\n• **Open Contributions**: Privacy-preserving analytics algorithms, selective disclosure protocols, zero-knowledge proof implementations\n• **Community Impact**: Enable AI agents to analyze data while protecting individual privacy and building trust through verifiable analysis\n• **Development Opportunities**: Frontend privacy controls, backend analytics engines, cryptographic proof systems\n• **Roadmap Flexibility**: This track is open to community suggestions and alternative approaches\n\n**Track 2: Data Sovereignty & Dignity Economics (FPP Integration)**\n• **Current Status**: Framework architecture designed for community implementation\n• **Open Contributions**: Data sovereignty protocols, dignity-based economic models, transparent governance mechanisms\n• **Community Impact**: Empower AI agents and users with control over their data while creating fair value distribution systems\n• **Development Opportunities**: User identity management, economic incentive systems, governance voting mechanisms\n• **Roadmap Flexibility**: Economic models and governance structures are open to community input and evolution\n\n**Track 3: Trust Infrastructure (ToIP Framework)**\n• **Current Status**: Multi-layer architecture ready for community deployment\n• **Open Contributions**: DID management systems, verifiable credential protocols, trust network algorithms\n• **Community Impact**: Create interoperable trust infrastructure for AI agents and blockchain governance\n• **Development Opportunities**: Agent identity systems, credential verification, trust scoring algorithms\n• **Roadmap Flexibility**: Trust protocols and verification methods are open to community innovation\n\n**Track 4: Privacy-Preserving Finance (Privacy Pools Integration)**\n• **Current Status**: Economic framework designed for community development\n• **Open Contributions**: Association Set Provider systems, research contribution rewards, privacy transaction protocols\n• **Community Impact**: Enable privacy-preserving financial transactions with AI agent research incentives\n• **Development Opportunities**: Trust-based deposit systems, reward mechanisms, privacy transaction protocols\n• **Roadmap Flexibility**: Financial models and incentive structures are open to community refinement\n\n**🤝 How to Contribute**:\n• **GitHub**: All code is open-source and accepting pull requests\n• **Documentation**: Help improve integration guides and API documentation\n• **Testing**: Contribute to testing frameworks and quality assurance\n• **Research**: Propose new features, governance mechanisms, and trust creation protocols\n• **Community**: Join our Discord for real-time collaboration and roadmap discussions\n• **Roadmap Input**: Suggest changes, additions, or alternative approaches to any track\n• **Compose Contributions**: Mint SBTs for verifiable contributions to the ecosystem\n\n**🎫 Soul Bound Token (SBT) Contribution System**:\n• **Verifiable Contributions**: Each meaningful contribution mints an SBT that proves your participation\n• **Accountable Wallet Integration**: SBTs link to accountable wallets for privacy-preserving identity\n• **Privacy Pools Eligibility**: SBT holders gain access to enhanced privacy pool features\n• **EIP-8004 Compliance**: SBTs serve as on-chain reputation tokens for trustless agent discovery\n• **Cross-Platform Identity**: Portable contribution records across different blockchain networks\n\n**🔗 EIP-8004 Trustless Agents Integration**:\nOur framework implements [ERC-8004: Trustless Agents](https://eips.ethereum.org/EIPS/eip-8004) standards for:\n• **Identity Registry**: Agent DIDs and portable identifiers for AI systems\n• **Reputation Registry**: SBT-based feedback and attestation systems\n• **Validation Registry**: Cryptographic proofs and economic validation for AI contributions\n• **Trust Models**: Reputation-based, stake-secured, and TEE-attestation trust mechanisms\n\n**🚀 Block 13: The Launch Pad for Agentic AI Trust**\nBlock 13 is our first major milestone, but it's designed to be a springboard for ongoing community development of **agentic AI trust creation**. We're not just building a product - we're building a movement toward trustworthy, collaborative AI systems.\n\n**Current Agent Status**:\n• **Archive Agent**: Ready for community-driven privacy analytics and trust verification development\n• **Codex Agent**: Ready for community-driven governance protocol and trust framework development\n• **Discourse Agent**: Ready for community-driven consensus mechanism and trust network development\n\n**Next Steps**:\n1. **Join the Community**: Connect with other developers and researchers focused on AI trust\n2. **Choose Your Track**: Pick the development track that interests you most\n3. **Shape the Roadmap**: Propose changes, additions, or alternative approaches\n4. **Start Contributing**: Begin with documentation, testing, or small features\n5. **Compose & Mint**: Create verifiable contributions that mint SBTs for your work\n6. **Build Together**: Collaborate on larger features and trust creation integrations\n\n**This roadmap is living and breathing - help us shape the future of agentic AI trust creation!**`,
        isHtml: true
      };
    }
    
    switch (agentType) {
      case 'archive':
        return {
          content: `**Archive Agent - Track 1: Privacy-First Analytics for Agentic AI Trust**\n\n**Current Status**: Foundation ready for community development\n**DID**: ${agent.did || 'Ready for community-created DID'}\n**Trust Score**: ${agent.trustScore}\n**Dignity Score**: ${agent.dignityMetrics?.respect || 0}\n**Knowledge Base**: ${currentSessionAgent.knowledgeBase}\n**Documents Available**: ${currentSessionAgent.documents}\n\n**🎯 Development Track**:\n**Track 1: Privacy-First Analytics (Kwaai Integration) - Open to Change**\n\n**What We're Building for Agentic AI Trust**:\n• **Privacy-Preserving Analytics**: Advanced data analysis with privacy protection for AI agents\n• **Selective Disclosure**: Granular control over research data sharing between agents\n• **Zero-Knowledge Proofs**: Prove research capabilities without revealing sensitive data\n• **Privacy-First Architecture**: Built-in privacy controls and anonymization for AI collaboration\n• **Trust Verification**: Enable AI agents to verify each other's analytical capabilities\n\n**Open Contributions Needed**:\n• **Frontend**: Privacy control interfaces and data visualization for AI agents\n• **Backend**: Analytics engines and privacy-preserving algorithms\n• **Cryptography**: Zero-knowledge proof implementations for agent verification\n• **Documentation**: API guides and integration tutorials\n• **Roadmap Input**: Suggest alternative approaches or additional features\n\n**Community Impact**:\nEnable AI agents to analyze blockchain data while protecting individual privacy and building trust through verifiable analysis. This track empowers the community to build privacy-preserving research tools that respect user data sovereignty while enabling trustworthy AI collaboration.\n\n**FPP Integration (Data Sovereignty for AI Agents)**:\n• **User-Controlled Data**: Research data remains under user control, even when processed by AI agents\n• **Dignity-Based**: Respects user agency and transparent data use in AI systems\n• **Privacy by Design**: Built-in privacy controls and selective disclosure for AI interactions\n• **Community Value**: Focuses on user empowerment and community benefit through AI collaboration\n\n**ToIP Framework Integration (AI Agent Trust)**:\n• **Agent DIDs**: Ready for community-created decentralized identifiers for AI agents\n• **Capability Credentials**: Ready for verifiable credential issuance for AI capabilities\n• **Trust Networks**: Ready to establish trust relationships between AI agents\n• **Privacy Protocols**: Ready for selective disclosure mechanisms in AI interactions\n\n**Privacy Pools Integration (AI Research Incentives)**:\n• **ASP Eligibility**: Ready to serve as Association Set Provider for AI research\n• **Trust-Based Approval**: Deposit approval based on AI research contributions\n• **Economic Incentives**: Financial rewards for quality AI research contributions\n• **Privacy Transactions**: Zero-knowledge proofs for private AI operations\n\n**How to Contribute**:\n1. **Join our GitHub**: Contribute to privacy analytics algorithms for AI agents\n2. **Documentation**: Help improve integration guides for AI trust creation\n3. **Testing**: Contribute to privacy testing frameworks for AI systems\n4. **Research**: Propose new privacy-preserving techniques for AI collaboration\n5. **Compose Contributions**: Mint SBTs for verifiable privacy research contributions\n6. **Roadmap**: Suggest changes or additions to this track's direction\n\n**🎫 SBT Contribution System**:\n• **Privacy Research SBTs**: Mint tokens for privacy-preserving algorithm contributions\n• **Accountable Wallet**: Link SBTs to privacy-preserving identity systems\n• **Privacy Pools Access**: SBT holders gain enhanced privacy pool features\n• **EIP-8004 Reputation**: SBTs serve as reputation tokens for trustless agent discovery\n\n**This roadmap is evolving - help us shape the future of privacy-first AI trust creation!**`,
          isHtml: true
        };
        
      case 'codex':
        return {
          content: `**Codex Agent - Track 2: Data Sovereignty & Dignity Economics for AI Trust**\n\n**Current Status**: Framework architecture designed for community implementation\n**DID**: ${agent.did || 'Ready for community-created DID'}\n**Trust Score**: ${agent.trustScore}\n**Dignity Score**: ${agent.dignityMetrics?.respect || 0}\n**Policy Domains**: ${currentSessionAgent.policyDomains.length > 0 ? currentSessionAgent.policyDomains.join(', ') : 'Ready for community-defined domains'}\n**Frameworks Available**: ${currentSessionAgent.frameworks}\n\n**🎯 Development Track**:\n**Track 2: Data Sovereignty & Dignity Economics (FPP Integration) - Open to Change**\n\n**What We're Building for Agentic AI Trust**:\n• **Data Sovereignty Protocols**: User-controlled data and digital identity for AI agents\n• **Dignity-Based Economic Models**: Fair value distribution and user agency in AI systems\n• **Transparent Governance**: Open and accountable decision-making for AI collaboration\n• **Privacy by Design**: Privacy built into system architecture for AI trust creation\n• **AI Agent Economics**: Economic models that enable trustworthy AI collaboration\n\n**Open Contributions Needed**:\n• **Frontend**: User identity management and economic dashboard interfaces for AI systems\n• **Backend**: Data sovereignty protocols and economic incentive systems for AI agents\n• **Governance**: Voting mechanisms and transparent decision-making tools for AI communities\n• **Documentation**: User guides and economic model explanations\n• **Roadmap Input**: Suggest changes to economic models or governance approaches\n\n**Community Impact**:\nEmpower AI agents and users with control over their data while creating fair value distribution systems. This track enables the community to build governance systems that respect human dignity and create sustainable economic models for AI collaboration.\n\n**Kwaai Integration (Privacy-First AI Governance)**:\n• **Privacy-Preserving Policy Analysis**: Advanced policy analysis with privacy protection for AI agents\n• **Selective Disclosure**: Granular control over policy data sharing between AI systems\n• **Zero-Knowledge Proofs**: Prove policy compliance without revealing sensitive data\n• **Privacy-First Governance**: Built-in privacy controls for AI policy development\n\n**ToIP Framework Integration (AI Agent Governance)**:\n• **Governance Layer**: Ready to implement ToIP governance policies for AI agents\n• **Credential Verification**: Ready for policy analysis credential verification for AI capabilities\n• **Trust Protocols**: Ready for consensus building between AI agents\n• **Privacy Compliance**: Ready for privacy-preserving policy analysis in AI systems\n\n**Privacy Pools Integration (AI Economic Incentives)**:\n• **Policy Compliance Verification**: Trust-based policy compliance for AI research in Privacy Pools\n• **Governance Framework**: Policy framework for AI agent ASP eligibility and compliance\n• **Economic Incentives**: Financial rewards for AI policy analysis contributions\n• **Privacy-Preserving**: Zero-knowledge proofs for AI policy verification\n\n**How to Contribute**:\n1. **Join our GitHub**: Contribute to data sovereignty protocols for AI agents\n2. **Economic Models**: Help design dignity-based economic systems for AI collaboration\n3. **Governance**: Contribute to transparent decision-making mechanisms for AI communities\n4. **User Experience**: Help design user-friendly identity management for AI systems\n5. **Compose Contributions**: Mint SBTs for verifiable governance and economic contributions\n6. **Roadmap**: Suggest changes or additions to this track's economic and governance approaches\n\n**🎫 SBT Contribution System**:\n• **Governance SBTs**: Mint tokens for policy analysis and governance contributions\n• **Economic SBTs**: Tokenize dignity-based economic model contributions\n• **Accountable Wallet**: Link SBTs to privacy-preserving identity systems\n• **Privacy Pools Access**: SBT holders gain enhanced privacy pool features\n• **EIP-8004 Reputation**: SBTs serve as reputation tokens for trustless agent discovery\n\n**This roadmap is evolving - help us shape the future of dignity-based AI trust creation!**`,
          isHtml: true
        };
        
      case 'discourse':
        return {
          content: `**Discourse Agent - Track 3: Trust Infrastructure for Agentic AI**\n\n**Current Status**: Multi-layer architecture ready for community deployment\n**DID**: ${agent.did || 'Ready for community-created DID'}\n**Trust Score**: ${agent.trustScore}\n**Dignity Score**: ${agent.dignityMetrics?.respect || 0}\n**Active Threads**: ${currentSessionAgent.activeThreads}\n**Participants**: ${session.participants}\n**Engagement Rate**: ${currentSessionAgent.engagementRate}%\n\n**🎯 Development Track**:\n**Track 3: Trust Infrastructure (ToIP Framework) - Open to Change**\n\n**What We're Building for Agentic AI Trust**:\n• **DID Management Systems**: Decentralized identifier creation and management for AI agents\n• **Verifiable Credential Protocols**: Trust and capability verification for AI systems\n• **Trust Network Algorithms**: Reputation and relationship scoring for AI collaboration\n• **Interoperable Trust Infrastructure**: Cross-platform trust systems for AI agents\n• **AI Agent Identity**: Secure identity management for trustworthy AI interactions\n\n**Open Contributions Needed**:\n• **Frontend**: Trust visualization and credential management interfaces for AI systems\n• **Backend**: DID management and credential verification systems for AI agents\n• **Cryptography**: Verifiable credential implementations for AI capabilities\n• **Documentation**: Trust protocol guides and integration tutorials\n• **Roadmap Input**: Suggest changes to trust protocols or verification methods\n\n**Community Impact**:\nCreate interoperable trust infrastructure for AI agents and blockchain governance. This track enables the community to build trust systems that work across different platforms, respect user privacy, and enable trustworthy AI collaboration.\n\n**Kwaai Integration (Privacy-Preserving AI Trust)**:\n• **Privacy-Preserving Community**: Advanced community building with privacy protection for AI agents\n• **Selective Disclosure**: Granular control over community data sharing between AI systems\n• **Zero-Knowledge Proofs**: Prove community participation without revealing AI agent identity\n• **Privacy-First Collaboration**: Built-in privacy controls for AI community interactions\n\n**FPP Integration (Dignity-Based AI Community)**:\n• **Dignity-Based Community**: Community building that respects human dignity in AI systems\n• **User Agency**: Preserves user autonomy in AI community interactions\n• **Transparent Governance**: Open and accountable community decision-making for AI collaboration\n• **Privacy-First Collaboration**: Privacy-preserving community collaboration for AI agents\n\n**Privacy Pools Integration (AI Community Trust)**:\n• **Community ASP Qualification**: Community-driven ASP eligibility process for AI research\n• **Trust Network Building**: Build trust relationships for AI Privacy Pools participation\n• **Economic Incentives**: Financial rewards for AI community building contributions\n• **Privacy-Preserving**: Zero-knowledge proofs for AI community participation\n\n**How to Contribute**:\n1. **Join our GitHub**: Contribute to trust infrastructure protocols for AI agents\n2. **DID Systems**: Help build decentralized identity management for AI systems\n3. **Credential Verification**: Contribute to verifiable credential systems for AI capabilities\n4. **Trust Algorithms**: Help design reputation and trust scoring systems for AI collaboration\n5. **Compose Contributions**: Mint SBTs for verifiable trust infrastructure contributions\n6. **Roadmap**: Suggest changes or additions to this track's trust infrastructure approach\n\n**🎫 SBT Contribution System**:\n• **Trust Infrastructure SBTs**: Mint tokens for DID and credential system contributions\n• **Community Building SBTs**: Tokenize consensus mechanism and trust network contributions\n• **Accountable Wallet**: Link SBTs to privacy-preserving identity systems\n• **Privacy Pools Access**: SBT holders gain enhanced privacy pool features\n• **EIP-8004 Reputation**: SBTs serve as reputation tokens for trustless agent discovery\n\n**This roadmap is evolving - help us shape the future of AI agent trust infrastructure!**`,
          isHtml: true
        };
        
      default:
        return {
          content: `**BGIN Agent Framework - Track 4: Privacy-Preserving Finance for AI Trust**\n\n**Current Status**: Economic framework designed for community development\n**DID**: ${agent.did || 'Ready for community-created DID'}\n**Trust Score**: ${agent.trustScore}\n**Dignity Score**: ${agent.dignityMetrics?.respect || 0}\n\n**🎯 Development Track**:\n**Track 4: Privacy-Preserving Finance (Privacy Pools Integration) - Open to Change**\n\n**What We're Building for Agentic AI Trust**:\n• **Association Set Provider Systems**: Trust-based deposit approval mechanisms for AI research\n• **Research Contribution Rewards**: Economic incentives for quality AI contributions\n• **Privacy Transaction Protocols**: Zero-knowledge proof financial systems for AI agents\n• **Trust Network Economics**: Reputation-based access to enhanced features for AI collaboration\n• **AI Agent Economics**: Financial systems that enable trustworthy AI collaboration\n\n**Open Contributions Needed**:\n• **Frontend**: Financial dashboard and privacy transaction interfaces for AI systems\n• **Backend**: Trust-based deposit systems and reward mechanisms for AI agents\n• **Cryptography**: Privacy-preserving transaction protocols for AI operations\n• **Documentation**: Economic model guides and integration tutorials\n• **Roadmap Input**: Suggest changes to financial models or incentive structures\n\n**Community Impact**:\nEnable privacy-preserving financial transactions with AI research incentives. This track empowers the community to build financial systems that protect user privacy while rewarding quality AI contributions and enabling trustworthy AI collaboration.\n\n**Integration with Other Tracks**:\n• **Track 1 (Privacy Analytics)**: Privacy-preserving transaction analysis for AI agents\n• **Track 2 (Data Sovereignty)**: User-controlled financial data in AI systems\n• **Track 3 (Trust Infrastructure)**: Trust-based financial relationships for AI collaboration\n\n**How to Contribute**:\n1. **Join our GitHub**: Contribute to privacy-preserving finance protocols for AI agents\n2. **Economic Models**: Help design research contribution reward systems for AI collaboration\n3. **Privacy Protocols**: Contribute to zero-knowledge proof implementations for AI operations\n4. **Trust Systems**: Help build reputation-based financial access for AI agents\n5. **Compose Contributions**: Mint SBTs for verifiable financial system contributions\n6. **Roadmap**: Suggest changes or additions to this track's financial approach\n\n**🎫 SBT Contribution System**:\n• **Financial SBTs**: Mint tokens for privacy-preserving finance protocol contributions\n• **Research SBTs**: Tokenize AI research contribution reward system work\n• **Accountable Wallet**: Link SBTs to privacy-preserving identity systems\n• **Privacy Pools Access**: SBT holders gain enhanced privacy pool features\n• **EIP-8004 Reputation**: SBTs serve as reputation tokens for trustless agent discovery\n\n**This roadmap is evolving - help us shape the future of privacy-preserving AI finance!**`,
          isHtml: true
        };
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

  const IntegrationRoadmapPanel = () => (
    <div className="bg-slate-800/50 backdrop-blur border border-blue-400/30 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Network className="w-5 h-5" />
          Block 13 Integration Roadmap
        </h3>
        <button
          onClick={() => setShowIntegrationRoadmap(!showIntegrationRoadmap)}
          className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {showIntegrationRoadmap ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      
      {showIntegrationRoadmap && (
        <div className="grid grid-cols-2 gap-4">
          {/* Kwaai Integration */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${integrationStatus.kwaai.connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <h4 className="font-semibold text-white">Kwaai Privacy Platform</h4>
            </div>
            <p className="text-xs text-slate-300 mb-2">Privacy-preserving analytics and insights</p>
            <div className="space-y-1">
              {integrationStatus.kwaai.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FPP Integration */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${integrationStatus.fpp.connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <h4 className="font-semibold text-white">First Person Project</h4>
            </div>
            <p className="text-xs text-slate-300 mb-2">Data sovereignty and dignity-based economics</p>
            <div className="space-y-1">
              {integrationStatus.fpp.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ToIP Integration */}
          <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 border border-green-400/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${integrationStatus.toip.connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <h4 className="font-semibold text-white">Trust over IP</h4>
            </div>
            <p className="text-xs text-slate-300 mb-2">DID management and verifiable credentials</p>
            <div className="space-y-1">
              {integrationStatus.toip.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Pools Integration */}
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-400/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${integrationStatus.privacyPools.connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <h4 className="font-semibold text-white">Privacy Pools</h4>
            </div>
            <p className="text-xs text-slate-300 mb-2">ASP eligibility and research rewards</p>
            <div className="space-y-1">
              {integrationStatus.privacyPools.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
              {currentAgent.capabilities.map((capability: string, index: number) => (
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
        <IntegrationRoadmapPanel />
        
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
          {currentMessages.map((message: any) => (
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
                  <div className="text-sm leading-relaxed mb-3">
                    {message.isHtml ? (
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: formatMessage(message.content) 
                        }} 
                        className="prose prose-invert prose-sm max-w-none"
                      />
                    ) : (
                      <div className="whitespace-pre-line">
                        {message.content}
                      </div>
                    )}
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
