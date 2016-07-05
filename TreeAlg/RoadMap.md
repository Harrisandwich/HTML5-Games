# Tree Algorithm Road Map

<h3> Current Fixes and To-Dos for the Branching Simulation</h3>

<br/><br/>


<h5>To-Do:</h5>
<ul>
  <li><h5>Make node tracking more efficient</h5><p>The sheer number of nodes causes a lot of lag. I need to either track nodes differently, or decided to stop tracking certain nodes. Perhaps consolodate node linkages or allow the code to assume factors</p></li>
  <li><h5>Proper angled branch growth</h5><p>As of July 5th, the branches grow outward but not up. Later generations also will start to grow inward instead of outward. I think there is a lot of math I need to figure out to get this working the way i want.</p></li>
  <li><h5>Growth distribution</h5><p>I need a clean way of deciding when and where a node will sprout and extension or banches. Currently I hard code the distances in order to see results, but eventually I'll want it to work in a more mathmatical and organic way.</p></li>
  <li><h5>Zoom</h5><p>As the tree grows the screen should scale out to show more and more of the tree. I'm thinking a multiplier that gets applied to the size and coordinates. A simple multiplier would work fine for size, but for positioning ill need to try something else. </p></li>
</ul>
