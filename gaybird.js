
function GayBird()
{
	this.ani = 0;
	
	PIXI.Sprite.call(this, game.gaybird1Tex);
	
	this.scale.set(0.5);
	this.anchor.set(0.5, 0.5);
	this.vx = 1 + (Math.random() - 0.5) * 2 * 10;
	this.vy = 1 + (Math.random() - 0.5) * 2 * 5;
	this.x = this.vx > 0 ? -72 : game.screenWidth + 72;
	this.y = Math.random() * game.screenHeight;
	this.gone = false;
	this.soundid = false;
	
	if(this.vx > 0)
		this.scale.x *= -1;
	
	this.animate();
}

subclass(GayBird, PIXI.Sprite)

GayBird.prototype.animate = function ()
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
	this.ani = (this.ani + 0.3) % 8;
	frame = Math.floor(this.ani);
	frame =
		(frame == 5) ? 4 :
		(frame == 6) ? 3 :
		(frame == 7) ? 2 :
		(frame + 1);
	
	this.setTexture(game["gaybird" + frame + "Tex"]);
	
	if(this.x < -72 || this.y < -25 || this.x > game.screenWidth + 72 || this.y > game.screenHeight + 25) {
		game.screen.removeChild(this);
		this.destroy();
		this.gone = true;
	}
	else if(Math.random() < 0.01) {
		var sound = game["peep" + Math.floor(Math.random()*4) + "Snd"];
		
		if (this.soundid === false || !sound.howl.playing(this.soundid)) {
			var pan = this.x / game.screenWidth * 2 - 0.5;
			this.soundid = sound.play(false, pan);
		}
	}
}
