const VueMain = class {
  static appPath = path.join(__dirname, './js/vue/app')

  static componentsPath = path.join(__dirname, './js/vue/components')

  static getAppPath = (name) => {
    return path.join(this.appPath, name)
  }

  static getComponentPath = (name) => {
    return path.join(this.componentsPath, name)
  }

  static loadTemplate = (name) => {
    return fs.readFileSync(this.getAppPath(name + '.html')).toLocaleString()
  }

  static loadComponent = (name) => {
    return 'url:' + this.getComponentPath(name + '.vue')
  }

  static setup = () => {
    require(this.getAppPath('app.js'))
    require(this.getAppPath('methods.js'))
    global.Components = this.app.$refs
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
