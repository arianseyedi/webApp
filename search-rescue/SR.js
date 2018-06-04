/*
* This is a search and rescue game. 
* Rescuer keeps moving within the window on linear paths
* looking for the target. Once the outer layer of the
* rescuer meets the borders of the target, the target is 
* fount and thus the game stops.
* 
* Author: Arian Seyedi
*/
var TARGET_SIZE = 16;
var startTime, intervalID;
var rescue, target, direction, radarRange, context, distTotarget;

/*
* Starter function. User input, set interval
* 
*/
function start(){
	
	var canvas = document.getElementById("searchArea"); // set canvas

	canvas.height = window.prompt("Search area height:", canvas.height);
	
	rescue = {x: canvas.width / 2, y: canvas.height / 2}; // rescue x & y

	target = {x: canvas.width * Math.random(), y: canvas.height * Math.random()};

	direction = {dx: 1, dy: 1}; // incremental move, the delta
	radarRange = document.getElementById("radar").value; // boundaries of radar
	
	context = canvas.getContext('2d');
	startTime = (new Date()).getTime();
	intervalID = setInterval(simulate, 9); // set speed

}

/*
* Simulate by clearing canvas, re-drawing the target and rescue, update
* the time and distance to target and check if rescue has found the target
*/
function simulate(){
	clear();
	drawTarget();
	drawRescue();
	updateProgress();
	if (found()) 
	{
		clearInterval(intervalID); 

	}
	else
	{
		if (xBoundary()) direction.dx = -direction.dx;
		if (yBoundary()) direction.dy = -direction.dy;
		rescue.x += direction.dx;
		rescue.y += direction.dy;
	}
}

/*
* clear the canvas
*/
function clear(){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

/*
* draw target
*/
function drawTarget(){
	context.beginPath();
	context.lineWidth = "4S";
	context.strokeStyle = "red";
	context.rect(target.x, target.y, TARGET_SIZE, TARGET_SIZE);
	context.stroke();
}

/*
* draw rescue
*/
function drawRescue(){
	context.beginPath();
	context.fillStyle = "#0000ff";
	context.arc(rescue.x, rescue.y, radarRange, 0, Math.PI * 2, true);
	context.closePath();
	context.fill();
}

/*
* true if rescue has hit the horizontal boundaries.
*/
function xBoundary(){
	return rescue.x+parseInt(radarRange) > context.canvas.width || rescue.x-parseInt(radarRange) < 0;
}

/*
* true if rescue has hit the vertical boundaries
*/
function yBoundary(){
	return  rescue.y+parseInt(radarRange) > context.canvas.height || rescue.y-parseInt(radarRange) < 0;
}

/*
* update progress: time and distance to target
*/
function updateProgress(){
	
	var elapsed = document.getElementById("elapsed");
	elapsed.innerHTML = Math.floor(((new Date()).getTime() - startTime) / 1000);

	var distTotarget = document.getElementById("distTotarget");
	distTotarget.innerHTML = Math.floor(toTarget());

}

/*
* find distance to target using distance between two points in 2D formula.
*/
function toTarget(){
	return Math.sqrt(Math.pow(Math.abs(target.x - rescue.x), 2) + Math.pow(Math.abs(target.y - rescue.y), 2));
}

/*
* check if found. On the right side of the target, the size of the
* target is taken into account so that rescue object will not bleed
* into the target.
*/
function found(){	
	// if on the right side of the target do
	if (rescue.x > (target.x + (TARGET_SIZE))){
		if (Math.floor(toTarget()) < ((parseInt(radarRange)))+ TARGET_SIZE)
			return true;
	}
	else if (Math.floor(toTarget()) < (parseInt(radarRange))) {
			return true;
	}
	return false;
}



