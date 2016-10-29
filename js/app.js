
//creating a conversion for pixel location to rows and columns
function rowToPixel(row){
    return (row * 83);
}

function columnToPixel(column){
    return column * 101;
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = columnToPixel((Math.random() * 3) + 2);
    this.x = -101;
    this.y = rowToPixel(((Math.round(Math.random() * 2)) + 1)) - 20;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    this.y = this.y;
};

// if we do have a Creature superclass, we can have the Render function stored at Creatures.prototype.render since it's the same.
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
 //   console.log("enemy rendered");
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var player = function() {
    if (!this.x) {
        this.x = columnToPixel(2);
        this.y = rowToPixel(5) - 10;
    }
    this.sprite = 'images/char-cat-girl.png';
//Use cat girl character to advance cause of gender equity (and also species equity)

    this.render = function() {
//    console.log(ctx);
//    console.log(this);
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
  //  console.log("this.x = " + this.x);
    console.log("this e = " + e);
    if (e == "left") {
        this.x = Math.max(0, (this.x - columnToPixel(1)));
        console.log("with this e, this.x is now " + this.x);
        console.log("player.y" + this.y);
    }
    if (e == "right") {
        console.log("and now this e is equal to " + e);
        this.x = Math.min(columnToPixel(4), (this.x + columnToPixel(1)));
        console.log("with this e, this.x is now " + this.x);
    }
    if (e == "up") {
        this.y = Math.max(-10, (this.y - rowToPixel(1)));
        console.log("up adjustments made");
    }
    if (e == "down") {
        this.y = Math.min(rowToPixel(5) - 10, (this.y + rowToPixel(1)));
    }
};

player.prototype.update = function() {
    console.log("player.update run");
};

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
} else {
    console.log("lastBugTime was " + lastBugTime);
    console.log("current time is" + Date.now());
    if (Date.now() - lastBugTime >= (Math.random() * 1500) + 500) {
        console.log("creating new bug!");
        var bug = new Enemy();
        console.log("next bug status: " + lastBugTime - Date.now() >= (Math.random() * 1.5) + 1.5);
        }
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

//main();
//console.log(allEnemies);
//console.log(player.update);
//init();
//console.log("reached end of app.js");
