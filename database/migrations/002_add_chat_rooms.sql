-- =====================================
-- database/migrations/002_add_chat_rooms.sql
-- Chat rooms and message history
-- =====================================

-- チャットルーム（6つの固定ルーム）
CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_key VARCHAR(100) UNIQUE NOT NULL,  -- 識別子: 'bgin-agent-hack', 'identity-privacy' 等
    name VARCHAR(255) NOT NULL,  -- 表示名: 'BGIN Agent Hack', 'Identity Key Management & Privacy' 等
    description TEXT,
    agent_type VARCHAR(50),  -- デフォルトエージェント: 'archive', 'codex', 'discourse', 'multi-agent'
    is_multi_agent BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- チャットメッセージ（各ルームの履歴）
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    participant_hash VARCHAR(255) NOT NULL,  -- ユーザー識別子
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    agent_type VARCHAR(50),  -- どのエージェントが応答したか
    model_used VARCHAR(100),  -- 使用したLLMモデル (gpt-4o等)
    metadata JSONB DEFAULT '{}',  -- {confidence, sources, processingTime, ...}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_participant ON chat_messages(room_id, participant_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_key ON chat_rooms(room_key);

-- updated_at トリガー
CREATE TRIGGER update_chat_rooms_updated_at
    BEFORE UPDATE ON chat_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================
-- 初期データ: 6つのチャットルーム
-- =====================================

INSERT INTO chat_rooms (room_key, name, description, agent_type, is_multi_agent) VALUES
(
    'bgin-agent-hack',
    'BGIN Agent Hack',
    'Main agent development and testing room for BGIN multi-agent system',
    'multi-agent',
    TRUE
),
(
    'identity-privacy',
    'Identity Key Management & Privacy',
    'Privacy-preserving identity solutions and key management discussion',
    'archive',
    FALSE
),
(
    'cybersecurity',
    'CyberSecurity',
    'Security best practices, threat analysis, and blockchain security',
    'codex',
    FALSE
),
(
    'fase',
    'FASE',
    'Financial and Standards Engineering for blockchain governance',
    'codex',
    FALSE
),
(
    'general',
    'General',
    'General blockchain governance discussion and community topics',
    'discourse',
    FALSE
),
(
    'direct-agent',
    'Direct Agent Access',
    'Direct interaction with specific agents for testing and experimentation',
    'archive',
    FALSE
)
ON CONFLICT (room_key) DO NOTHING;
