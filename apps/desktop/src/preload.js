const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  reload: () => ipcRenderer.invoke('reload'),
  forceReload: () => ipcRenderer.invoke('force-reload'),
  toggleDevTools: () => ipcRenderer.invoke('dev-tools'),
  getVersion: () => ipcRenderer.invoke('get-version'),
  getPlatform: () => process.platform,
  isPackaged: () => process.env.ELECTRON_IS_PACKAGED === '1'
});

contextBridge.exposeInMainWorld('electronEvents', {
  onAppReady: (callback) => {
    ipcRenderer.on('app-ready', (event, data) => callback(data));
  },
  onWindowFocus: (callback) => {
    ipcRenderer.on('window-focus', () => callback());
  },
  onWindowBlur: (callback) => {
    ipcRenderer.on('window-blur', () => callback());
  }
});