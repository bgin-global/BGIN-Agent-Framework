// =====================================
// backend/src/utils/config.ts
// =====================================

import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

// Load .env from project root (two levels up from backend/src/utils)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'staging', 'production').default('development'),
  PORT: Joi.number().default(4000),
  
  // Database
  DATABASE_URL: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  VECTOR_DB_URL: Joi.string().required(),
  
  // Security
  JWT_SECRET: Joi.string().min(32).required(),
  ENCRYPTION_KEY: Joi.string().length(32).required(),
  ANONYMIZATION_SALT: Joi.string().min(16).required(),
  
  // AI Services
  ANTHROPIC_API_KEY: Joi.string().optional(),
  OPENAI_API_KEY: Joi.string().optional(),

  // Integration
  DISCOURSE_API_KEY: Joi.string().optional(),

  // Agent Toggles
  ARCHIVE_AGENT_ENABLED: Joi.boolean().default(true),
  CODEX_AGENT_ENABLED: Joi.boolean().default(true),
  DISCOURSE_AGENT_ENABLED: Joi.boolean().default(true),

  // Features
  MULTI_AGENT_MODE: Joi.boolean().default(true),
  CROSS_SESSION_SYNTHESIS: Joi.boolean().default(true),
  PRIVACY_SIMULATION: Joi.boolean().default(true),
  
  // CORS
  CORS_ORIGIN: Joi.string().default('http://localhost:3000')
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  
  // Database
  databaseUrl: envVars.DATABASE_URL,
  redisUrl: envVars.REDIS_URL,
  vectorDbUrl: envVars.VECTOR_DB_URL,
  
  // Security
  jwtSecret: envVars.JWT_SECRET,
  encryptionKey: envVars.ENCRYPTION_KEY,
  anonymizationSalt: envVars.ANONYMIZATION_SALT,
  
  // AI Services
  anthropicApiKey: envVars.ANTHROPIC_API_KEY,
  openaiApiKey: envVars.OPENAI_API_KEY,

  // Integration
  discourseApiKey: envVars.DISCOURSE_API_KEY,

  // Agent Toggles
  archiveAgentEnabled: envVars.ARCHIVE_AGENT_ENABLED,
  codexAgentEnabled: envVars.CODEX_AGENT_ENABLED,
  discourseAgentEnabled: envVars.DISCOURSE_AGENT_ENABLED,

  // Features
  multiAgentMode: envVars.MULTI_AGENT_MODE,
  crossSessionSynthesis: envVars.CROSS_SESSION_SYNTHESIS,
  privacySimulation: envVars.PRIVACY_SIMULATION,
  
  // CORS
  corsOrigin: envVars.CORS_ORIGIN,
  
  // Agent Configuration
  agents: {
    archive: {
      model: 'claude-3-haiku',
      maxTokens: 4000,
      temperature: 0.3
    },
    codex: {
      model: 'claude-3-sonnet',
      maxTokens: 6000,
      temperature: 0.2
    },
    discourse: {
      model: 'claude-3-haiku',
      maxTokens: 3000,
      temperature: 0.4
    }
  }
};
