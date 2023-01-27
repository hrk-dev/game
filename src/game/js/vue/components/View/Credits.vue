<template>
  <div id="credits">
    <transition name="fade">
      <div class="credits-wrapper" v-if="show">
        <transition name="fade">
          <div class="credits-list" v-if="credits.show" :style="{
            top: `-${credits.top}px`,
            transition: credits.transition
          }">
            <img class="credits-img" :src="getUrl(credits.img)" />
          </div>
        </transition>
        <transition name="fade">
          <div class="img-wrapper" :style="{ left: `-${img.index * 1034}px` }" v-if="img.show">
            <div class="img" v-for="(urls, index) in img.list" :key="index">
              <template v-if="urls.length > 1">
                <div class="img-list">
                  <img v-for="(url, index2) in urls" :key="`${index}-${index2}`" :src="getUrl(url)" />
                </div>
              </template>
              <template v-else>
                <img :src="getUrl(urls[0])" />
              </template>
            </div>
            <div class="text">
              <div class="en">Debug</div>
              <div class="cn">{{ username }}</div>
            </div>
            <div class="text">
              <div class="en">Special Thanks</div>
              <div class="cn">特别鸣谢</div>
            </div>
          </div>
        </transition>
        <transition name="fade" :duration="{ enter: 100, leave: 50 }" @after-enter="hiiroStart">
          <div class="ending-name" v-if="hiiro.show">
            {{ hiiro.list[hiiro.index] + 'iiro' }}
          </div>
        </transition>
        <transition name="fade" duration="0" @after-enter="endingStart">
          <div class="ending" :class="{ animation: end.anime }" v-if="end.show">
            <div>{{ end.text }}</div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    show: false,
    username: 'You',
    extra: false,
    credits: {
      show: false,
      img: '制作组.png',
      transition: '',
      top: 0
    },
    img: {
      show: false,
      index: 0,
      list: [
        ['咸鱼.png'],
        ['TAKUKO.png'],
        ['陌诺.jpg', 'Ahnna.png', '囧-Smith.png', '淼.png'],
        ['极致西瓜.jpg', '慕斯蛋糕.jpg', '要发芽的大西瓜.png', 'Alexis.jpg'],
        ['-M0M0-.png', 'Fifth_J.png', 'Lysinelai.png', 'czcjdtc.png'],
        ['照云.png', 'ShawnTheMaroon.png', '咸鱼黄豆人.jpg', '小白.png'],
        ['安安安迪生AnDition.png', '月饼.png', 'Echo小生.jpg', '星铸E3n.jpg']
      ]
    },
    hiiro: {
      show: false,
      index: 0,
      list: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ]
    },
    end: {
      show: false,
      anime: false,
      text: 'Hiiro'
    }
  }),
  methods: {
    start() {
      this.extra = Patch.loopData.extra
      this.show = true
      this.creditsStart()
    },
    creditsStart() {
      // 更换图片后需要修改图片高度和持续时间
      this.credits.transition = 'top 5s linear'
      this.credits.show = true
      setTimeout(() => {
        this.credits.top = 3600
        setTimeout(() => {
          this.credits.show = false
          this.credits.transition = ''
          this.credits.top = 0

          this.imgStart()
        }, 5000)
      }, 500)
    },
    imgStart() {
      this.img.index = 0
      this.img.show = true
      const length = this.extra ? this.img.list.length : this.img.list.length + 1
      this.timer = setInterval(() => {
        if (++this.img.index > length) {
          clearInterval(this.timer)
          this.timer = null
          this.img.show = false
          if (this.extra) {
            this.back()
          } else {
            this.hiiro.index = 0
            this.hiiro.show = true
          }
        }
      }, 2000)
    },
    hiiroStart() {
      this.timer = setInterval(() => {
        this.hiiro.index++
        Components.TitleBar.title = this.hiiro.list[this.hiiro.index] + 'iiro'
        if (this.hiiro.index > this.hiiro.list.length - 1) {
          clearInterval(this.timer)
          this.timer = null
          this.hiiro.show = false
          this.end.text = 'Hiiro'
          Components.TitleBar.reset()
          this.end.anime = false
          this.end.show = true
        }
      }, 100)
    },
    endingStart() {
      setTimeout(() => {
        AudioManager.stopBgm()
        this.end.anime = true
        this.end.text = 'Hirro'
        AudioManager.playSe({
          name: 'Paralyze1',
          pan: 0,
          pitch: 100,
          volume: 100
        })
        Components.TitleBar.title = 'Hirro'

        Steam.activateAchievement('CREDITS')
        Patch.loopData.extra = true
        Patch.saveLoopData()

        setTimeout(() => {
          this.end.show = false
          this.back()
        }, 3000)
      }, 1000)
    },
    back() {
      this.show = false
      Components.TitleBar.reset()
      Components.MainMenu.showMenu()
      AudioManager.playBgm($dataSystem.titleBgm)
    },
    getUrl(name) {
      return `../credits/${name}`
    }
  },
  mounted() {
    this.timer = null
  },
  created() {
    this.username = electron.ipcRenderer.sendSync('steam:get-username') || 'You'
  }
}
</script>

<style lang="stylus" scoped>
.credits-wrapper
  z-index 99
  position absolute
  inset -5px
  background #000
  color #fff

  .credits-list
    position absolute
    top 0
    width 100%
    height 100%

    .credits-img
      display block
      width 100%

  .img-wrapper
    display flex
    position absolute
    top 5px
    left 0
    transition left 0.5s

    .img
      width 1034px
      height 730px

      img
        display block
        height 100%

      .img-list
        display grid
        width 100%
        height 100%
        grid-template-columns 50% 50%
        grid-template-rows 50% 50%

    .text
      display flex
      flex-direction column
      align-items center
      justify-content center
      width 1034px

      .en
        font-size 20px

      .cn
        font-size 22px

  .ending-name
    position fixed
    top 50%
    left 50%
    transform translate(-50%, -50%)
    filter blur(1px)

  .ending
    position fixed
    inset 0
    display flex
    flex-direction column
    align-items center
    justify-content center
    filter blur(1px)

.animation
  text-shadow -5px -5px 0px rgba(248, 240, 5, 0.5), 5px 5px 0px rgba(0, 230, 246, 0.5)
  clip-path inset(50% 50% 50% 50%)
  animation glitch 3s infinite
  animation-timing-function steps(2, end)

@keyframes glitch
  0%
    -webkit-clip-path inset(48% 0 16% 0)
    clip-path inset(48% 0 16% 0)
    -webkit-transform translate(-9px, -6px)
    transform translate(-9px, -6px)

  10%
    -webkit-clip-path inset(75% 0 75% 0)
    clip-path inset(75% 0 75% 0)
    -webkit-transform translate(-9px, 7px)
    transform translate(-9px, 7px)

  20%
    -webkit-clip-path inset(44% 0 57% 0)
    clip-path inset(44% 0 57% 0)
    -webkit-transform translate(2px, 7px)
    transform translate(2px, 7px)

  30%
    -webkit-clip-path inset(39% 0 54% 0)
    clip-path inset(39% 0 54% 0)
    -webkit-transform translate(-1px, 8px)
    transform translate(-1px, 8px)

  40%
    -webkit-clip-path inset(31% 0 39% 0)
    clip-path inset(31% 0 39% 0)
    -webkit-transform translate(-5px, -3px)
    transform translate(-5px, -3px)

  50%
    -webkit-clip-path inset(65% 0 22% 0)
    clip-path inset(65% 0 22% 0)
    -webkit-transform translate(8px, 1px)
    transform translate(8px, 1px)

  60%
    -webkit-clip-path inset(2% 0 19% 0)
    clip-path inset(2% 0 19% 0)
    -webkit-transform translate(9px)
    transform translate(9px)

  70%
    -webkit-clip-path inset(59% 0 22% 0)
    clip-path inset(59% 0 22% 0)
    -webkit-transform translate(6px, -5px)
    transform translate(6px, -5px)

  80%
    -webkit-clip-path inset(65% 0 13% 0)
    clip-path inset(65% 0 13% 0)
    -webkit-transform translate(-2px, -5px)
    transform translate(-2px, -5px)

  10%
    -webkit-clip-path inset(81% 0 67% 0)
    clip-path inset(81% 0 67% 0)
    -webkit-transform translate(-6px, 10px)
    transform translate(-6px, 10px)

  90%
    -webkit-clip-path inset(40% 0 51% 0)
    clip-path inset(40% 0 51% 0)
    -webkit-transform translate(-4px, -8px)
    transform translate(-4px, -8px)

  100%
    -webkit-clip-path inset(61% 0 75% 0)
    clip-path inset(61% 0 75% 0)
    -webkit-transform translate(-9px, 3px)
    transform translate(-9px, 3px)
</style>
