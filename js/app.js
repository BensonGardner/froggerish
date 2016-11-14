
// Conversions for rows and columns to pixel values.

function rowToPixel(row){
    return (row * 83);
}

function columnToPixel(column){
    return column * 101;
}

// All bugs will be pushed into this array
var allEnemies = [];

// We will use this variable to govern how quickly bugs appear.
var lastBugTime;

// Enemies our player must avoid
var Enemy = function() {
    lastBugTime = Date.now();
    allEnemies.push(this);
    // Set speed in pixels per second. Later, it will interact with the
    // dt parameter, a variable computed as the portion of a second which has
    // passed between ticks.
    this.speed = columnToPixel((Math.random() * 3) + 2);
    Enemy.start.call(this);
};

Enemy.start = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Set starting spot of each enemy: to the left of the visible
    // canvas and in a randomly chosen row of stones. The -20 modifier
    // adjusts for enemies' sprite size.
    this.x = -101;
    this.y = rowToPixel(((Math.round(Math.random() * 2)) + 1)) - 20;
};

// We will need this later.
Enemy.scared = false;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta -- the portion of a second which passed
// between ticks
Enemy.prototype.update = function(dt) {
    // Check for collisions between player and bugs
    if (((player.x + 33) <= (this.x + 98)) && ((player.x + 50) >=
        (this.x + 2)) && (player.y == (this.y +10))) {
        // Provided the bug isn't "scared" into powerlessness
        // by player powering up with a gem, colliding sends player to start.
        if (Enemy.scared == false) {
            player.reset.call(player);
        // But if the bugs is scared, player wins: recyle bug.
        } else {
            Enemy.start.call(this);
        }
    }
    // If no collision, then update position. First check if bugs are "scared."
    if (Enemy.scared == false) {
        // If not scared, simply multiply movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x = this.x + this.speed * dt;
    }
    // Scared bugs move more slowly and change to a different color.
    // They also run away from the player.
    if (Enemy.scared == true) {
        if (this.x > player.x) {
            this.x = this.x + (this.speed * 0.45 * dt);
        } else {
            this.x = this.x - (this.speed * 0.45 * dt);
        }
    }
    // Next two lines: 1) recycle bugs after they leave the screen
    // to the right, to save memory, by setting them to a starting position;
    // and 2) prevent scared bugs from fleeing too far off to the left. In
    // latter case, they need the color returned to normal for when they re-enter.
    if (this.x > 505 || this.x < -101) {
        Enemy.start.call(this);
    }
};

Enemy.prototype.render = function() {
        // For 4 seconds after scaredStart, use scared version of image.
        // After 4 seconds, revert to original image and set scared to false.
        if (Enemy.scared == true && Date.now() - Enemy.scaredStart < 4000) {
            this.sprite = 'images/enemy-bug-scared.png';
        } else {
            this.sprite = 'images/enemy-bug.png';
            Enemy.scared = false;
        }
    // Use resources.js functionality to load the images.
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
    this.reset();
    this.sprite = 'images/char-cat-girl.png';
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(e){
    if (e == "left") {
        this.x = Math.max(0, (this.x - columnToPixel(1)));
    }
    if (e == "right") {
        this.x = Math.min(columnToPixel(4), (this.x + columnToPixel(1)));
    }
    if (e == "up") {
        this.y = Math.max(-10, (this.y - rowToPixel(1)));
    }
    if (e == "down") {
        this.y = Math.min(rowToPixel(5) - 10, (this.y + rowToPixel(1)));
    }
};

Player.prototype.update = function() {
    // reset game if player reaches the water
    if (this.y == -10) {
        player.reset();
        Enemy.createFirstBug();
        Gem.cycleStart = Date.now() + 5000;
    }
};

Player.prototype.reset = function() {
    this.x = columnToPixel(2);
    // use -10 modifier to adjust for characters' size
    this.y = rowToPixel(5) - 10;
};

// Create a gem class.
var Gem = function() {
    this.sprite = "images/gem-blue.png";
    // starting coordinates are off-screen.
    this.x = 505;
    this.y = 0;
    // The Gem cycle creates a gem every 10 seconds; it lasts for 5 seconds.
    // By setting Gem.cycleStart to Date.now() + 5 seconds when gem disappears,
    // and to Date.now() plus nothing when it's visible, our later check for
    // Gem.cycleStart + 5000 will do what we want.
    Gem.cycleStart = Date.now() + 5000;
};

Gem.prototype.update = function() {
    // First check to see if player is touching gem.
    // The adjustments of -13 and -17 account for the different size of the two.
    if ((player.x == this.x - 13) && (player.y == this.y - 17)) {
        // If touching gem, make the bugs scared, hide gem, restart gem cycle.
        Enemy.scared = true;
        Enemy.scaredStart = Date.now();
        this.x = 505;
        Gem.cycleStart = Date.now() + 5000;
    } else {
        // If player isn't touching gem, check to see if it has been 5
        // seconds since gem appeared (or 10 sec. since it disappeared).
        if(Date.now() - Gem.cycleStart >= 5000) {
            // If so, then check to see if gem is hidden to the right of the
            // canvas
            if (this.x > 504) {
                // If it is hidden, make it visible by placing it randomly in
                // rows of action
                this.x = columnToPixel(Math.round(Math.random() * 4)) + 13;
                this.y = rowToPixel(((Math.round(Math.random() * 2)) + 1)) + 7;
                // Restart the gemCycle.
                Gem.cycleStart = Date.now();
            } else {
                // If it isn't hidden to the right of the canvas, hide it and
                // restart gemCycle, adding 5 seconds delay.
                this.x = 505;
                Gem.cycleStart = Date.now() + 5000;
            }
        // If it hasn't been 5 seconds since appearing or disappearing, no change.
        }
    }
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 75, 127);
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