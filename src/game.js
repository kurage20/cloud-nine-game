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
Player.prototype.limit = 425


Player.prototype.jump = function () {

    if (this.y > this.limit && !this.goingDown) {
        this.jumpingStatus = true
        this.y -= 7;
        jumpSound.play()
        console.log(this.y + this.height)
        console.log(clouds[0].y)
        
    } else {
        if (!this.fallingStatus) {
            this.goingDown = true;
            this.y += 7;
        }

        clouds.forEach(function (cloud) {
            if ((this.x + 15 < cloud.x + cloud.width) && (this.x + this.width - 15 > cloud.x) && (this.y + this.height > cloud.y - 20) && (this.y + this.height + 40 < cloud.y + cloud.height)) {
                if(!cloud.scored) {
                    score++
                    cloud.scored = true
                }
                this.goingDown = false;
                this.jumpingStatus = false
                this.onCloud = true
                clearInterval(jumping)
                if (this.y < 550 && this.y > 300) {
                    this.limit = 300
                }
                if (this.y < 400 && this.y > 200) {
                    this.limit = 200
                }
                if (this.y < 300 && this.y > 0) {
                    this.limit = 100
                }

            }

        }, this)
    }
}

class Cloud {
    constructor(x, y, width, height, floatSpeed) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.floatSpeed = floatSpeed
    }
}

Cloud.prototype.scored = false
Cloud.prototype.dir = "right"

var player = new Player(500, 700, 275, 80, 100, "", 2)
var jump_y = player.y

var randomX = function () {
    return Math.random() * (width - 235)
}

var cloudOne = new Cloud(randomX(), 600, 235, 56, 2)
var cloudTwoImage = new Cloud(randomX(), 200, 235, 56, 2.5)
var cloudThree= new Cloud(randomX(), 400, 235, 56, 3)

clouds.push(cloudOne, cloudTwoImage, cloudThree)


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
var cloudOneImage = new Image()
var cloudTwoImage = new Image()
var cloudThreeImage = new Image()

var cloudImages = ["img/cloud1.png", "img/cloud2.png", "img/cloud3.png"]
var randomCloudImage = function () {
    return cloudImages[Math.floor(Math.random() * cloudImages.length)]
}

bgImage.src = "img/background.png";
playerImage.src = "img/JumpJumpBoy.png";
timerImage.src = "img/clock.png"
scoreImage.src = "img/cloud_counter.png"
cloudOneImage.src = randomCloudImage()
cloudTwoImage.src = randomCloudImage()
cloudThreeImage.src = randomCloudImage()

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
    ctx.drawImage(cloudOneImage, clouds[0].x, clouds[0].y, clouds[0].width, clouds[0].height)
    ctx.drawImage(cloudTwoImage, clouds[1].x, clouds[1].y, clouds[1].width, clouds[1].height)
    ctx.drawImage(cloudThreeImage, clouds[2].x, clouds[2].y, clouds[2].width, clouds[2].height)

    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 52, 135, 0.4)"
    ctx.rect(0, 3, width, 70);
    ctx.fill();
    ctx.closePath();

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

};

function checkPosition() {
    clouds.forEach(function (cloud) {
        if ((player.x + 15 < cloud.x + cloud.width) && (player.x + player.width - 15 > cloud.x) && (player.y - player.height === cloud.y - cloud.height)) {
            goingDown = true
            jumpingStatus = true
        }
        if (!player.goingDown && player.jumpingStatus && player.y < height / 2) {
            cloud.y += 16
        } else if (!player.goingDown && player.jumpingStatus && player.y < height / 3) {
            cloud.y += 20
        }

        if (cloud.y > height) {
            cloud.y = cloud.y - height + 200
            cloud.x = Math.floor(Math.random() * 900) + -100
            cloud.floatSpeed += 0.5
            cloud.scored = false
        }
        if (player.goingDown && player.jumpingStatus && player.y < height / 2) {
            if (player.onCloud) {
                cloud.y -= 14
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

var jumpSound = document.createElement("audio")
jumpSound.src = "sound/jump.mp3"
jumpSound.volume = 0.3

var backgroundMusic = document.createElement("audio")
backgroundMusic.volume = 0.3
backgroundMusic.src = "sound/mario.mp3"
backgroundMusic.play()

var then = Date.now();
main();
