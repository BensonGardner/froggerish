
//create conversions for rows and columns to pixel values

function rowToPixel(row){
    return (row * 83);
}

function columnToPixel(column){
    return column * 101;
}

// Variables we will need later

var allEnemies = [];
var lastBugTime;

// Enemies our player must avoid

var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = columnToPixel((Math.random() * 3) + 2);
    this.x = -101;
    //use -20 modifier to adjust for enemies' size
    this.y = rowToPixel(((Math.round(Math.random() * 2)) + 1)) - 20;
};

Enemy.scared = false;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    // Check for collisions between player and bugs
    if (((player.x + 33) <= (this.x + 98)) && ((player.x + 50) >=
        (this.x + 2)) && (player.y == (this.y +10))  ) {
        console.log("player.y is " + player.y + " and enemyBug.y is " + this.y);
        player.reset.call(player);
    }
    // Check to see if bugs have been "scared" by player powering up with a gem.
    if (Enemy.scared == false) {
        // Multiply movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x = this.x + this.speed * dt;
    }
    if (Enemy.scared == true) {
        if (this.x > player.x) {
            this.x = this.x + (this.speed * .67 * dt);
        } else {
            this.x = this.x - (this.speed * .67 * dt);
        }
    }
    if (this.x > 505) {
        this.x = -101;
        this.y = rowToPixel(((Math.round(Math.random() * 2)) + 1)) - 20;
        console.log("length of allEnemies is " + allEnemies.length);
    }
    };

// if we do have a Creature superclass, we can have the Render function stored at Creatures.prototype.render since it's the same.
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // Generate another enemy if a suitable amount of time has passed.
    // This code deliberately creates more enemies than in the provided demo video.
    if ((Date.now() - lastBugTime >= (Math.random() * 1000) + 250) && (allEnemies.length < 10)) {
        console.log("creating new bug!");
        var newBug = new Enemy();
        lastBugTime = Date.now();
        allEnemies.push(newBug);
    }
};

var Player = function() {
    if (!this.x) {
        this.reset();
    }
    this.sprite = 'images/char-cat-girl.png';
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(e){
// takes keystroke values from the eventlistener that has been provided
// and translates them into motion for the character (well, it changes the x and y values, so that the render
// function can place the character correctly.
/*    var motion = {
        "left" : [Math.max(0, (this.x - columnToPixel(1))), this.y],
        "right" : [Math.min(columnToPixel(4), (this.x + columnToPixel(1))), this.y],
        "up" : [this.x, Math.max(0, (this.y - rowToPixel(1)))],
        "down" : [this.x, Math.min(rowToPixel(5), (this.y + rowToPixel(1)))]
//            "left" : function() {this.x = Math.max(0, (this.x - columnToPixel(1)))},
//            "right" : function() {this.x = this.x + columnToPixel(1)},
    };
    console.log("motion.left and right are " + motion.left + ", " +
         motion.right);
 //   console.log("motion.left[0] is" + motion.left[0]);
  //  console.log(e + " is e. " + motion.e + " is motion.e");

        //if (e = "left") {this.x = this.x - columnToPixel(1)};
//        console.log("motion right is" + motion.right + "motion left is" + motion.left);
  //      console.log("motion.e is" + motion.e);
    for (var key in motion) {
        if (motion.hasOwnProperty(key)) {
          if (motion.key = e) {
                console.log("conditions met");
                console.log("motion.key is " + motion.key[0] + " and " + motion.key[1]);
                this.x = motion.key[0];
                this.y = motion.key[1];
            }
        }
    }*/
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
    }
};

Player.prototype.reset = function() {
    this.x = columnToPixel(2);
    //use -10 modifier to adjust for characters' size
    this.y = rowToPixel(5) - 10;
}

var Gem = function() {
    this.sprite = "images/gem-blue.png";
}

Gem.cycleStart = Date.now();

//if found by player it disappears, Enemy.scared is set to TRUE,
// gemPresent set to false, and Enemy.scaredStart = Date.now();
Gem.prototype.update = function() {
    // First check to see if player is touching gem ...
    if ((player.x > this.x - 33) && (player.x < this.x + 169) && (player.y = this.y + 10)) {
        // ... and if so, make the bugs Enemy.scared, hide gem, and restart gem cycle.
        Enemy.scared = true;
        Enemy.scaredStart = Date.now();
        this.x = ctx.width + 1;
        Gem.cycleStart = Date.now();
    } else {
        // If player isn't touching it, then check to see if it has been 5
        // seconds since gem appeared or disappeared.
        if(Date.now() - Gem.cycleStart >= 5000) {
            // If so, then check to see if gem is hidden to the right of the canvas
            if (this.x > ctx.width) {
                // If it is hidden, make it visible by placing it randomly in rows of action
                this.x = Math.random() * (ctx.width - 171);
                this.y = rowToPixel(((Math.round(Math.random() * 2)) + 1)) - 20;
                // Restart the gemCycle.
                Gem.cycleStart = Date.now();
            } else {
                // If it isn't hidden to the right of the canvas, hide it and restart gemCycle.
                this.x = ctx.width + 1;
                Gem.cycleStart = Date.now();
            }
        // If it hasn't been 5 seconds since gem appeared or disappeared
        }
    }
    console.log("gem updated!");
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Enemy.createFirstBug = function() {
    var bug = new Enemy();
    lastBugTime = Date.now();
    allEnemies = [];
    allEnemies.push(bug);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

if (!lastBugTime) {
    Enemy.createFirstBug();
}

var player = new Player();

var gem = new Gem();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    console.log("as far as the eventlistener is concerned, this e is" + e);
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});