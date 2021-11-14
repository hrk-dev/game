const VueMain = class {
  static appPath = path.join(__dirname, './js/vue/app')

  static componentsPath = path.join(__dirname, './js/vue/components')

  static getAppPath = (name) => {
    return path.join(VueMain.appPath, name)
  }

  static getComponentPath = (name) => {
    return path.join(VueMain.componentsPath, name)
  }

  static loadTemplate = (name) => {
    return fs.readFileSync(VueMain.getAppPath(name + '.html')).toLocaleString()
  }

  static loadComponent = (name) => {
    return 'url:' + VueMain.getComponentPath(name + '.vue')
  }
  static setup = () => {
    require(VueMain.getAppPath('app.js'))
    require(VueMain.getAppPath('methods.js'))
    this.Components = VueMain.app.$refs
  }
}

httpVueLoader.langProcessor.stylus = (stylusText) => {
  return new Promise((resolve, reject) => {
    stylus.render(stylusText.trim(), {}, (err, css) => {
      if (err) reject(err)
      resolve(css)
    })
  })
}

Vue.use(httpVueLoader)

VueMain.setup()
