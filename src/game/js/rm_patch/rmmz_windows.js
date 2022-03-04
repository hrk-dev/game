Window_Message.prototype.startMessage = function () {
  const text = $gameMessage.allText()
  const textState = this.createTextState(text, 0, 0, 0)
  textState.x = this.newLineX(textState)
  textState.startX = textState.x
  this._textState = textState
  this.newPage(this._textState)
  this.open()
  this._nameBoxWindow.start()
}

Window_Message.prototype.newPage = function () {
  this.contents.clear()
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
  return ((!Components?.Message?.hide?.flag && Components?.Message?.hide?.end) && (!Components?.Log?.isShow && (Components?.Log && Components.Log.isHide)) && (Input.isRepeated('ok') || Input.isRepeated('cancel') ||
    TouchInput.isRepeated()))
}

Window_ChoiceList.prototype.start = function () {
  this.x = -10
  this.open()
  this.activate()
}

Window_ChoiceList.prototype.processOk = function () { }

Window_ChoiceList.prototype.processCancel = function () {
  // SoundManager.playCancel()
  this.updateInputData()
  this.deactivate()
  this.callCancelHandler()
}
