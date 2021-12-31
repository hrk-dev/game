<template>
  <div class="item-list-wrapper">
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
</template>

<script>
module.exports = {
  data: () => ({
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
    getInfo() {
      if (this.list[this.current]) {
        this.img = this.list[this.current].meta?.img
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
    }
  },
  mounted() {
    document.onkeydown = e => {
      if (e.key == 'ArrowDown') {
        if (this.current >= this.list.length - 1) {
          this.current = 0
        } else {
          this.current++
        }
        if (this.current % 10 == 0) {
          this.$refs.list.scrollTop =
            (this.$refs.list.scrollHeight / 100) * (this.current - 1)
        }
      } else if (e.key == 'ArrowUp') {
        if (this.current == 0) {
          this.current = this.list.length - 1
        } else {
          this.current--
        }
        if ((this.current + 1) % 10 == 0) {
          this.$refs.list.scrollTop =
            (this.$refs.list.scrollHeight / 100) * (this.current - 10)
        }
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

      .item
        height 10%

    .item-info
      display flex
      flex-direction column
      height 100%
      width 50%

      .img
        height 40%
        display flex
        justify-content center
        align-items center

        img
          max-width 100%
          max-height 100%

      .text
        font-size 20px

.highlight
  background #fff
  color #000
</style>
