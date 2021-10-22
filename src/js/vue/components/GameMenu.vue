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
              >Yes</div>
              <div
                class="key"
                :class="{ highlight: !choice.current }"
                @mouseover="chpiceMouseOver(false)"
                @click="choiceKeyDown"
              >No</div>
            </div>
          </div>
        </transition>
        <transition name="fade">
          <div class="menu" v-if="menu.show">
            <div v-for="(item,index) in menu.list" :key="index">
              <div
                v-if="item.show"
                @click="onKeydown"
                @mouseover="mouseOver(item.cn)"
                :class="{ highlight: item.cn === menu.list[menu.current].cn }"
              >
                <div class="cn">{{ item.cn }}</div>
                <div class="en">{{ item.en }}</div>
              </div>
            </div>
          </div>
        </transition>
        <transition name="fade">
          <div class="setting-wrapper" v-if="setting.show">
            <div class="vertical-frame">
              <div class="title">
                <div>设置 Setting</div>
              </div>
            </div>
            <div class="horizontal-frame">
              <div class="setting">
                <div class="item">
                  <div class="text">
                    <div class="cn">持续奔跑</div>
                    <div class="en">Keep Running</div>
                  </div>
                  <div
                    class="switch"
                    :class="{ higtlight: setting.current === 0 }"
                    @mouseover="settingMouseOver(0)"
                    @click="changeKeepRunning"
                  >{{ setting.keepRunning ? "○" : "×" }}</div>
                </div>
                <div class="item">
                  <div class="text">
                    <div class="cn">背景音量</div>
                    <div class="en">BGM Volume</div>
                  </div>
                  <div
                    class="slider"
                    :class="{ higtlight: setting.current === 1 }"
                    @mouseover="settingMouseOver(1)"
                  >
                    <div
                      v-for="i in 10"
                      :key="'bgm' + i"
                      class="block"
                      :style="{
                        background: i <= setting.bgm ? '#fff' : '',
                      }"
                      @click="setBgm(i)"
                    ></div>
                  </div>
                  <div class="percent">{{ bgm }}%</div>
                </div>
                <div class="item">
                  <div class="text">
                    <div class="cn">特效音量</div>
                    <div class="en">Sound Effect Volume</div>
                  </div>
                  <div
                    class="slider"
                    :class="{ higtlight: setting.current === 2 }"
                    @mouseover="settingMouseOver(2)"
                  >
                    <div
                      v-for="i in 10"
                      :key="'bgm' + i"
                      class="block"
                      :style="{
                        background: i <= setting.se ? '#fff' : ''
                      }"
                      @click="setSe(i)"
                    ></div>
                  </div>
                  <div class="percent">{{ se }}%</div>
                </div>
              </div>
              <div class="back">
                <div
                  class="back-btn"
                  :class="{ higtlight: setting.current === 3 }"
                  @click="back"
                  @mouseover="settingMouseOver(3)"
                >返回</div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    show: false,
    hasSave: false,
    choice: {
      show: false,
      current: true,
      en: '',
      cn: '',
      fn: () => { }
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
      ],
    },
    setting: {
      show: false,
      current: 0,
      keepRunning: false,
      bgm: 0,
      se: 0
    }
  }),
  computed: {
    bgm() {
      return this.setting.bgm * 10
    },
    se() {
      return this.setting.se * 10
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
    bgm() {
      AudioManager.bgmVolume = this.bgm
    },
    se() {
      AudioManager.seVolume = this.se
    }
  },
  methods: {
    init() {
      this.hasSave = fs.existsSync(StorageManager.localFilePath(1))
      this.menu.current = 0
      this.menu.show = true
      this.setting.show = false
      this.setting.keepRunning = ConfigManager.alwaysDash
      this.setting.bgm = AudioManager.bgmVolume / 10
      this.setting.se = AudioManager.seVolume / 10
    },
    checkInput(buttonName) {
      if (!this.show) return
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
          case 'escape':
            this.back()
            break
        }
      } else if (this.setting.show) {
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
          case 'escape':
            this.back()
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
          case 'escape':
            SceneManager.pop()
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
        this.choice.fn = () => { }
      } else {
        this.back()
        this.choice.fn = () => { }
      }
    },
    // 设置
    settingMouseOver(id) {
      this.setting.current = id
    },
    settingUp() {
      if (!this.setting.show) return
      if (this.setting.current === 0) {
        this.setting.current = 3
      } else {
        --this.setting.current
      }
    },
    settingDown() {
      if (this.setting.current === 3) {
        this.setting.current = 0
      } else {
        ++this.setting.current
      }
    },
    settingLeft() {
      if (this.setting.current === 1) {
        this.bgmDown()
      } else if (this.setting.current === 2) {
        this.seDown()
      }
    },
    settingRight() {
      if (this.setting.current === 1) {
        this.bgmUp()
      } else if (this.setting.current === 2) {
        this.seUp()
      }
    },
    settingKeyDown() {
      switch (this.setting.current) {
        case 0:
          this.changeKeepRunning()
          break
        case 1:
          if (this.setting.bgm === 10) {
            this.setting.bgm = 0
          } else {
            ++this.setting.bgm
          }
          break
        case 2:
          if (this.setting.se === 10) {
            this.setting.se = 0
          } else {
            ++this.setting.se
          }
          break
        case 3:
          this.back()
          break
      }
    },
    changeKeepRunning() {
      this.setting.keepRunning = !this.setting.keepRunning
      ConfigManager.alwaysDash = this.setting.keepRunning
    },
    setBgm(vol) {
      this.setting.bgm = vol
    },
    bgmUp() {
      if (this.setting.bgm === 10) return
      ++this.setting.bgm
    },
    bgmDown() {
      if (this.setting.bgm === 0) return
      --this.setting.bgm
    },
    setSe(vol) {
      this.setting.se = vol
    },
    seUp() {
      if (this.setting.se === 10) return
      ++this.setting.se
    },
    seDown() {
      if (this.setting.se === 0) return
      --this.setting.se
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
            this.showChoice('Do you wish to overwrite this save file', '是否覆盖存档', () => {
              this.save()
            })
          } else {
            Patch.save()
          }
          break
        case 1:
          this.showChoice('Do you wish to load this save file', '是否读取存档', () => {
            if (DataManager.loadGame(1)) {
              SceneManager.goto(Scene_Map)
              $gameSystem.onAfterLoad()
              setTimeout(() => {
                this.show = false
                Patch.showTip()
              }, 200)
            } else {
              VueMain.showPopup('Load failed', '读取失败', 1000)
            }
          })
          break
        case 2:
          this.menu.show = false
          this.setting.show = true
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
          this.choice.show = false
          this.choice.current = true
          return
        }
        if (this.menu.show) {
          VueMain.hidePopup()
          SceneManager.pop()
          return
        }
        if (this.setting.show) {
          ConfigManager.save()
          this.menu.show = true
          this.setting.current = 0
          this.setting.show = false
          return
        }
      }
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
  background rgba(255,255,255,0.5)
  .cn, .en
    display inline-block
    font-size 24px
    line-height 24px
    padding 5px 0

.setting-wrapper
  color #fff
  position absolute
  width 80%
  height 80%
  left 10%
  top 10%
  background rgba(0, 0, 0, 0.7)

  .vertical-frame
    box-sizing border-box
    margin 0 10px
    width calc(100% - 20px)
    height 100%
    border-width 5px
    border-color #75d6f9
    border-style none solid

    .title
      box-sizing border-box
      font-size 24px
      line-height 100%
      padding 5px 15px
      height 45px
      display flex
      flex-direction column
      justify-content center

  .horizontal-frame
    position absolute
    left 0
    bottom 15px
    padding 0 25px
    box-sizing border-box
    width 100%
    height calc(100% - 45px - 15px)
    border-width 5px
    border-color #f8c8bf
    border-style solid none
    display flex
    flex-direction column

    .setting
      flex 1
      display flex
      flex-direction column
      justify-content space-evenly
      padding-left 10px

      .item
        display flex
        align-items center
        width 100%
        height 45px

        .text
          width 250px
          display flex
          flex-direction column
          justify-content center

          .cn
            font-size 22px
            line-height 22px
          .en
            font-size 20px
            line-height 22px

        .switch
          display flex
          align-items center
          justify-content center
          font-size 60px
          line-height 45px
          width 45px
          padding 2px

        .slider
          height 100%
          width 300px
          padding 0 5px
          display flex
          align-items center

          .block
            box-sizing border-box
            margin 3px
            width 10%
            height 55%
            border 1px solid #fff

        .percent
          margin-left 10px
          font-size 25px

    .back
      height 30px
      font-size 22px
      line-height 22px

      .back-btn
        display inline-block
        padding 5px

.tip
  color #fff
  position absolute
  left 50%
  top 50%
  background rgba(0, 0, 0, 0.7)
  transform translate(-50%, -50%)
  padding 5px 10px 10px 10px

  .en, .cn
    display flex
    justify-content center

    .word
      font-size 20px
      line-height 20px
      opacity 0
      animation fade 0.2s
      animation-fill-mode forwards

  .en
    white-space pre

.higtlight
  background rgba(255, 255, 255, 0.5) !important

.highlight
  background rgba(0,0,0,0.5)

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s
</style>
