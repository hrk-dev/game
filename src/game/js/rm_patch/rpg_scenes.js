Scene_Boot.prototype.start = function () {
  Scene_Base.prototype.start.call(this)
  SoundManager.preloadImportantSounds()
  this.checkPlayerLocation()
  DataManager.setupNewGame()
}

/** VUE主菜单适配 */
Scene_Title.prototype.create = function () {
  return
}
Scene_Title.prototype.start = function () {
  Components.MainMenu.show = true
  return
}
Scene_Title.prototype.update = function () {
  return
}
Scene_Title.prototype.isBusy = function () {
  return false
}

Scene_Map.prototype.callMenu = function () {
  SceneManager.push(Scene_Menu)
  Window_MenuCommand.initCommandPosition()
  $gameTemp.clearDestination()
  this._mapNameWindow.hide()
  this._waitCount = 2
}

/** VUE游戏菜单适配 */
Scene_Menu.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this)
  Methods.hideTip()
  Components.Movetip.hide()
  Components.GameMenu.show = true
}
Scene_Menu.prototype.terminate = function () {
  Components.GameMenu.show = false
}
Scene_Menu.prototype.start = function () {
}
