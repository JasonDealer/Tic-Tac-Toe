const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'src', 'preload.js')
        }
    });

    win.loadFile('src/index.html');
}

app.whenReady().then(createWindow);

// Window close handler
ipcMain.on('close-window', () => {
    app.quit();
});