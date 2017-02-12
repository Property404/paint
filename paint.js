/* Array of DEFINITELY DRAWN shapes */
var shapes = [];
var current = {
	/* Current shape */ 
	"shape" : Rectangle,
	/* Fill or outline */
	"filled" : false,
	/* For n-sided polygons only */
	"sides" : 5,
	/* Fill/outline color */
	"color" : new Color(1,0,0),

	/* Are we drawing? */
	"draw_mode": false,

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
		current.draw_mode = false;
		console.log("Turned off");
	}else{
		current.draw_mode = true;
		console.log("Turned on");
	}
});

/* Look for moves if drawing */
canvas.addEventListener("mousemove", function(e){
	if(current.draw_mode){
		console.log(e.clientX + "," + e.clientY);
		/*
		redrawCanvas();
		(new current.shape(current.origin_x, current.origin_y,
			(e.clientX)/(bc.right-bc.left), (e.clientY)/(-bc.bottom+bc.top), current.color, current.filled)).draw();
		*/
	}

}
);
