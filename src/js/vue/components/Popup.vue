<template>
  <div id="popup">
    <transition name="fade">
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
    cn: ''
  }),
  methods: {
    show(en, cn, time) {
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
  background rgba(0, 0, 0, 0.7)
  transform translate(-50%, -50%)
  padding 5px 10px 10px 10px
  pointer-events none

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
