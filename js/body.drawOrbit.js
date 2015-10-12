Body.prototype.drawOrbit = function () {
    var distance = this.getDistance();

    var g = -standard_gravitational_parameter / Math.pow(distance, 2);

    //Avionix
    var gforce = -g / (standard_gravitational_parameter / Math.pow(earth_radius, 2));
    var speed = Math.sqrt(Math.pow(this.vel_x, 2) + Math.pow(this.vel_y, 2));
    var escapeSpeed = Math.sqrt(2 * g_constant * earth_mass / distance);

    var altitude = distance - earth_radius;
    var escapedv = escapeSpeed - speed;

    var speedAlert = (speed >= escapeSpeed) ? "!" : "";

    var circularOrbitVelocity = Math.sqrt(g_constant * earth_mass / distance);

    //Nasty orbital stuff here.

    var theta = -(this.getVelocityVector() - this.getRadialCoordinate());

    var kinetic_energy = 0.5 * this.mass * pow(speed, 2);
    var potential_energy = -(standard_gravitational_parameter * this.mass) / distance;

    var orbit_energy = kinetic_energy + potential_energy;

    var angular_momentum = this.mass * speed * distance * Math.sin(theta);

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

    /*
    drawPoint(intersections[0], intersections[2], 'rgba(255,255,255,1)');
    drawPoint(intersections[1], intersections[3], 'rgba(255,0,255,1)');
    */

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

    if (eccentricity < 1) {
        /*drawEllipse(-focus * cos(option_2), -focus * sin(option_2), semimajoraxis, semiminoraxis, option_2, 'rgba(0,255,255,1)');*/

        rotoTraslateAxis(-focus, 0, ellipse_angle);

        drawEllipse(0, 0, semimajoraxis, semiminoraxis, 0, 'rgba(0,255,255,1)');

        // Semiaxis Interceptors AKA vertexes

        //drawPoint(semimajoraxis, 0, 'rgba(0,255,0,1)'); // periapsis

        //drawImage(periapsis_img, semimajoraxis, 0);

        //ctx.drawImage();

        drawImageRot(imgs['arrow'], semimajoraxis, -12, 180);
        drawImageRot(imgs['periapsis_img'], semimajoraxis + 5, -16, -toDeg(ellipse_angle)); //


        value = orbitEquation2(0, semimajoraxis, eccentricity);

        //drawPoint(-value -focus, 0, 'rgba(0,255,0,1)');

        //console.log(value);


        //drawPoint(-semimajoraxis, 0, 'rgba(0,0,255,12)'); // apoapsis


        drawImageRot(imgs['arrow'], -semimajoraxis - 10, -12, 0);
        drawImageRot(imgs['apoapsis_img'], -semimajoraxis - 37, -16, -toDeg(ellipse_angle)); //

        /*
        drawPoint(focus, 0, 'rgba(255,255,0,1)');
        drawPoint(-focus, 0, 'rgba(255,255,0,1)');
        */

        $('#orbitalPeriod').text(round(orbitalPeriod, 1));
        $('#periapsis').text(round(periapsis_altitude, 1));
        $('#apoapsis').text(round(apoapsis_altitude, 1));

    } else {
        rotoTraslateAxis(0, 0, PI + ellipse_angle);

        /*drawPoint(x2g, y2, 'rgba(0,255,255,1)');*/

        drawImageRot(imgs['arrow'], -semimajoraxis + focus, -12, 180);
        drawImageRot(imgs['periapsis_img'], -semimajoraxis + focus + 5, -16, toDeg(-ellipse_angle) + 180); //


        /*
        var t = 0;
        var x2g = hyperbolaTrueAnomaly(semimajoraxis, eccentricity, t) * cos(t);
        var y2 = hyperbolaTrueAnomaly(semimajoraxis, eccentricity, t) * sin(t);    


        var resolution = PI / 50;

        var hypAngle = getRadialCoordinates(semimajoraxis, semiminoraxis);

        for (var t = -hypAngle - PI / 2; t < hypAngle + PI / 2; t += resolution) {
            var x1 = hyperbolaTrueAnomaly(semimajoraxis, eccentricity, t - resolution) * cos(t - resolution);
            var y1 = hyperbolaTrueAnomaly(semimajoraxis, eccentricity, t - resolution) * sin(t - resolution);

            var x2 = hyperbolaTrueAnomaly(semimajoraxis, eccentricity, t) * cos(t);
            var y2 = hyperbolaTrueAnomaly(semimajoraxis, eccentricity, t) * sin(t);
            if (x1 < x2g)
                drawLine(x1, y1, x2, y2, 'rgba(0,255,255,1)');
        }
        
        */

        drawHyperbola(semimajoraxis, semiminoraxis, eccentricity, 'rgba(0,255,255,1)');
    }

    ctx.restore();

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
    try {
        $('#semimajoraxis').text(round(semimajoraxis, 2));
        $('#semiminoraxis').text(round(semiminoraxis, 2));
        $('#eccentricity').text(round(eccentricity, 4));
        $('#circularOrbitVelocity').text(round(circularOrbitVelocity, 2));


        $('#velocityVector').text(toDeg(theta));
        $('#gforce').text(gforce);
        $('#acceleration').text(-g);
        $('#speed').text(speedAlert + speed);
        $('#verticalSpeed').text(round(-speed * sin(theta - PI / 2), 2));
        $('#escapeSpeed').text(escapeSpeed);
        $('#altitude').text(altitude);
        $('#escapedV').text(escapedv);
    } catch (err) {}

    this.drawVelocityVector();
    this.drawAccelerationVector();
};
