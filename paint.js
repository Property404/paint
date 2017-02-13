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
/* And do the other setups*/
current.color = hexToRgb(document.getElementById("color").value);
setShape(document.getElementById("shape").value);
current.filled = document.getElementById("fill").checked;
current.sides = document.getElementById("sides").value;

/* Look for clicks */
canvas.addEventListener('click', function(e){
		/* Change color */
		current.color = hexToRgb(document.getElementById("color").value);
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
/* Look for moves if drawing 
 * then redraw*/
canvas.addEventListener("mousemove", function(e){
	if(current.draw_mode){
		mousex = (e.offsetX / canvas.clientWidth) * 2 -1
		mousey = (1 - (e.offsetY / canvas.clientHeight))*2 - 1
		redrawCanvas();
		/* Cause triangles are bitches */
		if(current.triangle_mode){
			(new current.shape(current.origin_x, current.origin_y,current.triangle_point[0], current.triangle_point[1],
				current.color, current.filled, [mousex, mousey])).draw();
		}else{
		/* Normal, wholesome, god-fearing shapes */
		(new current.shape(current.origin_x, current.origin_y,
			mousex, mousey, current.color, current.filled, current.shape == Polygon ? current.sides : [mousex, mousey])).draw();
	}
	}

}
);

/* Toolbox code */
function hexToRgb(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
	return new Color(((c>>16)&255)/255.0, ((c>>8)&255)/255.0, (c&255)/255.0)
    }
    throw new Error('Bad Hex');
}
function setShape(shape){
	current.shape = shape=="triangle"?Triangle:
		shape=="line"?Line:
		shape=="rectangle"?Rectangle:
		shape=="circle"?Circle:
		shape=="polygon"?Polygon:
		(console.log("NO SUCH SHAPE"),Line);
}
document.getElementById("shape").addEventListener("click", function(e){
	shape = document.getElementById("shape").value
	setShape(shape);
});
/* Polygon sides */
document.getElementById("sides").addEventListener("click", function(e){
	current.sides = document.getElementById("sides").value;
});
/* Fill or no fill? */
document.getElementById("fill").addEventListener("click", function(e){
	current.filled = document.getElementById("fill").checked;
});
/* Clear */
document.getElementById("clear").addEventListener("click", function(e){
	shapes = [];
	redrawCanvas();
});
document.getElementById("undo").addEventListener("click",function(e){
	shapes.pop();
	redrawCanvas();
});
/*
document.getElementById("color").addEventListener("click",function(e){
	color = document.getElementById("color").value;
	
	current.color = hexToRgb(color);
	console.log(current.color.red + "," + current.color.green + "," + current.color.blue);
});
*/
