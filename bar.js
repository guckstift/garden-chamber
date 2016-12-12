
function Bar(val, x, y, offs, col)
{
	this.val = val;
	this.offs = offs;
	this.col = col;
	PIXI.Graphics.call(this);
	this.position.set(x, y);
}

subclass(Bar, PIXI.Graphics)

Bar.prototype.onRender = function ()
{
	if (this.alpha > 0)
		this.alpha -= 0.002;

	this.clear();
		
	this.beginFill(this.col);
	this.lineStyle(1, 0, 1);
	this.drawRect(
		- 16, 8 + this.offs*8,
		32 * this.val, 4);
	this.endFill();
	
	/*this.beginFill(0x880000);
	this.drawRect(
		- 16 + this.val * 32, 8 + this.offs*8,
		32 * (1-this.val), 4);
	this.endFill();*/
}

