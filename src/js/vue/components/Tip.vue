<template>
  <div class="tip-wrapper">
    <transition name="slide-down">
      <div class="tip" :style="{ padding: `${5 * scale - 1}px ${10 * scale}px`, borderWidth: `${4 * scale}px` }" v-if="show">
        <div
          class="en"
          :style="{ fontSize: `${fontSize * 0.5}px`, lineHeight: `${fontSize * 0.5}px` }"
        >{{ enText }}</div>
        <div
          class="cn"
          :style="{ marginTop: `${5 * scale}px`, fontSize: `${fontSize * 0.6}px`, lineHeight: `${fontSize * 0.6}px` }"
        >{{ cnText }}</div>
        <div class="left" :style="{ width: `${4 * scale}px` }"></div>
        <div class="right" :style="{ width: `${4 * scale}px` }"></div>
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
    enText: '',
    cnText: ''
  }),
  methods: {
    showTip(en, cn, time, menu) {
      if (!en || !cn) return

      this.enText = en
      this.cnText = cn

      if (!menu && $gameSystem && $gameSystem.tipData) {
        $gameSystem.tipData.show = true
        $gameSystem.tipData.en = en
        $gameSystem.tipData.cn = cn
        $gameSystem.tipData.time = time
      }

      this.clearTimer()
      this.show = true
      if (time) {
        this.timer = setTimeout(() => {
          this.hideTip()
        }, time)
      }
    },
    hideTip() {
      this.clearTimer()
      this.show = false
    },
    clear() {
      this.show = false
      this.enText = ''
      this.cnText = ''
      if ($gameSystem && $gameSystem.tipData) {
        $gameSystem.tipData.show = false
        $gameSystem.tipData.en = ''
        $gameSystem.tipData.cn = ''
        $gameSystem.tipData.time = 2000
      }
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    }
  },
  created() {
    this.timer = null
  }
}
</script>

<style lang="stylus" scoped>
.tip-wrapper
  .tip
    position absolute
    top 10px
    left 50%
    transform translateX(-50%)
    text-align center
    border-style solid none
    border-top-color #ffa6ca
    border-bottom-color #ffa6ca
    background rgba(0,0,0,0.6)
    color #fff

  .left
    position: absolute
    height: calc(100% + 1px)
    left: 0
    top: -0.5px
    background: #a6d4ff
  .right
    position: absolute
    height: calc(100% + 1px)
    right: 0
    top: -0.5px
    background: #a6d4ff

.slide-down-enter, .slide-down-leave-to
  top -50px !important
  opacity 0 !important

.slide-down-enter-to, .slide-down-leave
  top 10px !important
  opacity 1 !important

.slide-down-enter-active, .slide-down-leave-active
  transition all 0.3s ease-out
</style>
