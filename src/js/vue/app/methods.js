VueMain.setTitleColor = (color) => {
  VueMain.app.$refs.title.color = color
}

VueMain.setTitle = (title) => {
  VueMain.app.$refs.title.title = title
}

/** test */
VueMain.titleTest = () => {
  VueMain.app.$refs.title.titleTest()
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