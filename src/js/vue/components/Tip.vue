<template>
  <div>
    <transition name="slide-down">
      <div class="tip" :style="{ padding: `${2 * scale}px ${10 * scale}px` }" v-if="show">
        <div
          class="en"
          :style="{ fontSize: `${fontSize * 0.5}px`, lineHeight: `${fontSize * 0.5}px` }"
        >{{ enText }}</div>
        <div
          class="cn"
          :style="{ margin: `${5 * scale}px auto`, fontSize: `${fontSize * 0.6}px`, lineHeight: `${fontSize * 0.6}px` }"
        >{{ cnText }}</div>
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
    enText: 'sha',
    cnText: '啥'
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
.tip
  position absolute
  top 5px
  left 50%
  transform translateX(-50%)
  text-align center
  border 1px solid #666
  border-radius 10px
  background #eee

.slide-down-enter, .slide-down-leave-to
  top -50px !important
  opacity 0 !important

.slide-down-enter-to, .slide-down-leave
  top 5px !important
  opacity 1 !important

.slide-down-enter-active, .slide-down-leave-active
  transition all 0.3s ease-out
</style>
