
function Particle()
{
	this.vx = (Math.random() - 0.5) * 20;
	this.vy = (Math.random() - 0.25) * 20;
	this.vr = (Math.random() - 0.5) * 0.5;
	
	PIXI.Sprite.call(this, game[
		["plant", "flower", "rose", "tree"][Math.floor(Math.random()*4)] + "btnTex"
	]);
	this.anchor.set(0.5, 0.5);
	this.position.set(
		game.screenWidth/2,
		0
	);
	this.scale.set(0.5 + Math.random() * 1.5);
}

subclass(Particle, PIXI.Sprite)

Particle.prototype.onRender = function()
{
	this.x += this.vx;
	this.y += this.vy;
	this.vy += 0.25;
	this.rotation += this.vr;
	this.alpha -= 0.01;
}
