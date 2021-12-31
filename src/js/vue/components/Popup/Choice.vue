<template>
  <div id="choice">
    <transition name="fade">
      <div class="choice" v-if="show">
        <div class="en">{{ en }}</div>
        <div class="cn">{{ cn }}</div>
        <div class="key-list">
          <div class="key" :class="{ highlight: current }">Yes</div>
          <div class="key" :class="{ highlight: !current }">No</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    show: false,
    current: true,
    en: '',
    cn: '',
    fn: () => {},
    cb: () => {}
  }),
  methods: {
    showChoice(en, cn, fn, cb) {
      if ((en || cn) && fn) {
        this.en = en
        this.cn = cn
        this.fn = fn
        if (cb) this.cb = cb
        this.show = true
      } else {
        console.warn('Choice: 参数错误')
      }
    },
    checkInput(buttonName) {
      if (this.show) {
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
        }
      }
    },
    changeChoice() {
      this.current = !this.current
    },
    choiceKeyDown() {
      if (this.current) {
        this.cb()
        this.fn()
        this.reset()
      } else {
        this.cb()
        this.reset()
      }
    },
    reset() {
      this.fn = () => {}
      this.cb = () => {}
      this.show = false
      this.current = true
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

.highlight
  background rgba(0, 0, 0, 0.5)

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s
</style>
