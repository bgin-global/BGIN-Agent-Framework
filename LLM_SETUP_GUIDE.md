# 🤖 LLM Integration Setup Guide

## Current Status
✅ **Server is running with Ollama as primary LLM provider**
✅ **Ollama local models configured and working**
✅ **Multi-agent system fully functional**
✅ **Fallback system configured** (OpenAI → Phala Cloud → Static responses)
✅ **All BGIN agents operational** (Archive, Codex, Discourse)

## LLM Integration Options

### Option 1: Ollama Local Models (Primary - Currently Active)
**Status**: ✅ **ACTIVE AND WORKING**
- **Model**: llama3.2:3b-instruct-q4_0 (1.9 GB)
- **Endpoint**: http://localhost:11434
- **Benefits**: Complete privacy, no API costs, full local control
- **Performance**: ~5-7 seconds per response
- **Confidence**: 0.85 (high quality responses)

**Models Available:**
- `llama3.2:3b-instruct-q4_0` (Primary - Fast, efficient)
- `llama3.2:latest` (Alternative - More capable)

**To change models:**
1. Update `OLLAMA_MODEL` in your environment or server config
2. Restart the server

### Option 2: OpenAI API (Fallback)
**Status**: ⚠️ Optional fallback (not configured)
- **Purpose**: Fallback when Ollama is unavailable
- **Setup**: Add `OPENAI_API_KEY` to `.env` file
- **Benefits**: High-quality responses, reliable service

**To configure OpenAI fallback:**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `.env` file: `OPENAI_API_KEY=sk-your-actual-api-key-here`
4. Restart the server

### Option 3: Phala Cloud (Fallback)
**Status**: ⚠️ Configured but requires authentication
- **Endpoint**: https://890e30429c7029b543e69653fb1ca507293797ad-3000.dstack-prod5.phala.network
- **Purpose**: Confidential compute fallback
- **Current Issue**: Returns 401 "Not authenticated" errors

### Option 4: Static Responses (Final Fallback)
- **Status**: ✅ Always available
- **Purpose**: Ensures system never fails completely
- **Features**: Basic agent responses for testing

## Testing LLM Integration

### Check Status
```bash
curl http://localhost:4000/api/status
```

### Test Ollama Integration
```bash
curl http://localhost:4000/api/test-ollama
```

### Test Main LLM (Ollama-first)
```bash
curl http://localhost:4000/api/test-llm
```

### Test Chat with BGIN Agents
```bash
# Archive Agent
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the key challenges in blockchain governance?",
    "agent": "archive",
    "session": "regulatory"
  }'

# Codex Agent
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How should we approach regulatory compliance for DeFi protocols?",
    "agent": "codex",
    "session": "technical-standards"
  }'

# Discourse Agent
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can we improve community participation in blockchain governance?",
    "agent": "discourse",
    "session": "cross-chain-governance"
  }'
```

## Features Available

### With Ollama (Currently Active):
- ✅ **Intelligent responses** from llama3.2:3b-instruct-q4_0
- ✅ **Agent-specific system prompts** for Archive, Codex, and Discourse
- ✅ **Session-aware context** for different BGIN sessions
- ✅ **Multi-agent collaboration** mode
- ✅ **High confidence scores** (0.85)
- ✅ **Source count simulation**
- ✅ **Processing time tracking** (~5-7 seconds)
- ✅ **Complete privacy** (all processing local)
- ✅ **No API costs** (runs entirely on your machine)

### With OpenAI Fallback (Optional):
- ✅ **Intelligent responses** from GPT-3.5-turbo
- ✅ **High confidence scores** (0.9)
- ✅ **Faster response times** (~2-3 seconds)
- ⚠️ **Requires API key and internet connection**

### With Static Fallback (Always Available):
- ✅ **Static responses** with agent-specific information
- ✅ **Basic functionality** for testing
- ⚠️ **Lower confidence scores** (0.6)
- ⚠️ **No dynamic content generation**

## API Endpoints

- `GET /api/status` - Server and LLM status (shows Ollama as primary)
- `GET /api/test-llm` - Test main LLM integration (Ollama-first)
- `GET /api/test-ollama` - Test Ollama integration specifically
- `POST /api/chat` - Send messages to BGIN agents
- `GET /api/agents` - List available agents (archive, codex, discourse)
- `GET /api/sessions` - List BGIN sessions (regulatory, technical-standards, etc.)

## Troubleshooting

### Ollama Connection Issues:
- **Error**: `ECONNREFUSED` or `Unable to connect to Ollama`
- **Cause**: Ollama service is not running
- **Solution**: Start Ollama service with `ollama serve`
- **Check**: Verify Ollama is running on `http://localhost:11434`

### Ollama Model Issues:
- **Error**: `model not found` or `model not available`
- **Cause**: Model not downloaded or wrong model name
- **Solution**: Download model with `ollama pull llama3.2:3b-instruct-q4_0`
- **Check**: List models with `ollama list`

### Slow Response Times:
- **Issue**: Responses taking 10+ seconds
- **Cause**: Model too large for your hardware or system under load
- **Solution**: Try smaller model or check system resources
- **Alternative**: Use `llama3.2:3b-instruct-q4_0` (faster) instead of `llama3.2:latest`

### Fallback to Static Responses:
- **Cause**: All LLM services (Ollama, OpenAI, Phala) failed
- **Check**: Test individual services with `/api/test-ollama` and `/api/test-llm`
- **Solution**: Ensure Ollama is running and accessible

### OpenAI Fallback Issues:
- **Error**: `401 Unauthorized` or `Invalid API key`
- **Cause**: API key invalid or expired
- **Solution**: Verify API key in `.env` file
- **Workaround**: System will use Phala Cloud or static responses

## Cost Considerations

### Ollama (Primary - No Cost):
- **Cost**: $0.00 (completely free)
- **Hardware**: Uses your local CPU/GPU
- **Storage**: ~2-4 GB per model
- **Bandwidth**: No internet required after model download

### OpenAI (Fallback - Optional):
- **Cost**: ~$0.002 per 1K tokens
- **Average response**: ~500-1000 tokens
- **Estimated cost per conversation**: $0.001-0.002

### Phala Cloud (Fallback - Optional):
- **Cost**: Varies by usage
- **Benefits**: Confidential compute, TEE verification

## Security Notes

### Ollama (Recommended):
- **Privacy**: Complete - all processing happens locally
- **Data**: Never leaves your machine
- **Security**: No external API calls or data transmission

### API Keys (If using fallbacks):
- Never commit your `.env` file to version control
- Keep your API keys secure
- Consider using environment variables in production
