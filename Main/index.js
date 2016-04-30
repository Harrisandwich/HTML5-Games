var canvas = document.getElementById('myCanvas');
var canvasContext = canvas.getContext('2d');
var FRAMES_PER_SECOND = 30;
var SECOND_IN_MILISECONDS = 1000;
var Y_THRESHOLD = canvas.height;
var X_THRESHOLD = canvas.width;

var swarmControls = "Speed:<div id='speedLabel' style='display:inline;'></div><br/> <input type='range' id='speed' value=0.1 min=0 max=1 step=0.05 oninput='setSpeed(value)'/><br/><br/> Friction:<div id='frictionLabel' style='display:inline;'></div><br/> <input type='range' id='friction' name='friction' value='0.01' min='0' max='0.5' step='0.01' oninput='setFriction(value)'/><br/><br/> Trail Length:<div id='trailLabel' style='display:inline;'></div><br/> <input type='range' id='trail' name='trail' value=200 min=10 max=500 oninput='setTrail(value)'/><br/><br/> Number Of Particles:<div id='amountLabel' style='display:inline;'></div><br/> <input type='range' id='numberOf' name='numberOf' value=10 min=1 max=50 oninput='setNumberOfBodies(value)'/><br/><br/> <input type='button' value='Reset Particles' onclick='resetBodies()'/><br/><br/><br/> <input type='checkbox' id='collisionCheckbox' onchange='toggleCollision(checked)'/>Boundry Collision<br/> <input type='checkbox' id='followMouse' onchange='toggleFollowMouse(checked)'/>Follow Mouse"
var cultureControls = "<select onchange='setColour(value)' id='colourSelect'> <option value='blue'>Blue</option> <option value='red'>Red</option> <option value='green'>Green</option> </select><br/><br/>  <select onchange='changeType(value)' id='modeSelect'> <option value='normal'>Normal</option> <option value='domination'>Domination</option> </select><br/><br/> <input type='button' value='Pause' id='pauseButton'/> <input type='button' value='Clear' id='clearButton' onclick='clearNodes()'/><br/><br/> <input type='checkbox' name='showIds' value='show' onchange='toggleIds(checked)'/>Show IDs <input type='range' name='speed' value=1 min=1 max=10 onchange='setSpeed(value)'/><br/><br/>Speed:<div id='speedLabel' style='display:inline;'></div>"
var particleControls = "<table > <tr> <td>Red:<div id='redLabel' style='display:inline;'></div></td> <td><input type='range' id='red' value=50 min=1 max=255  oninput='setRed(value)'/></td> </tr> <tr> <td>Green:<div id='greenLabel' style='display:inline;'></div></td> <td><input type='range' id='green' value=50 min=1 max=255 oninput='setGreen(value)'/></td> </tr> <tr> <td>Blue:<div id='blueLabel' style='display:inline;'></div></td> <td><input type='range' id='blue' value=50 min=1 max=255 oninput='setBlue(value)'/></td> </tr> <tr> <td>Effect Duration:<div id='durationLabel' style='display:inline;'></div></td> <td><input type='range' id='duration' value=50 min=1 max=100 oninput='setDuration(value)'/></td> </tr> <tr> <td>Particle Size:<div id='sizeLabel' style='display:inline;'></div></td> <td><input type='range' id='size' value=1 min=1 max=10 oninput='setSize(value)'/></td> </tr> <tr> <td>Number of Particles:<div id='numberLabel' style='display:inline;'></div></td> <td><input type='range' id='number' value=200 min=10 max=500 oninput='setNumber(value)'/></td> </tr> <tr> <td>Particle Lifespan:<div id='lifespanLabel' style='display:inline;'></div></td> <td><input type='range' id='lifespan' value=100 min=2 max=200 oninput='setLifespan(value)'/></td> </tr> <tr> <td>Particle Spawn Rate:<div id='rateLabel' style='display:inline;'></div></td> <td><input type='range' id='spawnRate' value=5 min=1 max=10 oninput='setSpawnRate(value)'/></td> </tr> <tr> <td>Trail Spread Width:<div id='spreadLabel' style='display:inline;'></div></td> <td><input type='range' id='spread' value=1 min=1 max=20 oninput='setSpread(value)'/></td> </tr> </table> <br/> Type:<div id='trailLabel' style='display:inline;'></div><br/> <input type='radio' name='type' value='burst' onchange='setType(value)' checked> Burst<br/> <input type='radio' name='type' value='trail' onchange='setType(value)'> Trail<br/> <input type='radio' name='type' value='spout' onchange='setType(value)'> Spout<br/><br/> <input type='button' id='clear' value='Clear'/>";

function load()
{
	changeSim("swarm");
}
function changeSim(value)
{
	clearSim();
	console.log(value);
	if(value == "swarm")
	{

		document.getElementById("menuItems").innerHTML = swarmControls;
		$("#menu-bar").css("width", "200px");
		document.getElementById("script").innerHTML = '';
		var tag = document.createElement("script");
		tag.src = "swarm/nBody.js";
		document.getElementById("script").appendChild(tag);
		nbodySetup();
	}
	else if(value == "culture")
	{
		document.getElementById("menuItems").innerHTML = cultureControls;
		$("#menu-bar").css("width", "200px");
		document.getElementById("script").innerHTML = '';
		var tag = document.createElement("script");
		tag.src = "culture/CultureShock.js";
		document.getElementById("script").appendChild(tag);

	}
	else if(value == "particle")
	{
		document.getElementById("menuItems").innerHTML = particleControls;
		$("#menu-bar").css("width", "300px");
		document.getElementById("script").innerHTML = '';
		var tag = document.createElement("script");
		tag.src = "particle/particleSandbox.js";
		document.getElementById("script").appendChild(tag);
		
	}
}


function closeMenu()
{
	$("#menu-bar").hide();
	$("#menuItems").hide();
	$("#menu-bar").css("background-color", "rgba(0,0,0,0)");
	$("#arrow").attr("onclick", "openMenu()");
	$("#arrowText").html("Options");
}

function openMenu()
{
	$("#menuItems").show();
	$("#menu-bar").show();
	$("#menu-bar").css("background-color", "rgba(30,30,30,1)");
	$("#arrow").attr("onclick", "closeMenu()");
	$("#arrowText").html("Close");
}



$(document).ready(function()
{
	console.log("test");
});
