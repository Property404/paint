// Just an RGB value as a class
class Color {
    constructor(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }
}

// Abstract shape superclass
class Shape {
    constructor(x1, y1, x2, y2, color, filled, extraparam = false) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.color = color;
        this.theta = false;
        //Assert filled is exactly true or exactly false
        this.filled = (filled === true || filled === false) ? filled : (console.log("NOT A VALID FILLED CONDITION"), false);
    }

    materialize(points /* Does NOT include color*/ , gl_shape) {
        /* Complete vertices - Includes color */
        var cvertices = [];
        for (let point of points) {
            cvertices.push(point[0], point[1], this.color.red, this.color.green, this.color.blue);
        }

        /* Do all that WebGL magic */
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cvertices), gl.STATIC_DRAW);

        /* Calculate how to draw the shape*/
        var vcount = Math.floor(points.length);
        //console.log("Vcount: " + vcount);
        gl.drawArrays(gl_shape, 0, vcount);

    }
}

// Has an extra 3rd coord
class Triangle extends Shape {
    constructor(x1, y1, x2, y2, color, filled, third_point) {
        super(x1, y1, x2, y2, color, filled);
        this.x3 = third_point[0];
        this.y3 = third_point[1];
    }
    draw() {
        let x1 = this.x1;
        let x2 = this.x2;
        let x3 = this.x3;
        let y1 = this.y1;
        let y2 = this.y2;
        let y3 = this.y3;
        this.materialize([
                [x1, y1],
                [x2, y2],
                [x3, y3]
            ],
            this.filled ? gl.TRIANGLE_FAN : gl.LINE_LOOP
        );
    }
}


/* Abnormal polygons */
class Polygon extends Shape {
    constructor(x1, y1, dummy, dummy2, color, filled, points) {
        super(x1, y1, 0, 0, color, filled);
        this.points = points;
    }
    draw() {
        var vertices = [
            [this.x1, this.y1]
        ];
        for (let point of this.points) {
            vertices.push(point);
        };
        this.materialize(vertices, this.filled ? gl.TRIANGLE_FAN : gl.LINE_LOOP);
    }
}


class Line extends Shape {
    constructor(x1, y1, x2, y2, color, dummy, dummy2) {
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
    constructor(x1, y1, x2, y2, color, filled, dummy) {
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

var tau = Math.PI * 2 /* Makes less calculations */
/* NORMAL (regular) Polygon */
class Basic extends Shape {
    constructor(x1, y1, x2, y2, color, filled, extra /*Array of sides and theta */ ) {
        super(x1, y1, x2, y2, color, filled);
        this.radius = Math.sqrt(
            Math.pow(x2 - x1, 2) +
            Math.pow(y2 - y1, 2));
        this.sides = extra[0];
        this.theta = extra[1];
    }
    draw() {
        var vertices = [];
        let multiplier = tau / this.sides;
        for (let i = 0; i < this.sides; i++) {
            vertices.push([
                this.x1 + (this.radius * Math.cos(i * multiplier + this.theta)),
                this.y1 + (this.radius * Math.sin(i * multiplier + this.theta))
            ]);
        }
        this.materialize(vertices, this.filled ? gl.TRIANGLE_FAN : gl.LINE_LOOP);
    }
}

/* Circles are just higher-level basic shapes*/
class Circle extends Basic {
    constructor(x1, y1, x2, y2, color, filled, dummy) {
        super(x1, y1, x2, y2, color, filled, [100, 0]);
    }
}