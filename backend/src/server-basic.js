// Basic server for BGIN MVP
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'mock',
      redis: 'mock',
      vectorDb: 'mock',
      agents: 'mock'
    }
  });
});

// Mock API routes
app.get('/api/sessions', (req, res) => {
  res.json({
    message: 'BGIN Block 13 Sessions',
    sessions: [
      { id: 'keynote', name: 'Opening Keynote', status: 'live', participants_count: 189 },
      { id: 'technical', name: 'Technical Standards', status: 'active', participants_count: 123 },
      { id: 'regulatory', name: 'Regulatory Landscape', status: 'active', participants_count: 156 },
      { id: 'privacy', name: 'Privacy & Digital Rights', status: 'upcoming', participants_count: 87 },
      { id: 'governance', name: 'Cross-Chain Governance', status: 'planning', participants_count: 98 }
    ]
  });
});

app.get('/api/agents', (req, res) => {
  res.json({
    message: 'Multi-Agent System Status',
    agents: [
      { id: '1', agent_type: 'archive', session_id: 'keynote', name: 'Keynote Archive Agent' },
      { id: '2', agent_type: 'codex', session_id: 'keynote', name: 'Keynote Codex Agent' },
      { id: '3', agent_type: 'discourse', session_id: 'keynote', name: 'Keynote Discourse Agent' },
      { id: '4', agent_type: 'archive', session_id: 'technical', name: 'Technical Archive Agent' },
      { id: '5', agent_type: 'codex', session_id: 'technical', name: 'Technical Codex Agent' },
      { id: '6', agent_type: 'discourse', session_id: 'technical', name: 'Technical Discourse Agent' }
    ]
  });
});

app.get('/api/agents/archive', (req, res) => {
  res.json({
    message: 'Archive Agent - Knowledge & RAG Systems',
    status: 'active',
    capabilities: ['Document processing', 'Semantic search', 'Knowledge synthesis'],
    mockData: {
      documents: 1247,
      correlations: 34,
      lastActivity: new Date().toISOString()
    }
  });
});

app.get('/api/agents/codex', (req, res) => {
  res.json({
    message: 'Codex Agent - Policy & Standards Management',
    status: 'active',
    capabilities: ['Policy analysis', 'Compliance assessment', 'Stakeholder impact'],
    mockData: {
      frameworks: 23,
      assessments: 12,
      lastActivity: new Date().toISOString()
    }
  });
});

app.get('/api/agents/discourse', (req, res) => {
  res.json({
    message: 'Discourse Agent - Communications & Collaboration',
    status: 'active',
    capabilities: ['Community engagement', 'Consensus building', 'Trust network'],
    mockData: {
      activeThreads: 8,
      consensusItems: 4,
      lastActivity: new Date().toISOString()
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BGIN MVP server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Mode: Basic (no Docker)`);
  console.log(`Frontend: http://localhost:3000`);
  console.log(`API: http://localhost:4000`);
  console.log(`Health: http://localhost:4000/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
