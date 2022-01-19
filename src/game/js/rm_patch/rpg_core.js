/** 默认返回非nwjs以禁用nwjs相关代码 */
Utils.isNwjs = function () {
  return false
}

/**
 * VUE层视频播放进度
 * 待修改
 */
Graphics._playVideo = function (src) {
  this._video.src = src
  this._video.onloadeddata = this._onVideoLoad.bind(this)
  this._video.onerror = this._videoLoader
  this._video.onended = this._onVideoEnd.bind(this)
  this._video.load()
  this._videoLoading = true
  if (VueMain.app) {
    Components.video.show = true
    this._video.oncanplay = () => {
      Components.video.duration = this._video.duration | 0
    }
    this._video.ontimeupdate = () => {
      Components.video.current = this._video.currentTime | 0
    }
  }
}

/**
 * VUE适配
 * 待修改
 */
Graphics._updateRealScale = function () {
  if (this._stretchEnabled) {
    var h = window.innerWidth / this._width
    var v = (window.innerHeight - 30) / this._height
    if (h >= 1 && h - 0.01 <= 1) h = 1
    if (v >= 1 && v - 0.01 <= 1) v = 1
    this._realScale = Math.min(h, v)

    if (VueMain.app) {
      VueMain.app.main.width = this._width * this._realScale
      VueMain.app.main.height = this._height * this._realScale
      VueMain.app.main.scale = this._realScale
      const margin = (window.innerHeight - 30 - VueMain.app.main.height) / 2
      VueMain.app.main.margin = `${margin + 30}px auto ${margin}px auto`
    }
  } else {
    this._realScale = this._scale
  }
}

/** 默认开启自适应 */
Graphics._defaultStretchMode = function () {
  return true
}

/** 标题栏适配 */
Graphics._createModeBox = function () {
  var box = document.createElement('div')
  box.id = 'modeTextBack'
  box.style.position = 'absolute'
  box.style.left = '5px'
  box.style.top = '35px'
  box.style.width = '119px'
  box.style.height = '58px'
  box.style.background = 'rgba(0,0,0,0.2)'
  box.style.zIndex = 999
  box.style.opacity = 0

  var text = document.createElement('div')
  text.id = 'modeText'
  text.style.position = 'absolute'
  text.style.left = '0px'
  text.style.top = '41px'
  text.style.width = '119px'
  text.style.fontSize = '12px'
  text.style.fontFamily = 'monospace'
  text.style.color = 'white'
  text.style.textAlign = 'center'
  text.style.textShadow = '1px 1px 0 rgba(0,0,0,0.5)'
  text.innerHTML = this.isWebGL() ? 'WebGL mode' : 'Canvas mode'

  document.body.appendChild(box)
  box.appendChild(text)

  this._modeBox = box
}

/** 标题栏适配 */
Graphics._centerElement = function (element) {
  var width = element.width * this._realScale
  var height = element.height * this._realScale
  element.style.position = 'absolute'
  const margin = (window.innerHeight - 30 - height) / 2
  element.style.margin = `${margin + 30}px auto ${margin}px auto`
  element.style.top = 0
  element.style.left = 0
  element.style.right = 0
  element.style.bottom = 0
  element.style.width = width + 'px'
  element.style.height = height + 'px'
}

/** 视频播放结束隐藏VUE层 */
Graphics._onVideoEnd = function () {
  if (VueMain.app) {
    Components.video.show = false
  }
  this._updateVisibility(false)
}

/** 禁用F3 F4 */
Graphics._onKeyDown = function (event) {
  if (!event.ctrlKey && !event.altKey) {
    if (event.keyCode === 112) {
      event.preventDefault()
      this._switchFPSMeter()
    }
  }
}

/**
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @static
 * @property keyMapper
 * @type Object
 */
 Input.keyMapper = {
  9: 'tab',       // tab
  13: 'ok',       // enter
  16: 'shift',    // shift
  17: 'control',  // control
  27: 'escape',   // escape
  32: 'ok',       // space
  33: 'pageup',   // pageup
  34: 'pagedown', // pagedown
  37: 'left',     // left arrow
  38: 'up',       // up arrow
  39: 'right',    // right arrow
  40: 'down',     // down arrow
  45: 'escape',   // insert
  81: 'pageup',   // Q
  87: 'pagedown', // W
  88: 'escape',   // X
  90: 'ok',       // Z
  96: 'escape',   // numpad 0
  98: 'down',     // numpad 2
  100: 'left',    // numpad 4
  102: 'right',   // numpad 6
  104: 'up',      // numpad 8
  120: 'debug'    // F9
};

Input._onKeyDown = function (event) {
  if (this._shouldPreventDefault(event.keyCode)) {
    event.preventDefault()
  }
  if (event.keyCode === 144) {    // Numlock
    this.clear()
  }
  var buttonName = this.keyMapper[event.keyCode]
  if (ResourceHandler.exists() && buttonName === 'ok') {
    ResourceHandler.retry()
  } else if (buttonName) {
    this._currentState[buttonName] = true
  }
  Components.Logo.checkInput()
  Components.MainMenu.checkInput(buttonName)
  Components.GameMenu.checkInput(buttonName)
  Components.Message.checkInput(buttonName)
}

/**
 * @static
 * @method _setupEventHandlers
 * @private
 */
TouchInput._setupEventHandlers = function () { }

Decrypter._ignoreList = [
  dev ? 'img/system/Window.png' : `${md5('img')}/${md5('system')}/${md5('Window.png')}`
]

/**
 * Sets the source of the "Now Loading" image.
 *
 * @static
 * @method setLoadingImage
 */
Graphics.setLoadingImage = function (src) {
  this._loadingImage = new Image()
  this._loadingImage.src = md5Url(src)
}

/**
 * @method _createAllParts
 * @private
 */
Window.prototype._createAllParts = function () {
  this._windowSpriteContainer = new PIXI.Container()
  this._windowBackSprite = new Sprite()
  this._windowCursorSprite = new Sprite()
  this._windowFrameSprite = new Sprite()
  this._windowContentsSprite = new Sprite()
  this._downArrowSprite = new Sprite()
  this._upArrowSprite = new Sprite()
  this._windowBackSprite.bitmap = new Bitmap(1, 1)
  this._windowBackSprite.alpha = 192 / 255
  this.addChild(this._windowSpriteContainer)
  this._windowSpriteContainer.addChild(this._windowBackSprite)
  this._windowSpriteContainer.addChild(this._windowFrameSprite)
  this.addChild(this._windowCursorSprite)
  this.addChild(this._windowContentsSprite)
  this.addChild(this._downArrowSprite)
  this.addChild(this._upArrowSprite)
}

/**
 * @method _refreshAllParts
 * @private
 */
 Window.prototype._refreshAllParts = function () {
  this._refreshBack()
  this._refreshFrame()
  this._refreshCursor()
  this._refreshContents()
  this._refreshArrows()
}

/**
 * @method updateTransform
 * @private
 */
 Window.prototype.updateTransform = function () {
  this._updateCursor()
  this._updateArrows()
  this._updateContents()
  PIXI.Container.prototype.updateTransform.call(this)
}
