# 🤖 BlueNexus AI Model Configuration Guide

## Overview

This guide covers the available models and configuration options for BlueNexus AI integration in your BGIN Multi-Agent System. BlueNexus provides access to high-quality models including Claude and OpenAI variants.

## Available Models

### Chat Completion Models

#### Claude Models (Recommended)
- **`claude-3.5-sonnet-20241022`** (Default) - Most capable, best for complex analysis
- **`claude-3.5-haiku-20241022`** - Faster, good for quick responses
- **`claude-3-opus-20240229`** - Most powerful, best for research tasks

#### OpenAI Models
- **`gpt-4o`** - Latest GPT-4, excellent for reasoning
- **`gpt-4o-mini`** - Faster GPT-4 variant
- **`gpt-4-turbo`** - High-performance GPT-4
- **`gpt-3.5-turbo`** - Fast and cost-effective

### Embedding Models
- **`text-embedding-3-large`** (Default) - Best quality embeddings
- **`text-embedding-3-small`** - Faster, smaller embeddings
- **`text-embedding-ada-002`** - Legacy OpenAI embeddings

## Configuration

### Environment Variables

Add to your `.env` file:

```bash
# BlueNexus AI Configuration
BLUENEXUS_ENDPOINT=https://api.staging.bluenexus.ai/api
BLUENEXUS_API_KEY=your-bluenexus-api-key-here

# Model Selection
BLUENEXUS_MODEL=claude-3.5-sonnet-20241022
BLUENEXUS_EMBEDDING_MODEL=text-embedding-3-large
```

### Model-Specific Settings

#### For Claude Models
```bash
BLUENEXUS_MODEL=claude-3.5-sonnet-20241022
# Temperature: 0.2 (focused responses)
# Max Tokens: 4000 (comprehensive analysis)
# Top P: 0.9 (balanced creativity)
```

#### For OpenAI Models
```bash
BLUENEXUS_MODEL=gpt-4o
# Temperature: 0.2 (focused responses)
# Max Tokens: 4000 (comprehensive analysis)
# Top P: 0.9 (balanced creativity)
```

## Model Selection by Use Case

### Archive Agent (Knowledge Synthesis)
**Recommended**: `claude-3.5-sonnet-20241022`
- Best for document analysis
- Excellent at cross-session knowledge synthesis
- Strong reasoning capabilities

### Codex Agent (Policy Analysis)
**Recommended**: `claude-3.5-sonnet-20241022` or `gpt-4o`
- Best for regulatory analysis
- Strong at compliance checking
- Excellent at policy interpretation

### Discourse Agent (Community Engagement)
**Recommended**: `claude-3.5-haiku-20241022` or `gpt-4o-mini`
- Fast responses for real-time chat
- Good at consensus building
- Effective for stakeholder engagement

### Multi-Agent Collaboration
**Recommended**: `claude-3.5-sonnet-20241022` or `gpt-4o`
- Best for complex multi-agent coordination
- Strong at synthesizing different perspectives
- Excellent at comprehensive analysis

## Performance Characteristics

### Claude 3.5 Sonnet
- **Speed**: Medium (2-5 seconds)
- **Quality**: Excellent
- **Cost**: Medium-High
- **Best For**: Complex analysis, research, policy work

### Claude 3.5 Haiku
- **Speed**: Fast (1-3 seconds)
- **Quality**: Very Good
- **Cost**: Low-Medium
- **Best For**: Quick responses, real-time chat

### GPT-4o
- **Speed**: Medium (2-4 seconds)
- **Quality**: Excellent
- **Cost**: Medium-High
- **Best For**: Reasoning, analysis, creative tasks

### GPT-4o Mini
- **Speed**: Fast (1-2 seconds)
- **Quality**: Very Good
- **Cost**: Low
- **Best For**: Quick responses, cost-effective analysis

## Testing Different Models

### Quick Model Test
```bash
# Test current model
curl http://localhost:4000/api/test-bluenexus

# Test with different model (update .env first)
BLUENEXUS_MODEL=claude-3.5-haiku-20241022 node simple-server.js
```

### Comprehensive Model Comparison
```bash
# Run the agent chat test with different models
node test-bluenexus-agent-chats.js
```

## Model Switching

### Method 1: Environment Variable
```bash
# Update .env file
BLUENEXUS_MODEL=gpt-4o

# Restart server
node simple-server.js
```

### Method 2: Runtime Configuration
```javascript
// In your code
process.env.BLUENEXUS_MODEL = 'claude-3.5-haiku-20241022';
```

## Cost Considerations

### High-Performance Models
- **Claude 3.5 Sonnet**: Best quality, higher cost
- **GPT-4o**: Excellent quality, higher cost

### Balanced Models
- **Claude 3.5 Haiku**: Good quality, moderate cost
- **GPT-4o Mini**: Good quality, lower cost

### Cost-Effective Models
- **GPT-3.5 Turbo**: Good quality, lowest cost

## Recommendations by Session Type

### Regulatory Sessions
- **Primary**: `claude-3.5-sonnet-20241022`
- **Fallback**: `gpt-4o`

### Technical Standards
- **Primary**: `gpt-4o`
- **Fallback**: `claude-3.5-sonnet-20241022`

### Privacy & Digital Rights
- **Primary**: `claude-3.5-sonnet-20241022`
- **Fallback**: `claude-3.5-haiku-20241022`

### Cross-Chain Governance
- **Primary**: `claude-3.5-sonnet-20241022`
- **Fallback**: `gpt-4o`

## Troubleshooting

### Model Not Found
```bash
# Check available models
curl -H "Authorization: Bearer $BLUENEXUS_API_KEY" \
     https://api.staging.bluenexus.ai/api/v1/models
```

### Performance Issues
- Try a faster model (Haiku, GPT-4o Mini)
- Reduce max_tokens
- Increase timeout settings

### Quality Issues
- Try a more capable model (Sonnet, GPT-4o)
- Adjust temperature (lower = more focused)
- Increase max_tokens for longer responses

## Monitoring

### Check Model Usage
```bash
# Server status
curl http://localhost:4000/api/status

# Model-specific test
curl http://localhost:4000/api/test-bluenexus
```

### Logs
Monitor server logs for model usage:
```bash
# Watch logs
tail -f server.log | grep "BlueNexus"
```

---

*Configure your BlueNexus models for optimal performance in your BGIN Multi-Agent System!*
