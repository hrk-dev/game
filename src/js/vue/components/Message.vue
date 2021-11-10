<template>
  <div id="message">
    <transition name="fade">
      <div class="message-wrapper" :class="_pos" v-if="show">
        <div class="text" :class="[_align, _size]">
          <div class="name">{{ name }}</div>
          <div class="en" v-html="en"></div>
          <div class="cn" v-html="cn"></div>
          <div class="next"></div>
        </div>
        <div class="avatar" v-show="avatar && pos === 0">
          <img :src="_avatar" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    show: false,
    list: [],
    // 0-下 1-中 2-上
    pos: 0,
    // 0-左对齐 1-居中
    align: 0,
    // 0-有背景 1-无背景
    bg: 0,
    // 0-正常字号 1-大一寸字号
    size: 0,
    name: 'hiiro',
    avatar: 'Hiiro_1',
    en: 'A strange voice is keep coming across my ears, but I’m not sure when it has begun',
    cn: '不知道是从什么时候开始，有阵异样的声音一直在传到我的耳边'
  }),
  computed: {
    _avatar() {
      return this.avatar ? md5Url(`img/pictures/${this.avatar}.png`) : null
    },
    _pos() {
      if (this.pos == 2) {
        return 'top'
      }
      if (this.pos == 1) {
        return 'center'
      }
      return 'bottom'
    },
    _align() {
      return this.align == 1 ? 'text-center' : ''
    },
    _size() {
      return this.size == 1 ? 'large-text' : ''
    }
  },
  methods: {
    add(code, msg) {
      switch (code) {
        case 401:
          this.list.push(msg)
          break
      }
    },
    showMsg() {
      const temp = (this.list[0] || '').split('|')

      this.pos = temp[0][0] || 0
      this.align = temp[0][1] || 0
      this.bg = temp[0][2] || 0
      this.size = temp[0][3] || 0

      this.name = this.getNmme(temp[1])
      this.avatar = temp[2] || ''

      this.en = this.list[1]
      this.cn = this.list[2]

      this.show = true
    },
    reset() {
      if (!this.show) return
      this.list.length = 0
      this.pos = 0
      this.align = 0
      this.bg = 0
      this.size = 0
      this.name = ''
      this.avatar = ''
      this.en = ''
      this.cn = ''
      this.show = false
    },
    getNmme(id) {
      if (!id && id !== 0) return ''
      switch (id) {
        case 0:
          return '汐 Shio'
        case 1:
          return '塔库亚 Takuya'
        default:
          return id
      }
    }
  },
  created() {
    this.name = this.getNmme(0)
  }
}
</script>

<style scoped lang="stylus">
#message
  color #fff

  .message-wrapper
    display flex
    align-items flex-end
    position absolute
    background rgba(0, 0, 0, 0.5)

    .text
      flex 1
      position relative
      box-sizing border-box
      height 100%
      min-height 180px
      padding 10px 0 15px 10px
      margin-left 10px

      .name
        position absolute
        top -30px
        left 10px
        font-size 30px
        font-weight bold

      .en
        font-size 18px
        line-height 18px
        margin-bottom 10px

      .cn
        font-size 20px
        line-height 26px

      .next
        position absolute
        bottom 5px
        right 5px
        width 0
        height 0
        border-left 10px solid transparent
        border-right 10px solid transparent
        border-top 10px solid #fff
        animation fade 1s ease infinite alternate

    .avatar
      width 30%

      img
        width 100%
        vertical-align bottom

.bottom
  height 180px
  bottom 0
  left 0
  right 0

.center
  min-height 180px
  top 50%
  left 0
  right 0
  transform translateY(-50%)

.top
  top 0
  left 0
  right 0

.text-center
  display flex
  flex-direction column
  justify-content center
  text-align center

.large-text
  .en
    font-size 25px !important
    line-height 25px !important

  .cn
    font-size 30px !important
    line-height 35px !important

  .next
    bottom -10px !important
    right 50% !important

@keyframes fade
  from
    opacity 0

  to
    opacity 1
</style>
