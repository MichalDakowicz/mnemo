const { app, BrowserWindow, Menu, Tray, ipcMain, protocol, net, shell } = require('electron');
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

// Google sign-in runs in the system browser and returns as mnemo://auth?code=...
const SCHEME = 'mnemo';
if (process.defaultApp && process.argv[1]) app.setAsDefaultProtocolClient(SCHEME, process.execPath, [path.resolve(process.argv[1])]);
else app.setAsDefaultProtocolClient(SCHEME);

const ICON = path.join(__dirname, 'assets', 'icon.ico');
let mainWindow = null;
let tray = null;
function handleAuthUrl(url) {
  if (!url || !url.startsWith(`${SCHEME}://`) || !mainWindow) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
  mainWindow.webContents.send('auth:callback', url);
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', (_event, argv) => handleAuthUrl(argv.find((a) => a.startsWith(`${SCHEME}://`))));
}
app.on('open-url', (event, url) => { event.preventDefault(); handleAuthUrl(url); });

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 420,
    minHeight: 600,
    backgroundColor: '#0a0a0b',
    frame: false,
    show: false,
    title: 'Mnemo',
    icon: ICON,
    webPreferences: { contextIsolation: true, sandbox: true, preload: path.join(__dirname, 'preload.js') },
  });
  mainWindow = win;
  win.on('closed', () => { mainWindow = null; });
  // Open maximized, shown once the first frame is ready so it never flashes at the default size.
  win.once('ready-to-show', () => { win.maximize(); win.show(); });
  win.loadURL(DEV_URL || 'app://mnemo/');
  // Anything that is not the app itself (TMDB links, OAuth) opens in the real browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

ipcMain.on('auth:redirect', (event) => { event.returnValue = `${SCHEME}://auth`; });

ipcMain.handle('shell:open', (_event, url) => {
  if (typeof url === 'string' && url.startsWith('https://')) return shell.openExternal(url);
});

ipcMain.handle('window:action', (event, action) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  if (action === 'minimize') win.minimize();
  if (action === 'maximize') win.isMaximized() ? win.unmaximize() : win.maximize();
  if (action === 'close') win.close();
});

function createTray() {
  tray = new Tray(ICON);
  tray.setToolTip('Mnemo');
  const show = () => {
    if (!mainWindow) return createWindow();
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  };
  tray.on('click', show);
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open Mnemo', click: show },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]));
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
  createTray();
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow());
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
