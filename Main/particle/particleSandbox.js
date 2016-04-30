var opt = function()
{
    this.colourSliderRed = 50;
    this.colourSliderGreen = 50;
    this.colourSliderBlue = 50;
    this.effectDurationSlider = 100;
    this.particleSizeSlider = 1;
    this.maxNumParticlesSlider = 200;
    this.mouseX = 0;
    this.mouseY = 0;
    this.particleLifespanSlider = 100;
    this.particleSpawnRateSlider = 5;
    this.type = "burst";
    this.trailWidthSlider = 1;

    this.getAll = function()
    {
        this.getcolourSliderRed();
        this.getcolourSliderGreen();
        this.getcolourSliderBlue();
        this.geteffectDurationSlider();
        this.getparticleSizeSlider();
        this.getmaxNumParticlesSlider();
        this.getmouseX();
        this.getmouseY();
        this.getparticleLifespanSlider();
        this.getparticleSpawnRateSlider();
        this.gettype();
        this.gettrailWidthSlider();
    }

    this.getcolourSliderRed = function()
    {
        this.colourSliderRed = document.getElementById("red").value;
    }
    this.getcolourSliderGreen = function()
    {
        this.colourSliderGreen = document.getElementById("green").value;
    }
    this.getcolourSliderBlue = function()
    {
        this.colourSliderBlue = document.getElementById("blue").value;
    }
    this.geteffectDurationSlider = function()
    {
        this.effectDurationSlider = document.getElementById("duration").value;
    }
    this.getparticleSizeSlider = function()
    {
        this.particleSizeSlider = document.getElementById("size").value;
    }
    this.getmaxNumParticlesSlider = function()
    {
        this.maxNumParticlesSlider = document.getElementById("number").value;
    }
    this.getmouseX = function()
    {
        this.mouseX = mouseX;
    }
    this.getmouseY = function()
    {
        this.mouseY = mouseY;
    }
    this.getparticleLifespanSlider = function()
    {
        this.particleLifespanSlider = document.getElementById("lifespan").value;
    }
    this.getparticleSpawnRateSlider = function()
    {
        this.articleSpawnRateSlider = document.getElementById("spawnRate").value;
    }
    this.gettype = function()
    {
        var radio = $("input[name=type]");
        
        for(rad in radio)
        {
            if(radio[rad].checked)
            {
                this.type = radio[rad].value;
            }
        }
        
    }
    this.gettrailWidthSlider = function()
    {
        this.trailWidthSlider = document.getElementById("spread").value;
    }


}

window.addEventListener("mousedown", createParticleEffect);
var particleEngine;
var loopTimer;
var optionsObj;


    resetGame();


function resetGame()
{
    particleEngine = new particleEffectComponant();
    particleEngine.construct(canvas,canvasContext,FRAMES_PER_SECOND);
    loopTimer = setInterval(mainLoop,SECOND_IN_MILISECONDS/FRAMES_PER_SECOND);
    optionsObj = new opt();


    setRed(50);
    setGreen(50);
    setBlue(50);
    setDuration(100);
    setSize(1);
    setNumber(200);
    setLifespan(100);
    setSpawnRate(5);
    setSpread(1);
}


function createParticleEffect(event)
{
    console.log("hello");
    particleEngine.createParticleEffect(optionsObj.colourSliderRed,
                                           optionsObj.colourSliderGreen,
                                           optionsObj.colourSliderBlue, 
                                           optionsObj.effectDurationSlider, 
                                           optionsObj.particleSizeSlider,
                                           optionsObj.maxNumParticlesSlider,
                                           event.clientX,
                                           event.clientY,
                                           optionsObj.particleLifespanSlider,
                                           optionsObj.particleSpawnRateSlider,
                                           optionsObj.type,
                                           optionsObj.trailWidthSlider);

    mouseX = event.clientX;
    mouseY = event.clientY;
}

function mainLoop()
{
    drawEverything();
    updateEverything;
}

function drawEverything()
{
    drawBackground();
    particleEngine.drawEverything();
}

function updateEverything()
{
    particleEngine.updateEverything();
} 


function clearSim()
{
    particleEngine = null;
    clearInterval(loopTimer);
    optionsObj = null;
}


function setRed(value)
{
    optionsObj.colourSliderRed = value;
    document.getElementById("redLabel").innerHTML = value;
}
function setGreen(value)
{
    optionsObj.colourSliderGreen = value;
    document.getElementById("greenLabel").innerHTML = value;
}
function setBlue(value)
{
    optionsObj.colourSliderBlue = value;
    document.getElementById("blueLabel").innerHTML = value;
}
function setDuration(value)
{
    optionsObj.effectDurationSlider = value;
    document.getElementById("durationLabel").innerHTML = value;
}
function setSize(value)
{
    optionsObj.particleSizeSlider = value;
    document.getElementById("sizeLabel").innerHTML = value;
}
function setNumber(value)
{
    optionsObj.maxNumParticlesSlider = value;
    document.getElementById("numberLabel").innerHTML = value;
}
function setLifespan(value)
{
    optionsObj.particleLifespanSlider = value;
    document.getElementById("lifespanLabel").innerHTML = value;
}
function setSpawnRate(value)
{
    optionsObj.particleSpawnRateSlider = value;
    document.getElementById("rateLabel").innerHTML = value;
}
function setType(value)
{
    optionsObj.type = value; 
}
function setSpread(value)
{
    optionsObj.trailWidthSlider = document.getElementById("spread").value;
    document.getElementById("spreadLabel").innerHTML = value;
}


function drawBackground()
{
    (function() {

        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', resizeCanvas, false);
        
        function resizeCanvas() {

               
                
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - (window.innerHeight * 0.05);
                
                
                
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
