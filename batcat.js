
function BatCat()
{
	this.ani = 0;
	
	PIXI.Sprite.call(this, game.batcat1Tex);
	
	this.scale.set(0.5);
	this.anchor.set(0.5, 0.5);
	this.vx = (Math.random() - 0.5) * 2 * 10;
	this.vy = (Math.random() - 0.5) * 2 * 10;
	this.x = this.vx > 0 ? -64 : game.screenWidth + 64;
	this.y = Math.random() * game.screenHeight;
	this.gone = false;
	
	if(this.vx > 0)
		this.scale.x *= -1;
	
	this.animate();
}

subclass(BatCat, PIXI.Sprite)

BatCat.prototype.animate = function ()
{
	var that = this;
	
	if(this.gone)
		return;

	setTimeout(function() {
		requestAnimationFrame(function() {
			that.animate();
		});
	}, 1000 / fps);
	
	this.x += this.vx;
	this.y += this.vy;
	this.ani = (this.ani + 0.2) % 4;
	frame = Math.floor(this.ani);
	frame = (frame == 3) ? 2 : (frame + 1);
	
	this.setTexture(game["batcat" + frame + "Tex"]);
	
	if(this.x < -64 || this.y < -64 || this.x > game.screenWidth + 64 || this.y > game.screenHeight + 64) {
		game.screen.removeChild(this);
		this.destroy();
		this.gone = true;
	}
	
	if(Math.random() < 0.01) {
		var sound = game["cat" + Math.floor(Math.random() * 4) + "Snd"];
		
		if (this.soundid === false || !sound.howl.playing(this.soundid)) {
			var pan = this.x / game.screenWidth * 2 - 0.5;
			this.soundid = sound.play(false, pan);
		}
	}
}
