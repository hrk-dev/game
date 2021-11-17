//-----------------------------------------------------------------------------
//  Galv's Action Indicators
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_ActionIndicators.js
//-----------------------------------------------------------------------------
//  2017-05-26 - Version 1.4 - fixed a bug when looking at same icon indicator
//                           - wouldn't do popup effect
//  2015-03-06 - Version 1.3 - now works with events 'under' the player as well
//                           - as counters
//  2015-12-08 - Version 1.2 - added opacity, z and hiding options.
//  2015-12-07 - Version 1.1 - fixed a crash when you deleted events.
//  2015-12-04 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_ActionIndicators = true;

var Galv = Galv || {};        // Galv's main object
Galv.pCmd = Galv.pCmd || {};  // Plugin Command manager
Galv.AI = Galv.AI || {};      // Galv's plugin stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc Display an icon when the player is able to interact with an event. View help for comment tag. (经过修改)
 *
 * @author Galv - galvs-scripts.com & Blacktunes
 *
 * @param Y Offset
 * @desc Pixel offset for icon's Y position
 * @default 0
 *
 * @param Z Position
 * @desc The Z position (controls if it appears over/under map objects)
 * @default 5
 *
 * @param Auto Hide
 * @desc true or false. If true, icons will disappear when an event is running
 * @default true
 *
 * @param Icon Opacity
 * @desc 0-255. The opacity of the icon
 * @default 200
 *
 * @help
 *   Galv's Action Indicators
 * ----------------------------------------------------------------------------
 * This plugin will enable you to display an icon when the player is facing an
 * event that has the below code in a 'comment' command anywhere in the active
 * event page.
 *
 *   <icon: id>       // The code to use in a COMMENT within and event.
 *                          // id = the icon ID to use for the indicator.
 *
 * ----------------------------------------------------------------------------
 *  PLUGIN COMMANDS
 * ----------------------------------------------------------------------------
 *
 *   AIVISIBLE FALSE        // Disable action indicator
 *   AIVISIBLE TRUE         // Enable action indicator
 *   
 */

//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {

Galv.AI.y = Number(PluginManager.parameters('Galv_ActionIndicators')["Y Offset"]);
Galv.AI.z = Number(PluginManager.parameters('Galv_ActionIndicators')["Z Position"]);
Galv.AI.opacity = Number(PluginManager.parameters('Galv_ActionIndicators')["Icon Opacity"]);

Galv.AI.autoHide = eval(PluginManager.parameters('Galv_ActionIndicators')["Auto Hide"]);
Galv.AI.needRefresh = false;

// GALV'S PLUGIN MANAGEMENT. INCLUDED IN ALL GALV PLUGINS THAT HAVE PLUGIN COMMAND CALLS, BUT ONLY RUN ONCE.
if (!Galv.aliased) {
	var Galv_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		if (Galv.pCmd[command]) {
			Galv.pCmd[command](args);
			return;
		};
		Galv_Game_Interpreter_pluginCommand.call(this, command, args);
	};
	Galv.aliased = true; // Don't keep aliasing for other Galv scripts.
};

// Direct to Plugin Object
Galv.pCmd.AIVISIBLE = function(arguments) {
	var status = eval(arguments[0].toLowerCase())
	$gameSystem.actionIndicatorVisible = status;
};
// END GALV'S PLUGIN MANAGEMENT




//-----------------------------------------------------------------------------
// Game_System

var Galv_Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Galv_Game_System_initialize.call(this);
	this.actionIndicatorVisible = true;
};

//-----------------------------------------------------------------------------
// Game_Map

var Galv_Game_Map_requestRefresh = Game_Map.prototype.requestRefresh;
Game_Map.prototype.requestRefresh = function(mapId) {
	Galv_Game_Map_requestRefresh.call(this,mapId);
	Galv.AI.needRefresh = true;
};


//-----------------------------------------------------------------------------
// Game_Player

var Galv_Game_CharacterBase_moveStraight = Game_CharacterBase.prototype.moveStraight;
Game_CharacterBase.prototype.moveStraight = function(d) {
	Galv_Game_CharacterBase_moveStraight.call(this,d);
	Galv.AI.needRefresh = true;
};

	Galv.AI.checkActionIcon = function () {
		
		var x2 = $gameMap.roundXWithDirection($gamePlayer._x, $gamePlayer._direction);
		var y2 = $gameMap.roundYWithDirection($gamePlayer._y, $gamePlayer._direction);
		var action = null;
		
		if ($gameMap.eventsXy($gamePlayer._x, $gamePlayer._y).length < 1) {
			Components.Movetip.hide()
		}
	
	// CHECK EVENT STANDING ON
	$gameMap.eventsXy($gamePlayer._x, $gamePlayer._y).forEach(function(event) {
		action = Galv.AI.checkEventForIcon(event);
		setMoveTip(event)
	});
	
	// CHECK EVENT IN FRONT
	if (!action) {
		$gameMap.eventsXy(x2, y2).forEach(function(event) {
			if (event.isNormalPriority()) {
				action = Galv.AI.checkEventForIcon(event);
				setMoveTip(event)
			};
		});

		// //---------------------------------------------------------------
		// // 适配半格移动
		// $gameMap.eventsXy(x2, y2 + 0.5).forEach(function(event) {
		// 	if (event.isNormalPriority()) {
		// 		action = Galv.AI.checkEventForIcon(event);
		// 	};
		// });
		// $gameMap.eventsXy(x2, y2 - 0.5).forEach(function(event) {
		// 	if (event.isNormalPriority()) {
		// 		action = Galv.AI.checkEventForIcon(event);
		// 	};
		// });
		// //---------------------------------------------------------------
	};
	
	// CHECK COUNTER
	if (!action && $gameMap.isCounter(x2, y2)) {
		var direction = $gamePlayer.direction();
		var x3 = $gameMap.roundXWithDirection(x2, direction);
        var y3 = $gameMap.roundYWithDirection(y2, direction);
		$gameMap.eventsXy(x3, y3).forEach(function(event) {
			if (event.isNormalPriority()) {
				action = Galv.AI.checkEventForIcon(event);
				setMoveTip(event)
			};
		});
	};
	action = action || {'eventId': -1, 'iconId': 0};

	$gamePlayer.actionIconTarget = action;
};



Galv.AI.checkEventForIcon = function(event) {
	var icon = 0;
			
	if (event.page()) {
		var listCount = event.page().list.length;
		
		for (var i = 0; i < listCount; i++) {
			if (event.page().list[i].code === 108) {
				var iconCheck = event.page().list[i].parameters[0].match(/<icon: (.*)>/i);
				if (iconCheck) {
					// create target object
					const _action = {'eventId': event._eventId, 'iconId': 0}
					if (iconCheck[1] == 'move') {
						_action.iconId = 255
					} else if (iconCheck[1] == 'talk') {
						_action.iconId = 254
					} else if (iconCheck[1] == 'check') {
						_action.iconId = 253
					} else {
						_action.iconId = Number(iconCheck[1])
					}
					if (_action.iconId == 255) _action.eventId = 0
					return _action
					break;
				};
			};
		};
	};
	return {'eventId': -1, 'iconId': 0};
};

// Galv.AI.checkEventForDirection = function(event) {
// 	if (event.page()) {
// 		var listCount = event.page().list.length;
		
// 		for (var i = 0; i < listCount; i++) {
// 			if (event.page().list[i].code === 108 || event.page().list[i].code === 408) {
// 				var check = event.page().list[i].parameters[0].match(/<direction: (.*)>/i)
// 				if (check) {
// 					return Number(check[1])
// 					break;
// 				};
// 			};
// 		};
// 	};
// 	return null;
// };
	
	Galv.AI.checkEventForTip = function (event) {
	let res = {cn: '', en: ''}
	if (event.page()) {
		var listCount = event.page().list.length;

		for (var i = 0; i < listCount; i++) {
			if (event.page().list[i].code === 408 || event.page().list[i].code === 108) {
				var check = event.page().list[i].parameters[0].match(/<cn: (.*)>/i)
				if (check) {
					res.cn = check[1]
					break;
				};
			};
		};
		for (var i = 0; i < listCount; i++) {
			if (event.page().list[i].code === 408 || event.page().list[i].code === 108) {
				var check = event.page().list[i].parameters[0].match(/<en: (.*)>/i)
				if (check) {
					res.en = check[1]
					break;
				};
			};
		};
	};
	return res;
};

	const setMoveTip = function (event) {
		if (!$gamePlayer.canMove()) return
		const eventTip = Galv.AI.checkEventForTip(event)
		if (eventTip.cn || eventTip.en) {
			Components.Movetip.show(eventTip.cn, eventTip.en)
		} else {
			Components.Movetip.hide()
		}
	}

//-----------------------------------------------------------------------------
// Spriteset_Map

var Galv_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
	Galv_Spriteset_Map_createLowerLayer.call(this);
	this.createActionIconSprite();
};

Spriteset_Map.prototype.createActionIconSprite = function() {
	this._actionIconSprite = new Sprite_ActionIcon();
	this._tilemap.addChild(this._actionIconSprite);
};


//-----------------------------------------------------------------------------
// Sprite_ActionIcon

function Sprite_ActionIcon() {
    this.initialize.apply(this, arguments);
}

Sprite_ActionIcon.prototype = Object.create(Sprite.prototype);
Sprite_ActionIcon.prototype.constructor = Sprite_ActionIcon;

Sprite_ActionIcon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
	$gamePlayer.actionIconTarget = $gamePlayer.actionIconTarget || {'eventId': -1, 'iconId': 0}; 
	this._iconIndex = 0;
	this.z = Galv.AI.z;
	this.changeBitmap();
	this._tileWidth = $gameMap.tileWidth();
	this._tileHeight = $gameMap.tileHeight();
	this._offsetX = -(Window_Base._iconWidth / 2);
	this._offsetY = -38 + Galv.AI.y;
	this.anchor.y = 1;
	this._float = 0.1;
	this.mod = 0.2;
	Galv.AI.needRefresh = true;
};

Sprite_ActionIcon.prototype.changeBitmap = function() {
	if ($gamePlayer.actionIconTarget.eventId < 0) {
		this._iconIndex = 0;
	} else {
		this._iconIndex = $gamePlayer.actionIconTarget.iconId;
	};

	var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
	var sx = this._iconIndex % 16 * pw;
    var sy = Math.floor(this._iconIndex / 16) * ph;
	
	this.bitmap = new Bitmap(pw,ph);
	if (this._iconIndex <= 0) return;
    var bitmap = ImageManager.loadSystem('IconSet');
    this.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
	
	Galv.AI.needRefresh = false;
};

Sprite_ActionIcon.prototype.initPopVars = function() {
	this.scale.y = 0.1;
	this.opacity = 0;
	this.mod = 0.2;
	this._float = 0.1;
};

if (Galv.AI.autoHide) {
	Sprite_ActionIcon.prototype.updateOpacity = function() {
		if ($gameMap.isEventRunning()) {
			this.opacity -= 40;
		} else {
			this.opacity = $gameSystem.actionIndicatorVisible ? Galv.AI.opacity : 0;
		};
	};
} else {
	Sprite_ActionIcon.prototype.updateOpacity = function() {
		this.opacity = $gameSystem.actionIndicatorVisible ? Galv.AI.opacity : 0;
	};
};

Sprite_ActionIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
	
	if (Galv.AI.needRefresh) Galv.AI.checkActionIcon();
	
	if ($gamePlayer.actionIconTarget.eventId != this._eventId) {
		this.initPopVars();
		this._eventId = $gamePlayer.actionIconTarget.eventId;
	}
	
	if (this._iconIndex !== $gamePlayer.actionIconTarget.iconId) this.changeBitmap();
	if (this._iconIndex <= 0) return;

	
	this.x = ($gamePlayer.actionIconTarget.eventId === 0 ? $gamePlayer : $gameMap.event($gamePlayer.actionIconTarget.eventId)).screenX() + this._offsetX;
	this.y = ($gamePlayer.actionIconTarget.eventId === 0 ? $gamePlayer : $gameMap.event($gamePlayer.actionIconTarget.eventId)).screenY() + this._offsetY + this._float;

	this.scale.y = Math.min(this.scale.y + 0.1,1);
	
	this.updateOpacity();

	this._float += this.mod;
	if (this._float < -0.1) {
		this.mod = Math.min(this.mod + 0.01,0.2);
	} else if (this._float >= 0.1) {
		this.mod = Math.max(this.mod + -0.01,-0.2);
	};

};

})();