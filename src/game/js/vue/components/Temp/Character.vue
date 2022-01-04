<template>
  <div id="character">
    <div class="character-wrapper" v-if="show">
      <div style="margin-bottom: 5px; border-bottom: 1px solid #fff">
        缺少立绘 - {{ list.length }}
      </div>
      <div class="text" v-for="(name, i) in list" :key="i">
        {{ name }}
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    list: []
  }),
  computed: {
    show() {
      return this.list.length > 0
    }
  },
  methods: {
    add(name) {
      if (this.list.includes(name)) return
      console.warn(`立绘不存在: ${name}`)
      this.list.push(name)
      this.list.sort()
    }
  }
}
</script>

<style lang="stylus" scoped>
.character-wrapper
  z-index 999
  position absolute
  top 0
  left 0
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
