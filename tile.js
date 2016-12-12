
function Tile(x, y, type, tex)
{
	this.mx = x;
	this.my = y;
	this.type = type;
	this.vx = 0;
	this.vy = 0;
	
	PIXI.Sprite.call(this, tex);
	this.position.set(x*32 - y*32, x*16 + y*16);
	this.anchor.set(0.5, 0.75);
	
	//console.log("Created tile", type);
}

subclass(Tile, PIXI.Sprite)

Tile.prototype.onHover = function () {}
Tile.prototype.onRender = function () {}
