<template>
  <div id="main-menu">
    <transition name="fade">
      <div class="main-menu" v-if="show">
        <div class="bg">
          <img :src="bg" alt draggable="false" />
        </div>
        <transition name="slide-up" appear>
          <div class="btn-list" v-if="menu.show">
            <template v-for="(item, index) in menu.list">
              <div
                v-if="item.show"
                class="btn"
                :class="{
                  'menu-highlight': item.cn === menu.list[menu.current].cn
                }"
                :key="index"
              >
                <div class="cn">{{ item.cn }}</div>
                <div class="en">{{ item.en }}</div>
              </div>
            </template>
          </div>
        </transition>
        <Setting ref="Setting" @back="showMenu"></Setting>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  components: {
    Setting: VueMain.loadComponent('Common/Setting')
  },
  data: () => ({
    bg: md5Url('img/pictures/menu.png'),
    show: false,
    busy: false,
    loop: {
      restart: false,
      next: 0
    },
    menu: {
      show: true,
      current: 1,
      restart: true,
      list: [
        {
          show: true,
          cn: '重新开始',
          en: 'Restart',
          fn() {
            Methods.hidePopup()
            if (!this.loop.next) {
              DataManager.setupNewGame()
              this.hideMenu()
              SceneManager.goto(Scene_Map)
              setTimeout(() => {
                this.show = false
              }, 400)
            } else {
              if (DataManager.loadGame(1)) {
                this.hideMenu()
                $gameVariables.setValue(1, this.loop.next)
                $gameTemp.reserveCommonEvent(97)
                Methods.clearTip()
                Patch.addGlobalInfo('loop', {
                  restart: false,
                  load: true
                })
                AudioManager.stopAll()
                SceneManager.goto(Scene_Map)
                $gameSystem.onAfterLoad()
                setTimeout(() => {
                  this.show = false
                }, 400)
              } else {
                Methods.showPopup('Error', '奇怪的错误', 1500)
              }
            }
          }
        },
        {
          show: false,
          cn: '继续',
          en: 'Continue',
          fn() {
            Methods.hidePopup()
            if (this.loop.restart) {
              this.test()
            } else {
              if (DataManager.loadGame(1)) {
                this.hideMenu()
                Patch.startWait()
                setTimeout(() => {
                  $gameTemp.reserveCommonEvent(98)
                  SceneManager.goto(Scene_Map)
                  $gameSystem.onAfterLoad()
                  setTimeout(() => {
                    this.show = false
                    Patch.showTip()
                    Patch.stopWait()
                  }, 500)
                }, 200)
              } else {
                Methods.showPopup('Error', '奇怪的错误', 1500)
              }
            }
          }
        },
        {
          show: true,
          cn: '设置',
          en: 'Setting',
          fn() {
            this.hideMenu()
            this.$refs.Setting.show = true
          }
        },
        {
          show: true,
          cn: '制作组',
          en: 'Credits',
          fn() {
            Methods.showPopup('Not finished', '还没做', 1500)
          }
        },
        {
          show: true,
          cn: '退出',
          en: 'Exit',
          fn() {
            SceneManager.exit()
          }
        }
      ]
    }
  }),
  watch: {
    show() {
      if (this.show) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      AudioManager.stopAll()
      for (const i in this.menu.list) {
        if (i > 0) {
          if (this.menu.list[i].cn === '继续') {
            if (Patch.checkSave()) this.menu.list[i].show = true
          } else {
            this.menu.list[i].show = true
          }
        }
      }
      const data = DataManager.loadGlobalInfo()
      if (data[0].loop) {
        if (data[0].loop.lock) {
          Methods.showPopup('', '这是一段解锁动画，还没做', 2000)
          data[0].loop.lock = false
        }
        this.loop.restart = data[0].loop.restart
        this.loop.next = data[0].loop.next
        if (data[0].loop.load === false) this.menu.list[1].show = false
      }
      DataManager.saveGlobalInfo(data)
      this.menu.current = 1
      this.menu.show = true
      this.menuShowAnime()
    },
    menuShowAnime() {
      this.$nextTick(() => {
        anime({
          targets: '.btn',
          translateY: [100, 0],
          easing: 'spring(1, 100, 10, 10)',
          duration: 500,
          delay: anime.stagger(50)
        })
      })
    },
    getLastItem() {
      const isLast = key => {
        if (key === 0) return 0
        return this.menu.list[key].show ? key : isLast(key - 1)
      }
      return isLast(this.menu.list.length - 1)
    },
    findIndex(name) {
      return this.menu.list.findIndex(item => {
        return item.cn === name
      })
    },
    checkInput(buttonName) {
      if (!this.show || this.busy) return
      if (this.$refs.Setting.show) {
        this.$refs.Setting.checkInput(buttonName)
      } else if (this.menu.show) {
        switch (buttonName) {
          case 'left':
            this.up()
            break
          case 'right':
            this.down()
            break
          case 'up':
            this.up()
            break
          case 'down':
            this.down()
            break
          case 'ok':
            if (this.menu.list[this.menu.current].show) {
              this.menu.list[this.menu.current].fn.call(this)
            }
            break
          case 'escape':
            this.back()
            break
        }
      }
    },
    up() {
      if (this.menu.show) {
        if (this.menu.current === 0) {
          this.menu.current = this.menu.list.length - 1
        } else {
          --this.menu.current
        }
        if (!this.menu.list[this.menu.current].show) {
          this.up()
        }
      }
    },
    down() {
      if (this.menu.show) {
        if (this.menu.current === this.menu.list.length - 1) {
          this.menu.current = 0
        } else {
          ++this.menu.current
        }
        if (!this.menu.list[this.menu.current].show) {
          this.down()
        }
      }
    },
    back() {
      if (!this.show) return
      this.$refs.Setting.back()
      this.showMenu()
    },
    showMenu() {
      if (this.menu.show) return
      this.menu.show = true
      this.menuShowAnime()
    },
    hideMenu() {
      if (!this.menu.show) return
      this.menu.show = false
    },
    test() {
      if (this.menu.restart) {
        this.hideMenu()
        Methods.showPopup(
          'I think you should restart the game',
          '我觉得你应该重新开始游戏',
          1500
        ).then(() => {
          this.showMenu()
        })
        this.menu.restart = false
      } else {
        this.hideMenu()
        Methods.showPopup("Well, that'll have to do", '好吧，那只能这样了', 1500).then(() => {
          for (const i in this.menu.list) {
            if (i > 0) {
              this.menu.list[i].show = false
            }
          }
          this.menu.current = 0
          this.showMenu()
          Patch.setGlobalInfo('loop', 'load', false)
        })
      }
    }
  }
}
</script>

<style scoped lang="stylus">
#main-menu
  .main-menu
    z-index 80
    position absolute
    overflow hidden
    width 100%
    height 100%
    user-select none

    .bg
      position absolute
      width 100%
      height 100%
      left 0
      top 0
      overflow hidden

      img
        height 100%

    .btn-list
      position absolute
      bottom 60px
      left 0
      width 100%
      display flex
      justify-content space-around
      background rgba(0, 0, 0, 0.5)

      .btn
        overflow hidden
        position relative
        display flex
        flex-direction column
        align-items center
        justify-content center
        padding 0 10px
        color #fff
        height 50px

        div
          z-index 2

        .highlight
          position absolute
          width calc(100% - 10px)
          height calc(100% - 10px)
          bottom 2.5px
          left 2.5px
          border 2px solid #fff

        .cn
          font-size 20px
          line-height 20px
          margin-top 5px

        .en
          font-size 16px
          line-height 16px

.menu-highlight
  & > *
    text-shadow #ed9c94 0px 0 2px, #ed9c94 0px 0 2px, #ed9c94 0px 0 2px, #ed9c94 0px 0 2px

.fade-enter-active, .fade-leave-active
  transition opacity 0.5s

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.slide-up-enter-active, .slide-up-leave-active
  transition all 0.3s

.slide-up-enter, .slide-up-leave-to
  bottom -70px !important
  opacity 0.5

.slide-up-enter-to, .slide-up-leave
  bottom 60px !important
  opacity 1
</style>
