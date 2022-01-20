<template>
  <div>
    <transition name="fade">
      <div class="item-list-wrapper" v-if="isShow">
        <div class="item-list-frame">
          <div class="title">
            <div>物品 Item</div>
          </div>
          <div class="item-list">
            <div
              class="item"
              v-for="(item, index) in list"
              :key="index"
              :class="{ highlight: current == index }"
            >
              <div class="en" v-if="item.meta?.en">{{ item.meta.en }}</div>
              <div class="cn">{{ item.meta?.cn || item.name }}</div>
            </div>
          </div>
          <div class="item-info">
            <div class="img">
              <img :src="img" />
            </div>
            <div class="text">
              <div class="en">{{ text.en }}</div>
              <div class="cn">{{ text.cn }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
const page_num = 10

module.exports = {
  data: () => ({
    isShow: false,
    itemLength: 0,
    list: [],
    groupList: [],
    index: 0,
    img: '',
    text: {
      en: '',
      cn: ''
    }
  }),
  computed: {
    page() {
      return (this.index / page_num) | 0
    },
    current() {
      return this.index % page_num
    }
  },
  watch: {
    index() {
      this.getInfo()
    },
    page() {
      this.list = this.groupList[this.page]
    }
  },
  methods: {
    show() {
      this.getItemList()
      this.list = this.groupList[this.page]
      if (this.index > this.itemLength) this.index = 0
      this.getInfo()
      this.isShow = true
    },
    hide() {
      this.isShow = false
    },
    getInfo() {
      if (this.list[this.current]) {
        this.img = md5Url(this.list[this.current].meta?.img)
        this.text.en = this.list[this.current].meta?.infoEn || ''
        this.text.cn = this.list[this.current].meta?.infoCn || ''
      } else {
        this.img = ''
        this.text.en = ''
        this.text.cn = ''
      }
    },
    getItemList() {
      if ($gameParty) {
        this.groupList = []
        const temp = $gameParty.items()

        // const temp = []
        // for (let i = 0; i < 98; i++) {
        //   temp.push({ name: i })
        // }

        for (let i = 0; i < temp.length; i += page_num) {
          this.groupList.push(temp.slice(i, i + page_num))
        }
        if (this.groupList.length < 1) this.groupList.push([])
        this.itemLength = temp.length
      }
    },
    checkInput(buttonName) {
      switch (buttonName) {
        case 'escape':
          this.hide()
          break
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
      }
    },
    up() {
      if (this.itemLength < 2) return
      if (--this.index < 0) this.index = this.itemLength - 1
    },
    down() {
      if (this.itemLength < 2) return
      if (++this.index >= this.itemLength) this.index = 0
    }
  }
}
</script>

<style lang="stylus" scoped>
.item-list-wrapper
  position absolute
  inset 0

  .item-list-frame
    overflow hidden
    display flex
    color #fff
    position absolute
    width 80%
    height 80%
    left 10%
    top 10%
    background rgba(40, 40, 40, 0.7)
    border 3px solid rgba(255, 176, 170, 0.9)
    border-radius 15px

    .title
      position absolute
      right -30px
      bottom 10px
      transform rotate(330deg)
      background rgba(0, 0, 0, 0.5)
      padding 10px 30px 10px 80px
      font-size 24px

    .item-list
      overflow hidden
      box-sizing border-box
      width 50%
      margin 10px 5px 10px 10px
      border 1px solid
      border-top-left-radius 10px
      border-bottom-left-radius 10px

      .item
        height 10%
        padding 5px 10px
        box-sizing border-box
        display flex
        flex-direction column
        justify-content center

        .en
          font-size 14px
          line-height 14px

        .cn
          font-size 20px
          line-height 20px

    .item-info
      display flex
      flex-direction column
      width 50%
      margin 10px 10px 10px 0

      .img
        height 40%
        display flex
        justify-content center
        align-items center
        box-sizing border-box
        border 1px solid
        border-top-right-radius 10px

        img
          max-width 100%
          max-height 100%

      .text
        display flex
        flex-direction column
        flex 1
        box-sizing border-box
        padding 5px 10px
        font-size 20px
        border 1px solid
        border-top none
        border-bottom-right-radius 10px

        .en
          font-size 14px
          line-height 14px

        .cn
          font-size 20px
          line-height 20px

.highlight
  background #fff
  color #000
</style>
