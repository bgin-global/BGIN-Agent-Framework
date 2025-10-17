// Local API Service for BGIN Frontend
const API_BASE_URL = 'http://localhost:4000/api';

export interface LocalMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LocalResponse {
  content: string;
  agent: string;
  session: string;
  timestamp: string;
  confidence: number;
  sources: number;
  processingTime: number;
  llmUsed: boolean;
  model: string;
  multiAgent: boolean;
}

// Chat room types
export type ChatRoomKey =
  | 'bgin-agent-hack'
  | 'identity-privacy'
  | 'cybersecurity'
  | 'fase'
  | 'general'
  | 'direct-agent';

export interface ChatRoom {
  id: string;
  room_key: ChatRoomKey;
  name: string;
  description: string;
  agent_type: string;
  is_multi_agent: boolean;
  metadata: any;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agent_type?: string;
  model_used?: string;
  metadata?: any;
  created_at: string;
}

export class LocalApiService {
  private static instance: LocalApiService;
  
  public static getInstance(): LocalApiService {
    if (!LocalApiService.instance) {
      LocalApiService.instance = new LocalApiService();
    }
    return LocalApiService.instance;
  }

  /**
   * Send message to BGIN Backend API
   */
  async sendMessage(
    message: string,
    agentType: string,
    sessionType: string,
    isMultiAgent: boolean = false,
    roomKey?: ChatRoomKey  // Chat room key for history saving
  ): Promise<LocalResponse> {
    try {
      console.log(`🤖 Sending ${agentType} message to BGIN Backend API for ${sessionType} session`);

      // 1. Save user message to chat room (if roomKey provided)
      if (roomKey) {
        console.log(`💾 Saving user message to room: ${roomKey}`);
        await this.saveMessageToRoom(roomKey, {
          role: 'user',
          content: message
        });
      } else {
        console.warn('⚠️ No roomKey provided - message will not be saved');
      }

      // Determine API endpoint based on agent type
      const endpoint = isMultiAgent
        ? `${API_BASE_URL}/synthesis/collaborate`
        : `${API_BASE_URL}/agents/archive/query`;

      // Prepare request body based on endpoint
      const requestBody = isMultiAgent
        ? {
            sessionId: sessionType,
            agents: ['archive', 'codex', 'discourse'],
            input: { query: message },
            type: 'comprehensive_analysis'
          }
        : {
            query: message,
            sessionId: sessionType,
            userContext: {
              participantHash: 'demo-user',
              sessionId: sessionType,
              privacyLevel: 'selective',
              trustScore: 0.8,
              accessRights: []
            },
            filters: {},
            includeCrossSession: false,
            maxResults: 10,
            synthesisMode: 'summary'
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token'  // MVP auth token
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Backend API response received:', data);

      // Map backend response to frontend format
      const mappedResponse = this.mapBackendResponse(data, agentType, sessionType, isMultiAgent);

      // 2. Save assistant message to chat room (if roomKey provided)
      if (roomKey) {
        console.log(`💾 Saving assistant message to room: ${roomKey}`);
        await this.saveMessageToRoom(roomKey, {
          role: 'assistant',
          content: mappedResponse.content,
          agentType: agentType,
          modelUsed: mappedResponse.model,
          metadata: {
            confidence: mappedResponse.confidence,
            sources: mappedResponse.sources,
            processingTime: mappedResponse.processingTime
          }
        });
      }

      return mappedResponse;

    } catch (error) {
      console.error('Backend API request failed:', error);

      // Fallback to mock response if backend API is unavailable
      return this.generateFallbackResponse(message, agentType, sessionType, isMultiAgent);
    }
  }

  /**
   * Map backend response to frontend LocalResponse format
   */
  private mapBackendResponse(
    data: any,
    agentType: string,
    sessionType: string,
    isMultiAgent: boolean
  ): LocalResponse {
    if (isMultiAgent && data.collaboration) {
      // Multi-agent synthesis response
      return {
        content: data.collaboration.synthesisResult?.summary || 'Multi-agent analysis completed',
        agent: 'multi-agent',
        session: sessionType,
        timestamp: data.collaboration.completedAt || new Date().toISOString(),
        confidence: data.collaboration.confidenceScore || 0.85,
        sources: 0,
        processingTime: data.collaboration.processingTimeMs || 0,
        llmUsed: true,
        model: 'multi-agent-system',
        multiAgent: true
      };
    } else if (data.success && data.response) {
      // Archive agent RAG response
      const ragResponse = data.response;
      return {
        content: ragResponse.answer || ragResponse.synthesis || 'Query processed successfully',
        agent: agentType,
        session: sessionType,
        timestamp: data.timestamp || new Date().toISOString(),
        confidence: ragResponse.confidence || 0.8,
        sources: ragResponse.sources?.length || 0,
        processingTime: ragResponse.processingTime || 0,
        llmUsed: true,
        model: ragResponse.model || 'archive-agent',
        multiAgent: false
      };
    }

    // Fallback for unexpected response format
    return {
      content: JSON.stringify(data),
      agent: agentType,
      session: sessionType,
      timestamp: new Date().toISOString(),
      confidence: 0.5,
      sources: 0,
      processingTime: 0,
      llmUsed: false,
      model: 'unknown',
      multiAgent: isMultiAgent
    };
  }

  /**
   * Generate fallback response when local API is unavailable
   */
  private generateFallbackResponse(
    message: string,
    agentType: string,
    sessionType: string,
    isMultiAgent: boolean
  ): LocalResponse {
    const responses = {
      archive: `**Archive Agent Response** (Fallback Mode)\n\nI understand you're asking about "${message}" in the ${sessionType} session. As the Archive Agent, I specialize in knowledge synthesis and document analysis. I can help you find relevant research, analyze documents, and discover correlations across different sessions.\n\n**Note**: This is a fallback response. The local BGIN API with Ollama integration provides full functionality.`,
      codex: `**Codex Agent Response** (Fallback Mode)\n\nI understand you're asking about "${message}" in the ${sessionType} session. As the Codex Agent, I specialize in policy analysis and standards management. I can help you analyze regulatory frameworks, assess compliance, and develop governance standards.\n\n**Note**: This is a fallback response. The local BGIN API with Ollama integration provides full functionality.`,
      discourse: `**Discourse Agent Response** (Fallback Mode)\n\nI understand you're asking about "${message}" in the ${sessionType} session. As the Discourse Agent, I specialize in community engagement and collaboration. I can help you build consensus, facilitate discussions, and coordinate stakeholder engagement.\n\n**Note**: This is a fallback response. The local BGIN API with Ollama integration provides full functionality.`,
      multi: `**Multi-Agent Collaboration Response** (Fallback Mode)\n\nI understand you're asking about "${message}" in the ${sessionType} session. As the Multi-Agent System, I coordinate between Archive, Codex, and Discourse agents to provide comprehensive blockchain governance research support.\n\n**Note**: This is a fallback response. The local BGIN API with Ollama integration provides full functionality.`
    };

    return {
      content: responses[isMultiAgent ? 'multi' : agentType as keyof typeof responses] || responses.archive,
      agent: agentType,
      session: sessionType,
      timestamp: new Date().toISOString(),
      confidence: 0.7,
      sources: 0,
      processingTime: 100,
      llmUsed: false,
      model: 'fallback',
      multiAgent: isMultiAgent
    };
  }

  /**
   * Test local API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      return response.ok;
    } catch (error) {
      console.error('Local API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get system status
   */
  async getStatus(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to get status:', error);
    }
    return null;
  }

  /**
   * Test Ollama integration
   */
  async testOllama(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/test-ollama`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to test Ollama:', error);
    }
    return null;
  }

  /**
   * Get available agents
   */
  async getAgents(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/agents`);
      if (response.ok) {
        const data = await response.json();
        return data.agents || ['archive', 'codex', 'discourse'];
      }
    } catch (error) {
      console.error('Failed to get agents:', error);
    }
    return ['archive', 'codex', 'discourse'];
  }

  /**
   * Get available sessions
   */
  async getSessions(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`);
      if (response.ok) {
        const data = await response.json();
        return data.sessions || ['regulatory', 'technical-standards', 'privacy-rights', 'cross-chain-governance'];
      }
    } catch (error) {
      console.error('Failed to get sessions:', error);
    }
    return ['regulatory', 'technical-standards', 'privacy-rights', 'cross-chain-governance'];
  }

  /**
   * Save chat conversation
   */
  async saveChat(projectId: string, sessionId: string, messages: any[], metadata?: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          sessionId,
          messages,
          metadata
        })
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to save chat: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to save chat:', error);
      throw error;
    }
  }

  /**
   * Load chat conversation
   */
  async loadChat(projectId: string, sessionId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/load/${projectId}/${sessionId}`);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to load chat: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
      throw error;
    }
  }

  /**
   * List all saved chats
   */
  async listChats(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/list`);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to list chats: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to list chats:', error);
      throw error;
    }
  }

  /**
   * Delete chat conversation
   */
  async deleteChat(filename: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/delete/${filename}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to delete chat: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      throw error;
    }
  }

  /**
   * Get all conference sessions
   */
  async getConferenceSessions(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/conference/sessions`);
      if (response.ok) {
        const data = await response.json();
        return data.sessions || [];
      } else {
        throw new Error(`Failed to get conference sessions: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to get conference sessions:', error);
      throw error;
    }
  }

  /**
   * Get all conference tracks
   */
  async getConferenceTracks(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/conference/tracks`);
      if (response.ok) {
        const data = await response.json();
        return data.tracks || [];
      } else {
        throw new Error(`Failed to get conference tracks: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to get conference tracks:', error);
      throw error;
    }
  }

  /**
   * Get specific conference session
   */
  async getConferenceSession(sessionId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/conference/sessions/${sessionId}`);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to get conference session: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to get conference session:', error);
      throw error;
    }
  }

  /**
   * Initialize conference session chat
   */
  async initConferenceSession(sessionId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/conference/sessions/${sessionId}/init`, {
        method: 'POST'
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to initialize conference session: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to initialize conference session:', error);
      throw error;
    }
  }

  /**
   * Get Discourse status
   */
  async getDiscourseStatus(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/discourse/status`);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to get Discourse status: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to get Discourse status:', error);
      throw error;
    }
  }

  /**
   * Get Discourse categories
   */
  async getDiscourseCategories(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/discourse/categories`);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to get Discourse categories: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to get Discourse categories:', error);
      throw error;
    }
  }

  /**
   * Publish insight to Discourse
   */
  async publishToDiscourse(
    title: string, 
    content: string, 
    categoryId?: number, 
    tags?: string[], 
    sessionId?: string, 
    projectId?: string, 
    agentType?: string
  ): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/discourse/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          categoryId,
          tags,
          sessionId,
          projectId,
          agentType
        })
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to publish to Discourse: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to publish to Discourse:', error);
      throw error;
    }
  }

  /**
   * Reply to Discourse topic
   */
  async replyToDiscourse(
    topicId: number, 
    content: string, 
    sessionId?: string, 
    projectId?: string, 
    agentType?: string
  ): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/discourse/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId,
          content,
          sessionId,
          projectId,
          agentType
        })
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to reply to Discourse: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to reply to Discourse:', error);
      throw error;
    }
  }

  /**
   * Upload document to knowledge archives
   */
  async uploadDocument(
    file: File,
    workingGroupId: string,
    title: string,
    author: string,
    tags: string[],
    modelOverride?: string
  ): Promise<any> {
    try {
      console.log(`📄 Uploading document to working group: ${workingGroupId}`);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('author', author);
      formData.append('tags', JSON.stringify(tags));
      formData.append('modelOverride', modelOverride || 'Use default model');

      const response = await fetch(`${API_BASE_URL}/working-groups/${workingGroupId}/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to upload document: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to upload document:', error);
      throw error;
    }
  }

  /**
   * Get working groups for document upload
   */
  async getWorkingGroups(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/working-groups`);

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to get working groups: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to get working groups:', error);
      throw error;
    }
  }

  /**
   * Save message to chat room
   */
  async saveMessageToRoom(
    roomKey: ChatRoomKey,
    message: {
      role: 'user' | 'assistant' | 'system';
      content: string;
      agentType?: string;
      modelUsed?: string;
      metadata?: any;
    }
  ): Promise<void> {
    try {
      console.log(`📤 POST /api/chat/rooms/${roomKey}/messages`, message);
      const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomKey}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token'
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error(`❌ Failed to save message (${response.status}):`, errorData);
      } else {
        const result = await response.json();
        console.log(`✅ Message saved successfully:`, result);
      }
    } catch (error) {
      console.error('❌ Failed to save message to room:', error);
      // Don't throw - continue even if save fails
    }
  }

  /**
   * Get all chat rooms
   */
  async getChatRooms(): Promise<{ success: boolean; rooms: ChatRoom[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/rooms`, {
        headers: { 'Authorization': 'Bearer demo-token' }
      });
      if (response.ok) {
        return await response.json();
      }
      return { success: false, rooms: [] };
    } catch (error) {
      console.error('Failed to get chat rooms:', error);
      return { success: false, rooms: [] };
    }
  }

  /**
   * Get message history for a specific room
   */
  async getRoomMessages(
    roomKey: ChatRoomKey
  ): Promise<{ success: boolean; messages: ChatMessage[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomKey}/messages`, {
        headers: { 'Authorization': 'Bearer demo-token' }
      });
      if (response.ok) {
        return await response.json();
      }
      return { success: false, messages: [] };
    } catch (error) {
      console.error('Failed to get room messages:', error);
      return { success: false, messages: [] };
    }
  }

  /**
   * Clear all messages in a room
   */
  async clearRoomMessages(roomKey: ChatRoomKey): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomKey}/messages`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer demo-token' }
      });
      if (response.ok) {
        return await response.json();
      }
      return { success: false };
    } catch (error) {
      console.error('Failed to clear room messages:', error);
      return { success: false };
    }
  }
}

export default LocalApiService;
