SceneManager.updateFrameCount = function () {
  Graphics.frameCount++
  Components.GameMenu.setTime()
}

StorageManager.isLocalMode = function () {
  return true
}

StorageManager.fileDirectoryPath = function () {
  let base = __dirname
  if (base.includes('app.asar')) {
    base = __dirname.replace('app.asar', 'app.asar.unpacked')
  }
  return path.join(base, '../icu/')
}

StorageManager.filePath = function (saveName) {
  const dir = this.fileDirectoryPath()
  return dir + saveName
}

ConfigManager.save = function () {
  StorageManager.saveObject('niiro', this.makeData())
}

ConfigManager.makeData = function () {
  const config = {}
  config.alwaysDash = this.alwaysDash
  config.commandRemember = this.commandRemember
  config.touchUI = this.touchUI
  config.bgmVolume = this.bgmVolume
  config.bgsVolume = this.bgsVolume
  config.meVolume = this.meVolume
  config.seVolume = this.seVolume
  config.fullscreen = this.fullscreen
  return config
}

ConfigManager.load = function () {
  StorageManager.loadObject('niiro')
    .then(config => this.applyData(config || {}))
    .catch(() => 0)
    .then(() => {
      if (electron.ipcRenderer.sendSync('app:fullscreen', ConfigManager.fullscreen ?? false)) {
        Components.TitleBar.show = false
        document.getElementById('game').style.top = 0
        document.getElementById('fpsCounterBox').style.top = 0
      } else {
        Components.TitleBar.show = true
        document.getElementById('game').style.top = '30px'
        document.getElementById('fpsCounterBox').style.top = '30px'
      }
      Graphics._updateRealScale()

      this._isLoaded = true
      return 0
    })
    .catch(() => 0)
}

ConfigManager.applyData = function (config) {
  this.alwaysDash = this.readFlag(config, 'alwaysDash', false)
  this.commandRemember = this.readFlag(config, 'commandRemember', false)
  this.touchUI = this.readFlag(config, 'touchUI', true)
  this.bgmVolume = this.readVolume(config, 'bgmVolume')
  this.bgsVolume = this.readVolume(config, 'bgsVolume')
  this.meVolume = this.readVolume(config, 'meVolume')
  this.seVolume = this.readVolume(config, 'seVolume')
  this.fullscreen = this.readFlag(config, 'fullscreen', false)
}

DataManager.saveGlobalInfo = function () {
  StorageManager.saveObject('nirro', this._globalInfo)
}

DataManager.loadGlobalInfo = function () {
  StorageManager.loadObject('nirro')
    .then(globalInfo => {
      this._globalInfo = globalInfo
      this.removeInvalidGlobalInfo()
      return 0
    })
    .catch(() => {
      this._globalInfo = []
    })
}

DataManager.makeSavename = function (savefileId) {
  let name
  if (savefileId === 1) {
    name = 'hiiro'
  } else {
    name = 'file%1'.format(savefileId)
  }
  return name
}

SceneManager.onKeyDown = function (event) {
  if (!event.ctrlKey && !event.altKey) {
    switch (event.keyCode) {
      case 116: // F5
        electron.ipcRenderer.send('app:reload')
        break
      case 123: // F12
        electron.ipcRenderer.send('dev:tool')
        break
    }
  }
}

ImageManager.loadBitmap = function (folder, filename) {
  if (filename) {
    const _filename = dev ? (Utils.encodeURI(filename) + '.png') : md5(filename + '.png').substr(8, 16)
    const url = md5Url(folder) + _filename
    return this.loadBitmapFromUrl(url)
  } else {
    return this._emptyBitmap
  }
}

ImageManager.loadBitmapFromUrl = function (url) {
  const cache = url.includes(dev ? '/system/' : `/${md5('system').substr(8, 16)}/`) ? this._system : this._cache
  if (!cache[url]) {
    cache[url] = Bitmap.load(url)
  }
  return cache[url]
}

AudioManager._path = dev ? 'audio/' : `${md5('audio').substr(8, 16)}/`

AudioManager.createBuffer = function (folder, name) {
  const ext = this.audioFileExt()
  const filename = dev ? (Utils.encodeURI(name) + ext) : md5(name + ext).substr(8, 16)

  const url = this._path + (dev ? folder : md5Url(folder)) + filename
  const buffer = new WebAudio(url)
  buffer.name = name
  buffer.frameCount = Graphics.frameCount
  return buffer
}
