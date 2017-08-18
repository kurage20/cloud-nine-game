var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");

var timer = 60
var score = 0
var limit = 180
var jumping
var goingDown = false
var onCloud = true
var falling

var hero = {
    speed: 300,
    x: 20,   
    y: 460,
    defaultX: 20,
    defaultY: 460
}

var startCloud = {
    x: 20,
    y: 580
}
var cloud = {
    x: 600,
    y: 400
}

var secondCloud = {
    x:300,
    y:200
}

var jump_y = hero.y


function moveCloud() {
    var move = setInterval(function() {
        if(cloud.x < 150) {
            clearInterval(move)
            moveCloudRight()
        }
        cloud.x-= 2
        
    }, 15)
}
moveCloud()


var moveCloudRight = function() {
    var move = setInterval(function() {
        if(cloud.x > 599) {
            clearInterval(move)
            moveCloud()
        }
        cloud.x += 2
    }, 15)
}

function jump() {
    if(hero.y > limit && !goingDown){
        hero.y-=7;
        
    } else {
    goingDown = true;
        hero.y +=7;
        if(hero.y > jump_y) {
            goingDown = false;
            clearInterval(jumping);
            if(hero.x > 230) {
                fall()
            }
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

var clouds = ["../PNG/cloud1.png", "../PNG/cloud2.png", "../PNG/cloud3.png"]

bgImage.src = "../PNG/background.png";
heroImage.src = "../PNG/JumpJumpBoy.png";
timerImage.src = "../PNG/clock.png"
scoreImage.src = "../PNG/cloud_counter.png"
startCloudImage.src = clouds[0] 
randomCloud.src = clouds[Math.floor(Math.random() * clouds.length)]
randomCloudSecond.src = clouds[Math.floor(Math.random() * clouds.length)]



// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    if(e.keyCode === 38) {
        jumping = setInterval(jump, 10)
    }
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


var render = function () {
	ctx.drawImage(bgImage, 0, 0);
    ctx.drawImage(heroImage, hero.x, hero.y, 100, 120);
    ctx.drawImage(startCloudImage, startCloud.x, startCloud.y, 235, 56)
    ctx.drawImage(randomCloud, cloud.x, cloud.y, 235, 56)
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
    falling = setInterval(function() {
        hero.y +=10;
    },20)
}

// Update game objects
var update = function (modifier) {
    if (37 in keysDown) { // Player holding left
        if(hero.x > 5) {
            hero.x -= hero.speed * modifier;
        }

	}
	if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
        console.log(hero.x)
            
       /* if(hero.x > cloud.x || hero.x < startCloud.x ) {
                fall()
                
            }*/

    }

};

var main = function () {
	var now = Date.now();
    var delta = now - then;

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

var then = Date.now();
main();
