<template>
  <div id="main-menu">
    <transition name="fade">
      <div class="main-menu" v-if="show">
        <div class="bg">
          <img class="img" :src="bg" alt draggable="false" />
          <transition name="title" appear>
            <img class="main-title" :src="title" alt draggable="false" v-if="menu.show" />
          </transition>
        </div>
        <transition name="slide-up" appear>
          <div class="btn-list" v-if="menu.show">
            <div class="main-highlight" v-show="left > 0" :style="{ left: left + 'px' }"></div>
            <template v-for="(item, index) in menu.list">
              <div v-if="item.show" class="btn" :key="index" :data-cn="item.cn" ref="btn">
                <div class="en">{{ item.en }}</div>
                <div class="cn">{{ item.cn }}</div>
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
    show: false,
    busy: false,
    bg: md5Url('img/vue/menu/menu.png'),
    title: md5Url('img/vue/menu/title.png'),
    left: 0,
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
            // 第一章需移除条件Patch.loopData.newGame
            if (Patch.loopData.newGame || !Patch.loopData.next) {
              this.hideMenu()
              DataManager.setupNewGame()
              SceneManager.goto(Scene_Map)
              Patch.startWait()
              setTimeout(() => {
                this.show = false
                Patch.stopWait()
              }, 300)
            } else {
              this.hideMenu()
              Components.Loading.loadingShow()
              setTimeout(() => {
                DataManager.loadGame(1)
                  .then(() => {
                    this.show = false
                    $gameMap._interpreter.command115()
                    $gameVariables.setValue(1, Patch.loopData.next)
                    $gameTemp.reserveCommonEvent(97)
                    Methods.clearTip()
                    AudioManager.stopAll()
                    SceneManager.goto(Scene_Map)
                  })
                  .catch((err) => {
                    console.error(err)
                    Methods.showPopup('Error', '奇怪的错误', 1500)
                    Components.Loading.loadingHide()
                    this.showMenu()
                  })
              }, 300)
            }
          }
        },
        {
          show: false,
          cn: '继续',
          en: 'Continue',
          fn() {
            Methods.hidePopup()
            if (Patch.loopData.restart) {
              this.chapterEnd()
            } else {
              this.hideMenu()
              Components.Loading.loadingShow()
              setTimeout(() => {
                DataManager.loadGame(1)
                  .then(() => {
                    this.show = false
                    $gameTemp.reserveCommonEvent(98)
                    SceneManager.goto(Scene_Map)
                  })
                  .catch(() => {
                    Methods.showPopup('Error', '奇怪的错误', 1500)
                    Components.Loading.loadingHide()
                    this.showMenu()
                  })
              }, 300)
            }
          }
        },
        {
          show: true,
          cn: '设置',
          en: 'Setting',
          fn() {
            if (this.$refs.Setting) {
              SoundManager.playOk()
              this.hideMenu()
              this.$refs.Setting.show = true
            }
          }
        },
        {
          show: true,
          cn: '制作组',
          en: 'Credits',
          fn() {
            this.hideMenu()
            Components.Credits.start()
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
      Components.Loading.loadingHide()
      this.menu.current = 1
      Components.GameMenu.menu.current = 0
      for (const i in this.menu.list) {
        if (i > 0) {
          if (this.menu.list[i].cn === '继续') {
            if (Patch.checkSave()) {
              this.menu.list[i].show = true
            } else {
              this.menu.list[i].show = false
              this.menu.list[0].cn = '开始'
              this.menu.list[0].en = 'Start'
              this.menu.current = 0
            }
          } else {
            this.menu.list[i].show = true
          }
        }
      }

      if (Patch.loopData.lock) {
        Methods.showPopup('Seems to have unlocked something strange', '好像解锁了一些奇怪的东西', 2000)
        Patch.loopData.lock = false
      }
      if (Patch.loopData.load === false) {
        this.menu.list[1].show = false
        this.menu.current = 0
      }
      Patch.saveLoopData()

      this.menu.show = true
      this.menuShowAnime()
      this.$nextTick(() => {
        this.setHighlight()
      })
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
        anime({
          targets: '.main-title',
          top: [0, '30%'],
          easing: 'spring(1, 100, 10, 10)',
          duration: 500
        })
        anime({
          targets: '.main-highlight',
          translateY: [100, 0],
          easing: 'spring(1, 100, 10, 10)',
          duration: 500
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
    setHighlight() {
      const item = this.$refs?.btn.find(item => {
        return item.dataset?.cn === this.menu.list[this.menu.current].cn
      })
      this.left = item?.offsetLeft || 0
    },
    checkInput(buttonName) {
      if (!this.show || this.busy) return
      if (Components.Credits.show) return
      if (this.$refs?.Setting?.show) {
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
    up(next) {
      if (!next && this.timer) return
      if (this.menu.show) {
        if (this.menu.current === 0) {
          this.menu.current = this.menu.list.length - 1
        } else {
          --this.menu.current
        }
        if (!this.menu.list[this.menu.current].show) {
          this.up(true)
        } else {
          if (this.timer) return
          SoundManager.playCursor()
          this.setHighlight()
          this.timer = setTimeout(() => {
            this.timer = null
          }, 150)
        }
      }
    },
    down(next) {
      if (!next && this.timer) return
      if (this.menu.show) {
        if (this.menu.current === this.menu.list.length - 1) {
          this.menu.current = 0
        } else {
          ++this.menu.current
        }
        if (!this.menu.list[this.menu.current].show) {
          this.down(true)
        } else {
          if (this.timer) return
          SoundManager.playCursor()
          this.setHighlight()
          this.timer = setTimeout(() => {
            this.timer = null
          }, 150)
        }
      }
    },
    back() {
      if (!this.show) return
      this.$refs?.Setting?.back()
      this.showMenu()
    },
    showMenu() {
      if (this.menu.show) return
      this.menu.show = true
      this.menuShowAnime()
      this.$nextTick(() => {
        this.setHighlight()
      })
    },
    hideMenu() {
      if (!this.menu.show) return
      this.menu.show = false
      this.left = 0
    },
    chapterEnd() {
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
          Patch.loopData.load = false
          Patch.saveLoopData()
        })
      }
    }
  },
  crated() {
    this.timer = null
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
      position relative
      width 100%
      height 100%
      left 0
      top 0
      overflow hidden

      .img
        position absolute
        bottom 0
        width 100%

      .main-title
        display block
        position absolute
        top 30%
        left 50%
        transform translate(-50%, -50%)
        width 50%
        padding 0px 5px
        background linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.5) 10px, rgba(0, 0, 0, 0.5) calc(100% - 10px), transparent 100%)

    .btn-list
      box-sizing border-box
      position absolute
      bottom 60px
      left 0
      width 100%
      height 60px
      padding 0 10px
      display flex
      align-items center
      justify-content space-around
      background linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.5) 10px, rgba(0, 0, 0, 0.5) calc(100% - 10px), transparent 100%)

      .main-highlight
        position absolute
        height 50px
        width 120px
        border 2px solid rgba(255, 176, 170, 0.9)
        border-radius 10px
        transition left 0.15s

      .btn
        overflow hidden
        position relative
        display flex
        flex-direction column
        align-items center
        justify-content center
        padding 0px 10px 4px 10px
        color #fff
        width 100px
        height 50px

        div
          z-index 2

        .cn
          font-size 20px
          line-height 20px
          margin-top 5px

        .en
          font-size 16px
          line-height 16px

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.fade-enter-active
  transition opacity 0.5s

.fade-leave-active
  transition opacity 0.3s

.title-leave-to
  top 0 !important
  opacity 0

.title-leave
  top 30% !important
  opacity 1

.title-leave-active
  transition all 0.3s

.slide-up-enter, .slide-up-leave-to
  bottom -70px !important
  opacity 0.5

.slide-up-enter-to, .slide-up-leave
  bottom 60px !important
  opacity 1

.slide-up-enter-active, .slide-up-leave-active
  transition all 0.3s
</style>
