Scene_Boot.prototype.start = function () {
  Scene_Base.prototype.start.call(this)
  SoundManager.preloadImportantSounds()
  this.checkPlayerLocation()
  DataManager.setupNewGame()
}

/** VUE主菜单适配 */
Scene_Title.prototype.create = function () {
  VueMain._current.push('MainMenu')
}

Scene_Title.prototype.start = function () {
  SceneManager.clearStack()
  AudioManager.stopAll()
  this.playTitleMusic()
  Components.MainMenu.show = true
}
Scene_Title.prototype.update = function () { }

Scene_Title.prototype.isBusy = function () {
  return false
}

Scene_Title.prototype.terminate = function () {
  AudioManager.stopAll()
  SceneManager.snapForBackground()
  VueMain._current.pop()
}

/** VUE游戏菜单适配 */
Scene_Menu.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this)
  Methods.hideTip()
  Components.Movetip.hide()
  Components.GameMenu.show = true
  VueMain._current.push('GameMenu')
}

Scene_Menu.prototype.start = function () { }

Scene_Menu.prototype.terminate = function () {
  Components.GameMenu.show = false
  VueMain._current.pop()
}

Scene_Map.prototype.create = function () {
  Scene_Base.prototype.create.call(this)
  this._transfer = $gamePlayer.isTransferring()
  var mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId()
  DataManager.loadMapData(mapId)
  VueMain._current.push('Log')
}

Scene_Map.prototype.updateCallMenu = function () {
  if (this.isMenuEnabled()) {
    if (Components.Log.isHide && this.isMenuCalled()) {
      this.menuCalling = true
    }
    if (this.menuCalling && !$gamePlayer.isMoving()) {
      this.callMenu()
    }
  } else {
    this.menuCalling = false
  }
}

Scene_Map.prototype.callMenu = function () {
  // AudioManager.playSe({
  //   name: 'menu',
  //   pan: 0,
  //   pitch: 100,
  //   volume: 90
  // })
  SceneManager.push(Scene_Menu)
  Window_MenuCommand.initCommandPosition()
  $gameTemp.clearDestination()
  this._mapNameWindow.hide()
  this._waitCount = 2
}

Scene_Map.prototype.terminate = function () {
  Scene_Base.prototype.terminate.call(this)
  if (!SceneManager.isNextScene(Scene_Battle)) {
    this._spriteset.update()
    this._mapNameWindow.hide()
    SceneManager.snapForBackground()
  } else {
    ImageManager.clearRequest()
  }

  if (SceneManager.isNextScene(Scene_Map)) {
    ImageManager.clearRequest()
  }

  $gameScreen.clearZoom()

  this.removeChild(this._fadeSprite)
  this.removeChild(this._mapNameWindow)
  this.removeChild(this._windowLayer)
  this.removeChild(this._spriteset)
  VueMain._current.pop()
}
