var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");
var width = canvas.width
var height = canvas.height

var timer = 60
var score = 0
var clouds = []
var scores = []
var disableMovement = false

//Intervals
var falling
var jumping

class Player {
    constructor(x, y, speed) {
        this.x = x
        this.y = y
        this.speed = speed
        
        this.width = 75
        this.height = 95
        this.floatSpeed = 3
        this.jumpLimit = this.y - 125
        this.onCloud = false
        this.jumping = false
        this.jumpingDown = false
        this.fallingStatus = false
        this.dir = ""
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
        if (this.y > this.jumpLimit && !this.jumpingDown && !this.fallingStatus) {
            this.onCloud = false
            this.jumping = true
            this.y -= 3;
            jumpSound.play()
            this.speed = 560
            
            //Bump in cloud
            clouds.forEach(function (cloud) {
                if ((this.x + 15 < cloud.x + cloud.width) && (this.x + this.width - 15 > cloud.x) && (this.y + this.width > cloud.y)  && (cloud.y - this.y > 20 && cloud.y - this.y < 100)) {
                    this.jumpingDown = true
                }
            }, this)

        } else {
            //Jumping down
            if (!this.fallingStatus) {
                this.speed = 375
                this.jumpingDown = true;
                this.y += 2;
            }
            //Fall on cloud when jumping
            clouds.forEach(function (cloud) {

                if ((this.x + 15 < cloud.x + cloud.width) && (this.x + this.width - 15 > cloud.x) && (cloud.y - this.y > 90 && cloud.y - this.y < 115))  {
                    if (!cloud.scored) {
                        score++
                        cloud.scored = true
                    }
                    clearInterval(jumping)
                    this.jumpingDown = false;
                    this.jumping = false
                    this.onCloud = true
                    this.jumpLimit = this.y - 150
                }

            }, this)
        }
    }
}

class Cloud {
    constructor(x, y, dir, floatSpeed) {
        this.x = x
        this.y = y
        this.dir = dir
        this.floatSpeed = floatSpeed
        
        this.width = 245
        this.height = 60
        this.scored = false
    }
}

var player = new Player(width / 2, 690, 375)

var randomX = function () {
    return Math.random() * (width - 245)
}

var cloudOne = new Cloud(randomX(), 150, "left", 4)
var cloudTwo = new Cloud(randomX(), 375, "right", 3.5)
var cloudThree = new Cloud(randomX(), 600, "left", 3)

clouds.push(cloudOne, cloudTwo, cloudThree)

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

    ctx.drawImage(timerImage, 20, 20, 25, 40)
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "25px Atari";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(timer, 55, 30);

    ctx.drawImage(scoreImage, 1000, 15, 74, 42)
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "25px Atari";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(score, 945, 30);

};

// Update game objects
var update = function (modifier) {
    if (38 in keysDown && !player.jumping && !disableMovement && !player.fallingStatus) {
        jumping = setInterval(function () {
            player.jump()
         })
    }
    if (37 in keysDown && !disableMovement) {
        player.x -= player.speed * modifier;
    }
    if (39 in keysDown && !disableMovement) {
        player.x += player.speed * modifier;
    }
    gameLogic()
};

function gameLogic() {
    
    //Handle looping clouds
    clouds.forEach(function (cloud) {
        if (!player.jumpingDown && player.jumping && !player.onCloud && player.y > 400) {
            cloud.y += 17
        } else if (!player.jumpingDown && player.jumping && !player.onCloud && player.y < 400) {
            cloud.y += 20
        } else if (!player.jumpingDown && player.jumping && !player.onCloud && player.y < 200) {
            cloud.y += 21
        }

        if (cloud.y > height) {
            cloud.y = cloud.y - height + 120
            cloud.x = randomX()
            cloud.scored = false
            cloud.floatSpeed += 1.5
            cloud.dir === "left" ? cloud.dir = "right" : cloud.dir = "left" 
        }
       
        //Falling from clouds
        if ((cloud.y - player.y > 100 && cloud.y - player.y < 150) && (player.x > cloud.x + cloud.width - 15 || player.x + player.width < cloud.x + 15) && player.onCloud) {
            player.onCloud = false
            player.fallingStatus = true
            falling = setInterval(function () {
                player.y += 1.5
            })
        }
        //Land on cloud while falling
        if (player.fallingStatus && (player.x + 20 < cloud.x + cloud.width) && (player.x + player.width - 20 > cloud.x) && (cloud.y - player.y > 90 && cloud.y - player.y < 120) && !player.jumpDown) {
            clearInterval(falling)
            player.fallingStatus = false
            player.onCloud = true
            player.jumpLimit = player.y - 150
        }
        move(cloud)

    })
    //Jump/walk through walls
    if (player.x > width) {
        player.x = 0 - player.width;
    } else if (player.x < 0 - player.width) {
        player.x = width;
    }

    if (player.onCloud) {
        player.moveWithCloud()
    }

    if (timer <= 0 || player.y - player.height > height) {
        resetGame()
    }
    
}
function resetGame() {
    submitScores()
    $('#myModal').modal('toggle');
    
    timer = 60
    score = 0

    player = new Player(width / 2, 690, 375)

    var cloudOne = new Cloud(randomX(), 150, "left", 4)
    var cloudTwo = new Cloud(randomX(), 375, "right", 3.5)
    var cloudThree = new Cloud(randomX(), 600, "left", 3)

    clouds = []
    clouds.push(cloudOne, cloudTwo, cloudThree)

    cloudOneImage.src = randomCloudImage()
    cloudTwoImage.src = randomCloudImage()
    cloudThreeImage.src = randomCloudImage()

    clearInterval(falling)
    clearInterval(jumping)

}

//Move horizontally cloud or player
function move(object) {
    object.dir === "right" ? object.x += object.floatSpeed : object.x -= object.floatSpeed
    if (object.x > 825) {
        object.dir = "left"
    } else if (object.x < 25) {
        object.dir = "right"
    }
}

function submitScores() {
    if (score > 0) {
        var obj = {}
        var d = new Date()
        var time = (d.getHours() < 10 ? '0' : '') + d.getHours() + ":" + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ":" + d.getSeconds()

        obj.time = time
        obj.score = score

        scores.push(obj)
    }

    scores.sort(function (a, b) {
        return b.score - a.score
    })

    $("#score-table tr").remove();
    $("#score-table").append("<tr>" + "<th>" + "Rank" + "</th>" + "<th>" + "Time" + "</th>" + "<th>" + "Score" + "</th>" + "</tr>")
    $(".modal-footer h4").remove()
    $(".modal-footer").append("<h4 class=text-center>" + "You scored " + score + " points." + "</h4>")
    
    scores.forEach(function (play, key) {
        play.rank = key + 1
        $("#score-table").append("<tr>" + "<td>"+ play.rank + "</td>" +  "<td>" + play.time  + "</td>" + "<td>" + play.score + "</td>" + "</tr>")
    })
}

function resetScores() {
    resetGame()
    scores = []
    localStorage.removeItem("scores")
}

var jumpSound = document.createElement("audio")
jumpSound.src = "sound/jump.mp3"
jumpSound.volume = 0.3

var backgroundMusic = document.createElement("audio")
backgroundMusic.volume = 0.2
backgroundMusic.src = "sound/dustforce.mp3"
backgroundMusic.loop = true
backgroundMusic.play()

$(document).ready(function () {
    //Load previous scores
    if (!!localStorage.scores) {
        var storedScores = JSON.parse(localStorage.getItem("scores"));
        storedScores.forEach(function (score) {
            scores.push(score)
        })
    }
    //Disable movement when modal is open
    $('#myModal').on('hide.bs.modal show.bs.modal', function () {
        disableMovement = !disableMovement
    })
    $(document).keydown(function (e) {
        if (e.keyCode === 83) {
            if (backgroundMusic.paused) {
                backgroundMusic.play()
            } else {
                backgroundMusic.pause()
            }
        }
    })

})
//Save scores
$(window).on("beforeunload", function () {
    localStorage.setItem("scores", JSON.stringify(scores))
})

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

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
