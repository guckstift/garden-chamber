function Sound (src, onLoadCallback)
{
	var self = this;
	
	this.howl = new Howl ({
		src: [src],
		onload: function () {
			if(onLoadCallback)
				onLoadCallback (self);
		},
	});
}

Sound.prototype.play = function (looped, pan, vol)
{
	looped = looped || false;
	pan = pan || 0;
	vol = vol || 1;
	
	this.howl.loop (looped);
	var id = this.howl.play ();
	this.howl.stereo (Math.min(1, Math.max(-1, pan)), id);
	this.howl.volume (vol, id);
	return id;
}

Sound.prototype.stop = function ()
{
	this.howl.stop ();
}

