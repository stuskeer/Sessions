import database from "../services/database.js";

const QUIVER_ID = "global-quiver";

function getQuiver(req, res, next) {
  try {
    const result = database.prepare('SELECT data FROM settings WHERE id = ?').get(QUIVER_ID);
    
    if (!result) {
      return res.status(200).json({ quiver: [] });
    }
    
    const quiver = JSON.parse(result.data);
    res.status(200).json({ quiver });
  } catch (error) {
    next(error);
  }
}

function addKite(req, res, next) {
  try {
    const { kite } = req.body;
    
    if (!kite || typeof kite !== 'string' || kite.trim().length === 0) {
      return res.status(400).json({ error: "Kite name is required" });
    }
    
    // Get current quiver
    const result = database.prepare('SELECT data FROM settings WHERE id = ?').get(QUIVER_ID);
    const currentQuiver = result ? JSON.parse(result.data) : [];
    
    // Check if kite already exists
    if (currentQuiver.includes(kite.trim())) {
      return res.status(400).json({ error: "Kite already exists in quiver" });
    }
    
    // Add kite to quiver
    const updatedQuiver = [...currentQuiver, kite.trim()];
    
    const stmt = database.prepare('UPDATE settings SET data = ? WHERE id = ?');
    stmt.run(JSON.stringify(updatedQuiver), QUIVER_ID);
    
    res.status(200).json({ 
      message: "Kite added successfully",
      quiver: updatedQuiver
    });
  } catch (error) {
    next(error);
  }
}

function removeKite(req, res, next) {
  try {
    const { kite } = req.body;
    
    if (!kite || typeof kite !== 'string') {
      return res.status(400).json({ error: "Kite name is required" });
    }
    
    // Get current quiver
    const result = database.prepare('SELECT data FROM settings WHERE id = ?').get(QUIVER_ID);
    const currentQuiver = result ? JSON.parse(result.data) : [];
    
    // Remove kite from quiver
    const updatedQuiver = currentQuiver.filter(k => k !== kite);
    
    const stmt = database.prepare('UPDATE settings SET data = ? WHERE id = ?');
    stmt.run(JSON.stringify(updatedQuiver), QUIVER_ID);
    
    res.status(200).json({ 
      message: "Kite removed successfully",
      quiver: updatedQuiver
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getQuiver,
  addKite,
  removeKite,
};
