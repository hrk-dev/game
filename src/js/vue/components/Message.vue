<template>
  <div id="message">
    <transition name="fade">
      <div class="message-wrapper" :class="[_pos, _bg]" v-if="message.show">
        <div class="text" :class="[_align, _size]">
          <div
            class="name"
            :class="_nameAlign"
            v-show="message.name && message.pos != 2"
          >
            {{ message.name }}
          </div>
          <div class="en" v-html="message.en"></div>
          <div class="cn" v-html="message.cn"></div>
          <div class="next" v-show="!choice.show"></div>
        </div>
        <div class="avatar" v-show="message.avatar && message.pos == 0">
          <img :src="_avatar" />
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="choice-wrapper" :class="_choicePos" v-show="choice.show">
        <template v-for="(item, index) in choice.list">
          <div
            v-if="item.show"
            class="item"
            :class="{
              highlight: choice.index == index
            }"
            :key="index"
          >
            <div class="en">{{ item.en }}</div>
            <div class="cn">{{ item.cn }}</div>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    message: {
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
    },
    choice: {
      show: false,
      list: [],
      index: -1
    }
  }),
  computed: {
    _avatar() {
      return this.message.avatar
        ? md5Url(`img/pictures/${this.message.avatar}.png`)
        : null
    },
    _pos() {
      if (this.message.pos == 2) {
        return 'top'
      }
      if (this.message.pos == 1) {
        return 'center'
      }
      return 'bottom'
    },
    _align() {
      return this.message.align == 1 ? 'text-center' : ''
    },
    _nameAlign() {
      return this.message.align == 1 ? 'name-center' : 'name-left'
    },
    _bg() {
      return this.message.bg == 1 ? 'no-bg' : 'bg'
    },
    _size() {
      return this.message.size == 1 ? 'large-text' : 'normal-text'
    },
    _choicePos() {
      if (this.message.pos == 2) {
        return 'choice-bottom'
      }
      if (this.message.pos == 1) {
        return 'choice-lower-middle'
      }
      return 'choice-center'
    }
  },
  methods: {
    add(code, msg) {
      switch (code) {
        case 401:
          this.message.list.push(msg)
          break
      }
    },
    showMsg() {
      const temp = (this.message.list[0] || '').split('|')

      this.message.pos = temp[0][0] || 0
      this.message.align = temp[0][1] || 0
      this.message.bg = temp[0][2] || 0
      this.message.size = temp[0][3] || 0

      this.message.name = this.getNmme(temp[1])
      this.message.avatar = temp[2] || ''

      this.message.en = this.message.list[1]
      this.message.cn = this.message.list[2]

      this.message.show = true
    },
    setChoices(choices, defaultType) {
      ;(choices || []).forEach(item => {
        this.choice.list.push({
          en: 'test',
          cn: item,
          show: true
        })
      })
      this.choice.index = defaultType
      this.choice.show = true
    },
    checkInput(buttonName) {
      if (!this.choice.show) return
      switch (buttonName) {
        case 'left':
          this.up()
          break
        case 'right':
          this.down()
          break
        case 'up':
          this.up()
          break
        case 'down':
          this.down()
          break
        case 'ok':
          this.onChoice()
          break
      }
    },
    up() {
      if (this.choice.list.length < 1) return
      if (this.choice.index == 0) {
        this.choice.index = this.choice.list.length
        this.up()
        return
      }
      if (!this.choice.list[--this.choice.index].show) this.up()
    },
    down() {
      if (this.choice.list.length < 1) return
      if (this.choice.index == this.choice.list.length - 1) {
        this.choice.index = -1
        this.down()
        return
      }
      if (!this.choice.list[++this.choice.index].show) this.down()
    },
    onChoice() {
      $gameMessage.onChoice(this.choice.index)
      SceneManager._scene._messageWindow._choiceWindow._messageWindow.terminateMessage()
      SceneManager._scene._messageWindow._choiceWindow.close()
      SceneManager._scene._messageWindow._choiceWindow.deactivate()
    },
    reset() {
      if (this.message.show) {
        this.message.list.length = 0
        this.message.pos = 0
        this.message.align = 0
        this.message.bg = 0
        this.message.size = 0
        this.message.name = ''
        this.message.avatar = ''
        this.message.en = ''
        this.message.cn = ''
        this.message.show = false
      }
      if (this.choice.show) {
        this.choice.list.length = 0
        this.choice.index = -1
        this.choice.show = false
      }
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
    this.message.name = this.getNmme(0)
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

    .text
      flex 1
      position relative
      box-sizing border-box
      padding 10px 0 15px 10px
      margin-left 10px

      .name
        position absolute
        top -35px
        font-size 30px
        font-weight bold
        text-underline-offset 5px
        text-decoration-line underline
        text-decoration-thickness 2px

      .en
        margin-bottom 10px

      .next
        position absolute
        bottom 5px
        right 20px
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

  .choice-wrapper
    font-size 20px
    line-height 25px
    display inline-block
    position absolute
    left 50%
    text-align center
    padding 10px
    background rgba(0, 0, 0, 0.5)

    .item
      padding 2px 5px

      .en
        font-size 16px
        line-height 16px

      .cn
        font-size 20px
        line-height 22px

.bottom
  height 180px
  bottom 0
  left 0
  right 0

  .text
    overflow hidden
    height 180px

.center
  top 50%
  left 0
  right 0
  transform translateY(-50%)

  .text
    min-height 120px

.top
  height 100%
  top 0
  left 0
  right 0

  .text
    height 100%

.text-center
  display flex
  flex-direction column
  justify-content center
  text-align center

  .next
    bottom -10px !important
    right 50% !important
    transform translateX(50%)

.name-left
  left 10px

.name-center
  left 50%
  transform translateX(-50%)

.bg
  background rgba(0, 0, 0, 0.5)

.no-bg
  background none

.normal-text
  .en
    font-size 18px
    line-height 18px

  .cn
    font-size 20px
    line-height 26px

.large-text
  .en
    font-size 25px
    line-height 25px

  .cn
    font-size 30px
    line-height 35px

.highlight
  background #fff
  color #000

.choice-center
  top 50%
  transform translate(-50%, -50%)

.choice-lower-middle
  top calc(50% + 100px)
  transform translateX(-50%)

.choice-bottom
  bottom 10px
  transform translateX(-50%)

@keyframes fade
  from
    opacity 0

  to
    opacity 1
</style>
