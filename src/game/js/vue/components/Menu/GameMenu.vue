<template>
  <div id="game-menu">
    <div v-if="show">
      <transition name="slide-right" appear>
        <div class="menu" v-if="menu.show">
          <template v-for="(item, index) in menu.list">
            <transition name="btn" :key="index">
              <div
                class="btn game-menu-btn"
                :class="{
                  highlight: item.cn === menu.list[menu.current].cn
                }"
                v-if="item.show"
              >
                <div class="en">{{ item.en }}</div>
                <div class="cn">{{ item.cn }}</div>
              </div>
            </transition>
          </template>
          <transition name="btn">
            <div class="time game-menu-btn">
              <span>
                {{ _time }}
              </span>
            </div>
          </transition>
        </div>
      </transition>
      <transition name="slide-left" appear>
        <Todo v-if="menu.show"></Todo>
      </transition>
      <Save ref="Save" @save="save" @load="load" @back="showMenu"></Save>
      <transition name="fade">
        <Item v-if="item" ref="Item"></Item>
      </transition>
      <Setting ref="Setting" @back="showMenu"></Setting>
    </div>
    <div class="bg"></div>
  </div>
</template>

<script>
module.exports = {
  components: {
    Todo: VueMain.loadComponent('Common/Todo'),
    Save: VueMain.loadComponent('Common/SaveList'),
    Item: VueMain.loadComponent('Common/ItemList'),
    Setting: VueMain.loadComponent('Common/Setting')
  },
  data: () => ({
    show: false,
    hasSave: false,
    time: 0,
    // 是否显示物品栏
    item: false,
    menu: {
      show: false,
      current: 0,
      list: [
        {
          show: true,
          cn: '保存',
          en: 'Save',
          fn() {
            if (this.hasSave) {
              this.hideMenu()
              this.$refs.Save.show(1, true)
            } else {
              Patch.save(1)
            }
          }
        },
        {
          show: false,
          cn: '读取',
          en: 'Load',
          fn() {
            this.hideMenu()
            this.$refs.Save.show(0, true)
          }
        },
        {
          show: true,
          cn: '物品',
          en: 'Item',
          fn() {
            this.hideMenu()
            this.item = true
          }
        },
        {
          show: true,
          cn: '设置',
          en: 'Setting',
          fn() {
            if (this.$refs.Setting) {
              this.hideMenu()
              this.$refs.Setting.show = true
            }
          }
        },
        {
          show: false,
          cn: '调试',
          en: 'Debug',
          fn() {
            this.hideMenu()
            Components.Debug.show()
          }
        },
        {
          show: true,
          cn: '退出',
          en: 'Exit',
          fn() {
            Methods.showChoice('Do you wish back to title', '是否返回主菜单', () => {
              this.hideMenu()
              this.show = false
              setTimeout(() => {
                Components.Choice.hideChoice()
                AudioManager.stopBgm()
                AudioManager.stopBgs()
                SceneManager.goto(Scene_Title)
              }, 300)
            })
          }
        }
      ]
    }
  }),
  computed: {
    _time() {
      const hour = Math.floor(this.time / 60 / 60)
      const min = Math.floor(this.time / 60) % 60
      const sec = this.time % 60
      return hour.padZero(2) + ':' + min.padZero(2) + ':' + sec.padZero(2)
    }
  },
  watch: {
    async show() {
      if (this.show) {
        Patch.startWait()
        this.init()
      } else {
        await this.$nextTick()
        Patch.stopWait()
      }
    }
  },
  methods: {
    init() {
      this.menu.list[1].show = false
      this.menu.list[4].show = Components.Debug.dev
      this.checkSave()
      // this.menu.current = 0
      this.showMenu()
    },
    checkSave() {
      this.hasSave = Patch.checkSave()
      this.menu.list[1].show = Patch.loopData.load !== false && this.hasSave
    },
    save(id) {
      console.log('save', id)
      Patch.save(id)
      this.showMenu()
    },
    load(id) {
      this.show = false
      Components.Loading.loadingShow()
      setTimeout(() => {
        DataManager.loadGame(id)
          .then(() => {
            Patch.startWait()
            $gameTemp.reserveCommonEvent(98)
            SceneManager.goto(Scene_Map)
            $gameSystem.onAfterLoad()
            Components.Loading.loadingHide()
            Patch.showTip()
            Patch.stopWait()
          })
          .catch(() => {
            Methods.showPopup('Load failed', '读取失败', 1500)
            Components.Loading.loadingHide()
            this.show = true
          })
      }, 300)
    },
    checkInput(buttonName) {
      if (!this.show) return
      if (buttonName === 'escape') {
        this.back()
        return
      }
      if (Components?.Popup?.isShow) {
        Methods.hidePopup()
        return
      }
      if (Components.Choice.show) {
        Components.Choice.checkInput(buttonName)
      } else if (this.$refs?.Save?.isShow) {
        this.$refs.Save.checkInput(buttonName)
      } else if (this.item) {
        this.$refs.Item.checkInput(buttonName)
      } else if (this.$refs?.Setting?.show) {
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
            if (Components.Choice.show) return
            SoundManager.playOk()
            this.menu.list[this.menu.current].fn.call(this)
            break
        }
      }
    },
    // 通常
    findIndex(name) {
      return this.menu.list.findIndex(item => {
        return item.cn === name
      })
    },
    up() {
      if (this.menu.current === 0) {
        this.menu.current = this.menu.list.length - 1
      } else {
        --this.menu.current
      }
      if (!this.menu.list[this.menu.current].show) {
        this.up()
      } else {
        SoundManager.playCursor()
      }
    },
    down() {
      if (this.menu.current === this.menu.list.length - 1) {
        this.menu.current = 0
      } else {
        ++this.menu.current
      }
      if (!this.menu.list[this.menu.current].show) {
        this.down()
      } else {
        SoundManager.playCursor()
      }
    },
    back() {
      if (this.show) {
        if (Components.Debug.isShow) {
          Components.Debug.hide()
          this.showMenu()
          return
        }
        if (Components.Choice.show) {
          SoundManager.playCancel()
          Methods.hidePopup()
          Components.Choice.reset()
          return
        }
        if (this.menu.show) {
          Methods.hidePopup()
          this.hideMenu()
          SoundManager.playCancel()
          setTimeout(() => {
            SceneManager.pop()
          }, 200)
          return
        }
        if (this.$refs.Save.isShow) {
          this.$refs.Save.back()
          return
        }
        if (this.item) {
          SoundManager.playCancel()
          this.item = false
          this.showMenu()
          return
        }
        if (this.$refs?.Setting.show) {
          this.$refs.Setting.back()
          return
        }
      }
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
    async menuShowAnime() {
      await this.$nextTick()
      anime({
        targets: '.game-menu-btn',
        translateX: ['-100%', 0],
        easing: 'easeInOutQuad',
        duration: 300,
        delay: anime.stagger(50)
      })
    },
    setTime() {
      if (this.menu.show) {
        this.time = $gameSystem.playtime()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
$pink = rgba(255, 176, 170, 0.9)

.menu
  position absolute
  top 120px
  left 0px
  display flex
  flex-direction column
  justify-content space-around

  .btn
    box-sizing border-box
    overflow hidden
    position relative
    display flex
    flex-direction column
    justify-content center
    padding 0 10px
    margin 10px 0
    width 100px
    height 50px
    text-align left
    color #fff
    background rgba(40, 40, 40, 0.7)
    border 2px solid $pink
    border-left none
    border-top-right-radius 10px
    border-bottom-right-radius 10px
    transition width 0.3s, padding 0.3s, background 0.3s

    div
      z-index 2

    .cn
      font-size 20px
      line-height 20px
      margin-top 5px

    .en
      font-size 16px
      line-height 16px

  .time
    box-sizing border-box
    text-align left
    color #fff
    background rgba(40, 40, 40, 0.7)
    border 2px solid $pink
    border-left none
    border-top-right-radius 10px
    border-bottom-right-radius 10px
    font-size 14px
    min-width 100px
    width min-content
    padding 0 10px
    margin 10px 0

.highlight
  padding-left 30px !important
  width 120px !important
  background rgba(255, 176, 170, 0.9) !important

.btn-enter, .btn-leave-to
  height 0 !important
  margin 0px !important
  opacity 0

.btn-enter-to, .btn-leave
  height 50px !important
  margin 10px 0 !important
  opacity 1

.btn-enter-active, .btn-leave-active
  transition all 0.3s !important

.slide-right-enter, .slide-right-leave-to
  transform translateX(-100%)

.slide-right-enter-to, .slide-right-leave
  transform translateX(0)

.slide-right-enter-active, .slide-right-leave-active
  transition all 0.3s ease

.slide-left-enter-to, .slide-left-leave
  transform translateX(0)

.slide-left-enter, .slide-left-leave-to
  transform translateX(100%)

.slide-left-enter-active
  transition all 0.3s
  transition-delay 0.1s

.slide-left-leave-active
  transition all 0.3s

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s
</style>