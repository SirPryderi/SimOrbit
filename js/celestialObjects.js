/* CELSTIAL OBJECTS */
function Celestial_object(mass, radius, semimajoraxis, eccentricity) {
    /* Simulation Parameter */
    this.x = 0;
    this.y = 0;

    this.parentObject = null;
    this.childrenObjects = [];

    /* Astronomical Data */
    this.mass = mass;
    this.radius = radius;
    this.eccentricity = eccentricity;
    this.semimajoraxis = semimajoraxis;
    this.semiminoraxis = this.semimajoraxis * sqrt(1 - pow(this.eccentricity, 2));
    this.focus = antihypotenuse(this.semimajoraxis, this.semiminoraxis);
    this.standard_gravitational_parameter = this.mass * g_constant;
    this.argumentPeriapsis = 0;
    this.angularVelocity = 1;
    this.orbitalPeriod = null;
    this.meanMotion = null;
    this.soi = null; // sphere of influence, it will be calculated when an object is set as another's children.

    this.calcOrbitalPeriod = function () {
        this.orbitalPeriod = 2 * PI * sqrt(pow(this.semimajoraxis, 3) / this.parentObject.standard_gravitational_parameter);
    };

    this.calcMeanMotion = function () {
        this.meanMotion = sqrt(g_constant * (this.mass + this.parentObject.mass) / pow(this.semimajoraxis, 3));
    };

    this.calcSOI = function () {
        this.soi = this.semimajoraxis * pow(this.mass / this.parentObject.mass, 0.4);
    }

    this.renderChildren = function () {
        this.childrenObjects.forEach(function (obj) {
            var time = global_timestamp / 1000 + Date.now() / 1000;
            //var dT = (Date.now() - global_timestamp) / 1000 * time_warp;

            var dT = (window.performance.now()) / 1000 * time_warp;
            //dT %= obj.orbitalPeriod;
            // It will tell the time from from the last full cicle. dT < T

            var meanAnomaly = obj.meanMotion * dT;

            var eccentricAnomaly = getEccentricAnomalyNewtonMethod(obj.eccentricity, meanAnomaly, 5);

            var trueAnomaly = getTrueAnomalyFromEccentricAnomaly(obj.eccentricity, eccentricAnomaly);

            var radius = obj.semimajoraxis * (1 - obj.eccentricity * cos(eccentricAnomaly));

            if (obj.parentObject != null) {
                obj.x = obj.parentObject.x - obj.semimajoraxis * (cos(eccentricAnomaly) - obj.eccentricity); //radius * cos(trueAnomaly + obj.argumentPeriapsis);
                obj.y = obj.parentObject.y - obj.semiminoraxis * sin(eccentricAnomaly); //radius * sin(trueAnomaly + obj.argumentPeriapsis);
                //obj.x = obj.parentObject.x - radius * cos(trueAnomaly + obj.argumentPeriapsis);
                //obj.y = obj.parentObject.y - radius * sin(trueAnomaly + obj.argumentPeriapsis);

            }

            /* start rendering */
            {
                ctx.lineWidth = 1 / zoom_level;
                rotateAxis(obj.argumentPeriapsis);

                drawEllipse(-obj.focus, -obj.semiminoraxis, obj.semimajoraxis * 2, obj.semiminoraxis * 2, 0, "rgba(0, 255, 255, 1)");

                ctx.lineWidth = 1;

                //drawUnzoomablePoint(-obj.focus + obj.semiminoraxis, 0, "cyan");

                drawUnzoomablePoint(obj.focus - obj.semimajoraxis, 0, "pink");

                drawUnzoomablePoint(obj.focus + obj.semimajoraxis, 0, "pink");

                drawUnzoomablePoint(obj.focus, obj.semiminoraxis);

                drawUnzoomablePoint(obj.focus, -obj.semiminoraxis);

                //addDataPoint(4, obj.y);

                rotoTraslateAxis(-radius, 0, trueAnomaly);

                var dotColor = "red";

                if (obj.childrenObjects.length) { // If this object has children the dot will be yellow
                    dotColor = "yellow";
                }

                if (obj.parentObject != root) { // if it is a moon
                    dotColor = "blue";
                }

                obj.render();

                drawUnzoomablePoint(0, 0, dotColor);

                ctx.lineWidth = 1 / zoom_level;

                drawCircle(0, 0, obj.soi, "green"); // render SOI

            }
            /* end rendering */

            obj.renderChildren();

            ctx.restore(); // restore rototraslation
            ctx.restore(); // restore rotation
        });
    }

    this.addChild = function (body) {
        body.parentObject = this;
        //calculate sphere of influence
        body.calcSOI();
        body.calcMeanMotion();
        body.calcOrbitalPeriod();
        //finally add the object into the parent's children list
        this.childrenObjects.push(body);
    };

    this.drawAtmosphere = function (atmosphere_radius, color_1, color_2) {
        atmosphere_radius = atmosphere_radius;
        var gradient = ctx.createRadialGradient(0, 0, atmosphere_radius, 0, 0, this.radius);
        gradient.addColorStop(0, color_1);
        gradient.addColorStop(1, color_2);
        ctx.fillStyle = gradient;
        ctx.fillRect(-atmosphere_radius, -atmosphere_radius, atmosphere_radius * 2, atmosphere_radius * 2);
    };

    this.lookAt = function () {
        camera_position.x = this.x;
        camera_position.y = this.y;
    }

}

/* STARS */
function Star(mass, radius, semimajoraxis, eccentricity, temperature) {
    Celestial_object.call(this, mass, radius, semimajoraxis, eccentricity);
    this.temperature = temperature;

    this.render = function () {
        var percentage = this.temperature / 30000;

        /*
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
        //ctx.fillStyle = 'rgba(255,252,225,1)';

        ctx.fillStyle = getColorForPercentage(percentage, 1);
        ctx.fill();
        */

        var atmosphere_radius = this.radius * 1.1;
        this.drawAtmosphere(atmosphere_radius, getColorForPercentage(percentage, 0), getColorForPercentage(percentage, 1));
    };
}

Star.makeChildOf(Celestial_object);

/* PLANETS */

function Planet(mass, radius, semimajoraxis, eccentricity, atmospheric_pressure, planet_type) { //Gas giant, terra, dwarf
    Celestial_object.call(this, mass, radius, semimajoraxis, eccentricity);
    this.atmospheric_pressure = atmospheric_pressure;
    this.planet_type = planet_type;

    this.render = function () {
        var atmosphere_radius = this.radius * 1.05;
        //this.drawAtmosphere(atmosphere_radius, "rgba(108, 21, 21, 0)", "rgba(108, 21, 21, 0.8)");

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
        //ctx.fillStyle = 'rgba(255,252,225,1)';

        ctx.fillStyle = "rgb(141, 131, 131)";
        ctx.fill();
    };

}

Planet.makeChildOf(Celestial_object);
