<template>
  <div
    class="move-tip-wrapper"
  >
    <transition name="slide-up">
      <div class="move-tip" :style="{ padding: (10 * scale) + 'px'}" v-if="showTip">
        <div :style="{ lineHeight: (fontSize - 12) + 'px', fontSize: (fontSize - 10) + 'px' }">{{ en }}</div>
        <div :style="{ lineHeight: (fontSize - 8) + 'px', fontSize: (fontSize - 6) + 'px' }">{{ cn }}</div>
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
    showTip: false,
    cn: '',
    en: ''
  }),
  methods: {
    show(cn, en) {
      if ((!cn && !en) || (this.cn === cn && this.en === en)) return
      this.cn = cn
      this.en = en
      this.showTip = true
    },
    hide() {
      if (!this.showTip) return
      this.cn = ''
      this.en = ''
      this.showTip = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.move-tip-wrapper
  position absolute
  bottom 0
  left 0
  right 0

  .move-tip
    position absolute
    left 0
    bottom 0
    width 100%
    color #fff
    background rgba(0, 0, 0, 0.8)
    display flex
    flex-direction column
    justify-content center
    align-items center

.slide-up-enter, .slide-up-leave-to
  bottom -50px !important
  opacity 0 !important

.slide-up-enter-to, .slide-up-leave
  bottom 0 !important
  opacity 1 !important

.slide-up-enter-active, .slide-up-leave-active
  transition all 0.3s ease-out
</style>
