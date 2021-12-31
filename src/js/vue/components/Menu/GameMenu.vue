<template>
  <div id="game-menu">
    <transition name="fade2">
      <div class="loading" v-if="loading">Loading···</div>
    </transition>
    <transition name="slide-down">
      <div class="tip" v-if="tipShow">
        <div class="en">{{ tip.en }}</div>
        <div class="cn">{{ tip.cn }}</div>
        <div class="left"></div>
        <div class="right"></div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="show">
        <transition name="fade">
          <div class="choice" v-if="choice.show">
            <div class="en">{{ choice.en }}</div>
            <div class="cn">{{ choice.cn }}</div>
            <div class="key-list">
              <div class="key" :class="{ highlight: choice.current }">Yes</div>
              <div class="key" :class="{ highlight: !choice.current }">No</div>
            </div>
          </div>
        </transition>
        <transition name="slide-up" appear>
          <div class="menu" v-if="menu.show">
            <div v-for="(item, index) in menu.list" :key="index" class="btn">
              <transition name="fade">
                <div
                  v-if="item.show"
                  :class="{
                    'menu-highlight': item.cn === menu.list[menu.current].cn
                  }"
                >
                  <div class="cn">{{ item.cn }}</div>
                  <div class="en">{{ item.en }}</div>
                </div>
              </transition>
            </div>
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
    Setting: VueMain.loadComponent('Common/Setting')
  },
  data: () => ({
    show: false,
    loading: false,
    hasSave: false,
    tip: {
      en: '',
      cn: ''
    },
    choice: {
      show: false,
      current: true,
      en: '',
      cn: '',
      fn: () => {}
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
              this.showChoice(
                'Do you wish to overwrite this save file',
                '是否覆盖存档',
                () => {
                  Patch.save()
                  this.checkSave()
                }
              )
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
            this.showChoice(
              'Do you wish to load this save file',
              '是否读取存档',
              () => {
                this.loading = true
                setTimeout(() => {
                  if (DataManager.loadGame(1)) {
                    Patch.startWait()
                    this.menu.show = false
                    // $gameTemp.reserveCommonEvent(98)
                    SceneManager.goto(Scene_Map)
                    $gameSystem.onAfterLoad()
                    setTimeout(() => {
                      this.show = false
                      Patch.showTip()
                      Patch.stopWait()
                      this.loading = false
                    }, 300)
                  } else {
                    Methods.showPopup('Load failed', '读取失败', 1000)
                  }
                }, 300)
              }
            )
          }
        },
        {
          show: true,
          cn: '设置',
          en: 'Setting',
          fn() {
            this.menu.show = false
            this.$refs.Setting.show = true
          }
        },
        {
          show: true,
          cn: '退出',
          en: 'Exit',
          fn() {
            this.showChoice(
              'Do you wish back to title',
              '是否返回主菜单',
              () => {
                AudioManager.stopBgm()
                AudioManager.stopBgs()
                SceneManager.goto(Scene_Title)
              }
            )
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
      this.menu.show = true
    },
    checkSave() {
      this.hasSave = fs.existsSync(StorageManager.localFilePath(1))
    },
    checkInput(buttonName) {
      if (!this.show) return
      if (buttonName === 'escape') {
        this.back()
        return
      }
      if (this.choice.show) {
        switch (buttonName) {
          case 'left':
            this.changeChoice()
            break
          case 'right':
            this.changeChoice()
            break
          case 'up':
            this.changeChoice()
            break
          case 'down':
            this.changeChoice()
            break
          case 'ok':
            this.choiceKeyDown()
            break
        }
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
            if (this.choice.show) return
            this.menu.list[this.menu.current].fn.call(this)
            break
        }
      }
    },
    showChoice(en, cn, fn) {
      if ((en || cn) && fn) {
        this.choice.en = en
        this.choice.cn = cn
        this.choice.fn = fn
        this.choice.show = true
      }
    },
    // 选择框
    changeChoice() {
      this.choice.current = !this.choice.current
    },
    choiceKeyDown() {
      if (this.choice.current) {
        this.back()
        this.choice.fn()
        this.choice.fn = () => {}
      } else {
        this.back()
        this.choice.fn = () => {}
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
        if (this.choice.show) {
          Methods.hidePopup()
          this.choice.show = false
          this.choice.current = true
          return
        }
        if (this.menu.show) {
          Methods.hidePopup()
          this.menu.show = false
          setTimeout(() => {
            SceneManager.pop()
          }, 200)
          return
        }
        if (this.$refs.Setting.show) {
          this.$refs.Setting.back()
          return
        }
      }
    },
    showMenu() {
      this.menu.show = true
    }
  }
}
</script>

<style lang="stylus" scoped>
.loading
  z-index 110
  display flex
  justify-content center
  align-items center
  position absolute
  inset 0
  color #fff
  background #000

.tip
  position absolute
  top 10px
  left 50%
  padding 5px 10px
  transform translateX(-50%)
  text-align center
  border-width 4px
  border-style solid none
  border-top-color #ffa6ca
  border-bottom-color #ffa6ca
  background rgba(0, 0, 0, 0.6)
  color #fff

  .en
    font-size 20px
    line-height 20px

  .cn
    margin-top 5px
    font-size 22px
    line-height 22px

  .left
    position absolute
    height calc(100% + 1px)
    left 0
    top -0.5px
    width 4px
    background #a6d4ff

  .right
    position absolute
    height calc(100% + 1px)
    right 0
    top -0.5px
    width 4px
    background #a6d4ff

.choice
  z-index 20
  color #fff
  position absolute
  left 50%
  top 50%
  background rgba(0, 0, 0, 0.7)
  transform translate(-50%, -50%)
  padding 5px
  text-align center

  .en
    font-size 16px
    line-height 16px
    padding-top 2px
    white-space pre

  .cn
    font-size 20px
    line-height 20px

  .key-list
    margin-top 5px

    .key
      padding 5px
      font-size 14px
      line-height 14px

.menu
  position absolute
  bottom 60px
  left 0
  width 100%
  display flex
  justify-content space-around
  background rgba(255, 255, 255, 0.5)

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

.highlight
  background rgba(0, 0, 0, 0.5)

.menu-highlight
  & > *
    color #fff
    text-shadow #000 0px 0 2px, #000 0px 0 2px, #000 0px 0 2px, #000 0px 0 2px

.slide-down-enter, .slide-down-leave-to
  top -50px !important
  opacity 0 !important

.slide-down-enter-to, .slide-down-leave
  top 10px !important
  opacity 1 !important

.slide-up-enter-active, .slide-up-leave-active
  transition all 0.3s

.slide-up-enter, .slide-up-leave-to
  bottom -50px !important
  opacity 0.5

.slide-up-enter-to, .slide-up-leave
  bottom 60px !important
  opacity 1

.slide-down-enter-active, .slide-down-leave-active
  transition all 0.3s ease-out

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s

.fade2-enter, .fade2-leave-to
  opacity 0

.fade2-enter-to, .fade2-leave
  opacity 1

.fade2-enter-active, .fade2-leave-active
  transition opacity 0.2s linear

.switch-enter-active, .switch-leave-active
  transition all 0.3s

.switch-enter
  transform translateX(-100%)

.switch-leave-to
  transform translateX(100%)

.switch-enter-to, .switch-leave
  transform translateX(0)
</style>
