const electron = require('electron')
const fs = require('fs')
const path = require('path')

var dev = false

const md5Url = (str) => {
  if (dev) return str
  const list = str.split('/')
  for (const i in list) {
    if (list[i]) list[i] = md5(list[i])
  }
  return `${list.join('/')}`
}

class ScriptManager {
  static setup(dir) {
    const list = fs.readdirSync(path.join(__dirname, dir)) || []
    list.forEach(name => {
      ScriptManager.loadScript(dir, name)
    })
  }

  static loadScript(dir, name) {
    if (name === 'main.js') return
    const url = dir + name
    const script = document.createElement('script')
    script.src = url
    script.async = false
    script._url = url
    document.body.appendChild(script)
  }
}

ScriptManager.setup('js/env/')
