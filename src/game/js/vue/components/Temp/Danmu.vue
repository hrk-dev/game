<template>
  <div
    v-if="show"
    class="danmu-list"
    :style="{
      fontSize: fontSize + 'px',
      lineHeight: fontSize + 10 + 'px'
    }"
  >
    <template v-for="(item, key) in list">
      <div class="danmu" :style="{ top: item.top }" v-show="item.show" :key="key">{{ item.text }}</div>
    </template>
  </div>
</template>

<script>
module.exports = {
  props: {
    height: Number,
    fontSize: Number
  },
  data: () => ({
    show: false,
    list: [],
    timer: []
  }),
  methods: {
    random() {
      const line = this.height / this.fontSize
      const curr_line = (Math.random() * line) | 0
      const top = curr_line * this.fontSize + 5
      const temp = top / this.height
      return temp * 100 + '%'
    },
    setDanmu(i) {
      this.list[i].show = true
      this.timer[i] = setTimeout(() => {
        this.list[i].show = false
        this.list[i].top = this.random()
        this.timer[i] = setTimeout(() => {
          this.setDanmu(i)
        }, Math.random() * 1000)
      }, 5 * 1000)
    },
    showDanmu() {
      this.show = true
      for (const i in this.list) {
        this.timer[i] = setTimeout(() => {
          this.setDanmu(i)
        }, Math.random() * Math.random() * 10000)
      }
    },
    stopDanmu() {
      this.show = false
      for (const i in this.list) {
        clearTimeout(this.timer[i])
        this.list[i].show = false
      }
    }
  },
  mounted() {
    for (let i = 0; i < 30; i++) {
      this.list.push({
        text: "Hiiro...Hiiro...寂しい",
        top: this.random(),
        show: false
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.danmu-list
  position absolute
  top 0
  left 0
  height 100%
  width 100%

  .danmu
    display inline
    word-break keep-all
    white-space nowrap
    z-index 100
    position absolute
    left 100%
    animation danmu 5s linear
    color pink
    text-shadow 0 0 2px rgba(0, 0, 0, 0.9)

@keyframes danmu
  from
    left 100%

  to
    left -100%
</style>
