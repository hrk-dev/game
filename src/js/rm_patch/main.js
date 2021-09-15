const electron = require('electron')
const fs = require('fs')
const path = require('path')

class PatchManager {
  static path = 'js/rm_patch/'
  static setup() {
    const list = fs.readdirSync(path.join(__dirname, './js/rm_patch/')) || []
    list.forEach(name => {
      PatchManager.loadScript(name)
    })
  }

  static loadScript(name) {
    if (name === 'main.js') return
    const url = PatchManager.path + name
    const script = document.createElement('script')
    script.src = url
    script.async = false
    script._url = url
    document.body.appendChild(script)
  }
}

PatchManager.setup()
