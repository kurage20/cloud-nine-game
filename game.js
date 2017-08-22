var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");
var width = canvas.width
var height = canvas.height

var timer = 60
var score = 0
var clouds = []
var scores = []
var disableMovement = false

var savedScores = JSON.parse(localStorage.getItem("scores"));
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
        this.jumpLimit = this.y - 150
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
    jump() {

        if (this.y > this.jumpLimit && !this.goingDown) {
            this.onCloud = false
            this.jumpingStatus = true
            this.y -= 3;
            jumpSound.play()
            /*
            clouds.forEach(function (cloud) {
                if ((this.x + 15 < cloud.x + cloud.width) && (this.x + this.width - 15 > cloud.x) && (this.y  === cloud.y - 5 )) {
                    this.y += 3
                    console.log("bumped")
                    this.goingDown = true
                }
            }, this)
            */

        } else {
            if (!this.fallingStatus) {
                this.goingDown = true;
                this.y += 2;
            }

            clouds.forEach(function (cloud) {

                if ((this.x + 15 < cloud.x + cloud.width) && (this.x + this.width - 15 > cloud.x) && (this.y + this.height > cloud.y - 10) && (this.y + this.height < cloud.y + cloud.height - 15)) {
                    if (!cloud.scored) {
                        score++
                        cloud.scored = true
                    }
                    this.goingDown = false;
                    this.jumpingStatus = false
                    this.onCloud = true
                    clearInterval(jumping)
                    this.jumpLimit = this.y - 150

                }


            }, this)
        }
    }
}
Player.prototype.onCloud = false
Player.prototype.jumpingStatus = false
Player.prototype.goingDown = false
Player.prototype.fallingStatus = false

class Cloud {
    constructor(x, y, dir, floatSpeed) {
        this.x = x
        this.y = y
        this.dir = dir
        this.floatSpeed = floatSpeed
        this.width = 235
        this.height = 56
        this.scored = false
    }
}

var player = new Player(500, 700, 325, 80, 100, "", 2)

var randomX = function () {
    return Math.random() * (width - 235)
}

var cloudOne = new Cloud(randomX(), 200, "left", 2)
var cloudTwoImage = new Cloud(randomX(), 400, "right", 3)
var cloudThree = new Cloud(randomX(), 600, "left", 4)

clouds.push(cloudOne, cloudTwoImage, cloudThree)


var timerTick = setInterval(function () {
    timer--
}, 1000)


var bgImage = new Image();
var playerImage = new Image();
var timerImage = new Image()
var scoreImage = new Image()
var cloudOneImage = new Image()
var cloudTwoImage = new Image()
var cloudThreeImage = new Image()
var mute = new Image()

var cloudImages = ["img/cloud1.png", "img/cloud2.png", "img/cloud3.png"]
var randomCloudImage = function () {
    return cloudImages[Math.floor(Math.random() * cloudImages.length)]
}
mute.src = "img/mute.png"
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

    ctx.drawImage(timerImage, 20, 20, 25, 40)
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "25px Atari";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(timer, 55, 30);


    ctx.drawImage(scoreImage, 900, 15, 74, 42)
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "25px Atari";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(score, 845, 30);

};

// Update game objects
var update = function (modifier) {
    if (38 in keysDown) {

        if (!player.jumpingStatus && !disableMovement) {
            jumping = setInterval(function () {
                player.jump()
            }, 0)
        }
    }
    if (37 in keysDown) {
        if (player.x > 5 && !disableMovement) {
            player.x -= player.speed * modifier;
        }

    }
    if (39 in keysDown) {
        if (!disableMovement) {
            player.x += player.speed * modifier;
        }
    }
    if (83 in keysDown) {
        backgroundMusic.pause()
    }
    checkPosition()

    if (player.onCloud) {
        player.moveWithCloud()
    }
    clouds.forEach(function (cloud) {
        move(cloud)
    })

    if (timer <= 0 || player.y - player.height > height) {
        resetGame()
    }

};

function checkPosition() {
    //Handle game looping clouds
    clouds.forEach(function (cloud) {
        if (!player.goingDown && player.jumpingStatus && !player.onCloud && player.y > 400) {
            cloud.y += 13
        } else if (!player.goingDown && player.jumpingStatus && !player.onCloud && player.y < 400) {
            cloud.y += 17
        } else if (!player.goingDown && player.jumpingStatus && !player.onCloud && player.y < 200) {
            cloud.y += 19
        }

        if (cloud.y > height) {
            cloud.y = cloud.y - height + 200
            cloud.x = randomX()
            cloud.scored = false
            cloud.floatSpeed += 1

            var speed = cloud.floatSpeed

            /*
            var slideCloud = setInterval(function() {
                if(cloud.y < 200) {
                    cloud.y += 12
                } else {
                    cloud.floatSpeed = speed
                }
                
            }, 10)
            */
        }

        //Falling from clouds
        /*
        if((cloud.y - player.y > 100 && cloud.y - player.y < 150) && player.x  > cloud.x + cloud.width ||(cloud.y - player.y > 100 && cloud.y - player.y < 150) && ( player.y < cloud.y && player.x + player.width < cloud.x && !player.jumpingStatus) ) {
            console.log("falling from cloud")
            this.fallingStatus = true
            falling = setInterval(function () {
                
                player.y += 1;
                
            }, 10)      
        }
        */

        /*
        if (player.fallingStatus && (player.x + 15 < cloud.x + cloud.width) && (player.x + player.width - 15 > cloud.x) && (player.y + player.height + 3 > cloud.y) && (player.y + player.height < cloud.y + cloud.height)) {
            goingDown = false;
            jumpingStatus = false
            fallingStatus = false
            clearInterval(falling)
            onCloud = true
        }
        */

    })

}

function resetGame() {
    submitScores()
    $('#myModal').modal('toggle');
    player = new Player(500, 700, 325, 80, 100, "", 2)
    clearInterval(jumping)
    clearInterval(falling)
    timer = 60
    score = 0
    player = new Player(500, 700, 325, 80, 100, "", 2)

    var cloudOne = new Cloud(randomX(), 600, "left", 2)
    var cloudTwoImage = new Cloud(randomX(), 200, "right", 2.5)
    var cloudThree = new Cloud(randomX(), 400, "left", 3)

    cloudOneImage.src = randomCloudImage()
    cloudTwoImage.src = randomCloudImage()
    cloudThreeImage.src = randomCloudImage()

    clouds = []
    clouds.push(cloudOne, cloudTwoImage, cloudThree)


}

//Move horizontally cloud or player
function move(object) {
    object.dir === "right" ? object.x += object.floatSpeed : object.x -= object.floatSpeed
    if (object.x > 775) {
        object.dir = "left"
    } else if (object.x < 25) {
        object.dir = "right"
    }
}

function submitScores() {
    scores.push(score)

    scores.sort(function (a, b) {
        return b - a
    })
    $("#score-list").empty()
    scores.forEach(function (score) {
        $("#score-list").append("<li>" + score + "</li>")
    })
}

function resetScores() {
    scores = []
    localStorage.removeItem("scores")
    resetGame()

}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var jumpSound = document.createElement("audio")
jumpSound.src = "sound/jump.mp3"
jumpSound.volume = 0.3

/*
var backgroundMusic = document.createElement("audio")
backgroundMusic.volume = 0.2
backgroundMusic.src = "sound/ape3.mp3"
backgroundMusic.play()
*/

//Load and save scores
$(document).ready(function () {
    if (localStorage.scores !== undefined) {

        var storedScores = JSON.parse(localStorage.getItem("scores"));
        scores = scores.concat(storedScores)
        scores.sort(function (a, b) {
            return b - a
        })
        var date = new Date()
        var time = + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
    
    $("#play-again").click(resetGame)
    
    //Disable movement when modal is open
    $('#myModal').on('hide.bs.modal show.bs.modal', function (e) {
        disableMovement = !disableMovement
    })
    
})
$(window).on("beforeunload", function () {
    localStorage.setItem("scores", JSON.stringify(scores))
})

var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    requestAnimationFrame(main);

};

var then = Date.now();
main();
