
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
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Set speed as pixels per second, because dt parameter is computed as
    // the portion of a second which has passed between ticks.
    this.speed = columnToPixel((Math.random() * 3) + 2);
    this.x = -101;
    //use -20 modifier to adjust for enemies' size
    this.y = rowToPixel(((Math.round(Math.random() * 2)) + 1)) - 20;
};

// We will need this later.
Enemy.scared = false;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    // Check for collisions between player and bugs
    if (((player.x + 33) <= (this.x + 98)) && ((player.x + 50) >=
        (this.x + 2)) && (player.y == (this.y +10))) {
        // Provided the bugs aren't "scared" into powerlessness
        // by player powering up with a gem, send player back to home.
        if (Enemy.scared == false) {
            player.reset.call(player);
        // But if the bugs are scared, send them way off screen.
        } else {
            this.x = -300;
        }
    }
    // Check to see if bugs have been "scared.""
    if (Enemy.scared == false) {
        // If not scared, multiply movement by the dt parameter
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
        if (Date.now() - Enemy.scaredStart > 4000) {
            Enemy.scared = false;
            this.sprite = 'images/enemy-bug.png';
        } else {
        this.sprite = 'images/enemy-bug-scared.png';
        }
    }
    // Recycle bugs who leave the screen to the right.
    if (this.x > 505) {
        this.x = -101;
        this.y = rowToPixel(((Math.round(Math.random() * 2)) + 1)) - 20;
    }
    // Keep bugs who flee when scared from getting too far away off to the left.
    // Change color back to normal for when they re-enter.
    if (this.x < -101) {
        this.x = -101;
        this.sprite = 'images/enemy-bug.png';
    }
};

Enemy.prototype.render = function() {
    // Use resources.js functionality to load the images.
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // Generate another enemy if a suitable amount of time has passed.
    // (This code deliberately creates more enemies than in the provided demo.)
    if ((Date.now() - lastBugTime >= (Math.random() * 1000) + 250) && (allEnemies.length < 10)) {
        var newBug = new Enemy();
        lastBugTime = Date.now();
        allEnemies.push(newBug);
    }
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
        Enemy.scared = false;
        scaredStart = Date.now();
        Gem.cycleStart = Date.now() + 5000;
    }
};

Player.prototype.reset = function() {
    this.x = columnToPixel(2);
    //use -10 modifier to adjust for characters' size
    this.y = rowToPixel(5) - 10;
};

var Gem = function() {
    this.sprite = "images/gem-blue.png";
    // starting coordinates are invisible - off-screen.
    this.x = 505;
    this.y = 0;
    // The Gem cycle creates a gem every 10 seconds; it lasts for 5 seconds.
    // By adding 5 seconds when gem disappears, and adding nothing when it's
    // visible, the later check for Gem.cycleStart + 5000 will check for the
    // desired values.
    Gem.cycleStart = Date.now() + 5000;
};

Gem.prototype.update = function() {
    // First check to see if player is touching gem.
    // The sprites vary in size, hence the adjustments of -13 and -17.
    if ((player.x == this.x - 13) && (player.y == this.y - 17)) {
        // If touching gem, make the bugs scared, hide gem, restart gem cycle.
        Enemy.scared = true;
        Enemy.scaredStart = Date.now();
        this.x = 505;
        Gem.cycleStart = Date.now() + 5000;
    } else {
        // If player isn't touching it, check to see if it has been 5
        // seconds since gem appeared (or 10 sec. since it disappeared).
        if(Date.now() - Gem.cycleStart >= 5000) {
            // If so, then check to see if gem is hidden to the right of the
            // canvas
            if (this.x > 504) {
                // If it is hidden, make it visible by placing it randomly in
                // rows of action
                this.x = columnToPixel(Math.round(Math.random() * 4)) + 13;
                this.y = rowToPixel(((Math.round(Math.random() * 2)) + 1)) + 7;
                console.log("Gem coordinates are " + this.x + " and " + this.y);
                // Restart the gemCycle.
                Gem.cycleStart = Date.now();
            } else {
                // If it isn't hidden to the right of the canvas, hide it and
                // restart gemCycle.
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

Enemy.createFirstBug = function() {
    allEnemies = [];
    var bug = new Enemy();
    lastBugTime = Date.now();
    allEnemies.push(bug);
};

//If a bug has not yet appeared, create the first one.
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