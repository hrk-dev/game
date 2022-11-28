<template>
  <div>
    <transition name="fade">
      <div class="chapter" v-if="isShow">
        <div class="text">
          <span>Chapter</span>
          <transition :name="transition" @after-enter="setEnd" @after-leave="setEnd">
            <span class="number" v-if="!flag">{{ getNumber(next_1) }}</span>
          </transition>
          <transition :name="transition">
            <span class="number" v-if="flag">{{ getNumber(next_2) }}</span>
          </transition>
          <!-- <div class="arrow" v-show="!anime">_</div> -->
        </div>
        <div class="tip" v-show="!anime">Select</div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    anime: false,
    skip: false,
    isShow: false,
    flag: true,
    end: true,
    next_1: 0,
    next_2: 1,
    transition: 'slide-up-text'
  }),
  methods: {
    show(anime, skip) {
      this.skip = skip
      if (anime) {
        this.anime = anime
        this.setNext(Number(Patch.loopData.next) - 1)
      } else {
        this.setNext(Patch.loopData.next)
      }
      this.isShow = true
      if (anime) {
        setTimeout(() => {
          this.setNext(Patch.loopData.next)
          setTimeout(() => {
            this.hide()
          }, 1000)
        }, 500)
      }
    },
    hide() {
      this.isShow = false
      this.anime = false
      setTimeout(() => {
        this.$emit('back', this.skip)
      }, 300)
    },
    getNumber(num) {
      switch (num) {
        case 3:
          return 3.5
        case 4:
          return 4
        case 5:
          return 0
        default:
          return  num + 1
      }
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
      if (this.anime) return
      switch (buttonName) {
        case 'left':
          this.down()
          break
        case 'right':
          this.up()
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
          this.hide()
          break
      }
    },
    async down() {
      if (!this.end) return
      this.end = false

      this.transition = 'slide-down-text'
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
    async up() {
      if (!this.end) return
      this.end = false

      this.transition = 'slide-up-text'
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
  },
  created() {
    // this.show(true)
  }
}
</script>

<style lang="stylus" scoped>
.chapter
  z-index 90
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
      margin-left 15px

    .arrow
      position absolute
      bottom 0
      left -45px

  .tip
    position absolute
    bottom 5px
    left 50%
    transform translateX(-50%)
    font-size 12px
    line-height 15px
    border 1px solid
    padding 2px 5px
    border-radius 5px
    animation fade 0.8s linear alternate infinite

.slide-up-text-enter-active
  transition all 0.35s
  transition-delay 0.1s

.slide-up-text-leave-active
  transition all 0.35s

.slide-up-text-enter-to, .slide-up-text-leave
  bottom 0px !important
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
  bottom 0px !important
  opacity 1

.slide-down-text-enter
  bottom 40px !important
  opacity 0

.slide-down-text-leave-to
  bottom -40px !important
  opacity 0
</style>
