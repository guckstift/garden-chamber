
function World()
{
	this.map = [];
	this.camX = 0;
	this.camY = 0;
	this.minX = 0;
	this.minY = 0;
	this.maxX = 7;
	this.maxY = 7;

	PIXI.Container.call(this);
	this.terra = new PIXI.Container();
	this.addChild(this.terra);
}

subclass(World, PIXI.Container)

World.prototype.onImagesLoaded = function ()
{
	for(var x = this.minX; x <= this.maxX; x++) {
		row = [];
		for(var y = this.minY; y <= this.maxY; y++) {
			if(x == this.minX || y == this.minY || x == this.maxX || y == this.maxY) {
				var block = new Wall(x,y);
			}
			else {
				var block = new Ground(x,y);
			}
			row.push(block);
			this.terra.addChild(block);
		}
		this.map.push(row);
	}
	
	this.selection = new PIXI.Sprite(game.selectionTex);
	this.selection.anchor.set(0.5, 0.75);
	this.addChild(this.selection);
}

World.prototype.onRender = function ()
{	
	this.vx = game.keymap[ARROWRIGHT] ? -vel : game.keymap[ARROWLEFT] ? +vel : 0;
	this.vy = game.keymap[ARROWDOWN] ? -vel : game.keymap[ARROWUP] ? +vel : 0;
	this.camX += this.vx;
	this.camY += this.vy;
	this.updateCam();
	
	for(var x = this.minX; x <= this.maxX; x++) {
		for(var y = this.minY; y <= this.maxY; y++) {
			this.getTile(x, y).onRender();
		}
	}
}

World.prototype.onResize = function (width, height)
{
	this.updateCam();
}

World.prototype.updateCam = function ()
{
	this.x = game.screenWidth/2 + this.camX;
	this.y = game.screenHeight/2 + this.camY;
}

World.prototype.screenToMap = function (sx, sy)
{
	var mx = 0, my = 0;
	
	sx -= this.x;
	sy -= this.y;
	sy += 16;
	mx = (sx/32 + sy/16)/2;
	mx = Math.floor(mx);
	my = (sy/16 - sx/32)/2;
	my = Math.floor(my);
	
	return [mx, my];
}

World.prototype.getDim = function()
{
	return [
		this.maxX - this.minX + 1,
		this.maxY - this.minY + 1
	];
}

World.prototype.getTile = function (x, y)
{
	if(x >= this.minX && y >= this.minY && x <= this.maxX && y <= this.maxY) {
		return this.map[x - this.minX][y - this.minY];
	}
	
	return null;
}

World.prototype.setTile = function (x, y, tile)
{
	if(x >= this.minX && y >= this.minY && x <= this.maxX && y <= this.maxY) {
		var oldTile = this.map[x - this.minX][y - this.minY];
		var oldIndex = this.terra.getChildIndex(oldTile);
		this.terra.removeChild(oldTile);
		oldTile.destroy();
		this.map[x - this.minX][y - this.minY] = tile;
		this.terra.addChildAt(tile, oldIndex);
	}
}

World.prototype.expandNW = function ()
{
	var row = [];
	
	for(var y = this.minY; y <= this.maxY; y++) {
		var block = new Empty(this.minX - 1, y);
		row.push(block);
		this.terra.addChildAt(block, y-this.minY);
	}
	
	this.map.unshift(row);
	this.minX --;
}

World.prototype.expandNE = function ()
{
	for(var x = this.minX; x <= this.maxX; x++) {
		var block = new Empty(x, this.minY - 1);
		this.map[x - this.minX].unshift(block);
		this.terra.addChildAt(block, x-this.minX);
	}

	this.minY --;
}

World.prototype.expandSE = function ()
{
	var row = [];
	
	for(var y = this.minY; y <= this.maxY; y++) {
		var block = new Empty(this.maxX + 1, y);
		row.push(block);
		var dim = this.getDim();
		this.terra.addChildAt(block, dim[0]*dim[1] + y - this.minY);
	}
	
	this.map.push(row);
	this.maxX ++;
}

World.prototype.expandSW = function ()
{
	var dim = this.getDim()
	for(var x = this.minX; x <= this.maxX; x++) {
		var block = new Empty(x, this.maxY + 1);
		this.map[x - this.minX].push(block);
		this.terra.addChildAt(block, dim[0]*dim[1] + x - this.minX);
	}

	this.maxY ++;
}
