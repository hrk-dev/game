<template>
  <div id="move-tip">
    <transition name="slide-up">
      <div class="move-tip" v-if="showTip">
        <div class="en">{{ en }}</div>
        <div class="cn">{{ cn }}</div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
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
#move-tip
  .move-tip
    z-index 10
    position absolute
    left 0
    bottom 0
    width 100%
    padding 10px 0 15px 0
    color #fff
    background rgba(0, 0, 0, 0.8)
    display flex
    flex-direction column
    justify-content center
    align-items center

    .en
      font-size 18px
      line-height 18px

    .cn
      font-size 22px
      line-height 24px

.slide-up-enter, .slide-up-leave-to
  bottom -50px !important
  opacity 0 !important

.slide-up-enter-to, .slide-up-leave
  bottom 0 !important
  opacity 1 !important

.slide-up-enter-active, .slide-up-leave-active
  transition all 0.3s ease-out
</style>
