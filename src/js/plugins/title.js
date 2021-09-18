/*:
 * @plugindesc 主界面效果修改
 * @author Blacktunes
 *
 * @param 默认图片
 * @require 1
 * @dir img/pictures/
 * @type file
 * 
 * @param 动画文件夹
 * 
 * @param 帧数
 * @type number
 * @default 30
 */

(function () {
  window.titleTemp = window.titleTemp || {}

  const pic = PluginManager.parameters('title')['默认图片'] || ''
  const imgDir = PluginManager.parameters('title')['动画文件夹'] || ''
  let frame = Number(PluginManager.parameters('title')['帧数']) || 30
  if (frame > 60) frame = 60

  Scene_Title.prototype.create = function () {
    return
    Scene_Base.prototype.create.call(this)
    this._bg = pic
    this._time = window.titleTemp._time || 0
    this._imgIndex = window.titleTemp._imgIndex || 0
    this._imgList = []
    this._dir = imgDir
    this._frame = frame
    this.loadData()
    this.loadImg()
    this.createBackground()
    this.createForeground()
    this.createWindowLayer()
    this.createCommandWindow()
    this._command_x = this._commandWindow.x
    this._commandWindow.x -= this._commandWindow.windowWidth()
  }

  Scene_Title.prototype.start = function () {
    VueMain.app.$refs.MainMenu.show = true
    return
    Scene_Base.prototype.start.call(this)
    SceneManager.clearStack()
    this.centerSprite(this._backSprite1)
    this.centerSprite(this._backSprite2)
    this.playTitleMusic()
    if (!window._skipFade) {
      this.startFadeIn(this.fadeSpeed(), false)
    } else {
      this.startFadeIn(1, false)
    }
    window._skipFade = false
  }

  SceneManager.pop = function () {
    if (this._stack.length > 0) {
      window._skipFade = true
      this.goto(this._stack.pop())
    } else {
      this.exit()
    }
  }

  Scene_Title.prototype.loadData = function () {
    const globalInfo = DataManager.loadGlobalInfo() || []
    if (globalInfo[0] && globalInfo[0].title) {
      this._bg = globalInfo[0].title.bg
      this._dir = globalInfo[0].title.animation
      this._frame = globalInfo[0].title.frame || 30
      Plugins.setTitle(this._bg, this._dir, this._frame)
    }
  }

  Scene_Title.prototype.loadImg = function () {
    if (this._dir) {
      const list = fs.readdirSync(path.join(__dirname, `img/pictures/${this._dir}`))
      list.forEach(name => {
        this._imgList.push(ImageManager.loadPicture(`${this._dir}/${path.basename(name, '.png')}`))
      })
    }
  }

  Scene_Title.prototype.update = function () {
    return
    if (!this.isBusy()) {
      this._commandWindow.open()
    }
    if (this._commandWindow.x < this._command_x) {
      this._commandWindow.x += 3
    }
    if (this._imgList.length > 0) {
      if (this._time < 60 / this._frame) {
        ++this._time
      } else {
        this._time = 0
        this._backSprite1.bitmap = this._imgList[this._imgIndex]
        ++this._imgIndex
        if (this._imgIndex > this._imgList.length - 1) {
          this._imgIndex = 0
        }
        window.titleTemp._time = this._time
        window.titleTemp._imgIndex = this._imgIndex
      }
    }
    Scene_Base.prototype.update.call(this)
  }

  Scene_Title.prototype.createBackground = function () {
    this._backSprite1 = new Sprite(ImageManager.loadPicture())
    this._backSprite2 = new Sprite(ImageManager.loadPicture(this._bg))
    this.addChild(this._backSprite1)
    this.addChild(this._backSprite2)
  }

  Scene_Title.prototype.isBusy = function () {
    return false
  };

  Window_TitleCommand.prototype.drawText = function (text, x, y, maxWidth) {
    this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), 'left')
  }
})()