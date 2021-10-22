StorageManager.isLocalMode = function () {
  return true
}

StorageManager.localFileDirectoryPath = function () {
  var path = require('path')

  const base = __dirname.replace(path.sep + 'app.asar', '')
  return path.join(base, 'icu/')
}

StorageManager.localFilePath = function (savefileId) {
  let name
  if (savefileId < 0) {
    name = 'niiro'
  } else if (savefileId === 0) {
    name = 'hirro'
  } else if (savefileId === 1) {
    name = 'hiiro'
  } else if (savefileId > 0 && savefileId < 100) {
    name = 'file%1.rpgsave'.format(savefileId)
  } else {
    name = 'loop%1.rpgsave'.format(savefileId)
  }
  return this.localFileDirectoryPath() + name
}

DataManager.makeSavefileInfo = function () {
  const info = {}
  info.globalId = this._globalId
  info.title = $dataSystem.gameTitle
  info.characters = $gameParty.charactersForSavefile()
  info.faces = $gameParty.facesForSavefile()
  info.playtime = $gameSystem.playtimeText()
  info.timestamp = Date.now()
  // 周目信息
  info.loop = $gameSystem.loop
  return info
}

SceneManager.onKeyDown = function (event) {
  if (!event.ctrlKey && !event.altKey) {
    switch (event.keyCode) {
      case 116:   // F5
        if (electron) {
          electron.ipcRenderer.send('app:reload')
        }
        break
      case 123:   // F12
        if (electron && process.env.NODE_ENV !== 'development') {
          electron.ipcRenderer.send('app:dev')
        }
        break
    }
  }
}
