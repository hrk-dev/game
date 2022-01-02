SceneManager.run = function (sceneClass) {
  try {
    this.initialize()
    this.goto(sceneClass)
    this.requestUpdate()
    Components.Main.setup(Graphics.width, Graphics.height)
  } catch (e) {
    this.catchException(e)
  }
}

StorageManager.isLocalMode = function () {
  return true
}

StorageManager.localFileDirectoryPath = function () {
  let base = __dirname
  if (base.includes('app.asar')) {
    base = __dirname.replace('app.asar', 'app.asar.unpacked')
  }
  return path.join(base, '../icu/')
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

DataManager.loadGlobalInfo = function () {
  var json
  try {
    json = StorageManager.load(0)
  } catch (e) {
    console.error(e)
    return [{}]
  }
  if (json) {
    var globalInfo = JSON.parse(json)
    for (var i = 0; i <= this.maxSavefiles(); i++) {
      if (i === 0) {
        if (!globalInfo[i]) globalInfo[i] = {}
      } else if (!StorageManager.exists(i)) {
        delete globalInfo[i]
      }
    }
    return globalInfo
  } else {
    return [{}]
  }
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
        if (dev) {
          electron.ipcRenderer.send('dev:tool')
        }
        break
    }
  }
}

ImageManager.loadBitmap = function (folder, filename, hue, smooth) {
  if (filename) {
    const _filename = dev ? (encodeURIComponent(filename) + '.png') : md5(filename + '.png')
    var path = md5Url(folder) + _filename
    var bitmap = this.loadNormalBitmap(path, hue || 0)
    bitmap.smooth = smooth
    return bitmap
  } else {
    return this.loadEmptyBitmap()
  }
}

ImageManager.reserveBitmap = function (folder, filename, hue, smooth, reservationId) {
  if (filename) {
    const _filename = dev ? (encodeURIComponent(filename) + '.png') : md5(filename + '.png')
    var path = md5Url(folder) + _filename
    var bitmap = this.reserveNormalBitmap(path, hue || 0, reservationId || this._defaultReservationId)
    bitmap.smooth = smooth
    return bitmap
  } else {
    return this.loadEmptyBitmap()
  }
}

ImageManager.requestBitmap = function (folder, filename, hue, smooth) {
  if (filename) {
    const _filename = dev ? (encodeURIComponent(filename) + '.png') : md5(filename + '.png')
    var path = md5Url(folder) + _filename
    var bitmap = this.requestNormalBitmap(path, hue || 0)
    bitmap.smooth = smooth
    return bitmap
  } else {
    return this.loadEmptyBitmap()
  }
}

AudioManager._path = dev ? 'audio/' : `${md5('audio')}/`
AudioManager.playEncryptedBgm = function (bgm, pos) {
  var ext = this.audioFileExt()
  const filename = dev ? (encodeURIComponent(bgm.name) + ext) : md5(bgm.name + ext)
  var url = this._path + (dev ? 'bgm/' : `${md5('bgm')}/`) + (dev ? filename : md5(filename))
  url = Decrypter.extToEncryptExt(url)
  Decrypter.decryptHTML5Audio(url, bgm, pos)
}

AudioManager.createBuffer = function (folder, name) {
  var ext = this.audioFileExt()
  const filename = dev ? (encodeURIComponent(name) + ext) : md5(name + ext)
  var url = this._path + (dev ? folder : md5(folder)) + '/' + filename
  const key = dev ? 'bgm' : md5('bgm')
  if (this.shouldUseHtml5Audio() && folder === key) {
    if (this._blobUrl) Html5Audio.setup(this._blobUrl)
    else Html5Audio.setup(url)
    return Html5Audio
  } else {
    return new WebAudio(url)
  }
}
