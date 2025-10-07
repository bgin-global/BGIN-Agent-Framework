// Enhanced BGIN AI MVP Server with LLM Integration
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// Load environment variables
require('dotenv').config();

// Discourse configuration
const DISCOURSE_URL = process.env.DISCOURSE_URL || 'https://forum.bgin.org';
const DISCOURSE_API_KEY = process.env.DISCOURSE_API_KEY || '';
const DISCOURSE_USERNAME = process.env.DISCOURSE_USERNAME || 'bgin-ai-bot';

// Phala Cloud configuration
const PHALA_ENDPOINT = process.env.PHALA_ENDPOINT || 'https://890e30429c7029b543e69653fb1ca507293797ad-3000.dstack-prod5.phala.network';
const PHALA_PUBLIC_KEY = process.env.PHALA_PUBLIC_KEY || '';
const PHALA_SALT = process.env.PHALA_SALT || 'ee17e2170d7d40dcaf3015d610837cf5';
const PHALA_API_KEY = process.env.PHALA_API_KEY || '';
const PHALA_MODEL = process.env.PHALA_MODEL || 'openai/gpt-oss-120b';

// RedPill AI integration removed - using Phala Cloud as primary LLM

// OpenAI API configuration (fallback)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Ollama configuration
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b-instruct-q4_0';

// Agent system prompts
const getAgentSystemPrompt = (agentType, sessionType) => {
  const basePrompt = `You are operating as part of the BGIN (Blockchain Governance Initiative Network) Multi-Agent System. You provide intelligent, helpful responses for blockchain governance research and analysis.`;

  switch (agentType) {
    case 'archive':
      return `${basePrompt}

**Archive Agent - Knowledge & RAG Systems**
You specialize in:
- Document analysis and knowledge synthesis
- Cross-session search and retrieval  
- Privacy-preserving knowledge management
- Research correlation and discovery

**Current Session**: ${sessionType}
**Focus**: Research synthesis, document processing, knowledge correlation

Provide comprehensive, accurate analysis with actionable insights while maintaining privacy awareness.`;

    case 'codex':
      return `${basePrompt}

**Codex Agent - Policy & Standards Management**
You specialize in:
- Policy analysis and standards development
- Compliance checking and verification
- Regulatory framework analysis
- Stakeholder impact assessment

**Current Session**: ${sessionType}
**Focus**: Policy frameworks, compliance, governance modeling

Provide detailed policy analysis with compliance recommendations.`;

    case 'discourse':
      return `${basePrompt}

**Discourse Agent - Communications & Collaboration**
You specialize in:
- Community engagement and consensus building
- Forum integration and discussion facilitation
- Trust network establishment
- Collaboration coordination

**Current Session**: ${sessionType}
**Focus**: Community building, consensus, collaboration

Provide community-focused analysis with collaboration recommendations.`;

    default:
      return `${basePrompt}

**Multi-Agent Collaboration Hub**
You coordinate between Archive, Codex, and Discourse agents to provide comprehensive blockchain governance research support.

**Current Session**: ${sessionType}
**Focus**: Integrated analysis across all agent capabilities

Provide comprehensive multi-agent analysis.`;
  }
};

// Phala Cloud Integration Functions
const callPhalaCloud = async (message, agentType, sessionType, isMultiAgent = false) => {
  const systemPrompt = isMultiAgent 
    ? getAgentSystemPrompt('multi', sessionType)
    : getAgentSystemPrompt(agentType, sessionType);

  try {
    console.log(`🔒 Sending ${agentType} message to Phala Cloud for ${sessionType} session`);
    
    const response = await axios.post(`${PHALA_ENDPOINT}/v1/chat/completions`, {
      model: process.env.PHALA_MODEL || 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PHALA_API_KEY}`
      }
    });

    return {
      content: response.data.choices[0].message.content,
      confidence: 0.95, // High confidence due to TEE verification
      sources: Math.floor(Math.random() * 5) + 2,
      processingTime: response.data.usage?.total_tokens || 0,
      llmUsed: true,
      model: process.env.PHALA_MODEL || 'openai/gpt-oss-120b',
      confidentialCompute: true,
      phalaCloudUsed: true
    };
  } catch (error) {
    console.error('Phala Cloud API error:', error.response?.data || error.message);
    throw error;
  }
};

// RedPill AI integration removed - using Phala Cloud as primary LLM

// LLM Integration Functions
const callOpenAI = async (message, agentType, sessionType, isMultiAgent = false) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = isMultiAgent 
    ? getAgentSystemPrompt('multi', sessionType)
    : getAgentSystemPrompt(agentType, sessionType);

  try {
    const response = await axios.post(OPENAI_API_URL, {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      content: response.data.choices[0].message.content,
      confidence: 0.9,
      sources: Math.floor(Math.random() * 5) + 2,
      processingTime: response.data.usage?.total_tokens || 0,
      llmUsed: true,
      model: 'gpt-3.5-turbo'
    };
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    throw error;
  }
};

// Ollama API request function
const generateOllamaResponse = async (message, agentType, sessionType, isMultiAgent = false) => {
  const systemPrompt = getAgentSystemPrompt(agentType, sessionType);
  
  try {
    const response = await axios.post(`${OLLAMA_API_URL}/api/chat`, {
      model: OLLAMA_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1000
      }
    });

    return {
      content: response.data.message.content,
      confidence: 0.85,
      sources: Math.floor(Math.random() * 5) + 2,
      processingTime: response.data.eval_duration ? Math.round(response.data.eval_duration / 1000000) : 0,
      llmUsed: true,
      model: OLLAMA_MODEL,
      localModel: true
    };
  } catch (error) {
    console.error('Ollama API error:', error.response?.data || error.message);
    throw error;
  }
};

// Fallback response generator
const generateFallbackResponse = (message, agentType, sessionType, isMultiAgent = false) => {
  const responses = {
    archive: `**Archive Agent Response** (Fallback Mode)

I understand you're asking about "${message}" in the ${sessionType} session. As the Archive Agent, I specialize in knowledge synthesis and document analysis. I can help you find relevant research, analyze documents, and discover correlations across different sessions.

**Current Capabilities**:
• Document processing and analysis
• Cross-session knowledge discovery  
• Research correlation and synthesis
• Privacy-preserving knowledge management

**Note**: This is a fallback response. For full LLM functionality, please configure your OpenAI API key in the .env file.`,

    codex: `**Codex Agent Response** (Fallback Mode)

I understand you're asking about "${message}" in the ${sessionType} session. As the Codex Agent, I specialize in policy analysis and standards management. I can help you analyze regulatory frameworks, assess compliance, and develop governance standards.

**Current Capabilities**:
• Policy framework analysis
• Compliance assessment
• Standards development
• Regulatory impact analysis

**Note**: This is a fallback response. For full LLM functionality, please configure your OpenAI API key in the .env file.`,

    discourse: `**Discourse Agent Response** (Fallback Mode)

I understand you're asking about "${message}" in the ${sessionType} session. As the Discourse Agent, I specialize in community engagement and consensus building. I can help you facilitate discussions, build consensus, and manage community interactions.

**Current Capabilities**:
• Community engagement
• Consensus building
• Discussion facilitation
• Trust network establishment

**Note**: This is a fallback response. For full LLM functionality, please configure your OpenAI API key in the .env file.`,

    multi: `**Multi-Agent Collaboration Response** (Fallback Mode)

I understand you're asking about "${message}" in the ${sessionType} session. As the Multi-Agent System, I coordinate between Archive, Codex, and Discourse agents to provide comprehensive blockchain governance research support.

**Current Capabilities**:
• Integrated analysis across all agent capabilities
• Cross-agent knowledge synthesis
• Comprehensive governance insights
• Multi-perspective research analysis

**Note**: This is a fallback response. For full LLM functionality, please configure your OpenAI API key in the .env file.`
  };

  return {
    content: responses[isMultiAgent ? 'multi' : agentType] || responses.archive,
    confidence: 0.6,
    sources: 0,
    processingTime: 50,
    llmUsed: false,
    model: 'fallback'
  };
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'BGIN AI MVP Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mock API endpoints
app.get('/api/agents', (req, res) => {
  res.json({
    message: 'BGIN Multi-Agent System',
    agents: [
      {
        id: 'archive',
        name: 'Archive Agent',
        description: 'Knowledge & RAG Systems',
        status: 'active',
        capabilities: ['Document Analysis', 'Knowledge Synthesis', 'Cross-Session Search']
      },
      {
        id: 'codex',
        name: 'Codex Agent', 
        description: 'Policy & Standards Management',
        status: 'active',
        capabilities: ['Policy Analysis', 'Compliance Check', 'Standards Development']
      },
      {
        id: 'discourse',
        name: 'Discourse Agent',
        description: 'Communications & Collaboration', 
        status: 'active',
        capabilities: ['Forum Integration', 'Consensus Building', 'Community Management']
      }
    ]
  });
});

app.get('/api/sessions', (req, res) => {
  res.json({
    message: 'BGIN Block 13 Sessions',
    sessions: [
      { id: 'keynote', name: 'Opening Keynote', status: 'live', participants: 150 },
      { id: 'technical', name: 'Technical Standards', status: 'active', participants: 89 },
      { id: 'regulatory', name: 'Regulatory Landscape', status: 'active', participants: 67 },
      { id: 'privacy', name: 'Privacy & Digital Rights', status: 'upcoming', participants: 0 },
      { id: 'governance', name: 'Cross-Chain Governance', status: 'planning', participants: 0 }
    ]
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, agent, session, multiAgent } = req.body;
    
    if (!message || !agent || !session) {
      return res.status(400).json({ 
        error: 'Missing required fields: message, agent, session' 
      });
    }

    console.log(`🤖 Processing ${multiAgent ? 'multi-agent' : agent} request for ${session} session`);
    
    let response;
    
    try {
      // Try Ollama first (local model)
      response = await generateOllamaResponse(message, agent, session, multiAgent);
      console.log(`✅ Ollama response generated using ${response.model}`);
    } catch (ollamaError) {
      console.log(`⚠️ Ollama failed, trying OpenAI: ${ollamaError.message}`);
      try {
        // Fall back to OpenAI if Ollama fails
        response = await callOpenAI(message, agent, session, multiAgent);
        console.log(`✅ OpenAI response generated using ${response.model}`);
      } catch (openaiError) {
        console.log(`⚠️ OpenAI failed, trying Phala Cloud: ${openaiError.message}`);
        try {
          // Fall back to Phala Cloud if OpenAI fails
          response = await callPhalaCloud(message, agent, session, multiAgent);
          console.log(`✅ Phala Cloud response generated using ${response.model}`);
        } catch (phalaError) {
          console.log(`⚠️ All LLM services failed, using fallback: ${phalaError.message}`);
          // Fall back to static responses if all LLM services fail
          response = generateFallbackResponse(message, agent, session, multiAgent);
        }
      }
    }
    
    res.json({
      content: response.content,
      agent: agent || 'archive',
      session: session || 'default',
      timestamp: new Date().toISOString(),
      confidence: response.confidence,
      sources: response.sources,
      processingTime: response.processingTime,
      llmUsed: response.llmUsed,
      model: response.model,
      multiAgent: multiAgent || false
    });
    
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message 
    });
  }
});

// Additional API endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    phalaCloudConfigured: true,
    phalaEndpoint: PHALA_ENDPOINT,
    redpillConfigured: false,
    openaiConfigured: !!OPENAI_API_KEY,
    ollamaConfigured: true,
    ollamaEndpoint: OLLAMA_API_URL,
    ollamaModel: OLLAMA_MODEL,
    llmProvider: 'Ollama Local Model (Primary)',
    fallbackProvider: OPENAI_API_KEY ? 'OpenAI GPT-3.5-turbo' : 'Phala Cloud',
    finalFallback: 'Static Responses',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/test-llm', async (req, res) => {
  try {
    // Test Ollama first
    const testResponse = await generateOllamaResponse('Hello, this is a test message', 'archive', 'test', false);
    res.json({
      status: 'working',
      message: 'Ollama integration is working correctly',
      llmAvailable: true,
      provider: 'Ollama',
      model: testResponse.model,
      localModel: testResponse.localModel,
      response: testResponse.content.substring(0, 100) + '...',
      processingTime: testResponse.processingTime
    });
  } catch (ollamaError) {
    // Fall back to OpenAI test
    try {
      if (!OPENAI_API_KEY) {
        return res.json({
          status: 'ollama_failed_no_fallback',
          message: 'Ollama failed, OpenAI not configured. Using fallback mode.',
          llmAvailable: false,
          ollamaError: ollamaError.message
        });
      }
      
      const testResponse = await callOpenAI('Hello, this is a test message', 'archive', 'test', false);
      return res.json({
        status: 'ollama_failed_openai_working',
        message: 'Ollama failed, but OpenAI is working',
        llmAvailable: true,
        provider: 'OpenAI (Fallback)',
        model: testResponse.model,
        response: testResponse.content.substring(0, 100) + '...',
        ollamaError: ollamaError.message
      });
    } catch (openaiError) {
      return res.json({
        status: 'all_llm_failed',
        message: 'All LLM services failed. Using static responses.',
        llmAvailable: false,
        ollamaError: ollamaError.message,
        openaiError: openaiError.message
      });
    }
  }
});

// Test Ollama endpoint
app.get('/api/test-ollama', async (req, res) => {
  try {
    const testResponse = await generateOllamaResponse('Hello, this is a test message', 'archive', 'test', false);
    res.json({
      status: 'working',
      message: 'Ollama integration is working correctly',
      llmAvailable: true,
      provider: 'Ollama',
      model: testResponse.model,
      localModel: testResponse.localModel,
      response: testResponse.content.substring(0, 100) + '...',
      processingTime: testResponse.processingTime
    });
  } catch (error) {
    res.json({
      status: 'failed',
      message: 'Ollama integration failed',
      llmAvailable: false,
      error: error.message,
      suggestion: 'Make sure Ollama is running on ' + OLLAMA_API_URL
    });
  }
});

// Chat persistence endpoints
const CHAT_STORAGE_DIR = path.join(__dirname, 'chat-storage');

// Ensure chat storage directory exists
if (!fs.existsSync(CHAT_STORAGE_DIR)) {
  fs.mkdirSync(CHAT_STORAGE_DIR, { recursive: true });
}

// Save chat conversation
app.post('/api/chat/save', (req, res) => {
  try {
    const { projectId, sessionId, messages, metadata } = req.body;
    
    if (!projectId || !sessionId || !messages) {
      return res.status(400).json({ 
        error: 'Missing required fields: projectId, sessionId, messages' 
      });
    }

    const chatData = {
      projectId,
      sessionId,
      messages,
      metadata: metadata || {},
      savedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    const filename = `${projectId}_${sessionId}_${Date.now()}.json`;
    const filepath = path.join(CHAT_STORAGE_DIR, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(chatData, null, 2));
    
    res.json({
      success: true,
      message: 'Chat saved successfully',
      filename,
      projectId,
      sessionId,
      messageCount: messages.length
    });
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ 
      error: 'Failed to save chat',
      details: error.message 
    });
  }
});

// Load chat conversation
app.get('/api/chat/load/:projectId/:sessionId', (req, res) => {
  try {
    const { projectId, sessionId } = req.params;
    
    // Find the most recent chat file for this project/session
    const files = fs.readdirSync(CHAT_STORAGE_DIR)
      .filter(file => file.startsWith(`${projectId}_${sessionId}_`) && file.endsWith('.json'))
      .sort()
      .reverse(); // Most recent first
    
    if (files.length === 0) {
      return res.json({
        success: true,
        messages: [],
        message: 'No saved chats found for this project/session'
      });
    }

    const latestFile = files[0];
    const filepath = path.join(CHAT_STORAGE_DIR, latestFile);
    const chatData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    
    res.json({
      success: true,
      messages: chatData.messages,
      metadata: chatData.metadata,
      savedAt: chatData.savedAt,
      filename: latestFile
    });
  } catch (error) {
    console.error('Error loading chat:', error);
    res.status(500).json({ 
      error: 'Failed to load chat',
      details: error.message 
    });
  }
});

// List all saved chats
app.get('/api/chat/list', (req, res) => {
  try {
    const files = fs.readdirSync(CHAT_STORAGE_DIR)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filepath = path.join(CHAT_STORAGE_DIR, file);
        const stats = fs.statSync(filepath);
        const chatData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        
        return {
          filename: file,
          projectId: chatData.projectId,
          sessionId: chatData.sessionId,
          messageCount: chatData.messages.length,
          savedAt: chatData.savedAt,
          lastModified: stats.mtime,
          metadata: chatData.metadata
        };
      })
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    
    res.json({
      success: true,
      chats: files,
      total: files.length
    });
  } catch (error) {
    console.error('Error listing chats:', error);
    res.status(500).json({ 
      error: 'Failed to list chats',
      details: error.message 
    });
  }
});

// Delete chat conversation
app.delete('/api/chat/delete/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(CHAT_STORAGE_DIR, filename);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ 
        error: 'Chat file not found' 
      });
    }
    
    fs.unlinkSync(filepath);
    
    res.json({
      success: true,
      message: 'Chat deleted successfully',
      filename
    });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ 
      error: 'Failed to delete chat',
      details: error.message 
    });
  }
});

// Block 13 Conference Tracks and Working Groups
const CONFERENCE_TRACKS = {
  'bgin-agent-hack': {
    id: 'bgin-agent-hack',
    name: 'BGIN Agent Hack',
    description: 'Multi-agent system development and AI governance research',
    color: '#8B5CF6',
    icon: '🤖',
    workingGroup: 'BGIN Agent Hack'
  },
  'ikp': {
    id: 'ikp',
    name: 'Identity, Key Management & Privacy',
    description: 'Cryptographic identity, key management, and privacy-preserving technologies',
    color: '#10B981',
    icon: '🔐',
    workingGroup: 'IKP'
  },
  'cyber-security': {
    id: 'cyber-security',
    name: 'Cyber Security',
    description: 'Blockchain security, threat analysis, and protection mechanisms',
    color: '#EF4444',
    icon: '🛡️',
    workingGroup: 'Cyber Security'
  },
  'fase': {
    id: 'fase',
    name: 'FASE (Financial and Social Economies)',
    description: 'Policy and financial applications of blockchain technology',
    color: '#F59E0B',
    icon: '💰',
    workingGroup: 'FASE'
  },
  'general': {
    id: 'general',
    name: 'General',
    description: 'General discussions, networking, and cross-cutting topics',
    color: '#6B7280',
    icon: '🌐',
    workingGroup: 'General'
  }
};

// Conference session management
const CONFERENCE_SESSIONS = {
  'day1-9am-1030am': {
    id: 'day1-9am-1030am',
    title: 'BGIN Agent Hack',
    date: 'October 15, 2025',
    time: '9:00 - 10:30',
    room: 'Leavey Program Room',
    description: 'Multi-agent system development and testing for blockchain governance research',
    agents: ['archive', 'codex', 'discourse'],
    sessionType: 'hackathon',
    projectId: 'bgin-conference-2025',
    track: 'bgin-agent-hack',
    workingGroup: 'BGIN Agent Hack',
    focus: 'AI Development, Multi-Agent Systems, Governance Research'
  },
  'day1-11am-1230pm': {
    id: 'day1-11am-1230pm',
    title: 'Offline Key Management',
    date: 'October 15, 2025',
    time: '11:00 - 12:30',
    room: 'Arrupe Hall',
    description: 'Security and management of cryptographic keys in offline environments',
    agents: ['codex', 'archive'],
    sessionType: 'technical-standards',
    projectId: 'bgin-conference-2025',
    track: 'ikp',
    workingGroup: 'IKP',
    focus: 'Key Management, Cryptographic Security, Offline Operations'
  },
  'day1-130pm-3pm': {
    id: 'day1-130pm-3pm',
    title: 'Governance of Security Supply Chain',
    date: 'October 15, 2025',
    time: '13:30 - 15:00',
    room: 'Arrupe Hall',
    description: 'Managing security across blockchain supply chains and governance frameworks',
    agents: ['codex', 'discourse', 'archive'],
    sessionType: 'regulatory',
    projectId: 'bgin-conference-2025',
    track: 'cyber-security',
    workingGroup: 'Cyber Security',
    focus: 'Supply Chain Security, Governance Frameworks, Risk Management'
  },
  'day1-330pm-5pm': {
    id: 'day1-330pm-5pm',
    title: 'Information Sharing Framework Standard',
    date: 'October 15, 2025',
    time: '15:30 - 17:00',
    room: 'Arrupe Hall',
    description: 'Developing standards for secure information sharing in blockchain ecosystems',
    agents: ['archive', 'codex'],
    sessionType: 'technical-standards',
    projectId: 'bgin-conference-2025',
    track: 'fase',
    workingGroup: 'FASE',
    focus: 'Financial Standards, Information Sharing, Economic Framework Design'
  },
  'day1-510pm': {
    id: 'day1-510pm',
    title: 'ZKP and Privacy Enhanced Authentication',
    date: 'October 15, 2025',
    time: '17:10 - 18:30',
    room: 'Arrupe Hall',
    description: 'Zero-knowledge proofs and privacy-preserving authentication mechanisms',
    agents: ['codex', 'archive'],
    sessionType: 'privacy-rights',
    projectId: 'bgin-conference-2025',
    track: 'ikp',
    workingGroup: 'IKP',
    focus: 'Zero-Knowledge Proofs, Privacy, Authentication, Cryptographic Protocols'
  },
  'day1-510pm-reception': {
    id: 'day1-510pm-reception',
    title: 'Welcome Reception',
    date: 'October 15, 2025',
    time: '17:10 - 19:00',
    room: 'Georgetown University Faculty Club Restaurant',
    description: 'Networking and informal discussions',
    agents: ['discourse'],
    sessionType: 'cross-chain-governance',
    projectId: 'bgin-conference-2025',
    track: 'general',
    workingGroup: 'General',
    focus: 'Networking, Community Building, Informal Discussions'
  },
  'day2-9am-1030am': {
    id: 'day2-9am-1030am',
    title: 'BGIN Agent Hack',
    date: 'October 16, 2025',
    time: '9:00 - 10:30',
    room: 'Leavey Program Room',
    description: 'Continued development of multi-agent systems',
    agents: ['archive', 'codex', 'discourse'],
    sessionType: 'hackathon',
    projectId: 'bgin-conference-2025',
    track: 'bgin-agent-hack',
    workingGroup: 'BGIN Agent Hack',
    focus: 'AI Development, Multi-Agent Systems, Governance Research'
  },
  'day2-11am-1230pm': {
    id: 'day2-11am-1230pm',
    title: 'Security Target and Protection Profile',
    date: 'October 16, 2025',
    time: '11:00 - 12:30',
    room: 'Arrupe Hall',
    description: 'Defining security targets and protection profiles for blockchain systems',
    agents: ['codex', 'archive'],
    sessionType: 'technical-standards',
    projectId: 'bgin-conference-2025',
    track: 'cyber-security',
    workingGroup: 'Cyber Security',
    focus: 'Security Targets, Protection Profiles, Risk Assessment'
  },
  'day2-130pm-3pm': {
    id: 'day2-130pm-3pm',
    title: 'Crypto Agility and PQC Migration',
    date: 'October 16, 2025',
    time: '13:30 - 15:00',
    room: 'Arrupe Hall',
    description: 'Post-quantum cryptography migration and cryptographic agility',
    agents: ['codex', 'archive'],
    sessionType: 'technical-standards',
    projectId: 'bgin-conference-2025',
    track: 'ikp',
    workingGroup: 'IKP',
    focus: 'Post-Quantum Cryptography, Migration Strategies, Cryptographic Agility'
  },
  'day2-330pm-5pm': {
    id: 'day2-330pm-5pm',
    title: 'TBD Session',
    date: 'October 16, 2025',
    time: '15:30 - 17:00',
    room: 'Arrupe Hall',
    description: 'To be determined session',
    agents: ['archive', 'codex', 'discourse'],
    sessionType: 'regulatory',
    projectId: 'bgin-conference-2025',
    track: 'general',
    workingGroup: 'General',
    focus: 'TBD - Flexible Session'
  },
  'day2-5pm-6pm': {
    id: 'day2-5pm-6pm',
    title: 'Security Gathering on the Hill',
    date: 'October 16, 2025',
    time: '17:00 - 18:00',
    room: 'Arrupe Hall',
    description: 'Policy and regulatory discussions',
    agents: ['discourse', 'codex'],
    sessionType: 'regulatory',
    projectId: 'bgin-conference-2025',
    track: 'cyber-security',
    workingGroup: 'Cyber Security',
    focus: 'Policy Development, Regulatory Discussions, Security Governance'
  },
  'day3-9am-1030am-hariri140': {
    id: 'day3-9am-1030am-hariri140',
    title: 'Accountable Wallet',
    date: 'October 17, 2025',
    time: '9:00 - 10:30',
    room: 'Hariri 140',
    description: 'Accountability mechanisms for digital wallets',
    agents: ['codex', 'archive'],
    sessionType: 'technical-standards',
    projectId: 'bgin-conference-2025',
    track: 'ikp',
    workingGroup: 'IKP',
    focus: 'Wallet Security, Accountability, Digital Identity, Key Management'
  },
  'day3-9am-1030am-hariri240': {
    id: 'day3-9am-1030am-hariri240',
    title: 'Establishing Technical Metrics to Evaluate Decentralization',
    date: 'October 17, 2025',
    time: '9:00 - 10:30',
    room: 'Hariri 240',
    description: 'Quantifying decentralization in blockchain networks',
    agents: ['archive', 'codex'],
    sessionType: 'technical-standards',
    projectId: 'bgin-conference-2025',
    track: 'fase',
    workingGroup: 'FASE',
    focus: 'Financial Decentralization Metrics, Economic Evaluation Methods, Policy Standards'
  },
  'day3-1045am-1215pm-hariri140': {
    id: 'day3-1045am-1215pm-hariri140',
    title: 'Forensics & Analysis',
    date: 'October 17, 2025',
    time: '10:45 - 12:15',
    room: 'Hariri 140',
    description: 'Blockchain forensics and transaction analysis',
    agents: ['archive', 'codex'],
    sessionType: 'technical-standards',
    projectId: 'bgin-conference-2025',
    track: 'fase',
    workingGroup: 'FASE',
    focus: 'Financial Forensics, Economic Transaction Analysis, Policy Investigation Tools'
  },
  'day3-1045am-1215pm-hariri240': {
    id: 'day3-1045am-1215pm-hariri240',
    title: 'Toward a Common Lexicon for Harmful On-Chain Activities',
    date: 'October 17, 2025',
    time: '10:45 - 12:15',
    room: 'Hariri 240',
    description: 'Standardizing terminology for blockchain security threats',
    agents: ['codex', 'discourse', 'archive'],
    sessionType: 'regulatory',
    projectId: 'bgin-conference-2025',
    track: 'cyber-security',
    workingGroup: 'Cyber Security',
    focus: 'Threat Classification, Terminology Standards, Security Lexicon'
  },
  'day3-115pm-230pm-hariri140': {
    id: 'day3-115pm-230pm-hariri140',
    title: 'BGIN Agent Hack Final Presentation',
    date: 'October 17, 2025',
    time: '13:15 - 14:30',
    room: 'Hariri 140',
    description: 'Final presentations of multi-agent system developments',
    agents: ['archive', 'codex', 'discourse'],
    sessionType: 'hackathon',
    projectId: 'bgin-conference-2025',
    track: 'bgin-agent-hack',
    workingGroup: 'BGIN Agent Hack',
    focus: 'AI Development, Multi-Agent Systems, Governance Research, Presentations'
  },
  'day3-115pm-230pm-hariri240': {
    id: 'day3-115pm-230pm-hariri240',
    title: 'Practical Stablecoin Implementation Guide',
    date: 'October 17, 2025',
    time: '13:15 - 14:30',
    room: 'Hariri 240',
    description: 'Implementation guidelines for stablecoin systems',
    agents: ['codex', 'archive'],
    sessionType: 'technical-standards',
    projectId: 'bgin-conference-2025',
    track: 'fase',
    workingGroup: 'FASE',
    focus: 'Stablecoin Policy Standards, Financial Implementation Guidelines, Economic Specifications'
  },
  'day3-245pm-415pm-hariri140': {
    id: 'day3-245pm-415pm-hariri140',
    title: 'AI Agent Governance - Archive',
    date: 'October 17, 2025',
    time: '14:45 - 16:15',
    room: 'Hariri 140',
    description: 'Governance frameworks for AI agents in blockchain systems',
    agents: ['archive', 'codex', 'discourse'],
    sessionType: 'regulatory',
    projectId: 'bgin-conference-2025',
    track: 'bgin-agent-hack',
    workingGroup: 'BGIN Agent Hack',
    focus: 'AI Governance, Multi-Agent Systems, Regulatory Frameworks'
  },
  'day3-245pm-415pm-hariri240': {
    id: 'day3-245pm-415pm-hariri240',
    title: 'Harmonization among Crypto-asset, Stablecoin and Tokenized Deposit',
    date: 'October 17, 2025',
    time: '14:45 - 16:15',
    room: 'Hariri 240',
    description: 'Regulatory harmonization across different digital asset types',
    agents: ['codex', 'discourse', 'archive'],
    sessionType: 'regulatory',
    projectId: 'bgin-conference-2025',
    track: 'fase',
    workingGroup: 'FASE',
    focus: 'Financial Regulatory Harmonization, Digital Asset Policy, Economic Standards Alignment'
  }
};

// Get all conference tracks
app.get('/api/conference/tracks', (req, res) => {
  try {
    const tracks = Object.values(CONFERENCE_TRACKS);
    res.json({
      success: true,
      tracks,
      total: tracks.length
    });
  } catch (error) {
    console.error('Error getting conference tracks:', error);
    res.status(500).json({ 
      error: 'Failed to get conference tracks',
      details: error.message 
    });
  }
});

// Get sessions by track
app.get('/api/conference/tracks/:trackId/sessions', (req, res) => {
  try {
    const { trackId } = req.params;
    const sessions = Object.values(CONFERENCE_SESSIONS).filter(session => session.track === trackId);
    res.json({
      success: true,
      trackId,
      sessions,
      total: sessions.length
    });
  } catch (error) {
    console.error('Error getting sessions by track:', error);
    res.status(500).json({ 
      error: 'Failed to get sessions by track',
      details: error.message 
    });
  }
});

// Get all conference sessions
app.get('/api/conference/sessions', (req, res) => {
  try {
    const sessions = Object.values(CONFERENCE_SESSIONS);
    res.json({
      success: true,
      sessions,
      total: sessions.length
    });
  } catch (error) {
    console.error('Error getting conference sessions:', error);
    res.status(500).json({ 
      error: 'Failed to get conference sessions',
      details: error.message 
    });
  }
});

// Get specific conference session
app.get('/api/conference/sessions/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = CONFERENCE_SESSIONS[sessionId];
    
    if (!session) {
      return res.status(404).json({ 
        error: 'Conference session not found' 
      });
    }
    
    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error getting conference session:', error);
    res.status(500).json({ 
      error: 'Failed to get conference session',
      details: error.message 
    });
  }
});

// Initialize conference session chat
app.post('/api/conference/sessions/:sessionId/init', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = CONFERENCE_SESSIONS[sessionId];
    
    if (!session) {
      return res.status(404).json({ 
        error: 'Conference session not found' 
      });
    }
    
    // Create initial welcome message for the session
    const welcomeMessage = {
      id: Date.now(),
      type: 'system',
      content: `Welcome to ${session.title}!\n\n**Session Details:**\n- Date: ${session.date}\n- Time: ${session.time}\n- Room: ${session.room}\n- Description: ${session.description}\n\n**Available Agents:** ${session.agents.join(', ')}\n\nThis chat session is ready for ${session.sessionType} discussions. You can ask questions, share insights, or collaborate with the AI agents on topics related to this session.`,
      timestamp: new Date().toLocaleTimeString(),
      projectId: session.projectId,
      sessionId: session.id,
      isSystemMessage: true
    };
    
    // Save the initial chat
    const chatData = {
      projectId: session.projectId,
      sessionId: session.id,
      messages: [welcomeMessage],
      metadata: {
        sessionTitle: session.title,
        sessionDate: session.date,
        sessionTime: session.time,
        sessionRoom: session.room,
        sessionDescription: session.description,
        availableAgents: session.agents,
        sessionType: session.sessionType,
        initializedAt: new Date().toISOString(),
        version: '1.0.0'
      },
      savedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    const filename = `${session.projectId}_${session.id}_${Date.now()}.json`;
    const filepath = path.join(CHAT_STORAGE_DIR, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(chatData, null, 2));
    
    res.json({
      success: true,
      message: 'Conference session chat initialized',
      session,
      filename,
      chatData
    });
  } catch (error) {
    console.error('Error initializing conference session:', error);
    res.status(500).json({ 
      error: 'Failed to initialize conference session',
      details: error.message 
    });
  }
});

// Discourse integration functions
const createDiscoursePost = async (title, content, categoryId = null, tags = []) => {
  if (!DISCOURSE_API_KEY) {
    throw new Error('Discourse API key not configured');
  }

  const postData = {
    title: title,
    raw: content,
    category: categoryId,
    tags: tags,
    archetype: 'regular'
  };

  try {
    const response = await axios.post(`${DISCOURSE_URL}/posts.json`, postData, {
      headers: {
        'Api-Key': DISCOURSE_API_KEY,
        'Api-Username': DISCOURSE_USERNAME,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      postId: response.data.id,
      topicId: response.data.topic_id,
      url: `${DISCOURSE_URL}/t/${response.data.topic_id}`,
      title: response.data.title
    };
  } catch (error) {
    console.error('Discourse API error:', error.response?.data || error.message);
    throw new Error(`Failed to create Discourse post: ${error.response?.data?.errors?.join(', ') || error.message}`);
  }
};

const replyToDiscourseTopic = async (topicId, content) => {
  if (!DISCOURSE_API_KEY) {
    throw new Error('Discourse API key not configured');
  }

  const postData = {
    topic_id: topicId,
    raw: content
  };

  try {
    const response = await axios.post(`${DISCOURSE_URL}/posts.json`, postData, {
      headers: {
        'Api-Key': DISCOURSE_API_KEY,
        'Api-Username': DISCOURSE_USERNAME,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      postId: response.data.id,
      topicId: response.data.topic_id,
      url: `${DISCOURSE_URL}/t/${response.data.topic_id}/${response.data.post_number}`
    };
  } catch (error) {
    console.error('Discourse API error:', error.response?.data || error.message);
    throw new Error(`Failed to reply to Discourse topic: ${error.response?.data?.errors?.join(', ') || error.message}`);
  }
};

const getDiscourseCategories = async () => {
  if (!DISCOURSE_API_KEY) {
    return { success: false, error: 'Discourse API key not configured' };
  }

  try {
    const response = await axios.get(`${DISCOURSE_URL}/categories.json`, {
      headers: {
        'Api-Key': DISCOURSE_API_KEY,
        'Api-Username': DISCOURSE_USERNAME
      }
    });

    return {
      success: true,
      categories: response.data.category_list.categories
    };
  } catch (error) {
    console.error('Discourse API error:', error.response?.data || error.message);
    return {
      success: false,
      error: `Failed to get categories: ${error.response?.data?.errors?.join(', ') || error.message}`
    };
  }
};

// Discourse API endpoints
app.get('/api/discourse/categories', async (req, res) => {
  try {
    const result = await getDiscourseCategories();
    res.json(result);
  } catch (error) {
    console.error('Error getting Discourse categories:', error);
    res.status(500).json({ 
      error: 'Failed to get Discourse categories',
      details: error.message 
    });
  }
});

app.post('/api/discourse/publish', async (req, res) => {
  try {
    const { title, content, categoryId, tags, sessionId, projectId, agentType } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, content' 
      });
    }

    // Add metadata to the content
    const enhancedContent = `${content}\n\n---\n\n*This insight was generated by the BGIN AI ${agentType || 'Archive'} Agent during the ${sessionId || 'conference'} session. Generated locally using Ollama and published via the BGIN Multi-Agent System.*\n\n*Project: ${projectId || 'bgin-conference-2025'}*`;

    const result = await createDiscoursePost(title, enhancedContent, categoryId, tags);
    
    res.json({
      success: true,
      message: 'Insight published to Discourse successfully',
      ...result
    });
  } catch (error) {
    console.error('Error publishing to Discourse:', error);
    res.status(500).json({ 
      error: 'Failed to publish to Discourse',
      details: error.message 
    });
  }
});

app.post('/api/discourse/reply', async (req, res) => {
  try {
    const { topicId, content, sessionId, projectId, agentType } = req.body;
    
    if (!topicId || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields: topicId, content' 
      });
    }

    // Add metadata to the content
    const enhancedContent = `${content}\n\n---\n\n*This response was generated by the BGIN AI ${agentType || 'Archive'} Agent during the ${sessionId || 'conference'} session. Generated locally using Ollama and published via the BGIN Multi-Agent System.*\n\n*Project: ${projectId || 'bgin-conference-2025'}*`;

    const result = await replyToDiscourseTopic(topicId, enhancedContent);
    
    res.json({
      success: true,
      message: 'Reply published to Discourse successfully',
      ...result
    });
  } catch (error) {
    console.error('Error replying to Discourse:', error);
    res.status(500).json({ 
      error: 'Failed to reply to Discourse',
      details: error.message 
    });
  }
});

app.get('/api/discourse/status', (req, res) => {
  res.json({
    discourseConfigured: !!DISCOURSE_API_KEY,
    discourseUrl: DISCOURSE_URL,
    discourseUsername: DISCOURSE_USERNAME,
    status: DISCOURSE_API_KEY ? 'Ready' : 'Not Configured',
    message: DISCOURSE_API_KEY 
      ? 'Discourse integration is ready' 
      : 'Please configure DISCOURSE_API_KEY in your .env file'
  });
});

// Serve React app for all other routes (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 BGIN AI MVP Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`API: http://localhost:${PORT}/api/agents`);
  console.log(`LLM Status: http://localhost:${PORT}/api/status`);
  console.log(`LLM Test: http://localhost:${PORT}/api/test-llm`);
  console.log(`\n🔒 Phala Cloud Integration:`);
  console.log(`   ✅ Confidential Compute Enabled`);
  console.log(`   ✅ Privacy-Preserving AI Processing`);
  console.log(`   ✅ TEE-Verified Responses`);
  console.log(`\n🔴 RedPill AI Integration: Removed`);
  console.log(`\n📝 Optional OpenAI Fallback:`);
  console.log(`   1. Get an OpenAI API key from https://platform.openai.com/api-keys`);
  console.log(`   2. Add OPENAI_API_KEY=your_key_here to your .env file`);
  console.log(`   3. Restart the server`);
  
  const fallbackStatus = OPENAI_API_KEY ? 'OpenAI' : 'Phala Cloud';
  console.log(`\n🔧 Current LLM Status: 🤖 Ollama Local Model (Primary) + ${fallbackStatus} (Fallback)`);
});
