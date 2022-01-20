<template>
  <div id="game-menu">
    <transition name="fade">
      <div v-if="show">
        <transition name="slide-right" appear>
          <div class="menu" :style="{ top: `${menu.top}px` }" v-if="menu.show">
            <template v-for="(item, index) in menu.list">
              <transition name="btn" :key="index">
                <div
                  class="btn"
                  :class="{
                    'menu-highlight': item.cn === menu.list[menu.current].cn
                  }"
                  v-if="item.show"
                >
                  <div class="en">{{ item.en }}</div>
                  <div class="cn">{{ item.cn }}</div>
                </div></transition
              >
            </template>
          </div>
        </transition>
        <transition name="slide-up" appear>
          <div class="character" v-if="menu.show">
            <img :src="menu.img" />
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
      top: 130,
      current: 0,
      img: md5Url('img/pictures/汐/震惊-思考.png'),
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
                  Components.Loading.loadingHide()
                  Patch.showTip()
                  Patch.stopWait()
                } else {
                  Methods.showPopup('Load failed', '读取失败', 1500)
                  Components.Loading.loadingHide()
                  this.show = true
                }
              }, 300)
            })
          }
        },
        {
          show: true,
          cn: '物品',
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
              Components.Choice.hideChoice()
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
      return this.show && this.menu.show
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
        this.showTip()
      } else {
        Methods.hideTip()
      }
    }
  },
  methods: {
    init() {
      this.showTip()
      this.checkSave()
      // this.menu.current = 0
      this.showMenu()
    },
    async showTip() {
      Patch.showTip(0)
      await this.$nextTick()
      this.menu.top = 60 + (Components.Tip.$refs?.tip?.scrollHeight || 50) + 10
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
          translateX: [-100, 0],
          easing: 'spring(1, 100, 20, 0)',
          duration: 500,
          delay: anime.stagger(60)
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
$pink = rgba(255, 176, 170, 0.9)

.menu
  position absolute
  top 130px
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

.character
  position absolute
  right 0
  bottom 0
  width 350px

  img
    display block
    width 100%

.menu-highlight
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

.slide-up-enter-to, .slide-up-leave
  transform translateY(0)
  opacity 1

.slide-up-enter, .slide-up-leave-to
  transform translateY(100%)
  opacity 0

.slide-up-enter-active, .slide-up-leave-active
  transition all 0.3s

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s
</style>
