/** 默认返回非nwjs以禁用nwjs相关代码 */
Utils.isNwjs = function () {
  return false
}

Graphics._updateRealScale = function () {
  if (this._stretchEnabled && this._width > 0 && this._height > 0) {
    const h = this._stretchWidth() / this._width
    const v = this._stretchHeight() / this._height
    this._realScale = Math.min(h, v)
    window.scrollTo(0, 0)

    if (VueMain.app) {
      let _margin = ConfigManager.fullscreen ? 0 : 30
      VueMain.app.main.width = this._width * this._realScale
      VueMain.app.main.height = this._height * this._realScale
      VueMain.app.main.scale = this._realScale
      const margin = (window.innerHeight - _margin - VueMain.app.main.height) / 2
      VueMain.app.main.margin = `${margin + _margin}px auto ${margin}px auto`

      Components.Main.save.top = 10 + _margin
    }
  } else {
    this._realScale = this._defaultScale
  }
}

/** 默认开启自适应 */
Graphics._defaultStretchMode = function () {
  return true
}

Graphics._createCanvas = function () {
  this._canvas = document.createElement("canvas")
  this._canvas.id = "gameCanvas"
  this._updateCanvas()
  document.getElementById('game').appendChild(this._canvas)
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

Video._createElement = function () {
  this._element = document.createElement("video")
  this._element.id = "gameVideo"
  this._element.style.position = "absolute"
  this._element.style.margin = "auto"
  this._element.style.top = 0
  this._element.style.left = 0
  this._element.style.right = 0
  this._element.style.bottom = 0
  this._element.style.opacity = 0
  this._element.style.zIndex = 2
  this._element.setAttribute("playsinline", "")
  this._element.oncontextmenu = () => false
  document.getElementById('game').appendChild(this._element)
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
  81: 'pageup',   // Q
  87: 'pagedown', // W
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
