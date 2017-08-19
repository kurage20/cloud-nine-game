var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");

var width = canvas.width
var height = canvas.height

var timer = 60
var score = 0
var limit = 325
var jumpingStatus = false
var goingDown = false
var jumping
var falling
var onCloud = false
var clouds = []

var hero = {
    speed: 250,
    x: 20,   
    y: 590,
    defaultX: 20,
    defaultY: 460,
    width: 90,
    height: 110
}

var startCloud = {
    x: 20,
    y: 700,
    width: 235,
    height: 56
}
var cloud = {
    x: Math.random() * (width - 235),
    y: width / 2,
    width: 235,
    height: 56
}

var secondCloud = {
    x:Math.random() * (width - 235),
    y: width / 4,
    width: 235,
    height: 56
}

var jump_y = hero.y


function moveCloud(cloud) {
    var move = setInterval(function() {
        if(cloud.x < 150) {
            clearInterval(move)
            moveCloudRight(cloud)
        }
        cloud.x-= 2
        
    }, 15)
}

var moveCloudRight = function(cloud) {
    var move = setInterval(function() {
        if(cloud.x > 650) {
            clearInterval(move)
            moveCloud(cloud)
        }
        cloud.x += 2
    }, 15)
}

function jump() {
    console.log(hero.x)
    console.log(cloud.x)
    if(hero.y > limit && !goingDown){
        jumpingStatus = true
        hero.y-=7 ;
    } else {
    goingDown = true;
        hero.y +=7;
        if(hero.y === jump_y) {
            goingDown = false
            jumpingStatus = false
            clearInterval(jumping);
        }
        console.log(hero.x)
            if((hero.x + 15 < cloud.x + cloud.width) && (hero.x + hero.width - 15  > cloud.x) && (hero.y + hero.height > cloud.y) && (hero.y + hero.height < cloud.y + cloud.height) )  {
                goingDown = false;
                limit= 100
                jumpingStatus = false
                clearInterval(jumping)
                onCloud = true
                console.log(limit)
            }
            if((hero.x + 15 < secondCloud.x + secondCloud.width) && (hero.x + hero.width - 15  > secondCloud.x) && (hero.y + hero.height > secondCloud.y) && (hero.y + hero.height < secondCloud.y + secondCloud.height) )  {
                limit = 0
                goingDown = false
                jumpingStatus = false
                clearInterval(jumping)
            }

           
    }
}

var timerTick = setInterval(function() {
    timer--
    if(timer === 0) {
        clearInterval(timerTick)
    }
    
}, 1000)

var bgImage = new Image();
var heroImage = new Image();
var timerImage = new Image()
var scoreImage = new Image()
var startCloudImage = new Image()
var randomCloud = new Image()
var randomCloudSecond = new Image()

var cloudImages = ["../PNG/cloud1.png", "../PNG/cloud2.png", "../PNG/cloud3.png"]

bgImage.src = "../PNG/background.png";
heroImage.src = "../PNG/JumpJumpBoy.png";
timerImage.src = "../PNG/clock.png"
scoreImage.src = "../PNG/cloud_counter.png"
startCloudImage.src = cloudImages[0] 
randomCloud.src = cloudImages[Math.floor(Math.random() * cloudImages.length)]
randomCloudSecond.src = cloudImages[Math.floor(Math.random() * cloudImages.length)]


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
    ctx.drawImage(heroImage, hero.x, hero.y, hero.width, hero.height);
    ctx.drawImage(startCloudImage, startCloud.x, startCloud.y, startCloud.width, startCloud.height)
    ctx.drawImage(randomCloud, cloud.x, cloud.y, cloud.width, cloud.height)
    ctx.drawImage(randomCloudSecond, secondCloud.x, secondCloud.y, 235, 56 )

    // Score
    ctx.drawImage(timerImage, 20, 20, 25, 35)
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "35px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
    ctx.fillText(timer, 55, 20);
    
    //Timer
    ctx.drawImage(scoreImage, 900, 15, 74, 42)
    ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "35px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
    ctx.fillText(score, 870, 20);
    
    
};
function fall() {
    jumpingStatus = false
    goingDown = true
    falling = setInterval(function() {
        hero.y +=1;
    },20)

}

// Update game objects
var update = function (modifier) {
    if(38 in keysDown) {
        console.log(hero.y)
        if(!jumpingStatus) {
            jumping = setInterval(jump,10)
        }
    }
    if (37 in keysDown) { // Player holding left
        if(hero.x > 5) {
            hero.x -= hero.speed * modifier;
        }

	}
    if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;


    }

};
function checkPosition() {
    if(( startCloud.y - 130 < hero.y && hero.x > startCloud.x + startCloud.width / 1.2)  || (hero.x > cloud.x + cloud.width / 1.2) || ( hero.y < cloud.y && hero.x + hero.width < cloud.x && !jumpingStatus) ) {
        fall()
        
    }
}

var main = function () {
	var now = Date.now();
    var delta = now - then;
    checkPosition()
	update(delta / 1000);
	render();
	then = now;

    requestAnimationFrame(main);
 
};
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Make canvas responsive 
function resize(){    
    $("#canvas").outerHeight($(window).height()-$("#canvas").offset().top- Math.abs($("#canvas").outerHeight(true) - $("#canvas").outerHeight()));
  }
  $(document).ready(function(){
    $(window).on("resize", function(){                      
        resize();
    });
  });

moveCloud(cloud)
moveCloud(secondCloud)

var then = Date.now();
main();
