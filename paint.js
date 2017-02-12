/* WebGL Coordinates - not physical coordinates */
var mousex = 0;
var mousey = 0;
/* Array of DEFINITELY DRAWN shapes */
var shapes = [];

/* Current user */
var current = {
	/* Current shape */ 
	"shape" : Triangle,
	/* Fill or outline */
	"filled" : true,
	/* For n-sided polygons only */
	"sides" : 5,
	/* Fill/outline color */
	"color" : new Color(1,0,0),

	/* Are we drawing? */
	"draw_mode": false,
	"triangle_mode": false,

	"origin_x" : 0,
	"origin_y" : 0

}
// bc - bounding client
var bc = canvas.getBoundingClientRect();

/* Clear and redraw */
function redrawCanvas(){
	gl.clearColor(0,0,0,1);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	for(let shape of shapes){
		shape.draw();
	}
}

/* Okay, might as well do that once before anything else */
redrawCanvas();

/* Look for clicks */
canvas.addEventListener('click', function(e){
	if(current.draw_mode){
		// BECAUSE TRIANGLES ARE A BITCH AND A HALF THEY NEED THEIR OWN LOGIC
		if(current.shape === Triangle){
			if(!current.triangle_mode){
				console.log("go go tri-an-angle");
				current.triangle_mode = true;
				current.triangle_point = [mousex, mousey]
			}else{
				current.draw_mode = false;
				current.triangle_mode = false;
				console.log("Turned off a la Triangle");
				shapes.push(new current.shape(current.origin_x, current.origin_y, current.triangle_point[0], current.triangle_point[1],current.color, current.filled, [mousex, mousey]));
				redrawCanvas();
			}
		}
		else{
		/* Turn draw mode off and draw shape */
		current.draw_mode = false;
		console.log("Turned off");
		shapes.push(new current.shape(current.origin_x, current.origin_y,mousex, mousey, current.color, current.filled, current.sides)); 
		redrawCanvas();
		}
	}else{

		/* Turn draw mode on and record origin */
		triangle_mode = false;
		current.origin_x = (e.offsetX / canvas.clientWidth)*2 - 1
		current.origin_y = (1 - (e.offsetY / canvas.clientHeight))*2 -1
		current.draw_mode = true;
		console.log("Turned on");
	}
});
/* Cancel upon right click */
canvas.addEventListener("contextmenu", function(e){
	e.preventDefault();
	triangle_mode = false;
	current.draw_mode = false;
	redrawCanvas();
});
/* Look for moves if drawing */
canvas.addEventListener("mousemove", function(e){
	if(current.draw_mode){
		mousex = (e.offsetX / canvas.clientWidth) * 2 -1
		mousey = (1 - (e.offsetY / canvas.clientHeight))*2 - 1
		redrawCanvas();
		if(current.triangle_mode){
			(new current.shape(current.origin_x, current.origin_y,current.triangle_point[0], current.triangle_point[1],
				current.color, current.filled, [mousex, mousey])).draw();
		}else{
		(new current.shape(current.origin_x, current.origin_y,
			mousex, mousey, current.color, current.filled, [mousex, mousey])).draw();
	}
	}

}
);
