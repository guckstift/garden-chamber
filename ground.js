
function Ground(x,y)
{
	Tile.call(this, x, y, "g", game.groundTex);
	
	this.green = false;
}

subclass(Ground, Tile)

Ground.prototype.setGreen = function(yes)
{
	console.log("set green",yes);
	var that = this;
	
	this.green = yes;
	this.setTexture(yes ? game.grassTex : game.groundTex);
	
	if(yes) {
		setTimeout(function () {that.maybeWither();}, 5*1000 + Math.random() * 55*1000);
	}
}

Ground.prototype.maybeWither = function()
{
	console.log("maybe wither");
	var that = this;
	
	function isPlanted()
	{
		var adjTile = game.world.getTile(mx, my);
		return adjTile != null && adjTile.type == "p" && adjTile.grown == adjTile.fullgrown;
	}
	
	var adjGreen = false;
	var mx = that.mx - 1, my = that.my;
	adjGreen |= isPlanted();
	var mx = that.mx, my = that.my - 1;
	adjGreen |= isPlanted();
	var mx = that.mx + 1, my = that.my;
	adjGreen |= isPlanted();
	var mx = that.mx, my = that.my + 1;
	adjGreen |= isPlanted();
	
	if(!adjGreen) {
		that.setGreen(false);
	}
	else {
		setTimeout(function () {that.maybeWither();}, 5*1000 + Math.random() * 55*1000);
	}
}
