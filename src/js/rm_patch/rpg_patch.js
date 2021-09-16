/** 额外添加的RM方法 */
const Patch = class {
  static startWait() {
    Game_Interpreter.prototype._wait = true
  }
  static stopWait() {
    Game_Interpreter.prototype._wait = false
  }

  /** 加载周目存档 */
  static loadLoop(saveId) {
    const map = $gameMap
    if (DataManager.loadGame(saveId)) {
      SoundManager.playLoad()
      $gameMap = map
    }
  }

  /** 打开URL */
  static openUrl(url) {
    electron.shell.openExternal(url)
  }

  /** 修改全局存档数据 */
  static addGlobalInfo(data) {
    const globalInfo = DataManager.loadGlobalInfo() || []
    globalInfo[0] = { ...globalInfo[0], ...data }
    DataManager.saveGlobalInfo(globalInfo)
  }
}

/** 插件方法 */
const Plugins = class {
  /**
   * 设置主界面背景和动画
   * @plugins title
   */
  static setTitle(bg, animation, frame) {
    const globalInfo = DataManager.loadGlobalInfo() || []
    globalInfo[0] = { ...globalInfo[0], ...{ title: { bg, animation, frame } } }
    DataManager.saveGlobalInfo(globalInfo)
    window.titleTemp = {}
  }

  /**
   * 是否显示标题A(false为显示B)
   * @plugins Credits
   * @param {boolean} flag 
   */
  static setCreditsButton(flag) {
    const globalInfo = DataManager.loadGlobalInfo() || []
    globalInfo[0] = { ...globalInfo[0], ...{ credits: flag } }
    DataManager.saveGlobalInfo(globalInfo)
  }

  /**
   * 是否显示正常的制作组
   * @plugins Credits
   * @param {boolean} flag 
   */
  static setCreditsNormal(flag) {
    const globalInfo = DataManager.loadGlobalInfo() || []
    globalInfo[0] = { ...globalInfo[0], ...{ normal: flag } }
    DataManager.saveGlobalInfo(globalInfo)
  }

  /**
   * 是否开启回忆之间按钮
   * @plugins Credits
   * @param {boolean} flag 
   */
  static setMemoryButton(flag) {
    const globalInfo = DataManager.loadGlobalInfo() || []
    globalInfo[0] = { ...globalInfo[0], ...{ memory: flag } }
    DataManager.saveGlobalInfo(globalInfo)
  }
}