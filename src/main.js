const { app, BrowserWindow, ipcMain } = require('electron')
const { join } = require('path')

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

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
      // devTools: !app.isPackaged,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // mainWindow.setMenu(null)
  mainWindow.loadFile(join(__dirname, './game/index.html'))

  mainWindow.on('closed', () => {
    app.quit()
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('app:reload', () => {
  mainWindow.webContents.reload()
})

ipcMain.on('app:min', () => {
  mainWindow.minimize()
})

ipcMain.on('app:max', e => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})

ipcMain.on('app:quit', () => {
  app.exit()
})

ipcMain.on('vue:ready', (_e, dev) => {
  mainWindow.show()
  if (dev) {
    ipcMain.on('dev:tool', () => {
      if (mainWindow) {
        if (mainWindow.webContents.isDevToolsOpened()) {
          mainWindow.webContents.closeDevTools()
        } else {
          mainWindow.webContents.openDevTools()
        }
      }
    })

    ipcMain.on('dev:vue', () => {
      try {
        require('./window/devtools')(mainWindow)
      } catch (_err) { }
    })
  }
})

require('./window/console')
