<template>
  <div id="message">
    <transition :name="_transition">
      <div class="message-wrapper" :class="_pos" v-if="message.show">
        <transition name="fade" @after-enter="messageHide">
        <div class="text" :class="[_align, _size, _bg, _color]" ref="text" v-if="!hide.flag">
          <div class="name" :class="_nameAlign" v-show="message.name && message.pos != 2">
            <div class="name-cn">
              {{ nameObj.cn }}
            </div>
            <div class="name-en">
              {{ nameObj.en }}
            </div>
          </div>
          <template v-if="message.pos == 2">
            <div ref="multiline">
              <transition-group name="multiline-fade">
                <div
                  class="multiline"
                  v-for="(item, index) in message.multiline"
                  :key="'msg' + index"
                >
                  <div class="en" v-html="item.en"></div>
                  <div class="cn" v-html="item.cn"></div>
                </div>
              </transition-group>
            </div>
          </template>
          <template v-else>
            <div class="en" v-html="message.en"></div>
            <div class="cn" v-html="message.cn"></div>
          </template>
          <div class="next-wrapper">
            <div
              class="next"
              :class="_iconColor"
              :style="{ opacity: !choice.show && !message.wait ? 1 : 0 }"
            ></div>
          </div>
        </div>
        </transition>
        <div class="character" v-show="_showCharacter">
          <transition name="slide-up">
            <img
              class="img"
              v-if="message.character.list.shio"
              :src="getUrl(message.character.list.shio)"
              :class="{
                'shio-left': this.message.character.list.shio && this.message.character.list.other,
                lowlight: message.character.current !== message.character.list.shio
              }"
              @error="characterError"
            />
          </transition>
          <transition name="slide-up">
            <img
              class="img"
              v-if="message.character.list.other"
              :src="getUrl(message.character.list.other)"
              :class="{
                lowlight: message.character.current !== message.character.list.other
              }"
              @error="otherCharacterError"
            />
          </transition>
        </div>
      </div>
    </transition>
    <transition name="fade" @after-enter="messageHide">
      <div class="choice-wrapper" :class="_choicePos" v-show="choice.show && !hide.flag">
        <template v-for="(item, index) in choice.list">
          <div
            v-show="item.show"
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
const NAME = {
  0: '汐 Shio',
  1: '塔库亚 Takuya',
  2: '西卡 Ceka',
  3: '晏城 YanCheng',
  4: '雅莉 Ari',
  5: '菲林 Freelyn'
}

module.exports = {
  data: () => ({
    hide: {
      flag: false,
      end: true
    },
    message: {
      show: false,
      noHide: false,
      _noHide: false,
      wait: false,
      list: [],
      multiline: [],
      // 0-下 1-中 2-上
      pos: 0,
      // 0-左对齐 1-居中
      align: 0,
      // 0-有背景 1-无背景
      bg: 0,
      // 0-正常字号 1-大一寸字号
      size: 0,
      // 0-白色 1-黑色
      color: 0,
      name: '',
      character: {
        show: false,
        list: {
          shio: '',
          other: ''
        },
        current: ''
      },
      en: '',
      cn: '',
      temp: {
        en: '',
        cn: '',
        character: ''
      }
    },
    choice: {
      show: false,
      list: [],
      index: -1,
      cancel: null
    }
  }),
  computed: {
    nameObj() {
      const temp = this.message.name?.split(' ') || []
      return {
        cn: temp.shift() || '',
        en: temp.join(' ') || ''
      }
    },
    _choiceIndex() {
      return this.choice.index
    },
    _transition() {
      return this.message.pos == 0 ? 'slide-up' : 'fade'
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
    _color() {
      return this.message.color == 1 ? 'black-text' : 'white-text'
    },
    _iconColor() {
      return this.message.color == 1 ? 'black-icon' : 'white-icon'
    },
    _choicePos() {
      if (this.message.pos == 2) {
        return 'choice-bottom'
      }
      if (this.message.pos == 1) {
        return 'choice-lower-middle'
      }
      return 'choice-center'
    },
    _showCharacter() {
      return this.message.show && this.message.pos == 0
    },
    _shioLeft() {
      return this.message.character.list.shio && this.message.character.list.other
        ? 'shio-left'
        : ''
    }
  },
  watch: {
    _choiceIndex() {
      if (
        this.choice.show &&
        this.choice.index >= 0 &&
        this.choice.list[this.choice.index] &&
        this.choice.list[this.choice.index].show
      ) {
        if (
          this.choice.list[this.choice.index].msgEn ||
          this.choice.list[this.choice.index].msgCn
        ) {
          this.message.temp.en = this.message.en
          this.message.temp.cn = this.message.cn
          this.message.temp.character = this.message.character.list.other
          this.message.en = this.choice.list[this.choice.index].msgEn
          this.message.cn = this.choice.list[this.choice.index].msgCn
          this.message.character.list.other = this.choice.list[this.choice.index].character
          this.message.character.current = this.choice.list[this.choice.index].character
        } else {
          if (this.message.temp.en || this.message.temp.cn) {
            this.message.en = this.message.temp.en
            this.message.cn = this.message.temp.cn
            this.message.character.list.other = this.message.temp.character
            this.message.character.current = this.message.temp.character
          }
        }
      }
    }
  },
  methods: {
    characterError() {
      Components.CharacterTest.add(this.message.character.list.shio)
      this.message.character.list.shio = ''
    },
    otherCharacterError() {
      Components.CharacterTest.add(this.message.character.list.other)
      this.message.character.list.other = ''
    },
    add(code, msg) {
      switch (code) {
        case 401:
          msg = msg.replace(/<replace: (\d+)>/gi, (_str, id) => {
            return $gameVariables.value(id)
          })
          this.message.list.push(msg)
          break
      }
    },
    showMsg() {
      Components.Movetip.hide()

      const temp = (this.message.list[0] || '').split('|')

      this.message.pos = Number(temp[0][0]) || 0

      const variables = this.message.list[1]?.match(/<var: (\d+)>/i)
      if (variables && Number(variables[1])) {
        const temp2 = ($gameVariables.value(variables[1]) || '').split('|')
        this.message.en = temp2[0]
        this.message.cn = temp2[1]
      } else {
        this.message.en = this.message.list[1]
        this.message.cn = this.message.list[2]
      }
      if (this.message.pos == 2) {
        this.message.multiline.push({
          en: this.message.en,
          cn: this.message.cn
        })
        if (this.$refs.text && this.$refs.multiline) {
          if (
            this.$refs.text.offsetHeight - this.$refs.multiline.scrollHeight <
            this.$refs.text.offsetHeight / 3
          ) {
            this.message.multiline = [this.message.multiline.pop()]
          }
        }
      } else {
        this.message.align = Number(temp[0][1]) || 0
        this.message.bg = Number(temp[0][2]) || 0
        this.message.size = Number(temp[0][3]) || 0
        this.message.color = Number(temp[0][4]) || 0

        this.message.name = this.getName(temp[1])

        let character = temp[2] || ''
        if (character.includes('无立绘')) {
          character = ''
        }

        if (this.isShio(character)) {
          this.message.character.list.shio = character
        } else {
          if (character) this.message.character.list.other = character
        }
        this.message.character.current = character
        this.message.character.show =
          this.message.character.list.shio || this.message.character.list.other
      }

      this.message.show = true

      Components.Log.add(this.message.name, this.message.en, this.message.cn)
    },
    setChoices(choices, defaultType, cancelType) {
      choices.forEach(item => {
        /**
         * 选项英文|选项中文|开关ID|选择时对话框显示的英文|选择时对话框显示的中文|选择时对话框显示的立绘
         */
        const temp = item.split('|')
        this.choice.list.push({
          en: temp[0] || '',
          cn: temp[1] || '',
          show: temp[2] ? $gameSwitches.value(temp[2]) : true,
          msgEn: temp[3] || '',
          msgCn: temp[4] || '',
          character: temp[5] || ''
        })
      })
      this.choice.index = defaultType
      this.choice.cancel = cancelType
      this.choice.show = true
    },
    messageHide() {
      this.hide.end = true
    },
    checkInput(buttonName) {
      if (this.hide.flag) {
        if (buttonName === 'escape' || buttonName === 'shift') {
          this.hide.flag = false
        }
        return
      }
      if (this.message.show || this.choice.show) {
        if (buttonName === 'shift') {
          this.hide.flag = true
          this.hide.end = false
          return
        }
      }
      if (this.choice.show) {
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
      }
    },
    up() {
      if (this.choice.list.length < 1) return
      if (this.choice.index <= 0) {
        this.choice.index = this.choice.list.length
        this.up()
        return
      }
      if (!this.choice.list[--this.choice.index].show) {
        this.up()
      } else {
        SoundManager.playCursor()
      }
    },
    down() {
      if (this.choice.list.length < 1) return
      if (this.choice.index == this.choice.list.length - 1) {
        this.choice.index = -1
        this.down()
        return
      }
      if (!this.choice.list[++this.choice.index].show) {
        this.down()
      } else {
        SoundManager.playCursor()
      }
    },
    onChoice() {
      if (this.choice.index == -1) return
      // if (this.choice.index === this.choice.cancel) {
      //   SoundManager.playCancel()
      // } else {
      //   SoundManager.playOk()
      // }
      SceneManager._scene._messageWindow._choiceListWindow.updateInputData()
      SceneManager._scene._messageWindow._choiceListWindow.deactivate()
      $gameMessage.onChoice(this.choice.index)
      SceneManager._scene._messageWindow._choiceListWindow._messageWindow.terminateMessage()
      SceneManager._scene._messageWindow._choiceListWindow.close()
    },
    reset() {
      if (this.message.show) {
        SceneManager._scene._messageWindow.clearFlags()

        if (this.message.pos != 2) {
          this.message.multiline = []
        }

        this.message.list.length = 0
        this.message.pos = 0
        this.message.align = 0
        this.message.bg = 0
        this.message.size = 0
        this.message.color = 0
        this.message.name = ''
        this.message.en = ''
        this.message.cn = ''

        if (!this.message._noHide && !this.message.noHide) {
          this.message.show = false
        }
      }

      if (this.choice.show) {
        this.resetChoice()
      }
    },
    resetMultiline() {
      if (this.message.multiline.length > 0) {
        this.message.multiline = []
      }
    },
    resetCharacter() {
      if (this.message.character.show) {
        this.message.character.list.shio = ''
        this.message.character.list.other = ''
        this.message.character.current = ''
        this.message.temp.en = ''
        this.message.temp.cn = ''
        this.message.temp.character = ''
        this.message.character.show = false
      }
    },
    resetChoice() {
      this.choice.show = false
      this.choice.list.length = 0
      this.choice.index = -1
      this.choice.cancel = null
      this.message.temp.en = ''
      this.message.temp.cn = ''
      this.message.temp.character = ''
    },
    getUrl(str) {
      return str ? md5Url(`img/faces/${str}.png`) : null
    },
    getName(id) {
      return NAME[id] || id
    },
    isShio(name) {
      return name.includes('汐')
    }
  }
}
</script>

<style scoped lang="stylus">
$pink = rgba(255, 176, 170, 0.9)

#message
  color #fff
  text-shadow -1px -1px 0 #4f4d57, 1px -1px 0 #4f4d57, -1px 1px 0 #4f4d57, 1px 1px 0 #4f4d57, 0px 2px 2px rgba(0, 0, 0, 0.6)

  .message-wrapper
    display flex
    align-items flex-end
    position absolute

    .text
      z-index 1
      flex 1
      position relative
      box-sizing border-box
      padding 10px 10px 15px 10px

      .name
        position absolute
        top -5px
        font-size 28px
        font-weight bold
        transform translateY(-100%)
        display flex
        align-items baseline

        .name-en
          margin-left 10px
          font-size 20px

      .multiline
        margin-top 15px
        text-indent 40px

      .en
        margin-bottom 10px

      .next
        z-index 9
        position absolute
        bottom 5px
        right 10px
        width 0
        height 0
        border-left 10px solid transparent
        border-right 10px solid transparent
        animation fade 0.6s ease-in-out infinite alternate
        transition opacity 0.1s
        opacity 0

    .character
      position absolute
      bottom 0
      left 0
      width 100%

      .img
        position absolute
        bottom 0
        right 0
        vertical-align bottom
        width 400px
        transition all 0.35s

  .choice-wrapper
    z-index 1
    font-size 20px
    line-height 25px
    display inline-block
    position absolute
    left 50%
    text-align center
    padding 10px
    width fit-content

    .item
      padding 5px 25px
      background rgba(40, 40, 40, 0.7)
      border-radius 10px
      margin 10px auto
      min-width 250px
      border 2px solid transparent
      transition transform 0.3s, border 0.3s, background 0.3s

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
    height 180px

  .bg
    background rgba(40, 40, 40, 0.7)
    border 2px solid $pink
    border-bottom none
    border-top-left-radius 10px
    border-top-right-radius 10px
    margin 0 5px

.center
  height 100%
  top 50%
  left 0
  right 0
  transform translateY(-50%)

  .text
    height 100%
    min-height 120px

.top
  height 100%
  top 0
  left 0
  right 0

  .text
    display flex
    flex-direction column

    .en
      margin-bottom 3px !important

    .next-wrapper
      display flex
      justify-content center
      margin-top 10px

      .next
        position unset !important

  .text
    height 100%

.text-center
  display flex
  flex-direction column
  justify-content center
  text-align center

  .next
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

.white-text
  color #fff

.black-text
  color #000
  text-shadow none

.white-icon
  border-top 10px solid #fff

.black-icon
  border-top 10px solid #000

.normal-text
  .en
    font-size 18px
    line-height 18px

  .cn
    font-size 20px
    line-height 26px

.large-text
  .en
    font-size 24px
    line-height 25px

  .cn
    font-size 30px
    line-height 35px

.highlight
  transform scale(1.1)
  background rgba(0, 0, 0, 0.8) !important
  border-color $pink !important

.lowlight
  filter brightness(0.5)
  width 380px !important

.shio-left
  right calc(100% - 400px) !important

.choice-center
  top 50%
  transform translate(-50%, -50%)

.choice-lower-middle
  top calc(50% + 100px)
  transform translateX(-50%)

.choice-bottom
  bottom 10px
  transform translateX(-50%)

.slide-up-enter-active, .slide-up-leave-active
  transition all 0.3s

.slide-up-enter-to, .slide-up-leave
  transform translateY(0)
  opacity 1

.slide-up-enter, .slide-up-leave-to
  transform translateY(100%)
  opacity 0

.multiline-fade-enter, .multiline-fade-leave-to
  opacity 0 !important

.multiline-fade-enter-to, .multiline-fade-leave
  opacity 1 !important

.multiline-fade-enter-active
  transition opacity 0.2s

.fade-enter-active, .fade-leave-active
  transition opacity 0.25s !important
</style>
