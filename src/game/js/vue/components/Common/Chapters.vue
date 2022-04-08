<template>
  <div>
    <transition name="fade">
      <div class="chapter" v-if="isShow">
        <div class="text">
          Chapter
          <transition :name="transition" @after-enter="setEnd" @after-leave="setEnd">
            <span class="number" v-if="!flag">{{ next_1 }}</span>
          </transition>
          <transition :name="transition">
            <span class="number" v-if="flag">{{ next_2 }}</span>
          </transition>
          <div class="arrow">_</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    isShow: false,
    flag: true,
    end: true,
    next_1: 0,
    next_2: 1,
    transition: 'slide-up-text'
  }),
  methods: {
    show() {
      this.isShow = true
    },
    setNext(next) {
      if (this.flag) {
        this.next_1 = next
      } else {
        this.next_2 = next
      }
      this.flag = !this.flag
    },
    setEnd() {
      this.end = true
    },
    checkInput(buttonName) {
      switch (buttonName) {
        case 'left':
          this.up()
          break
        case 'right':
          this.down()
          break
        case 'up':
          this.up()
          break
        case 'down':
          this.down()
          break
        case 'ok':
          this.isShow = false
          this.$emit('start', (this.flag ? this.next_2 : this.next_1))
          break
        case 'escape':
          this.isShow = false
          this.$emit('back')
          break
      }
    },
    async up() {
      if (!this.end) return
      this.end = false

      this.transition = 'slide-up-text'
      await this.$nextTick()

      let temp = 0
      if (this.flag) {
        temp = this.next_2 - 1
      } else {
        temp = this.next_1 - 1
      }
      if (temp < 0) {
        temp = Patch.loopData.next
      }
      this.setNext(temp)
    },
    async down() {
      if (!this.end) return
      this.end = false

      this.transition = 'slide-down-text'
      await this.$nextTick()

      let temp = 0
      if (this.flag) {
        temp = this.next_2 + 1
      } else {
        temp = this.next_1 + 1
      }
      if (temp > Patch.loopData.next) {
        temp = 0
      }
      this.setNext(temp)
    }
  }
}
</script>

<style lang="stylus" scoped>
.chapter
  display flex
  flex-direction column
  justify-content center
  align-items center
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  background rgba(0, 0, 0, 0.5)
  color #fff

  .text
    position relative
    text-align center
    line-height 50px
    font-size 50px
    padding-right 15px

    .number
      position absolute
      bottom -5px
      margin-left 15px

    .arrow
      position absolute
      bottom 0
      left -45px
      animation fade 0.8s linear alternate infinite

.slide-up-text-enter-active
  transition all 0.35s
  transition-delay 0.1s

.slide-up-text-leave-active
  transition all 0.35s

.slide-up-text-enter-to, .slide-up-text-leave
  bottom -5px !important
  opacity 1

.slide-up-text-enter
  bottom -40px !important
  opacity 0

.slide-up-text-leave-to
  bottom 40px !important
  opacity 0

.slide-down-text-enter-active
  transition all 0.35s
  transition-delay 0.1s

.slide-down-text-leave-active
  transition all 0.35s

.slide-down-text-enter-to, .slide-down-text-leave
  bottom -5px !important
  opacity 1

.slide-down-text-enter
  bottom 40px !important
  opacity 0

.slide-down-text-leave-to
  bottom -40px !important
  opacity 0

@keyframes fade
  from
    opacity 0

  to
    opacity 1
</style>
