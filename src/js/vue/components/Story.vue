<template>
  <div class="story-wrapper">
    <transition name="fade">
      <div class="story" :style="{ padding: 10 * scale + 'px' }" v-if="isShow">
        <div
          v-for="(item, index) in list"
          :key="index"
          :style="{ textIndent: `${48 * scale}px` }"
        >
          <div
            :style="{
              fontSize: `${16 * scale}px`,
              lineHeight: `${18 * scale}px`,
            }"
          >
            {{ item.en }}
          </div>
          <div
            :style="{
              fontSize: `${24 * scale}px`,
              lineHeight: `${26 * scale}px`,
            }"
          >
            {{ item.cn }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  props: {
    fontSize: Number,
    scale: Number
  },
  data: () => ({
    isShow: true,
    list: [
      {
        en: '',
        cn: ''
      },
      {
        en: '',
        cn: ''
      },
      {
        en: '',
        cn: ''
      },
      {
        en: '',
        cn: ''
      },
      {
        en: '',
        cn: ''
      }
    ]
  }),
  methods: {
    setMsg(varId, id) {
      const temp_1 = String($gameVariables.value(varId) || '')
      const temp_2 = temp_1.split('|')
      this.list[id].en = temp_2[0]
      this.list[id].cn = temp_2[1]
    },
    show() {
      this.setMsg(4, 0)
      this.setMsg(5, 1)
      this.setMsg(6, 2)
      this.setMsg(7, 3)
      this.setMsg(8, 4)
      this.isShow = true
    },
    hide() {
      this.isShow = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.story-wrapper
  .story
    position absolute
    left 5%
    top 5%
    width 90%
    height 90%
    color #fff
    background rgba(0, 0, 0, 0.8)

.fade-enter-active, .fade-leave-active
  transition opacity 0.5s

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1
</style>
