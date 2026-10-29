const { contextBridge, ipcRenderer } = require('electron');

// Only window buttons, the system browser and the sign-in return cross the bridge.
contextBridge.exposeInMainWorld('mnemo', {
  authRedirect: ipcRenderer.sendSync('auth:redirect'),
  window: (action) => ipcRenderer.invoke('window:action', action),
  openExternal: (url) => ipcRenderer.invoke('shell:open', url),
  onAuthCallback: (callback) => {
    const listener = (_event, url) => callback(url);
    ipcRenderer.on('auth:callback', listener);
    return () => ipcRenderer.removeListener('auth:callback', listener);
  },
});
