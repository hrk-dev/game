<template>
  <div id="character">
    <div class="character-wrapper" v-if="show">
      <div style="margin-bottom: 5px; border-bottom: 1px solid #fff">
        缺少立绘 - {{ list.length }}
      </div>
      <div class="text" v-for="(name, i) in list" :key="'i' + i">
        {{ name }}
      </div>
      <br>
      <div style="margin-bottom: 5px; border-bottom: 1px solid #fff">
        影响事件 - {{ event.length }}
      </div>
      <div class="text" v-for="(msg, j) in event" :key="'j' + j">
        {{ msg }}
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    list: [],
    event: []
  }),
  computed: {
    show() {
      return this.list.length > 0
    }
  },
  methods: {
    add(name) {
      const msg = `${$dataMapInfos[$gameMap.mapId()].name} - 事件${$gameMap._interpreter.eventId()}`
      if (!this.event.includes(msg)) {
        console.warn(`${msg} 缺少立绘`)
        this.event.push(msg)
      }
      if (!this.list.includes(name)) {
        console.warn(`立绘不存在: ${name}`)
        this.list.push(name)
        this.list.sort()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.character-wrapper
  z-index 999
  position absolute
  top 20px
  right 0
  background #000
  color #fff
  font-size 14px
  line-height 14px
  padding 5px 10px
  opacity 0.3

  &:hover
    opacity 1

  .text
    user-select text
</style>
