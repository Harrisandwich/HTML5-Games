'use strict';
//branching alg

//single start node 
//grow upwards certain height based on "enviromental" factors
//Trunk? or should it just split like a fractal? 
    //single trunk that gets smaller as it grows
//at certain points branches will form following the same rules as the trunk
//at a certain size leaves will appear instead of branches
//branch point in plotted, once that happens the branch starts to grow towards it
    //FUN NOTE: Maybe obsticales?!?
var SEC_IN_MILISECONDS = 1000;
var FPS =60;
var STARTING_GROWTH_RATE = 1;
var decayRate = 6;
var SPAWN_MAX = 2;
var MAX_NODES = 500;
var canvas;
var context;
var animationTimer; 


var sunlight;
var water;

var tree;
var scale = 1;

var logActive = false;
var leaves = false;
var colors = false;
var obsticles = false;
var wireframe = false;
var random = false;
var auto = false;

var testNumber = 1;
var ruler;
var resultsLog;
var shape;



class log
{
    constructor(area)
    {
        this.textArea = area;
    }

    writeLine(text)
    {
        $(this.textArea).append("\n"+text);
    }

    clear()
    {
        $(this.textArea).text("");
    }
}
class Ruler
{
    constructor(inc,originX,originY)
    {
        this.increment = inc;

        this.originX = originX;
        this.originY = originY;
        

        this.height = this.originY/scale; 
        

        this.yAxis = [];


        this.generate();
    }

    generate()
    {
     
        /*Properly adjust this for scale*/   
        //draw line from origin to top of screen
        this.yAxis = [];
        

        
        this.height = this.originY/scale; 
        

        
        for(var i = 0; i <= this.height; i++)
        {
            if(i%this.increment == 0)
            {
                var point = {
                    y: this.originY - (i*scale),
                    value: i
                }
                this.yAxis.push(point);
            }
        }
        
        //draw all text from origin to top of screen
    }

    draw()
    {
        //draw first line 
        context.beginPath();
        context.moveTo(this.originX,this.originY);
        context.lineTo(this.originX,0);
        context.lineWidth = 5;
        context.strokeStyle = "white";
        context.stroke();

        //draw 0 text
        context.beginPath();
        context.moveTo(this.originX - 20,this.originY);
        context.lineTo(this.originX,this.originY);
        context.lineWidth = 2;
        context.strokeStyle = "white";
        context.stroke();
        this.drawSmallText("0",this.originX - 60,this.originY);


        for(var i = 0; i < this.yAxis.length; i++)
        {
            context.beginPath();
            context.moveTo(this.originX - 20,this.yAxis[i].y);
            context.lineTo(this.originX,this.yAxis[i].y);
            context.lineWidth = 2;
            context.strokeStyle = "white";
            context.stroke();
            this.drawSmallText(this.yAxis[i].value,this.originX - 60,this.yAxis[i].y);
        }
    }

    drawSmallText(text,textX,textY)
    {
        var fontSize = 20 * scale;
        context.strokeStyle = "white";
        context.fillStyle = "white";
        context.font = fontSize+"px Arial";
        context.fillText(text,textX,textY);
    }



}

class Tree
{
    constructor()
    {
        this.growthTimer = 0.0;
        this.spawnTimer = 0.0;
        //array of nodes
        this.nodes = [];
        this.ghosts = [];
        //constructor       (id,    x,             y,            size,parent,growthRate,           direction,slope,tree)
        this.root = new Node("Root",canvas.width/2,canvas.height - 1,1,null, 0,0,{ x: 0, y: 0});
        //constructor                 (id,              x,             y,                size,parent,growthRate,           direction,slope,tree)
        this.apicalMeristem = new Node("ApicalMeristem",canvas.width/2,canvas.height - 2,1,this.root,STARTING_GROWTH_RATE, 1,{ x: 0, y: -1},this,0);
        //spawn the first true node
        var children = this.apicalMeristem.spawnChildren();
        this.nodes.push(children[0]);

    }
    getHeight()
    {

        var highestNode = this.root;
        var max = canvas.height/scale;  

        var height = 0; 

        if(this.ghosts.length > 0)
        {
            for(var g = this.ghosts.length - 1; g >= 0; g--)
            {
                if(this.ghosts[g].y < highestNode.y)
                {
                    highestNode = this.ghosts[g];
                }
            }
        }

        if(this.nodes.length > 0)
        {
            for(var n = this.nodes.length - 1; n >= 0; n--)
            {
                if(this.nodes[n].y < highestNode.y)
                {
                    highestNode = this.nodes[n];
                }
            }
        }


        height = Math.round(max - highestNode.y);



        
        return height
    }
    branch()
    {
        var newNodes = []
        for(var n in this.nodes)
        {
            if(this.nodes[n].spawnCheck())
            {
                var nodeBuffer = this.nodes[n].spawnChildren();
                for(var node in nodeBuffer)
                {
                    newNodes.push(nodeBuffer[node]);
                }
            }     
        }

        for(var newN in newNodes)
        {
            this.nodes.push(newNodes[newN]);
        }
    }
    grow()
    {
        if(this.nodes.length + this.ghosts.length < MAX_NODES)
        {
            this.growthTimer++;
            this.spawnTimer++;
            if(this.growthTimer > SEC_IN_MILISECONDS/FPS)
            {
                this.apicalMeristem.offset.size += (0.2 * scale);
                this.apicalMeristem.size += 0.2;

                  
                    for(var n in this.nodes)
                    {
                        if(!this.nodes[n].static)
                        {
                            this.nodes[n].grow();
                        }
                        else
                        {
                            this.nodes[n].id = "Ghost";
                            this.ghosts.push(this.nodes[n]);
                            this.nodes.splice(n,1); 
                            n--;
                        }                        
                    }
  

                this.growthTimer = 0;
                for(var g in this.ghosts)
                {
                    this.ghosts[g].grow();
                }
            }
            if(this.spawnTimer > (SEC_IN_MILISECONDS/FPS)*2)
            {
                this.branch();
                this.spawnTimer = 0;
            }
        }
        else
        {
            pause();
            var leavesArr = [];
            for(var n in this.nodes)
            {
                
                this.nodes[n].id = "Ghost";
                if(leaves)
                {
                    leavesArr.push(this.nodes[n]);
                }
                this.ghosts.push(this.nodes[n]);
            }
            this.nodes = []
            drawBackground();
            this.draw();
            if(leaves)
            {
                for(var l in leavesArr)
                {
                    drawLeaf(leavesArr[l]);
                }
            }
            ruler.draw();
            $("#pause").attr("disabled", "true");

            if(auto)
            {

                setTimeout(function(){
                    setScale(1);
                    restart();

                },2000);
            }
            
        }


    }

    scale(sc)
    {
        this.apicalMeristem.scale(sc);
        for(var n in this.nodes)
        {
            this.nodes[n].scale(sc);
        }

        for(var g in this.ghosts)
        {
            this.ghosts[g].scale(sc);
        }

    }

    draw()
    {
        //draw lines between nodes 
        //drawTrunk(this.nodes[0].offset,this.apicalMeristem.offset);
        for(var n in this.nodes)
        {
            if(!colors)
            {
                drawLine(this.nodes[n].offset,this.nodes[n].parent.offset);
                drawCircle(this.nodes[n]);
            }
            else
            {

            }
        }

        for(var g in this.ghosts)
        {
            drawLine(this.ghosts[g].offset,this.ghosts[g].parent.offset);
            //drawCircle(this.ghosts[g]);
        }

    }



}

class Node
{
    constructor(id,x,y,size,parent, growthRate,direction,slope,tree,gen)
    {

        if(parent != null)
        {
            this.parent = parent; // the node that spawned this node  
        }   
        this.x = x;
        this.y = y;
        this.size = size;
        this.id = id;
        this.children = [];
        this.growthRate = growthRate;
        this.growthX = 0; // how far along the x axis the node moves 
        this.growthY = 0; // how far along the y axis the node moves
        this.hasChild = false;
        this.direction = direction;
        this.slope = slope;
        this.tree = tree;
        this.health = 100;
        this.static = false;
        this.offset = {
            x: this.x,
            y: this.y,
            size: this.size
        };

        if(this.id != "Root" && this.id != "ApicalMeristem")
        {
            this.scale(scale);
        }
    }
    getDistanceFromMeristem()
    {
        var ret = {
            found: false,
            distance: 0.0
        }
        var meristemFound = false;
        while(!ret.found)
        {
            //for each child
            for(var child in this.children)
            {

                if(this.children[child].id != "Meristem")
                {
                    ret.found = this.children[child].getDistanceFromMeristem().found;
                    ret.distance += this.children[child].getDistanceFromMeristem().distance + 1;
                    if(meristemFound)
                    {
                        break;
                    }
                }
                else
                {
                    ret.found = true;
                    ret.distance += 1;
                    break;  
                }
            }
           
        }
        return ret
    }
    getDistanceFromParent()
    {
        //get the dx and dy, calc distance (check code from games)
        var dx;
        var dy;
        dx = this.x  - this.parent.x;
        dy = this.y  - this.parent.y;
        var dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

        //dis -= this.size;
        //dis -= this.parent.size;

        return dis
    }

    getCurrentSlope(x1,y1,x2,y2)
    {
        //Find the slope of the line 
        
        var slopeX = (x1 - x2);
        var slopeY = (y1 - y2);
        var isDivisible = true;
        var factor = 1;
        var order = {
            first: {
                axis: "",
                value: 0
            },
            second: {
                axis: "",
                value: 0
            }
        }
        var slope  = {
            x: 0,
            y: 0
        };

        if(slopeX < 0)
        {
            slopeX *= -1;
        } 

        if(slopeY < 0)
        {
            slopeY *= -1;
        } 

        if(slopeX < slopeY)
        {
            order.first.axis = "x";
            order.first.value = slopeX;
            order.second.axis = "y";
            order.second.value = slopeY;
        }
        else
        {
            order.first.axis = "y";
            order.first.value = slopeY;
            order.second.axis = "x";
            order.second.value = slopeX;
        }

        while(isDivisible)
        {   
            var temp = order.first.value/factor;
            var tempSecond = order.second.value/factor;
            
            if(temp > 0 && tempSecond > 1)
            {
                factor++;
            }
            else
            {
                if(factor > 1)
                {
                    factor--;
                    order.second.value = order.second.value/factor;
                }
                else
                {
                    order.second.value = 1;
                }
                order.first.value = order.first.value/factor;
                isDivisible = false;

            }
        }

        if(order.first.axis == "x")
        {
            slope = {
                x: order.first.value,
                y: order.second.value
            };
        }
        else
        {
            slope = {
                x: order.second.value,
                y: order.first.value
            };
        }



        return slope
    }

    //Come back to this and make it more organic
    getGrowthPotential()
    {

        var potential = 0.0;
        

        //The plant should have higher potential the lower its health.
        //this will create shorter, stumpier plants when there is no water or sun.

        if(this.health > 0)
        {
        
        
            var healthWeighting = this.health/100;

            if(this.id == "Bud")
            {
                var distance = 0;
                var distanceFromMeristem = this.getDistanceFromMeristem().distance;


                potential = (distanceFromMeristem * 0.1) * healthWeighting;
                
            }
            else
            {
                var distance = 0;
                var distanceFromParent = this.getDistanceFromParent();
                var parentDistanceFromParent = this.parent.getDistanceFromParent();

                var distanceFactor = distanceFromParent/parentDistanceFromParent;

                potential = distanceFactor * healthWeighting;
                
            }
        }

        

        return potential;
    }
    scale(sc)
    {
        if(this.id == "Ghost")
        {
            this.size += 0.2;
        }
        this.offset.size = this.size * sc;

        var disX = this.x - this.tree.root.x;
        var disY = this.y - this.tree.root.y;

        this.offset.x = (disX * sc) + this.tree.root.x; 
        this.offset.y = (disY * sc) + this.tree.root.y;

        if(animationTimer != null)
        {
            if(this.offset.x > canvas.width || this.offset.x < 0 || this.offset.y < 0 )
            {
                if((scale - 0.3) > 0)
                {
                    setScale(scale - 0.3);
                }
                
            }
        }


    }
    grow()
    {

        //I should grow based on slope

        if(this.health != 0)
        {
        
            
            if(this.slope.x != 0)
            {
                this.growthX = this.parent.growthX + (this.growthRate * this.slope.x) * this.direction;
            }

            this.growthY = this.parent.growthY + (this.slope.y * (this.growthRate * water) );

            this.x += this.growthX;
            this.y -= this.growthY;
            
            

            //change this to organic value
            this.size += (0.2 * this.growthRate) * sunlight;
        }
        else
        {
            this.x += this.parent.growthX;
            this.y -= this.parent.growthY;
        }

        this.scale(scale);
    

       
        
    }

    spawnCheck()
    {
        //check if the node should spawn children

        if(!this.hasChild)
        {
            
            var roll = Math.random();
            var potential = this.getGrowthPotential();
            
            if(roll < potential)
            {
                return true
            }

            
        }
        else
        {
            if(this.getDistanceFromMeristem().distance >= 3)
            {
                this.setStaticToTrue();
            }
        }
        return false 
    }

    branch()
    {
        /*
            - create multiple nodes 
            - one node on each side of the bud
                - for this i need to use my normalization code to get the points on either side 
        */

        var numberOfChildren = (Math.random() * 2) + 1;
        //vectors 1 and 3
        var vects = getPolygonVerts(this,this.parent);
        var children = [];
        var side;

        this.id = "Branch";




        /*if(this.colour.red == 255 && this.colour.green == 0)
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
        }*/

        for(var i = 0; i < 2; i++)
        {

            side = Math.round(Math.random());
            var id = "Meristem";
            var x;
            var y;
            var size;
            var direction;
            var slope = {
                x: 0,
                y: 0
            };

            
            //add some kind of deviation

            var deviation = {
                x: 0,
                y: 0
            }
            if(i == 0)
            {
                x = vects.n1.v1.x;
                y = vects.n1.v1.y;
            }
            else
            {
                x = vects.n1.v2.x;
                y = vects.n1.v2.y;
            }
            slope = this.getCurrentSlope(x,y,vects.n1.v4.x,vects.n1.v4.y);
            deviation.x = (Math.random()*(0.2 - 0.01) + 0.01);
            deviation.y = (Math.random()*(0.6 - 0.1) + 0.1);

            if(Math.round(Math.random()) == 1)
            {
                slope.x -= deviation.x;
            }
            else
            {
                slope.x += deviation.x;
                
            }
            slope.y += deviation.y;

            slope.y *= shape;
            if(x > this.x)
            {
                direction = 1;
            }
            else
            {
                direction = -1;
            }

            
            size = this.size * 0.2;
            var gen = this.gen + 1;


            var newNode = new Node(id,x,y,size,this,this.growthRate,direction,slope, this.tree, gen);
            var health = this.health - (decayRate + (decayRate - (water+sunlight/2)));

            if(health <= 0)
            {
                newNode.health = 0;
            }
            else
            {
                newNode.health = health;
            }
            newNode.grow();
            this.hasChild = true;
            children.push(newNode);
            this.children.push(newNode);
        }
        return children


    }

    extend()
    {
        /*
            - create one node
            - the node spawns at the same slope of the preveious node
                - maybe a possible random deviation?

        */
        var children = [];
        
        if(this.id != "ApicalMeristem")
        {
            this.id = "Bud";
        }
        var id = "Meristem";
        var gen = this.gen + 1;
        var x;
        var y;
        var size;
        var direction;

        var slope = {
            x: 0,
            y: 0
        };
        var deviation = {
                x: 0,
                y: 0
            }
        deviation.x = (Math.random()*(0.2 - 0.01) + 0.01);
        deviation.y = (Math.random()*(0.2 - 0.01) + 0.01);

        if(Math.round(Math.random()) == 1)
        {
            slope.x -= deviation.x;
        }
        else
        {
            slope.x += deviation.x;
            
        }

        slope.y += deviation.y;
        slope.y *= shape;
        
        // get the slop of the current branch
        slope = this.getCurrentSlope(this.x,this.y,this.parent.x,this.parent.y);

        //place the node on this node at the same slope
        if(this.x > this.parent.x)
        {
            direction = 1;
            x = this.x + slope.x;
        }
        else
        {
            direction = -1;
            x = this.x - slope.x;
        }
       
        y = this.y - slope.y;

        //make it 80% of the size
        size = this.size * 0.8;

        //TODO: deviate upwards slightly 

        var gen = this.gen + 2;
        


        var newNode = new Node(id,x,y,size,this,this.growthRate,direction,slope, this.tree, gen);
        var health = this.health - ((decayRate*1.5) + ((decayRate * 1.5) - (water+sunlight/2)));

        if(health <= 0)
        {
            newNode.health = 0;
        }
        else
        {
            newNode.health = health;
        }
        children.push(newNode);
        this.children.push(newNode);
        return children;
    }
    spawnChildren()
    {
        var children = [];

        if(this.id == "Bud")
        {
            children = this.branch();
            
        }
        else if (this.id == "Meristem" || this.id == "ApicalMeristem" )
        {
            /*if(this.gen%this.tree.nodes.length == 4 || this.gen%this.tree.nodes.length == 5)
            {
                children = this.branch();
            }
            */
            children = this.extend();
        }
        
        return children
    }
    setStaticToTrue()
    {
        this.static = true;
    }
}


$(document).ready(function(){
    resultsLog = new log($("#logBox"));
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext('2d');
    start();
})



function start()
{
    drawBackground();
    setControls();
    $("#pause").attr("disabled", false);
    tree = new Tree();
    ruler = new Ruler(30,canvas.width - 1,canvas.height);

    if(animationTimer != undefined || animationTimer != null)
    {
        clearInterval(animationTimer);
        animationTimer = setInterval(mainLoop, SEC_IN_MILISECONDS/FPS);
    }
    else
    {
        animationTimer = setInterval(mainLoop, SEC_IN_MILISECONDS/FPS);
    }

    
}
function mainLoop()
{
    
    drawBackground();
    tree.grow();
    tree.draw();
    ruler.draw();
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

function drawLine(node1,node2)
{   
    
    if(!wireframe)
    {
        
        context.beginPath();
        context.moveTo(node1.x,node1.y);
        context.lineTo(node2.x,node2.y);
        context.lineWidth = node1.size;
        context.strokeStyle = "green";
        context.stroke();

        
    }
    else
    {
        var vectors = getPolygonVerts(node1,node2);
        context.beginPath();
        context.moveTo(node1.x,node1.y);
        context.lineTo(node2.x,node2.y);
        context.lineWidth = 1;
        context.strokeStyle = "white";
        context.stroke();

        context.beginPath();
        context.moveTo(vectors.n1.v1.x,vectors.n1.v1.y);
        context.lineTo(vectors.n2.v1.x,vectors.n2.v1.y);
        context.lineWidth = 1;
        context.strokeStyle = "blue";
        context.stroke();

        context.beginPath();
        context.moveTo(vectors.n1.v2.x,vectors.n1.v2.y);
        context.lineTo(vectors.n2.v2.x,vectors.n2.v2.y);
        context.lineWidth = 1;
        context.strokeStyle = "blue";
        context.stroke();
    }

}

function drawCircle(node1)
{
    var color = "";

    switch(node1.id)
    {
        case "Bud":
            color = "green";
            break;
        case "Meristem":
            color = "red";
            break;
        case "Ghost":
            color = "white";
            break;
            default:
                color = "blue";

    }
   
    context.strokeStyle = color;
    context.fillStyle = "green";
    context.beginPath();
    
    context.lineWidth = 2;
    //draw arc
    context.arc(node1.offset.x,node1.offset.y,node1.offset.size,0,Math.PI*2,true)
    context.stroke();
    context.fill();

}

function drawLeaf(node)
{
    var color = "rgba(0,100,0,0.5)";

    context.strokeStyle = color;
    context.fillStyle = color;
    context.beginPath();
    
    context.lineWidth = 2;
    //draw arc
    context.arc(node.offset.x,node.offset.y,node.offset.size*10,0,Math.PI*2,true)
    context.stroke();
    context.fill();

}

function getPolygonVerts(node1,node2)
{
    var dx = node1.x - node2.x;
    var dy = node1.y - node2.y;

    var newX = -dy;
    var newY = dx;

    var magnitude = Math.sqrt(Math.pow(newX,2) + Math.pow(newY,2));

    //Normalized points (left and right of node)
    var vector1 = {
      x:newX/magnitude,
      y:newY/magnitude
    }


    var vector2 = {
      x:newX/magnitude,
      y:newY/magnitude
    }

    var vector3 = {
      x:newX/magnitude,
      y:newY/magnitude
    }

    var vector4 = {
      x:newX/magnitude,
      y:newY/magnitude
    }

    //Top and bottom of node

    dx = node1.x - node2.x;
    dy = node1.y - node2.y;

    newX = dx;
    newY = dy;

    magnitude = Math.sqrt(Math.pow(newX,2) + Math.pow(newY,2));

    var vector5 = {
      x:newX/magnitude,
      y:newY/magnitude
    }


    var vector6 = {
      x:newX/magnitude,
      y:newY/magnitude
    }

    var vector7 = {
      x:newX/magnitude,
      y:newY/magnitude
    }

    var vector8 = {
      x:newX/magnitude,
      y:newY/magnitude
    }


    //left and right
    vector1.x *= node1.size;
    vector1.y *= node1.size;

    vector2.x *= node2.size;
    vector2.y *= node2.size; 


    vector1.x += node1.x;
    vector1.y += node1.y;
    
    vector2.x += node2.x;
    vector2.y += node2.y; 


    vector3.x *= -node1.size;
    vector3.y *= -node1.size;

    vector4.x *= -node2.size;
    vector4.y *= -node2.size; 


    vector3.x += node1.x;
    vector3.y += node1.y;
    
    vector4.x += node2.x;
    vector4.y += node2.y; 

    //Top and bottom
    vector5.x *= node1.size;
    vector5.y *= node1.size;

    vector6.x *= node2.size;
    vector6.y *= node2.size; 


    vector5.x += node1.x;
    vector5.y += node1.y;
    
    vector6.x += node2.x;
    vector6.y += node2.y; 


    vector7.x *= -node1.size;
    vector7.y *= -node1.size;

    vector8.x *= -node2.size;
    vector8.y *= -node2.size; 


    vector7.x += node1.x;
    vector7.y += node1.y;
    
    vector8.x += node2.x;
    vector8.y += node2.y; 

    var vectors = {
        n1: {
            v1: null,
            v2: null,
            v3: null,
            v4: null
        },
        n2: {
            v1: null,
            v2: null,
            v3: null,
            v4: null
        },
    };

    vectors.n1.v1 = vector1;
    vectors.n1.v2 = vector3;

    vectors.n2.v1 = vector2;
    vectors.n2.v2 = vector4;


    vectors.n1.v3 = vector5;
    vectors.n1.v4 = vector7;

    vectors.n2.v3 = vector6;
    vectors.n2.v4 = vector8;





    return vectors
}

function setScale(sc)
{
    $("#zoomLabel").html(sc+"x");
    $("#zoom").val(sc);
    scale = sc;    
    ruler.generate();
    ruler.draw();
    tree.scale(sc);

    if(animationTimer == null)
    {
        drawBackground();
        tree.draw();
        ruler.draw();
    }
}


function pause()
{
    if(animationTimer != undefined || animationTimer != null)
    {
        $("#pause").attr("value", "Resume");
        $("#pause").attr("onclick", "resume()");
        clearInterval(animationTimer);
        animationTimer = null;
        
    }
   
}

function resume()
{
    if(animationTimer == undefined || animationTimer == null)
    {
        $("#pause").attr("value", "Pause");
        $("#pause").attr("onclick", "pause()");
        animationTimer = setInterval(mainLoop, SEC_IN_MILISECONDS/FPS);
    }
   
}

function restart()
{
    if(logActive)
    {
        
        resultsLog.writeLine("Test #"+testNumber);
        resultsLog.writeLine("---------------------");
        resultsLog.writeLine("Width : " + Math.round(tree.apicalMeristem.size));
        resultsLog.writeLine("Height : " + tree.getHeight());
        resultsLog.writeLine("Max Branches: " + MAX_NODES);
        resultsLog.writeLine("Shape: " + (shape * 100) + "% Curve");
        resultsLog.writeLine("Water: " + (water * 100)+ "%");
        resultsLog.writeLine("Sunlight: " + (sunlight * 100) + "%");
        resultsLog.writeLine("");
        testNumber++;
    }
    $("#pause").attr("value", "Pause");
    $("#pause").attr("onclick", "pause()");

    if(random)
    {
        let size = Math.round(Math.random() * (1000 - 10))+10;
        let shape = Math.round(Math.random() * 100);
        let water = Math.round(Math.random() * 100);
        let sunlight = Math.round(Math.random() * 100);
        setSize(size);
        setShape(shape);
        setWater(water);
        setSunlight(sunlight);
    }
    start();

}


function setSpeed(speed)
{
    //set animation timer speed

    if(animationTimer != undefined || animationTimer != null)
    {
        
        clearInterval(animationTimer);
        animationTimer = null;
        FPS = speed;
        if(animationTimer == undefined || animationTimer == null)
        {
            $("#speedLabel").html(speed+" fps");
            animationTimer = setInterval(mainLoop, SEC_IN_MILISECONDS/FPS);
        }
        
    }
    else
    {
        FPS = speed;
        $("#speedLabel").html(speed+" fps");
    }
    

}

function setSize(size)
{
    //set max number of nodes?
    MAX_NODES = size;
    $("#sizeLabel").html(size+ " nodes");
    $("#size").val(size);
}

function setShape(shapeAmnt)
{
    shape = shapeAmnt/100;
    $("#shapeLabel").html((shapeAmnt)+"%");
    $("#shape").val(shapeAmnt);
}
function setWater(waterAmnt)
{
    water = waterAmnt/100;
    $("#waterLabel").html((waterAmnt)+"%");
    $("#water").val(waterAmnt);
}

function setSunlight(sunAmnt)
{
    sunlight = sunAmnt/100;
    $("#sunlightLabel").html((sunAmnt)+"%");
    $("#sunlight").val(sunAmnt);
}


function setObsticles(val)
{

}

function setColors(val)
{

}

function toggleWireframe(val)
{
    wireframe = val;
}

function setLeaves(val)
{
    leaves = val;
}


function setAutoRestart(val)
{
    auto = val;
}

function toggleRandom(val)
{
    random = val;
}
//speed
function setControls()
{
    setSpeed($("#speed").val());
    setSize($("#size").val());
    setWater($("#water").val());
    setShape($("#shape").val());
    setSunlight($("#sunlight").val());
    setLeaves($("#leaves").prop("checked"));

    toggleWireframe( $("#wireframe").prop("checked"));

    toggleLog( $("#log").prop("checked"));


    setAutoRestart($("#auto").prop("checked"));

    toggleRandom( $("#random").prop("checked"));
    
    $("#zoom").val(scale);
    $("#zoomLabel").html(scale+"x");
    
   



}

function toggleLog(val)
{
    logActive = val;
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

