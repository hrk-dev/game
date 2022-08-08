<template>
  <div id="debug">
    <div class="error" title="存在素材缺失，请在菜单Debug页查看" v-if="dev && list.length > 0">
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
      >
        <path
          d="M512 720m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z"
          p-id="1939"
          fill="#FFB0AA"
        ></path>
        <path
          d="M480 416v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8z"
          p-id="1940"
          fill="#FFB0AA"
        ></path>
        <path
          d="M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48z m-783.5-27.9L512 239.9l339.8 588.2H172.2z"
          p-id="1941"
          fill="#FFB0AA"
        ></path>
      </svg>
      <span>×{{ list.length }}</span>
    </div>
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
      const msg = `${$dataMapInfos[$gameMap.mapId()].name}(${$gameMap.mapId()}) - ${`${$dataMap.events[$gameMap._interpreter.eventId()].name}(${$gameMap._interpreter.eventId()})` || `事件${$gameMap._interpreter.eventId()}`}`
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
            this.hide()
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
.error
  position absolute
  top 10px
  left 7px
  display flex
  color #FFB0AA
  font-size 14px

.debug-wrapper
  position absolute
  inset 10%
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
    font-size 15px
    line-height 14px
    padding 5px 10px

    .text
      user-select text
</style>
