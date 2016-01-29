var PI = Math.PI;

function toDeg(rad) {
    rad = simplify_angle(rad);
    return 180 * rad / Math.PI;
}

function toRad(deg) {
    return PI * deg / 180;
}

function pow(x, y) {
    return Math.pow(x, y);
}

function square(x) {
    return Math.pow(x, 2);
}

function cube(x) {
    return Math.pow(x, 3);
}

function sin(x) {
    return Math.sin(x);
}

function cos(x) {
    return Math.cos(x);
}

function sqrt(x, y) {
    return Math.sqrt(x, y);
}

function hypotenuse(x, y) {
    return sqrt(pow(x, 2) + pow(y, 2));
}

function antihypotenuse(x, y) {
    return sqrt(Math.abs(pow(x, 2) - pow(y, 2)));
}

function intersection(x0, y0, r0, x1, y1, r1) {
    var a, dx, dy, d, h, rx, ry;
    var x2, y2;

    /* dx and dy are the vertical and horizontal distances between
     * the circle centers.
     */
    dx = x1 - x0;
    dy = y1 - y0;

    /* Determine the straight-line distance between the centers. */
    d = Math.sqrt((dy * dy) + (dx * dx));

    /* Check for solvability. */
    if (d > (r0 + r1)) {
        /* no solution. circles do not intersect. */
        return false;
    }
    if (d < Math.abs(r0 - r1)) {
        /* no solution. one circle is contained in the other */
        return false;
    }

    /* 'point 2' is the point where the line through the circle
     * intersection points crosses the line between the circle
     * centers.  
     */

    /* Determine the distance from point 0 to point 2. */
    a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2.0 * d);

    /* Determine the coordinates of point 2. */
    x2 = x0 + (dx * a / d);
    y2 = y0 + (dy * a / d);

    /* Determine the distance from point 2 to either of the
     * intersection points.
     */
    h = Math.sqrt((r0 * r0) - (a * a));

    /* Now determine the offsets of the intersection points from
     * point 2.
     */
    rx = -dy * (h / d);
    ry = dx * (h / d);

    /* Determine the absolute intersection points. */
    var xi = x2 + rx;
    var xi_prime = x2 - rx;
    var yi = y2 + ry;
    var yi_prime = y2 - ry;

    return [xi, xi_prime, yi, yi_prime];
}

function angleOfLineBetweenTwoPoints(x1, y1, x2, y2) {
    var xDifference = x2 - x1;
    var yDifference = y2 - y1;
    return -Math.atan2(yDifference, xDifference);

}

function angleOfLineBetweenTwoObjects(one, two) {
    return angleOfLineBetweenTwoPoints(one.x, one.y, two.x, two.y);
}

function nthroot(x, n) {
    try {
        var negate = n % 2 == 1 && x < 0;
        if (negate)
            x = -x;
        var possible = Math.pow(x, 1 / n);
        n = Math.pow(possible, n);
        if (Math.abs(x - n) < 1 && (x > 0 == n > 0))
            return negate ? -possible : possible;
    } catch (e) {
        console.log("something went wrong.");
    }
}

function smallest_angle(a, b) {
    console.log('imma start');

    /*
    a = Math.abs(a);
    while (a >= PI / 2) {
        a -= PI / 2;
    }

    b = Math.abs(b);
    while (b >= PI / 2) {
        a -= PI / 2;
    }
    
    */

    if (a < b) {
        return 1;
    } else {
        return 2;
    }
}

function simplify_angle(angle) {
    if (angle < 0) {
        return PI * 2 + angle;
    } else {
        return angle;
    }
}

function periodicReduction(value, period) {
    return value % period;
}

function distanceFromTwoPoints(x1, y1, x2, y2) {
    return sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
}

Math.atanh = Math.atanh || function (x) {
    return Math.log((1 + x) / (1 - x)) / 2;
};

function make_a_pi(angle) {
    angle = Math.abs(angle);

    /*
    while (angle > PI/4){
        angle -= PI/4;
    }*/

    return angle;
}

function round(num, places) {
    return num.toFixed(places);
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// VECTORIAL OPERATIONS 

function sumVector(a, b) {
    return {
        x: (a.x + b.x),
        y: (a.y + b.y),
        z: (a.z + b.z)
    };
}

function subtractVector(a, b) {
    return {
        x: (a.x - b.x),
        y: (a.y - b.y),
        z: (a.z - b.z)
    };
}
