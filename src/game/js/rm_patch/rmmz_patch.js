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

  static loopData = {}

  static saveLoopData = async function () {
    await StorageManager.saveObject("hirro", this.loopData)
  }

  static loadLoopData = async function () {
    try {
      this.loopData = await StorageManager.loadObject("hirro")
    } catch (_e) {
      this.loopData = {}
    }
  }

  /** 增加全局存档数据 */
  static addLoopData(obj) {
    this.loopData = { ...this.loopData, ...obj }
    this.saveLoopData()
  }

  /** 清空周目数据 */
  static delLoop() {
    this.loopData = {}
    this.saveLoopData()
  }

  static async save() {
    $gameSystem.onBeforeSave()
    try {
      await DataManager.saveGame(1)
      Methods.showPopup('Save success', '保存成功', 1000)
    } catch (e) {
      Methods.showPopup('Save failed', '保存失败', 1000)
    }
  }

  static checkSave() {
    return fs.existsSync(StorageManager.filePath('hiiro'))
  }

  static showTip(time) {
    if ($gameSystem.tipData) {
      Methods.showTip($gameSystem.tipData.en, $gameSystem.tipData.cn, time ?? $gameSystem.tipData.time)
    }
  }

  static restart() {
    document.getElementById('gameCanvas').style.opacity = 0
    AudioManager.stopAll()
    setTimeout(() => {
      DataManager.setupNewGame()
      SceneManager.goto(Scene_Map)
      $gameTemp.reserveCommonEvent(99)
    }, 400)
  }
}

Patch.loadLoopData()

/** 插件方法 */
const Plugins = class {
  static focusToID(id, scale, time) {
    Galv.ZOOM.target(id, scale, time)
  }

  static blur(time) {
    Galv.ZOOM.restore(time)
  }
}

const Steam = class {
  static activateAchievement(name) {
    electron.ipcRenderer.send('steam:achievement', name)
  }
}