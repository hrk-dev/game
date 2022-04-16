<template>
  <div id="tip">
    <transition name="slide-left">
      <div class="tip" v-if="show" ref="tip">
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
  computed: {
    height() {
      return this.$refs?.tip?.offsetHeight || 50
    }
  },
  methods: {
    showTip(en, cn, time, other) {
      if (!en && !cn) return

      this.enText = en || ''
      this.cnText = cn || ''

      if (!$gameSystem.tipData) {
        $gameSystem.tipData = {}
      }
      if (other) {
        $gameSystem.tipData.en_2 = en
        $gameSystem.tipData.cn_2 = cn
      } else {
        $gameSystem.tipData.show = true
        $gameSystem.tipData.en = en
        $gameSystem.tipData.cn = cn
        $gameSystem.tipData.time = time || 3000
      }

      time = time ?? 3000

      this.clearTimer()
      this.show = true
      if (time) {
        this.timer = setTimeout(() => {
          this.hideTip()
        }, time)
      }
    },
    tempTip(en, cn, time) {
      if (!en && !cn) return

      this.enText = en || ''
      this.cnText = cn || ''

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
    clear(other) {
      this.show = false
      this.enText = ''
      this.cnText = ''
      if ($gameSystem && $gameSystem.tipData) {
        if (other) {
          $gameSystem.tipData.en_2 = ''
          $gameSystem.tipData.cn_2 = ''
        } else {
          $gameSystem.tipData.show = false
          $gameSystem.tipData.en = ''
          $gameSystem.tipData.cn = ''
          $gameSystem.tipData.time = 3000
        }
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
    z-index 50
    position absolute
    top 60px
    right 0
    padding 5px 10px
    text-align left
    background rgba(40, 40, 40, 0.7)
    color #fff
    width fit-content
    max-width 80%
    min-height 50px
    border 2px solid rgba(255, 176, 170, 0.9)
    border-right none
    border-top-left-radius 10px
    border-bottom-left-radius 10px

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

.slide-left-enter, .slide-left-leave-to
  transform translateX(100%)

.slide-left-enter-to, .slide-left-leave
  transform translateX(0)

.slide-left-enter-active, .slide-left-leave-active
  transition transform 0.3s ease
</style>
