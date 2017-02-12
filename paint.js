var triangleVertices = [];

var triangleVertexBufferObject = gl.createBuffer();
var addcount = -1;
/* Reuse everytime we add/remove vertecies, apparently */
function addVertex(x, y) {
    addcount += 1;
    triangleVertices.push(x, y, 0.0, 1.0, 0.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

}

// Make troongle 
addVertex(0, .5);
addVertex(-0.5, -0.5);
addVertex(.5, -.5);



var positionAttributeLocation =
    gl.getAttribLocation(program, 'vertPosition');
var colorAttributeLocation = gl.getAttribLocation(program, 'vertColor');
//Tell WebGL how to read the raw data
gl.vertexAttribPointer(
    positionAttributeLocation,
    2, //number of elements per attribute
    gl.FLOAT, //types of elements
    gl.FALSE, //has to be false
    5 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex
    0 //OFFSET
);
// This method should be memorize
gl.vertexAttribPointer(
    colorAttributeLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.enableVertexAttribArray(colorAttributeLocation);

// Public functions
gl.useProgram(program);


class Point{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}
class Color{
	constructor(r, g, b){
		this.red = r;
		this.green = g;
		this.blue = b;
	}
}
class Shape{
	constructor(color, filled){
		this.color = color;
		//Assert filled is exactly true or exactly false
		this.filled= filled===true?true:filled===false?false:(console.log("NOT A VALID FILLED CONDITION"), false);
	}

	materialize(points/* Does NOT include color*/, gl_shape){
		/* Complete vertices - Includes color */
		var cvertices = [];
		for (let point of points){
			cvertices.push(point.x,point.y, this.color.red, this.color.green, this.color.blue);
		}
		
		console.log(cvertices);
		/* Do all that WebGL magic */
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cvertices), gl.STATIC_DRAW);

		/* Calculate how to draw the shape*/
		var vcount=Math.floor(points.length);
		console.log("Vcount: " + vcount);
		gl.drawArrays(gl_shape,0, vcount);

	}
}
class Rectangle extends Shape{
	constructor(x1, y1, x2, y2, color, filled){
		super(color,filled);
		this.x1= x1;
		this.y1= y1;
		this.x2= x2;
		this.y2= y2;
	}
	draw(){
		this.materialize([new Point(this.x1,this.y1),new Point(this.x1,this.y2), new Point(this.x2,this.y2), new Point(this.x2,this.y1)], gl.LINE_LOOP);
	}
}
function writePoint(x, y) {
    addVertex(x, y);
    bloo = addcount; //Math.floor(triangleVertices.length/4) - 1
    console.log(bloo);
    gl.drawArrays(gl.POINT, bloo, 1);
}

function writeLine(x1, y1, x2, y2) {
    addVertex(x1, y1);
    addVertex(x2, y2)
    gl.drawArrays(gl.LINE_LOOP, addcount - 1, 2);
}

function writeRectangle(x, y, width, height) {
    addVertex(x, y);
    addVertex(x + width, y);

    addVertex(x + width, y + height);
    addVertex(x, y + height);
    gl.drawArrays(gl.LINE_LOOP, addcount - 3, 4);
}
/*
function writeCircle(x, y, r, accuracy) {
    let i = 0;
    for (i = 0; i < accuracy; i++) {
        addVertex(x + Math.cos(Math.PI * 2 * i / accuracy) * r, y + Math.sin(Math.PI * 2 * i / accuracy) * r);

    }
    for (i = 0; i < accuracy; i++) {
        addVertex(x - Math.cos(Math.PI * 2 * i / accuracy) * r, y - Math.sin(Math.PI * 2 * i / accuracy) * r);

    }
    bloo = accuracy;
    bloo += bloo;
    gl.drawArrays(gl.LINE_STRIP, addcount - bloo + 1, bloo);
}
*/
