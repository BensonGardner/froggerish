/* This app.js file contains the code that sets up how the Player, Enemy, and
Gem classes will run in the game, what happens when the player collides with
an enemy or gem, or wins the game, etc.

Code written by Benson Gardner for Classic Arcade Game Clone Project. */

'use strict';

/* All bugs will be pushed into the allEnemies array. The modifier increases
 for extra challenge if game is won. lastBugTime governs how quickly bugs
 appear.*/

var allEnemies = [],
    speedModifier = 2,
    lastBugTime;

// Create a superclass to apply to player, enemies, and gems.

var Entity = function() {
    this.x = -101;
    this.y = (((Math.round(Math.random() * 2)) + 1) * 83) + this.placementAdjust;
    this.width = 101;
    this.height = 171;
}

// This is a reset function used for the enemies and the gem. It sets a starting
// point to the left of the visible canvas and in a randomly selected row of
// stones.

Entity.prototype.start = function(extraTime) {
    this.x = -101;
    this.y = (((Math.round(Math.random() + Math.random())) + 1) * 83) + this.placementAdjust;
    this.cycleStart(extraTime);
}

// All of the moving pieces in the game use resources.js functionality to load
// their images.

Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,
        this.width, this.height);
}

// This function will be used to determine when the "power up" gem appears and
// disappears, and when scared bugs turn normal again.

Entity.prototype.cycleStart = function(extraTime) {
    this.cycleStartTime = Date.now() + extraTime;
}

// Enemies our player must avoid

var Enemy = function() {
    Entity.call(this);
    lastBugTime = Date.now();
    allEnemies.push(this);
    this.placementAdjust = -20;
    this.start.call(this);

    // Set speed in pixels per second (101 is the column width). Later, it
    // will interact with the dt parameter, a variable computed as the portion
    // of a second which has passed between ticks.

    this.speed = (101 * ((Math.random() * 3) + speedModifier));
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.start = function() {

    // The image for our enemies. This method uses
    // a helper we've provided to easily load images

    this.sprite = 'images/enemy-bug.png';

    // Call the Entity.start method to set the starting spot of enemy.

    Entity.start.call(this, 0);
};

// We will need this later.

Enemy.scared = false;

// Update the enemy's position, required method for game.
// Parameter: dt, a time delta -- the portion of a second which passed
// between ticks

Enemy.prototype.update = function(dt) {

    // Check for collisions between player and bugs

    if (((player.x + 33) <= (this.x + 98)) && ((player.x + 50) >=
        (this.x + 2)) && (player.y == (this.y +10))) {

        // Provided the bug isn't "scared" into powerlessness
        // by player powering up with a gem, colliding restarts game.

        if (Enemy.scared === false) {
            player.reset.call(player);
            Enemy.createFirstBug();

        // But if the bug is scared, player wins: recyle bug.

        } else {
            this.start.call(this, 0);
        }
    }

    // If no collision, then update position. First check if bugs are "scared."

    if (Enemy.scared === false) {

        // If not scared, simply multiply movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.

        this.x = this.x + this.speed * dt;
    } else {

    // If scared, the bugs move more slowly and change to a different color.
    // They also run away from the player.

        if (this.x > player.x) {
            this.x = this.x + (this.speed * 0.45 * dt);
        } else {
            this.x = this.x - (this.speed * 0.45 * dt);
        }
    }

    // Next two lines return bugs to a starting position and sprite any time
    // they leave the screen.

    if (this.x > 505 || this.x < -101) {
        this.start.call(this);
    }
};

Enemy.prototype.render = function() {

    // Use scared version of bug image until 4 seconds have passed since gem
    // made them scared.
    // After 4 seconds, revert to original image and set scared to false.

    if (Enemy.scared === true && Date.now() - gem.cycleStartTime < -1000) {
        this.sprite = 'images/enemy-bug-scared.png';
    } else {
        this.sprite = 'images/enemy-bug.png';
        Enemy.scared = false;
    }

    // Then render as any other entity

    Entity.prototype.render.call(this);

    // Generate another enemy if a suitable amount of time has passed.
    // (This code deliberately creates more enemies than in the provided demo.)

    if ((Date.now() - lastBugTime >= (Math.random() * 1000) + 250) &&
        (allEnemies.length < 10)) {
        var newBug = new Enemy();
    }
};

Enemy.createFirstBug = function() {
    allEnemies = [];
    Enemy.scared = false;
    var bug = new Enemy();
};

var Player = function() {
    this.placementAdjust = 0;
    Entity.call(this);
    this.reset();
    this.sprite = 'images/char-cat-girl.png';
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.handleInput = function(e){
    if (e == "left") {
        this.x = Math.max(0, (this.x - 101));
    }
    if (e == "right") {
        this.x = Math.min(101 * 4, (this.x + 101));
    }
    if (e == "up") {
        this.y = Math.max(-10, (this.y - 83));
    }
    if (e == "down") {
        this.y = Math.min((83 * 5) - 10, (this.y + 83));
    }
};

Player.prototype.update = function() {

    // Restart game at a harder level if player reaches the water

    if (this.y == -10) {
        this.reset();
        Enemy.createFirstBug();
        speedModifier += 0.6;
    }
};

Player.prototype.reset = function() {
    this.x = 101 * 2;

    // Use -10 modifier to adjust for characters' size

    this.y = (83 * 5) - 10;
};

// Create a gem class.
var Gem = function() {
    this.placementAdjust = 7;
    Entity.call(this);
    this.sprite = "images/gem-blue.png";

    /* Start gem off screen.
    Gem cycle makes a gem appear after 10 seconds and makes it
    disappear afrer 5 seconds.
    We call Entities.prototype.cycleStart() with a 5000 parameter to create
    extra 5-second delay when it disappears. */

    this.cycleStart(5000);
    this.width = 75;
    this.height = 127;
};

Gem.prototype = Object.create(Entity.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.update = function() {

    // First check to see if player is touching gem.
    // The adjustments of -13 and -17 account for
    // the different sizes of the two sprites.

    if ((player.x == this.x - 13) && (player.y == this.y - 17)) {

        // If touching gem, make the bugs scared, hide gem, restart gem cycle.

        Enemy.scared = true;
        this.start();
        this.cycleStart(5000);

    } else {

        // If player isn't touching gem, check to see if it has been 5
        // seconds since gem appeared (or 10 sec. since it disappeared).

        if(Date.now() - this.cycleStartTime >= 5000) {

            // If so, then check to see if gem is currently invisible

            if (this.x == -101) {

                // If invisible, make it visible by placing it randomly in
                // rows of action

                this.x = (101 * Math.round(Math.random() * 4)) + 13;
                //this.y = (83 * (Math.round(Math.random() * 2) + 1)) + 7;
                console.log(this.y);

                // and restart the gemCycle.

                this.cycleStart(0);

            } else {

                // If it isn't hidden to the right of the canvas, hide it and
                // restart gemCycle, adding 5 seconds delay.

                this.start();
                this.cycleStart(5000);
            }

        // If it hasn't been 5 seconds since appearing or disappearing, no change.

        }
    }
};

// Instantiation time!

// If a bug has not yet appeared, create the first one.

if (!lastBugTime) {
    Enemy.createFirstBug();
}

var player = new Player();

var gem = new Gem();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. Provided by Udacity.

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});