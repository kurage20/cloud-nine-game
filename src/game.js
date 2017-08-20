var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");

var width = canvas.width
var height = canvas.height

var timer = 60
var score = 0
var limit = 450
var jumpingStatus = false
var goingDown = false
var jumping
var falling
var fallingStatus = false
var onCloud = false
var clouds = []
var randomX = function() {
    return Math.random() * (width - 235)
}

var player = {
    speed: 275,
    x: 500,   
    y: 700,
    width: 80,
    height: 100,
    dir: ""
}

var Cloud = function(x,y,width,height,dir) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.dir = dir
}

var cloudOne = new Cloud(20,600,235,56, "right")
var cloud = new Cloud(randomX(), 200, 235, 56, "left")
var secondCloud = new Cloud(randomX(), 400, 235, 56, "right")


clouds.push.apply(clouds, [cloudOne,secondCloud,cloud])
var jump_y = player.y


function moveCloud(cloud) {
    if(cloud.dir === "right") {
        cloud.x+= 2
    }
    if(cloud.x > 650) {
        cloud.dir = "left"
    }
    if(cloud.dir === "left") {
        cloud.x-= 2
    }
    if(cloud.x < 150) {
        cloud.dir  = "right"
    }
}


function jump() {
    if(player.y > limit && !goingDown){
        jumpingStatus = true
        player.y-=6 ;
    } else {
        if(!fallingStatus) {
            goingDown = true;
            player.y +=6;
        }

        if(player.y === jump_y) {
            goingDown = false
            jumpingStatus = false
            clearInterval(jumping);
        }
           clouds.forEach(function(cloud) {
            if((player.x + 15 < cloud.x + cloud.width) && (player.x + player.width - 15  > cloud.x) && (player.y + player.height > cloud.y ) && (player.y + player.height < cloud.y + cloud.height) )  {
                score++
                goingDown = false;
                jumpingStatus = false
                onCloud = true
                clearInterval(jumping)
                console.log(player.y)
                if(player.y < 550 && player.y > 400) {
                    limit=350
                }
                if(player.y < 400 && player.y > 300) {
                    limit= 250
                }
                if(player.y < 300 && player.y > 0) {
                    limit = 150
                }
                
            }
       
           }) 
    }
}

var timerTick = setInterval(function() {
    timer--
    if(timer === 0) {
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
var getRandomCloud = function() {
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
    ctx.drawImage(randomCloudOne, clouds[2].x, clouds[2].y, clouds[2].width, clouds[2].height ) 
    
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
function fall() {
    fallingStatus = true
    falling = setInterval(function() {
        player.y +=6;
    }, 10)
}

// Update game objects
var update = function (modifier) {
    if(38 in keysDown) {
        if(!jumpingStatus) {
            jumping = setInterval(jump,10)
        }
    }
    if (37 in keysDown) { 
        if(player.x > 5) {
            player.x -= player.speed * modifier;
        }

	}
    if (39 in keysDown) { 
        player.x += player.speed * modifier;    

    }
    checkPosition()
    
    if(onCloud) {
        moveWithCloud()
    }
    clouds.forEach(function(cloud) {
        moveCloud(cloud)
    })
 


};
function checkPosition() {
    clouds.forEach(function(cloud) {
        if((player.x + 15 < cloud.x + cloud.width) && (player.x + player.width - 15  > cloud.x) && (player.y - player.height === cloud.y - cloud.height) ) {
            goingDown = true
            jumpingStatus = false
            
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

clouds.forEach(function(cloud) {
    if(!goingDown && jumpingStatus && player.y < height / 2) {
        cloud.y+=8
    }
    if(cloud.y > height) {
        cloud.y = cloud.y - height + 150
    }
})


}

function moveWithCloud() {
    clouds.forEach(function(cloud) {
        if(cloud.y - player.y > 100 && cloud.y - player.y < 150) {
            player.dir = cloud.dir
            moveCloud(player)      
        }
    })

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

var then = Date.now();
main();
