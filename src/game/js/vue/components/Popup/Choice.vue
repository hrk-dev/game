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
        Methods.hidePopup()
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
      this.cn = ''
      this.en = ''
      this.fn = () => {}
      this.cb = () => {}
      this.show = false
      this.current = true
    }
  }
}
</script>

<style lang="stylus" scoped>
$highlight-color = rgba(150, 150, 150, 0.8)
$text-shadow-color = rgba(0, 0, 0, 0.7)

.choice
  z-index 20
  color #fff
  position absolute
  left 50%
  top 50%
  background rgba(0, 0, 0, 0.6)
  transform translate(-50%, -50%)
  padding 5px
  text-align center
  padding 25px 20px 25px 30px
  clip-path polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0% 100%)
  text-shadow $text-shadow-color 0px 0px 1px, $text-shadow-color 0px 0px 1px, $text-shadow-color 0px 0px 1px

  &:before
    content ''
    position absolute
    top 0
    left 0
    height 100%
    width 25px
    clip-path polygon(0px 0px, 100% 0px, calc(100% - 20px) 100%, 0 100%)
    background rgb(117, 214, 249)

  &:after
    content ''
    position absolute
    top 0
    right 0
    height 100%
    width 25px
    clip-path polygon(20px 0px, 100% 0px, calc(100% - 20px) 100%, 0px 100%)
    background rgb(248, 200, 191)

  .en
    font-size 16px
    line-height 16px
    white-space pre

  .cn
    font-size 20px
    line-height 20px
    margin-top 5px

  .key-list
    display flex
    align-items center
    justify-content space-around
    margin-top 20px
    width 100%

    .key
      min-width 40px
      padding 8px 10px
      font-size 14px
      line-height 14px

.highlight
  background linear-gradient(to right, transparent 0%, $highlight-color 10px, $highlight-color calc(100% - 10px), transparent 100%)

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s
</style>
