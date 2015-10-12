//"Nel frattempo non disperi. La natura della massa ha sempre qualcosa di oscuro per tutti."

var earth_radius = 234; // RADIUS OF THE EARTH
var earth_mass = 18E14; //18E14; // MASS OF THE EARTH 18E
var real_earth_radius = 6.371E6;

var earth_rotation_period = 180;
var earth_angular_velocity = -((2 * Math.PI) / earth_rotation_period); // ω // EARTH ANGULAR VELOCITY
var g_constant = 6.67408E-11; // * pow(earth_radius/real_earth_radius, 3); // UNIVERSAL GRAVITATIONAL CONSTANT
var standard_gravitational_parameter = earth_mass * g_constant;

var angle; //GLOBAL EARTH ROTATION ANGLE

var absoluteObjects = new Array();
var relativeObjects = new Array();

function orbitEquation(theta, angular_momentum, eccentricity, mass) {
    var first_part = pow(angular_momentum, 2) / ((pow(mass, 2) * standard_gravitational_parameter));
    var second_part = 1 / (1 + eccentricity * cos(theta));
    return first_part * second_part;
}

function orbitEquation2(theta, semimajoraxis, eccentricity) {
    var first_part = semimajoraxis * (1 - pow(eccentricity, 2));
    var second_part = 1 / (1 + eccentricity * cos(theta));
    return first_part * second_part;
}

function hyperbolaTrueAnomaly(a, e, t) {
    var up = a * (pow(e, 2) - 1);
    var down = 1 + e * cos(t);

    return up / down;
}

function getRadialCoordinates(x, y) {
    return Math.atan2(y, x);
}

function moveToAbsoluteCoordinates(x, y) {
    var radialRelativeCoordinate = getRadialCoordinates(x, y);
    var radialAbsoluteCoordiante = radialRelativeCoordinate + angle;
    var value = {
        x, y, radialCoordinate: radialAbsoluteCoordiante
    };
    value.x = (earth_radius + 0.5) * Math.cos(radialAbsoluteCoordiante);
    value.y = (earth_radius + 0.5) * Math.sin(radialAbsoluteCoordiante);

    return value;
}

function moveToRelativeCoordinates(x, y) {
    var radialRelativeCoordinate = getRadialCoordinates(x, y);
    var radialAbsoluteCoordiante = radialRelativeCoordinate - angle;
    var value = {
        x, y, radialCoordinate: radialAbsoluteCoordiante
    };
    value.x = (earth_radius + 0.5) * Math.cos(radialAbsoluteCoordiante);
    value.y = (earth_radius + 0.5) * Math.sin(radialAbsoluteCoordiante);

    return value;
}

function getGeostationaryOrbit() {
    var period = Math.PI * 2 / earth_angular_velocity;
    var altitude = nthroot(Math.pow(period, 2) * g_constant * earth_mass / 4 * Math.pow(Math.PI, 2), 3);
    alert(altitude);
}

function placeObject(obj) {
    obj.last_timestamp = Date.now();
    absoluteObjects[obj.index] = obj;
    return obj.index;
}

function placeObjectOnEarth(obj) {
    relativeObjects[obj.index] = obj;
    return obj.index
}

function removeObject(obj) {
    delete absoluteObjects[obj.index];
}

function removeObjectFromEarth(obj) {
    delete relativeObjects[obj.index];
}

function getEccentricAnomaly(a, b, e, theta) {
    return 2 * Math.atan(sqrt(1 - e / (1 + e)) * Math.tan(theta / 2));
}

function getMeanAnomaly(E, e) {
    return E - e * sin(E);
}

function getTrueAnomalyInt(a, e, theta) {
    var first_part, second_part, third_part, one_plus;
    one_plus = -1 + pow(e, 2);
    first_part = 0.5 * pow(a, 2) * pow(one_plus, 2);
}

function getTrueAnomalyArea(a, b, e, theta) {
    var E = getEccentricAnomaly(a, b, e, theta);
    var M = getMeanAnomaly(E, e);
    return 0.5 * a * b * M;
}

function getEccentricAnomalyNewtonMethod(ec, m, dp) {

    // arguments:
    // ec=eccentricity, m=mean anomaly,
    // dp=number of decimal places
    var pi = Math.PI;

    var maxIter = 30,
        i = 0;

    var delta = Math.pow(10, -dp);

    var E, F;

    //m = m / 360.0;

    m = 2.0 * pi * (m - Math.floor(m)); // I have non idea what this does, I should investigate.

    if (ec < 0.8) E = m;
    else E = pi;

    F = E - ec * Math.sin(m) - m;

    while ((Math.abs(F) > delta) && (i < maxIter)) {

        E = E - F / (1.0 - ec * Math.cos(E));
        F = E - ec * Math.sin(E) - m;

        i = i + 1;

    }

    return E;

}

function getEccentricAnomalyNewtonMethod1(e, M, iterations, debuge) {
    var E = M;
    /*
    for (var i = 0; i < iterations; i++) {
        var tosum = (M + e * sin(E) - E) / (1 - e * cos(E));        
        E = E + tosum;
    }
    */

    var tosum = 0,
        iteration = 0;

    while (true) {
        /*tosum = (M + e * sin(E) - E) / (1 - e * cos(E));
        E = E + tosum;
        */

        tosum = e * sin(E);

        E = M + tosum;


        if (Math.abs(tosum) < 0.1) {
            break;
        }


        if (iteration == 10) {
            console.error(tosum);
            break;
        }

        iteration++;

    }



    //console.warn(tosum);


    return E;
}

function getEccentricAnomalyNewtonMethodDebug(e, M, iterations, debuge) {
    var E = 0;
    /*
    for (var i = 0; i < iterations; i++) {
        var tosum = (M + e * sin(E) - E) / (1 - e * cos(E));        
        E = E + tosum;
    }
    */

    var tosum = 0,
        previous_sum = 0;

    while (true) {
        /*tosum = (M + e * sin(E) - E) / (1 - e * cos(E));
        E = E + tosum;
        */

        tosum = e * sin(E);
        E = M + tosum;

        console.info(tosum);

        if (Math.abs(tosum) < 0.00005) {
            break;
        }


        previous_sum++;
        if (previous_sum == 2000) {
            debug();
            console.error(tosum);
            break;
        }
    }



    //console.warn(tosum);


    return E;
}

function getTrueAnomalyFromEccentricAnomaly(e, E) {
    var up = sqrt(1 + e) * Math.tan(E / 2);
    var down = sqrt(1 - e);
    var toAtan = up / down;
    return 2 * Math.atan(toAtan);
}

function takeOff(obj) {
    var x = obj.pos_x;
    var y = obj.pos_y;

    var pos = moveToAbsoluteCoordinates(x, y, angle);

    obj.pos_x = pos.x;
    obj.pos_y = pos.y;


    var radial_angle = pos.radialCoordinate - PI / 2;
    var vel_x0 = (obj.vel_x * Math.cos(radial_angle) - obj.vel_y * Math.sin(radial_angle));
    var vel_y0 = (obj.vel_x * Math.sin(radial_angle) + obj.vel_y * Math.cos(radial_angle));


    obj.vel_x = earth_radius * -earth_angular_velocity * Math.sin(pos.radialCoordinate) + vel_x0;;
    obj.vel_y = earth_radius * earth_angular_velocity * Math.cos(pos.radialCoordinate) + vel_y0;

    placeObject(obj);

    removeObjectFromEarth(obj);
}

function land(obj) {
    obj.vel_x = obj.vel_y = 0;

    obj.setRadialCoordinate(obj.getRadialCoordinate() - angle);

    removeObject(obj);

    placeObjectOnEarth(obj);
}

//Time machine
if (!Date.now) {
    Date.now = function () {
        return new Date().getTime();
    }
}
