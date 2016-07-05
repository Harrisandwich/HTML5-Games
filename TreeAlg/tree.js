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
var SPAWN_MAX = 2;
var MAX_NODES = 50;
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext('2d');
var animationTimer; 


var sunlight = 1;
var water = 1;

var tree;





class Tree
{
    constructor()
    {
        this.growthTimer = 0.0;
        this.spawnTimer = 0.0;
        //array of nodes
        this.nodes = [];
        this.root = new Node("Root",canvas.width/2,canvas.height,1,null, 0,0,{ x: 0, y: 0});
        this.apicalMeristem = new Node("ApicalMeristem",canvas.width/2,canvas.height - 1,1,this.root,STARTING_GROWTH_RATE, { x: 0, y: -1});
        //spawn the first true node
        var children = this.apicalMeristem.spawnChildren();
        this.nodes.push(children[0]);

    }
    spawn()
    {
        var newNodes = []
        
        if(this.nodes.length < MAX_NODES)
        {
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
        else
        {
            for(var n in this.nodes)
            {
                this.nodes[n].grow();
            }
        }
    }
    grow()
    {
        this.growthTimer++;
        this.spawnTimer++;
        if(this.growthTimer > SEC_IN_MILISECONDS/FPS)
        {
            this.apicalMeristem.size += 0.2;
            if(this.nodes.length < MAX_NODES)
            {
                for(var n in this.nodes)
                {
                    this.nodes[n].grow();
                     
                }
            }

            this.growthTimer = 0;
        }

        if(this.spawnTimer > (SEC_IN_MILISECONDS/FPS)*5)
        {
            this.spawn();

            this.spawnTimer = 0;
        }

    }

    draw()
    {
        //draw lines between nodes 
        drawTrunk(this.nodes[0],this.apicalMeristem);
        for(var n in this.nodes)
        {
            
            drawLine(this.nodes[n],this.nodes[n].parent);
            drawCircle(this.nodes[n]);
        }

    }

}

class Node
{
    constructor(id,x,y,size,parent, growthRate,direction,slope)
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
        dis -= this.size;
        dis -= this.parent.size;
        return dis
    }

    getCurrentSlope(x1,y1,x2,y2)
    {
        //Find the slope of the line 
        var slope  = {
            x: 0,
            y: 0
        };
        var slopeX = (x1 - x2);
        var slopeY = (y1 - y2);

        if(slopeX < 0)
        {
            slopeX *= -1;
        } 

        if(slopeY < 0)
        {
            slopeY *= -1;
        } 

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
            
            if(temp > 1)
            {
                factor++;
            }
            else
            {
                if(factor > 1)
                {
                    factor--;
                }
                order.first.value = order.first.value/factor;
                isDivisible = false;

            }
        }

        if(factor > 1)
        {
            order.second.value = order.second.value/factor;
        }
        else
        {
            order.second.value = 1;
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

    //this might be taking it too far. Ill come back to this later
    getGrowthPotential()
    {

        var potential = 0.0;
        var resourceAvailabilityWeighting = (water + sunlight)/2;
        if(this.id == "Bud")
        {

            /*
                distancce from meristem
            */
            

            //var distanceThreshold = 4;
            //var distance = this.getDistanceFromMeristem().distance/distanceThreshold;
            var distance = 0;
            if(this.getDistanceFromMeristem().distance > 1)
            {
                distance = 1;
            }
            else
            {
                distance = 0;
            }

            potential =  resourceAvailabilityWeighting * distance;
        }
        else
        {
            /*
                - distance from parent
                - size vs parent size
            */
            /*var distanceThreshold;
            if(this.parent.id == "ApicalMeristem")
            {
                distanceThreshold = (canvas.height/3);
            }
            else
            {
                distanceThreshold = this.parent.getDistanceFromParent() * 0.99;
            }
            

            var distance = this.getDistanceFromParent()/distanceThreshold;*/
            var distance = 0;
            if(this.getDistanceFromParent() > 25)
            {
                distance = 1;
            }
            else
            {
                distance = 0;
            }
           
            potential = distance * resourceAvailabilityWeighting;

        }

        

        return potential;
    }
    grow()
    {

        //I should grow based on slope

        if(this.slope.x != 0)
        {
            this.growthX = this.parent.growthX + (this.growthRate * this.slope.x) * this.direction;
        }

        this.growthY = this.parent.growthY + (this.slope.y * this.growthRate);

        this.x += this.growthX;
        this.y -= this.growthY;

        //change this to organic value
        this.size += 0.2;
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
        this.id = "Branch";
        
        var side;

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

            //This doesnt work
            
            if(i == 0)
            {
                
                x = vects[0].x;
                y = vects[0].y;
                
            }
            else
            {
                x = vects[2].x;
                y = vects[2].y;
               
            }

            slope = this.getCurrentSlope(x,y,this.x,this.y);
            //set x and y to slop + growth rate
            //get x relative to this.x. Set direction
            //set size to the same is the current size (maybe a touch smaller?)

            if(x > this.x)
            {
                direction = 1;
                
            }
            else
            {
                direction = -1;
               
            }

            
            size = this.size * 0.2;



            var newNode = new Node(id,x,y,size,this,this.growthRate,direction,slope);
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
        var x;
        var y;
        var size;
        var direction;

        var slope = {
            x: 0,
            y: 0
        };

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

        //get the direction on the x axis
        

        var newNode = new Node(id,x,y,size,this,this.growthRate,direction,slope);
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
            children = this.extend();
        }
        
        return children
    }
}

start();

function start()
{
    drawBackground();
    tree = new Tree();

    if(animationTimer != undefined || animationTimer != null)
    {
        clearInterval(animationTimer);
        animationTimer = setInterval(mainLoop, SEC_IN_MILISECONDS/FPS);
    }
    else
    {
        animationTimer
        animationTimer = setInterval(mainLoop, SEC_IN_MILISECONDS/FPS);
    }

    
}
function mainLoop()
{
    
    drawBackground();
    tree.grow();
    tree.draw();
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

function drawTrunk(node1,node2){


    var vectors = getPolygonVerts(node1,node2);

    context.beginPath();
    context.moveTo(node1.x,node1.y);
    context.lineTo(node2.x,node2.y);
    context.lineWidth = 3;
    context.strokeStyle = "white";
    context.stroke();


    context.beginPath();
    context.moveTo(vectors[0].x,vectors[0].y);
    context.lineTo(vectors[1].x,vectors[1].y);
    context.lineWidth = 3;
    context.strokeStyle = "blue";
    context.stroke();

    context.beginPath();
    context.moveTo(vectors[2].x,vectors[2].y);
    context.lineTo(vectors[3].x,vectors[3].y);
    context.lineWidth = 3;
    context.strokeStyle = "blue";
    context.stroke();

    context.beginPath();
    context.moveTo(node1.x - node1.size, node1.y - node1.size/2);
    context.lineTo(node1.x - node1.size, node1.y);
    context.lineWidth = 3;
    context.strokeStyle = "blue";
    context.stroke();

    context.beginPath();
    context.moveTo(node1.x + node1.size, node1.y - node1.size/2);
    context.lineTo(node1.x + node1.size, node1.y);
    context.lineWidth = 3;
    context.strokeStyle = "blue";
    context.stroke();
}
function drawLine(node1,node2)
{   
    var vectors = getPolygonVerts(node1,node2);


   /* var topRight = 0;
    var topLeft = 0;
    var bottomLeft = 0;
    var bottomRight = 0;

    var checkSums = [];
    var temp =0.0;
    for(var v in vectors)
    {
        temp += vectors[v].x;
        temp += vectors[v].y;
        checkSums.push(temp);
    }

    

    for(var sum in checkSums)
    {
        if(checkSums[sum] < checkSums[topRight])
        {
            topRight = sum;
        }
        else if(checkSums[sum] > checkSums[bottomLeft])
        {
            bottomLeft = sum;
        }
        
    }*/
        
    
    
    /*context.fillStyle = '#f00';
    context.beginPath();
    context.moveTo(vectors[0].x, vectors[0].y);
    context.lineTo(vectors[2].x, vectors[2].y);
    context.lineTo(vectors[3].x, vectors[3].y);
    context.lineTo(vectors[1].x, vectors[1].y);
    context.closePath();
    context.fill();*/

    

    context.beginPath();
    context.moveTo(node1.x,node1.y);
    context.lineTo(node2.x,node2.y);
    context.lineWidth = 3;
    context.strokeStyle = "white";
    context.stroke();

    context.beginPath();
    context.moveTo(vectors[0].x,vectors[0].y);
    context.lineTo(vectors[1].x,vectors[1].y);
    context.lineWidth = 3;
    context.strokeStyle = "blue";
    context.stroke();

    context.beginPath();
    context.moveTo(vectors[2].x,vectors[2].y);
    context.lineTo(vectors[3].x,vectors[3].y);
    context.lineWidth = 3;
    context.strokeStyle = "blue";
    context.stroke();

}

function drawCircle(node1)
{
    var color = "";
    if(node1.id == "Bud")
    {
        color = "green";
    }
    else if (node1.id == "Meristem")
    {
        color = "red";
    }
    else
    {
        color = "blue"
    }
    context.strokeStyle = color;
    context.fillStyle = "red";
    context.beginPath();
    
    //draw arc
    context.arc(node1.x,node1.y,node1.size,0,Math.PI*2,true)
    context.stroke();

}

function getPolygonVerts(node1,node2)
{
    var dx = node1.x - node2.x;
    var dy = node1.y - node2.y;

    var newX = -dy;
    var newY = dx;

    var magnitude = Math.sqrt(Math.pow(newX,2) + Math.pow(newY,2));

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

    var vectors = [];
    vectors.push(vector1);
    vectors.push(vector2);
    vectors.push(vector3);
    vectors.push(vector4);

    return vectors
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

