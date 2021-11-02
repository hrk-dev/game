Game_Interpreter.prototype.isRunning = function () {
  return this._wait || !!this._list
}

Game_Interpreter.prototype.update = function () {
  while (this.isRunning()) {
    if (this._wait) {
      break
    }
    if (this.updateChild() || this.updateWait()) {
      break
    }
    if (SceneManager.isSceneChanging()) {
      break
    }
    if (!this.executeCommand()) {
      break
    }
    if (this.checkFreeze()) {
      break
    }
  }
}

Game_Interpreter.prototype.command201 = function () {
  if (!$gameParty.inBattle() && !$gameMessage.isBusy()) {
    var mapId, x, y
    if (this._params[0] === 0) {  // Direct designation
      mapId = this._params[1]
      x = this._params[2]
      y = this._params[3]
    } else {  // Designation with variables
      mapId = $gameVariables.value(this._params[1])
      x = $gameVariables.value(this._params[2])
      y = $gameVariables.value(this._params[3])
    }
    $gamePlayer.reserveTransfer(mapId, x, y, this._params[4], this._params[5])
    this.setWaitMode('transfer')
    this._index++
    VueMain.app.$refs.Movetip.hide()
  }
  return false
}
