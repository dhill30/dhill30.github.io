var AM = new AssetManager();

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale || 1;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth + this.startX, yindex * this.frameHeight + this.startY,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

// custom sprite ()
function Wizard(game, spriteSheet) {
    this.idle = new Animation(spriteSheet, 0, 0, 80, 80, 10, 0.6, 2, true, 1.5);
    this.idleleft = new Animation(spriteSheet, 0, 0, 80, 80, 10, 0.15, 18, false, 1.5);
    this.idleright = new Animation(spriteSheet, 0, 480, 80, 80, 10, 0.15, 18, false, 1.5);
    this.dashleft = new Animation(spriteSheet, 0, 160, 80, 80, 10, 0.15, 10, false, 1.5);
    this.dashright = new Animation(spriteSheet, 0, 640, 80, 80, 10, 0.15, 10, false, 1.5);
    this.shootleft = new Animation(spriteSheet, 0, 240, 80, 80, 10, 0.15, 14, false, 1.5);
    this.shootright = new Animation(spriteSheet, 0, 720, 80, 80, 10, 0.15, 14, false, 1.5);
    this.dieleft = new Animation(spriteSheet, 0, 400, 80, 80, 10, 0.15, 10, false, 1.5);
    this.dieright = new Animation(spriteSheet, 0, 880, 80, 80, 10, 0.15, 10, false, 1.5);
    this.speed = 1.5;
    this.vertical = 0;
    this.doing = false;
    this.ctx = game.ctx;
    Entity.call(this, game, 320, 320);
}

Wizard.prototype = new Entity();
Wizard.prototype.constructor = Wizard;

Wizard.prototype.update = function() {
    // determines if wizard should die
    if (this.x < 60 || this.x > 620 || this.y < 60 || this.y > 620) {
        if (this.left) this.ldying = true;
        else this.rdying = true;
        this.doing = true;
    }
    if (this.ldying) {
        if (this.dieleft.isDone()) {
            this.dieleft.elapsedTime = 0;
            this.x = 320;
            this.y = 320;
            this.ldying = false;
            this.lidling = true;
            this.doing = false;
        }
    }
    if (this.rdying) {
        if (this.dieright.isDone()) {
            this.dieright.elapsedTime = 0;
            this.x = 320;
            this.y = 320;
            this.rdying = false;
            this.ridling = true;
            this.doing = false;
        }
    }

    // pseudo-random action selection
    if (!this.doing) {
        this.doing = true;
        var action = Math.floor(Math.random() * 10);
        if (action < 2) this.lidling = true;
        else if (action < 4) this.ridling = true;
        else if (action < 6) this.ldashing = true;
        else if (action < 8) this.rdashing = true;
        else if (action == 8) this.lshooting = true;
        else this.rshooting = true;
        this.vertical = (Math.random() * 2 - 1);
    }
    if (this.lidling) {
        if (this.idleleft.isDone()) {
            this.idleleft.elapsedTime = 0;
            this.lidling = false;
            this.left = true;
            this.doing = false;
        }
    }
    if (this.ridling) {
        if (this.idleright.isDone()) {
            this.idleright.elapsedTime = 0;
            this.ridling = false;
            this.left = false;
            this.doing = false;
        }
    }
    if (this.ldashing) {
        this.x -= this.speed;
        this.y += this.vertical;
        if (this.dashleft.isDone()) {
            this.dashleft.elapsedTime = 0;
            this.ldashing = false;
            this.left = true;
            this.doing = false;
        }
    }
    if (this.rdashing) {
        this.x += this.speed;
        this.y += this.vertical;
        if (this.dashright.isDone()) {
            this.dashright.elapsedTime = 0;
            this.rdashing = false;
            this.left = false;
            this.doing = false;
        }
    }
    if (this.lshooting) {
        if (this.shootleft.isDone()) {
            this.shootleft.elapsedTime = 0;
            this.lshooting = false;
            this.left = true;
            this.doing = false;
        }
    }
    if (this.rshooting) {
        if (this.shootright.isDone()) {
            this.shootright.elapsedTime = 0;
            this.rshooting = false;
            this.left = false;
            this.doing = false;
        }
    }
    Entity.prototype.update.call(this);
}

Wizard.prototype.draw = function () {
    if (this.ldashing) this.dashleft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    else if (this.rdashing) this.dashright.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    else if (this.lidling) this.idleleft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    else if (this.ridling) this.idleright.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    else if (this.lshooting) this.shootleft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    else if (this.rshooting) this.shootright.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    else if (this.ldying) this.dieleft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    else if (this.rdying) this.dieright.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    else this.idle.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}


AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/wizard.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Wizard(gameEngine, AM.getAsset("./img/wizard.png")));

    console.log("All Done!");
});