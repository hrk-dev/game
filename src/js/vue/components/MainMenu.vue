<template>
  <div class="index-wrapper" :style="{fontSize: fontSize + 'px', lineHeight: fontSize + 4 + 'px'}">
    <transition name="fade">
      <div class="index" v-if="show">
        <div v-for="(item,index) in list" :key="index">
          <div
            v-if="item.show"
            @click="click(item.name)"
            @mouseover="mouseOver(item.name)"
            :class="{ highlight: item.name === list[current].name }"
          >{{ item.name }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  props: {
    fontSize: Number
  },
  data: () => ({
    show: false,
    current: 0,
    list: [
      {
        name: '开始游戏',
        show: true
      },
      {
        name: '继续游戏',
        show: true
      },
      {
        name: '制作组',
        show: false
      },
      {
        name: '退出游戏',
        show: true
      }
    ]
  }),
  watch: {
    show() {
      if (this.show) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.current = 0
    },
    findIndex(name) {
      return this.current = this.list.findIndex(item => {
        return item.name === name
      })
    },
    click(name) {
      const index = this.findIndex(name)
      if (index !== -1) {
        this.onKeydown(index)
      }
    },
    mouseOver(name) {
      const index = this.findIndex(name)
      if (index !== -1) {
        this.current = index
      }
    },
    onKeydown(index) {
      switch (index) {
        case 0:
          DataManager.setupNewGame()
          this.show = false
          SceneManager.goto(Scene_Map)
          break
        case 1:
          alert('还没做')
          break
        case 2:
          alert('还没做')
          break
        case 3:
          SceneManager.exit()
          break
      }
    },
    checkInput(buttonName) {
      if (!this.show) return
      switch (buttonName) {
        case 'up':
          this.up()
          break
        case 'down':
          this.down()
          break
        case 'ok':
          this.onKeydown(this.current)
          break
      }
    },
    up() {
      if (this.current === 0) {
        this.current = this.list.length - 1
      } else {
        --this.current
      }
      if (!this.list[this.current].show) {
        this.up()
      }
    },
    down() {
      if (this.current === this.list.length - 1) {
        this.current = 0
      } else {
        ++this.current
      }
      if (!this.list[this.current].show) {
        this.down()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.index-wrapper
  width 100%
  height 100%
  .index
    width 100%
    height 100%
    background #fff

.highlight
  background rgba(0,0,0,0.5)
</style>
