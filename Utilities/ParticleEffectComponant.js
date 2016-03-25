/*
	ParticleEffectComponant.js
	Version: 1.01a
	----------------------------------
	
	ParticleEffectComponant.js is a particle effect engine for general use in games and applications.
	It provides a number of different types of particle effects with a number of customizable variables 
	to create a particle effect for most particle effect needs. Will hopefully be expanded down the road to 
	include more effects and more customizability. The particle effect component also handles all of the clean up
	for the effects, destroying dead particles and removing effects that reach the end of their duration.
    This ensures that the user will not have to remove particles themselves.
	
	HOW TO USE:
	-----------------------------------
	
	- Include this script on your page
	- Create a new instance of the component  
	- Run the ParticleEffectComponant.construct() function passing it your canvas and contextual
	- call the ParticleEffectComponant.updateEverything() and GUIComponent.drawEverything() functions in your applications 
	  update and draw functions (where ever you choose to do that)
    - call a createParticleEffect() function with the appropriate parameters to create that item
	

*/

var particleEffectComponant = function()
{

	//Get canvas and 2d context
	this.canvas;
	this.canvasContext;

	this.FRAMES_PER_SECOND;

	
	this.particleEffects = new Array();
	
	
	this.clear = function()
	{
		
		for(var i = 0; i < this.particleEffects.length; i++)
		{
			if(this.particleEffects[i].particleArray != undefined)
			{
				for(var x = 0; x < this.particleEffects[i].particleArray.length; x++)
				{
					
						
					this.particleEffects[i].particleArray[x].killFlag = true;
					
					
				}
			}
			this.particleEffects[i].killFlag = true;
			
		}
		
		
	};

	//turn this into a constructor
	this.createParticleEffect = function(colorRed,colorGreen,colorBlue, 
	duration,particleSize,
	maxNumParticles,startX,startY,particleLifespan,spawnRate,type,width)
	{
		var newParticleEffect = new particleEffect();
		newParticleEffect.color.red = colorRed;
		newParticleEffect.color.blue = colorBlue;
		newParticleEffect.color.green = colorGreen;
		newParticleEffect.duration = this.FRAMES_PER_SECOND*duration;
		newParticleEffect.durationStartValue = newParticleEffect.duration;
		newParticleEffect.sizeOfParticles = particleSize;
		newParticleEffect.maxParticles = maxNumParticles;
		newParticleEffect.startX = startX;
		newParticleEffect.startY = startY;
		newParticleEffect.type = type;
		newParticleEffect.lifeSpanOfParticles = particleLifespan;
		newParticleEffect.spawnRate = spawnRate;
		newParticleEffect.width = width;
		
		this.particleEffects.push(newParticleEffect);
		
	}

	this.spark = function(red,green,blue,x,y)
	{
		this.createParticleEffect(red,green,blue,2,1,10,x,y,100,0,"burst",1);
	}
	this.vapour = function(red,green,blue,x,y)
	{
		//uses multiple emitters to create a rising gas effect
	}
	this.explosion = function(red,green,blue,x,y)
	{
		//mixure of small, medium, and large particles to create an 'explosion'
	}
	this.confetti = function(colorOne,colorTwo,colorThree,x,y)
	{
		/*
			you'll have to make some color object for this
			throws coloured particles up in spout formation for one cycle
		*/

	}
	this.fountain = function(red,green,blue,x,y)
	{
		//continuous fountain
		//I changed the code a bit so if the duration is -999 then it will never die
	}
	this.construct = function(gameCanvas,gameCanvasContext,framesPerSecond)
	{
		
		this.canvas = gameCanvas;
		this.canvasContext = gameCanvasContext;

		this.FRAMES_PER_SECOND = framesPerSecond;
		
	}
	this.drawEverything = function()
	{
		this.drawParticleEffects();
		
	}
	this.drawParticleEffects = function()
	{
		for(var i = 0; i < this.particleEffects.length; i++)
		{
			this.particleEffects[i].draw();
		}
	}
	this.updateEverything = function()
	{
		for(var i = 0; i < this.particleEffects.length; i++)
		{
			this.particleEffects[i].update();
		
		}
	}


	
	
};
function drawCircle(leftX, topY, diameter,drawColor)
{
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	
	//draw arc
	canvasContext.arc(leftX,topY,diameter,0,Math.PI*2,true)
	canvasContext.fill();

}
var colorObj = function()
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
var particle = function()
{
	this.x = 0;
	this.y = 0; 
	this.startPoint = {x:0,y:0};
	this.size = 0;
	this.velocity = {x:1,y:0}
	this.lifeSpan = 0;
	this.lifeSpanStartValue = 0;
	this.killFlag = false;
	this.color = new colorObj();
	this.type = "trail";
	this.width = 0.1;
	
	this.draw = function()
	{
		//draw this particle
		drawCircle(this.x,this.y,this.size,this.color.getString());
	 
	
	};
	this.update = function()
	{
		this.lifeSpan--;
		this.fade();
		if(this.lifeSpan <= 0)
		{
			this.killFlag = true;
		}
		
		switch(this.type)
		{
			case "burst":
			this.burst();
			break;
			case "spark":
			this.spark();
			break;
			case "trail":
			this.trail();
			break;
			case "spout":
			this.spout();
			break;
		
		}
		
	};
	
	this.fade = function()
	{
		//calculate the amount the particle should fade based on the duration
		
		var fade = this.lifeSpan/this.lifeSpanStartValue;
		this.color.alpha = fade;
	
	};
	
	this.burst = function()
	{
		//particles fly outward in a circle, fading the further they go out.
		// PROGRESS: Working as intended
		/*
					O
				O       O
			   O	.    O
				O       O
					O
		*/
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		
	};
	this.spark = function()
	{
		//Much like burst, but with a parabolic trajectory 
		
	};
	this.trail = function()
	{
		
		//particles should flare out on the x axis and rise on the y, centring again as they rise
		//they accelerate upwards and fade out
		//PROGRESS: Works almost as intended
		/*
					 O
					 O
					O O
				   O O O
					O.O
		*/
		
		this.x += this.velocity.x;
		this.y -= this.velocity.y;
		
		if(this.x > this.startPoint.x + 0.1)
		{
			//reduce x velocity
			this.velocity.x -= this.width * 0.01;
		}
		else if(this.x < this.startPoint.x - 0.1)
		{
			//increase x velocity
			this.velocity.x += this.width * 0.01;
		}
		
		
	};
	
	this.spout = function()
	{
		//the particle spout upwards, fan out, then fall. Probably a steep quadratic for this
		//PROGRESS: Works for the most part 
		/*
				OOO 
			  OOOOOOO
			 O O O O O
				 O
				 O
				 .
		*/
		
		/*
		this.x += this.velocity.x;
		this.y = Math.pow(this.x - this.startPoint.x,2) * this.velocity.y + this.startPoint.y -(this.x - this.startPoint.x)/0.3
		*/
		
		this.velocity.y -= 0.04;
		
		
		if(this.velocity.x > 0)
		{
			this.velocity.x -= 0.6;
			
		}
		else
		{
			this.velocity.x += 0.6;
			
		}
		
		
		this.x += this.velocity.x;
		this.y -= this.velocity.y;
		
		
	
	};

};

var particleEffect = function()
{
	/*
		HOW THIS SHOULD WORK:
		---------------------
		- particles 'spawn' at the start point
		- they follow an algorithmic path based on the type of effect
		- they fade based on their lifespan
		- particles continue to spawn as the duration still runs. 
		- particle effect is flagged for removal once all of the particles have died
	*/
	
	this.color = new colorObj();
	this.duration = 0;
	this.durationStartValue = 0;
	this.counter = 0;
	this.sizeOfParticles = 0;
	this.maxParticles = 10;
	this.lifeSpanOfParticles = 0;
	//the starting point for the effect
	this.startX = 0;
	this.startY = 0;
	//flag tis particle effect for disposal 
	this.killFlag = false;
	this.particleArray = new Array();
	//the spacing of particles
	this.spawnRate = 0;
	this.spawnTimer = 0;
	
	var width = 0;

	
	//type
	this.type = "trail";
	
	
	

	this.createParticle = function()
	{
		
		//check to see if there are particles missing
		if(this.particleArray.length < this.maxParticles && this.duration > 0 && this.spawnTimer > this.spawnRate)
		{
			
			//spawn the missing particles
			if(this.type == "burst")
			{
				for(var i =0; i < (this.maxParticles - this.particleArray.length);i++)
				{
					var newParticle = new particle();
					newParticle.x = this.startX;
					newParticle.y = this.startY;
					newParticle.startPoint.x = this.startX;
					newParticle.startPoint.y = this.startY;
					newParticle.size = this.sizeOfParticles;
					newParticle.lifeSpan = this.lifeSpanOfParticles;
					newParticle.lifeSpanStartValue = newParticle.lifeSpan;
					newParticle.color.red = this.color.red;
					newParticle.color.green = this.color.green;
					newParticle.color.blue = this.color.blue;
					newParticle.color.alpha = this.color.alpha;
					newParticle.type = this.type;
					
					
					this.particleArray.push(newParticle);
					
					
					//random x and y velocity. hopefully it will look like
					// an explosion
					newParticle.velocity.y = 1;
					var directionFactor = Math.round(Math.random()*1);
					if(directionFactor == 0)
					{
						newParticle.velocity.x = Math.random()* -1.5;
					}
					else
					{
						newParticle.velocity.x = Math.random()* 1.5;
					}
					directionFactor = Math.round(Math.random()*1);
					if(directionFactor == 0)
					{
						newParticle.velocity.y = Math.random()* -1.5;
					}
					else
					{
						newParticle.velocity.y = Math.random()* 1.5;
					}
						
					
					
				}
				
			}
			else
			{				
				var newParticle = new particle();
				newParticle.x = this.startX;
				newParticle.y = this.startY;
				newParticle.startPoint.x = this.startX;
				newParticle.startPoint.y = this.startY;
				newParticle.size = this.sizeOfParticles;
				newParticle.lifeSpan = this.lifeSpanOfParticles;
				newParticle.lifeSpanStartValue = newParticle.lifeSpan;
				newParticle.color.red = this.color.red;
				newParticle.color.green = this.color.green;
				newParticle.color.blue = this.color.blue;
				newParticle.color.alpha = this.color.alpha;
				newParticle.type = this.type;
				newParticle.width = this.width;
				this.particleArray.push(newParticle);
				if(this.type == "trail")
				{
					newParticle.velocity.y = 1;
					var directionFactor = Math.round(Math.random()*1);
					if(directionFactor == 0)
					{
						newParticle.velocity.x = Math.random()* -1.5;
					}
					else
					{
						newParticle.velocity.x = Math.random()* 1.5;
					}
				}
				else if(this.type == "spark")
				{
					
				}
				else if(this.type == "spout")
				{
					var directionFactor = Math.round(Math.random()*1);
					
						/*
						newParticle.velocity.x = Math.random()* 1;
						newParticle.velocity.y = (Math.random()* 0.08) + 0.01;
						*/
					if(directionFactor == 1)
					{
						
						newParticle.velocity.x = (Math.random()* -0.8)-0.01
					}
					else
					{
						newParticle.velocity.x = (Math.random()* 0.8)+0.01
					}
					newParticle.velocity.y = (Math.random()* 1.8)+1
					
				}
			}
				
				
				
				
				
						this.spawnTimer = 0;
		
		}
		
	}
	this.draw = function()
	{
		//draw particle objects
		if(!this.killFlag)
		{
			for(var i = 0; i < this.particleArray.length; i++)
			{
				this.particleArray[i].draw();
			}
		}
		
	
	};
	this.update = function()
	{
		//if the effect is not dead
		if(!this.killFlag)
		{
			/*
				- The effect should run until the duration runs out
				- it should spawn new particles every time one dies
				- once the duration has run out stop spawning particles
				- once all of the particles have died, flag effect for removal
			
			
			*/
			

			this.duration--;
			this.counter++;
			this.spawnTimer++;
			
			//clean up dead particles
			for(var i = 0; i < this.particleArray.length; i++)
			{
			
				if(this.particleArray[i].killFlag)
				{
					this.particleArray.splice(i,1);
				}
				else
				{
					this.particleArray[i].update();
				}
			
			}
			if(this.duration <= 0 && this.duration > -999)
			{
				//start waiting for particles to die
				if(this.particleArray.length == 0)
				{
					this.killFlag = true;
				}
			}
			else
			{
				this.createParticle();
			
			}
			
		}
	
	};
	
	
	
}
