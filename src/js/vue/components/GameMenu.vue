<template>
  <div id="game-menu">
    <transition name="fade">
      <div v-if="show">
        <transition name="fade">
          <div class="choice" v-if="choice.show">
            <div class="en">{{ choice.en }}</div>
            <div class="cn">{{ choice.cn }}</div>
            <div class="key-list">
              <div
                class="key"
                :class="{ highlight: choice.current }"
                @mouseover="chpiceMouseOver(true)"
                @click="choiceKeyDown"
              >
                Yes
              </div>
              <div
                class="key"
                :class="{ highlight: !choice.current }"
                @mouseover="chpiceMouseOver(false)"
                @click="choiceKeyDown"
              >
                No
              </div>
            </div>
          </div>
        </transition>
        <transition name="fade">
          <div class="menu" v-if="menu.show">
            <div v-for="(item, index) in menu.list" :key="index">
              <transition name="fade">
                <div
                  v-if="item.show"
                  @click="onKeydown"
                  @mouseover="mouseOver(item.cn)"
                  :class="{ highlight: item.cn === menu.list[menu.current].cn }"
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
    Setting: VueMain.loadComponent('common/Setting')
  },
  data: () => ({
    show: false,
    hasSave: false,
    choice: {
      show: false,
      current: true,
      en: '',
      cn: '',
      fn: () => {}
    },
    menu: {
      show: true,
      current: 0,
      list: [
        {
          show: true,
          cn: '保存',
          en: 'Save'
        },
        {
          show: false,
          cn: '读取',
          en: 'Load'
        },
        {
          show: true,
          cn: '设置',
          en: 'Setting'
        },
        {
          show: true,
          cn: '退出',
          en: 'Exit'
        }
      ]
    }
  }),
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
        switch (buttonName) {
          case 'left':
            this.settingLeft()
            break
          case 'right':
            this.settingRight()
            break
          case 'up':
            this.settingUp()
            break
          case 'down':
            this.settingDown()
            break
          case 'ok':
            this.settingKeyDown()
            break
        }
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
            this.onKeydown(this.menu.current)
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
    chpiceMouseOver(flag) {
      this.choice.current = flag
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
    // 设置
    settingUp() {
      if (!this.$refs.Setting.show) return
      if (this.$refs.Setting.current === 0) {
        this.$refs.Setting.current = 3
      } else {
        --this.$refs.Setting.current
      }
    },
    settingDown() {
      if (this.$refs.Setting.current === 3) {
        this.$refs.Setting.current = 0
      } else {
        ++this.$refs.Setting.current
      }
    },
    settingLeft() {
      if (this.$refs.Setting.current === 1) {
        this.$refs.Setting.bgmDown()
      } else if (this.$refs.Setting.current === 2) {
        this.$refs.Setting.seDown()
      }
    },
    settingRight() {
      if (this.$refs.Setting.current === 1) {
        this.$refs.Setting.bgmUp()
      } else if (this.$refs.Setting.current === 2) {
        this.$refs.Setting.seUp()
      }
    },
    settingKeyDown() {
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
    },
    // 通常
    findIndex(name) {
      return this.menu.list.findIndex(item => {
        return item.cn === name
      })
    },
    mouseOver(name) {
      if (this.choice.show) return
      const index = this.findIndex(name)
      if (index !== -1) {
        this.menu.current = index
      }
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
    onKeydown() {
      if (this.choice.show) return
      switch (this.menu.current) {
        case 0:
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
          break
        case 1:
          this.showChoice(
            'Do you wish to load this save file',
            '是否读取存档',
            () => {
              if (DataManager.loadGame(1)) {
                // $gameSwitches.setValue(96, true)
                // $gameSwitches.setValue(98, true)
                SceneManager.goto(Scene_Map)
                $gameSystem.onAfterLoad()
                setTimeout(() => {
                  this.show = false
                  Patch.showTip()
                }, 200)
              } else {
                VueMain.showPopup('Load failed', '读取失败', 1000)
              }
            }
          )
          break
        case 2:
          this.menu.show = false
          this.$refs.Setting.show = true
          break
        case 3:
          this.showChoice('Do you wish back to title', '是否返回主菜单', () => {
            AudioManager.stopBgm()
            AudioManager.stopBgs()
            SceneManager.goto(Scene_Title)
          })
          break
      }
    },
    back() {
      if (this.show) {
        if (this.choice.show) {
          VueMain.hidePopup()
          this.choice.show = false
          this.choice.current = true
          return
        }
        if (this.menu.show) {
          VueMain.hidePopup()
          SceneManager.pop()
          return
        }
        if (this.$refs.Setting.show) {
          this.$refs.Setting.back()
          this.menu.show = true
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
  top 50%
  left 50%
  transform translate(-50%, -50%)
  width 50%
  height 50%
  background rgba(255, 255, 255, 0.5)

  .cn, .en
    display inline-block
    font-size 24px
    line-height 24px
    padding 5px 0

.highlight
  background rgba(0, 0, 0, 0.5)

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
