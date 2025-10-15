# 🤖 BlueNexus AI Integration Guide

## Overview

This guide covers the integration of [BlueNexus AI](https://api.staging.bluenexus.ai/api/docs#/LLM%20Services/getModels) as a new LLM provider for the BGIN Multi-Agent System. BlueNexus provides high-quality AI services that can be used as a primary or fallback provider.

## What's Been Added

### 1. BlueNexusProvider Class
- **Location**: `backend/src/integrations/llm/llm-client.ts`
- **Features**: Full LLM provider implementation with chat completions, embeddings, sentiment analysis, and entity extraction
- **API Compatibility**: OpenAI-compatible API endpoints

### 2. Configuration Updates
- **Environment Variables**: Added BlueNexus-specific configuration
- **Config Validation**: Updated Joi schema to include BlueNexus settings
- **Priority**: BlueNexus is set as primary provider when API key is present

### 3. Environment Configuration
Added to `env.example`:
```bash
# BlueNexus AI Integration
BLUENEXUS_ENDPOINT=https://api.staging.bluenexus.ai/api
BLUENEXUS_API_KEY=your-bluenexus-api-key-here
BLUENEXUS_MODEL=bluenexus/llama-3.2-3b-instruct
```

## Setup Instructions

### 1. Get BlueNexus API Key
1. Visit the [BlueNexus API Documentation](https://api.staging.bluenexus.ai/api/docs#/LLM%20Services/getModels)
2. Sign up for an account
3. Generate an API key
4. Note the available models and endpoints

### 2. Configure Environment
1. Copy your `.env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Add your BlueNexus credentials to `.env`:
   ```bash
   BLUENEXUS_ENDPOINT=https://api.staging.bluenexus.ai/api
   BLUENEXUS_API_KEY=your-actual-api-key-here
   BLUENEXUS_MODEL=bluenexus/llama-3.2-3b-instruct
   ```

### 3. Test the Integration
Run the test script to verify everything works:
```bash
node test-bluenexus-integration.js
```

### 4. Start Your Server
```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

## Provider Priority

The LLM client will use providers in this order:
1. **BlueNexus** (if `BLUENEXUS_API_KEY` is set)
2. **KwaaiDistributed** (if distributed nodes are configured)
3. **KwaaiNet** (if `KWAAI_API_KEY` is set)
4. **Anthropic** (if `ANTHROPIC_API_KEY` is set)
5. **OpenAI** (if `OPENAI_API_KEY` is set)

## Available Features

### Chat Completions
- **Endpoint**: `/v1/chat/completions`
- **Models**: Configurable via `BLUENEXUS_MODEL`
- **Features**: Temperature control, max tokens, stop sequences

### Embeddings
- **Endpoint**: `/v1/embeddings`
- **Model**: `bluenexus/text-embedding-3-small`
- **Use Case**: Vector search and similarity matching

### Sentiment Analysis
- **Method**: Prompt-based analysis using chat completions
- **Output**: JSON with sentiment, confidence, and scores

### Entity Extraction
- **Method**: Prompt-based extraction using chat completions
- **Output**: JSON array of entities with types and confidence

## Testing

### Manual Testing
```bash
# Test API availability
curl -H "Authorization: Bearer $BLUENEXUS_API_KEY" \
     https://api.staging.bluenexus.ai/api/v1/models

# Test chat completion
curl -X POST https://api.staging.bluenexus.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $BLUENEXUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bluenexus/llama-3.2-3b-instruct",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 100
  }'
```

### Automated Testing
```bash
# Run the comprehensive test script
node test-bluenexus-integration.js
```

## Troubleshooting

### Common Issues

#### 1. Authentication Errors (401)
```bash
# Check your API key
echo $BLUENEXUS_API_KEY

# Verify the key is correct in your .env file
grep BLUENEXUS_API_KEY .env
```

#### 2. Connection Errors
```bash
# Test network connectivity
curl -I https://api.staging.bluenexus.ai/api/v1/models

# Check if the endpoint is correct
echo $BLUENEXUS_ENDPOINT
```

#### 3. Model Not Found
- Check available models: `curl -H "Authorization: Bearer $BLUENEXUS_API_KEY" https://api.staging.bluenexus.ai/api/v1/models`
- Update `BLUENEXUS_MODEL` in your `.env` file

#### 4. Timeout Issues
- Increase timeout in the provider class if needed
- Check your network connection
- Verify the API is responding

### Debug Mode
Enable debug logging by setting:
```bash
LOG_LEVEL=debug
```

## Integration with BGIN Agents

The BlueNexus provider integrates seamlessly with all BGIN agents:

- **Archive Agent**: Uses BlueNexus for document analysis and knowledge synthesis
- **Codex Agent**: Uses BlueNexus for policy analysis and compliance checking
- **Discourse Agent**: Uses BlueNexus for community engagement and consensus building

## Performance Considerations

- **Response Time**: BlueNexus typically responds in 2-5 seconds
- **Rate Limits**: Check BlueNexus documentation for rate limits
- **Cost**: Monitor usage through BlueNexus dashboard
- **Fallback**: System automatically falls back to other providers if BlueNexus fails

## Security Notes

- **API Key**: Store securely in environment variables
- **HTTPS**: All communication is encrypted
- **Privacy**: BlueNexus processes data according to their privacy policy
- **Audit**: All requests are logged for debugging

## Next Steps

1. **Test thoroughly** with your specific use cases
2. **Monitor performance** and adjust settings as needed
3. **Set up monitoring** for API usage and costs
4. **Configure fallbacks** for high availability
5. **Document any customizations** for your team

## Support

- **BlueNexus Documentation**: [https://api.staging.bluenexus.ai/api/docs](https://api.staging.bluenexus.ai/api/docs)
- **BGIN Issues**: Create an issue in the BGIN repository
- **Integration Questions**: Check the test script for examples

---

*BlueNexus AI integration added to BGIN Multi-Agent System for enhanced AI capabilities and provider diversity.*
