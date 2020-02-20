function Agent(game, x, y) {
    this.rotation = 0;
    this.velocity = { x: 0, y: 0 };
    this.health = 10;
    this.atkCD = 0;
    this.hitCD = 0;
    this.healCD = 0;

    Entity.call(this, game, x, y);
}

Agent.prototype = new Entity();
Agent.prototype.constructor = Agent;

Agent.prototype.update = function () {
    if (this.healCD > 0) this.healCD--;
    if (this.atkCD > 0) this.atkCD--;
    if (this.hitCD > 0) this.hitCD--;
    else this.hurt = false;

    if (this.health <= 0) this.removeFromWorld = true;

    if (this.hurt && this.hit.isDone()) {
        this.hit.elapsedTime = 0;
        this.hurt = false;
    }
    if (this.attacking) {
        if (this.atk.isDone()) {
            this.atk.elapsedTime = 0;
            this.attacking = false;
            this.atkCD = this.endLag;
        }
        else {
            this.velocity.x *= 5 / 7;
            this.velocity.y *= 5 / 7;
        }
    }

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * (1 / friction);
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 1200 - this.radius;
    }
    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * (1 / friction);
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 1200 - this.radius;
    }

    var nearest = 10000;
    var index = 0;
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        var dist = distance(this, ent);
        if (ent.team != this.team) {
            if (dist < nearest) {
                nearest = dist;
                index = i;
            }
            else if (dist == nearest) {
                var rand = Math.floor(Math.random() * 2);
                if (rand == 1) {
                    nearest = dist;
                    index = i;
                }
            }
        }
        var difX = Math.cos(this.rotation);
        var difY = Math.sin(this.rotation);
        var delta = this.radius + ent.radius - dist;
        if (this.collide(ent)) {
            if (ent.team == this.team && ent.healCD <= 0) {
                ent.health++;
                ent.healCD = 180;
            }
            this.velocity.x = -this.velocity.x * (1 / friction);
            this.velocity.y = -this.velocity.y * (1 / friction);
            this.x -= difX * delta / 2;
            this.y -= difY * delta / 2;
            ent.x += difX * delta / 2;
            ent.y += difY * delta / 2;
        }
        if (ent.team != this.team && this.attacking && ent.hitCD <= 0 && this.checkHit(ent)
            && this.atkCD > (100 - this.hitDur) && this.atkCD <= 100) {
            ent.hurt = true;
            ent.health--;
            ent.hitCD = this.hitDur;
        }
    }
    var target = this.game.entities[index];
    if (target.team != this.team) {
        this.rotation = Math.atan2(target.y - this.y, target.x - this.x);
        var difX = Math.cos(this.rotation);
        var difY = Math.sin(this.rotation);
        this.velocity.x += difX * acceleration;
        this.velocity.y += difY * acceleration;
        if (distance(this, target) < (this.range + target.radius / 2) && this.atkCD <= 0) {
            this.attacking = true;
            this.atkCD = this.begLag;
        }
    }

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    this.velocity.x -= friction * this.game.clockTick * this.velocity.x;
    this.velocity.y -= friction * this.game.clockTick * this.velocity.y;
}

Agent.prototype.draw = function (ctx) {
    if (this.hurt)
        this.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.attacking)
        this.atk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else {
        if (this.velocity.x > -5 && this.velocity.x < 5 && this.velocity.y > -5 && this.velocity.y < 5)
            this.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        else
            this.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    }
}

Agent.prototype.checkHit = function (other) {
    var acc = Math.abs(this.rotation - Math.atan2(other.y - this.y, other.x - this.x));
    if (acc > Math.PI) acc = (Math.PI * 2) - acc;

    var orien = Math.abs(this.rotation - other.rotation);
    if (orien > Math.PI) orien = (Math.PI * 2) - orien;

    var dist = distance(this, other);
    if ((dist < 75 && acc < Math.PI / 6)
        || (this.weapon == 'bat' && acc < Math.PI * 2 / 5)
        || acc < Math.PI / 8) {
        if (orien < Math.PI / 4 || orien > Math.PI * 3 / 4)
            return dist < this.range + other.faces;
        else
            return dist < this.range + other.sides;
    }
    else
        return false;
}

function Batter(game, team, x, y) {
    // animations
    this.idle = new Animation(ASSET_MANAGER.getAsset('./img/thug_bat_' + team + '.png'), 0, 0, 200, 200, 0.12, 1, true, false);
    this.move = new Animation(ASSET_MANAGER.getAsset('./img/thug_bat_' + team + '.png'), 0, 0, 200, 200, 0.12, 8, true, false);
    this.atk = new Animation(ASSET_MANAGER.getAsset('./img/thug_bat_' + team + '.png'), 0, 200, 200, 300, 0.15, 4, false, false);
    this.hit = new Animation(ASSET_MANAGER.getAsset('./img/thug_bat_' + team + '.png'), 0, 500, 200, 200, 0.15, 1, false, false);

    // properties
    this.team = team;
    this.radius = 24;
    this.faces = 28;
    this.sides = 38;
    this.weapon = 'bat';
    this.range = 110;
    this.begLag = 116;
    this.endLag = 65;
    this.hitDur = 20;

    Agent.call(this, game, x, y);
}

Batter.prototype = new Agent();
Batter.prototype.constructor = Batter;

function Knifer(game, team, x, y) {
    // animations
    this.idle = new Animation(ASSET_MANAGER.getAsset('./img/thug_knife_' + team + '.png'), 0, 0, 200, 200, 0.12, 1, true, false);
    this.move = new Animation(ASSET_MANAGER.getAsset('./img/thug_knife_' + team + '.png'), 0, 0, 200, 200, 0.12, 8, true, false);
    this.atk = new Animation(ASSET_MANAGER.getAsset('./img/thug_knife_' + team + '.png'), 0, 200, 200, 200, 0.1, 4, false, false);
    this.hit = new Animation(ASSET_MANAGER.getAsset('./img/thug_knife_' + team + '.png'), 0, 400, 200, 200, 0.15, 1, false, false);

    // properties
    this.team = team;
    this.radius = 24;
    this.faces = 32;
    this.sides = 38;
    this.weapon = 'knife';
    this.range = 85;
    this.begLag = 110;
    this.endLag = 45;
    this.hitDur = 14;

    Agent.call(this, game, x, y);
}

Knifer.prototype = new Agent();
Knifer.prototype.constructor = Knifer;
