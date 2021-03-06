

var canvas = document.getElementById('myCanvas');
var canvasContext = canvas.getContext('2d');
const FRAMES_PER_SECOND = 30;
const SECOND_IN_MILISECONDS = 1000;
const Y_THRESHOLD = canvas.height;
const X_THRESHOLD = canvas.width;

var speedTimer;
var sizeTimer;
var doublePointsTimer;
var gameTimer; 

var spawnRate;

var playerCharacter;

var characters;
var items;
var enemies;
var obsticles;
var debugObj;

var particleEngine;






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

debugObj = new debug();
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

	this.moveFlags = {up:false,down:false,left:false,right:false}
	this.draw = function ()
	{	

		drawCircle(this.x, this.y, this.size,"White");
		 
	};
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
			


		
	}
};

var trail = function()
{
	this.x = 0;
	this.y = 0;
	this.size = 1;
	this.colour = new colourObj;

	this.draw = function()
	{
		drawCircle(this.x,this.y,this.size, "Red");
	}

	this.update = function()
	{

	}
}

var enemy = function()
{
	this.x = 0;
	this.y = 0;
	this.xv = 0;
	this.yv = 0;
	this.mXV = 20;
	this.mYV = 20;
	this.speed = 0.1;
	this.friction = 0.01;
	this.size = 0;
	this.type = "type";
	this.damage = 0;
	this.playerX = 0;
	this.playerY = 0;
	this.trail = new Array();

	this.colour = new colourObj;

	this.moveFlags = {up:false,down:false,left:false,right:false}
	this.draw = function()
	{
		drawCircle(this.x,this.y,this.size, "Red");

		for(seg in this.trail)
		{
			this.trail[seg].draw();
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

		

		if(this.trail.length <= 200)
		{
			var trailseg = new trail();
			trailseg.x = this.x;
			trailseg.y = this.y;
			this.trail.push(trailseg);
		}
		else
		{
			this.trail.splice(0,1);
			var trailseg = new trail();
			trailseg.x = this.x;
			trailseg.y = this.y;
			this.trail.push(trailseg);

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

/*

	The character rushes to grab money bags. 
	Each bag adds to the timer as well as the users points.

	Power ups:
		- speed
		- double points
		- size?

*/

window.addEventListener('keydown',function(event){
			checkKey(event);
	},false);
window.addEventListener('keyup',function(event){
			keyupListener(event);
	},false);

function keyupListener(event)
{
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
resetGame();

function resetGame()
{
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

	particleEngine = new particleEffectComponant();
	particleEngine.construct(canvas,canvasContext,FRAMES_PER_SECOND);
	
	characters = new Array();
	enemies = new Array();
	items = new Array();
	obsticles = new Array();



	/*var ob1 = new obsticle();
	ob1.type = "speed";
	ob1.x = 0;
	ob1.y = 0;
	ob1.width = 50;
	ob1.height = 100;

	obsticles.push(ob1);

	var ob2 = new obsticle();
	ob2.type = "sticky";
	ob2.x = 100;
	ob2.y = 0;
	ob2.width = 50;
	ob2.height = 100;

	obsticles.push(ob2);

	var ob3 = new obsticle();
	ob3.type = "lava";
	ob3.x = 200;
	ob3.y = 0;
	ob3.width = 50;
	ob3.height = 100;

	obsticles.push(ob3);

	var ob4 = new obsticle();
	ob4.type = "wall";
	ob4.x = 300;
	ob4.y = 0;
	ob4.width = 50;
	ob4.height = 100;

	obsticles.push(ob4);*/

	var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);
	var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);
	var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);
	var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);
	var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);
	var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);
	var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);
	var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);
	var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);
	var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);
	var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);
	var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);

	
	
	setInterval(mainLoop, SECOND_IN_MILISECONDS/FRAMES_PER_SECOND);
	setInterval(gameTimerFunction,SECOND_IN_MILISECONDS);
	setInterval(spawnItems, SECOND_IN_MILISECONDS*spawnRate);
	

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

function spawnEnemies()
{
	var newEnemy = new enemy();
	newEnemy.size = 3;
	newEnemy.x = Math.random() * canvas.width;
	newEnemy.y = Math.random() * canvas.height;
	enemies.push(newEnemy);
}

function drawEverything()
{
	drawRect(0, 0, canvas.width, canvas.height, "Black");
	for(ob in obsticles)
	{
		obsticles[ob].draw();
	}
	for(e in enemies)
	{
		enemies[e].draw();
	}
	playerCharacter.draw();
	drawMidText((gameTimer/SECOND_IN_MILISECONDS),20,40,"white");


	
	for(thing in items)
	{
		items[thing].draw();
	}

	particleEngine.drawEverything();
}


function updateEverything()
{

	playerCharacter.update();
	for(e in enemies)
	{
		enemies[e].getPlayer(playerCharacter.x,playerCharacter.y);
		enemies[e].update();
	}
	checkCollisions();

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
	//colorRed,colorGreen,colorBlue,duration, framesPerSecond,particleSize,maxNumParticles,startX,startY,particleLifespan,spawnRate,type,width)
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
		//colorRed,colorGreen,colorBlue,duration, framesPerSecond,particleSize,maxNumParticles,startX,startY,particleLifespan,spawnRate,type,width)
		particleEngine.spark(255,255,255,playerCharacter.x,playerCharacter.y)
	}
	
	if(((playerCharacter.y + playerCharacter.size) >= canvas.height) || ((playerCharacter.y - playerCharacter.size) <= 0))
	{

		playerCharacter.yv = playerCharacter.yv * -1;

		//trigger particle effect
		//colorRed,colorGreen,colorBlue,duration, framesPerSecond,particleSize,maxNumParticles,startX,startY,particleLifespan,spawnRate,type,width)
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

	//------Enemies-------//
	for(e in enemies)
	{
		//check  collisions with wall
		if(((enemies[e].x + enemies[e].size) >= canvas.width) || ((enemies[e].x - enemies[e].size) <= 0))
		{

			enemies[e].xv = enemies[e].xv * -1;

			//trigger particle effect
			//colorRed,colorGreen,colorBlue,duration, framesPerSecond,particleSize,maxNumParticles,startX,startY,particleLifespan,spawnRate,type,width)
			particleEngine.spark(255,0,0,enemies[e].x,enemies[e].y)
		}
		
		if(((enemies[e].y + enemies[e].size) >= canvas.height) || ((enemies[e].y - enemies[e].size) <= 0))
		{

			enemies[e].yv = enemies[e].yv * -1;

			//trigger particle effect
			//colorRed,colorGreen,colorBlue,duration, framesPerSecond,particleSize,maxNumParticles,startX,startY,particleLifespan,spawnRate,type,width)
			particleEngine.spark(255,0,0,enemies[e].x,enemies[e].y)
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






