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
    this.size            = 5.0;             //size (float)       
    this.redOutRate      = 0.0;             //redOutRate (float)
    this.blueOutRate     = 0.0;             //blueOutRate (float)
    this.greenOutRate    = 0.0;             //greenOutRate (float)
    //growthRate (float)
    //this will either be variable or a global constant
    //this.growthRate = 0.0;
    this.growthRate      = NODE_GROWTH_RATE;
    //connectedNodes (Array)
    this.connectedNodes  = new Array();


//Functions 
    //createNewNode
    this.createNewNode = function()
    {
        //This function is a dice roll. Based on the size of the node and the number of connections it all ready has
        //it will create new nodes
        // the distance of the node will be a random number between a max and min and will be a random direction
        // ill have to figure out how to keep new nodes away from existing nodes 
        var roll = Math.ceil(Math.random() * (this.size - 1) + 1)

        if(roll > (this.size * 0.99))
        {
            var newNode = new node();
            var rect = canvas.getBoundingClientRect();
            newNode.x = this.x + 100;
            newNode.y = this.y + 100; 
            newNode.colour.blue = this.blue;
            newNode.colour.red = this.red;
            newNode.colour.green = this.green;
            newNode.id = Math.ceil(Math.random() * (10000 - 1) + 1);
            this.connectedNodes.push({ id: newNode.id, nodeObj: newNode});
            nodes.push({ id: newNode.id, nodeObj: newNode});
            
        }
        console.log(roll);
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

        //Here im trying to prevent nodes from growing when they get a certain distance from eachother
        if(this.connectedNodes.length > 0)
        {
            for(cn in this.connectedNodes)
            {
                if(getDistance(this.connectedNodes[cn].nodeObj,this) <= 10)
                {
                    checkBool = true;
                    break;
                }
                
            }
        }
        
        if(!checkBool)
        {
            this.size += this.growthRate;
        }
        
        

        
        
        
        //check for adjacent unconnected nodes 
        this.checkProximity();
        //roll for new node creation
        this.createNewNode();
        //send influence
    }
    //draw
    this.draw = function()
    {
        //generic draw method BUT it will also draw the lines connecting the nodes 
        //NOTE: I should make the lines slightly transparent so overlapping lines merge into one colour OR even better, 
        //TWO lines between nodes. It would look cool
        //Maybe move this to a manager 
        if(this.connectedNodes.length > 0)
        {
            for(cn in this.connectedNodes)
            {
                drawLine({ x: this.x * scale, y: this.y * scale}, {x: this.connectedNodes[cn].nodeObj.x * scale,y: this.connectedNodes[cn].nodeObj.y * scale},this.size/5);

            }
        }
        drawCircle(this.x,this.y,this.size,this.colour.getString());
        drawTinyText(this.id,this.x,this.y,"white");

        


    }  
    //animateNewNode
    this.create = function(size,colour)
    {
        //this happens when this node is first born. triggered by the parent node
    }
};



var nodes = new Array();
var selectedColour = new colourObj();
var scale = 1;
//listen for a mouse click
        
canvas.addEventListener('mousedown', placeNode);
window.addEventListener('keydown', zoom);

var mainLoopID;
var gameTimerID;

resetGame();

function resetGame()
{
    document.getElementById("pauseButton").setAttribute("onclick", "pause()");
    document.getElementById("pauseButton").setAttribute("value", "Pause");
    setColour(document.getElementById("colourSelect").value);
    mainLoopID = setInterval(mainLoop, SECOND_IN_MILISECONDS/FRAMES_PER_SECOND);
    gameTimerID = setInterval(gameTimerFunction,SECOND_IN_MILISECONDS);
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
function drawNodes()
{
    for(n in nodes)
    {
        nodes[n].nodeObj.draw();
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

    console.log(objectOne.id + " is " + dis + " pixels from " + objectTwo.id);
    return dis;
}





function setColour(value)
{

    //this is activated by radio buttons
    //it sets the colour the user can place 
    console.log(value);
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

function pause()
{
    clearInterval(mainLoopID);
    clearInterval(gameTimerID);

    document.getElementById("pauseButton").setAttribute("onclick", "resetGame()");
    document.getElementById("pauseButton").setAttribute("value", "Start");
}

function placeNode(event)
{
    //this is activated by a click. It checks the active node type and places a node at the mouse position
    var newNode = new node();
    var rect = canvas.getBoundingClientRect();
    newNode.x = event.clientX - rect.left;
    newNode.y = event.clientY - rect.top; 
    newNode.colour.blue = selectedColour.blue;
    newNode.colour.red = selectedColour.red;
    newNode.colour.green = selectedColour.green;
    newNode.id = Math.ceil(Math.random() * (10000 - 1) + 1)
    nodes.push({ id: newNode.id, nodeObj: newNode});
    

}

function zoom(event)
{

    //this might help with scaling http://stackoverflow.com/questions/6775168/zooming-with-canvas
    if(event.keyCode == 90)
    {   
        scale += 0.05;
    }
    else if(event.keyCode == 88)
    {
        scale -= 0.05;
    }

}

function drawLine(start,end,lnWidth)
{
    
    canvasContext.beginPath();
    canvasContext.moveTo(start.x,start.y);
    canvasContext.lineTo(end.x,end.y);
    canvasContext.lineWidth = lnWidth;
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
    canvasContext.scale(scale,scale);
    canvasContext.strokeStyle = fillColor;
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    
    //draw arc
    canvasContext.arc(leftX,topY,diameter,0,Math.PI*2,true)
    canvasContext.fill();

}