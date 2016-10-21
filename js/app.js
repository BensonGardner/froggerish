
//creating a conversion for pixel location to rows and columns
function rowToPixel(row){
    return (row * 83) - 20;
};

function columnToPixel(column){
    return column * 101;
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = columnToPixel((Math.random() * 3) + 2);
    this.x = -101;
    this.y = rowToPixel(((Math.round(Math.random()) * 2) + 1));
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
        console.log(ctx);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    console.log("enemy rendered");
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var player = function() {
    this.update = function() {
        console.log("player.update run");
        // adjust the x and y by the right values according to the input.
    };
    console.log(this);
    this.sprite = 'images/char-cat-girl.png';
    console.log(player.sprite);
    player.handleInput = function(e){
         console.log("player.handleInput run");
         //convert keystrokes to values
         //return the right value as this.x and this.y
         //or may be that happens in update. maybe this just records...or something...
    };
    //strangely, cnosole says player.update is not a function. said same thing
    //about player.handleInput but by adding a console.log() statement to
    //function, I fixed the issue. so what is the problem now?
};

player.update = function() {
    console.log("player.update run");
};

player.render = function() {
    console.log(ctx);
    console.log(this);
    console.log(Resources.get(player.sprite));
    Resources.onReady(function() {
        ctx.drawImage(Resources.get(player.sprite), this.x, this.y)
        });
//    if (Resources.isReady()) {
 //       ctx.drawImage(Resources.get(player.sprite), this.x, this.y);
  //  } else {
   //     player.render();
    //}
    console.log("player.render run")
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var bug = new Enemy();
var allEnemies = [];
allEnemies.push(bug);

var you = new player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//main();
console.log(allEnemies);
console.log(player.update);
//init();
console.log("reached end of app.js");
