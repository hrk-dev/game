<template>
  <div id="loading">
    <transition name="fade">
      <div class="loading" v-if="show">
        <div class="img" :style="{ backgroundImage: `url('${url}')` }"></div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    show: false,
    url: md5Url('img/system/loading/loading.png')
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
$size = 96px

#loading
  .loading
    z-index 110
    display flex
    justify-content center
    align-items center
    position absolute
    inset -5px
    color #fff
    background #000

  .img
    width $size
    height $size
    animation eat 1s infinite step-start alternate
    background-size cover

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s linear

@keyframes eat
  0%
    background-position-x 0

  20%
    background-position-x calc(96px * -1)

  40%
    background-position-x calc(96px * -2)

  60%
    background-position-x calc(96px * -3)

  80%
    background-position-x calc(96px * -4)

  100%
    background-position-x calc(96px * -5)
</style>
