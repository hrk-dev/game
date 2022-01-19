<template>
  <div id="tip">
    <transition name="slide-right">
      <div class="tip" v-if="show">
        <div class="en" v-html="enText"></div>
        <div class="cn" v-html="cnText"></div>
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
      $gameSystem.tipData.time = time || 3000

      time = time ?? 3000

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
    top 20px
    left 0
    padding 5px 30px 5px 10px
    text-align left
    background rgba(110, 110, 110, 0.5)
    color #fff
    width fit-content
    max-width 80%
    clip-path polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0% 100%)
    text-shadow rgba(0, 0, 0, 0.7) 0px 0px 1px, rgba(0, 0, 0, 0.7) 0px 0px 1px, rgba(0, 0, 0, 0.7) 0px 0px 1px

    &:after
      content ''
      position absolute
      width calc(100% + 10px)
      height 100%
      top 0
      left 0
      clip-path polygon(calc(100% - 15px) 0px, 100% 0px, calc(100% - 10px) 100%, calc(100% - 35px) 100%)
      background rgb(248, 200, 191)

  hr
    margin 0 0 5px 0
    visibility hidden

  .en
    font-size 18px
    line-height 20px

  .cn
    margin-top 5px
    font-size 20px
    line-height 22px

.slide-right-enter, .slide-right-leave-to
  transform translateX(-100%)
  opacity 0 !important

.slide-right-enter-to, .slide-right-leave
  transform translateX(0)
  opacity 0.5 !important

.slide-right-enter-active, .slide-right-leave-active
  transition all 0.3s ease-out
  transition-delay 0.2s
</style>
