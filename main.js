const { app, BrowserWindow } = require('electron');
const path = require('path');
const waitOn = require('wait-on');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // Wait for React development server to be available
  waitOn({ resources: ['http://localhost:3000'] }, (err) => {
    if (err) {
      console.log('React server is not ready:', err);
    } else {
      win.loadURL('http://localhost:3000');
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
