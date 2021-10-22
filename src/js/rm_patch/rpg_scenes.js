(function () {
  const Tip = Scene_Map.prototype.start
  Scene_Map.prototype.start = function () {
    if (!$gameSystem.tipData) {
      $gameSystem.tipData = {
        show: false,
        en: '',
        cn: '',
        time: 2000
      }
    }
    Tip.call(this)
  }
})()

/** 禁用鼠标移动 */
Scene_Map.prototype.isMapTouchOk = function () {
  return (this.isActive() && $gamePlayer.canMove()) && !($gameSystem._savedZoom && $gameSystem._savedZoom.follow)
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
