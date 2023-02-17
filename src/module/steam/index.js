const greenworks = require('./greenworks')
const { app, ipcMain } = require('electron')

function activateAchievement(name) {
  greenworks.activateAchievement(name, () => {
    if (!app.isPackaged) {
      console.log('激活成就: ', name)
    }
  }, err => {
    if (!app.isPackaged) {
      console.log(name, '-', err)
    }
  })
}

function clearAchievement(name) {
  greenworks.clearAchievement(name, () => {
    if (!app.isPackaged) {
      console.warn('移除成就: ', name)
    }
  })
}

function init() {
  let ready = false
  try {
    ready = greenworks.init()
  } catch { }

  if (ready) {
    greenworks.setRichPresence('steam_display', '#Dreaming')

    activateAchievement('FIRST_START')

    ipcMain.on('steam:achievement', (_e, name) => {
      activateAchievement(name)
    })

    ipcMain.on('steam:clear-achievement', (_e, name) => {
      clearAchievement(name)
    })

    ipcMain.on('steam:get-username', (e) => {
      e.returnValue = greenworks.getSteamId()?.screenName
    })
  } else {
    ipcMain.on('steam:achievement', () => { })

    ipcMain.on('steam:clear-achievement', () => { })

    ipcMain.on('steam:get-username', (e) => {
      e.returnValue = undefined
    })
  }
}

init()
