<template>
  <div id="loading">
    <transition name="fade">
      <div class="loading" v-if="show">Loading···</div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    show: false
  }),
  methods: {
    loadingShow() {
      this.show = true
    },
    loadingHide() {
      this.show = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.loading
  z-index 110
  display flex
  justify-content center
  align-items center
  position absolute
  inset 0
  color #fff
  background #000

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s linear
</style>
