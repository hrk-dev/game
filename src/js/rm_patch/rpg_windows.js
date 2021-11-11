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

Window_Message.prototype.windowWidth = function () {
  return 0
}

Window_Message.prototype.updateShowFast = function () {
  if (this._showFast) return
  this._showFast = true
}

Window_ChoiceList.prototype.start = function () {
  this.x = -10
  this.open()
  this.activate()
}
