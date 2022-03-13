/** 默认返回非nwjs以禁用nwjs相关代码 */
Utils.isNwjs = function () {
  return false
}

Bitmap.prototype._makeFontNameText = function () {
  const italic = this.fontItalic ? 'Italic ' : ''
  const bold = this.fontBold ? 'Bold ' : ''
  return italic + bold + this.fontSize + 'px ' + 'GameFont'
}

Graphics._updateRealScale = function () {
  if (this._stretchEnabled && this._width > 0 && this._height > 0) {
    const h = this._stretchWidth() / this._width
    const v = this._stretchHeight() / (this._height + (ConfigManager.fullscreen ? 0 : 30))
    this._realScale = Math.min(h, v)
    window.scrollTo(0, 0)

    if (VueMain.app) {
      VueMain.app.main.width = this._width * this._realScale
      VueMain.app.main.height = this._height * this._realScale
      VueMain.app.main.scale = this._realScale
    }
  } else {
    this._realScale = this._defaultScale
  }
}

Graphics._centerElement = function (element) {
  const width = element.width * this._realScale
  const height = element.height * this._realScale
  element.style.position = 'absolute'
  element.style.margin = 'auto'
  element.style.top = ConfigManager.fullscreen ? 0 : 30
  element.style.left = 0
  element.style.right = 0
  element.style.bottom = 0
  element.style.width = width + 'px'
  element.style.height = height + 'px'
}

/** 默认开启自适应 */
Graphics._defaultStretchMode = function () {
  return true
}

/** 禁用F3 F4 */
Graphics._onKeyDown = function (event) {
  if (!event.ctrlKey && !event.altKey) {
    if (event.keyCode === 113) {
      event.preventDefault()
      this._switchFPSCounter()
    }
  }
}

Input.keyMapper = {
  9: 'tab',       // tab
  13: 'ok',       // enter
  16: 'shift',    // shift
  17: 'control',  // control
  27: 'escape',   // escape
  32: 'ok',       // space
  37: 'left',     // left arrow
  38: 'up',       // up arrow
  39: 'right',    // right arrow
  40: 'down',     // down arrow
  65: 'left',     // A
  68: 'right',    // D
  74: 'ok',       // J
  75: 'escape',   // K
  83: 'down',     // S
  87: 'up',       // W
  88: 'escape',   // X
  90: 'ok',       // Z
}

Input._onKeyDown = function (event) {
  if (this._shouldPreventDefault(event.keyCode)) {
    event.preventDefault()
  }
  if (event.keyCode === 144) {
    // Numlock
    this.clear()
  }
  const buttonName = this.keyMapper[event.keyCode]
  if (buttonName) {
    this._currentState[buttonName] = true
  }
  (Components[VueMain._current[VueMain._current.length - 1]])?.checkInput(buttonName)
  Components?.Message.checkInput(buttonName)
}

/** 禁用触摸操作 */
TouchInput._setupEventHandlers = function () { }
