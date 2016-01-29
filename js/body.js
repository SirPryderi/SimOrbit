var last_index = -1;

function Body(mass, x, y) {
    this.mass = mass;
    this.x = x;
    this.y = y;
    this.z = 0;
    this.vel_x = 0;
    this.vel_y = 0;
    this.vel_z = 0;
    this.last_timestamp = 0;
    this.focused = false;
    this.index = ++last_index;
    this.style = 'rgba(100,100,100,1)';
    this.orbitedBody = null;

    this.orbitMesh;

    this.geometry = null;

    this.render = function () {
        //drawPoint(this.x, this.y, this.style);
        //drawImage(pony, this.x, this.y, -this.getVelocityVector());
        //this.geometry.position.x = this.x;
        //this.geometry.position.z = this.y;
    };

    this.setRadialCoordinate = function (radialCoordinate) {
        this.x = earth_radius * Math.cos(radialCoordinate);
        this.y = earth_radius * Math.sin(radialCoordinate);
    };

    this.getRadialCoordinate = function () {
        return getRadialCoordinates(this.x, this.y);
    };

    this.getVelocityVectorAngle = function () {
        return Math.atan2(this.vel_y, this.vel_x) - PI / 2;
    };

    this.getVelocityVector = function () {
        return {
            x: this.vel_x,
            y: this.vel_y,
            z: this.vel_z
        }
    }

    this.getDistance = function () {
        //return sqrt(pow(this.x, 2) + pow(this.y, 2));
        return hypotenuse(this.x, this.y);
    };

    this.renderPhysics = function () {
        var g; // = -g_constant * earth_mass / Math.pow(distance, 2); // Total G module, calculated later.
        var g_x = 0; // = g * Math.cos(this.getRadialCoordinate()); // I bet you can guess that.
        var g_y = 0; // = g * Math.sin(this.getRadialCoordinate());

        var thisObj = this; // ignore le scurrilitá, a quanto pare facendo quella cosa brutta risolve problemi.

        //var obj = earth;

        //console.log('======');

        celestialObjects.forEach(function (obj) { // This will cycle through an array containing all "planets and stars"

            var distance = getDistanceFromTwoObjects(thisObj, obj); // This will calculate the distance between the current particle and the selected space object

            if (distance < obj.soi) { // This will just return the object that is orbited, used to draw the orbit
                thisObj.orbitedBody = obj; // mmmmh. zzzzzz.
            }

            // universal gravitational equation, kinda.
            var dg = g_constant * obj.mass / pow(distance, 2); // this will get the G module


            var angle = angleOfLineBetweenTwoObjects(obj, thisObj); // This should return the angle between the particle and the space object

            g_x -= (dg * cos(angle)); // x and y components of the acceleration are calculated, and added to the global one to get the total g
            g_y += (dg * sin(angle));

            //            if (obj.planet_type == 'Terra') {
            //                console.log(obj.planet_type);
            //                console.log("dg: \t", dg);
            //                console.log("dist:\t", distance);
            //                console.log("ang:\t", toDeg(angle));
            //            }
        });


        this.gx = g_x; // storing values in the object for later use.
        this.gy = g_y;
        this.g = hypotenuse(g_x, g_y);

        //        console.log(g_x);
        //        console.log(g_y);
        //        console.log(this.g);
        //
        //        console.log('======');

        var timestamp = window.performance.now() * time_warp; //Date.now(); //Getting time in millisecond
        var dT = (timestamp - this.last_timestamp) / 1000; // Gettint the time difference in SECONDS

        if (dT < 9000000.5) { //This will prevent hight dT values when the windows lose focus.
            //Calculating velocities
            this.vel_x += g_x * dT;
            this.vel_y += g_y * dT;
            //Updating particle position
            this.x += this.vel_x * dT;
            this.y += this.vel_y * dT;
        }

        //Updating timestamp
        this.last_timestamp = timestamp;

        //Updating mesh position
        this.geometry.position.x = this.x;
        this.geometry.position.z = this.y;

        //if (distance < earth_radius) { // Collision Detection
        //land(this);
        //}
    };

    this.drawVelocityVector = function () {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.vel_x * 2, this.y + this.vel_y * 2);
        ctx.strokeStyle = 'rgba(0,255,0,1)';
        ctx.stroke();
    };

    this.drawAccelerationVector = function () {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.gx * 2E1, this.y + this.gy * 2E1);
        ctx.strokeStyle = 'rgba(0,0,255,1)';
        ctx.stroke();
    };

    this.applyImpulse = function (force_x, force_y, follow_velocity) {
        if (follow_velocity) {
            var velocity_angle = this.getVelocityVector() + PI / 2;
            this.vel_x += (force_x * Math.cos(velocity_angle) - force_y * Math.sin(velocity_angle)) / this.mass;
            this.vel_y += (force_x * Math.sin(velocity_angle) + force_y * Math.cos(velocity_angle)) / this.mass;
        } else {
            this.vel_x += force_x / this.mass;
            this.vel_y += force_y / this.mass;
        }
    };

    this.SpaceObjectTracking = function () {
        drawLine(0, 0, this.x, this.y, 'rgb(255,255,0)');
    };

    this.focus = function () {
        try {
            relativeObjects[focusedIndex].focused = false;
            absoluteObjects[focusedIndex].focused = false;
        } catch (err) {

        }
        this.focused = true;
        focusedIndex = this.index;
    };

    this.gStat = function () {
        var g; // = -g_constant * earth_mass / Math.pow(distance, 2);
        var g_x = 0; // = g * Math.cos(this.getRadialCoordinate());
        var g_y = 0; // = g * Math.sin(this.getRadialCoordinate());

        var thisObj = this;

        celestialObjects.forEach(function (obj) {

            var distance = distanceFromTwoPoints(thisObj.x, thisObj.y, obj.x, obj.y);

            // universal gravitational equation
            var dg = g_constant * obj.mass / pow(distance, 2);

            //thisObj.force = dg * thisObj.mass;

            var angle = angleOfLineBetweenTwoPoints(thisObj.x, thisObj.y, obj.x, obj.y);

            console.log(obj.planet_type, distance / 1000, "km", dg, "m/s²");
            //console.log(g_x);
        });
        console.log("==============");

    }
}
