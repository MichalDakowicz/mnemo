const { app, BrowserWindow, protocol, net, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

// The web export uses root-absolute asset paths and SPA routes, so it is served
// from a custom scheme with an index.html fallback instead of file://.
const DIST = app.isPackaged ? path.join(__dirname, 'dist') : path.join(__dirname, '..', 'dist');
const DEV_URL = process.env.MNEMO_DEV_URL;

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } },
]);

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 420,
    minHeight: 600,
    backgroundColor: '#0a0a0b',
    autoHideMenuBar: true,
    title: 'Mnemo',
    webPreferences: { contextIsolation: true, sandbox: true, preload: path.join(__dirname, 'preload.js') },
  });
  win.loadURL(DEV_URL || 'app://mnemo/');
  // Anything that is not the app itself (TMDB links, OAuth) opens in the real browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  protocol.handle('app', (request) => {
    const { pathname } = new URL(request.url);
    const requested = path.normalize(path.join(DIST, decodeURIComponent(pathname)));
    const inside = requested.startsWith(DIST);
    const file = inside && fs.existsSync(requested) && fs.statSync(requested).isFile() ? requested : path.join(DIST, 'index.html');
    return net.fetch(pathToFileURL(file).toString());
  });
  createWindow();
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow());
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
