# BGIN Multi-Agent Interface

A privacy-preserving, multi-agent research platform for blockchain governance, inspired by Open WebUI and designed for BGIN Block 13 sessions.

## 🌟 Features

### 🤖 Three-Agent System
- **Archive Agent** - Knowledge & RAG Systems (Blue theme)
- **Codex Agent** - Policy & Standards Management (Purple theme)  
- **Discourse Agent** - Communications & Collaboration (Green theme)

### 🏛️ Block 13 Sessions
- Opening Keynote (Live - 189 participants)
- Technical Standards (Active - 123 participants)
- Regulatory Landscape (Active - 156 participants)
- Privacy & Digital Rights (Upcoming - 87 participants)
- Cross-Chain Governance (Planning - 98 participants)

### 🔒 Privacy & Trust Features
- DID-based identity management
- Privacy level controls (Maximum/High/Selective/Minimal)
- Trust network visualization
- Anonymous researcher interactions
- Privacy-preserving research platform

### ⚡ Open WebUI-Inspired Features
- Model configuration panel
- Conversation history management
- File upload capabilities
- Real-time agent status monitoring
- Multi-agent collaboration mode
- Trust network visualization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/bgin-multi-agent-interface.git
cd bgin-multi-agent-interface
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Start development servers**
```bash
npm run dev
```

5. **Access the interface**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3000

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks + Context
- **Build Tool**: Vite

### Backend (Node.js + TypeScript)
- **Framework**: Express.js
- **Database**: PostgreSQL (with Redis for caching)
- **Authentication**: JWT + DID-based
- **Real-time**: Socket.io
- **AI Integration**: OpenAI, Anthropic, Ollama

### Multi-Agent System
- **Archive Agent**: Document analysis, knowledge synthesis, cross-session search
- **Codex Agent**: Policy analysis, standards development, compliance checking
- **Discourse Agent**: Forum integration, consensus building, community management

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:simple       # Start with simple backend
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm run test             # Run tests
npm run test:coverage    # Run tests with coverage
npm run lint             # Lint code
npm run lint:fix         # Fix linting issues

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database
npm run agents:seed      # Seed agent data
```

### Project Structure

```
bgin-govhack-mvp/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── BGINMultiAgentInterface.tsx
│   │   │   ├── agents/       # Agent-specific components
│   │   │   ├── privacy/      # Privacy components
│   │   │   └── trust/        # Trust network components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API services
│   │   └── types/            # TypeScript types
│   └── package.json
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── agents/           # Agent implementations
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── services/         # Business logic
│   │   └── utils/            # Utilities
│   └── package.json
├── database/                 # Database schemas
├── docs/                     # Documentation
└── scripts/                  # Setup scripts
```

## 🔐 Privacy & Security

- **DID-based Identity**: Decentralized identifier management
- **Privacy Levels**: Configurable privacy controls
- **Trust Networks**: Anonymous researcher interactions
- **Data Encryption**: End-to-end encryption for sensitive data
- **Audit Logging**: Comprehensive activity tracking

## 🌐 Integration

### External Services
- **Kwaai**: Privacy-preserving analytics
- **Discourse**: Community forum integration
- **OpenAI/Anthropic**: AI model integration
- **Ollama**: Local AI model support

### API Endpoints
- `GET /api/agents` - List available agents
- `GET /api/sessions` - List Block 13 sessions
- `POST /api/chat` - Send message to agent
- `GET /api/trust` - Trust network data
- `POST /api/privacy` - Privacy settings

## 📊 Monitoring

- Real-time agent status monitoring
- Performance metrics and analytics
- Trust network visualization
- Privacy compliance tracking
- Cross-session insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- BGIN Community for governance research
- Open WebUI for interface inspiration
- Block 13 participants for feedback
- Privacy-preserving technology community

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the BGIN community
- Check the documentation in `/docs`

---

**Built with ❤️ for the BGIN Community**