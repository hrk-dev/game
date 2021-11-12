<template>
  <div id="tip">
    <transition name="slide-down">
      <div class="tip" v-if="show">
        <div class="en">{{ enText }}</div>
        <div class="cn">{{ cnText }}</div>
        <div class="left"></div>
        <div class="right"></div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    show: false,
    enText: '',
    cnText: ''
  }),
  methods: {
    showTip(en, cn, time) {
      if (!en || !cn) return

      this.enText = en
      this.cnText = cn

      if (!$gameSystem.tipData) {
        $gameSystem.tipData = {}
      }
      $gameSystem.tipData.show = true
      $gameSystem.tipData.en = en
      $gameSystem.tipData.cn = cn
      $gameSystem.tipData.time = time

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
#tip
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

.slide-down-enter, .slide-down-leave-to
  top -50px !important
  opacity 0 !important

.slide-down-enter-to, .slide-down-leave
  top 10px !important
  opacity 1 !important

.slide-down-enter-active
  transition all 0.3s ease-out
  transition-delay 0.2s
.slide-down-leave-active
  transition all 0.3s ease-out
</style>
