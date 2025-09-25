-- database/init-db.sql - Initial database setup

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- For vector similarity search

-- =====================================
-- SESSIONS AND AGENTS
-- =====================================

-- Sessions table for Block 13 sessions
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'upcoming', 'active', 'live', 'completed')),
    participants_count INTEGER DEFAULT 0,
    privacy_settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Agent configurations
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('archive', 'codex', 'discourse')),
    session_id VARCHAR(255) REFERENCES sessions(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    configuration JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(agent_type, session_id)
);

-- =====================================
-- ARCHIVE AGENT TABLES
-- =====================================

-- Documents for Archive Agent knowledge base
CREATE TABLE archive_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) REFERENCES sessions(id),
    title VARCHAR(255),
    content TEXT,
    content_hash VARCHAR(64), -- SHA-256 hash for deduplication
    document_type VARCHAR(100),
    mime_type VARCHAR(100),
    file_size INTEGER,
    privacy_level VARCHAR(50) DEFAULT 'selective' CHECK (privacy_level IN ('maximum', 'high', 'selective', 'minimal')),
    contributor_hash VARCHAR(255), -- Anonymized contributor identifier
    vector_embedding VECTOR(1536), -- For similarity search
    metadata JSONB DEFAULT '{}',
    processing_status VARCHAR(50) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    quality_score DECIMAL(3,2) DEFAULT 0.0 CHECK (quality_score >= 0.0 AND quality_score <= 1.0),
    peer_validations INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge correlations between documents
CREATE TABLE archive_knowledge_correlations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_document_id UUID REFERENCES archive_documents(id),
    target_document_id UUID REFERENCES archive_documents(id),
    correlation_strength DECIMAL(3,2) NOT NULL CHECK (correlation_strength >= 0.0 AND correlation_strength <= 1.0),
    correlation_type VARCHAR(100),
    cross_session BOOLEAN DEFAULT FALSE,
    confidence_score DECIMAL(3,2) DEFAULT 0.0,
    validation_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_document_id, target_document_id)
);

-- Document chunks for RAG processing
CREATE TABLE archive_document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES archive_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    vector_embedding VECTOR(1536),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(document_id, chunk_index)
);

-- =====================================
-- CODEX AGENT TABLES
-- =====================================

-- Policy frameworks for Codex Agent
CREATE TABLE codex_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) REFERENCES sessions(id),
    policy_name VARCHAR(255) NOT NULL,
    framework_type VARCHAR(100),
    jurisdiction VARCHAR(100),
    domain VARCHAR(100),
    content JSONB NOT NULL,
    version VARCHAR(50) DEFAULT '1.0.0',
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'active', 'deprecated')),
    privacy_level VARCHAR(50) DEFAULT 'selective',
    contributors TEXT[], -- Array of anonymized contributor hashes
    compliance_score DECIMAL(3,2) DEFAULT 0.0,
    stakeholder_impact JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Standards registry
CREATE TABLE codex_standards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) REFERENCES sessions(id),
    standard_name VARCHAR(255) NOT NULL,
    standard_type VARCHAR(100),
    version VARCHAR(50) DEFAULT '1.0.0',
    specification JSONB NOT NULL,
    compliance_requirements JSONB DEFAULT '[]',
    implementation_guide JSONB DEFAULT '{}',
    adoption_status VARCHAR(50) DEFAULT 'proposed',
    review_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Policy impact assessments
CREATE TABLE codex_impact_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES codex_policies(id),
    stakeholder_type VARCHAR(100),
    impact_category VARCHAR(100),
    impact_analysis JSONB NOT NULL,
    risk_score DECIMAL(3,2) DEFAULT 0.0 CHECK (risk_score >= 0.0 AND risk_score <= 1.0),
    mitigation_strategies JSONB DEFAULT '[]',
    confidence_level DECIMAL(3,2) DEFAULT 0.0,
    reviewer_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- DISCOURSE AGENT TABLES
-- =====================================

-- Discussion threads
CREATE TABLE discourse_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) REFERENCES sessions(id),
    external_thread_id VARCHAR(255), -- Discourse forum thread ID
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    privacy_level VARCHAR(50) DEFAULT 'selective',
    participant_count INTEGER DEFAULT 0,
    message_count INTEGER DEFAULT 0,
    consensus_status VARCHAR(50) DEFAULT 'open' CHECK (consensus_status IN ('open', 'building', 'achieved', 'failed')),
    consensus_strength DECIMAL(3,2) DEFAULT 0.0,
    engagement_score DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Discussion messages
CREATE TABLE discourse_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES discourse_threads(id),
    external_message_id VARCHAR(255), -- External forum message ID
    anonymous_author_hash VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'discussion' CHECK (message_type IN ('discussion', 'proposal', 'vote', 'consensus')),
    privacy_level VARCHAR(50) DEFAULT 'selective',
    agent_enhanced BOOLEAN DEFAULT FALSE,
    sentiment_score DECIMAL(3,2) DEFAULT 0.0 CHECK (sentiment_score >= -1.0 AND sentiment_score <= 1.0),
    quality_score DECIMAL(3,2) DEFAULT 0.0,
    reply_to_message_id UUID REFERENCES discourse_messages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Consensus polls and voting
CREATE TABLE discourse_consensus_polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES discourse_threads(id),
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of poll options
    poll_type VARCHAR(50) DEFAULT 'single_choice' CHECK (poll_type IN ('single_choice', 'multiple_choice', 'ranking')),
    results JSONB DEFAULT '{}',
    participation_count INTEGER DEFAULT 0,
    consensus_threshold DECIMAL(3,2) DEFAULT 0.7,
    privacy_preserving BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'cancelled')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- TRUST NETWORK AND PRIVACY
-- =====================================

-- Trust relationships between participants
CREATE TABLE trust_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_a_hash VARCHAR(255) NOT NULL,
    participant_b_hash VARCHAR(255) NOT NULL,
    relationship_type VARCHAR(100) DEFAULT 'research_collaboration',
    context_domain VARCHAR(100),
    agent_contexts JSONB DEFAULT '{}', -- Trust context for each agent type
    strength DECIMAL(3,2) DEFAULT 0.5 CHECK (strength >= 0.0 AND strength <= 1.0),
    total_interactions INTEGER DEFAULT 0,
    last_interaction_at TIMESTAMP WITH TIME ZONE,
    trust_evolution JSONB DEFAULT '[]', -- History of trust changes
    verification_method VARCHAR(100) DEFAULT 'peer_vouching',
    established_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(participant_a_hash, participant_b_hash),
    CHECK (participant_a_hash != participant_b_hash)
);

-- Participant contributions and reputation
CREATE TABLE participant_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_hash VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) REFERENCES sessions(id),
    agent_type VARCHAR(50) CHECK (agent_type IN ('archive', 'codex', 'discourse')),
    contribution_type VARCHAR(100),
    contribution_id UUID, -- Reference to specific contribution
    quality_score DECIMAL(3,2) DEFAULT 0.0 CHECK (quality_score >= 0.0 AND quality_score <= 1.0),
    peer_validations INTEGER DEFAULT 0,
    reputation_delta INTEGER DEFAULT 0,
    privacy_level VARCHAR(50) DEFAULT 'selective',
    verification_proof TEXT, -- Cryptographic proof of contribution
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Anonymous participant profiles
CREATE TABLE participant_profiles (
    participant_hash VARCHAR(255) PRIMARY KEY,
    anonymous_handle VARCHAR(100),
    reputation_score INTEGER DEFAULT 0,
    trust_network_size INTEGER DEFAULT 0,
    contribution_count INTEGER DEFAULT 0,
    specializations TEXT[], -- Array of domain expertise
    privacy_preferences JSONB DEFAULT '{}',
    verification_status VARCHAR(50) DEFAULT 'unverified',
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- CROSS-AGENT COLLABORATION
-- =====================================

-- Multi-agent collaboration sessions
CREATE TABLE agent_collaborations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) REFERENCES sessions(id),
    collaboration_type VARCHAR(100),
    participating_agents TEXT[] NOT NULL, -- ['archive', 'codex', 'discourse']
    input_data JSONB NOT NULL,
    synthesis_result JSONB,
    confidence_score DECIMAL(3,2) DEFAULT 0.0,
    participant_validation_count INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    quality_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Agent communication logs
CREATE TABLE agent_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_agent_type VARCHAR(50) NOT NULL,
    to_agent_type VARCHAR(50) NOT NULL,
    message_type VARCHAR(100),
    payload JSONB NOT NULL,
    response JSONB,
    processing_time_ms INTEGER,
    status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'received', 'processed', 'failed')),
    correlation_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- PRIVACY AND SECURITY AUDIT
-- =====================================

-- Privacy processing logs
CREATE TABLE privacy_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_hash VARCHAR(255),
    operation_type VARCHAR(100),
    data_type VARCHAR(100),
    privacy_level_before VARCHAR(50),
    privacy_level_after VARCHAR(50),
    anonymization_method VARCHAR(100),
    success BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System audit logs
CREATE TABLE system_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100),
    agent_type VARCHAR(50),
    user_hash VARCHAR(255),
    details JSONB NOT NULL,
    ip_address INET,
    user_agent TEXT,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warn', 'error', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- INDEXES FOR PERFORMANCE
-- =====================================

-- Archive agent indexes
CREATE INDEX idx_archive_documents_session_privacy ON archive_documents(session_id, privacy_level) WHERE privacy_level IN ('collaborative', 'selective');
CREATE INDEX idx_archive_documents_content_hash ON archive_documents(content_hash);
CREATE INDEX idx_archive_documents_quality ON archive_documents(quality_score DESC) WHERE quality_score > 0.7;
CREATE INDEX idx_archive_correlations_strength ON archive_knowledge_correlations(correlation_strength DESC);
CREATE INDEX idx_archive_chunks_document ON archive_document_chunks(document_id, chunk_index);

-- Codex agent indexes
CREATE INDEX idx_codex_policies_jurisdiction_status ON codex_policies(jurisdiction, status) WHERE status = 'active';
CREATE INDEX idx_codex_policies_domain ON codex_policies(domain, session_id);
CREATE INDEX idx_codex_standards_type_status ON codex_standards(standard_type, adoption_status);

-- Discourse agent indexes
CREATE INDEX idx_discourse_threads_consensus_status ON discourse_threads(consensus_status, created_at) WHERE consensus_status IN ('open', 'building');
CREATE INDEX idx_discourse_messages_thread_created ON discourse_messages(thread_id, created_at);
CREATE INDEX idx_discourse_polls_status_expires ON discourse_consensus_polls(status, expires_at) WHERE status = 'active';

-- Trust network indexes
CREATE INDEX idx_trust_relationships_participant_a ON trust_relationships(participant_a_hash, strength DESC);
CREATE INDEX idx_trust_relationships_participant_b ON trust_relationships(participant_b_hash, strength DESC);
CREATE INDEX idx_trust_relationships_context ON trust_relationships(context_domain, relationship_type);
CREATE INDEX idx_participant_contributions_hash_agent ON participant_contributions(participant_hash, agent_type, created_at);

-- Agent collaboration indexes
CREATE INDEX idx_agent_collaborations_session_type ON agent_collaborations(session_id, collaboration_type);
CREATE INDEX idx_agent_communications_correlation ON agent_communications(correlation_id, created_at);

-- Audit indexes
CREATE INDEX idx_privacy_audit_participant ON privacy_audit_logs(participant_hash, created_at);
CREATE INDEX idx_system_audit_severity_created ON system_audit_logs(severity, created_at) WHERE severity IN ('error', 'critical');

-- Vector similarity search indexes (requires pgvector extension)
CREATE INDEX ON archive_documents USING ivfflat (vector_embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON archive_document_chunks USING ivfflat (vector_embedding vector_cosine_ops) WITH (lists = 100);

-- =====================================
-- FUNCTIONS AND TRIGGERS
-- =====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_archive_documents_updated_at BEFORE UPDATE ON archive_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_codex_policies_updated_at BEFORE UPDATE ON codex_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discourse_threads_updated_at BEFORE UPDATE ON discourse_threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trust_relationships_updated_at BEFORE UPDATE ON trust_relationships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_participant_profiles_updated_at BEFORE UPDATE ON participant_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function for privacy-preserving participant anonymization
CREATE OR REPLACE FUNCTION anonymize_participant_data(participant_id TEXT, salt TEXT DEFAULT 'default_salt')
RETURNS TEXT AS $$
BEGIN
    RETURN encode(digest(participant_id || COALESCE(current_setting('app.anonymization_salt', true), salt), 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate trust relationship strength
CREATE OR REPLACE FUNCTION calculate_trust_strength(
    interactions INTEGER,
    quality_avg DECIMAL,
    time_factor DECIMAL DEFAULT 1.0
)
RETURNS DECIMAL AS $$
BEGIN
    -- Trust strength algorithm: interactions * quality * time decay
    RETURN LEAST(1.0, (interactions * 0.1 * quality_avg * time_factor));
END;
$$ LANGUAGE plpgsql;

-- Row-level security policies for privacy protection
ALTER TABLE trust_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY trust_relationship_privacy ON trust_relationships
    FOR SELECT USING (
        current_setting('app.participant_hash', true) = participant_a_hash 
        OR current_setting('app.participant_hash', true) = participant_b_hash
        OR has_role(current_user, 'admin')
    );

-- Privacy-preserving views
CREATE VIEW anonymous_participants AS
SELECT 
    anonymize_participant_data(participant_hash) as anon_id,
    anonymous_handle,
    reputation_score,
    trust_network_size,
    contribution_count,
    specializations,
    last_active_at,
    created_at
FROM participant_profiles
WHERE privacy_preferences->>'visibility' != 'private';

-- =====================================
-- INITIAL DATA SEEDING
-- =====================================

-- Insert Block 13 sessions
INSERT INTO sessions (id, name, description, status, participants_count) VALUES
('keynote', 'Opening Keynote', 'Strategic governance frameworks', 'live', 189),
('technical', 'Technical Standards', 'Protocol development and standardization', 'active', 123),
('regulatory', 'Regulatory Landscape', 'Policy analysis and compliance frameworks', 'active', 156),
('privacy', 'Privacy & Digital Rights', 'Privacy preservation and rights advocacy', 'upcoming', 87),
('governance', 'Cross-Chain Governance', 'Multi-chain governance mechanisms', 'planning', 98)
ON CONFLICT (id) DO NOTHING;

-- Initialize agents for each session
INSERT INTO agents (agent_type, session_id, name, description, configuration) VALUES
('archive', 'keynote', 'Keynote Archive Agent', 'Strategic documents and BGIN history', '{"documents": 1247, "correlations": 34}'),
('codex', 'keynote', 'Keynote Codex Agent', 'Blockchain governance and multi-stakeholder models', '{"frameworks": 23, "assessments": 12}'),
('discourse', 'keynote', 'Keynote Discourse Agent', 'Strategic discussion facilitation', '{"activeThreads": 8, "consensusItems": 4}'),
('archive', 'technical', 'Technical Archive Agent', 'Technical specs and implementation guides', '{"documents": 892, "correlations": 28}'),
('codex', 'technical', 'Technical Codex Agent', 'Technical standards and interoperability', '{"frameworks": 31, "assessments": 18}'),
('discourse', 'technical', 'Technical Discourse Agent', 'Technical community coordination', '{"activeThreads": 12, "consensusItems": 7}'),
('archive', 'regulatory', 'Regulatory Archive Agent', 'Regulatory docs and policy analysis', '{"documents": 2341, "correlations": 67}'),
('codex', 'regulatory', 'Regulatory Codex Agent', 'Financial regulation and data protection', '{"frameworks": 45, "assessments": 34}'),
('discourse', 'regulatory', 'Regulatory Discourse Agent', 'Policy discussion and consensus building', '{"activeThreads": 15, "consensusItems": 9}'),
('archive', 'privacy', 'Privacy Archive Agent', 'Privacy research and rights frameworks', '{"documents": 1156, "correlations": 42}'),
('codex', 'privacy', 'Privacy Codex Agent', 'Data rights and privacy tech', '{"frameworks": 18, "assessments": 9}'),
('discourse', 'privacy', 'Privacy Discourse Agent', 'Rights advocacy and community engagement', '{"activeThreads": 6, "consensusItems": 3}'),
('archive', 'governance', 'Governance Archive Agent', 'Governance models and consensus mechanisms', '{"documents": 743, "correlations": 19}'),
('codex', 'governance', 'Governance Codex Agent', 'Cross-chain and DAO governance', '{"frameworks": 27, "assessments": 15}'),
('discourse', 'governance', 'Governance Discourse Agent', 'Governance discussion and coordination', '{"activeThreads": 4, "consensusItems": 2}')
ON CONFLICT (agent_type, session_id) DO NOTHING;
