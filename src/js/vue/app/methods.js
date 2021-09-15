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
