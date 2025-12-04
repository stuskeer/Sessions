import database from "../services/database.js";

const WIND_UNIT_ID = "wind-speed-unit";
const SPEED_UNIT_ID = "max-speed-unit";

// Wind speed conversion factors (all to/from knots)
const CONVERSIONS = {
  kts: 1,
  ms: 0.514444,    // 1 knot = 0.514444 m/s
  kmh: 1.852,      // 1 knot = 1.852 km/h
  mph: 1.15078,    // 1 knot = 1.15078 mph
  bft: null        // Beaufort scale is non-linear
};

// Speed conversion factors (all to/from mph)
const SPEED_CONVERSIONS = {
  mph: 1,
  kmh: 1.60934,    // 1 mph = 1.60934 km/h
  ms: 0.44704      // 1 mph = 0.44704 m/s
};

// Beaufort scale conversion (knots to Beaufort)
function knotsToBeaufort(knots) {
  if (knots < 1) return 0;
  if (knots < 4) return 1;
  if (knots < 7) return 2;
  if (knots < 11) return 3;
  if (knots < 17) return 4;
  if (knots < 22) return 5;
  if (knots < 28) return 6;
  if (knots < 34) return 7;
  if (knots < 41) return 8;
  if (knots < 48) return 9;
  if (knots < 56) return 10;
  if (knots < 64) return 11;
  return 12;
}

// Beaufort scale conversion (Beaufort to knots - uses midpoint)
function beaufortToKnots(bft) {
  const midpoints = [0.5, 2.5, 5.5, 9, 14, 19.5, 25, 31, 37.5, 44.5, 52, 60, 68];
  return midpoints[Math.min(bft, 12)] || 0;
}

// Convert wind speed between units
function convertWindSpeed(value, fromUnit, toUnit) {
  if (!value || fromUnit === toUnit) return value;
  
  // Convert to knots first
  let knots;
  if (fromUnit === 'bft') {
    knots = beaufortToKnots(value);
  } else {
    knots = value / CONVERSIONS[fromUnit];
  }
  
  // Convert from knots to target unit
  if (toUnit === 'bft') {
    return knotsToBeaufort(knots);
  } else {
    return Math.round(knots * CONVERSIONS[toUnit]);
  }
}

function getWindUnit(req, res, next) {
  try {
    const result = database.prepare('SELECT data FROM settings WHERE id = ?').get(WIND_UNIT_ID);
    
    if (!result) {
      return res.status(200).json({ windUnit: 'kts' });
    }
    
    const windUnit = JSON.parse(result.data);
    res.status(200).json({ windUnit });
  } catch (error) {
    next(error);
  }
}

function setWindUnit(req, res, next) {
  try {
    const { windUnit } = req.body;
    
    if (!windUnit || !['kts', 'bft', 'ms', 'kmh', 'mph'].includes(windUnit)) {
      return res.status(400).json({ error: "Invalid wind unit" });
    }
    
    // Get current wind unit
    const currentResult = database.prepare('SELECT data FROM settings WHERE id = ?').get(WIND_UNIT_ID);
    const currentUnit = currentResult ? JSON.parse(currentResult.data) : 'kts';
    
    // Update wind unit setting
    const stmt = database.prepare('INSERT OR REPLACE INTO settings (id, data) VALUES (?, ?)');
    stmt.run(WIND_UNIT_ID, JSON.stringify(windUnit));
    
    // Convert all existing wind speeds in sessions
    if (currentUnit !== windUnit) {
      const sessions = database.prepare('SELECT id, wind_speed FROM sessions WHERE wind_speed IS NOT NULL').all();
      
      const updateStmt = database.prepare('UPDATE sessions SET wind_speed = ? WHERE id = ?');
      
      for (const session of sessions) {
        const convertedSpeed = convertWindSpeed(session.wind_speed, currentUnit, windUnit);
        updateStmt.run(convertedSpeed, session.id);
      }
    }
    
    res.status(200).json({ 
      message: "Wind unit updated successfully",
      windUnit,
      sessionsUpdated: true
    });
  } catch (error) {
    next(error);
  }
}

// Convert speed between units
function convertSpeed(value, fromUnit, toUnit) {
  if (!value || fromUnit === toUnit) return value;
  
  // Convert to mph first
  const mph = value / SPEED_CONVERSIONS[fromUnit];
  
  // Convert from mph to target unit
  const converted = mph * SPEED_CONVERSIONS[toUnit];
  return Math.round(converted * 10) / 10; // Round to 1 decimal place
}

function getSpeedUnit(req, res, next) {
  try {
    const result = database.prepare('SELECT data FROM settings WHERE id = ?').get(SPEED_UNIT_ID);
    
    if (!result) {
      return res.status(200).json({ speedUnit: 'mph' });
    }
    
    const speedUnit = JSON.parse(result.data);
    res.status(200).json({ speedUnit });
  } catch (error) {
    next(error);
  }
}

function setSpeedUnit(req, res, next) {
  try {
    const { speedUnit } = req.body;
    
    if (!speedUnit || !['mph', 'kmh', 'ms'].includes(speedUnit)) {
      return res.status(400).json({ error: "Invalid speed unit" });
    }
    
    // Get current speed unit
    const currentResult = database.prepare('SELECT data FROM settings WHERE id = ?').get(SPEED_UNIT_ID);
    const currentUnit = currentResult ? JSON.parse(currentResult.data) : 'mph';
    
    // Update speed unit setting
    const stmt = database.prepare('INSERT OR REPLACE INTO settings (id, data) VALUES (?, ?)');
    stmt.run(SPEED_UNIT_ID, JSON.stringify(speedUnit));
    
    // Convert all existing max speeds in sessions
    if (currentUnit !== speedUnit) {
      const sessions = database.prepare('SELECT id, max_speed FROM sessions WHERE max_speed IS NOT NULL').all();
      
      const updateStmt = database.prepare('UPDATE sessions SET max_speed = ? WHERE id = ?');
      
      for (const session of sessions) {
        const convertedSpeed = convertSpeed(session.max_speed, currentUnit, speedUnit);
        updateStmt.run(convertedSpeed, session.id);
      }
    }
    
    res.status(200).json({ 
      message: "Speed unit updated successfully",
      speedUnit,
      sessionsUpdated: true
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getWindUnit,
  setWindUnit,
  getSpeedUnit,
  setSpeedUnit,
};
