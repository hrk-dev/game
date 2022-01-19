<template>
  <div id="popup">
    <transition :name="animation">
      <div class="tip" v-if="isShow">
        <div class="en">
          <div
            class="word"
            v-for="(i, index) in en"
            :key="'en' + index"
            :style="{
              animationDelay: `${(index + 1) * 0.03}s`
            }"
            v-html="i"
          ></div>
        </div>
        <div class="cn">
          <div
            class="word"
            v-for="(i, index) in cn"
            :key="'cn' + index"
            :style="{
              animationDelay: `${(index + 1) * 0.1}s`
            }"
            v-html="i"
          ></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    isShow: false,
    en: '',
    cn: '',
    animation: 'fade'
  }),
  methods: {
    show(en, cn, time) {
      this.animation = 'fade'
      return new Promise(resolve => {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        this.isShow = true
        this.en = en
        this.cn = cn
        if (time) {
          this.timer = setTimeout(() => {
            this.isShow = false
            resolve()
          }, Math.max(this.en.length * 30, this.cn.length * 100) + time)
        } else {
          resolve()
        }
      })
    },
    hide() {
      this.animation = ''
      this.isShow = false
    }
  },
  created() {
    this.timer = null
  }
}
</script>

<style scoped lang="stylus">
.tip
  z-index 123
  color #fff
  position absolute
  left 50%
  top 50%
  background rgba(0, 0, 0, 0.6)
  transform translate(-50%, -50%)
  padding 5px
  text-align center
  padding 10px 25px 15px 30px
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

  .en, .cn
    display flex
    justify-content center

    .word
      opacity 0
      animation text-blinks 0.2s
      animation-fill-mode forwards

  .en
    font-size 16px
    line-height 16px
    padding-top 2px
    white-space pre

  .cn
    margin-top 3px
    font-size 20px
    line-height 20px

.fade-enter-active, .fade-leave-active
  transition opacity 0.5s

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

@keyframes text-blinks
  from
    opacity 0

  to
    opacity 1
</style>
