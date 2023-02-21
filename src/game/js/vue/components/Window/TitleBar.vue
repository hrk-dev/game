<template>
  <div id="title-bar" :style="{ background: color }" v-show="show">
    <div class="title-icon-text">
      <div class="title-icon">
        <img style="height: 60%" src="./icon/icon.ico" />
      </div>
      <div class="title-text">{{ title }}</div>
    </div>
    <div class="title-btn-list">
      <div class="dev-btn" v-if="test">
        <div class="title-btn" @click="ipc('app:reload')" title="刷新页面">Re</div>
        <div class="title-btn" @click="testEvent" title="测试事件">Test</div>
        <div class="title-btn" @click="ipc('dev:tool')" title="打开devtools">Dev</div>
        <div class="title-btn" @click="ipc('dev:vue')" title="打开vue-devtools" v-if="dev">Vue</div>
      </div>
      <div class="title-btn" style="line-height: 20px" @click="ipc('app:min')">_</div>
      <div class="title-btn" @click="ipc('app:max')">□</div>
      <div class="title-btn" @click="ipc('app:quit')">×</div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    show: true,
    test: false,
    dev: false,
    title: '',
    color: ''
  }),
  methods: {
    testEvent() {
      if (Components.MainMenu.show) {
        Components.MainMenu.hideMenu()
        DataManager.setupNewGame()
        SceneManager.goto(Scene_Map)
        $gameTemp.reserveCommonEvent(100)
        Components.MainMenu.show = false
      }
    },
    ipc(type) {
      electron.ipcRenderer.send(type)
    },
    reset() {
      this.title = '和你相遇的那天是轮回高校的日常这也是合理的吗？'
    },
    checkInput(code) {
      if (Components?.Credits.show) return
      if (this.title === 'Hiir' && code === 79) {
        this.title = 'Hiiro'
        Methods.showPopup('', 'M~U~A~', 1000)
          .then(() => {
            this.reset()
          })
        return
      }
      if (this.title === 'Hirr' && code === 79) {
        this.title = 'Hirro'

        Patch.loopData.extra = false
        Patch.saveLoopData()

        Methods.showPopup('', '我打你啊！', 1000)
          .then(() => {
            this.reset()
          })
        return
      }
      if (this.title === 'Hii' && code === 82) {
        this.title = 'Hiir'
        return
      }
      if (this.title === 'Hir' && code === 82) {
        this.title = 'Hirr'
        return
      }
      if (this.title === 'Hi') {
        if (code === 73) {
          this.title = 'Hii'
          return
        }
        if (code === 82) {
          this.title = 'Hir'
          return
        }
      }
      if (this.title === 'H' && code === 73) {
        this.title = 'Hi'
        return
      }
      if (this.title !== 'H' && code === 72) {
        this.title = 'H'
      } else {
        this.reset()
      }
    }
  },
  mounted() {
    if (test) {
      this.test = true
    }
    if (dev) {
      this.dev = true
    }
    this.reset()
  }
}
</script>

<style lang="stylus" scoped>
#title-bar
  display flex
  justify-content space-between
  align-items flex-start
  position fixed
  left 0
  top 0
  width 100%
  height 30px
  background-color #f5c1bb
  -webkit-app-region drag
  z-index 999
  color white
  line-height 30px
  transition background-color 0.2s
  font-family auto

  .title-icon-text
    display flex
    justify-content center
    align-items center
    opacity 0
    animation-delay 1s
    animation title-show 3s
    animation-fill-mode forwards
    height 100%

  .title-icon
    display flex
    justify-content center
    align-items center
    flex-shrink 0
    height 30px
    width 30px

  .title-text
    font-family 'GameFont'
    overflow hidden
    height 110%

  .title-btn-list
    display flex

    .dev-btn
      display flex
      background rgba(255, 255, 255, 0.2)

    .title-btn
      display inline-block
      line-height 27px
      height 27px
      width 45px
      text-align center
      -webkit-app-region no-drag

      &:hover
        background #fadbd8

      &:active
        background #f5b7bb

@keyframes title-show
  from
    opacity 0

  to
    opacity 1
</style>
