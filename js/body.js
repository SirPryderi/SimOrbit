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

    this.getVelocityVector = function () {
        return Math.atan2(this.vel_y, this.vel_x);
    };

    this.getDistance = function () {
        //return sqrt(pow(this.x, 2) + pow(this.y, 2));
        return hypotenuse(this.x, this.y);
    };

    this.renderPhysics = function () {
        var g; // = -g_constant * earth_mass / Math.pow(distance, 2);
        var g_x = 0; // = g * Math.cos(this.getRadialCoordinate());
        var g_y = 0; // = g * Math.sin(this.getRadialCoordinate());

        var minchietta = this;

        celestialObjects.forEach(function (obj) {

            var distance = distanceFromTwoPoints(minchietta.x, minchietta.y, obj.x, obj.y);

            // universal gravitational equation
            var dg = g_constant * obj.mass / pow(distance, 2);

            //minchietta.force = dg * minchietta.mass;

            var angle = angleOfLineBetweenTwoPoints(minchietta.x, minchietta.y, obj.x, obj.y);

            g_x += (dg * cos(angle));
            g_y += (dg * sin(angle));


            //console.log(g_x);
        });

        this.gx = g_x;
        this.gy = g_y;

        this.g = hypotenuse(g_x, g_y);

        var timestamp = Date.now(); //Getting time
        var dT = (timestamp - this.last_timestamp) / 1000;

        if (dT < 0.5) { //This will prevent hight dT values when the windows lose focus.
            //Calculating accelerations
            this.vel_x += g_x * dT;
            this.vel_y += g_y * dT;
            //Calculating velocities
            this.x += this.vel_x * dT;
            this.y += this.vel_y * dT;

        }
        //Updating timestamp
        this.last_timestamp = timestamp;

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

        var minchietta = this;

        celestialObjects.forEach(function (obj) {

            var distance = distanceFromTwoPoints(minchietta.x, minchietta.y, obj.x, obj.y);

            // universal gravitational equation
            var dg = g_constant * obj.mass / pow(distance, 2);

            //minchietta.force = dg * minchietta.mass;

            var angle = angleOfLineBetweenTwoPoints(minchietta.x, minchietta.y, obj.x, obj.y);

            console.log(obj.planet_type, distance / 1000, "km", dg, "m/s²");
            //console.log(g_x);
        });
        console.log("==============");

    }
}
