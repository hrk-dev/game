<template>
  <div>
    <transition name="fade">
      <div class="setting-wrapper" v-if="show">
        <div class="setting-frame">
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
                <div class="switch" :class="{ highlight: current === 0 }">
                  <transition name="switch">
                    <div v-if="keepRunning">
                      <div>○</div>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-if="!keepRunning">
                      <div>×</div>
                    </div>
                  </transition>
                </div>
              </div>
              <div class="item">
                <div class="text">
                  <div class="cn">背景音量</div>
                  <div class="en">BGM Volume</div>
                </div>
                <div class="slider" :class="{ highlight: current === 1 }">
                  <div
                    v-for="i in 10"
                    :key="'bgm' + i"
                    class="block"
                    :style="{
                      background: i <= bgm ? '#fff' : ''
                    }"
                  ></div>
                </div>
                <div class="percent">{{ _bgm }}%</div>
              </div>
              <div class="item">
                <div class="text">
                  <div class="cn">特效音量</div>
                  <div class="en">Sound Effect Volume</div>
                </div>
                <div class="slider" :class="{ highlight: current === 2 }">
                  <div
                    v-for="i in 10"
                    :key="'bgm' + i"
                    class="block"
                    :style="{
                      background: i <= se ? '#fff' : ''
                    }"
                  ></div>
                </div>
                <div class="percent">{{ _se }}%</div>
              </div>
            </div>
            <div class="back">
              <div class="back-btn" :class="{ highlight: current === 3 }">
                返回
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    show: false,
    current: 0,
    keydown: 0,
    keepRunning: false,
    bgm: 0,
    se: 0
  }),
  computed: {
    _bgm() {
      return this.bgm * 10
    },
    _se() {
      return this.se * 10
    }
  },
  watch: {
    show() {
      if (this.show) {
        Methods.hidePopup()
        this.init()
      }
    },
    bgm() {
      AudioManager.bgmVolume = this._bgm
      AudioManager.bgsVolume = this._bgm
    },
    se() {
      AudioManager.seVolume = this._se
      AudioManager.meVolume = this._se
    }
  },
  methods: {
    init() {
      this.keepRunning = ConfigManager.alwaysDash
      this.bgm = AudioManager.bgmVolume / 10
      this.se = AudioManager.seVolume / 10
    },
    checkInput(buttonName) {
      if (!this.show) return
      switch (buttonName) {
        case 'left':
          if (this.current === 1) {
            this.bgmDown()
          } else if (this.current === 2) {
            this.seDown()
          }
          break
        case 'right':
          if (this.current === 1) {
            this.bgmUp()
          } else if (this.current === 2) {
            this.seUp()
          }
          break
        case 'up':
          if (this.current === 0) {
            this.current = 3
          } else {
            --this.current
          }
          break
        case 'down':
          if (this.current === 3) {
            this.current = 0
          } else {
            ++this.current
          }
          break
        case 'ok':
          this.onKeydown()
          break
        case 'escape':
          this.back()
          break
      }
    },
    onKeydown() {
      switch (this.current) {
        case 0:
          this.changeKeepRunning()
          break
        case 1:
          if (this.bgm === 10) {
            this.bgm = 0
          } else {
            ++this.bgm
          }
          break
        case 2:
          if (this.se === 10) {
            this.se = 0
          } else {
            ++this.se
          }
          break
        case 3:
          this.back()
          break
      }
    },
    changeKeepRunning() {
      this.keepRunning = !this.keepRunning
      ConfigManager.alwaysDash = this.keepRunning
    },
    setBgm(vol) {
      this.bgm = vol
    },
    bgmUp() {
      if (this.bgm === 10) return
      ++this.bgm
    },
    bgmDown() {
      if (this.bgm === 0) return
      --this.bgm
    },
    setSe(vol) {
      this.se = vol
    },
    seUp() {
      if (this.se === 10) return
      ++this.se
    },
    seDown() {
      if (this.se === 0) return
      --this.se
    },
    back() {
      if (!this.show) return
      ConfigManager.save()
      this.current = 0
      this.show = false
      this.$emit('back')
    }
  }
}
</script>

<style scoped lang="stylus">
.setting-wrapper
  position absolute
  inset 0

  .setting-frame
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
            overflow hidden
            position relative
            font-size 60px
            width 45px
            height 45px
            padding 2px

            div
              position absolute
              inset 0
              display flex
              align-items center
              justify-content center

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
              transition background 0.2s linear

          .percent
            font-size 25px
            text-align right
            width 70px

      .back
        height 30px
        font-size 22px
        line-height 22px

        .back-btn
          display inline-block
          padding 5px

.highlight
  animation highlight-blinks 1s linear infinite alternate

.fade-enter-active, .fade-leave-active
  transition opacity 0.5s

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.switch-enter-active, .switch-leave-active
  transition all 0.3s

.switch-enter
  transform translateX(-100%)

.switch-leave-to
  transform translateX(100%)

.switch-enter-to, .switch-leave
  transform translateX(0)

@keyframes highlight-blinks
  from
    background rgba(255, 255, 255, 0.5)

  to
    background transparent
</style>
