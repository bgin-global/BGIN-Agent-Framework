// =====================================
// backend/src/routes/chat.ts
// Chat rooms and message history API
// =====================================

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { database } from '../utils/database';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Get all chat rooms (6 fixed rooms)
 * GET /api/chat/rooms
 */
router.get('/rooms', asyncHandler(async (req, res) => {
  const result = await database.query(`
    SELECT id, room_key, name, description, agent_type, is_multi_agent, metadata, created_at
    FROM chat_rooms
    ORDER BY
      CASE room_key
        WHEN 'bgin-agent-hack' THEN 1
        WHEN 'identity-privacy' THEN 2
        WHEN 'cybersecurity' THEN 3
        WHEN 'fase' THEN 4
        WHEN 'general' THEN 5
        WHEN 'direct-agent' THEN 6
        ELSE 99
      END
  `);

  res.json({
    success: true,
    rooms: result.rows
  });
  return null;
}));

/**
 * Get message history for a specific room
 * GET /api/chat/rooms/:roomKey/messages
 */
router.get('/rooms/:roomKey/messages', asyncHandler(async (req, res) => {
  const { roomKey } = req.params;
  const { participantHash = 'demo-user', limit = 100 } = req.query;

  // Get room ID
  const roomResult = await database.query(
    'SELECT id FROM chat_rooms WHERE room_key = $1',
    [roomKey]
  );

  if (roomResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Room not found',
      roomKey
    });
  }

  const roomId = roomResult.rows[0].id;

  // Get messages
  const messagesResult = await database.query(`
    SELECT id, role, content, agent_type, model_used, metadata, created_at
    FROM chat_messages
    WHERE room_id = $1 AND participant_hash = $2
    ORDER BY created_at ASC
    LIMIT $3
  `, [roomId, participantHash, limit]);

  logger.info(`Retrieved ${messagesResult.rows.length} messages for room: ${roomKey}`);

  res.json({
    success: true,
    roomKey,
    messageCount: messagesResult.rows.length,
    messages: messagesResult.rows
  });
  return null;
}));

/**
 * Save a message to a room
 * POST /api/chat/rooms/:roomKey/messages
 */
router.post('/rooms/:roomKey/messages', asyncHandler(async (req, res) => {
  const { roomKey } = req.params;
  const {
    role,
    content,
    agentType,
    modelUsed,
    metadata = {},
    participantHash = 'demo-user'
  } = req.body;

  logger.info(`📥 Received message save request: roomKey=${roomKey}, role=${role}, contentLength=${content?.length}`);

  if (!role || !content) {
    return res.status(400).json({
      success: false,
      error: 'role and content are required'
    });
  }

  if (!['user', 'assistant', 'system'].includes(role)) {
    return res.status(400).json({
      success: false,
      error: 'role must be one of: user, assistant, system'
    });
  }

  // Get room ID
  const roomResult = await database.query(
    'SELECT id FROM chat_rooms WHERE room_key = $1',
    [roomKey]
  );

  if (roomResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Room not found',
      roomKey
    });
  }

  const roomId = roomResult.rows[0].id;

  // Insert message
  const insertResult = await database.query(`
    INSERT INTO chat_messages (
      room_id,
      participant_hash,
      role,
      content,
      agent_type,
      model_used,
      metadata
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, created_at
  `, [
    roomId,
    participantHash,
    role,
    content,
    agentType || null,
    modelUsed || null,
    JSON.stringify(metadata)
  ]);

  logger.info(`Message saved to room ${roomKey}: role=${role}, length=${content.length}`);

  res.json({
    success: true,
    message: 'Message saved successfully',
    messageId: insertResult.rows[0].id,
    roomKey,
    createdAt: insertResult.rows[0].created_at
  });
  return null;
}));

/**
 * Delete all messages in a room for a specific participant
 * DELETE /api/chat/rooms/:roomKey/messages
 */
router.delete('/rooms/:roomKey/messages', asyncHandler(async (req, res) => {
  const { roomKey } = req.params;
  const { participantHash = 'demo-user' } = req.query;

  // Get room ID
  const roomResult = await database.query(
    'SELECT id FROM chat_rooms WHERE room_key = $1',
    [roomKey]
  );

  if (roomResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Room not found',
      roomKey
    });
  }

  const roomId = roomResult.rows[0].id;

  // Delete messages
  const deleteResult = await database.query(`
    DELETE FROM chat_messages
    WHERE room_id = $1 AND participant_hash = $2
  `, [roomId, participantHash]);

  logger.info(`Deleted ${deleteResult.rowCount} messages from room ${roomKey}`);

  res.json({
    success: true,
    message: 'Messages deleted successfully',
    roomKey,
    deletedCount: deleteResult.rowCount
  });
  return null;
}));

export default router;
