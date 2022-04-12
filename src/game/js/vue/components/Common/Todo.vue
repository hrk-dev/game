<template>
  <div class="todo">
    <div class="main" v-if="mainShow">
      <div class="title">TODO</div>
      <div class="en" v-html="main.en"></div>
      <div class="cn" v-html="main.cn"></div>
    </div>
    <div class="other" v-if="otherShow">
      <div class="en" v-html="other.en"></div>
      <div class="cn" v-html="other.cn"></div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    main: {
      en: '',
      cn: ''
    },
    other: {
      en: '',
      cn: ''
    }
  }),
  computed: {
    mainShow() {
      return this.main.en || this.main.cn
    },
    otherShow() {
      return this.mainShow && (this.other.en || this.other.cn)
    }
  },
  created() {
    if ($gameSystem?.tipData) {
      this.main.en = $gameSystem.tipData.en
      this.main.cn = $gameSystem.tipData.cn
      this.other.en = $gameSystem.tipData.en_2
      this.other.cn = $gameSystem.tipData.cn_2
    }
  }
}
</script>

<style lang="stylus" scoped>
$pink = rgba(255, 176, 170, 0.9)

.todo
  z-index 60
  overflow hidden
  position absolute
  top 60px
  right 0
  max-width 40%
  color #fff
  background rgba(40, 40, 40, 0.7)
  border 2px solid $pink
  border-right none
  border-top-left-radius 10px
  border-bottom-left-radius 10px
  text-align right

  .main
    padding 2px 10px 15px 10px
    background $pink

    .title
      font-size 20px
      font-weight bold

    .en
      font-size 18px
      line-height 20px

    .cn
      margin-top 2px
      font-size 20px
      line-height 22px

  .other
    padding 2px 10px 5px 10px

    .en
      font-size 16px
      line-height 18px

    .cn
      margin-top 2px
      font-size 18px
      line-height 20px
</style>
