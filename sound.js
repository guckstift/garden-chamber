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

Sound.prototype.play = function (looped, pan)
{
	looped = looped || false;
	pan = pan || 0;
	
	this.howl.loop (looped);
	var id = this.howl.play ();
	console.log(pan);
	this.howl.stereo (pan, id);
	return id;
}

Sound.prototype.stop = function ()
{
	this.howl.stop ();
}

