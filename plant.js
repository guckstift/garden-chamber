
function Plant(x, y, kind, fullgrown)
{
	this.kind = kind;
	this.grown = 1; // 0 = dead
	this.fullgrown = fullgrown;
	this.water = 1.0;
	this.waterusage = 0.006;
	//this.waterusage = 0.009;
	this.level = 0;
	this.levelinc = 0.004;
	//this.levelinc = 0.02;
	
	Tile.call(this, x, y, "p", game[this.kind + this.grown + "Tex"]);
	
	this.waterBar = new Bar(this.water, this.x, this.y, 0, 0x4488ff);
	game.world.addChild(this.waterBar);
	this.levelBar = new Bar(this.level, this.x, this.y, 1, 0x44ff88);
	game.world.addChild(this.levelBar);
}

subclass(Plant, Tile)

var fullPlants = {
	"plant" : 0,
	"flower" : 0,
	"rose" : 0,
	"tree" : 0
};

Plant.prototype.onHover = function ()
{
	this.waterBar.alpha = 1;
	this.levelBar.alpha = 1;
}

Plant.prototype.onRender = function ()
{
	var that = this;
	
	if(this.grown > 0) {
		if (this.water > 0) {
			this.water -= this.waterusage;
			
			if (this.level < 1) {
				this.level += this.levelinc;
			}
			else if (this.grown < this.fullgrown) {
				this.grown ++;
				this.level = 0;
				this.waterusage /= 3;
				this.levelinc /= 1.5;
				this.setTexture(game[this.kind + this.grown + "Tex"]);
				
				if (this.grown == this.fullgrown) {
					if(this.kind == "tree") {
						this.anchor.set(0.5, 0.875);
					}

					fullPlants[this.kind] ++;
					game.score ++;
					
					if (fullPlants[this.kind] == 15) {
						if(this.kind == "plant")
							createPlantBtn("flower", "f", 64, 0);
						else if(this.kind == "flower")
							createPlantBtn("rose", "r", 128, 0);
						else if(this.kind == "rose")
							createPlantBtn("tree", "t", 192, 0);
					}
				}
			}
		}
		else {
			if (this.level > 0) {
				this.level -= this.levelinc;
			}
			else if (this.grown > 1) {
				if (this.grown == this.fullgrown) {
					fullPlants[this.kind] --;
					game.score --;
				}
				
				this.grown --;
				this.level = 1;
				this.waterusage *= 3;
				this.levelinc *= 2;
				this.setTexture(game[this.kind + this.grown + "Tex"]);
			}
			else if (this.grown == 1) {
				this.grown = 0;
				this.level = 0;
				this.setTexture(game.deadplantTex);
				setTimeout(function () { that.decay(); }, 5000);
			}
		}
	}
	
	if (this.grown == this.fullgrown) {
		setTimeout(function () {
			function greenAt() {
				var adjTile = game.world.getTile(mx, my);
				if(adjTile != null && adjTile.type == "w" && adjTile.greened == 0) {
					adjTile.goGreen();
				}
			}

			var mx = that.mx - 1, my = that.my;
			greenAt();
			var mx = that.mx, my = that.my - 1;
			greenAt();
			var mx = that.mx + 1, my = that.my;
			greenAt();
			var mx = that.mx, my = that.my + 1;
			greenAt();
		}, 5000);
	}
	
	// bars
	if(this.waterBar) {
		this.waterBar.val = this.water;
		this.waterBar.onRender();
	}
	if(this.levelBar) {
		this.levelBar.val = this.level;
		this.levelBar.onRender();
	}
}

Plant.prototype.decay = function ()
{
	this.waterBar.destroy();
	game.world.removeChild(this.waterBar);
	this.waterBar = null;
	this.levelBar.destroy();
	game.world.removeChild(this.levelBar);
	this.levelBar = null;
	
	var ground = new Ground(this.mx, this.my);
	game.world.setTile(this.mx, this.my, ground);
}

Plant.prototype.giveWater = function ()
{
	this.water = 1;
	game["splash" + Math.floor(Math.random()*2) + "Snd"].play();
}

