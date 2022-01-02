Game_Interpreter.prototype.isRunning = function () {
  return this._wait || !!this._list
}

Game_Interpreter.prototype.update = function () {
  while (this.isRunning()) {
    if (this._wait) {
      break
    }
    if (this.updateChild() || this.updateWait()) {
      break
    }
    if (SceneManager.isSceneChanging()) {
      break
    }
    if (!this.executeCommand()) {
      break
    }
    if (this.checkFreeze()) {
      break
    }
  }
}

Game_Interpreter.prototype.command101 = function () {
  if (!$gameMessage.isBusy()) {
    $gameMessage.setFaceImage(this._params[0], this._params[1])
    $gameMessage.setBackground(this._params[2])
    $gameMessage.setPositionType(this._params[3])
    while (this.nextEventCode() === 401) {  // Text data
      this._index++
      Components.Message.add(401, this.currentCommand().parameters[0])
      $gameMessage.add(this.currentCommand().parameters[0])
    }
    switch (this.nextEventCode()) {
      case 102:  // Show Choices
        this._index++
        this.setupChoices(this.currentCommand().parameters)
        break
      case 103:  // Input Number
        this._index++
        this.setupNumInput(this.currentCommand().parameters)
        break
      case 104:  // Select Item
        this._index++
        this.setupItemChoice(this.currentCommand().parameters)
        break
      case 119:
        Components.Message.message._noHide = true
        break
      default:
        Components.Message.message._noHide = false
    }
    this._index++
    this.setWaitMode('message')
    Components.Message.showMsg()
  }
  return false
}

Game_Interpreter.prototype.command201 = function () {
  if (!$gameParty.inBattle() && !$gameMessage.isBusy()) {
    var mapId, x, y
    if (this._params[0] === 0) {  // Direct designation
      mapId = this._params[1]
      x = this._params[2]
      y = this._params[3]
    } else {  // Designation with variables
      mapId = $gameVariables.value(this._params[1])
      x = $gameVariables.value(this._params[2])
      y = $gameVariables.value(this._params[3])
    }
    $gamePlayer.reserveTransfer(mapId, x, y, this._params[4], this._params[5])
    Components.Message.resetCharacter()
    this.setWaitMode('transfer')
    this._index++
    Components.Movetip.hide()
  }
  return false
}

Game_Interpreter.prototype.setupChoices = function (params) {
  var choices = params[0].clone()
  var cancelType = params[1]
  var defaultType = params.length > 2 ? params[2] : 0
  var positionType = params.length > 3 ? params[3] : 2
  var background = params.length > 4 ? params[4] : 0
  if (cancelType >= choices.length) {
    cancelType = -2
  }
  $gameMessage.setChoices(choices, defaultType, cancelType)
  Components.Message.setChoices(choices, defaultType, cancelType)
  $gameMessage.setChoiceBackground(background)
  $gameMessage.setChoicePositionType(positionType)
  $gameMessage.setChoiceCallback(function (n) {
    this._branch[this._indent] = n
  }.bind(this))
}

Game_Message.prototype.isBusy = function () {
  const busy = (this.hasText() || this.isChoice() ||
    this.isNumberInput() || this.isItemChoice())
  if (!busy) {
    Components.Message.reset()
  }
  return busy
}

Game_Map.prototype.setup = function (mapId) {
  if (!$dataMap) {
    throw new Error('The map data is not available')
  }
  this._mapId = mapId
  this._tilesetId = $dataMap.tilesetId == 7 ? 8 : $dataMap.tilesetId
  this._displayX = 0
  this._displayY = 0
  this.refereshVehicles()
  this.setupEvents()
  this.setupScroll()
  this.setupParallax()
  this.setupBattleback()
  this._needsRefresh = false
}

Game_Map.prototype.isEventRunning = function () {
  const eventRunning = this._interpreter.isRunning() || this.isAnyEventStarting()
  if (!eventRunning) {
    Components.Message.resetCharacter()
    $gameSystem.showEventNames()
  } else {
    $gameSystem.hideEventNames()
  }
  return eventRunning
}