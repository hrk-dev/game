VueMain.app = new Vue({
  el: '#app',
  template: VueMain.loadTemplate('app'),
  components: {
    TitleBar: VueMain.loadComponent('Window/TitleBar'),
    VMain: VueMain.loadComponent('Main'),
    Logo: VueMain.loadComponent('View/Logo'),
    Loading: VueMain.loadComponent('View/Loading'),
    MainMenu: VueMain.loadComponent('Menu/MainMenu'),
    GameMenu: VueMain.loadComponent('Menu/GameMenu'),
    MoveTip: VueMain.loadComponent('Popup/MoveTip'),
    Tip: VueMain.loadComponent('Popup/Tip'),
    Popup: VueMain.loadComponent('Popup/Popup'),
    Message: VueMain.loadComponent('Popup/Message'),
    VVideo: VueMain.loadComponent('Temp/Video'),
    Ending: VueMain.loadComponent('Temp/Ending'),
    Danmu: VueMain.loadComponent('Temp/Danmu'),
    Story: VueMain.loadComponent('Temp/Story')
  },
  data: () => ({
    ready: false,
    main: {
      scale: 1,
      width: 1024,
      height: 720,
      margin: 'auto',
    }
  }),
  computed: {
    _fontSize() {
      return (this.main.scale * 30) | 0
    }
  },
  methods: {
    ipc(type) {
      electron.ipcRenderer.send(type)
    },
    setReady() {
      this.ready = true
      Components.Logo.start()
    }
  },
  mounted() {
    setTimeout(() => {
      this.ipc('vue:ready')
    }, 50)
  }
})