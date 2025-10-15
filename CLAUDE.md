# CLAUDE.md
日本語で返事して
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BGIN Multi-Agent Interface is a privacy-preserving, multi-agent research platform for blockchain governance inspired by Open WebUI. It implements a three-agent system (Archive, Codex, Discourse) with privacy-by-design principles following the BGIN Agentic Framework Archive Codex.

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL (production) / In-memory (development)
- AI: OpenAI (primary), Anthropic (alternative), Ollama (local fallback)
- Real-time: Socket.io
- State Management: React Context + Zustand

## Development Commands

### Setup and Installation
```bash
npm install                        # Install all workspace dependencies
cp env.example .env               # Copy environment template
ollama pull llama3.2:3b-instruct-q4_0  # Download local LLM model
```

### Running the Application
```bash
npm run dev:simple                # Start simple backend + frontend (recommended for development)
npm run dev                       # Start full backend + frontend with all integrations
npm run build                     # Build both frontend and backend for production
npm run start                     # Start production server

# Individual workspaces
npm run dev --workspace=frontend  # Frontend only (port 3000)
npm run dev --workspace=backend   # Backend only (port 4000)
npm run dev:simple --workspace=backend  # Simple backend without Docker dependencies
```

### Testing and Quality
```bash
npm test                          # Run all tests (frontend + backend)
npm run test --workspace=backend  # Backend tests only
npm run test --workspace=frontend # Frontend tests only
npm run test:coverage             # Run tests with coverage report
npm run lint                      # Lint all code
npm run lint:fix                  # Auto-fix linting issues
```

### Database Operations
```bash
npm run db:migrate                # Run database migrations
npm run db:seed                   # Seed database with initial data
npm run agents:seed               # Seed agent-specific data
```

### Docker Operations
```bash
npm run docker:dev                # Start development environment with docker-compose
npm run docker:prod               # Start production environment
```

## Architecture

### Multi-Agent System

The core architecture implements three specialized agents that coordinate through the `AgentCoordinator`:

1. **Archive Agent** (`backend/src/agents/archive/`)
   - Document processing and RAG (Retrieval-Augmented Generation)
   - Knowledge synthesis and cross-session search
   - Components: `enhanced-rag-engine.ts`, `document-processor.ts`, `retrieval-system.ts`

2. **Codex Agent** (`backend/src/agents/codex/`)
   - Policy analysis and standards management
   - Compliance checking and verification
   - Governance framework analysis

3. **Discourse Agent** (`backend/src/agents/discourse/`)
   - BGIN Discourse forum integration
   - Community engagement and consensus building
   - Trust network establishment

**Agent Coordination:**
- `backend/src/agents/coordination/agent-router.ts` - Central routing and coordination
- `backend/src/services/socket-manager.ts` - Real-time WebSocket communication
- All agents process requests through the `AgentCoordinator` interface

### Two Server Modes

The backend has two deployment modes:

1. **Simple Server** (`backend/src/server-simple.ts`)
   - Minimal dependencies, no Docker required
   - Mock data for quick development
   - Recommended for frontend development and testing
   - Run with: `npm run dev:simple`

2. **Full Server** (`backend/src/server.ts`)
   - Complete integration suite (PostgreSQL, Redis, Qdrant)
   - Production-ready with all middleware
   - Requires Docker or external services
   - Run with: `npm run dev`

### Frontend Architecture

**Main Components:**
- `frontend/src/components/BGINMultiAgentInterface.tsx` - Primary chat interface (3500+ lines)
- `frontend/src/components/MainInterface.tsx` - Alternative interface implementation
- `frontend/src/components/WorkingGroups.tsx` - Working group management and RAG containers

**Key Features:**
- Multi-agent chat with session-specific history
- Document upload with RAG container integration
- Privacy controls (Maximum/High/Selective/Minimal)
- Trust network visualization
- Working groups with configurable LLM models

**State Management:**
- `frontend/src/contexts/` - React Context for global state
- Local API service: `frontend/src/services/localApiService.ts`
- Socket.io client for real-time updates

### Integration Modules

Located in `backend/src/integrations/`:

- **LLM Integration** (`llm/`) - OpenAI, Anthropic, Ollama clients
- **Vector Database** (`vector-db/`) - Qdrant client for RAG
- **Discourse API** (`discourse-api/`) - BGIN Discourse forum integration

### Privacy & Trust Architecture

**Privacy-by-Design Features:**
- DID-based identity management (W3C standards)
- End-to-end encryption for sensitive data
- Privacy middleware: `backend/src/middleware/privacy.ts`
- Four privacy levels: Maximum, High, Selective, Minimal
- Real-time sovereignty enforcement monitoring

**Trust Network:**
- Trust relationship tracking and visualization
- Reputation scoring system
- Anonymous researcher interactions
- Routes: `backend/src/routes/trust.ts`

**ToIP Framework Integration:**
- Layer 1: Agent DIDs and verifiable credentials
- Layer 2: Governance policies and trust protocols
- Layer 3: Capability credentials
- Layer 4: Multi-agent interface
- Routes: `backend/src/routes/toip.ts`

**Privacy Pools:**
- Association Set Provider (ASP) eligibility
- Research contribution tracking and rewards
- Routes: `backend/src/routes/privacy-pools.ts`

## Key Patterns and Conventions

### TypeScript Configuration
- Backend uses CommonJS modules (`module: "commonjs"`)
- Frontend uses ES modules (`type: "module"`)
- Strict mode enabled with comprehensive type checking
- Path aliases: `@/*` maps to `src/*` in backend

### API Route Structure

Routes are organized by domain in `backend/src/routes/`:
```
routes/
├── agents/              # Agent-specific endpoints
│   ├── archive.ts
│   ├── codex.ts
│   └── discourse.ts
├── auth.ts              # Authentication and JWT
├── health.ts            # Health checks
├── privacy-pools.ts     # Privacy Pools ASP
├── synthesis.ts         # Cross-agent synthesis
├── toip.ts              # ToIP framework
└── trust.ts             # Trust network
```

### Working with Agents

When adding new agent functionality:
1. Implement core logic in `backend/src/agents/{agent-type}/`
2. Add route handlers in `backend/src/routes/agents/{agent-type}.ts`
3. Update `AgentCoordinator` in `backend/src/agents/coordination/agent-router.ts`
4. Add frontend integration in `frontend/src/components/BGINMultiAgentInterface.tsx`

### Environment Variables

Critical environment variables (see `.env.example`):
- `PORT` - Server port (default: 4000)
- `OPENAI_API_KEY` - OpenAI API key (primary LLM, optional)
- `ANTHROPIC_API_KEY` - Anthropic API key (alternative primary LLM, optional)
- `OLLAMA_API_URL` - Local Ollama endpoint (default: http://localhost:11434)
- `OLLAMA_MODEL` - Ollama model name (default: gemma3:4b)
- `DISCOURSE_URL` - BGIN Discourse forum URL
- `DATABASE_URL` - PostgreSQL connection string (optional)

**LLM Configuration Priority:**
1. Primary: OpenAI or Anthropic (requires API key)
2. Fallback: Ollama (local LLM, always available)
3. Final Fallback: Static responses

## Block 13 Conference Integration

The platform includes specialized support for BGIN Block 13 conference:
- 19 conference sessions across 5 working groups
- Track-based organization (BGIN Agent Hack, IKP, Cyber Security, FASE, General)
- Session-specific chat history with project containers
- Database seed data: `database/block13-seed-data.sql`

## Working Groups System

Located in `backend/src/agents/working-groups/`:
- Document upload and RAG container management
- Per-group LLM model selection (OpenAI, Anthropic, Ollama)
- Intelligence disclosure controls
- Group-specific chat history and context

## Development Workflow

1. **For frontend-only changes**: Use `npm run dev:simple` to avoid Docker dependencies
2. **For backend changes**: Test with simple server first, then full server if needed
3. **For agent changes**: Update agent logic → routes → coordinator → frontend
4. **For integration changes**: Work in `backend/src/integrations/{service}/`

## Important Files

- `simple-server.js` - Alternative Node.js server with LLM integration (no TypeScript compilation needed)
- `database/init-db.sql` - Database schema initialization
- `database/block13-seed-data.sql` - Block 13 conference session data
- `scripts/load-block13-data.js` - Script to load Block 13 data
- `frontend/src/components/BGINMultiAgentInterface.tsx` - Main UI component (very large, ~3500 lines)

## Testing Notes

- Backend tests use Jest with ts-jest preset
- Frontend tests use Vitest with jsdom
- Test files: `**/__tests__/**/*.ts` or `**/*.{spec,test}.ts`
- Coverage collected from all `src/**/*.ts` files except server entry points

## Privacy and Security Principles

When contributing code:
- Follow privacy-by-design principles
- Implement dignity-based economics patterns
- Maintain real-time sovereignty enforcement
- Use cryptoeconomic verification where applicable
- Ensure DID-based identity management
- Apply appropriate privacy level controls

Refer to the [BGIN Agentic Framework Archive Codex](https://sync.soulbis.com/s/bgin-agentic-framework-archive-codex) for comprehensive architectural guidance.
