<template>
  <div id="main-menu">
    <transition name="fade">
      <div class="main-menu" v-if="show">
        <div class="bg">
          <img src="img/pictures/bg.jpg" alt draggable="false" />
        </div>
        <transition name="slide-up" appear>
          <div class="btn-list" v-if="menu.show">
            <template v-for="(item, index) in menu.list">
              <div
                v-if="item.show"
                class="btn"
                :class="{
                  'text-highlight': item.cn === menu.list[menu.current].cn
                }"
                :style="{
                  flexDirection: item.multiline ? 'column' : '',
                  alignItems: item.multiline ? 'normal' : '',
                  justifyContent: item.multiline ? 'center' : ''
                }"
                :key="index"
                @click="onKeydown"
                @mouseover="mouseOver(item.cn)"
              >
                <transition :name="menu.animation">
                  <div
                    class="highlight"
                    v-if="item.cn === menu.list[menu._current].cn"
                  ></div>
                </transition>
                <div
                  class="cn"
                  :style="{
                    fontSize: item.multiline ? '14px' : '',
                    lineHeight: item.multiline ? '14px' : ''
                  }"
                >
                  {{ item.cn }}
                </div>
                <div
                  class="en"
                  :style="{
                    fontSize: item.multiline ? '12px' : '',
                    lineHeight: item.multiline ? '8px' : '',
                    margin: item.multiline ? '2px 2px 0 2px' : ''
                  }"
                >
                  {{ item.en }}
                </div>
              </div>
            </template>
          </div>
        </transition>
        <Setting ref="Setting" @back="showMenu" />
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  components: {
    Setting: VueMain.loadComponent('common/Setting')
  },
  data: () => ({
    show: false,
    busy: false,
    loop: {
      restart: false,
      next: 0
    },
    menu: {
      animation: 'slide-left',
      show: true,
      current: 1,
      _current: 1,
      restart: true,
      list: [
        {
          show: true,
          cn: '重新开始',
          en: 'Restart'
        },
        {
          show: true,
          cn: '继续',
          en: 'Continue'
        },
        {
          show: true,
          cn: '设置',
          en: 'Setting'
        },
        {
          show: true,
          cn: '制作人名单',
          en: 'Production Team',
          multiline: true
        },
        {
          show: true,
          cn: '退出',
          en: 'Exit'
        }
      ]
    }
  }),
  computed: {
    menuCurrent() {
      return this.menu.current
    }
  },
  watch: {
    show() {
      if (this.show) {
        this.init()
      }
    },
    menuCurrent(newVal, oldVal) {
      if (oldVal === 0 && newVal === this.getLastItem()) {
        this.menu.animation = 'slide-left'
      } else if (oldVal === this.getLastItem() && newVal === 0) {
        this.menu.animation = 'slide-right'
      } else {
        this.menu.animation = newVal > oldVal ? 'slide-right' : 'slide-left'
      }
      this.$nextTick(() => {
        this.menu._current = this.menu.current
      })
    }
  },
  methods: {
    init() {
      for (const i in this.menu.list) {
        if (i > 0) {
          this.menu.list[i].show = true
        }
      }
      const data = DataManager.loadGlobalInfo() || [{}]
      if (data[0].loop) {
        if (data[0].loop.lock) {
          VueMain.showPopup('', '这是一段解锁动画，还没做', 2000)
          data[0].loop.lock = false
        }
        this.loop.restart = data[0].loop.restart
        this.loop.next = data[0].loop.next
        if (data[0].loop.load === false) this.menu.list[1].show = false
      }
      DataManager.saveGlobalInfo(data)
      this.menu.show = true
      this.menu.current = 1
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
    mouseOver(name) {
      const index = this.findIndex(name)
      if (index !== -1) {
        this.menu.current = index
      }
    },
    checkInput(buttonName) {
      if (!this.show || this.busy) return
      switch (buttonName) {
        case 'left':
          if (this.$refs.Setting.show) {
            if (this.$refs.Setting.current === 1) {
              this.$refs.Setting.bgmDown()
            } else if (this.$refs.Setting.current === 2) {
              this.$refs.Setting.seDown()
            }
          } else {
            this.up()
          }
          break
        case 'right':
          if (this.$refs.Setting.show) {
            if (this.$refs.Setting.current === 1) {
              this.$refs.Setting.bgmUp()
            } else if (this.$refs.Setting.current === 2) {
              this.$refs.Setting.seUp()
            }
          } else {
            this.down()
          }
          break
        case 'up':
          this.up()
          break
        case 'down':
          this.down()
          break
        case 'ok':
          this.onKeydown()
          break
        case 'escape':
          this.back()
          break
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
      } else if (this.$refs.Setting.show) {
        if (!this.$refs.Setting.show) return
        if (this.$refs.Setting.current === 0) {
          this.$refs.Setting.current = 3
        } else {
          --this.$refs.Setting.current
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
      } else if (this.$refs.Setting.show) {
        if (this.$refs.Setting.current === 3) {
          this.$refs.Setting.current = 0
        } else {
          ++this.$refs.Setting.current
        }
      }
    },
    onKeydown() {
      if (this.menu.show) {
        switch (this.menu.current) {
          case 0:
            if (this.loop.next === 0) {
              DataManager.setupNewGame()
              this.menu.show = false
              SceneManager.goto(Scene_Map)
              setTimeout(() => {
                this.show = false
              }, 400)
            } else {
              if (DataManager.loadGame(1)) {
                this.menu.show = false
                $gameVariables.setValue(1, this.loop.next)
                $gameSwitches.setValue(97, true)
                $gameSwitches.setValue(98, true) // 触发重载
                VueMain.clearTip()
                $gameSystem.onBeforeSave()
                if (DataManager.saveGame(1)) {
                  StorageManager.cleanBackup(1)
                }
                Patch.addGlobalInfo('loop', {
                  restart: false,
                  load: true
                })
                SceneManager.goto(Scene_Map)
                $gameSystem.onAfterLoad()
                setTimeout(() => {
                  this.show = false
                }, 400)
              } else {
                VueMain.showPopup('Error', '奇怪的错误', 1500)
              }
            }
            break
          case 1:
            if (this.loop.restart) {
              this.test()
            } else {
              if (DataManager.loadGame(1)) {
                this.menu.show = false
                $gameSwitches.setValue(98, true) // 触发重载
                SceneManager.goto(Scene_Map)
                $gameSystem.onAfterLoad()
                setTimeout(() => {
                  this.show = false
                  Patch.showTip()
                }, 400)
              } else {
                VueMain.showPopup('Error', '奇怪的错误', 1500)
              }
            }
            break
          case 2:
            this.menu.show = false
            this.$refs.Setting.show = true
            break
          case 3:
            VueMain.showPopup('Not finished', '还没做', 1500)
            break
          case 4:
            SceneManager.exit()
            break
        }
      } else if (this.$refs.Setting.show) {
        switch (this.$refs.Setting.current) {
          case 0:
            this.$refs.Setting.changeKeepRunning()
            break
          case 1:
            if (this.$refs.Setting.bgm === 10) {
              this.$refs.Setting.bgm = 0
            } else {
              ++this.$refs.Setting.bgm
            }
            break
          case 2:
            if (this.$refs.Setting.se === 10) {
              this.$refs.Setting.se = 0
            } else {
              ++this.$refs.Setting.se
            }
            break
          case 3:
            this.back()
            break
        }
      }
    },
    back() {
      if (!this.show) return
      this.$refs.Setting.back()
      this.menu.show = true
    },
    showMenu() {
      this.menu.show = true
    },
    test() {
      if (this.menu.restart) {
        this.menu.show = false
        VueMain.showPopup(
          'I think you should restart the game',
          '我觉得你应该重新开始游戏',
          1500
        ).then(() => {
          this.menu.show = true
        })
        this.menu.restart = false
      } else {
        this.menu.show = false
        VueMain.showPopup(
          "Well, that'll have to do",
          '好吧，那只能这样了',
          1500
        ).then(() => {
          for (const i in this.menu.list) {
            if (i > 0) {
              this.menu.list[i].show = false
            }
          }
          this.menu.current = 0
          this.menu.show = true
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
        width 170%

    .btn-list
      position absolute
      bottom 0
      left 0
      width 100%
      display flex
      justify-content space-around

      .btn
        overflow hidden
        position relative
        display flex
        align-items center
        padding 0 35px 5px 5px
        // background linear-gradient(233deg, transparent 25px, #666 0) top right
        // background-repeat no-repeat
        background #666
        clip-path polygon(0 0, calc(100% - 30px) 0, 100% 100%, 0% 100%)
        color #fff
        height 35px
        font-size 18px
        transition color 0.5s

        div
          z-index 2

        .highlight
          position absolute
          width calc(100% - 35px)
          height calc(100% - 5px)
          bottom 0
          left 5px
          background #ddd

        .cn
          margin 2px 2px 0 2px

        .en
          margin 2px 2px 0 0

.text-highlight
  color #000 !important

.fade-enter-active, .fade-leave-active
  transition opacity 0.5s

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.slide-up-enter-active, .slide-up-leave-active
  transition all 0.3s

.slide-up-enter, .slide-up-leave-to
  transform translateY(100%)
  opacity 0

.slide-up-enter-to, .slide-up-leave
  transform translateY(0)
  opacity 1

.slide-down-enter-active, .slide-down-leave-active
  transition all 0.3s

.slide-down-enter, .slide-down-leave-to
  transform translateY(-100%)
  opacity 0

.slide-down-enter-to, .slide-down-leave
  transform translateY(0)
  opacity 1

.slide-left-enter-active, .slide-left-leave-active
  transition all 0.3s

.slide-left-enter
  left 100% !important

.slide-left-enter-to
  left 5px !important

.slide-left-leave
  left 5px !important

.slide-left-leave-to
  left -100% !important

.slide-right-enter-active, .slide-right-leave-active
  transition all 0.3s

.slide-right-enter
  left -100% !important

.slide-right-enter-to
  left 5px !important

.slide-right-leave
  left 5px !important

.slide-right-leave-to
  left 100% !important
</style>
