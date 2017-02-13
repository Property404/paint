/* WebGL mouse Coordinates - not physical coordinates */
var mousex = 0;
var mousey = 0;

/* Array of DEFINITELY DRAWN shapes */
var shapes = [];

/* Current state of things */
var current = {
    /* Current shape */
    "shape": Triangle,
    /* Fill or outline */
    "filled": true,
    "focus": -1,
    /* For n-sided polygons only */
    "sides": 5,
    /* Fill/outline color */
    "color": new Color(1, 0, 0),
    "bgcolor": new Color(0, 0, 0),

    /* Are we drawing? */
    "draw_mode": false,
    "triangle_mode": false,
    "pen_coordinates" : [],

    "origin_x": 0,
    "origin_y": 0

}
// bc - bounding client
var bc = canvas.getBoundingClientRect();

/* Clear and redraw */
function redrawCanvas() {
    gl.clearColor(current.bgcolor.red, current.bgcolor.green, current.bgcolor.blue, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (let shape of shapes) {
        shape.draw();
    }
}

/* Okay, might as well do that once before anything else */
redrawCanvas();
/* And do the other setups*/
current.color = hexToRgb(document.getElementById("color").value);
current.bgcolor = hexToRgb(document.getElementById("bgcolor").value);
setShape(document.getElementById("shape").value);
current.filled = document.getElementById("fill").checked;
current.sides = document.getElementById("sides").value;
document.onkeydown = checkKey;

/* Look for clicks */
canvas.addEventListener('click', function(e) {
    /* Change color before drawing anything*/
    current.color = hexToRgb(document.getElementById("color").value);
	if (current.draw_mode) {
        // BECAUSE TRIANGLES ARE A BITCH AND A HALF THEY NEED THEIR OWN LOGIC
        if (current.shape === Triangle) {
            // Second click has no happened yet
            if (!current.triangle_mode) {
                current.triangle_mode = true;
                current.triangle_point = [mousex, mousey]
            } else {
                // Second clck has happened :O
                current.draw_mode = false;
                current.triangle_mode = false;
                // Push a triangle in a complicated fashion
                shapes.push(new current.shape(current.origin_x, current.origin_y, current.triangle_point[0], current.triangle_point[1], current.color, current.filled, [mousex, mousey]));
                redrawCanvas();
            }
	}else if(current.shape === Pen){
		//Ugh, custom polygons
		current.pen_coordinates.push([mousex, mousey]);
            // Normal, god fearing shapes
        } else {
            /* Turn draw mode off and draw shape */
            current.draw_mode = false;
            console.log("Turned off");
            shapes.push(new current.shape(current.origin_x, current.origin_y, mousex, mousey, current.color, current.filled, current.sides));
            redrawCanvas();
        }
    } else {

        /* Turn draw mode on and record origin */
        triangle_mode = false;
	current.pen_coordinates = []
        current.origin_x = (e.offsetX / canvas.clientWidth) * 2 - 1
        current.origin_y = (1 - (e.offsetY / canvas.clientHeight)) * 2 - 1
        current.draw_mode = true;
    }
    current.focus = shapes.length - 1;
});
/* Cancel upon right click */
canvas.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    triangle_mode = false;
    current.draw_mode = false;
    redrawCanvas();
});
/* Look for moves if drawing 
 * then redraw*/
canvas.addEventListener("mousemove", function(e) {
    if (current.draw_mode) {
        mousex = (e.offsetX / canvas.clientWidth) * 2 - 1
        mousey = (1 - (e.offsetY / canvas.clientHeight)) * 2 - 1
        redrawCanvas();
        /* Cause triangles are bitches */
    if (current.triangle_mode) {
            (new current.shape(current.origin_x, current.origin_y, current.triangle_point[0], current.triangle_point[1],
                current.color, current.filled, [mousex, mousey])).draw();
        } else {
            /* Normal, wholesome, god-fearing shapes */
		if(current.shape===Pen){
		//	console.log(current.pen_coordinates);
		}
            (new current.shape(current.origin_x, current.origin_y,
                mousex, mousey, current.color, current.filled, current.shape == Pen?
		    current.pen_coordinates :current.shape == Polygon ? current.sides : [mousex, mousey])).draw();
        }
    }

});

/* Toolbox code */
function hexToRgb(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return new Color(((c >> 16) & 255) / 255.0, ((c >> 8) & 255) / 255.0, (c & 255) / 255.0)
    }
    throw new Error('Bad Hex');
}

// Upon an unrecognized shape, draw a line for some reason
function setShape(shape) {
    current.shape = shape == "triangle" ? Triangle :
        shape == "line" ? Line :
        shape == "rectangle" ? Rectangle :
        shape == "circle" ? Circle :
        shape == "polygon" ? Polygon :
	shape == "pen" ? Pen :
        (console.log("NO SUCH SHAPE"), Line);
}
document.getElementById("shape").addEventListener("click", function(e) {
    shape = document.getElementById("shape").value
    setShape(shape);
});
/* Polygon sides */
document.getElementById("sides").addEventListener("click", function(e) {
    current.sides = document.getElementById("sides").value;
});
/* Fill or no fill? */
document.getElementById("fill").addEventListener("click", function(e) {
    current.filled = document.getElementById("fill").checked;
});
/* Clear */
document.getElementById("clear").addEventListener("click", function(e) {
    shapes = [];
    current.focus = -1
    redrawCanvas();
});
// Pop last shape
document.getElementById("pop").addEventListener("click", function(e) {
    shapes.pop();
    current.focus = shapes.length - 1
    redrawCanvas();
});

function changeBackground() {
    current.bgcolor = hexToRgb(document.getElementById("bgcolor").value)
    redrawCanvas();
}

// Arrow key stuff
function checkKey(e) {
    e = e || window.event;
    if(e.keyCode<=40){
    e.preventDefault();
    }
    if (current.focus != -1) {
        current.focus %= shapes.length;
        let speed = .01;
	/* Arrow keys control movement */
        if (e.keyCode == '38' /*Up arrow*/ ) {
            shapes[current.focus].y1 += speed;
            shapes[current.focus].y2 += speed;
        } else if(e.keyCode == '40' /* Down arrow */ ) {
            shapes[current.focus].y1 -= .01;
            shapes[current.focus].y2 -= .01;
        } else if(e.keyCode == '37'/*Left arrow*/) {
            shapes[current.focus].x1 -= speed;
            shapes[current.focus].x2 -= speed;
        } else if (e.keyCode == '39'/*Right arrow*/){
	    shapes[current.focus].x1 += speed;
	    shapes[current.focus].x2 += speed;
	} else if(e.keyCode== '9'/* Tab */) {
	    // Change focus to new shape
	    current.focus += 1;
	} else if(e.keyCode == '8'/* Delete */) {
	    // Delete shape
	    shapes.splice(current.focus, 1);
	} else if(e.keyCode ==  '16'/* Enter */){
	    // Change outline of shape
	    shapes[current.focus].outline = ! (shapes[current.focus].outline);
	} else if (e.keyCode == '32'){
		console.log("Hey");
		if(current.shape == Pen && current.draw_mode == true){
		console.log("What a wonderful kind of day");
		(new current.shape(current.origin_x, current.origin_y,
                mousex, mousey, current.color, current.filled, current.shape == Pen?
		    current.pen_coordinates :current.shape == Polygon ? current.sides : [mousex, mousey])).draw();
current.draw_mode = false;
		}
			
	}
        redrawCanvas();
    }

}
