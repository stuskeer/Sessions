# Kitesurf Session Tracker

A desktop application for tracking and analyzing kitesurfing sessions. Built with Electron, Node.js, Express, and SQLite - no external database or authentication required.

**Developed by:** Stuart Skeer  
**Version:** 1.0.0-beta  
**Released:** December 2025

## Features

### Session Management
- **Add Sessions**: Track detailed information about each kitesurf session
- **Update Sessions**: Modify existing session details
- **Remove Sessions**: Delete sessions by ID
- **View All Sessions**: Display sessions in a filterable, sortable table
- **Simple ID System**: User-friendly sequential IDs (1, 2, 3...) mapped to UUIDs internally

### Session Details
- **Required Fields**:
  - Location (selected from your saved spots)
  - Date
  - Kite (selected from your quiver)
  - Board (selected from your boards)
  - Session type (Freeride, Freestyle, Big Air, Wave)
  - Duration (HH:MM format)

- **Optional Fields**:
  - Max jump height (meters)
  - Wind speed (customizable units)
  - Wind direction (On Shore, Cross Shore, Cross On, Cross Off, Off Shore)
  - Max speed (customizable units)
  - Max jump distance (meters)
  - Max airtime (seconds)

### Insights Dashboard
- **Statistics Cards**:
  - Highest jump (clickable to view session details)
  - Total sessions count
  - Total time on the water
  
- **Visualizations**:
  - Time by Kite (pie chart)
  - Sessions by Location (clickable for location statistics)
  
- **Interactive Features**:
  - Click highest jump card to see the full session details
  - Click any location to view aggregated statistics:
    - Total sessions and time at location
    - Max, min, and average wind speed
    - Most common wind direction
    - Max and average jump heights
    - Most common session type

### Settings
- **Manage Your Quiver**: Add and remove kites
- **Manage Locations**: Add and remove favorite kite spots
- **Manage Boards**: Add and remove boards
- **Wind Speed Unit**: Choose between Knots, Beaufort, m/s, km/h, or mph
- **Max Speed Unit**: Choose between mph, km/h, or m/s

### About Page
- Comprehensive usage guide
- Getting started instructions
- Feature overview and tips
- Developer information

### User Experience
- **Desktop Application**: Native app experience with Electron - no browser needed
- **Single User**: No login required - designed for personal use
- **Standalone**: All data stored locally in SQLite database
- **Responsive UI**: Modern, clean interface with dark theme
- **Hamburger Menu**: Easy navigation between Sessions, Insights, Settings, and About
- **Table Filtering**: Filter sessions by any column
- **Table Sorting**: Sort by date, duration, wind speed, jump height, and more

## Installation

### For End Users (Desktop App)

**Download the installer for your platform** from the [Releases](https://github.com/stuskeer/Sessions/releases) page:
- **macOS**: Download `.dmg` file, open and drag to Applications
- **Windows**: Download and run `.exe` installer
- **Linux**: Download `.AppImage` or `.deb` package

The database will be created automatically on first run in your system's user data directory:
- **macOS**: `~/Library/Application Support/Session Tracker/kitesessions.db`
- **Windows**: `%APPDATA%/Session Tracker/kitesessions.db`
- **Linux**: `~/.config/Session Tracker/kitesessions.db`

### For Developers

1. **Prerequisites**: Install Node.js (v14 or higher)

2. **Clone and install dependencies**:
   ```bash
   git clone https://github.com/stuskeer/Sessions.git
   cd Sessions
   npm install
   ```

3. **Environment Setup** (optional):
   - A `.env` file is supported but not required
   - The application works out of the box with default settings

## Running the Application

**Run as desktop app (Electron)**:
```bash
npm run electron
```

**Development mode for desktop app** (auto-reload):
```bash
npm run electron-dev
```

**Run as web server only** (for development):
```bash
npm start
```
Then open `http://localhost:3000` in your browser.

**Web server with auto-reload**:
```bash
npm run dev
```

## Quick Start Guide

### First Time Setup

1. **Navigate to Settings**:
   - Click the hamburger menu (☰) in the top right
   - Select "Settings"

2. **Add Your Gear**:
   - Add kites to your quiver (e.g., "Duotone Rebel 9m")
   - Add boards (e.g., "North Select 140cm")
   - Add your favorite kite spots (e.g., "Tarifa", "Cape Town")

3. **Set Preferences** (optional):
   - Choose your preferred wind speed unit
   - Choose your preferred max speed unit

### Managing Sessions

1. **View Sessions**:
   - Click "Fetch Sessions" on the main page
   - Sessions display in a table with all details
   - Use filter inputs at the top of each column
   - Use sort dropdowns for numerical/date fields

2. **Add a Session**:
   - Expand "➕ Add Session"
   - Fill in required fields
   - Optionally expand "Optional Information" for detailed stats
   - Click "Add Session"

3. **Update a Session**:
   - Note the Session ID from the table
   - Expand "✏️ Update Session"
   - Enter the Session ID
   - Fill in fields you want to update
   - Click "Update Session"

4. **Remove a Session**:
   - Note the Session ID from the table
   - Expand "🗑️ Remove Session"
   - Enter the Session ID
   - Click "Remove Session"

### Insights

1. **Access Insights**:
   - Click hamburger menu → "Insights"

2. **Explore Data**:
   - View key statistics in the top cards
   - Click "Highest Jump" to see that session's details
   - Click any location in "Sessions by Location" to see location statistics
   - View kite usage distribution in the pie chart

## Project Structure

```
Sessions/
├── controllers/              # Business logic
│   ├── sessionController.js  # Session CRUD operations
│   ├── quiverController.js   # Kite management
│   ├── locationsController.js # Location management
│   ├── boardsController.js   # Board management
│   └── settingsController.js # Settings (wind/speed units)
├── models/                   # Data validation
│   └── session.js           # Joi validation schemas
├── services/                 # Core services
│   └── database.js          # SQLite setup and initialization
├── views/                    # API routing
│   └── router.js            # Express routes
├── frontend/                 # Client-side files
│   ├── index.html           # Main sessions page
│   ├── insights.html        # Analytics dashboard
│   ├── settings.html        # Configuration page
│   ├── about.html           # Usage guide and app info
│   ├── style.css            # Global styles
│   └── images/              # Assets
├── index.js                  # Express server entry point
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (optional)
└── kitesessions.db          # SQLite database (auto-created)
```

## Database Schema

The application uses SQLite with two main tables:

### `sessions` Table
- **id** (TEXT PRIMARY KEY) - UUID v4
- **location** (TEXT) - Session location
- **date** (TEXT) - Date in YYYY-MM-DD format
- **kite** (TEXT) - Kite used
- **board** (TEXT) - Board used
- **session_type** (TEXT) - Type: Freeride, Freestyle, Big Air, or Wave
- **duration** (TEXT) - Duration in HH:MM format
- **max_jump** (REAL) - Maximum jump height in meters (optional)
- **wind_direction** (TEXT) - Wind direction (optional)
- **wind_speed** (INTEGER) - Wind speed in stored unit (optional)
- **max_speed** (REAL) - Maximum speed in stored unit (optional)
- **max_jump_distance** (REAL) - Maximum jump distance in meters (optional)
- **max_airtime** (REAL) - Maximum airtime in seconds (optional)

### `settings` Table
- **id** (TEXT PRIMARY KEY) - Setting identifier
- **data** (TEXT) - JSON-stringified setting data

**Settings stored:**
- `global-quiver`: Array of kite names
- `global-locations`: Array of location names
- `global-boards`: Array of board names
- `wind-speed-unit`: Selected wind speed unit
- `max-speed-unit`: Selected max speed unit

## Technologies

- **Desktop Framework**: Electron
- **Backend**: Node.js, Express 5
- **Database**: SQLite (better-sqlite3)
- **Validation**: Joi
- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Additional**: CORS, dotenv, UUID, express-session

## API Endpoints

### Sessions
- `GET /sessions` - Get all sessions
- `POST /sessions` - Create a new session
- `GET /sessions/:id` - Get session by UUID
- `PUT /sessions/:id` - Update session by UUID
- `DELETE /sessions/:id` - Delete session by UUID

### Quiver (Kites)
- `GET /quiver` - Get all kites
- `POST /quiver` - Add a kite (body: `{kiteName: string}`)
- `DELETE /quiver` - Remove a kite (body: `{kiteName: string}`)

### Locations
- `GET /locations` - Get all locations
- `POST /locations` - Add a location (body: `{locationName: string}`)
- `DELETE /locations` - Remove a location (body: `{locationName: string}`)

### Boards
- `GET /boards` - Get all boards
- `POST /boards` - Add a board (body: `{boardName: string}`)
- `DELETE /boards` - Remove a board (body: `{boardName: string}`)

### Settings
- `GET /settings/wind-unit` - Get wind speed unit
- `POST /settings/wind-unit` - Update wind speed unit (body: `{windUnit: string}`)
- `GET /settings/speed-unit` - Get max speed unit
- `POST /settings/speed-unit` - Update max speed unit (body: `{speedUnit: string}`)

## Development

**Development mode** with auto-reload:
```bash
npm run dev
```

**Run the Electron app in development:**
```bash
npm run electron
```

**Electron dev mode** (auto-reload on file changes):
```bash
npm run electron-dev
```

### Building Desktop Applications

The application uses Electron to create native desktop applications for all platforms.

**Build for your current platform:**
```bash
npm run build
```

**Build for specific platforms:**
```bash
npm run build:mac    # macOS (.dmg and .zip)
npm run build:win    # Windows (.exe installer and portable)
npm run build:linux  # Linux (.AppImage and .deb)
```

**Build for all platforms:**
```bash
npm run build:all
```

**Output files** will be in the `dist/` folder:
- **macOS**: `.dmg` (installer) and `.zip` (portable)
- **Windows**: `.exe` (NSIS installer) and portable `.exe`
- **Linux**: `.AppImage` (portable) and `.deb` (Debian package)

**Note:** Building for macOS requires macOS, building for Windows works best on Windows (can use Wine on Mac/Linux), and Linux builds work on all platforms.

### Icon Requirements

For professional-looking builds, add application icons:
- `frontend/images/icon.icns` (macOS) - 512x512 or 1024x1024
- `frontend/images/icon.ico` (Windows) - multiple sizes embedded
- `frontend/images/icon.png` (Linux) - 512x512

You can use tools like `electron-icon-builder` or online converters to create these from a single PNG.

## Future Enhancements

Potential features for future development:
- Export sessions to CSV/JSON
- Import sessions from file
- Session photos/media
- Weather data integration
- Multi-user support with authentication
- Mobile app version
- Desktop app packaging (Electron)
- Session comparison tools
- Progress tracking over time
- Gear usage analytics

## License

ISC

