import database from "../services/database.js";
import { v4 as uuidv4, validate as isValidUuid } from "uuid";
import sessionSchema, { updateSessionSchema } from "../models/session.js";

function getAllSessions(req, res, next) {
  try {
    const sessions = database.prepare('SELECT * FROM sessions ORDER BY date DESC').all();
    res.status(200).json(sessions);
  } catch (err) {
    next(err);
  }
}

function createSession(req, res, next) {
  try {
    const uuid = uuidv4();
    req.body.id = uuid;
    const { error, value } = sessionSchema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { id, location, date, kite, board, session_type, duration, max_jump, wind_direction, wind_speed, max_speed, max_jump_distance, max_airtime } = value;

    const stmt = database.prepare(`
      INSERT INTO sessions (id, location, date, kite, board, session_type, duration, max_jump, wind_direction, wind_speed, max_speed, max_jump_distance, max_airtime)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, location, date, kite, board, session_type, duration, max_jump ?? null, wind_direction || null, wind_speed ?? null, max_speed ?? null, max_jump_distance ?? null, max_airtime ?? null);

    const insertedSession = database.prepare('SELECT * FROM sessions WHERE id = ?').get(id);

    res
      .status(201)
      .json({ message: "Successfully created session", data: insertedSession });
  } catch (error) {
    next(error);
  }
}

function getSessionById(req, res, next) {
  const sessionId = req.params.id;
  
  // Validate UUID format
  if (!isValidUuid(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID format" });
  }
  
  try {
    const session = database.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId);
    if (!session) {
      return res.status(404).json({ message: "No session found" });
    }
    res.status(200).json(session);
  } catch (err) {
    next(err);
  }
}

function updateSessionById(req, res, next) {
  try {
    const sessionId = req.params.id;
    req.body.id = sessionId;
    const { error, value } = updateSessionSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if session exists
    const session = database.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId);

    if (!session) {
      return res.status(404).json({ message: "No session found" });
    }

    // Build dynamic UPDATE query based on provided fields
    const updates = [];
    const params = [];

    if (value.location !== undefined) {
      updates.push('location = ?');
      params.push(value.location);
    }

    if (value.date !== undefined) {
      updates.push('date = ?');
      params.push(value.date);
    }

    if (value.kite !== undefined) {
      updates.push('kite = ?');
      params.push(value.kite);
    }

    if (value.board !== undefined) {
      updates.push('board = ?');
      params.push(value.board);
    }

    if (value.session_type !== undefined) {
      updates.push('session_type = ?');
      params.push(value.session_type);
    }

    if (value.duration !== undefined) {
      updates.push('duration = ?');
      params.push(value.duration);
    }

    if (value.max_jump !== undefined) {
      updates.push('max_jump = ?');
      params.push(value.max_jump);
    }

    if (value.wind_direction !== undefined) {
      updates.push('wind_direction = ?');
      params.push(value.wind_direction || null);
    }

    if (value.wind_speed !== undefined) {
      updates.push('wind_speed = ?');
      params.push(value.wind_speed ?? null);
    }

    if (value.max_speed !== undefined) {
      updates.push('max_speed = ?');
      params.push(value.max_speed ?? null);
    }

    if (value.max_jump_distance !== undefined) {
      updates.push('max_jump_distance = ?');
      params.push(value.max_jump_distance ?? null);
    }

    if (value.max_airtime !== undefined) {
      updates.push('max_airtime = ?');
      params.push(value.max_airtime ?? null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    params.push(sessionId);
    const stmt = database.prepare(`UPDATE sessions SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...params);

    const updatedSession = database.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId);

    res.status(200).json(updatedSession);
  } catch (err) {
    next(err);
  }
}

function deleteSessionById(req, res, next) {
  const sessionId = req.params.id;
  
  // Validate UUID format
  if (!isValidUuid(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID format" });
  }
  
  try {
    const stmt = database.prepare('DELETE FROM sessions WHERE id = ?');
    const result = stmt.run(sessionId);
    
    // Check if any rows were actually deleted
    if (result.changes === 0) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export default {
  getAllSessions,
  createSession,
  getSessionById,
  updateSessionById,
  deleteSessionById,
};