function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, angle, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;

    ctx.setTransform(1, 0, 0, 1, locX, locY);
    ctx.rotate(angle);
    ctx.drawImage(this.spriteSheet,
        index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
        this.frameWidth, this.frameHeight, -this.frameWidth / 2, -this.frameHeight / 2,
        this.frameWidth * scaleBy, this.frameHeight * scaleBy);
    ctx.rotate(angle);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// the "main" code begins here
var friction = 8;
var acceleration = 100;
var maxSpeed = 150;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/thug_bat_red.png");
ASSET_MANAGER.queueDownload("./img/thug_knife_red.png");
ASSET_MANAGER.queueDownload("./img/thug_bat_green.png");
ASSET_MANAGER.queueDownload("./img/thug_knife_green.png");
ASSET_MANAGER.queueDownload("./img/thug_bat_blue.png");
ASSET_MANAGER.queueDownload("./img/thug_knife_blue.png");
ASSET_MANAGER.queueDownload("./img/thug_bat_yellow.png");
ASSET_MANAGER.queueDownload("./img/thug_knife_yellow.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    // Red army
    var red1 = new Knifer(gameEngine, 'red');
    var red2 = new Batter(gameEngine, 'red');
    var red3 = new Knifer(gameEngine, 'red');
    var red4 = new Batter(gameEngine, 'red');
    var red5 = new Knifer(gameEngine, 'red');

    // Green army
    var green1 = new Knifer(gameEngine, 'green');
    var green2 = new Batter(gameEngine, 'green');
    var green3 = new Knifer(gameEngine, 'green');
    var green4 = new Batter(gameEngine, 'green');
    var green5 = new Knifer(gameEngine, 'green');

    // Blue army
    var blue1 = new Knifer(gameEngine, 'blue');
    var blue2 = new Batter(gameEngine, 'blue');
    var blue3 = new Knifer(gameEngine, 'blue');
    var blue4 = new Batter(gameEngine, 'blue');
    var blue5 = new Knifer(gameEngine, 'blue');

    // Yellow army
    var yellow1 = new Knifer(gameEngine, 'yellow');
    var yellow2 = new Batter(gameEngine, 'yellow');
    var yellow3 = new Knifer(gameEngine, 'yellow');
    var yellow4 = new Batter(gameEngine, 'yellow');
    var yellow5 = new Knifer(gameEngine, 'yellow');

    gameEngine.addEntity(red1);
    gameEngine.addEntity(green1);
    gameEngine.addEntity(blue1);
    gameEngine.addEntity(yellow1);
    gameEngine.addEntity(red2);
    gameEngine.addEntity(green2);
    gameEngine.addEntity(blue2);
    gameEngine.addEntity(yellow2);
    gameEngine.addEntity(red3);
    gameEngine.addEntity(green3);
    gameEngine.addEntity(blue3);
    gameEngine.addEntity(yellow3);
    gameEngine.addEntity(red4);
    gameEngine.addEntity(green4);
    gameEngine.addEntity(blue4);
    gameEngine.addEntity(yellow4);
    gameEngine.addEntity(red5);
    gameEngine.addEntity(green5);
    gameEngine.addEntity(blue5);
    gameEngine.addEntity(yellow5);

    gameEngine.init(ctx);
    gameEngine.start();
});
