<template>
  <div class="main-menu">
    <transition name="fade">
      <div v-if="show">
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
                  'menu-higtlight': item.cn === menu.list[menu.current].cn,
                }"
                :style="{
                  flexDirection: item.multiline ? 'column' : '',
                  alignItems: item.multiline ? 'normal' : '',
                  justifyContent: item.multiline ? 'center' : ''
                }"
                :key="index"
                @click="click(item.cn)"
                @mouseover="mouseOver(item.cn)"
              >
                <div
                  class="cn"
                  :style="{
                    fontSize: item.multiline ? '14px' : '',
                    lineHeight: item.multiline ? '14px' : ''
                  }"
                >{{ item.cn }}</div>
                <div
                  class="en"
                  :style="{
                    fontSize: item.multiline ? '12px' : '',
                    lineHeight: item.multiline ? '8px' : '',
                    margin: item.multiline
                      ? '2px 2px 0 2px'
                      : '',
                  }"
                >{{ item.en }}</div>
              </div>
            </template>
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
        <transition name="fade">
          <div class="tip" v-if="tip.show">
            <div class="en">
              <div
                class="word"
                v-for="(i, index) in tip.en"
                :key="'en' + index"
                :style="{
                  animationDelay: `${(index + 1) * 0.03}s`
                }"
                v-html="i"
              ></div>
            </div>
            <div class="cn">
              <div
                class="word"
                v-for="(i, index) in tip.cn"
                :key="'en' + index"
                :style="{
                  animationDelay: `${(index + 1) * 0.1}s`,
                  paddingTop: '2px'
                }"
                v-html="i"
              ></div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  props: {
    fontSize: Number,
    scale: Number
  },
  data: () => ({
    show: false,
    busy: false,
    menu: {
      show: true,
      current: 1,
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
          cn: '测试',
          en: 'Test'
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
    },
    tip: {
      show: false,
      en: '',
      cn: ''
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
    bgm() {
      AudioManager.bgmVolume = this.bgm
    },
    se() {
      AudioManager.seVolume = this.se
    }
  },
  methods: {
    init() {
      this.menu.show = true
      this.menu.current = 1
      this.setting.keepRunning = ConfigManager.alwaysDash
      this.setting.bgm = AudioManager.bgmVolume / 10
      this.setting.se = AudioManager.seVolume / 10
    },
    findIndex(name) {
      this.menu.current = this.menu.list.findIndex(item => {
        return item.cn === name
      })
      return this.menu.current
    },
    click(name) {
      const index = this.findIndex(name)
      if (index !== -1) {
        this.onKeydown(index)
      }
    },
    mouseOver(name) {
      const index = this.findIndex(name)
      if (index !== -1) {
        this.menu.current = index
      }
    },
    settingMouseOver(id) {
      this.setting.current = id
    },
    checkInput(buttonName) {
      if (!this.show || this.busy) return
      switch (buttonName) {
        case 'left':
          if (this.setting.show) {
            if (this.setting.current === 1) {
              this.bgmDown()
            } else if (this.setting.current === 2) {
              this.seDown()
            }
          } else {
            this.up()
          }
          break
        case 'right':
          if (this.setting.show) {
            if (this.setting.current === 1) {
              this.bgmUp()
            } else if (this.setting.current === 2) {
              this.seUp()
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
      } else if (this.setting.show) {
        if (!this.setting.show) return
        if (this.setting.current === 0) {
          this.setting.current = 3
        } else {
          --this.setting.current
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
      } else if (this.setting.show) {
        if (this.setting.current === 3) {
          this.setting.current = 0
        } else {
          ++this.setting.current
        }
      }
    },
    onKeydown() {
      if (this.menu.show) {
        switch (this.menu.current) {
          case 0:
            DataManager.setupNewGame()
            this.menu.show = false
            SceneManager.goto(Scene_Map)
            setTimeout(() => {
              this.show = false
            }, 400)
            break
          case 1:
            if (DataManager.loadGame(1)) {
              this.menu.show = false
              SceneManager.goto(Scene_Map)
              $gameSystem.onAfterLoad()
              setTimeout(() => {
                this.show = false
              }, 400)
            } else {
              this.setTip('Error', '奇怪的错误', 1500)
            }
            break
          case 2:
            this.menu.show = false
            this.setting.show = true
            break
          case 3:
            this.test()
            break
          case 4:
            this.setTip('Not finished', '还没做', 1500)
            break
          case 5:
            SceneManager.exit()
            break
        }
      } else if (this.setting.show) {
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
    back() {
      if (!this.setting.show) return
      ConfigManager.save()
      this.menu.show = true
      this.setting.current = 0
      this.setting.show = false
    },
    test() {
      if (this.menu.restart) {
        this.menu.show = false
        this.setTip('I think you should restart the game', '我觉得你应该重新开始游戏', 1500)
          .then(() => {
            this.menu.show = true
          })
        this.menu.restart = false
      } else {
        this.menu.show = false
        this.setTip('Well, that\'ll have to do', '好吧，那只能这样了', 1500)
          .then(() => {
            for (const i in this.menu.list) {
              if (i > 0) {
                this.menu.list[i].show = false
              }
            }
            this.menu.current = 0
            this.menu.show = true
          })
      }
    },
    setTip(en, cn, time) {
      return new Promise(resolve => {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        this.tip.show = true
        this.tip.en = en
        this.tip.cn = cn
        if (time) {
          this.timer = setTimeout(() => {
            this.tip.show = false
            resolve()
          }, Math.max(this.tip.en.length * 30, this.tip.cn.length * 100) + time)
        } else {
          resolve()
        }
      })
    }
  },
  created() {
    this.timer = null
  }
}
</script>

<style scoped lang="stylus">
.main-menu
  position relative
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
      background linear-gradient(233deg, transparent 25px, #666 0) top right
      background-repeat no-repeat
      color #fff
      height 35px
      font-size 18px

      div
        z-index 2

      .cn
        margin 2px 2px 0 2px
      
      .en
        margin 2px 2px 0 0

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

.menu-higtlight
  color #000 !important
  z-index 2

  &:before
    content ''
    position absolute
    width calc(100% - 35px)
    height calc(100% - 5px)
    bottom 0
    left 5px
    background #ddd
    z-index 1

.higtlight
  background rgba(255, 255, 255, 0.5) !important

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

@keyframes fade
  from
    opacity 0

  to
    opacity 1
</style>
