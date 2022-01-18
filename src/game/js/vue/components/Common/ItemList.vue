<template>
  <div>
    <transition name="fade">
      <div class="item-list-wrapper" v-if="isShow">
        <div class="item-list-frame">
          <div class="item-list" ref="list">
            <div
              class="item"
              v-for="(item, index) in list"
              :key="index"
              :class="{ highlight: current == index }"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="item-info">
            <div class="img">
              <img :src="img" />
            </div>
            <div class="text">{{ text }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    isShow: false,
    list: [],
    current: 0,
    img: '',
    text: ''
  }),
  watch: {
    current() {
      this.getInfo()
    }
  },
  methods: {
    show() {
      this.getItemList()
      this.isShow = true
    },
    hide() {
      this.isShow = false
    },
    getInfo() {
      if (this.list[this.current]) {
        this.img = md5Url(this.list[this.current].meta?.img)
        this.text = this.list[this.current].meta?.text
      } else {
        this.img = ''
        this.text = ''
      }
    },
    getItemList() {
      if ($gameParty) {
        this.list = $gameParty.items()
        this.getInfo()
      }
    },
    checkInput(buttonName) {
      switch (buttonName) {
        case 'escape':
          this.hide()
          break
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
      }
    },
    up() {
      if (this.list.length < 2) return
      if (this.current == 0) {
        this.current = this.list.length - 1
      } else {
        this.current--
      }
      if ((this.current + 1) % 10 == 0) {
        this.$refs.list.scrollTop =
          (this.$refs.list.scrollHeight / 100) * (this.current - 10)
      }
    },
    down() {
      if (this.list.length < 2) return
      if (this.current >= this.list.length - 1) {
        this.current = 0
      } else {
        this.current++
      }
      if (this.current % 10 == 0) {
        this.$refs.list.scrollTop =
          (this.$refs.list.scrollHeight / 100) * (this.current - 1)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.item-list-wrapper
  z-index 999
  position absolute
  inset 0

  .item-list-frame
    display flex
    color #fff
    position absolute
    width 80%
    height 80%
    left 10%
    top 10%
    background rgba(0, 0, 0, 0.7)

    .item-list
      width 50%
      margin 10px 5px
      overflow hidden
      box-sizing border-box
      border 1px solid

      .item
        height 10%

    .item-info
      display flex
      flex-direction column
      width 50%
      margin 10px 5px 10px 0

      .img
        height 40%
        display flex
        justify-content center
        align-items center
        box-sizing border-box
        border 1px solid

        img
          max-width 100%
          max-height 100%

      .text
        flex 1
        font-size 20px
        box-sizing border-box
        border 1px solid

.highlight
  background #fff
  color #000
</style>
