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
