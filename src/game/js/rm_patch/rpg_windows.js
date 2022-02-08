/** 修改默认字体 */
Window_Base.prototype.standardFontFace = function () {
  if ($gameSystem.isChinese()) {
    return 'GameFont, SimHei, Heiti TC, sans-serif'
  } else if ($gameSystem.isKorean()) {
    return 'GameFont, Dotum, AppleGothic, sans-serif'
  } else {
    return 'GameFont'
  }
}

Window_Message.prototype.startMessage = function () {
  this._textState = {}
  this._textState.index = 0
  this._textState.text = this.convertEscapeCharacters($gameMessage.allText())
  this.newPage()
  this.open()
}

Window_Message.prototype.newPage = function () {
  this.contents.clear()
}

Window_Message.prototype.windowWidth = function () {
  return 0
}

Window_Message.prototype.updateShowFast = function () {
  if (this._showFast) return
  this._showFast = true
}

Window_Message.prototype.updateWait = function () {
  if (this._waitCount > 0) {
    this._waitCount--
    if (!Components.Message.message.wait) Components.Message.message.wait = true
    return true
  } else {
    if (Components.Message.message.wait) Components.Message.message.wait = false
    return false
  }
}

Window_Message.prototype.isTriggered = function () {
  return ((!Components?.Log?.isShow && (Components?.Log && Components.Log.isHide)) && (Input.isRepeated('ok') || Input.isRepeated('cancel') ||
    TouchInput.isRepeated()))
}

Window_ChoiceList.prototype.start = function () {
  this.x = -10
  this.open()
  this.activate()
}

Window_ChoiceList.prototype.processOk = function () { }

Window_ChoiceList.prototype.processCancel = function () {
  SoundManager.playCancel()
  this.updateInputData()
  this.deactivate()
  this.callCancelHandler()
}
