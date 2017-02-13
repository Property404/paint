//init
var canvas = document.getElementById("can");
var gl = canvas.getContext("webgl")
var program;
var vertexShader;
var fragmentShader;
var vertexShaderText;
var fragmentShaderText;

function initWebGL() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, .0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //5
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    //Text for Vertex Shader
    vertexShaderText =
        [
            'precision mediump float;',
            '',
            'attribute vec2 vertPosition;',
            'attribute vec3 vertColor;',
            'varying vec3 fragColor;',
            'void main()',
            '{',
            'fragColor = vertColor;',
            'gl_Position = vec4(vertPosition,0.0,1.0);',
            '}'
        ].join("\n");

    fragmentShaderText =
        [
            'precision mediump float;',
            'varying vec3 fragColor;',
            'void main(){',
            'gl_FragColor = vec4(fragColor, 1.0);',
            '}'
        ].join("\n");

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log("ERROR:", gl.getShaderInfoLog(vertexShader));
    } else {
        console.log("all good");
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log("ERROR:", gl.getShaderInfoLog(fragmentShader));
    } else {
        console.log("all good");
    }


    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program);
}
initWebGL();

var vertexBufferObject = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
var positionAttributeLocation =
    gl.getAttribLocation(program, 'vertPosition');
var colorAttributeLocation = gl.getAttribLocation(program, 'vertColor');

// Tell WebGL how to read the raw data
gl.vertexAttribPointer(
    positionAttributeLocation,
    2, //Number of elemeents per attribute
    gl.FLOAT, //Types of elements
    gl.FALSE, //Always false
    5 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex
    0 //Offset
);
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
gl.useProgram(program);
