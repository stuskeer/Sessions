const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'frontend/images/icon.png'), // Add an icon if you have one
    title: 'Kitesurf Session Tracker'
  });

  // Hide menu bar
  mainWindow.setMenuBarVisibility(false);

  // Load the app after server starts
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 2000);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startServer() {
  // Start the Express server as a child process
  const serverPath = path.join(__dirname, 'index.js');
  serverProcess = spawn('node', [serverPath], {
    cwd: __dirname,
    env: { ...process.env, ELECTRON_MODE: 'true' }
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
}

app.on('ready', () => {
  startServer();
  createWindow();
});

app.on('window-all-closed', () => {
  // Kill server process
  if (serverProcess) {
    serverProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Clean up server on app quit
app.on('quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
