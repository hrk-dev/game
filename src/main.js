const { app, BrowserWindow, ipcMain } = require('electron')
const { existsSync } = require('fs')
const { join } = require('path')

require('./module/process')

ipcMain.setMaxListeners(1)

let mainWindow
function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 720 + 30,
    minWidth: 1024,
    minHeight: 720 + 30,
    frame: false,
    fullscreenable: true,
    webPreferences: {
      // devTools: !app.isPackaged,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.setMenu(null)
  mainWindow.loadFile(join(__dirname, './game/index.html'))

  mainWindow.on('closed', () => {
    app.quit()
    process.exit()
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
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

  ipcMain.on('app:fullscreen', (e, flag) => {
    mainWindow.setFullScreen(flag ?? !mainWindow.isFullScreen())
    e.returnValue = mainWindow.isFullScreen()
  })

  ipcMain.on('app:quit', () => {
    app.exit()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

function setDev(dev) {
  const eventNames = ipcMain.eventNames()

  if (dev) {
    if (!eventNames.includes('dev:tool')) {
      ipcMain.on('dev:tool', () => {
        if (mainWindow) {
          if (mainWindow.webContents.isDevToolsOpened()) {
            mainWindow.webContents.closeDevTools()
          } else {
            mainWindow.webContents.openDevTools()
          }
        }
      })
    }

    if (!eventNames.includes('dev:vue')) {
      ipcMain.on('dev:vue', () => {
        if (existsSync(join(__dirname, './module/devtools.js'))) {
          require('./module/devtools')(mainWindow)
        }
      })
    }
  } else {
    if (eventNames.includes('dev:tool')) {
      ipcMain.off('dev:tool')
    }

    if (eventNames.includes('dev:vue')) {
      ipcMain.off('dev:vue')
    }
  }

}

let steamSDK = false
ipcMain.on('vue:ready', (_e, dev) => {
  mainWindow.show()

  setDev(dev)

  if (!steamSDK) {
    steamSDK = true
    if (dev) {
      if (existsSync(join(__dirname, './module/steam'))) {
        require('./module/steam')
      }
    } else {
      try {
        require('./module/steam')
      } catch (_err) { }
    }
  }
})

if (app.isPackaged) {
  console.log('Nya~\n')
}
