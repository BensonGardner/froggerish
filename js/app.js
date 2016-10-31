
//create conversions for rows and columns to pixel values

function rowToPixel(row){
    return (row * 83);
}

function columnToPixel(column){
    return column * 101;
}

//start timer for intermittent appearance of gems

var gemCycleStart = Date.now();

var scared = false;

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

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    // Multiply movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (scared == false) {
        this.x = this.x + this.speed * dt;
    }
    if (scared == true) {
        if (this.x > player.x) {
            this.x = this.x + (this.speed * .67 * dt);
        } else {
            this.x = this.x - (this.speed * .67 * dt);
        }
    }
    this.y = this.y;
    };

// if we do have a Creature superclass, we can have the Render function stored at Creatures.prototype.render since it's the same.
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // Generate another enemy if a suitable amount of time has passed.
    // This code creates more enemies than in the provided demo video, in order
    // to make a more challenging game.
    if (Date.now() - lastBugTime >= (Math.random() * 1000) + 250) {
        console.log("creating new bug!");
        var newBug = new Enemy();
        lastBugTime = Date.now();
        allEnemies.push(newBug);
        console.log("next bug status: " + lastBugTime - Date.now() >= (Math.random() * 1.5) + 1.5);
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var player = function() {
    if (!this.x) {
        this.x = columnToPixel(2);
        //use -10 modifier to adjust for characters' size
        this.y = rowToPixel(5) - 10;
    }
    this.sprite = 'images/char-cat-girl.png';
    this.render = function() {
    console.log(Resources.get(player.sprite));
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    console.log("player.render run");
    };
};

player.prototype.handleInput = function(e){
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

player.prototype.update = function() {
    console.log("player.update run");
    allEnemies.forEach(function(enemyBug) {
        if (((player.x + 33) <= (enemyBug.x + 98)) && ((player.x + 50) >=
            (enemyBug.x + 2)) && (player.y == (enemyBug.y +10))  ) {
            console.log("player.y is " + player.y + " and enemyBug.y is " + enemyBug.y);
            player.x = columnToPixel(2);
            player.y = rowToPixel(5) - 10;
        }
    })
};

var gem = function() {
    this.sprite = "images/gem-blue.png";
    this.x = Math.random() * ctx.width;
    this.y = rowToPixel(((Math.round(Math.random() * 2)) + 1)) - 20;
}

gem.prototype.update = function() {
    console.log("gem updated!");
    //if found by player it disappears, scared is set to TRUE, gemPresent set to false,
    // and scaredStart = Date.now();
}

gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if(gemPresent = False && Date.now() - gemCycleStart <= 2500) {
        var Gem = new gem();
        gemPresent = true;
        var gemCycleStart = Date.now();
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

if (!lastBugTime) {
    console.log("lastBugTime was undefined");
    console.log("Creating first bug");
    var bug = new Enemy();
    console.log("hello?");
    var lastBugTime = Date.now();
    console.log("lastBugTime =" + lastBugTime);
}

if (!allEnemies) {
    var allEnemies = [];
}

allEnemies.push(bug);

var player = new player();

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