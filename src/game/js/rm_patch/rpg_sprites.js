/*
 * Simple fix for canvas parallax issue, destroy old parallax and readd to  the tree.
 */
Spriteset_Map.prototype._canvasReAddParallax = function () {
  var index = this._baseSprite.children.indexOf(this._parallax)
  this._baseSprite.removeChild(this._parallax)
  this._parallax = new TilingSprite()
  this._parallax.move(0, 0, Graphics.width, Graphics.height)
  this._parallax.bitmap = ImageManager.loadParallax()
  this._baseSprite.addChildAt(this._parallax, index)
}

Spriteset_Map.prototype.updateParallax = function () {
  if (this._parallaxName !== $gameMap.parallaxName()) {
    this._parallaxName = $gameMap.parallaxName()

    if (this._parallax.bitmap && Graphics.isWebGL() != true) {
      this._canvasReAddParallax()
    } else {
      this._parallax.bitmap = ImageManager.loadParallax()
    }
  }
  if (this._parallax.bitmap) {
    this._parallax.origin.x = $gameMap.parallaxOx()
    this._parallax.origin.y = $gameMap.parallaxOy()
  }
}
