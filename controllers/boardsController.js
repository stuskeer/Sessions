import database from "../services/database.js";

const BOARDS_ID = "global-boards";

function getBoards(req, res, next) {
  try {
    const result = database.prepare('SELECT data FROM settings WHERE id = ?').get(BOARDS_ID);
    
    if (!result) {
      return res.status(200).json({ boards: [] });
    }
    
    const boards = JSON.parse(result.data);
    res.status(200).json({ boards });
  } catch (error) {
    next(error);
  }
}

function addBoard(req, res, next) {
  try {
    const { board } = req.body;
    
    if (!board || typeof board !== 'string' || board.trim().length === 0) {
      return res.status(400).json({ error: "Board name is required" });
    }
    
    // Get current boards
    const result = database.prepare('SELECT data FROM settings WHERE id = ?').get(BOARDS_ID);
    const currentBoards = result ? JSON.parse(result.data) : [];
    
    // Check if board already exists
    if (currentBoards.includes(board.trim())) {
      return res.status(400).json({ error: "Board already exists" });
    }
    
    // Add board to list
    const updatedBoards = [...currentBoards, board.trim()];
    
    const stmt = database.prepare('UPDATE settings SET data = ? WHERE id = ?');
    stmt.run(JSON.stringify(updatedBoards), BOARDS_ID);
    
    res.status(200).json({ 
      message: "Board added successfully",
      boards: updatedBoards
    });
  } catch (error) {
    next(error);
  }
}

function removeBoard(req, res, next) {
  try {
    const { board } = req.body;
    
    if (!board || typeof board !== 'string') {
      return res.status(400).json({ error: "Board name is required" });
    }
    
    // Get current boards
    const result = database.prepare('SELECT data FROM settings WHERE id = ?').get(BOARDS_ID);
    const currentBoards = result ? JSON.parse(result.data) : [];
    
    // Remove board from list
    const updatedBoards = currentBoards.filter(b => b !== board);
    
    const stmt = database.prepare('UPDATE settings SET data = ? WHERE id = ?');
    stmt.run(JSON.stringify(updatedBoards), BOARDS_ID);
    
    res.status(200).json({ 
      message: "Board removed successfully",
      boards: updatedBoards
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getBoards,
  addBoard,
  removeBoard,
};
