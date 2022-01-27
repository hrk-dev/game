<template>
  <div>
    <transition name="fade">
      <div class="item-list-wrapper" v-if="isShow">
        <div class="item-list-frame">
          <div class="item-title">
            <div>物品 Item</div>
          </div>
          <div class="item-list">
            <div class="pre" v-show="page > 0"></div>
            <div
              class="next"
              v-show="itemLength > page_num && page < Math.ceil(itemLength / page_num) - 1"
            ></div>
            <div
              class="item"
              v-for="(item, index) in list"
              :key="index"
              :class="{ select: current == index }"
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
      return (this.index / this.page_num) | 0
    },
    current() {
      return this.index % this.page_num
    }
  },
  watch: {
    index() {
      this.getInfo()
    },
    page() {
      this.list = this.groupList[this.page]
      this.getInfo()
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
        this.img = this.list[this.current].meta?.img
          ? md5Url('img/pictures/' + this.list[this.current].meta.img)
          : ''
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

        for (let i = 0; i < temp.length; i += this.page_num) {
          this.groupList.push(temp.slice(i, i + this.page_num))
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
          this.left()
          break
        case 'right':
          this.right()
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
      this.index = this.index - 1 < 0 ? this.itemLength - 1 : --this.index
    },
    down() {
      if (this.itemLength < 2) return
      this.index = this.index + 1 >= this.itemLength ? 0 : ++this.index
    },
    left() {
      if (this.itemLength <= this.page_num) this.up()
      let temp = this.index - this.page_num
      this.index = temp < 0 ? 0 : temp
    },
    right() {
      if (this.itemLength <= this.page_num) this.down()
      let temp = this.index + this.page_num
      this.index = temp > this.itemLength - 1 ? this.itemLength - 1 : temp
    }
  },
  created() {
    this.page_num = 10
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

    .item-title
      position absolute
      right -30px
      bottom 10px
      transform rotate(330deg)
      background rgba(0, 0, 0, 0.5)
      padding 10px 30px 10px 80px
      font-size 24px

    .item-list
      box-sizing border-box
      overflow hidden
      position relative
      flex 1
      margin 10px 5px 10px 10px
      padding 10px
      border 1px solid
      border-top-left-radius 10px
      border-bottom-left-radius 10px

      .pre
        position absolute
        top 2px
        left 50%
        transform translateX(-50%)
        width 0
        height 0
        border-bottom 5px solid #fff
        border-left 5px solid transparent
        border-right 5px solid transparent
        animation fade 1s ease infinite alternate

      .next
        position absolute
        bottom 2px
        left 50%
        transform translateX(-50%)
        width 0
        height 0
        border-top 5px solid #fff
        border-left 5px solid transparent
        border-right 5px solid transparent
        animation fade 1s ease infinite alternate

      .item
        height 10%
        padding 5px 10px
        box-sizing border-box
        display flex
        flex-direction column
        justify-content center
        border-radius 5px

        .en
          font-size 14px
          line-height 14px

        .cn
          font-size 20px
          line-height 20px

    .item-info
      flex 0 0 400px
      display flex
      flex-direction column
      margin 10px 10px 10px 0

      .img
        overflow hidden
        display flex
        justify-content center
        align-items center
        box-sizing border-box
        height 281px
        padding 10px
        border 1px solid
        border-top-right-radius 10px

        img
          max-width 100%
          max-height 100%
          border-radius 5px

      .text
        display flex
        flex-direction column
        flex 1
        box-sizing border-box
        padding 10px
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
          margin-top 5px

.select
  background rgba(255, 176, 170, 0.9) !important

@keyframes fade
  from
    opacity 0

  to
    opacity 1
</style>
