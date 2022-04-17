<template>
  <div id="debug">
    <transition name="fade">
      <div class="debug-wrapper" v-if="isShow && dev">
        <div class="line">
          <div style="padding: 5px">Debug</div>
          <div class="debug-save">
            <input type="number" min="1" max="99" v-model.number="saveID" />
            <button @click="save">save</button>
            <button @click="load">load</button>
          </div>
        </div>
        <div class="debug-character" v-if="hasError">
          <div style="margin-bottom: 5px; border-bottom: 1px solid #fff">
            缺少立绘 - {{ list.length }}
          </div>
          <div class="text" v-for="(name, i) in list" :key="'i' + i">
            {{ name }}
          </div>
          <br />
          <div style="margin-bottom: 5px; border-bottom: 1px solid #fff">
            影响事件 - {{ event.length }}
          </div>
          <div class="text" v-for="(msg, j) in event" :key="'j' + j">
            {{ msg }}
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
    dev: false,
    list: [],
    event: [],
    saveID: 1
  }),
  computed: {
    hasError() {
      return this.list.length > 0
    }
  },
  watch: {
    saveID() {
      if (this.saveID > 99) this.saveID = 99
      if (this.saveID < 1) this.saveID = 1
    }
  },
  methods: {
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
    },
    add(name) {
      const msg = `${$dataMapInfos[$gameMap.mapId()].name} - 事件${$gameMap._interpreter.eventId()}`
      if (!this.event.includes(msg)) {
        console.warn(`${msg} 缺少立绘`)
        this.event.push(msg)
      }
      if (!this.list.includes(name)) {
        console.warn(`立绘不存在: ${name}`)
        this.list.push(name)
        this.list.sort()
      }
    },
    async save() {
      $gameSystem.onBeforeSave()
      try {
        await DataManager.saveGame(this.saveID + 1)
        Methods.showPopup('Save success', '保存成功', 1000)
      } catch (e) {
        Methods.showPopup('Save failed', '保存失败', 1000)
      }
    },
    load() {
      Components.GameMenu.show = false
      Components.Loading.loadingShow()
      setTimeout(() => {
        DataManager.loadGame(this.saveID + 1)
          .then(() => {
            Patch.startWait()
            SceneManager.goto(Scene_Map)
            $gameSystem.onAfterLoad()
            Components.Loading.loadingHide()
            Patch.showTip()
            Patch.stopWait()
          })
          .catch(() => {
            Methods.showPopup('Load failed', '读取失败', 1000)
            Components.Loading.loadingHide()
            Components.GameMenu.show = true
          })
      }, 300)
    }
  },
  mounted() {
    if (test || dev) {
      this.dev = true
    }
  }
}
</script>

<style lang="stylus" scoped>
.debug-wrapper
  z-index 999
  position absolute
  top 130px
  left 50%
  transform translateX(-50%)
  width 50%
  height 50%
  background rgba(40, 40, 40, 0.7)
  color #fff
  border-radius 10px
  border 2px solid rgba(255, 176, 170, 0.9)
  display flex
  flex-direction column

  .line
    display flex
    justify-content space-between
    border-bottom 2px solid

    .debug-save
      display flex
      height 40px
      margin 0px
      overflow hidden

      & > *
        color #fff
        background rgba(40, 40, 40, 0.7)
        margin 1px
        border-radius 5px
        border 2px solid rgba(255, 176, 170, 0.9)

      input
        text-align center

      button
        cursor pointer

  .debug-character
    font-size 14px
    line-height 14px
    padding 5px 10px

    .text
      user-select text
</style>
