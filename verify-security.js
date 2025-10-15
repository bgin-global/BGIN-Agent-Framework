#!/usr/bin/env node

/**
 * Security Verification Script
 * 
 * This script verifies that your setup is secure and no sensitive data
 * is exposed in tracked files.
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 Verifying Security Setup...\n');

// Check if .env exists
const envPath = '.env';
if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');
  
  // Check if .env contains actual API key (not placeholder)
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('your-bluenexus-api-key-here')) {
    console.log('⚠️  .env still contains placeholder API key');
    console.log('   Please replace with your actual BlueNexus API key');
  } else if (envContent.includes('BLUENEXUS_API_KEY=')) {
    console.log('✅ .env contains BlueNexus API key configuration');
  } else {
    console.log('❌ .env missing BlueNexus API key configuration');
  }
} else {
  console.log('❌ .env file not found');
  console.log('   Please create .env file from env.example');
}

// Check if .env is in .gitignore
const gitignorePath = '.gitignore';
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  if (gitignoreContent.includes('.env')) {
    console.log('✅ .env is in .gitignore');
  } else {
    console.log('❌ .env is NOT in .gitignore');
  }
} else {
  console.log('❌ .gitignore file not found');
}

// Check if .env is tracked by git
const { execSync } = require('child_process');
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.includes('.env')) {
    console.log('❌ .env is tracked by git (this is bad!)');
    console.log('   Run: git rm --cached .env');
  } else {
    console.log('✅ .env is not tracked by git');
  }
} catch (error) {
  console.log('⚠️  Could not check git status (not a git repo?)');
}

// Check for any hardcoded API keys in tracked files
console.log('\n🔍 Checking for hardcoded API keys...');

const filesToCheck = [
  'simple-server.js',
  'backend/src/integrations/llm/llm-client.ts',
  'backend/src/utils/config.ts',
  'env.example'
];

let foundIssues = false;

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for actual API keys (not placeholders)
    const apiKeyPatterns = [
      /BLUENEXUS_API_KEY\s*=\s*['"][^'"]*[a-zA-Z0-9]{20,}['"]/,
      /bluenexusApiKey:\s*['"][^'"]*[a-zA-Z0-9]{20,}['"]/,
      /Authorization.*Bearer\s+[a-zA-Z0-9]{20,}/
    ];
    
    apiKeyPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        console.log(`❌ Potential API key found in ${file}`);
        foundIssues = true;
      }
    });
  }
});

if (!foundIssues) {
  console.log('✅ No hardcoded API keys found in tracked files');
}

console.log('\n📋 Security Checklist:');
console.log('   □ .env file exists');
console.log('   □ .env contains your actual API key');
console.log('   □ .env is in .gitignore');
console.log('   □ .env is not tracked by git');
console.log('   □ No hardcoded API keys in tracked files');

console.log('\n🚀 Ready to test!');
console.log('   Run: node test-bluenexus-integration.js');
console.log('   Run: node simple-server.js');
