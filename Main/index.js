var canvas = document.getElementById('myCanvas');
var canvasContext = canvas.getContext('2d');
var FRAMES_PER_SECOND = 30;
var SECOND_IN_MILISECONDS = 1000;
var Y_THRESHOLD = canvas.height;
var X_THRESHOLD = canvas.width;

var swarmControls = "Speed:<div id='speedLabel' style='display:inline;'></div><br/> <input type='range' id='speed' value=0.1 min=0 max=1 step=0.05 oninput='setSpeed(value)'/><br/><br/> Friction:<div id='frictionLabel' style='display:inline;'></div><br/> <input type='range' id='friction' name='friction' value='0.01' min='0' max='0.5' step='0.01' oninput='setFriction(value)'/><br/><br/> Trail Length:<div id='trailLabel' style='display:inline;'></div><br/> <input type='range' id='trail' name='trail' value=200 min=10 max=500 oninput='setTrail(value)'/><br/><br/> Number Of Particles:<div id='amountLabel' style='display:inline;'></div><br/> <input type='range' id='numberOf' name='numberOf' value=10 min=1 max=50 oninput='setNumberOfBodies(value)'/><br/><br/> <input type='button' value='Reset Particles' onclick='resetBodies()'/><br/><br/><br/> <input type='checkbox' id='collisionCheckbox' onchange='toggleCollision(checked)'/>Boundry Collision<br/> <input type='checkbox' id='followMouse' onchange='toggleFollowMouse(checked)'/>Follow Mouse"
var cultureControls = "<select onchange='setColour(value)' id='colourSelect'> <option value='blue'>Blue</option> <option value='red'>Red</option> <option value='green'>Green</option> </select><br/><br/>  <select onchange='changeType(value)' id='modeSelect'> <option value='normal'>Normal</option> <option value='domination'>Domination</option> </select><br/><br/> <input type='button' value='Pause' id='pauseButton'/> <input type='button' value='Clear' id='clearButton' onclick='clearNodes()'/><br/><br/> <input type='checkbox' name='showIds' value='show' onchange='toggleIds(checked)'/>Show IDs <input type='range' name='speed' value=1 min=1 max=10 onchange='setSpeed(value)'/><br/><br/>Speed:<div id='speedLabel' style='display:inline;'></div>"

function load()
{
	document.getElementById("script").innerHTML = '';
	var tag = document.createElement("script");
	tag.src = "swarm/nBody.js";
	document.getElementById("script").appendChild(tag);
	nbodySetup();
}
function changeSim(value)
{
	clearSim();
	if(value == "swarm")
	{

		document.getElementById("menuItems").innerHTML = swarmControls;
		document.getElementById("script").innerHTML = '';
		var tag = document.createElement("script");
		tag.src = "swarm/nBody.js";
		document.getElementById("script").appendChild(tag);
		nbodySetup();
		resetGame();

		
	}
	else if(value == "culture")
	{
		document.getElementById("menuItems").innerHTML = cultureControls;
		document.getElementById("script").innerHTML = '';
		var tag = document.createElement("script");
		tag.src = "culture/CultureShock.js";
		document.getElementById("script").appendChild(tag);
		resetGame();
	}
	else if(value == "particle")
	{
		
	}
}


function closeMenu()
{
	$("#simOption").hide();
	$("#menu-bar").hide();
	$("#menuItems").hide();
	$("#menu-bar").css("background-color", "rgba(0,0,0,0)");
	$("#arrow").attr("onclick", "openMenu()");
	$("#arrowText").html("Options");
}

function openMenu()
{
	$("#simOption").show();
	$("#menuItems").show();
	$("#menu-bar").show();
	$("#menu-bar").css("background-color", "rgba(30,30,30,1)");
	$("#arrow").attr("onclick", "closeMenu()");
	$("#arrowText").html("Close");
}

