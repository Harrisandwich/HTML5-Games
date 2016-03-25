/*

	File: SGEplus.js
	Author: Harrison Hutcheon
	Date: December 5th, 2015

	Description: SGEplus is meant to be a all-in-on javascript game engine for making simple games
	for the web browers using javascript and the html5 canvas. It includes a number of different utlities
	created for the sole purpose of making 2D games as quickly as possible. It's inspired by Unity's componant/game object 
	based system.

*/

//Utilies-------------------------------------------------------------------------------------------------------------//
function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

var SGEplus = {

//Listeners-----------------------------------------------------------------------------------------------------------//
	keyDownListener: window.addEventListener('keydown',function(event){
		SGEplus.trace("key down: " + event.keyCode);	
		SGEplus.checkInput(event);	
	},false),
	
	keyUpListener: window.addEventListener('keyup',function(event){
		SGEplus.trace("key up: " + event.keyCode);
	},false),
	mouseDownListener: window.addEventListener('mousedown',function(event){
		SGEplus.trace("mouse down");
		SGEplus.checkInput(event);
	},false),
	mouseUpListener: window.addEventListener('mouseup',function(event){
		SGEplus.trace("mouse up");
	},false),

	
//Member Varables-----------------------------------------------------------------------------------------------------//
	framesPerSecond: null,
	SECONDS_IN_MILISECONDS: 1000,
	canvas: null,
	canvasContext: null,
	initailized: false,
	debug: true,
	game: null,

//Objects-------------------------------------------------------------------------------------------------------------//
	inputMap:
	{
		maps: new Array(),
		map: function()
		{
			input = 0;
			action = null;

		},
		keyMaps:
		[
			//mouse
			{
				inputString: "mousedown",
				keyCode:-1,
			},
			
			//arrows
			{
				inputString: "left",
				keyCode:37,
			},
			{
				inputString: "up",
				keyCode:38,
			},
			{
				inputString: "down",
				keyCode:39,
			},
			{
				inputString: "right",
				keyCode:40,
			},
			//alphabet
			{
				inputString: "q",
				keyCode:81,
			},
			{
				inputString: "w",
				keyCode:87,
			},
			{
				inputString: "e",
				keyCode:69,
			},
			{
				inputString: "r",
				keyCode:82,
			},
			{
				inputString: "t",
				keyCode:84,
			},
			{
				inputString: "y",
				keyCode:89,
			},
			{
				inputString: "u",
				keyCode:85,
			},
			{
				inputString: "i",
				keyCode:73,
			},
			{
				inputString: "o",
				keyCode:79,
			},
			{
				inputString: "p",
				keyCode:80,
			},
			{
				inputString: "a",
				keyCode:65,
			},
			{
				inputString: "s",
				keyCode:83,
			},
			{
				inputString: "d",
				keyCode:68,
			},
			{
				inputString: "f",
				keyCode:70,
			},
			{
				inputString: "g",
				keyCode:71,
			},
			{
				inputString: "h",
				keyCode:72,
			},
			{
				inputString: "j",
				keyCode:74,
			},
			{
				inputString: "k",
				keyCode:75,
			},
			{
				inputString: "l",
				keyCode:76,
			},
			{
				inputString: "z",
				keyCode:90,
			},
			{
				inputString: "x",
				keyCode:88,
			},
			{
				inputString: "c",
				keyCode:67,
			},
			{
				inputString: "v",
				keyCode:86,
			},
			{
				inputString: "b",
				keyCode:66,
			},
			{
				inputString: "n",
				keyCode:72,
			},
			{
				inputString: "m",
				keyCode:77,
			},
			//numbers
			{
				inputString: "1",
				keyCode:49,
			},
			{
				inputString: "2",
				keyCode:50,
			},
			{
				inputString: "3",
				keyCode:51,
			},
			{
				inputString: "4",
				keyCode:52,
			},
			{
				inputString: "5",
				keyCode:53,
			},
			{
				inputString: "6",
				keyCode:54,
			},
			{
				inputString: "7",
				keyCode:55,
			},
			{
				inputString: "8",
				keyCode:56,
			},
			{
				inputString: "9",
				keyCode:57,
			},
			{
				inputString: "0",
				keyCode:48,
			},
			//special characters
			{
				inputString: "`",
				keyCode:192,
			},
			{
				inputString: ",",
				keyCode:188,
			},
			{
				inputString: ".",
				keyCode:190,
			},
			{
				inputString: "/",
				keyCode:191,
			},
			{
				inputString: ";",
				keyCode:186,
			},
			{
				inputString: "'",
				keyCode:222,
			},
			{
				inputString: "[",
				keyCode:219,
			},
			{
				inputString: "]",
				keyCode:221,
			},
			{
				inputString: "=",
				keyCode:187,
			},
			{
				inputString: "-",
				keyCode:189,
			},
			//other
			{
				inputString: "space",
				keyCode:32,
			},
			{
				inputString: "shift",
				keyCode:16,
			},
			{
				inputString: "leftctrl",
				keyCode:91,
			},
			{
				inputString: "rightctrl",
				keyCode:93,
			},
			{
				inputString: "enter",
				keyCode:13,
			},
		],

		mapInput: function(input,action)
		{
			var inputNumber = 0;

			
           	if(isNaN(input))
           	{
	           	for(map in this.keyMaps)
	           	{
	           		if(this.keyMaps[map].inputString == input)
	           		{
	           			this.inputNumber = this.keyMaps[map].keyCode;
	           			break;
	           		}
	           	}
            }
            else
            {
            	this.inputNumber = input;
            }

			
			if(isFunction(action))
			{

				newMap = new SGEplus.inputMap.map();
				newMap.input = this.inputNumber;
				newMap.action = action;
				SGEplus.inputMap.maps.push(newMap);
			}
			else
			{
				SGEplus.trace("mapInput requires a function as the second parameter");
			}
		}
		
	},
	sideScrollerEngine:
	{

		//Variables------------------------------------------//
		name: "My Game",
		gameObjects: new Array(),
		colliders: new Array(),
		sprites: new Array(),
		gravity: 1,
		//Objects--------------------------------------------//
		skybox: 
		{
			texture: new Image(),
			x: 0,
			y: 0,
			width: 100,
			height: 100,


			draw: function()
			{
				//RESEARCH: How to check if the src is null
				
				
			
				try
				{
					SGEplus.drawImage(this.texture,this.x,this.y,this.width,this.height);
				}
				catch(err)
				{
					SGEplus.drawFillRect(this.x,this.y,this.width,this.height, "black");
				}
				
			}
		},
		//Functions------------------------------------------//
		init: function()
		{
			SGEplus.trace("Side Scroller \"" + SGEplus.sideScrollerEngine.name + "\" initailized");
		},
		start: function()
		{
			SGEplus.trace("Side Scroller \"" + SGEplus.sideScrollerEngine.name + "\" started");
			setInterval(SGEplus.game.mainLoop, SGEplus.SECONDS_IN_MILISECONDS/SGEplus.framesPerSecond);
		},
		reset: function()
		{
			SGEplus.trace("Side Scroller \"" + SGEplus.sideScrollerEngine.name + "\" reset");
		},
		mainLoop: function()
		{
			SGEplus.game.update();
			SGEplus.game.draw();
		},
		update: function()
		{

		},
		draw: function()
		{
			//Skybox
			this.skybox.draw();
			//gameobjects
				//layers??
			//wireframes
			for(col in SGEplus.sideScrollerEngine.colliders)
			{
				SGEplus.sideScrollerEngine.colliders[col].draw();
			}
			
			for(spr in SGEplus.topDownEngine.sprites)
			{
				SGEplus.topDownEngine.sprites[spr].draw();
			}
		},
	},
	topDownEngine:
	{
		//Variables------------------------------------------//
		name: "My Game",
		gameObjects: new Array(),
		colliders: new Array(),
		sprites: new Array(),
		//Objects--------------------------------------------//
		skybox: 
		{
			texture: new Image(),
			x: 0,
			y: 0,
			width: 100,
			height: 100,


			draw: function()
			{
				try
				{
					SGEplus.drawImage(this.texture,this.x,this.y,this.width,this.height);
				}
				catch(err)
				{
					SGEplus.drawFillRect(this.x,this.y,this.width,this.height, "black");
				}
			}
		},
		//Functions------------------------------------------//

		init: function()
		{
			SGEplus.trace("Top Down Game \"" + SGEplus.topDownEngine.name + "\" initailized");
		},
		start: function()
		{
			SGEplus.trace("Top Down Game \"" + SGEplus.topDownEngine.name + "\" started");
			setInterval(SGEplus.game.mainLoop, SGEplus.SECONDS_IN_MILISECONDS/SGEplus.framesPerSecond);
		},
		reset: function()
		{
			SGEplus.trace("Top Down Game \"" + SGEplus.topDownEngine.name + "\" reset");
		},
		mainLoop: function()
		{
			SGEplus.game.update();
			SGEplus.game.draw();
		},
		update: function()
		{
			
			//Skybox
			//gameobjects
				//layers??
			//wireframes

		},
		draw: function()
		{
			//Skybox
			this.skybox.draw();
			//gameobjects
				//layers??
			//wireframes
			for(col in SGEplus.topDownEngine.colliders)
			{
				SGEplus.topDownEngine.colliders[col].draw();
			}

			for(spr in SGEplus.topDownEngine.sprites)
			{
				SGEplus.topDownEngine.sprites[spr].draw();
			}

		},
	},
	gameObject: function()
	{
		this.colliders = new Array();
		this.gameObjects = new Array();
		this.sprites = new Array();
		this.x = 0;
		this.y = 0;
		this.tag = "";
		
	},
	texture: function()
	{
		this.image = new Image();
		this.width = 0;
		this.height = 0;
		this.rootX = 0;
		this.rootY = 0;
		this.gameObject = null;

		this.draw = function()
		{

		};

	},
	sprite: function()
	{
		//the sprite neets to handle animation and sprite sheets. 
		//perhaps have two functions
		/*
			1. loadSpritesheet(image,imageWidth,imageHeight)
			2. loadFrame(image, frameNumber)
		*/
		this.image = new Image();
		this.width = 0;
		this.height = 0;
		this.rootX = 0;
		this.rootY = 0;
		this.segmentX = 0;
		this.segmentY = 0;
		this.segmentWidth = 0;
		this.segmentHeight = 0;
		this.gameObject = null;

		this.frameIndex = 0;
		this.tickCoun = 0;
		this.ticksPerFrame = 0;
		this.numberOfFrames = 0;

		this.update = function()
		{
			this.tickCount += 1;
			
	        if (this.tickCount > this.ticksPerFrame) 
	        {
	        
	        	this.tickCount = 0;
	        	
	            // Go to the next frame
	            this.frameIndex += 1; 
	        }
		};

		this.draw = function()
		{
			SGEplus.drawImageSeg(this.image,
				frameIndex * that.width / numberOfFrames,
				this.rootY,
				this.width,
				this.height,
				segmentX,
				segmentY,
				segmentWidth,
				segmentHeight);
		};

		SGEplus.
	},
	circleCollider: function()
	{
		this.rootX = 0;
		this.rootY = 0;
		this.radius = 0;
		this.gameObject = null;
		this.showWireframe = true;
		this.wireframeColor = "green";


		this.draw = function()
		{	
			if(this.showWireframe)
			{
				
				SGEplus.drawStrokeCircle(this.rootX, this.rootY, this.radius, this.wireframeColor);
		
			}

			
		};

		SGEplus.game.colliders.push(this);
	},
	rectCollider: function()
	{
		rootX = 0;
		rootY = 0;
		width = 0;
		height = 0;
		gameObject = null;

		this.draw = function()
		{	
			if(this.showWireframe)
			{
				
			}
		};

	},
	//This is more of a special one. ill figure out how it should be used later
	tileGrid: function()
	{

	},



//Functions------------------------------------------------------------------------------------------------------------//
	init: function(canvas, canvasContext,framesPerSecond)
	{
		SGEplus.canvas = canvas;
		SGEplus.canvasContext = canvasContext;
		SGEplus.framesPerSecond = framesPerSecond;
		SGEplus.initailized = true;
		SGEplus.trace("SGEplus has been initailized!");

	},
	createGame: function(type)
	{
		if(SGEplus.initailized)
		{
			switch(type)
			{
				case "sideScroller":
					SGEplus.game = SGEplus.sideScrollerEngine;
					SGEplus.trace("Game of type: \""+ type + "\" has been created! Use SGEplus.game.name to set the game's name!");
					break;
				case "topDown":
					SGEplus.game = SGEplus.topDownEngine;
					SGEplus.trace("Game of type: \""+ type + "\" has been created! Use SGEplus.game.name to set the game's name!");
					break;
				default:
					SGEplus.trace("Game type is invalid. Try something else.");
					break;
			}

			SGEplus.game.skybox.width = SGEplus.canvas.width;
			SGEplus.game.skybox.height = SGEplus.canvas.height;


		}
		else
		{
			SGEplus.trace("SGEplus has not been initailized! Use SGEplus.init(canvas, canvasContext,framesPerSecond) to initailize!");
		}
	},
	trace: function(_string)
	{
		if(SGEplus.debug){console.log(_string)};
	},
	checkInput: function(event)
	{
		if(event.type != "mousedown")
		{
			for (map in SGEplus.inputMap.maps)
			{
				if(event.keyCode == SGEplus.inputMap.maps[map].input)
				{
					SGEplus.inputMap.maps[map].action();
					break;
				}
			}
		}
		else
		{
			for (map in SGEplus.inputMap.maps)
			{
				if(SGEplus.inputMap.maps[map].input == -1)
				{
					SGEplus.inputMap.maps[map].action();
					break;
				}
			}
		}
		
	},
	drawFillRect: function(leftX, topY, width, height, drawColor)
	{
		SGEplus.canvasContext.fillStyle = drawColor;
		SGEplus.canvasContext.fillRect(leftX,topY,width,height);
	},
	drawStrokeRect: function(leftX, topY, width, height, drawColor)
	{
		SGEplus.canvasContext.strokeStyle = drawColor;
		SGEplus.canvasContext.strokeRect(leftX,topY,width,height);
	},
	drawFillCircle: function(x, y, diameter,drawColor)
	{
		SGEplus.canvasContext.fillStyle = drawColor;
		SGEplus.canvasContext.beginPath();
		
		//draw arc
		SGEplus.canvasContext.arc(x,y,diameter,0,Math.PI*2,true)
		SGEplus.canvasContext.fill();

	},
	drawStrokeCircle: function(x, y, diameter,drawColor)
	{
		SGEplus.canvasContext.strokeStyle = drawColor;
		SGEplus.canvasContext.beginPath();
		
		//draw arc
		SGEplus.canvasContext.arc(x,y,diameter,0,Math.PI*2,true)
		SGEplus.canvasContext.stroke();

	},
	drawText: function(text,textX,textY,drawColor,size)
	{
		SGEplus.canvasContext.fillStyle = drawColor;
		SGEplus.canvasContext.font = size+"px Arial";
		SGEplus.canvasContext.fillText(text,textX,textY);
	},
	drawImage: function(image,imageX,imageY,width,height)
	{
		SGEplus.canvasContext.drawImage(image,imageX,imageY,width,height);
	}

	drawImageSeg: function(image,imageX,imageY,width,height,segX,segY,segWidth,segHeight)
	{
		SGEplus.canvasContext.drawImage(image,imageX,imageY,width,height,segX,segY,segWidth,segHeight);
	}







}