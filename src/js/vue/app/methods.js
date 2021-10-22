VueMain.setTitleColor = (color) => {
  VueMain.app.$refs.TitleBar.color = color
}

VueMain.setTitle = (title) => {
  VueMain.app.$refs.TitleBar.title = title
}

/** test */
VueMain.titleTest = () => {
  VueMain.app.$refs.TitleBar.titleTest()
}

VueMain.startEnding = () => {
  VueMain.app.$refs.ending.startEnding()
}

/** test */
VueMain.showDanmu = () => {
  VueMain.app.$refs.danmu.showDanmu()
}

/** test */
VueMain.stopDanmu = () => {
  VueMain.app.$refs.danmu.stopDanmu()
}

VueMain.showTip = (en, cn, time, menu) => {
  VueMain.app.$refs.tip.showTip(en, cn, time, menu)
}

VueMain.hideTip = () => {
  VueMain.app.$refs.tip.hideTip()
}

VueMain.clearTip = () => {
  VueMain.app.$refs.tip.clear()
}

VueMain.getTipState = () => {
  return VueMain.app.$refs.tip.show
}

VueMain.showStory = () => {
  VueMain.app.$refs.story.show()
}

VueMain.hideStory = () => {
  VueMain.app.$refs.story.hide()
}

VueMain.showPopup = (en, cn, time) => {
  return VueMain.app.$refs.Popup.show(en, cn, time)
}

VueMain.hidePopup = () => {
  VueMain.app.$refs.Popup.hide()
}