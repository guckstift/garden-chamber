
function Wall(x,y)
{
	this.greened = 0;
	this.willIndent = false;
	this.trans = false;
	this.willWither = false;
	this.gone = false;
	
	Tile.call(this, x, y, "w", game.stoneTex);
}

subclass(Wall, Tile)

Wall.prototype.goGreen = function ()
{
	var that = this;
	
	if(this.gone)
		return;
	
	if (this.greened < 4) {
		that.greened ++;
		that.setTexture(game["greenstone" + that.greened + (this.trans ? "Trans" : "") + "Tex"]);
		setTimeout(function () {
			that.goGreen();
		}, 5*1000 + Math.random() * 15*1000);
	}
	else if (this.greened == 4) {
		setTimeout(function () {
			function expand(func) {
				var adjTile = game.world.getTile(mx, my);
				
				if(adjTile == null || adjTile.type == "e") {
					if(adjTile == null) game.world[func]();
					var block = new Wall(mx, my);
					game.world.setTile(mx, my, block);
				}
			}
			
			var mx = that.mx - 1, my = that.my;
			expand("expandNW");
			var mx = that.mx, my = that.my - 1;
			expand("expandNE");
			var mx = that.mx + 1, my = that.my;
			expand("expandSE");
			var mx = that.mx, my = that.my + 1;
			expand("expandSW");
			
			var ground = new Ground(that.mx, that.my)
			ground.setGreen(true);
			game.world.setTile(that.mx, that.my, ground);
		}, 1000);
	}
}

Wall.prototype.onRender = function ()
{
	var that = this;
	
	if(this.gone)
		return;
	
	if(!this.willWither) {
		setTimeout(function () { that.maybeWither(); }, 5*1000 + Math.random() * 5*1000);
		this.willWither = true;
	}
	
	if(game.playerstarted && this.greened == 0 && !this.willIndent) {
		setTimeout(function () { that.indent(); }, 5*1000 + Math.random() * 55*1000);
		this.willIndent = true;
	}
	
	function pale() {
		var adjTile = game.world.getTile(mx, my);
		
		if(adjTile != null && adjTile.type != "w" && adjTile.type != "e") {
			that.trans = true;
			return true;
		}
		
		return false;
	}
	
	this.trans = false;
	
	var mx = that.mx - 1, my = that.my;
	if(!pale()) {
		var mx = that.mx, my = that.my - 1;
		if(!pale()) {
			var mx = that.mx - 1, my = that.my - 1;
			pale();
		}
	}
	
	that.setTexture(game[
		(this.greened > 0 ? "greenstone" + that.greened : "stone") +
		(this.trans ? "Trans" : "") + "Tex"
	]);
}

Wall.prototype.indent = function ()
{
	var that = this;
	
	if(this.gone)
		return;
	
	if(this.greened == 0) {
		function indent() {
			var adjTile = game.world.getTile(mx, my);
			
			if(adjTile != null && adjTile.type == "g" && adjTile.green == false) {
				var block = new Wall(mx, my);
				game.world.setTile(mx, my, block);
				that.willIndent = false;
				return true;
			}
			return false;
		}
		
		var mx = that.mx - 1, my = that.my;
		if(indent()) return;
		var mx = that.mx, my = that.my - 1;
		if(indent()) return;
		var mx = that.mx + 1, my = that.my;
		if(indent()) return;
		var mx = that.mx, my = that.my + 1;
		if(indent()) return;
	}
	that.willIndent = false;
}

Wall.prototype.maybeWither = function ()
{
	var that = this;
	
	if(this.gone)
		return;
	
	if(game.score >= 100) {
		game.world.setTile(this.mx, this.my, new Ground(this.mx, this.my));
		this.gone = true;
	}
	else {
		setTimeout(function () { that.maybeWither(); }, 5*1000 + Math.random() * 5*1000);
		this.willWither = false;
	}
}

