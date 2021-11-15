<template>
  <div id="logo">
    <transition name="logo" @after-leave="logoEnd">
      <div class="wrapper" v-if="logo.show">
        <img :src="logo.bg" />
      </div>
    </transition>
    <transition name="logo" @after-leave="toTitleOrStart">
      <div class="wrapper" v-if="tip.show">
        <img :src="tip.bg" />
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    logo: {
      show: false,
      bg: md5Url('img/system/logo.png')
    },
    tip: {
      show: false,
      bg: md5Url('img/system/Loading.png')
    }
  }),
  methods: {
    start() {
      this.logo.show = true
      setTimeout(() => {
        this.logo.show = false
      }, 2000)
    },
    logoEnd() {
      if (!fs.existsSync(StorageManager.localFilePath(0))) {
        this.tip.show = true
      } else {
        this.toTitleOrStart()
      }
    },
    toTitleOrStart() {
      if (!fs.existsSync(StorageManager.localFilePath(1))) {
        SceneManager.goto(Scene_Map)
      } else {
        SceneManager.goto(Scene_Title)
      }
    },
    checkInput() {
      if (this.logo.show) this.logo.show = false
      if (this.tip.show) this.tip.show = false
    }
  }
}
</script>

<style lang="stylus" scoped>
#logo
  .wrapper
    position fixed
    inset 0
    display flex
    align-items center
    justify-content center

.logo-enter-active
  animation logo 0.5s linear

.logo-leave-active
  animation logo 0.5s linear reverse

@keyframes logo
  from
    opacity 0

  to
    opacity 1
</style>
