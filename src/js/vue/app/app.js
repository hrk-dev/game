VueMain.app = new Vue({
  el: '#app',
  template: VueMain.loadTemplate('app'),
  components: {
    MainMenu: VueMain.loadComponent('MainMenu'),
    TitleBar: VueMain.loadComponent('TitleBar'),
    VMain: VueMain.loadComponent('Main'),
    VVideo: VueMain.loadComponent('Video'),
    Ending: VueMain.loadComponent('Ending'),
    Danmu: VueMain.loadComponent('Danmu'),
    Tip: VueMain.loadComponent('Tip'),
    MoveTip: VueMain.loadComponent('MoveTip'),
    Story: VueMain.loadComponent('Story'),
    GameMenu: VueMain.loadComponent('GameMenu'),
    Popup: VueMain.loadComponent('Popup'),
    Message: VueMain.loadComponent('Message'),
    Logo: VueMain.loadComponent('Logo')
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
      VueMain.app.$refs.Logo.start()
    }
  },
  mounted() {
    setTimeout(() => {
      this.ipc('vue:ready')
    }, 50)
  }
})