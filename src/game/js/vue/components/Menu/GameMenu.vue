<template>
  <div id="game-menu">
    <div v-if="show">
      <!-- 测试 -->
      <transition name="slide-right" appear>
        <div class="test" v-if="test.dev && menu.show">
          <input type="number" min="1" max="99" v-model.number="test.saveID" />
          <button @click="save">save</button>
          <button @click="load">load</button>
        </div>
      </transition>
      <transition name="slide-right" appear>
        <div class="menu" :style="{ top: `${menu.top}px` }" v-if="menu.show">
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
      <transition name="slide-up" appear>
        <div class="character" v-if="menu.show">
          <img :src="menu.img" />
        </div>
      </transition>
      <Item ref="Item"></Item>
      <Setting ref="Setting" @back="showMenu"></Setting>
    </div>
  </div>
</template>

<script>
module.exports = {
  components: {
    Item: VueMain.loadComponent('Common/ItemList'),
    Setting: VueMain.loadComponent('Common/Setting')
  },
  data: () => ({
    // 测试
    test: {
      dev: false,
      saveID: 1
    },
    show: false,
    hasSave: false,
    time: 0,
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
              })
            } else {
              Patch.save()
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
                DataManager.loadGame(1)
                  .then(() => {
                    Patch.startWait()
                    // $gameTemp.reserveCommonEvent(98)
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
            })
          }
        },
        {
          show: true,
          cn: '物品',
          en: 'Item',
          fn() {
            if (this.$refs.Item) {
              this.hideMenu()
              this.$refs.Item.show()
            }
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
          show: true,
          cn: '退出',
          en: 'Exit',
          fn() {
            Methods.showChoice('Do you wish back to title', '是否返回主菜单', () => {
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
    tipShow() {
      return this.show && this.menu.show
    },
    _time() {
      const hour = Math.floor(this.time / 60 / 60)
      const min = Math.floor(this.time / 60) % 60
      const sec = this.time % 60
      return hour.padZero(2) + ':' + min.padZero(2) + ':' + sec.padZero(2)
    }
  },
  watch: {
    // 测试
    saveID() {
      if (this.test.saveID > 99) this.test.saveID = 99
      if (this.test.saveID < 1) this.test.saveID = 1
    },
    show() {
      if (this.show) {
        Patch.startWait()
        this.init()
      } else {
        this.$nextTick(() => {
          Patch.stopWait()
        })
      }
    },
    hasSave() {
      if (this.hasSave) {
        this.menu.list[1].show = this.hasSave
      }
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
      this.menu.top = 60 + (Components?.Tip.$refs?.tip?.scrollHeight || 50) + 10
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
      if (Components?.Popup?.isShow) {
        Methods.hidePopup()
        return
      }
      if (Components.Choice.show) {
        Components.Choice.checkInput(buttonName)
      } else if (this.$refs?.Item?.isShow) {
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
        if (this.$refs?.Item.isShow) {
          this.$refs.Item.hide()
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
    menuShowAnime() {
      this.$nextTick(() => {
        anime({
          targets: '.game-menu-btn',
          translateX: ['-100%', 0],
          easing: 'easeInOutQuad',
          duration: 300,
          delay: anime.stagger(50)
        })
      })
    },
    setTime() {
      if (this.menu.show) {
        this.time = $gameSystem.playtime()
      }
    },
    // 测试
    async save() {
      if (!this.show) return
      Components.Choice.reset()
      $gameSystem.onBeforeSave()
      try {
        await DataManager.saveGame(this.test.saveID + 1)
        Methods.showPopup('Save success', '保存成功', 1000)
      } catch (e) {
        Methods.showPopup('Save failed', '保存失败', 1000)
      }
    },
    load() {
      if (!this.show) return
      Components.Choice.reset()
      this.show = false
      Components.Loading.loadingShow()
      setTimeout(() => {
        DataManager.loadGame(this.test.saveID + 1)
          .then(() => {
            Patch.startWait()
            SceneManager.goto(Scene_Map)
            $gameSystem.onAfterLoad()
            Components.Loading.loadingHide()
            Patch.showTip()
            Patch.stopWait()
          })
          .catch(() => {
            Methods.showPopup('Load failed', '读取失败', 1000)
            Components.Loading.loadingHide()
            this.show = true
          })
      }, 300)
    }
  },
  mounted() {
    if (test || dev) {
      this.test.dev = true
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

.character
  position absolute
  right 0
  bottom 0
  width 350px

  img
    display block
    width 100%

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

// 测试
.test
  position fixed
  bottom 10px
  left 0px
  display flex
  height 40px
  margin 0px
  border-top 2px solid rgba(255, 176, 170, 0.9)
  border-right 2px solid rgba(255, 176, 170, 0.9)
  border-bottom 2px solid rgba(255, 176, 170, 0.9)
  border-left none
  border-top-right-radius 10px
  border-bottom-right-radius 10px
  overflow hidden

  & > *
    color #fff
    background rgba(40, 40, 40, 0.7)
    margin 1px
    border-radius 5px
    border 2px solid rgba(255, 176, 170, 0.9)

  input
    text-align center
</style>