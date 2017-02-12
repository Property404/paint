class Color {
    constructor(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }
}
class Shape {
    constructor(x1, y1, x2, y2, color, filled) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.color = color;
        //Assert filled is exactly true or exactly false
        this.filled = filled === true ? true : filled === false ? false : (console.log("NOT A VALID FILLED CONDITION"), false);
    }

    materialize(points /* Does NOT include color*/ , gl_shape) {
        /* Complete vertices - Includes color */
        var cvertices = [];
        for (let point of points) {
            cvertices.push(point[0], point[1], this.color.red, this.color.green, this.color.blue);
        }

        //console.log(cvertices);
        /* Do all that WebGL magic */
        //gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cvertices), gl.STATIC_DRAW);

        /* Calculate how to draw the shape*/
        var vcount = Math.floor(points.length);
        //console.log("Vcount: " + vcount);
        gl.drawArrays(gl_shape, 0, vcount);

    }
}
class Line extends Shape {
    constructor(x1, y1, x2, y2, color, dummy) {
        super(x1, y1, x2, y2, color, false);
    }
    draw() {
        let x1 = this.x1;
        let x2 = this.x2;
        let y1 = this.y1;
        let y2 = this.y2;
        this.materialize([
            [x1, y1],
            [x2, y2]
        ], gl.LINE_STRIP);
    }
}
class Rectangle extends Shape {
    constructor(x1, y1, x2, y2, color, filled) {
        super(x1, y1, x2, y2, color, filled);
    }
    draw() {
        let x1 = this.x1;
        let x2 = this.x2;
        let y1 = this.y1;
        let y2 = this.y2;
        this.materialize([
            [x1, y1],
            [x1, y2],
            [x2, y2],
            [x2, y1]
        ], this.filled ? gl.TRIANGLE_FAN : gl.LINE_LOOP);
    }

}
