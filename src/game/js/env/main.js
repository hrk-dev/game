const electron = require('electron')
const fs = require('fs')
const path = require('path')

let dev = false
let test = false

const md5Url = (str) => {
  if (dev) return str
  if (!str) return str
  const list = str.split('/')
  for (const i in list) {
    if (list[i]) list[i] = md5(list[i]).substr(8, 16)
  }
  return `${list.join('/')}`
}

class Test {
  static setup() {
    const list = fs.readdirSync(path.join(__dirname, 'js/env')) || []
    if (list.includes('dev.js')) {
      dev = true
      const devtools = require(path.join(__dirname, 'js/env/dev.js'))
      electron.ipcRenderer.once('show-vue-devtools', () => {
        devtools()
      })

    }
    if (list.includes('test.js')) {
      test = true
    }
  }
}

class ScriptManager {
  static setup(dir, defer) {
    const list = fs.readdirSync(path.join(__dirname, dir)) || []
    list.forEach(name => {
      ScriptManager.loadScript(dir, name, defer)
    })
  }

  static loadScript(dir, name, defer) {
    if (name === 'main.js') return
    const url = dir + name
    const script = document.createElement('script')
    script.src = url
    script.async = false
    if (defer) {
      script.defer = true
    }
    script._url = url
    document.body.appendChild(script)
  }
}

Test.setup()
