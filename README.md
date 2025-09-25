# BGIN Multi-Agent Interface

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

A privacy-preserving, multi-agent research platform for blockchain governance, inspired by Open WebUI and designed for BGIN Block 13 sessions. This project implements the principles outlined in the [BGIN Agentic Framework Archive Codex](https://sync.soulbis.com/s/bgin-agentic-framework-archive-codex) to create a sovereign, dignity-based, privacy-preserving AI agent ecosystem.

## 🌟 Features

### 🤖 Three-Agent System
- **Archive Agent** - Knowledge & RAG Systems (Blue theme)
  - Document analysis and knowledge synthesis
  - Cross-session search and retrieval
  - Privacy-preserving knowledge management
  - Distributed consciousness architecture

- **Codex Agent** - Policy & Standards Management (Purple theme)
  - Policy analysis and standards development
  - Compliance checking and verification
  - Real-time sovereignty enforcement
  - Cryptoeconomic verification systems

- **Discourse Agent** - Communications & Collaboration (Green theme)
  - Forum integration and community management
  - Consensus building and collaboration tools
  - Privacy-preserving communication channels
  - Trust network visualization

### 🏛️ Block 13 Sessions
- **Opening Keynote** (Live - 189 participants)
- **Technical Standards** (Active - 123 participants)
- **Regulatory Landscape** (Active - 156 participants)
- **Privacy & Digital Rights** (Upcoming - 87 participants)
- **Cross-Chain Governance** (Planning - 98 participants)

### 🔒 Privacy & Trust Features
- **DID-based Identity Management**: Decentralized identifier system
- **Privacy Level Controls**: Maximum/High/Selective/Minimal privacy settings
- **Trust Network Visualization**: Anonymous researcher interactions
- **Privacy-Preserving Research Platform**: End-to-end encrypted communications
- **Real-time Sovereignty Enforcement**: Continuous privacy compliance monitoring

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
- PostgreSQL (for production)
- Redis (for caching)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mitchuski/bgin-agents.git
cd bgin-agents
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
- Backend API: http://localhost:3001

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks + Context + Zustand
- **Build Tool**: Vite
- **Real-time**: Socket.io Client

### Backend (Node.js + TypeScript)
- **Framework**: Express.js
- **Database**: PostgreSQL (with Redis for caching)
- **Authentication**: JWT + DID-based
- **Real-time**: Socket.io
- **AI Integration**: OpenAI, Anthropic, Ollama
- **Privacy**: End-to-end encryption, privacy-preserving analytics

### Multi-Agent System
- **Archive Agent**: Document analysis, knowledge synthesis, cross-session search
- **Codex Agent**: Policy analysis, standards development, compliance checking
- **Discourse Agent**: Forum integration, consensus building, community management

### Privacy & Sovereignty Architecture
Based on the [BGIN Agentic Framework Archive Codex](https://sync.soulbis.com/s/bgin-agentic-framework-archive-codex), this implementation features:

- **Distributed Consciousness**: Multi-agent coordination with privacy preservation
- **Privacy by Design**: Built-in privacy controls and data protection
- **Dignity-based Economics**: Fair value distribution and user sovereignty
- **Real-time Sovereignty Enforcement**: Continuous monitoring of privacy compliance
- **Cryptoeconomic Verification**: Blockchain-based trust and verification systems

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
│   │   │   ├── archive/      # Archive Agent
│   │   │   ├── codex/        # Codex Agent
│   │   │   └── discourse/    # Discourse Agent
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── services/         # Business logic
│   │   ├── privacy/          # Privacy-preserving systems
│   │   ├── trust/            # Trust network systems
│   │   └── utils/            # Utilities
│   └── package.json
├── database/                 # Database schemas
├── docs/                     # Documentation
├── scripts/                  # Setup scripts
└── infrastructure/           # Deployment configurations
```

## 🔐 Privacy & Security

### Privacy Architecture
- **DID-based Identity**: Decentralized identifier management using W3C standards
- **Privacy Levels**: Configurable privacy controls (Maximum/High/Selective/Minimal)
- **Trust Networks**: Anonymous researcher interactions with reputation systems
- **Data Encryption**: End-to-end encryption for sensitive data
- **Audit Logging**: Comprehensive activity tracking with privacy preservation

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against abuse and DoS attacks
- **Input Validation**: Comprehensive input sanitization
- **CORS Protection**: Cross-origin resource sharing controls
- **Helmet Security**: Security headers and protections

## 🌐 Integration

### External Services
- **Kwaai**: Privacy-preserving analytics and insights
- **Discourse**: Community forum integration
- **OpenAI/Anthropic**: AI model integration
- **Ollama**: Local AI model support
- **BGIN Systems**: Blockchain governance integration

### API Endpoints
- `GET /api/agents` - List available agents
- `GET /api/sessions` - List Block 13 sessions
- `POST /api/chat` - Send message to agent
- `GET /api/trust` - Trust network data
- `POST /api/privacy` - Privacy settings
- `GET /api/synthesis` - Cross-session synthesis
- `POST /api/auth` - Authentication endpoints

## 📊 Monitoring

- Real-time agent status monitoring
- Performance metrics and analytics
- Trust network visualization
- Privacy compliance tracking
- Cross-session insights
- Sovereignty enforcement monitoring

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.production.yml up -d
```

## 🤝 Contributing

We welcome contributions to the BGIN Multi-Agent Interface project. This project follows the principles outlined in the [BGIN Agentic Framework Archive Codex](https://sync.soulbis.com/s/bgin-agentic-framework-archive-codex) for sovereign, dignity-based AI development.

### Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow privacy-by-design principles** in all contributions
4. **Ensure dignity-based economics** in any economic features
5. **Maintain sovereignty enforcement** in all agent interactions
6. **Commit your changes** (`git commit -m 'Add amazing feature'`)
7. **Push to the branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Jest for testing
- Privacy-preserving design patterns

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **BGIN Community** for governance research and collaboration
- **Open WebUI** for interface inspiration and design patterns
- **Block 13 participants** for feedback and testing
- **Privacy-preserving technology community** for foundational work
- **Soul Sync** for the [BGIN Agentic Framework Archive Codex](https://sync.soulbis.com/s/bgin-agentic-framework-archive-codex) reference document

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the BGIN community
- Check the documentation in `/docs`
- Reference the [BGIN Agentic Framework Archive Codex](https://sync.soulbis.com/s/bgin-agentic-framework-archive-codex) for architectural guidance

## 🔗 References

- [BGIN Agentic Framework Archive Codex](https://sync.soulbis.com/s/bgin-agentic-framework-archive-codex) - Comprehensive framework for sovereign AI agents
- [BGIN Official Website](https://bgin.org) - Blockchain Governance Initiative Network
- [W3C DID Specification](https://www.w3.org/TR/did-core/) - Decentralized Identifiers
- [Open WebUI](https://github.com/open-webui/open-webui) - Interface inspiration

---

**Built with ❤️ for the BGIN Community**

*This project implements the principles of distributed consciousness, privacy by design, dignity-based economics, and real-time sovereignty enforcement as outlined in the BGIN Agentic Framework Archive Codex.*
