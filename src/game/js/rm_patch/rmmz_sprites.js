Spriteset_Map.prototype.updateParallax = function () {
  if (this._parallaxName !== $gameMap.parallaxName()) {
    this._parallaxName = $gameMap.parallaxName()
    this._parallax.bitmap = ImageManager.loadParallax()
  }
  if (this._parallax.bitmap) {
    bitmap = this._parallax.bitmap
    this._parallax.origin.x = $gameMap.parallaxOx() % bitmap.width
    this._parallax.origin.y = $gameMap.parallaxOy() % bitmap.height
  }
}

Sprite_Button.prototype.checkBitmap = function () { }