//-----------------------------------------------------------------------------
/*:
 * @plugindesc 插件工具类
 *
 * @target MZ
 * @author Blacktunes
 *
 * @command 切换滤镜
 * @text 切换滤镜
 * @desc 切换滤镜
 *
 * @arg filter
 * @text filter
 * @desc filter
 *
 * @command 还原滤镜
 * @text 还原滤镜
 * @desc 还原滤镜
 *
 * @command 聚焦到事件
 * @text 聚焦到事件
 * @desc 聚焦到事件
 *
 * @arg id
 * @default 0
 * @text ID
 * @type number
 * @desc 需要聚焦的ID
 *
 * @arg scale
 * @default 3
 * @text scale
 * @type number
 * @desc 放大倍数
 *
 * @arg time
 * @default 30
 * @text time
 * @type number
 * @desc 持续时间
 *
 * @command 还原聚焦
 * @text 还原聚焦
 * @desc 还原聚焦
 *
 * @arg time
 * @default 30
 * @text time
 * @type number
 * @desc 持续时间
 *
 * @command 重置立绘
 * @text 重置立绘
 * @desc 重置立绘
 *
 * @command 不消除对话框
 * @text 不消除对话框
 * @desc 不消除对话框
 *
 * @arg flag
 * @default false
 * @text flag
 * @type boolean
 *
 * @command 设置提示
 * @text 设置提示
 * @desc 设置提示
 *
 * @arg en
 * @text en
 * @desc 英文提示
 *
 * @arg cn
 * @text cn
 * @desc 中文提示
 *
 * @arg time
 * @default 3000
 * @text time
 * @type number
 * @desc 持续时间
 *
 * @command 消除提示
 * @text 消除提示
 * @desc 消除提示
 *
 * @command 保存
 * @text 保存
 * @desc 保存
 *
 * @command 解锁成就
 * @text 解锁成就
 * @desc 解锁成就
 *
 * @arg id
 * @text ID
 * @desc 成就ID
 */

void function () {
  const list = {
    切换滤镜: ({ filter }) => {
      document.getElementById('gameCanvas').style.filter = filter
    },
    还原滤镜: () => {
      document.getElementById('gameCanvas').style.filter = ''
    },
    聚焦到事件: ({ id, scale, time }) => {
      Galv.ZOOM.target(Number(id), Number(scale), Number(time))
    },
    还原聚焦: ({ time }) => {
      Galv.ZOOM.restore(Number(time))
    },
    重置立绘: () => {
      Components.Message.resetCharacter()
    },
    不消除对话框: ({ flag }) => {
      Components.Message.message.noHide = eval(flag)
    },
    设置提示: ({ en, cn, time }) => {
      Methods.showTip(en, cn, Number(time))
    },
    消除提示: () => {
      Methods.clearTip()
    },
    保存: () => {
      $gameSystem.onBeforeSave()
      DataManager.saveGame(1)
    },
    解锁成就: ({ id }) => {
      Steam.activateAchievement(id)
    }
  }

  for (const name in list) {
    PluginManager.registerCommand('Tool', name, arg => {
      list[name](arg)
    })
  }
}()
