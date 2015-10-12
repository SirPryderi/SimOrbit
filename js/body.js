var last_index = -1;

function Body(mass, x, y) {
    this.mass = mass;
    this.pos_x = x;
    this.pos_y = y;
    this.vel_x = 0;
    this.vel_y = 0;
    this.last_timestamp = 0;
    this.focused = false;
    this.index = ++last_index;
    this.style = 'rgba(100,100,100,1)';

    this.render = function () {
        drawPoint(this.pos_x, this.pos_y, this.style);
        //drawImage(pony, this.pos_x, this.pos_y, -this.getVelocityVector());
    };

    this.setRadialCoordinate = function (radialCoordinate) {
        this.pos_x = earth_radius * Math.cos(radialCoordinate);
        this.pos_y = earth_radius * Math.sin(radialCoordinate);
    };

    this.getRadialCoordinate = function () {
        return getRadialCoordinates(this.pos_x, this.pos_y);
    };

    this.getVelocityVector = function () {
        return Math.atan2(this.vel_y, this.vel_x);
    };

    this.getDistance = function () {
        //return sqrt(pow(this.pos_x, 2) + pow(this.pos_y, 2));
        return hypotenuse(this.pos_x, this.pos_y);
    };

    this.renderPhysics = function () {
        var distance = this.getDistance();

        var g = -g_constant * earth_mass / Math.pow(distance, 2);

        var g_x = g * Math.cos(this.getRadialCoordinate());
        var g_y = g * Math.sin(this.getRadialCoordinate());

        this.gx = g_x;
        this.gy = g_y;

        var timestamp = Date.now(); //Getting time
        var dT = (timestamp - this.last_timestamp) / 1000;

        if (dT < 0.5) { //This will prevent hight dT values when the windows lose focus.
            //Calculating accelerations
            this.vel_x += g_x * dT;
            this.vel_y += g_y * dT;
            //Calculating velocities
            this.pos_x += this.vel_x * dT;
            this.pos_y += this.vel_y * dT;
            //Updating timestamp
        }

        this.last_timestamp = timestamp;

        if (distance < earth_radius) { // Collision Detection
            land(this);
        }
    };

    this.drawVelocityVector = function () {
        ctx.beginPath();
        ctx.moveTo(this.pos_x, this.pos_y);
        ctx.lineTo(this.pos_x + this.vel_x * 2, this.pos_y + this.vel_y * 2);
        ctx.strokeStyle = 'rgba(0,255,0,1)';
        ctx.stroke();
    };

    this.drawAccelerationVector = function () {
        ctx.beginPath();
        ctx.moveTo(this.pos_x, this.pos_y);
        ctx.lineTo(this.pos_x + this.gx * 2E1, this.pos_y + this.gy * 2E1);
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
        drawLine(0, 0, this.pos_x, this.pos_y, 'rgb(255,255,0)');
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
}
