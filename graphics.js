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

