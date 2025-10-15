# 🔐 Secure BlueNexus Setup Guide

## ⚠️ IMPORTANT: Keep Your API Key Private

Your BlueNexus API key is sensitive and should never be shared publicly or committed to version control.

## Secure Setup Steps

### 1. Create Your Local Environment File

**DO NOT** copy the example file directly. Instead, create a new `.env` file:

```bash
# Create your private environment file
cp env.example .env
```

### 2. Add Your BlueNexus API Key Securely

Open your `.env` file and add your BlueNexus API key:

```bash
# BlueNexus AI Configuration
BLUENEXUS_ENDPOINT=https://api.staging.bluenexus.ai/api
BLUENEXUS_API_KEY=your-actual-bluenexus-api-key-here
BLUENEXUS_MODEL=claude-3.5-sonnet-20241022
BLUENEXUS_EMBEDDING_MODEL=text-embedding-3-large
```

### 3. Verify Security

Check that your `.env` file is properly ignored:

```bash
# Check git status (should NOT show .env)
git status

# Verify .env is in .gitignore
grep -n "\.env" .gitignore
```

### 4. Test Your Setup

```bash
# Test BlueNexus integration
node test-bluenexus-integration.js

# Test agent chats
node test-bluenexus-agent-chats.js

# Start the server
node simple-server.js
```

## Security Checklist

- ✅ `.env` file is in `.gitignore`
- ✅ `.env` file is not tracked by git
- ✅ API key is only in your local `.env` file
- ✅ No API keys in any tracked files
- ✅ `.env.example` contains placeholder values only

## What's Protected

The following files and patterns are automatically ignored by git:

- `.env` - Your local environment variables
- `.env.local` - Local development overrides
- `.env.*.local` - Environment-specific local files
- `secrets/` - Any secrets directory
- `credentials/` - Any credentials directory
- `api-keys/` - Any API keys directory
- `*.key`, `*.pem` - Key files
- `chat-storage/` - Conversation data

## Troubleshooting

### If .env is showing in git status:
```bash
# Remove from git tracking (but keep local file)
git rm --cached .env

# Add to .gitignore if not already there
echo ".env" >> .gitignore

# Commit the .gitignore change
git add .gitignore
git commit -m "Add .env to gitignore"
```

### If you accidentally committed an API key:
```bash
# Remove from git history (use with caution)
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all

# Force push (be careful!)
git push origin --force --all
```

## Ready to Test!

Once you've securely added your BlueNexus API key to `.env`, you can:

1. **Start the server**: `node simple-server.js`
2. **Test the integration**: `node test-bluenexus-integration.js`
3. **Test agent chats**: `node test-bluenexus-agent-chats.js`
4. **Open the frontend**: `http://localhost:3000`

## Need Help?

If you encounter any issues:
1. Check that your API key is correct
2. Verify the BlueNexus endpoint is accessible
3. Check the server logs for error messages
4. Run the test scripts to diagnose issues

---

**Remember**: Never share your `.env` file or commit it to version control!
