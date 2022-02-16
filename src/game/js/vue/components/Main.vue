<template>
  <div id="main" :style="{ width: width + 'px', height: height + 'px', margin: margin }">
    <div
      class="wrapper"
      :style="{
        width: wrapper.width + 'px',
        height: wrapper.height + 'px',
        transform: `scale(${scale})`
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    scale: Number,
    width: Number,
    height: Number,
    margin: String
  },
  data: () => ({
    wrapper: {
      width: 1024,
      height: 720
    }
  }),
  methods: {
    setup(width, height) {
      if (width && height) {
        this.wrapper.width = width
        this.wrapper.height = height
      }
      this.$nextTick(() => {
        this.$emit('ready')
      })
    }
  }
}
</script>

<style lang="stylus">
#main
  overflow hidden
  position absolute
  inset 0px
  z-index 90
  font-size 30px
  line-height 30px

  .wrapper
    transform-origin left top

.fade-enter, .fade-leave-to
  opacity 0 !important

.fade-enter-to, .fade-leave
  opacity 1 !important

.fade-enter-active, .fade-leave-active
  transition opacity 0.5s !important
</style>