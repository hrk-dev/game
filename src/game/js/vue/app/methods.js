global.Methods = class {
  static setTitleColor(color) {
    Components.TitleBar.color = color
  }

  static setTitle(title) {
    Components.TitleBar.title = title
  }

  static showTip(en, cn, time, other) {
    Components.Tip.showTip(en, cn, time, other)
  }

  static hideTip() {
    Components.Tip.hideTip()
  }

  static clearTip() {
    Components.Tip.clear()
  }

  static getTipState() {
    return Components.Tip.show
  }

  static showPopup(en, cn, time) {
    return Components.Popup.show(en, cn, time)
  }

  static hidePopup() {
    Components.Popup.hide()
  }

  static showChoice(en, cn, fn, cb) {
    Components.Choice.showChoice(en, cn, fn, cb)
  }
}
