<template>
  <div id="game-menu">
    <transition name="fade">
      <div v-if="show">
        <transition name="slide-up" appear>
          <div class="menu" v-if="menu.show">
            <template v-for="(item, index) in menu.list">
              <div class="btn" v-if="item.show" :key="index">
                <div
                  :class="{
                    'menu-highlight': item.cn === menu.list[menu.current].cn
                  }"
                >
                  <div class="cn">{{ item.cn }}</div>
                  <div class="en">{{ item.en }}</div>
                </div>
              </div>
            </template>
          </div>
        </transition>
        <Item ref="Item"></Item>
        <Setting ref="Setting" @back="showMenu"></Setting>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  components: {
    Item: VueMain.loadComponent('Common/ItemList'),
    Setting: VueMain.loadComponent('Common/Setting')
  },
  data: () => ({
    show: false,
    hasSave: false,
    tip: {
      en: '',
      cn: ''
    },
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
              Methods.showChoice('Do you wish to overwrite this save file', '是否覆盖存档', () => {
                Patch.save()
                this.checkSave()
              })
            } else {
              Patch.save()
              this.checkSave()
            }
          }
        },
        {
          show: false,
          cn: '读取',
          en: 'Load',
          fn() {
            Methods.showChoice('Do you wish to load this save file', '是否读取存档', () => {
              this.show = false
              Components.Loading.loadingShow()
              setTimeout(() => {
                if (DataManager.loadGame(1)) {
                  Patch.startWait()
                  // $gameTemp.reserveCommonEvent(98)
                  SceneManager.goto(Scene_Map)
                  $gameSystem.onAfterLoad()
                  setTimeout(() => {
                    this.show = false
                    Patch.showTip()
                    Components.Loading.loadingHide()
                    Patch.stopWait()
                  }, 300)
                } else {
                  Methods.showPopup('Load failed', '读取失败', 1000)
                }
              }, 300)
            })
          }
        },
        {
          show: true,
          cn: '物品栏',
          en: 'Item',
          fn() {
            this.hideMenu()
            this.$refs.Item.show()
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
          cn: '退出',
          en: 'Exit',
          fn() {
            Methods.showChoice('Do you wish back to title', '是否返回主菜单', () => {
              AudioManager.stopBgm()
              AudioManager.stopBgs()
              SceneManager.goto(Scene_Title)
            })
          }
        }
      ]
    }
  }),
  computed: {
    tipShow() {
      return this.show && this.menu.show && (this.tip.en || this.tip.cn)
    }
  },
  watch: {
    show() {
      if (this.show) {
        this.init()
      }
    },
    hasSave() {
      this.menu.list[1].show = this.hasSave
    },
    tipShow() {
      if (this.tipShow) {
        Patch.showTip(0)
      } else {
        Methods.hideTip()
      }
    }
  },
  methods: {
    init() {
      this.checkSave()
      if ($gameSystem && $gameSystem.tipData) {
        this.tip.en = $gameSystem.tipData.en
        this.tip.cn = $gameSystem.tipData.cn
      }
      this.menu.current = 0
      this.showMenu()
    },
    checkSave() {
      this.hasSave = Patch.checkSave()
    },
    checkInput(buttonName) {
      if (!this.show) return
      if (buttonName === 'escape') {
        this.back()
        return
      }
      if (Components.Popup.isShow) {
        Methods.hidePopup()
        return
      }
      if (Components.Choice.show) {
        Components.Choice.checkInput(buttonName)
      } else if (this.$refs.Item.isShow) {
        this.$refs.Item.checkInput(buttonName)
      } else if (this.$refs.Setting.show) {
        this.$refs.Setting.checkInput(buttonName)
      } else {
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
      }
    },
    back() {
      if (this.show) {
        if (Components.Choice.show) {
          Methods.hidePopup()
          Components.Choice.reset()
          return
        }
        if (this.menu.show) {
          Methods.hidePopup()
          this.hideMenu()
          setTimeout(() => {
            SceneManager.pop()
          }, 200)
          return
        }
        if (this.$refs.Item.isShow) {
          this.$refs.Item.hide()
          this.showMenu()
          return
        }
        if (this.$refs.Setting.show) {
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.menu
  position absolute
  bottom 60px
  left 0
  width 100%
  display flex
  justify-content space-around
  background rgba(65, 65, 65, 0.6)

  .btn
    overflow hidden
    position relative
    display flex
    flex-direction column
    align-items center
    justify-content center
    padding 0 10px
    color #000
    height 50px
    text-align center
    color #fff
    text-shadow rgba(0, 0, 0, 0.7) 0px 0px 1px, rgba(0, 0, 0, 0.7) 0px 0px 1px, rgba(0, 0, 0, 0.7) 0px 0px 1px

    div
      z-index 2

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

.slide-up-enter-active, .slide-up-leave-active
  transition all 0.3s

.slide-up-enter, .slide-up-leave-to
  bottom -70px !important
  opacity 0.5

.slide-up-enter-to, .slide-up-leave
  bottom 60px !important
  opacity 1

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s

.switch-enter-active, .switch-leave-active
  transition all 0.3s

.switch-enter
  transform translateX(-100%)

.switch-leave-to
  transform translateX(100%)

.switch-enter-to, .switch-leave
  transform translateX(0)
</style>
