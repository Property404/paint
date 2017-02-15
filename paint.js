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
    /* For basic-shapes only */
    "sides": 5,
    /* Fill/outline color */
    "color": new Color(1, 0, 0),
    "bgcolor": new Color(0, 0, 0),
    

    /* Are we drawing? */
    "draw_mode": false,
    "triangle_mode": false,
    "polygon_coordinates": [],

    "origin_x": 0,
    "origin_y": 0

}

/* Clear and redraw */
function redrawCanvas() {
    gl.clearColor(current.bgcolor.red, current.bgcolor.green, current.bgcolor.blue, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (let shape of shapes) {
        shape.draw();
    }
}

// Get mouse coords
function recordMouse(e) {
    mousex = (e.offsetX / canvas.clientWidth) * 2 - 1
    mousey = (1 - (e.offsetY / canvas.clientHeight)) * 2 - 1
}

/* Okay, might as well do that once before anything else */
redrawCanvas();
/* And do the other setups*/
current.color = hexToRgb(document.getElementById("color").value);
current.bgcolor = hexToRgb(document.getElementById("bgcolor").value);
setShape(document.getElementById("shape").value);
current.filled = document.getElementById("fill").checked;
current.sides = document.getElementById("sides").value;
window.onkeydown = checkKey;

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
        } else if (current.shape === Polygon) {
            //Ugh, custom polygons
            current.polygon_coordinates.push([mousex, mousey]);
            redrawCanvas();
            (new current.shape(current.origin_x, current.origin_y,
                0, 0, current.color, current.filled, current.polygon_coordinates)).draw();
            // Normal, god fearing shapes
        } else {
            /* Turn draw mode off and draw shape */
            current.draw_mode = false;
            shapes.push(new current.shape(current.origin_x, current.origin_y, mousex, mousey, current.color, current.filled, [current.sides,0]));
            redrawCanvas();
        }
    } else {

        /* Turn draw mode on and record origin */
        triangle_mode = false;
        current.polygon_coordinates = []
        recordMouse(e);
        current.origin_x = mousex;
        current.origin_y = mousey;
        current.draw_mode = true;
    }
    current.focus = shapes.length - 1;
});
/* Cancel upon right click */
canvas.addEventListener("contextmenu", function(e) {
    if (current.draw_mode) {
        e.preventDefault();
        triangle_mode = false;
        current.draw_mode = false;
        redrawCanvas();
    }
});
/* Look for moves if drawing 
 * then redraw*/
canvas.addEventListener("mousemove", function(e) {
    if (current.draw_mode) {
        recordMouse(e);
        redrawCanvas();
        /* Cause triangles are bitches */
        if (current.triangle_mode) {
            (new current.shape(current.origin_x, current.origin_y, current.triangle_point[0], current.triangle_point[1],
                current.color, current.filled, [mousex, mousey])).draw();
        } else {
            /* Normal, wholesome, god-fearing shapes */
            (new current.shape(current.origin_x, current.origin_y,
                mousex, mousey, current.color, current.filled, current.shape == Polygon ?
                current.polygon_coordinates.concat([
                    [mousex, mousey]
                ]) : current.shape == Basic ? [current.sides,0] : [mousex, mousey])).draw();
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
        shape == "basic" ? Basic :
        shape == "polygon" ? Polygon :
        (console.log("NO SUCH SHAPE"), Line);
}
document.getElementById("shape").addEventListener("click", function(e) {
    shape = document.getElementById("shape").value
    shape=="basic"?
		document.getElementById("sides").removeAttribute("hidden")
	:
		document.getElementById("sides").setAttribute("hidden", true);
    setShape(shape);
});
/* Basic shape sides */
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
    current.draw_mode = false
    redrawCanvas();
});
// Pop last shape
document.getElementById("pop").addEventListener("click", function(e) {
    shapes.pop();
    current.focus = shapes.length - 1
    current.draw_mode = false
    redrawCanvas();
});

function changeBackground() {
    current.bgcolor = hexToRgb(document.getElementById("bgcolor").value)
    redrawCanvas();
}

// Arrow key stuff
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode <= 40 || e.keycode >= 188) {
        e.preventDefault();
    }
    if (current.draw_mode==false && current.focus != -1) {
        current.focus %= shapes.length;
        let speed = .01;
        /* Arrow keys control movement */
        if (e.keyCode == '38' /*Up arrow*/ ) {
            shapes[current.focus].y1 += speed;
            shapes[current.focus].y2 += speed;
        } else if (e.keyCode == '40' /* Down arrow */ ) {
            shapes[current.focus].y1 -= .01;
            shapes[current.focus].y2 -= .01;
        } else if (e.keyCode == '37' /*Left arrow*/ ) {
            shapes[current.focus].x1 -= speed;
            shapes[current.focus].x2 -= speed;
        } else if (e.keyCode == '39' /*Right arrow*/ ) {
            shapes[current.focus].x1 += speed;
            shapes[current.focus].x2 += speed;
        } else if (e.keyCode == '9' /* Tab */ ) {
            // Change focus to new shape
            current.focus += 1;
        } else if (e.keyCode == '8' /* Delete */ ) {
            // Delete shape
            shapes.splice(current.focus, 1);
            current.focus -= 1;
        } else if (e.keyCode == '13' /* Enter */ ) {
            // Change outline of shape
            shapes[current.focus].filled = !(shapes[current.focus].filled);
        } else if (e.keyCode == '188' /* comma */ ) {
            // Swap to the left
            let left = current.focus ? current.focus - 1 : shapes.length - 1;
            let temp = shapes[left]
            shapes[left] = shapes[current.focus];
            shapes[current.focus] = temp;
            current.focus = left;
        } else if (e.keyCode == '190' /* period */ ) {
            // Swap to the right
            var temp = shapes[(current.focus + 1) % shapes.length]
            shapes[(current.focus + 1) % shapes.length] = shapes[current.focus];
            shapes[current.focus] = temp;
            current.focus = (current.focus + 1) % shapes.length;
        } else if (e.keyCode == '87' /*W*/ ){
	    // Right rotate
	    shapes[current.focus].theta -= .01;
	} else if (e.keyCode == '81'){
	    // Left rotate
	    shapes[current.focus].theta += .01;
	}
	redrawCanvas();
    }
    if (e.keyCode == '32') { //Space
        // Stop draw'n polygon
        if (current.shape == Polygon && current.draw_mode == true) {
            shapes.push(new current.shape(current.origin_x, current.origin_y,
                mousex, mousey, current.color, current.filled, current.shape == Polygon ?
                current.polygon_coordinates : current.shape == Basic ? [current.sides,0] : [mousex, mousey]));
            current.draw_mode = false;
            redrawCanvas();
            current.focus = shapes.length - 1;
        }

    }
   // redrawCanvas();
}
