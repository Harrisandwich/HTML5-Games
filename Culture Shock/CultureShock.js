var canvas = document.getElementById('myCanvas');
var canvasContext = canvas.getContext('2d');
const FRAMES_PER_SECOND = 30;
const SECOND_IN_MILISECONDS = 1000;
const Y_THRESHOLD = canvas.height;
const X_THRESHOLD = canvas.width;


const RATE_MOD = 1;
const TICK_RATE = 1;
const NODE_GROWTH_RATE = 0.5 * RATE_MOD;




//Important NOTE:
//Not sure whether to split the nodes into 3 catagories and shuffle the turns 
//or perhaps come up with a more sophisticated method of deciding which nodes act first 

//Ideas: 
/*

    -split the nodes into "districts" and shuffle the districts
        - Might be too cpu heavy
    -sort the nodes based on size and prioritize larger nodes 
        - not sure how to sort this way
        - if I sort every node this might get too intense for the cpu
        homes.sort(function(a, b) {
            return parseFloat(a.price) - parseFloat(b.price);
        });
    -


*/


var colourObj = function()
{
    this.red   = 0;
    this.blue  = 0;
    this.green = 0;
    this.alpha = 1.0;
    
    this.getString = function()
    {
        return "rgba("+this.red+","+this.green+","+this.blue+","+this.alpha+")";
    
    }

};

//Node class
var node = function(){
//Variables

    this.id              = 0;
    this.colour          = new colourObj(); //colour (rbg)  
    this.x               = 0; 
    this.y               = 0;
    this.adjX            = getAdjustedPostion(this.x,this.y).x;
    this.adjY            = getAdjustedPostion(this.x,this.y).y;
    this.size            = 5.0;    
    this.adjSize         = 5.0  * sizeScale;//size (float)       
    this.redOutRate      = 0;             //redOutRate (float)
    this.blueOutRate     = 0;             //blueOutRate (float)
    this.greenOutRate    = 0;             //greenOutRate (float)
    //growthRate (float)
    //this will either be variable or a global constant
    //this.growthRate = 0.0;
    this.growthRate      = NODE_GROWTH_RATE;
    //connectedNodes (Array)
    this.connectedNodes  = new Array();
    this.children = 0;
    this.closeCount = 0;


//Functions 
    //createNewNode
    this.createNewNode = function()
    {
        //This function is a dice roll. Based on the size of the node and the number of connections it all ready has
        //it will create new nodes
        // the distance of the node will be a random number between a max and min and will be a random direction
        // ill have to figure out how to keep new nodes away from existing nodes 
        var roll = Math.random() * (this.size - 1);

        if(roll > (this.size * 0.92))
        {
           
            var point; 
            var badPlacement = false;
            //check con
            var badPlacementCount = 0;
            do
            {
                console.log("Placement Check: Start");
                badPlacementCount ++;
                badPlacement = false;
                point = getRandomPoint(this.size/2 + 150);
                point.size = this.size/2;
                point.x += this.x;
                point.y += this.y;
                
                if(point.x < 0 || point.y < 0 || point.x > canvas.width || point.y > canvas.height)
                {
                    badPlacement = true;
                }


                    

                if(!badPlacement)
                {
                    console.log("Placement Check: Point Within Area");
                    for(n in nodes)
                    {
                        console.log("Placement Check: Checking distance from other nodes");
                        if(getDistance(point,nodes[n].nodeObj) <= 25)
                        {
                            badPlacement = true;
                            break;
                            //this.closeCount++;

                        }
                        else
                        {
                            badPlacement = false;
                        }
                        
                        
                    }
                    if(!badPlacement)
                    {
                        break;
                    }
                }
                if(badPlacementCount > 10)
                {
                    this.closeCount++;
                    break;
                }

            }
            while(badPlacement);

        
           
            if(!badPlacement)
            {
                 var newNode = new node();
                newNode.x = point.x; 
                newNode.y = point.y; 

                if(mode =="normal")
                {
                    newNode.colour.blue = this.colour.blue;
                    newNode.colour.red = this.colour.red;
                    newNode.colour.green = this.colour.green;
                }
                else if (mode =="domination")
                {
                    newNode.colour.blue = 255;
                    newNode.colour.red = 255;
                    newNode.colour.green = 255;
                }
                
                newNode.size = this.size/2;
                //newNode.adjSize = newNode.size;
                do
                {
                    newNode.id = Math.ceil(Math.random() * (10000 - 1) + 1);
                }
                while(doesIdExist(newNode.id))
                this.connectedNodes.push({ id: newNode.id, nodeObj: newNode});
                nodes.push({ id: newNode.id, nodeObj: newNode});
                this.children++;
            }
            
        }
    }
    //checkProximity
    this.checkProximity = function()
    {
        //Checks for local nodes. If there is a node close by, it will attach itself to it and trigger that node's addConnection function
        for(n in nodes)
        {
            if(nodes[n].id != this.id)
            {//NOTE: Find way to check if a node is already connected 
                        
                if(this.connectedNodes.length > 0)
                {
                    var checkBool = false;
                    for(cn in this.connectedNodes)
                    {
                        if(nodes[n].id == this.connectedNodes[cn].id)
                        {
                            checkBool = true;
                            break;
                        }
                    }
    
                    if(!checkBool)
                    {
                        //connect with nodes
                        if(getDistance(nodes[n].nodeObj,this) <= 100)
                        {
                            this.connectedNodes.push(nodes[n]);
                        }
                    }
    
                }
                else
                {
                    
    
                    //connect with nodes
                    if(getDistance(nodes[n].nodeObj,this) <= 100)
                    {
                        this.connectedNodes.push(nodes[n]);
                    }
                }
            }
                
            
        }

    }
    //addConnection (node)
    this.addConnection = function()
    {
        //This function will add a node to this node's connection list. It is triggered by this class or an outside node
    }
    //outputInfluence
    this.outputInfluence = function()
    {
        //on every timer tick this node sends out its influence to every node in its list. 
        //NOTE: Due to the sequential nature of javascript/code in general i should find a way to shuffle turns for the nodes
        //see here for the shuffling algorithm http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    }
    //update 
    this.update = function()
    {
        //generic update method

        //grow
        
        var checkBool = false
        //NOTE: Im doing this check alot, move to function
        
        if(this.connectedNodes.length > 0)
        {
            for(cn in this.connectedNodes)
            {
                if(getDistance(this.connectedNodes[cn].nodeObj,this) <= 25)
                {
                    checkBool = true;
                    break;
                }
                
            }
        }
        
        if(!checkBool)
        {
            this.size += this.growthRate;
            this.adjSize = this.size * sizeScale;
        }
        
        

        
        
        
        //check for adjacent unconnected nodes 
        this.checkProximity();
        //roll for new node creation
        if(this.children < 3 || this.closeCount > 10 || nodes.length < 100)
        {
            this.createNewNode();
        }



        //send influence
       /*
            A couple ways this could work:

            - the node outputs a portion of each colour based on size. Each output reduces other colours based on
            the amount. for example: blueout = 10. Blue goes up 10, green and red go down 10.
       */
        if(mode == "domination")
        {
            this.redOutRate = Math.ceil(this.colour.red * this.size/100) * 2;
            this.blueOutRate = Math.ceil(this.colour.blue * this.size/100) * 2;
            this.greenOutRate = Math.ceil(this.colour.green * this.size/100)  * 2;
        }
        else if (mode == "normal")
        {
            this.redOutRate = Math.ceil(this.colour.red * this.size/100);
            this.blueOutRate = Math.ceil(this.colour.blue * this.size/100);
            this.greenOutRate = Math.ceil(this.colour.green * this.size/100);
        }
        
       


       for(cn in this.connectedNodes)
       {
            if(mode =="normal")
            {
                if(this.connectedNodes[cn].nodeObj.colour.blue < 255)
                {
                    if((this.connectedNodes[cn].nodeObj.colour.blue + this.blueOutRate) > 255)
                    {
                        this.connectedNodes[cn].nodeObj.colour.blue = 255;

                    }
                    else
                    {
                        this.connectedNodes[cn].nodeObj.colour.blue += this.blueOutRate;
                    }
                }

                if(this.connectedNodes[cn].nodeObj.colour.red < 255)
                {
                    if((this.connectedNodes[cn].nodeObj.colour.red + this.redOutRate) > 255)
                    {
                        this.connectedNodes[cn].nodeObj.colour.red = 255;

                    }
                    else
                    {
                        this.connectedNodes[cn].nodeObj.colour.red += this.redOutRate;
                    }
                }

                if(this.connectedNodes[cn].nodeObj.colour.green < 255)
                {
                    if((this.connectedNodes[cn].nodeObj.colour.green + this.greenOutRate) > 255)
                    {
                        this.connectedNodes[cn].nodeObj.colour.green = 255;

                    }
                    else
                    {
                        this.connectedNodes[cn].nodeObj.colour.green += this.greenOutRate;
                    }
                }
            


                if((this.connectedNodes[cn].nodeObj.colour.green - this.blueOutRate) < 0)
                {
                    this.connectedNodes[cn].nodeObj.colour.green = 0;
                }
                else
                {
                    this.connectedNodes[cn].nodeObj.colour.green -= this.blueOutRate;
                }
                if((this.connectedNodes[cn].nodeObj.colour.red - this.blueOutRate) < 0)
                {
                    this.connectedNodes[cn].nodeObj.colour.red = 0;
                }
                else
                {
                    this.connectedNodes[cn].nodeObj.colour.red -= this.blueOutRate;
                }

                if((this.connectedNodes[cn].nodeObj.colour.green - this.redOutRate) < 0)
                {
                    this.connectedNodes[cn].nodeObj.colour.green = 0;
                }
                else
                {
                    this.connectedNodes[cn].nodeObj.colour.green -= this.redOutRate;
                }
                if((this.connectedNodes[cn].nodeObj.colour.blue - this.redOutRate) < 0)
                {
                    this.connectedNodes[cn].nodeObj.colour.blue = 0;
                }
                else
                {
                    this.connectedNodes[cn].nodeObj.colour.blue -= this.redOutRate;
                }


                if((this.connectedNodes[cn].nodeObj.colour.red - this.greenOutRate) < 0)
                {
                    this.connectedNodes[cn].nodeObj.colour.red = 0;
                }
                else
                {
                    this.connectedNodes[cn].nodeObj.colour.red -= this.greenOutRate;
                }
                if((this.connectedNodes[cn].nodeObj.colour.blue - this.greenOutRate) < 0)
                {
                    this.connectedNodes[cn].nodeObj.colour.blue = 0;
                }
                else
                {
                    this.connectedNodes[cn].nodeObj.colour.blue -= this.greenOutRate;
                }
            }
            else if(mode =="domination")
            {
                if(this.connectedNodes[cn].nodeObj.colour.blue < 255)
                {
                    if((this.connectedNodes[cn].nodeObj.colour.blue + this.blueOutRate) > 255)
                    {
                        this.connectedNodes[cn].nodeObj.colour.blue = 255;

                    }
                    else
                    {
                        this.connectedNodes[cn].nodeObj.colour.blue += this.blueOutRate*2;
                    }
                }

                if(this.connectedNodes[cn].nodeObj.colour.red < 255)
                {
                    if((this.connectedNodes[cn].nodeObj.colour.red + this.redOutRate) > 255)
                    {
                        this.connectedNodes[cn].nodeObj.colour.red = 255;

                    }
                    else
                    {
                        this.connectedNodes[cn].nodeObj.colour.red += this.redOutRate*2;
                    }
                }

                if(this.connectedNodes[cn].nodeObj.colour.green < 255)
                {
                    if((this.connectedNodes[cn].nodeObj.colour.green + this.greenOutRate) > 255)
                    {
                        this.connectedNodes[cn].nodeObj.colour.green = 255;

                    }
                    else
                    {
                        this.connectedNodes[cn].nodeObj.colour.green += this.greenOutRate*2;
                    }
                }
            


                if((this.connectedNodes[cn].nodeObj.colour.green - this.blueOutRate) < 0)
                {
                    this.connectedNodes[cn].nodeObj.colour.green = 0;
                }
                else
                {
                    this.connectedNodes[cn].nodeObj.colour.green -= this.blueOutRate*2;
                }
                if((this.connectedNodes[cn].nodeObj.colour.red - this.blueOutRate) < 0)
                {
                    this.connectedNodes[cn].nodeObj.colour.red = 0;
                }
                else
                {
                    this.connectedNodes[cn].nodeObj.colour.red -= this.blueOutRate*2;
                }

                if((this.connectedNodes[cn].nodeObj.colour.green - this.redOutRate) < 0)
                {
                    this.connectedNodes[cn].nodeObj.colour.green = 0;
                }
                else
                {
                    this.connectedNodes[cn].nodeObj.colour.green -= this.redOutRate*2;
                }
                if((this.connectedNodes[cn].nodeObj.colour.blue - this.redOutRate) < 0)
                {
                    this.connectedNodes[cn].nodeObj.colour.blue = 0;
                }
                else
                {
                    this.connectedNodes[cn].nodeObj.colour.blue -= this.redOutRate*2;
                }


                if((this.connectedNodes[cn].nodeObj.colour.red - this.greenOutRate) < 0)
                {
                    this.connectedNodes[cn].nodeObj.colour.red = 0;
                }
                else
                {
                    this.connectedNodes[cn].nodeObj.colour.red -= this.greenOutRate*2;
                }
                if((this.connectedNodes[cn].nodeObj.colour.blue - this.greenOutRate) < 0)
                {
                    this.connectedNodes[cn].nodeObj.colour.blue = 0;
                }
                else
                {
                    this.connectedNodes[cn].nodeObj.colour.blue -= this.greenOutRate*2;
                }
            }

       }
       /*
            - Each new node is white and slowly get acclimated to connected nodes. 
       */

        
    }
    //draw
    this.draw = function()
    {
        //generic draw method BUT it will also draw the lines connecting the nodes 
        //NOTE: I should make the lines slightly transparent so overlapping lines merge into one colour OR even better, 
        //TWO lines between nodes. It would look cool
        //Maybe move this to a manager 
        
        //drawCircle(this.adjX,this.adjY,this.adjSize,this.colour.getString());
        drawCircle(this.x,this.y,this.size,this.colour.getString());
        if(showIds)
        {
            drawTinyText(this.id,this.x,this.y,"white");
        }
        


    }  
    //animateNewNode
    this.create = function(size,colour)
    {
        //this happens when this node is first born. triggered by the parent node
    }
    this.setScale = function()
    {
        this.adjSize = this.size * sizeScale;
        this.adjX = getAdjustedPostion(this.x,this.y).x;
        this.adjY = getAdjustedPostion(this.x,this.y).y;


        

        
    }
};



var nodes = new Array();
var selectedColour = new colourObj();
var scale = 0;
var sizeScale = 1;
//listen for a mouse click
        
canvas.addEventListener('mousedown', placeNode);
window.addEventListener('keydown', zoom);

var mainLoopID;
var gameTimerID;
var showIds = false;
var tickSpeed = 1000;
var screenType = document.getElementById("screenSelect").value;
var mode = document.getElementById("modeSelect").value;

resetGame();

function resetGame()
{
    document.getElementById("speedLabel").innerHTML = tickSpeed;
    document.getElementById("pauseButton").setAttribute("onclick", "pause()");
    document.getElementById("pauseButton").setAttribute("value", "Pause");
    setColour(document.getElementById("colourSelect").value);
    mainLoopID = setInterval(mainLoop, SECOND_IN_MILISECONDS/FRAMES_PER_SECOND);
    gameTimerID = setInterval(gameTimerFunction,tickSpeed);
}

function mainLoop()
{
    //debugObj.trace("main loop running");

    drawEverything();
    updateEverything();
    
}

function gameTimerFunction()
{
    tick();
}

function drawEverything()
{
    drawBackground();
    drawLines();
    drawNodes();
    
}

function updateEverything()
{
    
}
function tick()
{
    //update node list
    for(n in nodes)
    {
        nodes[n].nodeObj.update();
    }
}

function drawBackground()
{
    (function() {

        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', resizeCanvas, false);
        
        function resizeCanvas() {

                if(screenType == "square")
                {
                     canvas.width = window.innerWidth/2;
                    canvas.height = canvas.width;
                
                }
                else if (screenType == "full")
                {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
                
                
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
function drawNodes()
{
    for(n in nodes)
    {
        nodes[n].nodeObj.draw();
    }
}

function drawLines()
{
    if(nodes.length > 1)
    {
        for(n in nodes)
        {
            if(nodes[n].nodeObj.connectedNodes.length > 0)
            {
                for(cn in nodes[n].nodeObj.connectedNodes)
                {
                    drawLine({ x: nodes[n].nodeObj.x, y: nodes[n].nodeObj.y}, {x: nodes[n].nodeObj.connectedNodes[cn].nodeObj.x,y: nodes[n].nodeObj.connectedNodes[cn].nodeObj.y},1,"white");
                }
            }
        }
    }
}

function getDistance(objectOne,objectTwo)
{
    var dx;
    var dy;

    dx = objectOne.x  - objectTwo.x;
    dy = objectOne.y  - objectTwo.y;
    
    var dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

    dis -= objectOne.size;
    dis -= objectTwo.size;

    return dis;
}





function setColour(value)
{

    //this is activated by radio buttons
    //it sets the colour the user can place 
    switch(value)
    {
        case "blue":
            selectedColour.blue = 255;
            selectedColour.red = 0;
            selectedColour.green = 0;
            break;
        case "red": 
            selectedColour.blue = 0;
            selectedColour.red = 255;
            selectedColour.green = 0;
            break;
        case "green": 
            selectedColour.blue = 0;
            selectedColour.red = 0;
            selectedColour.green = 255;
            break;
    }
}

function changeType(value)
{
    if(value == "domination")
    {
        mode = "domination";
    }
    else if (value == "normal")
    {
        mode = "normal";
    }
}

function changeScreen(value)
{
    if(value == "full")
    {
        screenType = "full";
    }
    else if (value == "square")
    {
        screenType = "square";
    }
}

function setSpeed(value)
{
    tickSpeed = 1000/value;
    document.getElementById("speedLabel").innerHTML = value;
    pause();
    resetGame();
}

function toggleIds(isChecked)
{
    showIds = isChecked;
}

function pause()
{
    clearInterval(gameTimerID);

    document.getElementById("pauseButton").setAttribute("onclick", "resetGame()");
    document.getElementById("pauseButton").setAttribute("value", "Start");
}

function placeNode(event)
{
    //this is activated by a click. It checks the active node type and places a node at the mouse position
    var newNode = new node();
    var rect = canvas.getBoundingClientRect();
    var clickPoint = {x:event.clientX - rect.left, y:event.clientY - rect.top}
    newNode.x = event.clientX - rect.left;
    newNode.y = event.clientY - rect.top; 
    newNode.colour.blue = selectedColour.blue;
    newNode.colour.red = selectedColour.red;
    newNode.colour.green = selectedColour.green;
    newNode.id = Math.ceil(Math.random() * (10000 - 1) + 1);
    do
    {
        newNode.id = Math.ceil(Math.random() * (10000 - 1) + 1);
    }
    while(doesIdExist(newNode.id));
    nodes.push({ id: newNode.id, nodeObj: newNode});
    

}

function doesIdExist(id)
{
    var value = false;

    for(n in nodes)
    {
        if(id == nodes[n].id)
        {
            value = true;
            break;
        }
    }


    return value;
}

function getRandomPoint(radius) {
    var angle = Math.random() * Math.PI * 2;
    return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
    };
}
function getAdjustedPostion(objX,objY)
{
    var point = {x:objX,y:objY};
    var canvasCenter = {x: canvas.width/2, y: canvas.height/2};
    if(point.x > canvasCenter.x)
    {
        point.x -= scale;
    }
    else  if(point.x < canvasCenter.x)
    {
        point.x += scale;
    }
    if(point.y > canvasCenter.y)
    {
        point.y -= scale;
    }
    else if(point.y < canvasCenter.y)
    {
        point.y += scale;
    }

    return point;
}

function zoom(event)
{

    //this might help with scaling http://stackoverflow.com/questions/6775168/zooming-with-canvas
    console.log(event.keyCode);
    if(event.keyCode == 90)
    {   
        if(scale < 0)
        {
            scale *= -1;
        }
        if((scale + 1) > 12)
        {
            scale = 12;
        }
        else
        {
            scale += 1;
        }

        
        sizeScale += 0.01;
        for(n in nodes)
        {
            nodes[n].nodeObj.setScale();
        }
    }
    else if(event.keyCode == 88)
    {

        if(scale < 0)
        {
            scale *= -1;
        }
        if((scale - 1) < 0)
        {
            scale = 0;
        }
        else
        {
            scale -= 1;
        }
  
        
        if((sizeScale - 0.01) < 0)
        {
            sizeScale = 0.01;
        }
        else
        {
            sizeScale -= 0.01;
        }
        
        for(n in nodes)
        {
            nodes[n].nodeObj.setScale();
        }
    }
    else if(event.keyCode == 49)
    {
        document.getElementById("colourSelect").selectedIndex = 0; 
        document.getElementById("colourSelect").onchange();
    }
    else if(event.keyCode == 50)
    {
        document.getElementById("colourSelect").selectedIndex = 1;
        document.getElementById("colourSelect").onchange();
    }
    else if(event.keyCode == 51)
    {
        document.getElementById("colourSelect").selectedIndex = 2;
        document.getElementById("colourSelect").onchange();
    }

}
function clearNodes()
{
    nodes = new Array();
}
function drawLine(start,end,lnWidth,strokeColour)
{
    
    canvasContext.beginPath();
    canvasContext.moveTo(start.x,start.y);
    canvasContext.lineTo(end.x,end.y);
    canvasContext.lineWidth = lnWidth;
    canvasContext.strokeStyle = strokeColour;
    canvasContext.stroke();
}

function drawTinyText(text,textX,textY,drawColor)
{
    canvasContext.strokeStyle = drawColor;
    canvasContext.fillStyle = drawColor;
    canvasContext.font = "12px Arial";
    canvasContext.fillText(text,textX,textY);
}
//check for optional paramenter or overloaded function options for JS
function drawCircle(leftX, topY, diameter,fillColor)
{
    canvasContext.strokeStyle = fillColor;
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    //draw arc
    canvasContext.arc(leftX,topY,diameter,0,Math.PI*2,true)
    canvasContext.fill();

}