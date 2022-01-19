/** 额外添加的RM方法 */
const Patch = class {
  static startWait() {
    Game_Interpreter.prototype._wait = true
  }
  static stopWait() {
    Game_Interpreter.prototype._wait = false
  }

  /** 打开URL */
  static openUrl(url) {
    electron.shell.openExternal(url)
  }

  /** 获取全局存档数据 */
  static getGlobalInfo() {
    return DataManager.loadGlobalInfo()[0]
  }

  /** 增加全局存档数据 */
  static addGlobalInfo(name, data) {
    const globalInfo = DataManager.loadGlobalInfo()
    if (!globalInfo[0]) globalInfo[0] = {}
    globalInfo[0][name] = { ...globalInfo[0][name], ...data }

    DataManager.saveGlobalInfo(globalInfo)
  }

  /** 修改全局存档数据属性 */
  static setGlobalInfo(name, key, data) {
    const globalInfo = DataManager.loadGlobalInfo()
    if (!globalInfo[0]) globalInfo[0] = {}
    if (!globalInfo[0][name]) globalInfo[0][name] = {}
    globalInfo[0][name][key] = data

    DataManager.saveGlobalInfo(globalInfo)
  }

  /** 清空周目数据 */
  static delLoop() {
    const globalInfo = DataManager.loadGlobalInfo()
    if (!globalInfo[0]) globalInfo[0] = {}
    globalInfo[0]['loop'] = {}

    DataManager.saveGlobalInfo(globalInfo)
  }

  static save() {
    $gameSystem.onBeforeSave()
    if (DataManager.saveGame(1)) {
      StorageManager.cleanBackup(1)
      Methods.showPopup('Save success', '保存成功', 1000)
    } else {
      Methods.showPopup('Save failed', '保存失败', 1000)
    }
  }

  static checkSave() {
    return fs.existsSync(StorageManager.localFilePath(1))
  }

  static showTip(time) {
    if ($gameSystem.tipData) {
      Methods.showTip($gameSystem.tipData.en, $gameSystem.tipData.cn, time ?? $gameSystem.tipData.time)
    }
  }

  static restart() {
    AudioManager.stopAll()
    DataManager.setupNewGame()
    SceneManager.goto(Scene_Map)
    this.startWait()
    this.delLoop()
    Components.Loading.loadingHide()
    this.stopWait()
  }
}

/** 插件方法 */
const Plugins = class {
  static focusToID(id, scale, time) {
    Galv.ZOOM.target(id, scale, time)
  }

  static blur(time) {
    Galv.ZOOM.restore(time)
  }
}
