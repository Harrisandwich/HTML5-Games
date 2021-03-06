var canvas = document.getElementById('myCanvas');
var canvasContext = canvas.getContext('2d');

var speedTimer;
var sizeTimer;
var doublePointsTimer;
var gameTimer; 

var spawnRate;

var playerCharacter;

var characters;
var items;
var bodies;
var obsticles;
var debugObj;
var followMouse;
var mouseX;
var mouseY; 

var isCollisionOn;
var amount;

var particleEngine;
var simTimer;
function nbodySetup()
{
	FRAMES_PER_SECOND = 30;
	SECOND_IN_MILISECONDS = 1000;
	Y_THRESHOLD = canvas.height;
	X_THRESHOLD = canvas.width;
	debugObj = new debug();

	canvas.addEventListener('mousemove',function(event){
				mouseX = event.clientX;
				mouseY = event.clientY;
		});
	window.addEventListener('keydown',function(event){
				checkKey(event);
		},false);
	window.addEventListener('keyup',function(event){
				keyupListener(event);
		},false);

	resetGame();

}



var debug = function()
{
	this.debugFlag =true;

	this.trace = function(message)
	{
		if(this.debugFlag)
		{
			console.log(message);
		}
	}

};


var character = function () 
{
	this.score = 0;
	this.x = 0;
	this.y = 0;
	this.xv = 0;
	this.yv = 0;
	this.mXV = 20;
	this.mYV = 20;
	this.speed = 0.5;
	this.friction = 0.1;
	this.size = 10;
	this.colour = new colourObj();

	this.colour.red = 255;
	this.colour.blue = 255;
	this.colour.green = 255; 

	this.colour.alpha = 0.6;

	this.moveFlags = {up:false,down:false,left:false,right:false}
	this.draw = function ()
	{	

		drawCircle(this.x, this.y, this.size,this.colour.getString());
		 
	};
	this.update = function()
	{
		if(!followMouse)
		{
			if(this.xv < this.mXV && this.moveFlags.right)
			{
				this.xv += this.speed;
			}
			if(this.xv > -this.mXV && this.moveFlags.left)
			{
				this.xv += this.speed * -1;
			}
			if (this.xv > this.mXV)
			{
				this.xv = this.mXV;
			}

			if(this.yv < this.mYV && this.moveFlags.down)
			{
				this.yv += this.speed;
			}

			else if(this.yv > -this.mYV && this.moveFlags.up)
			{
				this.yv += this.speed * -1;
			}
			else if (this.yv > this.myV)
			{
				this.yv = this.myV;
			}



			this.x += this.xv;
			this.y += this.yv;

			

				if(this.xv > 0)
				{
					this.xv -= this.friction;
				}
				else if (this.xv < 0)
				{
					this.xv += this.friction;
				}
				
				
			
				if(this.yv > 0)
				{
					this.yv -= this.friction;
				}
				else if (this.yv < 0) 
				{
					this.yv += this.friction;
				}

		}
		else
		{
			this.x = mouseX;
			this.y = mouseY;
		}
			


		
	}
};

var trail = function()
{
	this.x = 0;
	this.y = 0;
	this.size = 1;
	this.colour = new colourObj();

	this.draw = function()
	{
		drawCircle(this.x,this.y,this.size, this.colour.getString());
	}

	this.setColour = function(cObj)
	{
		this.colour = cObj;
	}
	this.update = function()
	{

	}
}

var nBody = function()
{
	this.x = 0;
	this.y = 0;
	this.xv = 0;
	this.yv = 0;
	this.mXV = 10;
	this.mYV = 10;
	this.speed = 0.05;
	this.friction = 0.0;
	this.size = 0;
	this.type = "type";
	this.damage = 0;
	this.playerX = 0;
	this.playerY = 0;
	this.trails = new Array();
	this.trailLength = 200;

	this.redToGreen = true;
	this.greenToBlue = false;
	this.blueToRed = false;

	this.colour = new colourObj();
	this.colour.blue = 0;
	this.colour.red = 255;
	this.colour.green  = 0;

	this.moveFlags = {up:false,down:false,left:false,right:false}
	this.draw = function()
	{
		drawCircle(this.x,this.y,this.size, this.colour.getString());

		for(seg in this.trails)
		{
			this.trails[seg].draw();
		}
	}
	this.update = function()
	{
		if(this.xv < this.mXV && this.moveFlags.right)
		{
			this.xv += this.speed;
		}
		if(this.xv > -this.mXV && this.moveFlags.left)
		{
			this.xv += this.speed * -1;
		}
		if (this.xv > this.mXV)
		{
			this.xv = this.mXV;
		}

		if(this.yv < this.mYV && this.moveFlags.down)
		{
			this.yv += this.speed;
		}

		else if(this.yv > -this.mYV && this.moveFlags.up)
		{
			this.yv += this.speed * -1;
		}
		else if (this.yv > this.myV)
		{
			this.yv = this.myV;
		}



		this.x += this.xv;
		this.y += this.yv;

		

		if(this.xv > 0)
		{
			this.xv -= this.friction;
		}
		else if (this.xv < 0)
		{
			this.xv += this.friction;
		}
		
		
	
		if(this.yv > 0)
		{
			this.yv -= this.friction;
		}
		else if (this.yv < 0) 
		{
			this.yv += this.friction;
		}

		/*if(this.xv <= 1 && this.yv <= 1)
		{
			if(this.zIndex == 0)
			{
				this.zIndex = 2;
			}
		}*/

		if(this.colour.red == 255 && this.colour.green == 0)
		{
			this.redToGreen = true;
			this.greenToBlue = false;
			this.blueToRed = false;
		}
		else if(this.colour.green == 255 && this.colour.blue == 0)
		{
			this.redToGreen = false;
			this.greenToBlue = true;
			this.blueToRed = false;
		}
		else if(this.colour.blue == 255 && this.colour.red == 0)
		{
			this.redToGreen = false;
			this.greenToBlue = false;
			this.blueToRed = true;
		}

		

		if(this.redToGreen)
		{
			this.colour.red -= 1;
			this.colour.green += 1;
		}
		else if(this.greenToBlue)
		{
			this.colour.green -= 1;
			this.colour.blue += 1;
		}
		if(this.blueToRed)
		{
			this.colour.blue -= 1;
			this.colour.red += 1;
		}

		if(this.trails.length <= this.trailLength)
		{
			var trailseg = new trail();
			trailseg.x = this.x;
			trailseg.y = this.y;
			trailseg.colour.red = this.colour.red;
			trailseg.colour.blue = this.colour.blue;
			trailseg.colour.green = this.colour.green;

			this.trails.push(trailseg);
		}
		else
		{
			
			var trailseg = new trail();
			trailseg.x = this.x;
			trailseg.y = this.y;
			trailseg.colour.red = this.colour.red;
			trailseg.colour.blue = this.colour.blue;
			trailseg.colour.green = this.colour.green;
			this.trails.push(trailseg);
			this.trails.splice(0,1);

		}
		
			

	}

	this.getPlayer = function(playerX, playerY)
	{
		this.playerX = playerX;
		this.playerY = playerY;
		this.setDirection();
	}
	this.setDirection = function()
	{
		if(this.playerX > this.x)
		{
			this.moveFlags.right = true;
			this.moveFlags.left = false;
		}
		else if(this.playerX < this.x)
		{
			this.moveFlags.right = false;
			this.moveFlags.left = true;
		}

		if(this.playerY > this.y)
		{
			this.moveFlags.up = false;
			this.moveFlags.down = true;
		}
		else if(this.playerY < this.y)
		{
			this.moveFlags.up = true;
			this.moveFlags.down = false;
		}

	}
}

var pickup = function ()
{
	this.x = 0;
	this.y = 0;
	this.size = 0;
	this.type = "type";

	this.pointValue;
	//Effect is either 'speed', 'dub points', 'size', or 'damage'
	this.effect;
	//adds to the timer of the effect
	this.effectValue;
	
	this.draw = function()
	{
		switch(this.type)
		{
			case "double":
				drawCircle(this.x,this.y,this.size, "Blue");
				break;
			case "damage":
				drawCircle(this.x,this.y,this.size, "Red");
				break;
			default:
				drawCircle(this.x,this.y,this.size, "Yellow");
				break;

		}
		
	}
	this.update = function()
	{
		
	}
};

var obsticle = function()
{
	this.type = "wall";
	this.x = 0;
	this.y = 0;
	this.width = 10;
	this.height = 10;


	this.draw = function()
	{
		switch(this.type)
		{
			case "sticky":
				drawRect(this.x,this.y,this.width,this.height, "Green");
				break;
			case "lava":
				drawRect(this.x,this.y,this.width,this.height, "Red");
				break;
			case "speed":
				drawRect(this.x,this.y,this.width,this.height, "Orange");
				break;
			default:
				drawRect(this.x,this.y,this.width,this.height, "White");
				break;

		}
	}



}



function keyupListener(event)
{
	event.preventDefault();
	switch(event.keyCode)	
			{
				case 37:
					playerCharacter.moveFlags.left = false;
					break;
				case 38:
					playerCharacter.moveFlags.up = false;
					break;
				case 39:
					playerCharacter.moveFlags.right = false;
					break;
				case 40:
					playerCharacter.moveFlags.down = false;
					break;
			}
}
function checkKey(event)
{		
		
		event.preventDefault();
		if(event.keyCode == 37)
		{
			playerCharacter.moveFlags.left = true;
		}

		if(event.keyCode == 38)
		{
			playerCharacter.moveFlags.up = true;
			
		}

		if(event.keyCode == 39)
		{
			playerCharacter.moveFlags.right = true;
			
		}

		if(event.keyCode == 40)
		{
			playerCharacter.moveFlags.down = true;
			
		}
					
			


}

//---------------------------------levels-------------------------------------------------//

var level = function()
{

	this.number = 0;
	this.obsticles = new Array();
	this.items = new Array();


}

//---------------------------------levels-------------------------------------------------//


function resetGame()
{
	characters = new Array();
	bodies = new Array();
	items = new Array();
	obsticles = new Array();
	particleEngine = new particleEffectComponant();
	closeMenu();
	drawBackground();
	setSpeed(0.1);
	setFriction(0.01);
	setTrail(200);
	setNumberOfBodies(10);
	debugObj.trace("Game reset start");
	debugObj.debugFlag = false;
	playerCharacter = new character();
	playerCharacter.x = canvas.width/2;
	playerCharacter.y = canvas.height/2;
	speedTimer = 0;
	sizeTimer = 0;
	doublePointsTimer = 0;
	spawnRate = 3;
	gameTimer = SECOND_IN_MILISECONDS * 10;
	amount = 10;
	isCollisionOn = false;
	followMouse = false;
	particleEngine.construct(canvas,canvasContext,FRAMES_PER_SECOND);
	
	resetBodies();

	
	
	simTimer = setInterval(mainLoop, SECOND_IN_MILISECONDS/FRAMES_PER_SECOND);
	//setInterval(gameTimerFunction,SECOND_IN_MILISECONDS);
	//setInterval(spawnItems, SECOND_IN_MILISECONDS*spawnRate);
	

}
function resetBodies()
{
	bodies = new Array();
	
	for(var i = 0; i < amount; i++)
	{
		spawnBody();
	}
	setSpeed(document.getElementById("speed").value);
	setFriction(document.getElementById("friction").value);
	setTrail(document.getElementById("trail").value);
}

function setNumberOfBodies(value)
{
	var amountOf = Number(value);
	amount = amountOf;
	if(amountOf > bodies.length)
	{
		var difference = amountOf - bodies.length;
		for(var i = 0; i < difference; i++)
		{
			spawnBody();
		}
	}
	else if(amountOf < bodies.length)
	{
		var difference = bodies.length - amountOf;
		for(var i = 0; i < difference; i++)
		{
			bodies.splice(0,1);
		}
	}

	setSpeed(document.getElementById("speed").value);
	setFriction(document.getElementById("friction").value);
	setTrail(document.getElementById("trail").value);


	document.getElementById("amountLabel").innerHTML = value;
	document.getElementById("numberOf").value = Number(value);
}
function toggleCollision(value)
{
	if(value)
	{
		isCollisionOn = true;
	}
	else
	{
		isCollisionOn = false;
	}
}

function toggleFollowMouse(value)
{
	if(value)
	{
		followMouse = true;
	}
	else
	{
		followMouse = false;
	}
}
function mainLoop()
{
	//debugObj.trace("main loop running");

	drawEverything();
	updateEverything();
}
function gameTimerFunction()
{
	gameTimer -= SECOND_IN_MILISECONDS;
}
function spawnItems()
{
	var newItem = new pickup();
	newItem.size = 5;
	newItem.x = Math.random() * canvas.width;
	newItem.y = Math.random() * canvas.height;
	items.push(newItem);
}

function spawnBody()
{
	var newBody = new nBody();
	newBody.size = 3;
	newBody.x = Math.random() * canvas.width;
	newBody.y = Math.random() * canvas.height;
	bodies.push(newBody);
}

function drawEverything()
{
	drawBackground();
	for(ob in obsticles)
	{
		obsticles[ob].draw();
	}
	for(e in bodies)
	{
		bodies[e].draw();
	}
	playerCharacter.draw();
	//drawMidText((gameTimer/SECOND_IN_MILISECONDS),20,40,"white");


	
	for(thing in items)
	{
		items[thing].draw();
	}

	particleEngine.drawEverything();
}


function updateEverything()
{

	playerCharacter.update();
	for(e in bodies)
	{
		bodies[e].getPlayer(playerCharacter.x,playerCharacter.y);
		bodies[e].update();
	}

	if(isCollisionOn)
	{
		checkCollisions();
	}
	particleEngine.updateEverything();



}


function checkCollisions()
{
	if(items.length > 0)
	{
		for(var i = 0; i < items.length; i++)
		{
			if(getDistanceBetweenCircles(playerCharacter, items[i]))
			{
				pickupParticleEffect(items[i]);
				items.splice(i,1);
				//awared points 
				
				gameTimer += 3 * SECOND_IN_MILISECONDS;
			}
		}
	}
	checkWallCollide();
	
	
}

function pickupParticleEffect(item)
{
	//colorRed,colorGreen,colorBlue,duration, framesPerSecond,bodiesize,maxNumbodies,startX,startY,particleLifespan,spawnRate,type,width)
		particleEngine.spark(255,255,0,item.x,item.y);
}

function checkWallCollide()
{
	//--------Player--------//
	//check  collisions with wall
	if(((playerCharacter.x + playerCharacter.size) >= canvas.width) || ((playerCharacter.x - playerCharacter.size) <= 0))
	{

		playerCharacter.xv = playerCharacter.xv * -1;

		//trigger particle effect
		//colorRed,colorGreen,colorBlue,duration, framesPerSecond,bodiesize,maxNumbodies,startX,startY,particleLifespan,spawnRate,type,width)
		particleEngine.spark(255,255,255,playerCharacter.x,playerCharacter.y)
	}
	
	if(((playerCharacter.y + playerCharacter.size) >= canvas.height) || ((playerCharacter.y - playerCharacter.size) <= 0))
	{

		playerCharacter.yv = playerCharacter.yv * -1;

		//trigger particle effect
		//colorRed,colorGreen,colorBlue,duration, framesPerSecond,bodiesize,maxNumbodies,startX,startY,particleLifespan,spawnRate,type,width)
		particleEngine.spark(255,255,255,playerCharacter.x,playerCharacter.y)
	}


	for(ob in obsticles)
	{
		if(getRectCollision(playerCharacter,obsticles[ob]))
		{
			if(obsticles[ob].type == "sticky")
			{
				playerCharacter.yv -= playerCharacter.yv/3;
				playerCharacter.xv -= playerCharacter.xv/3;
			}
			else if(obsticles[ob].type == "lava")
			{
				playerCharacter.yv -= playerCharacter.yv/3;
				playerCharacter.xv -= playerCharacter.xv/3;
				//remove time
			}
			else if(obsticles[ob].type == "speed")
			{
				if(playerCharacter.yv < playerCharacter.mYV){playerCharacter.yv += playerCharacter.yv/8;}
				playerCharacter.xv += playerCharacter.xv/8;
			}
			else
			{
				playerCharacter.yv = playerCharacter.yv * -1;
				playerCharacter.xv = playerCharacter.xv * -1;
			}
			
		}
	}

	//------bodies-------//
	for(e in bodies)
	{
		//check  collisions with wall
		if(((bodies[e].x + bodies[e].size) >= canvas.width) || ((bodies[e].x - bodies[e].size) <= 0))
		{

			bodies[e].xv = bodies[e].xv * -1;

			//trigger particle effect
			//colorRed,colorGreen,colorBlue,duration, framesPerSecond,bodiesize,maxNumbodies,startX,startY,particleLifespan,spawnRate,type,width)
			particleEngine.spark(255,0,0,bodies[e].x,bodies[e].y)
		}
		
		if(((bodies[e].y + bodies[e].size) >= canvas.height) || ((bodies[e].y - bodies[e].size) <= 0))
		{

			bodies[e].yv = bodies[e].yv * -1;

			//trigger particle effect
			//colorRed,colorGreen,colorBlue,duration, framesPerSecond,bodiesize,maxNumbodies,startX,startY,particleLifespan,spawnRate,type,width)
			particleEngine.spark(bodies[e].colour.red,bodies[e].colour.green,bodies[e].colour.blue,bodies[e].x,bodies[e].y)
		}
	}

}

function getRectCollision(player, obsticle)
{
	var top = obsticle.y;
	var bottom = obsticle.y + obsticle.height;
	var left = obsticle.x;
	var right = obsticle.x + obsticle.width;

	var colliding = false;


	if(player.x > left && player.x < right)
	{

		if(player.y > top && player.y < bottom)
		{
			colliding = true;
		}

	}

	return colliding
}

function getDistanceBetweenCircles(object1, object2)
{
	var dx; 
	var dy; 
	var dis;
	var isColliding = false;
	
	dx = object1.x - object2.x;
	dy = object1.y - object2.y;


		

	dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

	if(dis < object1.size + object2.size)
	{
		isColliding = true;
	}
	
	return isColliding;
}




var colourObj = function()
{
	this.red = 0;
	this.blue = 0;
	this.green = 0;
	this.alpha = 1.0;
	
	this.getString = function()
	{
		return "rgba("+this.red+","+this.green+","+this.blue+","+this.alpha+")";
	
	}

};

function setSpeed(val)
{
	for(obj in bodies)
	{
		bodies[obj].speed = Number(val);
	}

	document.getElementById("speedLabel").innerHTML = val;
	document.getElementById("speed").value = val;
}

function setFriction(val)
{
	for(obj in bodies)
	{
		bodies[obj].friction = Number(val);
	}

	document.getElementById("frictionLabel").innerHTML = val;
	document.getElementById("friction").value = val;
}

function setTrail(val)
{
	for(obj in bodies)
	{
		bodies[obj].trailLength = Number(val);
	}

	document.getElementById("trailLabel").innerHTML = val;
	document.getElementById("trail").value = val;
}

function drawBackground()
{
    (function() {

        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', resizeCanvas, false);
        
        function resizeCanvas() {

                
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
                
                
                
                /**
                 * Your drawings need to be inside this function otherwise they will be reset when 
                 * you resize the browser window and the canvas goes will be cleared.
                 */
                drawStuff(); 
        }
        resizeCanvas();
        
        function drawStuff() {
                // do your drawing stuff here
        }
    })();
}


function clearSwarm()
{
	
	characters = null;
	bodies = null;
	items = null;
	obsticles = null;
	speedTimer = null;
    sizeTimer = null;
    doublePointsTimer = null;
    gameTimer = null; 

    spawnRate = null;

    playerCharacter = null;

    characters = null;
    items = null;
    bodies = null;
    obsticles = null;
    debugObj = null;
    followMouse = null;
    mouseX = null;
    mouseY = null; 

    isCollisionOn = null;
    amount = null;

    particleEngine = null;

    clearInterval(simTimer);
    drawBackground();
	
}


function closeMenu()
{

	$("#menuItems").hide();
	$("#menu-bar").css("background-color", "rgba(0,0,0,0)");
	$("#arrow").attr("onclick", "openMenu()");
	$("#arrowText").html("Options");
}

function openMenu()
{
	$("#menuItems").show();
	$("#menu-bar").css("background-color", "rgba(30,30,30,1)");
	$("#arrow").attr("onclick", "closeMenu()");
	$("#arrowText").html("Close");
}
