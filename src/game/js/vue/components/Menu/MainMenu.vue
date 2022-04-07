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
        <transition name="fade">
          <div class="chapter" v-if="chapter.show">
            <div class="text">
              Chapter
              <transition name="slide-up-text" @after-enter="setEnd" @after-leave="setEnd">
                <span class="number" v-if="!chapter.flag">{{ chapter.next_1 }}</span>
              </transition>
              <transition name="slide-up-text">
                <span class="number" v-if="chapter.flag">{{ chapter.next_2 }}</span>
              </transition>
              <div class="arrow">_</div>
            </div>
          </div>
        </transition>
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
    chapter: {
      show: false,
      flag: true,
      end: true,
      next_1: 0,
      next_2: 1
    },
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
            if (!Patch.loopData.next) {
              this.startGame()
            } else {
              this.hideMenu()
              if (Patch.loopData.newGame) {
                this.setNext(Patch.loopData.next)
                this.chapter.show = true
              } else {
                this.startLoop(Number(Patch.loopData.next))
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
    startGame() {
      this.hideMenu()
      DataManager.setupNewGame()
      SceneManager.goto(Scene_Map)
      Patch.startWait()
      setTimeout(() => {
        this.show = false
        Patch.stopWait()
      }, 300)
    },
    startLoop(next) {
      if (next === 0) {
        this.startGame()
        return
      }
      Components.Loading.loadingShow()
      setTimeout(() => {
        DataManager.loadGame(next + 100)
          .then(() => {
            this.show = false
            $gameMap._interpreter.command115()
            $gameVariables.setValue(1, next)
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
    },
    setNext(next) {
      if (this.chapter.flag) {
        this.chapter.next_1 = next
      } else {
        this.chapter.next_2 = next
      }
      this.chapter.flag = !this.chapter.flag
    },
    setEnd() {
      this.chapter.end = true
    },
    checkInput(buttonName) {
      if (!this.show || this.busy) return
      if (Components.Credits.show) return
      if (this.chapter.show) {
        switch (buttonName) {
          case 'left':
            this.chapterUp()
            break
          case 'right':
            this.chapterDown()
            break
          case 'up':
            this.chapterUp()
            break
          case 'down':
            this.chapterDown()
            break
          case 'ok':
            this.chapter.show = false
            if (this.chapter.flag) {
              console.log(this.chapter.next_2)
              this.startLoop(this.chapter.next_2)
            } else {
              console.log(this.chapter.next_1)
              this.startLoop(this.chapter.next_1)
            }
            break
          case 'escape':
            this.chapter.show = false
            this.showMenu()
            break
        }
        return
      }
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
    chapterUp() {
      if (!this.chapter.end) return
      this.chapter.end = false

      let temp = 0
      if (this.chapter.flag) {
        temp = this.chapter.next_2 - 1
      } else {
        temp = this.chapter.next_1 - 1
      }
      if (temp < 0) {
        temp = Patch.loopData.next
      }
      this.setNext(temp)
    },
    chapterDown() {
      if (!this.chapter.end) return
      this.chapter.end = false

      let temp = 0
      if (this.chapter.flag) {
        temp = this.chapter.next_2 + 1
      } else {
        temp = this.chapter.next_1 + 1
      }
      if (temp > Patch.loopData.next) {
        temp = 0
      }
      this.setNext(temp)
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

    .chapter
      display flex
      flex-direction column
      justify-content center
      align-items center
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background rgba(0, 0, 0, 0.5)
      color #fff

      .text
        position relative
        text-align center
        line-height 50px
        font-size 50px
        padding-right 15px

        .number
          position absolute
          bottom -5px
          margin-left 15px

        .arrow
          position absolute
          bottom 0
          left -45px
          animation arrow 0.8s linear alternate infinite

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

.slide-up-text-enter-active
  transition all 0.35s
  transition-delay 0.1s

.slide-up-text-leave-active
  transition all 0.35s

.slide-up-text-enter-to, .slide-up-text-leave
  bottom -5px !important
  opacity 1

.slide-up-text-enter
  bottom -40px !important
  opacity 0

.slide-up-text-leave-to
  bottom 40px !important
  opacity 0

@keyframes arrow
  from
    opacity 0

  to
    opacity 1
</style>
