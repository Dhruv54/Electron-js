const { app, BrowserWindow, ipcMain } = require('electron');
//const path = require('path');

function createWindow() {
  console.log('Creating main window...');
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true
    }
  });

  console.log('Loading index.html...');
  mainWindow.loadFile('index.html');
  console.log('Main window created successfully');
}

app.whenReady().then(() => {
  console.log('Electron app is ready');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});