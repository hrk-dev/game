/** 禁用鼠标移动 */
Scene_Map.prototype.isMapTouchOk = function() {
  return (this.isActive() && $gamePlayer.canMove()) && !($gameSystem._savedZoom && $gameSystem._savedZoom.follow)
}
