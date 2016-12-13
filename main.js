var
	game
;
var
	SPACE = 32,
	ARROWDOWN = 40,
	ARROWLEFT = 37,
	ARROWRIGHT = 39,
	ARROWUP = 38,
	vel = 9,
	fps = 30
;

$(main);

function main()
{
	game = {
		keymap: {},
		tool: "p",
		scrolling: false,
		score: 0
	};
	
	// create renderer
	game.renderer = PIXI.autoDetectRenderer(800, 600);
	game.renderer.backgroundColor = 0x000000;
	game.renderer.view.style.position = "absolute";
	game.renderer.view.style.display = "block";
	game.renderer.autoResize = true;
	
	// create stage
	game.world = new World();
	
	game.bg = new PIXI.Container();
	
	game.screen = new PIXI.Container();
	
	game.lblScore = new PIXI.Text("Hello", {fontFamily: "sans", font: "32px sans-serif", fill: 0x00ff00});
	game.lblScore.anchor.set(1, 0);
	game.screen.addChild(game.lblScore);
	
	game.stage = new PIXI.Container();
	game.stage.addChild(game.bg);
	game.stage.addChild(game.world);
	game.stage.addChild(game.screen);
	
	$("body").append(game.renderer.view);

	// load images	
	PIXI.loader
		.add("textures", "images/textures.json")
		.add("batcat", "images/batcat.json")
		.add("gaybird", "images/gaybird.json")
		.add("sky1", "images/sky1.jpg")
		.add("sky2", "images/sky2.jpg")
		.load(onImagesLoaded)
	;
	
	game.peep0Snd = new Sound("sounds/peep1.ogg");
	game.peep1Snd = new Sound("sounds/peep2.ogg");
	game.peep2Snd = new Sound("sounds/peep3.ogg");
	game.peep3Snd = new Sound("sounds/futfut.ogg");
	game.cat0Snd = new Sound("sounds/fauch.ogg");
	game.cat1Snd = new Sound("sounds/knurr.ogg");
	game.cat2Snd = new Sound("sounds/meow.ogg");
	game.cat3Snd = new Sound("sounds/meow2.ogg");
	game.splash0Snd = new Sound("sounds/splash1.ogg");
	game.splash1Snd = new Sound("sounds/splash2.ogg");
	game.blopSnd = new Sound("sounds/blop.ogg");
	
	game.darkMusic = new Sound("sounds/musicdark.ogg");
	game.lightMusic = new Sound("sounds/musiclight.ogg");
}

function onImagesLoaded()
{
	var textures = PIXI.loader.resources["textures"].textures;
	
	game["stoneTex"] = textures["block-stone.png"];
	game["greenstone1Tex"] = textures["block-greenstone1.png"];
	game["greenstone2Tex"] = textures["block-greenstone2.png"];
	game["greenstone3Tex"] = textures["block-greenstone3.png"];
	game["greenstone4Tex"] = textures["block-greenstone4.png"];
	game["stoneTransTex"] = textures["block-stone-t.png"];
	game["greenstone1TransTex"] = textures["block-greenstone1-t.png"];
	game["greenstone2TransTex"] = textures["block-greenstone2-t.png"];
	game["greenstone3TransTex"] = textures["block-greenstone3-t.png"];
	game["greenstone4TransTex"] = textures["block-greenstone4-t.png"];
	game["groundTex"] = textures["ground.png"];
	game["grassTex"] = textures["grass.png"];
	game["blockgroundTex"] = textures["blockground.png"];
	game["plant1Tex"] = textures["plant1.png"];
	game["plant2Tex"] = textures["plant2.png"];
	game["plant3Tex"] = textures["plant3.png"];
	game["flower1Tex"] = textures["flower1.png"];
	game["flower2Tex"] = textures["flower2.png"];
	game["flower3Tex"] = textures["flower3.png"];
	game["flower4Tex"] = textures["flower4.png"];
	game["rose1Tex"] = textures["rose1.png"];
	game["rose2Tex"] = textures["rose2.png"];
	game["rose3Tex"] = textures["rose3.png"];
	game["rose4Tex"] = textures["rose4.png"];
	game["rose5Tex"] = textures["rose5.png"];
	game["tree1Tex"] = textures["tree1.png"];
	game["tree2Tex"] = textures["tree2.png"];
	game["tree3Tex"] = textures["tree3.png"];
	game["tree4Tex"] = textures["tree4.png"];
	game["tree5Tex"] = textures["tree5.png"];
	game["tree6Tex"] = textures["tree6.png"];
	game["selectionTex"] = textures["selection.png"];
	game["deadplantTex"] = textures["deadplant.png"];
	game["selectedTex"] = textures["selected.png"];
	game["waterbtnTex"] = textures["waterbtn.png"];
	game["plantbtnTex"] = textures["plantbtn.png"];
	game["flowerbtnTex"] = textures["flowerbtn.png"];
	game["rosebtnTex"] = textures["rosebtn.png"];
	game["treebtnTex"] = textures["treebtn.png"];
	game["sky1Tex"] = textures["sky1.jpg"];
	game["sky2Tex"] = textures["sky2.jpg"];
	game["crossTex"] = textures["cross.png"];
	
	var textures = PIXI.loader.resources["batcat"].textures;

	game["batcat1Tex"] = textures["batcat1.png"];
	game["batcat2Tex"] = textures["batcat2.png"];
	game["batcat3Tex"] = textures["batcat3.png"];
	
	var textures = PIXI.loader.resources["gaybird"].textures;
	
	game["gaybird1Tex"] = textures["bird1.png"];
	game["gaybird2Tex"] = textures["bird2.png"];
	game["gaybird3Tex"] = textures["bird3.png"];
	game["gaybird4Tex"] = textures["bird4.png"];
	game["gaybird5Tex"] = textures["bird5.png"];
	
	for(var res in PIXI.loader.resources) {
		game[res + "Tex"] = PIXI.loader.resources[res].texture;
	}
	
	game.sky1 = new PIXI.Sprite(game.sky1Tex);
	game.bg.addChild(game.sky1);
	game.sky2 = new PIXI.Sprite(game.sky2Tex);
	game.bg.addChild(game.sky2);

	game.world.onImagesLoaded();
	
	// Menu
	
	game.selectedbtn = new PIXI.Sprite(game.selectedTex);
	game.screen.addChild(game.selectedbtn);
	
	createPlantBtn("plant", "p", 0, 0);

	game.waterbtn = new PIXI.Sprite(game.waterbtnTex);
	game.waterbtn.y = 64;
	game.waterbtn.defaultCursor = "pointer";
	game.waterbtn.interactive = true;
	game.waterbtn.buttonMode = true;
	game.waterbtn.on("mousedown", function () {
		game.tool = "w";
		game.selectedbtn.position = game.waterbtn.position;
		game.toolCursor.setTexture(game.waterbtnTex);
	});
	game.screen.addChild(game.waterbtn);
	
	game.toolCursor = new PIXI.Sprite(game.plantbtnTex);
	game.toolCursor.anchor.set(0.5, 0.5);
	game.toolCursor.scale.set(0.5, 0.5);
	game.screen.addChild(game.toolCursor);
	
	// setup view
	onResizeWindow();	
	$(window).resize(onResizeWindow);
	
	// setup event listeners
	document.addEventListener ("keydown", onKeydown);
	document.addEventListener ("keyup", onKeyup);
	document.addEventListener ("mousedown", onMousdown);
	document.addEventListener ("mouseup", onMousup);
	document.addEventListener ("mousemove", onMousmove);
	
	// spawn batcat or gay bird
	setTimeout(spawnGuy, 1000);
	
	// start music
	game.darkTrack = game.darkMusic.play(true);
	game.lightTrack = game.lightMusic.play(true);
	
	gameLoop();
}

function gameLoop()
{
	setTimeout(function() {requestAnimationFrame(gameLoop);}, 1000 / fps);
	
	// update labels
	game.lblScore.setText("Score: " + game.score);
	
	// update sky
	game.sky2.alpha = Math.min(1, game.score / 100);
	
	// update music
	game.darkMusic.howl.volume(1 - game.score/100, game.darkTrack);
	game.lightMusic.howl.volume(game.score/100, game.lightTrack);

	// render frame
	game.world.onRender();
	game.renderer.render(game.stage);
}

function onResizeWindow()
{
	game.screenWidth = window.innerWidth;
	game.screenHeight = window.innerHeight;
	game.renderer.resize(game.screenWidth, game.screenHeight);
	game.world.onResize(game.screenWidth, game.screenHeight);

	var ratioW = game.screenWidth / 1024;
	var ratioH = game.screenHeight / 768;
	var ratio = Math.max(ratioW,ratioH)

	game.sky1.scale.set(ratio);
	game.sky2.scale.set(ratio);

	game.lblScore.position.set(game.screenWidth - 32, 32);
}

function onKeydown(e)
{
	game.keymap[e.keyCode] = true;
}

function onKeyup(e)
{
	game.keymap[e.keyCode] = false;
}

function onMousdown(e)
{
	if (e.button == 2) {
		lockPointer();
		game.scrolling = true;
		game.toolCursorOld = game.toolCursor.texture;
		game.toolCursor.setTexture(game.crossTex);
		game.toolCursor.scale.set(1);
		e.preventDefault();
	}
}

function onMousup(e)
{	
	if(game.scrolling) {
		releasePointer ();
		game.scrolling = false;
		game.toolCursor.scale.set(0.5);
		game.toolCursor.setTexture(game.toolCursorOld);
	}
	else {
		var mouseX = e.clientX;
		var mouseY = e.clientY;
		var mapCoord = game.world.screenToMap(mouseX, mouseY);
		var tile = game.world.getTile(mapCoord[0], mapCoord[1]);
	
		if(["p","f","r","t"].indexOf(game.tool) != -1 && tile != null && tile.type == "g") {
			if(game.tool == "p") {
				var plant = new Plant(mapCoord[0], mapCoord[1], "plant", 3);
			}
			else if(game.tool == "f") {
				var plant = new Plant(mapCoord[0], mapCoord[1], "flower", 4);
			}
			else if(game.tool == "r") {
				var plant = new Plant(mapCoord[0], mapCoord[1], "rose", 5);
			}
			else if(game.tool == "t") {
				var plant = new Plant(mapCoord[0], mapCoord[1], "tree", 6);
			}
			game.world.setTile(mapCoord[0], mapCoord[1], plant);
			game.blopSnd.play();
		}
		else if(game.tool == "w" && tile != null && tile.type == "p" && tile.state != "d") {
			tile.giveWater();
		}
	}
}

function onMousmove(e)
{
	//game.renderer.view.style.cursor = "none";
	
	if (game.scrolling) {
		game.scrolled = true;
		game.world.camX -= e.movementX;
		game.world.camY -= e.movementY;
	}
	else {
		var mouseX = e.clientX;
		var mouseY = e.clientY;
		var mapCoord = game.world.screenToMap(mouseX, mouseY);
		var tile = game.world.getTile(mapCoord[0], mapCoord[1]);

		if (tile != null) {
			tile.onHover();
			game.world.selection.position = tile.position;
		}
		
		game.toolCursor.x = mouseX;
		game.toolCursor.y = mouseY;
	}
}
	
function createPlantBtn(name, tool, x, y)
{
	var btn = new PIXI.Sprite(game[name + "btnTex"]);
	btn.defaultCursor = "pointer";
	btn.interactive = true;
	btn.buttonMode = true;
	btn.x = x;
	btn.y = y;
	btn.on("mousedown", function () {
		game.tool = tool;
		game.selectedbtn.position = btn.position;
		game.toolCursor.setTexture(game[name + "btnTex"]);
	});
	game.screen.addChild(btn);
	game[name + "btn"] = btn;
}

function lockPointer ()
{
	if (game.renderer.view.requestPointerLock)
		game.renderer.view.requestPointerLock ();
}

function releasePointer ()
{
	if(document.exitPointerLock)
		document.exitPointerLock ();
}

function spawnGuy()
{
	if (Math.random() > game.score/100)
		game.screen.addChild(new BatCat());
	else
		game.screen.addChild(new GayBird());
	setTimeout(spawnGuy, 2000 + Math.random() * 1000 * 2);
}
