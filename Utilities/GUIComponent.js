/*
	GUIComponent.js
	----------------------------------
	
	GUIComponent is a self made GUI library of simple GUI elements for Javascript
	game and applications. I'm aware that libraries like jquery exist and could do
	a lot of this for me, but I choose to make it myself as a learning exercise and
	also my day job can get pretty boring, so this keeps me sane. Also this way I 
	can work solely in Javascript and maintain an uninterrupted work flow.
	
	HOW TO USE:
	-----------------------------------
	
	- Include this script on your page
	- Create a new instance of the component  
	- Run the GUIComponent.construct() function passing it your canvas and contextual
	- call the GUIComponent.update() and GUIComponent.draw() functions in your applications 
	  update and draw functions (where ever you choose to do that)
    - call a create[GUIElement]() function with the appropriate parameters to create that item
	- Call the GUIComponent.checkInteraction() function where ever you check for
	  mouse interaction
	

*/

var GUIComponent = function()
{
	
	this.canvas;
	this.canvasContext;
	this.elementArray = new Array();
	this.radioButtonArray = new Array();
	this.sliderArray = new Array();
	this.buttonArray = new Array();
	this.checkBoxArray = new Array();
	this.panelArray = new Array();
	this.labelArray = new Array();

	
	this.translateloop;
	
	this.construct = function(canvas, canvasContext)
	{
			this.canvas = canvas;
			this.canvasContext = canvasContext;


	}
	
	this.draw = function()
	{
		
		for(var i = 0; i < this.elementArray.length; i++)
		{
			if(this.elementArray[i].visible)
			{

				this.elementArray[i].draw();
			}
			
		}
		
	};
	this.update = function(mouseX,mouseY,mouseClicked)
	{
		for(var i = 0; i < this.elementArray.length; i++)
		{
		     this.elementArray[i].update()
			
		}
		this.checkInteraction(mouseX,mouseY,mouseClicked);
		
	};
	
	
	//element creation 
	this.createRadioButton = function(x,y,onColour,offColour,labelColour,label,group,size)
	{
		var newRadioButton = new radioButton();
		
		newRadioButton.x = x;
		newRadioButton.y = y;
		newRadioButton.label = label;
		newRadioButton.group = group;
		newRadioButton.size = size;
		newRadioButton.onColour = onColour;
		newRadioButton.offColour = offColour;
		newRadioButton.labelColour = labelColour;
		this.radioButtonArray.push(newRadioButton);
		this.elementArray.push(newRadioButton);
		return newRadioButton;
	};
	this.createRadioButtonRect = function(x,y,onColour,offColour,labelColour,label,group,width,height)
	{
		var newRadioButton = new radioButtonRect();
		
		newRadioButton.x = x;
		newRadioButton.y = y;
		newRadioButton.label = label;
		newRadioButton.group = group;
		newRadioButton.width = width;
		newRadioButton.height = height;
		newRadioButton.onColour = onColour;
		newRadioButton.offColour = offColour;
		newRadioButton.labelColour = labelColour;
		this.radioButtonArray.push(newRadioButton);
		this.elementArray.push(newRadioButton);
		return newRadioButton;
	};
	this.createSlider = function(x,y,width,height,colour,plain,label,maxValue)
	{
		var newSlider = new slider();
		newSlider.x = x;
		newSlider.y = y;
		newSlider.width = width;
		newSlider.height = height;
		newSlider.colour = colour;
		newSlider.plain = plain;
		newSlider.label = label;
		newSlider.maxValue = maxValue;
		newSlider.construct();
		this.sliderArray.push(newSlider);
		this.elementArray.push(newSlider);
		return newSlider;
	};
	this.createCircleButton = function(x,y,size,downColour,upColour,hoverColour)
	{
		console.log("button");
		var newCircleButton = new circleButton();
		newCircleButton.x = x;
		newCircleButton.y = y;
		newCircleButton.size = size;
		newCircleButton.downColour = downColour;
		newCircleButton.upColour = upColour;
		newCircleButton.hoverColour = hoverColour;

		this.buttonArray.push(newCircleButton);
		this.elementArray.push(newCircleButton);

		return newCircleButton;
	};
	this.createRectButton = function(x,y,width,height,downColour,upColour,hoverColour)
	{
		
		var newRectangleButton = new rectangleButton();
		newRectangleButton.x = x;
		newRectangleButton.y = y;
		newRectangleButton.width = width;
		newRectangleButton.height = height;
		newRectangleButton.downColour = downColour;
		newRectangleButton.upColour = upColour;
		newRectangleButton.hoverColour = hoverColour;

		this.buttonArray.push(newRectangleButton);
		this.elementArray.push(newRectangleButton);

		return newRectangleButton;
	};

	this.createImageCircleButton = function(x,y,size,downImage,upImage,hoverImage)
	{
		console.log("button");
		var newCircleButton = new circleButton();
		newCircleButton.x = x;
		newCircleButton.y = y;
		newCircleButton.size = size;
		newCircleButton.downColour = downColour;
		newCircleButton.upColour = upColour;
		newCircleButton.hoverColour = hoverColour;

		this.buttonArray.push(newCircleButton);
		this.elementArray.push(newCircleButton);

		return newCircleButton;
	};
	this.createImageRectButton = function(x,y,width,height,downImage,upImage,hoverImage)
	{
		
		var newRectangleButton = new rectangleButton();
		newRectangleButton.x = x;
		newRectangleButton.y = y;
		newRectangleButton.width = width;
		newRectangleButton.height = height;
		newRectangleButton.downColour = downColour;
		newRectangleButton.upColour = upColour;
		newRectangleButton.hoverColour = hoverColour;

		this.buttonArray.push(newRectangleButton);
		this.elementArray.push(newRectangleButton);

		return newRectangleButton;
	};
	this.createCheckBox = function(x,y,width,height,checkedColour,uncheckedColour)
	{
		var newCheckBox = new checkBox();
		newCheckBox.x = x;
		newCheckBox.y = y;
		newCheckBox.width = width;
		newCheckBox.height = height;
		newCheckBox.checkedColour = checkedColour;
		newCheckBox.uncheckedColour = uncheckedColour;


		this.checkBoxArray.push(newCheckBox);
		this.elementArray.push(newCheckBox);

		return newCheckBox;
		
	};

	this.createPanel = function(x,y,width,height,colour)
	{
		var newPanel = new panel();
		newPanel.x = x;
		newPanel.y = y;
		newPanel.width = width;
		newPanel.height = height;
		newPanel.colour = colour;
		this.panelArray.push(newPanel);
		this.elementArray.push(newPanel);

		return newPanel;

	}

	this.createImagePanel = function(x,y,width,height,imageSrc)
	{
		var newPanel = new panel();
		newPanel.x = x;
		newPanel.y = y;
		newPanel.width = width;
		newPanel.height = height;
		newPanel.img.src = imageSrc;
		this.panelArray.push(newPanel);
		this.elementArray.push(newPanel);

		return newPanel;
		
	}

	this.createLabel = function(x,y,text,size,colour)
	{
		var newLabel = new label();
		newLabel.x = x;
		newLabel.y = y;
		newLabel.text = text;
		newLabel.colour = colour;
		newLabel.size = size;

		this.labelArray.push(newLabel);
		this.elementArray.push(newLabel);

		return newLabel;
		
	}
	

	
	this.checkInteraction = function(mouseX,mouseY,pointerClicked)
	{
		
		//Go through each element type array here and check element type specific properties]
		for(var i = 0; i < this.elementArray.length; i++)
		{
			if(this.elementArray[i].visible)
			{
				if(this.elementArray[i].enabled)
				{
					if(this.elementArray[i].type == "radio")
					{

					  this.elementArray[i].checkInteraction(mouseX,mouseY,pointerClicked,this.radioButtonArray);
					}
					else
					{
						this.elementArray[i].checkInteraction(mouseX,mouseY,pointerClicked);
					}
				}
			}
			
		}
		
	};
	
}


var radioButton = function()
{
	//location
	this.x = 0;
	this.y = 0;
	
	//if the item is in a panel
	this.paneled = false;
	this.panel;
	
	this.label = "";
	this.group = "";
	this.size = 15;
	
	this.onColour = new colourObj();
	this.offColour = new colourObj();
	this.labelColour = new colourObj();
	
	this.onImage = new Image();
	this.offImage = new Image();
	
	this.onImage.src = "";
	this.offImage.src = "";
	this.selected = false;

	this.type ="radio";
	
	this.drawSprites = false;

	this.visible = true;
	this.enabled = true;


	this.draw = function()
	{
			if(this.selected == false)
			{
				if(this.drawSprites == false)
				{
					drawCircle(this.x,this.y,this.size,this.offColour.getString());
				}
				else
				{
					drawImage(offImage, this.x-this.size, this.y-this.size, this.size*2,this.size*2);
				}
				
			}
			else
			{
				if(this.drawSprites == false)
				{
					drawCircle(this.x,this.y,this.size,this.onColour.getString());
				}
				else
				{
					drawImage(onImage,  this.x-this.size, this.y-this.size, this.size*2,this.size*2);
					
				}
			}
			
			drawTinyText(this.label,this.x - this.size/2,this.y + this.size + 10,this.labelColour.getString());

		
	};

	this.update = function()
	{

	}
	
	this.checkInteraction = function(mouseX,mouseY,pointerDown,radioButtonArray)
	{
		var dx; 
		var dy; 
		var dis;
		
		dx = this.x - mouseX;
		dy = this.y - mouseY;


		dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
		
		if(dis < this.size  && dis > -this.size)
		{
			
				if(pointerDown)
				{
					for(var i = 0; i < radioButtonArray.length;i++)
					{
						if(radioButtonArray[i].group == this.group)
						{

							radioButtonArray[i].selected = false;
						}
					}
					this.selected = true;
				}
				
			
		}
		
	
	}
}

	var radioButtonRect = function()
	{
		//location
		this.x = 0;
		this.y = 0;
		
		//if the item is in a panel
		this.paneled = false;
		this.panel;
		
		this.label = "";
		this.labelX = 0;
		this.labelY = 0;
		this.group = "";
		this.width = 15;
		this.height = 15;
		
		this.onColour = new colourObj();
		this.offColour = new colourObj();
		this.labelColour = new colourObj();
		
		this.onImage = new Image();
		this.offImage = new Image();
		
		this.onImage.src = "";
		this.offImage.src = "";
		this.selected = false;

		this.type ="radio";
		
		this.drawSprites = false;

		this.visible = true;
		this.enabled = true;

		this.draw = function()
		{
				if(this.selected == false)
				{
					if(this.drawSprites == false)
					{
						drawRect(this.x,this.y,this.width,this.height,this.offColour.getString());
					}
					else
					{
						drawImage(offImage, this.x-this.size, this.y-this.size, this.size*2,this.size*2);
					}
					
				}
				else
				{
					if(this.drawSprites == false)
					{
						drawRect(this.x,this.y,this.width,this.height,this.onColour.getString());
					}
					else
					{
						drawImage(onImage,  this.x-this.size, this.y-this.size, this.size*2,this.size*2);
						
					}
				}
				
				drawTinyText(this.label,this.x +this.labelX,this.y + this.labelY,this.labelColour.getString());

			
		};


		this.update = function()
		{

		}
		
		this.checkInteraction = function(mouseX,mouseY,pointerDown,radioButtonArray)
		{
			var dx; 
			var dy; 
			var dis;
			
			dx = this.x + this.width/2 - mouseX;
			dy = this.y + this.height/2 - mouseY;


			dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
			
			if((dx < this.width/2 && dx > -this.width/2) && (dy < this.height/2 && dy > -this.height/2))
			{
				
					if(pointerDown)
					{
						for(var i = 0; i < radioButtonArray.length;i++)
						{
							if(radioButtonArray[i].group == this.group)
							{

								radioButtonArray[i].selected = false;
							}
						}
						this.selected = true;
					}
					
				
			}
			
		
		}
	};
	


var slider = function()
{
	this.x = 0;
	this.y = 0;
	
	//if the item is in a panel
	this.paneled = false;
	this.adjX = 0;
	this.adjY = 0;
	
	this.width = 0;
	this.height = 0;
	
	this.colour = new colourObj();
	
	this.plain ="vert";
	this.label = "";
	this.value = 0;
	this.handleimg = new Image();
	this.handleimg.src = "handle.png";
	this.maxValue = 0;
	
	this.grabbed = false;
	
	//handle dimensions
	this.handleX;
	this.handleY; 
	this.handleWidth; 
	this.handleHeight; 

	this.type ="slider";

	this.visible = true;
		this.enabled = true;
	
	this.construct = function()
	{
		//handle dimensions
		
		if(this.plain == "vert")
		{
			this.handleSize = this.width;
			
			this.handleX = this.x  + this.width/2;
			this.handleY = this.y + 1;
			
		
		}
		else
		{
			this.handleSize = this.height;
			
			
			this.handleX = this.x  + 1;
			this.handleY = this.y + this.height/2;
			
		}
	
	}
	
	this.draw = function()
	{
		
		
		drawRect(this.x,this.y,this.width,this.height,this.colour.getString());
		//drawCircle(this.handleX,this.handleY,this.handleSize,"white");
		drawImage(this.handleimg,this.handleX - this.handleSize,this.handleY- this.handleSize,this.handleSize*2,this.handleSize*2)
		drawTinyText(this.label,this.x + (this.width/3) - 12,this.y + this.height + 20,"white");
		
	
	};
	this.update = function()
	{



		if(this.plain == "vert")
		{
			//translate height to value
			
			//get a percentage value
			this.value = ((this.handleY - this.y) - this.height)/this.height * -1;
			
			
		}
		else
		{
			//get a percentage value
			this.value = ((this.handleX - this.x) - this.width)/this.width * -1;
		}
		//transform that percentage into the desired value
		this.value =  Math.round(this.maxValue * this.value);
		
		

			
	
	}
	
	//make grab listener more modular 
	this.checkInteraction = function(mouseX,mouseY,pointerDown)
	{
		
		
		
		if(pointerDown)
		{	
			
			var dx = this.handleX - mouseX;
			var dy = this.handleY- mouseY;
			var dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
			
			if(!this.grabbed)
			{	
				
				if(dis < this.handleSize  && dis > -this.handleSize)
				{
					this.grabbed = true;
					console.log(this.grabbed);
				}
				else
				{
					this.grabbed = false;
				}
			}
			else
			{
				//console.log(dis);
				this.slide(mouseX,mouseY);
			}
		}
		else
		{
			
			this.grabbed = false;
		}
	
	}
	
	
	this.slide = function(mouseX,mouseY)
	{
			if(this.plain == "vert")
			{
				
				if(this.handleY >= this.y && this.handleY <= (this.y + this.height))
				{
					
					
					this.handleY = mouseY;
				}
				
				
				if(this.handleY < this.y)
				{
					
					this.handleY = this.y + 1;
					
				}
				else if (this.handleY > (this.y + this.height))
				{
					
					this.handleY = this.y + this.height - 1;
				}
				
				
				
			}
			else
			{
				if(this.handleX >= this.x && this.handleX <= (this.x + this.width))
				{
					
					//console.log("slide");
					this.handleX = mouseX;
				}
				
				if(this.handleX < this.x)
				{
					this.handleX = this.x + 1;
					
				}
				else if (this.handleX > (this.x + this.width))
				{
					this.handleX = this.x + this.width - 1;
				}
				
			}
		
	}
	
}

var circleButton = function()
{
	
	this.x = 0;
	this.y = 0;
	this.paneled = false;
	this.size = 0;
	this.pressed = false;
	this.hovered = false;
	this.actionCompleted = false;
	this.downColour = new colourObj();
	this.upColour = new colourObj();
	this.hoverColour = new colourObj();
	this.action;


	this.imageButton = false;

	this.downColour = new colourObj();
	this.upColour = new colourObj();
	this.hoverColour = new colourObj();

	this.downImage = new Image();
	this.upImage = new Image();
	this.hoverImage = new Image();

	this.type ="button";

	this.visible = true;
	this.enabled = true;
	
	this.draw = function()
	{

		if(this.pressed)
		{
			drawCircle(this.x,this.y,this.size,this.downColour.getString());
			
		}
		else if (this.hovered)
		{
			drawCircle(this.x,this.y,this.size,this.hoverColour.getString());
			
		}
		else
		{
			drawCircle(this.x,this.y,this.size,this.upColour.getString());
			
		}
		
	};
	this.update = function()
	{
		if(!this.pressed)
		{


		}
		
	};
	this.checkInteraction = function(mouseX,mouseY,mouseClicked)
	{
			
		var dx; 
		var dy; 
		var dis;
		
		dx = this.x - mouseX;
		dy = this.y - mouseY;
			
		
		
		

		dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
		
		if(dis < this.size && dis > -this.size)
		{
			if(mouseClicked)
			{
				this.pressed = true;

				if(!this.actionCompleted)
				{
					if(this.action != null)
					{

						this.action();
					}
					this.actionCompleted = true;
				}
			}
			else
			{
				this.pressed = false;
				this.hovered = true;
				this.actionCompleted = false;
			}
			
		}
		else
		{

			this.hovered = false;
			this.pressed = false;
		}
	
	};
};
var rectangleButton = function()
{
	
	this.x = 0;
	this.y = 0;
	this.paneled = false;
	this.pressed = false;
	this.hovered = false;
	this.actionCompleted = false;
	this.width = 0;
	this.height = 0;

	this.imageButton = false;

	this.downColour = new colourObj();
	this.upColour = new colourObj();
	this.hoverColour = new colourObj();

	this.downImage = new Image();
	this.upImage = new Image();
	this.hoverImage = new Image();


	this.type ="button";
	this.action;
	this.text = "";

	this.visible = true;
	this.enabled = true;
	
	this.draw = function()
	{
		
		if(this.pressed)
		{
			drawRect(this.x,this.y,this.width,this.height,this.downColour.getString());
		}
		else if (this.hovered)
		{
			
			drawRect(this.x,this.y,this.width,this.height,this.hoverColour.getString());
		}
		else
		{
			drawRect(this.x,this.y,this.width,this.height,this.upColour.getString());
			
		}

		drawTinyText(this.text,this.x + this.width/5, this.y + this.height/2,'black');
		
	};
	this.update = function()
	{
		
		
	};
	this.checkInteraction = function()
	{
		var dx; 
		var dy; 
		var dis;
		
		dx = this.x + this.width/2 - mouseX;
		dy = this.y + this.height/2 - mouseY;
			
		
		

		dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
		
		if((dx < this.width/2 && dx > -this.width/2) && (dy < this.height/2 && dy > -this.height/2))
		{
			if(mouseClicked)
			{
				this.pressed = true;
				if(!this.actionCompleted)
				{
					if(this.action != null)
					{

						this.action();
					}
					
					this.actionCompleted = true;
				}
			}
			else
			{
				this.pressed = false;
				this.hovered = true;
				this.actionCompleted = false;
			}
			
		}
		else
		{
			this.hovered = false;
			this.pressed = false;
		}
		
	};
};

var checkBox = function()
{
	this.x = 0;
	this.y = 0;
	this.label ="";
	this.paneled = false;
	this.checked = false;
	this.clicked = false;
	this.width = 0;
	this.height = 0;
	this.checkedColour = new colourObj();
	this.uncheckedColour = new colourObj();
	this.visible = true;
	this.enabled = true;

	this.type ="checkbox";
	
	this.draw = function()
	{
		
		if(this.checked)
		{
			drawRect(this.x,this.y,this.width,this.height,this.checkedColour.getString());

		}
		else
		{
			drawRect(this.x,this.y,this.width,this.height,this.uncheckedColour.getString());
		}
		drawTinyText(this.label,this.x,this.y + this.height + 10,'white');
		
	};
	this.update = function()
	{
		
		
	};
	this.checkInteraction = function(mouseX,mouseY,mouseClicked)
	{

		var dx; 
		var dy; 
		var dis;
		
			dx = this.x + this.width/2 - mouseX;
		dy = this.y + this.height/2 - mouseY;
			
		
		

		dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

		if((dx < this.width/2 && dx > -this.width/2) && (dy < this.height/2 && dy > -this.height/2))
		{
			if(mouseClicked)
			{
				if(!this.clicked)
				{
					if(this.checked)
					{
						this.checked = false;

					}
					else
					{
						this.checked = true;
					}

					this.clicked = true;
				}
			}
			else
			{
				this.clicked = false;
			}
			
		}
		
	};
};

var panel = function()
{

	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.colour = new colourObj();
	this.img = new Image();
	this.img.src = "";
	this.visible = true;
	this.enabled = true;
	this.elementArray = new Array();

	this.draw = function()
	{
		
		if(this.img.src != "")
		{
			drawRect(this.x,this.y,this.width,this.height,this.colour.getString());

		}
		else
		{
			drawImage(this.img,this.x,this.y,this.width,this.height);
		}
		
		
		
	};
	this.update = function()
	{
		
		
	};
	this.checkInteraction = function(mouseX,mouseY,mouseClicked)
	{

		
	};

	this.hide = function()
	{
		this.visible = false;
		for(var i = 0; i < this.elementArray.length; i++)
		{
			this.elementArray[i].visible = false;
		}
	}

	this.show = function()
	{
		this.visible = true;
		for(var i = 0; i < this.elementArray.length; i++)
		{
			this.elementArray[i].visible = true;
		}
	}
	

}

var label = function()
{

	this.x = 0;
	this.y = 0;
	this.colour = new colourObj();
	this.visible = true;
	this.size = "tiny"
	this.text = "";

	this.draw = function()
	{
		
		switch(this.size)
		{
			case "tiny":
				drawTinyText(this.text,this.x,this.y,this.colour.getString());
				break;
			case "small":
				drawSmallText(this.text,this.x,this.y,this.colour.getString());
			case "medium":
				drawMidText(this.text,this.x,this.y,this.colour.getString());
				break;
			case "large":
				drawLargeText(this.text,this.x,this.y,this.colour.getString());
				break;
		}
		

	};
	this.update = function()
	{
		
		
	};
	this.checkInteraction = function(mouseX,mouseY,mouseClicked)
	{

		
	};
	

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



function drawRect(leftX, topY, width, height, drawColor)
{
	canvasContext.strokeStyle = drawColor;
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY,width,height);
}
function drawCircle(leftX, topY, diameter,drawColor)
{
	canvasContext.strokeStyle = drawColor;
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	
	//draw arc
	canvasContext.arc(leftX,topY,diameter,0,Math.PI*2,true)
	canvasContext.fill();

}
function drawLargeText(text,textX,textY,drawColor)
{
	canvasContext.strokeStyle = drawColor;
	canvasContext.fillStyle = drawColor;
	canvasContext.font = "50px Arial";
	canvasContext.fillText(text,textX,textY);
}
function drawMidText(text,textX,textY,drawColor)
{
	canvasContext.fillstyle = drawColor;
	canvasContext.fillStyle = drawColor;
	canvasContext.font = "45px Arial";
	canvasContext.fillText(text,textX,textY);
}
function drawSmallText(text,textX,textY,drawColor)
{
	canvasContext.strokeStyle = drawColor;
	canvasContext.fillStyle = drawColor;
	canvasContext.font = "25px Arial";
	canvasContext.fillText(text,textX,textY);
}
function drawTinyText(text,textX,textY,drawColor)
{
	canvasContext.strokeStyle = drawColor;
	canvasContext.fillStyle = drawColor;
	canvasContext.font = "12px Arial";
	canvasContext.fillText(text,textX,textY);
}
function drawImage(img,imageX,imageY,width,height)
{
	canvasContext.drawImage(img,imageX,imageY,width,height);
}