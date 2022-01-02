const { BrowserWindow } = require('electron')
const { join } = require('path')

let devWindow = null
module.exports = function devtools(mainWindow) {
  if (devWindow) {
    devWindow.show()
    return
  }

  require('@vue/devtools/server')

  devWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: join(require.resolve('@vue/devtools'), '..', 'icons/128.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  devWindow.setAlwaysOnTop(true)
  devWindow.setMenu(null)

  devWindow.loadFile(join(require.resolve('@vue/devtools'), '..', 'app.html'))

  mainWindow.webContents.on('dom-ready', () => {
    if (devWindow) mainWindow.webContents.send('show-vue-devtools')
  })

  devWindow.webContents.once('dom-ready', () => {
    if (devWindow) mainWindow.webContents.send('show-vue-devtools')
  })

  devWindow.on('close', (event) => {
    event.preventDefault()
    devWindow.hide()
  })
}
