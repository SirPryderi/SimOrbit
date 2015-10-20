Body.prototype.drawOrbit = function () {
    var orbited_object = earth;

    var distance = getDistanceFromTwoObjects(this, orbited_object);

    var g = this.g; //-standard_gravitational_parameter / Math.pow(distance, 2);

    //Avionix
    var gforce = -g / 9.81; //-g / (standard_gravitational_parameter / Math.pow(earth_radius, 2));
    var speed = Math.sqrt(Math.pow(this.vel_x, 2) + Math.pow(this.vel_y, 2));
    var escapeSpeed = Math.sqrt(2 * g_constant * orbited_object.mass / distance);

    var relative_speed = speed - orbited_object.getOrbitalVelocity(); // <==== NOT SURE ABOUT THE SPEED CORRECTION, CAUTION!

    var altitude = distance - orbited_object.radius;
    var escapedv = escapeSpeed - speed;

    var speedAlert = (speed >= escapeSpeed) ? "!" : "";

    var circularOrbitVelocity = Math.sqrt(g_constant * orbited_object.mass / distance);

    //Nasty orbital stuff here.

    var theta = -(this.getVelocityVector() - angleOfLineBetweenTwoPoints(orbited_object.x, orbited_object.y, this.x, this.y));

    var kinetic_energy = 0.5 * this.mass * pow(relative_speed, 2);
    var potential_energy = -(orbited_object.standard_gravitational_parameter * this.mass) / distance;

    var orbit_energy = kinetic_energy + potential_energy;

    var angular_momentum = this.mass * relative_speed * distance * Math.sin(theta);

    var eccentricity = Math.sqrt(Math.abs(1 + (2 * orbit_energy * pow(angular_momentum, 2)) / (pow(this.mass, 3) * pow(standard_gravitational_parameter, 2))));

    var value;

    var semimajoraxis = Math.abs((standard_gravitational_parameter * this.mass / (2 * orbit_energy)));

    var semiminoraxis = Math.sqrt(Math.abs(1 - Math.pow(eccentricity, 2))) * semimajoraxis;


    if (eccentricity < 1) { //is an ellipse
        var focus = antihypotenuse(semimajoraxis, semiminoraxis);
        var apoapsis_altitude = semimajoraxis + focus - earth_radius;
        var periapsis_altitude = semimajoraxis - focus - earth_radius;
        var orbitalPeriod = 2 * PI * Math.sqrt((Math.pow(semimajoraxis, 3)) / standard_gravitational_parameter);
        var l = 2 * semimajoraxis - distance;
    } else { // is an hyperbola
        var focus = hypotenuse(semimajoraxis, semiminoraxis);
        var l = 2 * semimajoraxis + distance;
    }

    var intersections = intersection(0, 0, focus * 2, this.pos_x, this.pos_y, l);

    var first_center = {
        x: intersections[0] / 2,
        y: intersections[2] / 2
    };

    var second_center = {
        x: intersections[1] / 2,
        y: intersections[3] / 2
    };

    var first_angle = -angleOfLineBetweenTwoPoints(first_center.x, first_center.y, this.pos_x, this.pos_y);

    var second_angle = -angleOfLineBetweenTwoPoints(second_center.x, second_center.y, this.pos_x, this.pos_y);


    /*
    drawPoint(first_center.x, first_center.y, 'rgba(0,255,255,1)');

    drawLine(first_center.x, first_center.y, this.pos_x, this.pos_y, 'rgba(0,255,255,1)');

    drawPoint(second_center.x, second_center.y, 'rgba(255,0,0,1)');

    drawLine(second_center.x, second_center.y, this.pos_x, this.pos_y, 'rgba(255,0,0,1)');
    */


    var option_1 = -getRadialCoordinates(intersections[3], intersections[1]) - PI / 2;
    var option_2 = -getRadialCoordinates(intersections[2], intersections[0]) - PI / 2;

    //console.log(option_1 - this.getRadialCoordinate());

    var dangle1 = make_a_pi(PI / 2 - (simplify_angle(this.getVelocityVector()) - simplify_angle(first_angle)));

    var dangle2 = make_a_pi(PI / 2 - (simplify_angle(this.getVelocityVector()) - simplify_angle(second_angle)));

    var condition_one, condition_two = false,
        condition_three, condition_four, condition_five = eccentricity < 1;

    condition_three = simplify_angle(this.getVelocityVector()) < PI * 3 / 2;

    while (dangle1 + dangle2 > PI * 2 && dangle1 + dangle2 < PI * 4) {
        dangle1 -= PI;
        dangle2 -= PI;

        dangle1 = Math.abs(dangle1);
        dangle2 = Math.abs(dangle2);

        condition_two = true;
    }

    if (simplify_angle(theta) < PI * 2 && simplify_angle(theta) > PI && condition_five) {
        condition_four = false;
    } else {
        condition_four = true;
    }

    condition_one = (dangle1 < dangle2);

    var final_condition = ((condition_one && !condition_two && condition_three) || (!condition_one && condition_two && !condition_three) || (condition_one && !condition_two && !condition_three) || (!condition_one && condition_two && condition_three));

    if (final_condition == condition_four == condition_five) { //was 5/4
        ellipse_angle = option_1;
    } else {
        ellipse_angle = option_2;
    }

    // F(r)oci
    /*
    drawPoint(0, semiminoraxis, 'rgba(0,0,255,1)');

    drawPoint(0, -semiminoraxis, 'rgba(0,0,255,1)');
    */

    /*
    value = orbitEquation(0, angular_momentum, eccentricity, this.mass);

    drawPoint(value + focus, 0, 'rgba(0,255,0,1)');

    value = orbitEquation(Math.PI / 2, angular_momentum, eccentricity, this.mass);

    drawPoint(focus, -value, 'rgba(0,255,0,1)');

    value = orbitEquation(Math.PI, angular_momentum, eccentricity, this.mass);

    drawPoint(-value + focus, 0, 'rgba(0,255,0,1)');

    value = orbitEquation(-Math.PI / 2, angular_momentum, eccentricity, this.mass);

    drawPoint(focus, value, 'rgba(0,255,0,1)');
    */

    /*
    if ((theta < PI/2 && theta > -3/2*PI)) {
        ellipse_angle = -getRadialCoordinates(intersections[3], intersections[1]) - PI / 2;
    } else {
        ellipse_angle = -getRadialCoordinates(intersections[2], intersections[0]) - PI / 2;
        //ellipse_angle = -getRadialCoordinates(intersections[3], intersections[1]) - PI / 2;
    }
    */

    $('#semimajoraxis').text(semimajoraxis);
    $('#semiminoraxis').text(semiminoraxis);
    $('#eccentricity').text(eccentricity);
    $('#circularOrbitVelocity').text(round(circularOrbitVelocity, 2));


    $('#velocityVector').text(round(toDeg(theta), 3));
    $('#gforce').text(round(gforce, 2));
    $('#acceleration').text((round(-g, 4)));
    $('#speed').text(speedAlert + round(speed, 2));
    $('#verticalSpeed').text(round(-speed * sin(theta - PI / 2), 2));
    $('#escapeSpeed').text(round(escapeSpeed, 2));
    $('#altitude').text(round(altitude, 2));
    $('#escapedV').text(round(escapedv, 2));

};
