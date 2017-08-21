var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");

var width = canvas.width
var height = canvas.height

var timer = 60
var score = 0
var clouds = []

//Intervals
var falling
var jumping

var jumpSound = document.createElement("audio")
jumpSound.src = "/sounds/jump.mp3"
jumpSound.volume = 0.3

var backgroundMusic = document.createElement("audio")
backgroundMusic.volume = 0.3
backgroundMusic.src = "/sounds/mario.mp3"
backgroundMusic.play()

class Player {
    constructor(x, y, speed, width, height, dir, floatSpeed) {
        this.x = x
        this.y = y
        this.speed = speed
        this.width = width
        this.height = height
        this.dir = dir
        this.floatSpeed = floatSpeed
    }

    moveWithCloud() {
        clouds.forEach(function (cloud) {
            if (cloud.y - this.y > 100 && cloud.y - this.y < 150) {
                this.dir = cloud.dir
                this.floatSpeed = cloud.floatSpeed
                move(player)
            }
        }, this)
    }
    fall() {
        fallingStatus = true
        falling = setInterval(function () {
            this.y += 6;
        }, 10)
    }
}
Player.prototype.onCloud = false
Player.prototype.jumpingStatus = false
Player.prototype.goingDown = false
Player.prototype.fallingStatus = false
Player.prototype.limit = 450


Player.prototype.jump = function () {

    if (this.y > this.limit && !this.goingDown) {
        this.jumpingStatus = true
        this.y -= 7;
        jumpSound.play()
        
    } else {
        if (!this.fallingStatus) {
            this.goingDown = true;
            this.y += 7;
        }

        if (this.y === jump_y) {
            this.goingDown = false
            this.jumpingStatus = false
            clearInterval(jumping);
        }
        clouds.forEach(function (cloud) {
            if ((this.x + 15 < cloud.x + cloud.width) && (this.x + this.width - 15 > cloud.x) && (this.y + this.height + 10 > cloud.y) && (this.y + this.height - 20 < cloud.y + cloud.height)) {
                score++
                this.goingDown = false;
                this.jumpingStatus = false
                this.onCloud = true
                clearInterval(jumping)
                if (this.y < 550 && this.y > 300) {
                    this.limit = 325
                }
                if (this.y < 400 && this.y > 200) {
                    this.limit = 225
                }
                if (this.y < 300 && this.y > 0) {
                    this.limit = 100
                }

            }

        }, this)
    }
}

class Cloud {
    constructor(x, y, width, height, dir, floatSpeed) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.dir = dir
        this.floatSpeed = floatSpeed
    }
}

var player = new Player(500, 700, 275, 80, 100, "", 2)
var jump_y = player.y

var randomX = function () {
    return Math.random() * (width - 235)
}

var cloudOne = new Cloud(randomX(), 600, 235, 56, "right", 2)
var cloudTwo = new Cloud(randomX(), 200, 235, 56, "left", 2.5)
var cloudThree= new Cloud(randomX(), 400, 235, 56, "right", 3)

clouds.push(cloudOne, cloudTwo, cloudThree)


var timerTick = setInterval(function () {
    timer--
    if (timer === 0) {
        clearInterval(timerTick)
    }

}, 1000)

var bgImage = new Image();
var playerImage = new Image();
var timerImage = new Image()
var scoreImage = new Image()
var startCloudImage = new Image()
var randomCloud = new Image()
var randomCloudOne = new Image()

var cloudImages = ["../PNG/cloud1.png", "../PNG/cloud2.png", "../PNG/cloud3.png"]
var getRandomCloud = function () {
    return cloudImages[Math.floor(Math.random() * cloudImages.length)]
}

bgImage.src = "../PNG/background.png";
playerImage.src = "../PNG/JumpJumpBoy.png";
timerImage.src = "../PNG/clock.png"
scoreImage.src = "../PNG/cloud_counter.png"
startCloudImage.src = getRandomCloud()
randomCloud.src = getRandomCloud()
randomCloudOne.src = getRandomCloud()

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);


var render = function () {
    ctx.drawImage(bgImage, 0, 0);
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    ctx.drawImage(startCloudImage, clouds[0].x, clouds[0].y, clouds[0].width, clouds[0].height)
    ctx.drawImage(randomCloud, clouds[1].x, clouds[1].y, clouds[1].width, clouds[1].height)
    ctx.drawImage(randomCloudOne, clouds[2].x, clouds[2].y, clouds[2].width, clouds[2].height)

    ctx.drawImage(timerImage, 20, 20, 25, 35)
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "35px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(timer, 55, 20);


    ctx.drawImage(scoreImage, 900, 15, 74, 42)
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "35px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(score, 855, 20);


};

// Update game objects
var update = function (modifier) {
    if (38 in keysDown) {
        if (!player.jumpingStatus) {
            jumping = setInterval(function () {
                player.jump()
            }, 10)
        }
    }
    if (37 in keysDown) {
        if (player.x > 5) {
            player.x -= player.speed * modifier;
        }

    }
    if (39 in keysDown) {
        player.x += player.speed * modifier;

    }
    checkPosition()

    if (player.onCloud) {
        player.moveWithCloud()
    }
    clouds.forEach(function (cloud) {
        move(cloud)
    })
    console.log(player.y)

};

function checkPosition() {
    clouds.forEach(function (cloud) {
        if ((player.x + 15 < cloud.x + cloud.width) && (player.x + player.width - 15 > cloud.x) && (player.y - player.height === cloud.y - cloud.height)) {
            goingDown = true
            jumpingStatus = true

        }
        if (!player.goingDown && player.jumpingStatus && player.y < height / 2) {
            cloud.y += 12
        }
        if (cloud.y > height) {
            cloud.y = cloud.y - height + 200
            cloud.floatSpeed += 0.5
        }
        if (player.goingDown && player.jumpingStatus && player.y < height / 2) {
            if (player.onCloud) {
                cloud.y -= 3
            }

        }
    })
    /*
    if(( (cloud.y - player.y > 99) && player.x  > cloud.x + cloud.width / 1.2) ||(cloud.y - player.y > 99 ) && ( player.y < cloud.y && player.x + player.width < cloud.x && !jumpingStatus) ) {
        goingDown = true
        fall()       
    }
        if(( (secondCloud.y - player.y === 98) && player.x  > secondCloud.x + secondCloud.width / 1.2) ||(secondCloud.y - player.y === 98) && ( player.y < secondCloud.y && player.x + player.width < secondCloud.x && !jumpingStatus) ) {
        goingDown = true
        fall()       
    }

    if( fallingStatus &&(player.x + 15 < cloud.x + cloud.width) && (player.x + player.width - 15  > cloud.x) && (player.y + player.height + 3  > cloud.y) && (player.y + player.height < cloud.y + cloud.height) )  {
        goingDown = false;
        limit= 200
        jumpingStatus = false
        fallingStatus = false
        clearInterval(falling)
        onCloud = true
    }
    if( fallingStatus && (player.x + 15 < cloudOne.x + cloudOne.width) && (player.x + player.width - 15  > cloudOne.x) && (player.y + player.height > cloudOne.y) && (player.y + player.height < cloudOne.y + cloudOne.height) )  {
        limit = 325
        goingDown = false
        jumpingStatus = false
        fallingStatus = false
        clearInterval(falling)
    }
*/
}

var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    requestAnimationFrame(main);

};

//Move horizontally cloud or player
function move(object) {
    object.dir === "right" ? object.x += object.floatSpeed : object.x -= object.floatSpeed
    if (object.x > 700) {
        object.dir = "left"
    } else if (object.x < 50) {
        object.dir = "right"
    }
}
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Make canvas responsive 
function resize() {
    $("#canvas").outerHeight($(window).height() - $("#canvas").offset().top - Math.abs($("#canvas").outerHeight(true) - $("#canvas").outerHeight()));
}
$(document).ready(function () {
    $(window).on("resize", function () {
        resize();
    });
});

var then = Date.now();
main();
