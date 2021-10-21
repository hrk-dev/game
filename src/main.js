const { app, BrowserWindow, ipcMain } = require('electron')
const { join } = require('path')

let mainWindow
function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 720 + 30,
    minWidth: 1024,
    minHeight: 720 + 30,
    frame: false,
    fullscreenable: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile(join(__dirname, 'index.html'))

  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('app:quit', () => {
  app.exit()
})

ipcMain.on('app:dev', () => {
  if (mainWindow) {
    mainWindow.webContents.openDevTools()
  }
})

ipcMain.on('app:max', e => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})

ipcMain.on('app:min', () => {
  mainWindow.minimize()
})

ipcMain.on('app:reload', () => {
  mainWindow.webContents.reload()
})

ipcMain.on('vue:ready', () => {
  mainWindow.show()
})
