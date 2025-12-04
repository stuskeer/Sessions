import database from "../services/database.js";

const LOCATIONS_ID = "global-locations";

function getLocations(req, res, next) {
  try {
    const result = database.prepare('SELECT data FROM settings WHERE id = ?').get(LOCATIONS_ID);
    
    if (!result) {
      return res.status(200).json({ locations: [] });
    }
    
    const locations = JSON.parse(result.data);
    res.status(200).json({ locations });
  } catch (error) {
    next(error);
  }
}

function addLocation(req, res, next) {
  try {
    const { location } = req.body;
    
    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      return res.status(400).json({ error: "Location name is required" });
    }
    
    // Get current locations
    const result = database.prepare('SELECT data FROM settings WHERE id = ?').get(LOCATIONS_ID);
    const currentLocations = result ? JSON.parse(result.data) : [];
    
    // Check if location already exists
    if (currentLocations.includes(location.trim())) {
      return res.status(400).json({ error: "Location already exists" });
    }
    
    // Add location to list
    const updatedLocations = [...currentLocations, location.trim()];
    
    const stmt = database.prepare('UPDATE settings SET data = ? WHERE id = ?');
    stmt.run(JSON.stringify(updatedLocations), LOCATIONS_ID);
    
    res.status(200).json({ 
      message: "Location added successfully",
      locations: updatedLocations
    });
  } catch (error) {
    next(error);
  }
}

function removeLocation(req, res, next) {
  try {
    const { location } = req.body;
    
    if (!location || typeof location !== 'string') {
      return res.status(400).json({ error: "Location name is required" });
    }
    
    // Get current locations
    const result = database.prepare('SELECT data FROM settings WHERE id = ?').get(LOCATIONS_ID);
    const currentLocations = result ? JSON.parse(result.data) : [];
    
    // Remove location from list
    const updatedLocations = currentLocations.filter(loc => loc !== location);
    
    const stmt = database.prepare('UPDATE settings SET data = ? WHERE id = ?');
    stmt.run(JSON.stringify(updatedLocations), LOCATIONS_ID);
    
    res.status(200).json({ 
      message: "Location removed successfully",
      locations: updatedLocations
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getLocations,
  addLocation,
  removeLocation,
};
