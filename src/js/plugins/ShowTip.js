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

  SceneManager.goto = function (sceneClass) {
    if (sceneClass) {
      this._nextScene = new sceneClass();
      if (sceneClass.name === 'Scene_Menu') {
        VueMain.showTip($gameSystem.tipData.en, $gameSystem.tipData.cn, 0, true)
      } else if (sceneClass.name === 'Scene_Map' && !VueMain.getTipState() && $gameSystem && $gameSystem.tipData && $gameSystem.tipData.show) {
        const _Tip = Scene_Map.prototype.onMapLoaded
        Scene_Map.prototype.onMapLoaded = function () {
          _Tip.call(this)
          VueMain.showTip($gameSystem.tipData.en, $gameSystem.tipData.cn, $gameSystem.tipData.time)
          Scene_Map.prototype.onMapLoaded = function () {
            _Tip.call(this)
          }
        }
      } else {
        VueMain.hideTip()
      }
    }
    if (this._scene) {
      this._scene.stop();
    }
  }
})()
