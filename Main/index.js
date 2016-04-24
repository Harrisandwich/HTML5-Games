var swarmMenu = "Speed:<div id='speedLabel' style='display:inline;'></div><br/><input type='range' id='speed' value=0.1 min=0 max=1 step=0.05 oninput='setSpeed(value)'/><br/><br/>Friction:<div id='frictionLabel' style='display:inline;'></div><br/><input type='range' id='friction' name='friction' value='0.01' min='0' max='0.5' step='0.01' oninput='setFriction(value)'/><br/><br/>Trail Length:<div id='trailLabel' style='display:inline;'></div><br/><input type='range' id='trail' name='trail' value=200 min=10 max=500 oninput='setTrail(value)'/><br/><br/>Number Of Particles:<div id='amountLabel' style='display:inline;'></div><br/><input type='range' id='numberOf' name='numberOf' value=10 min=1 max=50 oninput='setNumberOfBodies(value)'/><br/><br/><input type='button' value='Reset Particles' onclick='resetBodies()'/><br/><br/><br/><input type='checkbox' id='collisionCheckbox' onchange='toggleCollision(checked)'/>Boundry Collision<br/><input type='checkbox' id='followMouse' onchange='toggleFollowMouse(checked)'/>Follow Mouse<br/><br/><br/><h4>Current Sim:</h4><br/><select id='simChoose' onchange='changeSim(value)'><option value='swarm'>Swarm</option><option value='culture'>CultureShock</option><option value='swarm'>Particle Sandbox</option></select>";


var cultureMenu = "Colour:<br/><select onchange='setColour(value)' id='colourSelect'><option value='blue'>Blue</option><option value='red'>Red</option><option value='green'>Green</option></select><br/><br/>Screen Size:<br/><select onchange='changeScreen(value)' id='screenSelect'><option value='square'>Square</option><option value='full'>Full Screen</option></select><br/><br/>Game Type:<br/><select onchange='changeType(value)' id='modeSelect'><option value='normal'>Normal</option><option value='domination'>Domination</option></select><br/><br/><input type='button' value='Pause' id='pauseButton'/><br/><br/><input type='button' value='Clear' id='clearButton' onclick='clearNodes()'/><br/><br/><br/><input type='checkbox' name='showIds' value='show' onchange='toggleIds(checked)'/>Show IDs<br/><br/><input type='range' name='speed' value=1 min=1 max=10 onchange='setSpeed(value)'/><br/>Speed:<div id='speedLabel' style='display:inline;'></div><br/><br/><br/><h4>Current Sim:</h4><br/><select id='simChoose' onchange='changeSim(value)'><option value='swarm'>Swarm</option><option value='culture'>CultureShock</option><option value='swarm'>Particle Sandbox</option></select>";

$(document).ready(function(){
	hideAll();
	closeMenu();
	$("#swarmItems").show();
	nbodySetup();

});
var canvas = document.getElementById('myCanvas');
var canvasContext = canvas.getContext('2d');

var FRAMES_PER_SECOND = 30;
var SECOND_IN_MILISECONDS = 1000;
var Y_THRESHOLD = canvas.height;
var X_THRESHOLD = canvas.width;
function changeSim(value)
{
	clearAll();
	hideAll();
	if(value == "swarm")
	{
		
		$("#swarmItems").show();
		nbodySetup();
	}
	else if(value == "culture")
	{
		//set options
		
		$("#cultureItems").show();
		cultureSetup();
	}
	else if(value == "particle")
	{
		//$("#runningScript").attr("src", "../NBody/nbody.js");
	}
}

function hideAll()
{
	$("#swarmItems").hide(); 
	$("#cultureItems").hide();
}

function clearAll()
{
	clearSwarm();
	clearCulture();
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


