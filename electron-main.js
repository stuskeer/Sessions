import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import Router from './views/router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let server;

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
    icon: path.join(__dirname, 'frontend/images/icon.png'),
    title: 'Kitesurf Session Tracker'
  });

  // Hide menu bar
  mainWindow.setMenuBarVisibility(false);

  // Load the app after server starts
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 1500);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startServer() {
  const port = 3000;
  const expressApp = express();

  expressApp.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  expressApp.use(express.json());

  // Serve static files from frontend directory
  expressApp.use(express.static(path.join(__dirname, 'frontend')));

  // Redirect root to main page
  expressApp.get('/', (req, res) => {
    res.redirect('/index.html');
  });

  expressApp.use(Router);

  server = expressApp.listen(port, () => {
    console.log(`🤖 Server listening on Port: ${port}`);
    console.log('Running in Electron mode');
  });
}

app.on('ready', () => {
  startServer();
  createWindow();
});

app.on('window-all-closed', () => {
  // Close server
  if (server) {
    server.close();
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

app.on('before-quit', () => {
  if (server) {
    server.close();
  }
});
