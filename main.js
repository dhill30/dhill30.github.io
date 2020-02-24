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
var friction = 5;
var acceleration = 65;
var maxSpeed = 150;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/thug_bat_red.png");
ASSET_MANAGER.queueDownload("./img/thug_knife_red.png");
ASSET_MANAGER.queueDownload("./img/bodyguard_red.png");
ASSET_MANAGER.queueDownload("./img/thug_bat_green.png");
ASSET_MANAGER.queueDownload("./img/thug_knife_green.png");
ASSET_MANAGER.queueDownload("./img/bodyguard_green.png");
ASSET_MANAGER.queueDownload("./img/thug_bat_blue.png");
ASSET_MANAGER.queueDownload("./img/thug_knife_blue.png");
ASSET_MANAGER.queueDownload("./img/bodyguard_blue.png");
ASSET_MANAGER.queueDownload("./img/thug_bat_yellow.png");
ASSET_MANAGER.queueDownload("./img/thug_knife_yellow.png");
ASSET_MANAGER.queueDownload("./img/bodyguard_yellow.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    // Red army
    var red1 = new Knifer(gameEngine, 'red', 150, 450);
    var red2 = new Knifer(gameEngine, 'red', 150, 550);
    var red3 = new Knifer(gameEngine, 'red', 150, 650);
    var red4 = new Knifer(gameEngine, 'red', 150, 750);
    var red5 = new Batter(gameEngine, 'red', 75, 500);
    var red6 = new Batter(gameEngine, 'red', 75, 700);
    var red7 = new Slammer(gameEngine, 'red', 75, 600);

    // Green army
    var green1 = new Knifer(gameEngine, 'green', 450, 150);
    var green2 = new Knifer(gameEngine, 'green', 550, 150);
    var green3 = new Knifer(gameEngine, 'green', 650, 150);
    var green4 = new Knifer(gameEngine, 'green', 750, 150);
    var green5 = new Batter(gameEngine, 'green', 500, 75);
    var green6 = new Batter(gameEngine, 'green', 700, 75);
    var green7 = new Slammer(gameEngine, 'green', 600, 75);

    // Blue army
    var blue1 = new Knifer(gameEngine, 'blue', 1050, 450);
    var blue2 = new Knifer(gameEngine, 'blue', 1050, 550);
    var blue3 = new Knifer(gameEngine, 'blue', 1050, 650);
    var blue4 = new Knifer(gameEngine, 'blue', 1050, 750);
    var blue5 = new Batter(gameEngine, 'blue', 1125, 500);
    var blue6 = new Batter(gameEngine, 'blue', 1125, 700);
    var blue7 = new Slammer(gameEngine, 'blue', 1125, 600);

    // Yellow army
    var yellow1 = new Knifer(gameEngine, 'yellow', 450, 1050);
    var yellow2 = new Knifer(gameEngine, 'yellow', 550, 1050);
    var yellow3 = new Knifer(gameEngine, 'yellow', 650, 1050);
    var yellow4 = new Knifer(gameEngine, 'yellow', 750, 1050);
    var yellow5 = new Batter(gameEngine, 'yellow', 500, 1125);
    var yellow6 = new Batter(gameEngine, 'yellow', 700, 1125);
    var yellow7 = new Slammer(gameEngine, 'yellow', 600, 1125);


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
    gameEngine.addEntity(red6);
    gameEngine.addEntity(green6);
    gameEngine.addEntity(blue6);
    gameEngine.addEntity(yellow6);
    gameEngine.addEntity(red7);
    gameEngine.addEntity(green7);
    gameEngine.addEntity(blue7);
    gameEngine.addEntity(yellow7);

    gameEngine.init(ctx);
    gameEngine.start();
});
