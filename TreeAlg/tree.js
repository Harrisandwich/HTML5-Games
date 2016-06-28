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
var FPS = 30;
var STARTING_GROWTH_RATE = 50;
var SPAWN_MAX = 3;

var canvas = document.getElementById("canvas");
var canvasContext = canvas.getCanvas('2d');
var animationTimer; 


var sunlight = 1;
var water = 1;

var tree;





class Tree()
{
    constructor()
    {
        //array of nodes
        this.nodes = [];
         //create base nodes
        this.root = new Node("Root",screenWidth/2,screenHeight,100,null, 0,0);
        this.trunk = new Node("Trunk",screenWidth/2,screenHeight,100,this.root, 0,STARTING_GROWTH_RATE);
        //spawn the first true node
        this.nodes.push(this.trunk.spawnChildren(1)[0]);
    }
    grow()
    {
        for(n in this.nodes)
        {
            this.nodes[n].grow();
            if(this.nodes[n].spawnCheck())
            {
                var newNodes = this.nodes[n].spawnChildren(SPAWN_MAX);
                for(node in newNodes)
                {
                    this.nodes.push(newNodes[node]);
                }
            }     
        }
    }

    draw()
    {
        //draw lines between nodes 

        for(n in this.nodes)
        {
            drawLine(this.nodes[n],this.nodes[n].parent);
        }

    }

}

class Node()
{
    constructor(id,x,y,size,parent, decayRate, growthRate,direction)
    {
        if(parent != null)
        {
            this.parent = parent; // the node that spawned this node
        }
        
        
        this.x = x;
        this.y = y;
        this.size = size;
        this.id = id;
        this.decayRate = decayRate; // the rate that this node shrinks 
        this.growthRate = growthRate;
        this.growthX = 0; // how far along the x axis the node moves 
        this.growthY = 0; // how far along the y axis the node moves
        this.hasChild = false;
        this.direction = direction;
        
        
    }

    getDistanceFromParent()
    {
        //get the dx and dy, calc distance (check code from games)
        var dx;
        var dy;

        dx = this.x  - this.parent.x;
        dy = this.y  - this.parent.y;
        
        var dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

        return dis
    }

    //this might be taking it too far. Ill come back to this later
    getGrowthPotential()
    {
        
        /*
            What is "Growth Potential"

            - Growth potential is a percentage (in the form of a decimal number less than 1) threshold that decides the likelihood of spawning nodes 
            - it is used like so: if(Math.random() < potential){spawn nodes}
            - it is decided based on:
                - current size vs the size of the parent
                - current distance from the parent
                - current resource availability NOTE: This is going to come later, I want it to act as weighting for size and distance 
                    - water out of 100 (or 1)
                    - sun out of 100 (or 1)

        */
        var potential = 0.0;

        var resourceAvailabilityWeighting = (water + sunlight)/2;

        var numberOfCycles = this.getDistanceFromParent()/this.growthRate;

        var numberOfCyclesLeft = this.size/this.decayRate;

        var totalCycles = numberOfCycles+numberOfCyclesLeft;

        //the greater the distance, the higher the score
        var healthScore = (1 - (numberOfCyclesLeft/totalCycles));

        //By dividing by the resourceAvailabilityWeighting rating the potential increases if the resourceAvailabilityWeighting rating decreases
        //this will stunt the growth of the tree as it is more likely to branch early than strech out and grow tall

        potential = healthScore*resourceAvailabilityWeighting;

        return potential
    }
    grow()
    {
        this.x += (this.growthRate + this.parent.growthX) * this.direction;
        this.y -= this.parent.growthY + this.growthRate;

        this.growthY = this.parent.growthY + this.growthRate;
        this.growthX = this.growthRate + this.parent.growthX;

        if(!this.hasChild)
            this.size -= this.decayRate;
    }

    spawnCheck()
    {
        //check if the node should spawn children
        if(!this.hasChild)
        {
            var roll = Math.random();
            if(roll < this.getGrowthPotential())
            {
                return true
            }
        }
        return false
    }
    spawnChildren(max)
    {
        //new nodes
        //get a partial (tight)circle around the node
        //choose how many nodes to generate
        //generate nodes
        //spawn children (3 max)
        //One child will be the next segment of the main branch 
        var numberToSpawn = Math.round((Math.random() * max) + 1);
        var children = [];

        //spawn Main trunk node
        var direction = 0;
        var sw = Math.round(Math.random());

        if(sw == 0)
        {
            sw = 0.1
            direction = -1;
        }
        else
        {
            sw = -0.1   
            direction = 1;    
        }

        var radius = this.size + this.growthRate;
        var angle = Math.random() * Math.PI * sw;
        var point = {
            x: Math.sin(angle) * -radius,
            y: Math.cos(angle) * -radius
        };


        var x = point.x;
        var y = point.y;
        var size = this.size * this.getGrowthPotential();
        var id = this.id * 100 + i;
        var decayRate = this.decayRate + this.getGrowthPotential();
        var growthRate = this.growthRate - this.getGrowthPotential();



        var newNode = new Node(this.id,x,y,size,this,decayRate,growthRate,direction);
        children.push(newNode);

        //spawn other nodes
        for(var i = 0; i < numberToSpawn; i++)
        {

            sw = Math.round(Math.random());

            if(sw == 0)
            {
                radius = (this.size + this.growthRate) * -1;
                angle = Math.random() * Math.PI * 0.3;
                this.direction = 1;
            }
            else
            {
                radius = (this.size + this.growthRate);
                angle = Math.random() * Math.PI * -0.3;     
                this.direction = -1;
            }

            
            point = {
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            };

            x = point.x;
            y = point.y;
            size = this.size - (this.size * this.getGrowthPotential());
            id = this.id * 100 + i;
            decayRate = this.decayRate + (this.decayRate * this.getGrowthPotential());
            growthRate = this.growthRate - (this.growthRate * this.getGrowthPotential());


            var newNode = new Node(this.id,x,y,size,this,decayRate,growthRate);
            children.push(newNode);
        }
        this.hasChild = true;
        return children
    }
}


function start()
{

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
    //get background code 
}


function drawLine(node1,node2,context)
{   
    var vectors = getPolygonVerts(node1,node2);
    context.fillStyle = '#f00';
    context.beginPath();
    context.moveTo(vectors[0].x, vectors[0].y);
    context.lineTo(vectors[1].x, vectors[1].y);
    context.lineTo(vectors[2].x, vectors[2].y);
    context.lineTo(vectors[3].x, vectors[3].y);
    context.closePath();
    context.fill();
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

