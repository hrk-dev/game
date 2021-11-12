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
  VueMain.app.$refs.MainMenu.show = true
  return
}
Scene_Title.prototype.update = function () {
  return
}
Scene_Title.prototype.isBusy = function () {
  return false
}

/** VUE游戏菜单适配 */
Scene_Menu.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this)
  VueMain.hideTip()
  VueMain.app.$refs.Movetip.hide()
  VueMain.app.$refs.GameMenu.show = true
}
Scene_Menu.prototype.terminate = function () {
  VueMain.app.$refs.GameMenu.show = false
}
Scene_Menu.prototype.start = function () {
}
