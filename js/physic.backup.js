var earth_radius = 234; // RADIUS OF THE EARTH
var earth_mass = 18E14; // MASS OF THE EARTH
var earth_angular_velocity = -((2 * Math.PI) / 60); // ω // EARTH ANGULAR VELOCITY
var g_constant = 0.0000000000667; // UNIVERSAL GRAVITATIONAL CONSTANT
var standard_gravitational_parameter = earth_mass * g_constant;

var angle; //GLOBAL EARTH ROTATION ANGLE

var absoluteObjects = new Array();
var relativeObjects = new Array();

var body = {
    mass: 50,
    vel_x: 0,
    vel_y: 0,
    pos_x: 0,
    pos_y: 0,
    last_timestamp: 0,
    render: function() {
        drawPoint(this.pos_x, this.pos_y, 'rgba(255,0,0,1)');
    },
    setRadialCoordinate: function(radialCoordinate) {
        this.pos_x = earth_radius * Math.cos(radialCoordinate);
        this.pos_y = earth_radius * Math.sin(radialCoordinate);
    },
    getRadialCoordinate: function() {
        return getRadialCoordinates(this.pos_x, this.pos_y);
    },
    getVelocityVector: function() {
        return Math.atan2(this.vel_y, this.vel_x);
    },
    getDistance: function (){
        return sqrt(pow(this.pos_x, 2) + pow(this.pos_y, 2));
    },
    renderPhysics: function() {
        var distance = this.getDistance();

        var g = -g_constant * earth_mass / Math.pow(distance, 2);

        var g_x = g * Math.cos(this.getRadialCoordinate());
        var g_y = g * Math.sin(this.getRadialCoordinate());

        this.gx = g_x;
        this.gy = g_y;

        var timestamp = Date.now(); //Getting time
        var dT = (timestamp - this.last_timestamp) / 1000;
        //Calculating accelerations
        this.vel_x += g_x * dT;
        this.vel_y += g_y * dT;
        //Calculating velocities
        this.pos_x += this.vel_x * dT;
        this.pos_y += this.vel_y * dT;
        //Updating timestamp
        this.last_timestamp = timestamp;
    },
    drawOrbit: function() {
        var distance = this.getDistance();
        
        var g = -g_constant * earth_mass / Math.pow(distance, 2);
        
        //Avionix
        var gforce = -g / (g_constant * earth_mass / Math.pow(earth_radius, 2));
        var speed = Math.sqrt(Math.pow(this.vel_x, 2) + Math.pow(this.vel_y, 2));
        var escapeSpeed = Math.sqrt(2 * g_constant * earth_mass / distance);

        var altitude = distance - earth_radius;
        var escapedv = escapeSpeed - speed;

        var speedAlert = (speed >= escapeSpeed) ? "!" : "";

        var circularOrbitVelocity = Math.sqrt(g_constant * earth_mass / distance);

        //Nasty orbital stuff here.

        var theta = -(this.getVelocityVector() - this.getRadialCoordinate()); // Might need some minus, somewhere.

        var kinetic_energy = 0.5 * this.mass * pow(speed, 2);
        var potential_energy = -(standard_gravitational_parameter * this.mass) / distance;

        var orbit_energy = kinetic_energy + potential_energy; //-(standard_gravitational_parameter * this.mass) / (2 * distance); // IT SHOULDNT BE DISTANCE, IT'S THE SEMIAXIS MAJOR!!!

        var angular_velocity = earth_angular_velocity;

        var angular_momentum = this.mass * speed * distance * Math.sin(theta);

        //console.log(angular_momentum);

        var eccentricity = Math.sqrt(Math.abs(1 + (2 * orbit_energy * pow(angular_momentum, 2)) / (pow(this.mass, 3) * pow(standard_gravitational_parameter, 2))));

        /*
        var count = 0;
        while (count < 2* Math.PI) {
            value 
            drawPoint(count*10, 0);
            count += Math.PI/2;
        }*/


        var value;


        //value = orbitEquation(0, angular_momentum, orbit_energy, this.mass);

        var semimajoraxis = -(standard_gravitational_parameter * this.mass / (2 * orbit_energy));

        var semiminoraxis = Math.sqrt(1 - Math.pow(eccentricity, 2)) * semimajoraxis;

        var focus = Math.sqrt(Math.pow(semimajoraxis, 2) - Math.pow(semiminoraxis, 2));
        
        var apoapsis_altitude = semimajoraxis + focus - earth_radius;
        var periapsis_altitude = semimajoraxis -focus - earth_radius;

        rotoTraslateAxis(-focus, 0, ellipse_angle);

        drawEllipse(0, 0, semimajoraxis, semiminoraxis, 0, 'rgba(0,255,255,1)')

        // Semiaxis Interceptors
        drawPoint(semimajoraxis, 0, 'rgba(0,0,255,1)');

        drawPoint(-semimajoraxis, 0, 'rgba(0,0,255,1)');

        drawPoint(0, semiminoraxis, 'rgba(0,0,255,1)');

        drawPoint(0, -semiminoraxis, 'rgba(0,0,255,1)');

        // Foci
        drawPoint(focus, 0, 'rgba(255,255,0,1)');
        drawPoint(-focus, 0, 'rgba(255,255,0,1)');



        // Central, inverse-square law force

        value = orbitEquation(0, angular_momentum, orbit_energy, this.mass);

        drawPoint(value, 0, 'rgba(0,255,0,1)');

        value = orbitEquation(Math.PI / 2, angular_momentum, orbit_energy, this.mass);

        drawPoint(0, -value, 'rgba(0,255,0,1)');

        value = orbitEquation(Math.PI, angular_momentum, orbit_energy, this.mass);

        drawPoint(-value, 0, 'rgba(0,255,0,1)');

        value = orbitEquation(-Math.PI / 2, angular_momentum, orbit_energy, this.mass);

        drawPoint(0, value, 'rgba(0,255,0,1)');

        ctx.restore();


        //console.log(value);


        $('#semimajoraxis').text(semimajoraxis);
        $('#semiminoraxis').text(semiminoraxis);


        $('#velocityVector').text(toDeg(theta));
        $('#eccentricity').text(eccentricity);
        
        $('#gforce').text(gforce);
        $('#acceleration').text(-g);
        $('#speed').text(speedAlert + speed);
        $('#escapeSpeed').text(escapeSpeed);
        $('#altitude').text(altitude);
        $('#escapedV').text(escapedv);
        
        console.log(focus);
        
        $('#periapoapsis').text(periapsis_altitude + "\n" + apoapsis_altitude);

        $('#circularOrbitVelocity').text(circularOrbitVelocity);

        this.drawVelocityVector();
        this.drawAccelerationVector();
    },
    drawVelocityVector: function() {
        ctx.beginPath();
        ctx.moveTo(this.pos_x, this.pos_y);
        ctx.lineTo(this.pos_x + this.vel_x * 2, this.pos_y + this.vel_y * 2);
        ctx.strokeStyle = 'rgba(0,255,0,1)';
        ctx.stroke();
    },
    drawAccelerationVector: function() {
        ctx.beginPath();
        ctx.moveTo(this.pos_x, this.pos_y);
        ctx.lineTo(this.pos_x + this.gx * 2E1, this.pos_y + this.gy * 2E1);
        ctx.strokeStyle = 'rgba(0,0,255,1)';
        ctx.stroke();
    },
    applyImpulse: function(force_x, force_y, follow_velocity) {
        if (follow_velocity) {
            var velocity_angle = -this.getVelocityVector();
            this.vel_x += (force_x * Math.cos(velocity_angle) + force_y * Math.sin(velocity_angle)) / this.mass;
            this.vel_y += (force_y * Math.sin(velocity_angle) + force_x * Math.cos(velocity_angle)) / this.mass;
        } else {
            this.vel_x += force_x / this.mass;
            this.vel_y += force_y / this.mass;
        }
    },
    SpaceObjectTracking: function() {
        drawLine(0, 0, this.pos_x, this.pos_y, 'rgb(255,255,0)');
    }

}

function orbitEquation(theta, angular_momentum, energy, mass) {
    var first_part = Math.pow(angular_momentum, 2) / ((Math.pow(mass, 2) * standard_gravitational_parameter));
    var second_part = 1 / (1 + energy * Math.cos(theta));
    return first_part + second_part;
}

function getRadialCoordinates(x, y) {
    return Math.atan2(y, x);
}

function moveToAbsoluteCoordinates(x, y, earth_rotation) {
    var radialRelativeCoordinate = getRadialCoordinates(x, y);
    var radialAbsoluteCoordiante = radialRelativeCoordinate + earth_rotation;
    var value = {
        x, y, radialCoordinate: radialAbsoluteCoordiante
    };
    value.x = earth_radius * Math.cos(radialAbsoluteCoordiante);
    value.y = earth_radius * Math.sin(radialAbsoluteCoordiante);

    return value;
}

function moveNow() {
    var x = relativeObjects[0].pos_x;
    var y = relativeObjects[0].pos_y;

    var pos = moveToAbsoluteCoordinates(x, y, angle);

    relativeObjects[0].pos_x = pos.x;
    relativeObjects[0].pos_y = pos.y;

    relativeObjects[0].vel_x += earth_radius * -earth_angular_velocity * Math.sin(pos.radialCoordinate);
    relativeObjects[0].vel_y += earth_radius * earth_angular_velocity * Math.cos(pos.radialCoordinate);

    relativeObjects[0].last_timestamp = Date.now();

    absoluteObjects.push(relativeObjects[0]);
    delete relativeObjects[0];

    ellipse_angle = angle;
}

function getGeostationaryOrbit() {
    var period = Math.PI * 2 / earth_angular_velocity;
    var altitude = nthroot(Math.pow(period, 2) * g_constant * earth_mass / 4 * Math.pow(Math.PI, 2), 3);
    alert(altitude);
}

//Time machine
if (!Date.now) {
    Date.now = function() {
        return new Date().getTime();
    }
}