var celestialObjects = [];

/* CELSTIAL OBJECTS */
var planet_material = new THREE.MeshPhongMaterial({
    color: 0xdddddd,
    specular: 0x009900,
    shininess: 10,
    //emissive: 0xdddddd,
    shading: THREE.FlatShading
});

var star_material = new THREE.MeshPhongMaterial({
    color: 0xff8000,
    specular: 0x009900,
    shininess: 0.5,
    emissive: 0xff8000,
    shading: THREE.FlatShading
})

function getPlanetMesh(radius, material) {
    var geometry = new THREE.SphereGeometry(radius, 128, 128);
    var sphere = new THREE.Mesh(geometry, material);
    return sphere;
}


function Celestial_object(mass, radius, semimajoraxis, eccentricity) {
    /* Simulation Parameter */
    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.parentObject = null;
    this.childrenObjects = [];

    /* Astronomical Data */
    this.mass = mass;
    this.radius = radius;
    this.eccentricity = eccentricity;
    this.semimajoraxis = semimajoraxis;
    this.semiminoraxis = this.semimajoraxis * sqrt(1 - pow(this.eccentricity, 2));
    this.focus = antihypotenuse(this.semimajoraxis, this.semiminoraxis);
    this.orbitalRadius = 0;
    this.standard_gravitational_parameter = this.mass * g_constant;
    this.argumentPeriapsis = 0;
    this.angularVelocity = 1;
    this.orbitalPeriod = null;
    this.meanMotion = null;
    this.trueAnomaly = 0;
    this.eccentricAnomaly = 0;
    this.soi = Infinity; // sphere of influence, it will be calculated when an object is set as another's children.

    //Renderer

    var sphere = getPlanetMesh(this.radius, planet_material);

    sphere.position.x = this.x;
    sphere.position.z = this.z;

    this.geometry = sphere; // this is the main mesh of the object
    this.meshes = []; // Here should be contained all kind of children meshes

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
            //var time = global_timestamp / 1000 + Date.now() / 1000;
            //var dT = (Date.now() - global_timestamp) / 1000 * time_warp;

            var dT = (window.performance.now()) / 1000 * time_warp;
            //dT %= obj.orbitalPeriod;
            // It will tell the time from from the last full cicle. dT < T

            var meanAnomaly = obj.meanMotion * dT;

            var eccentricAnomaly = getEccentricAnomalyNewtonMethod(obj.eccentricity, meanAnomaly, 5);

            var trueAnomaly = getTrueAnomalyFromEccentricAnomaly(obj.eccentricity, eccentricAnomaly);


            var radius = obj.semimajoraxis * (1 - obj.eccentricity * cos(eccentricAnomaly));

            obj.orbitalRadius = radius;
            obj.trueAnomaly = trueAnomaly;
            obj.eccentricAnomaly = eccentricAnomaly;

            obj.x = obj.parentObject.x - obj.semimajoraxis * (cos(eccentricAnomaly) - obj.eccentricity); //radius * cos(trueAnomaly + obj.argumentPeriapsis);
            obj.y = obj.parentObject.y - obj.semiminoraxis * sin(eccentricAnomaly); //radius * sin(trueAnomaly + obj.argumentPeriapsis);

            //update mesh
            obj.geometry.position.x = obj.x;
            obj.geometry.position.y = 0;
            obj.geometry.position.z = obj.y;

            obj.renderChildren();
        });
    }

    this.addChild = function (body) {
        body.parentObject = this;
        //calculate sphere of influence
        body.calcSOI();
        body.calcMeanMotion();
        body.calcOrbitalPeriod();
        //finally add the object into the parent's children list

        { // Adding ellipse
            var curve = new THREE.EllipseCurve(
                //asd
                body.focus - this.x, -this.y, // ax, aY
                body.semimajoraxis, body.semiminoraxis, // xRadius, yRadius
                0, 2 * Math.PI, // aStartAngle, aEndAngle
                false, // aClockwise
                0 // aRotation 
            );

            var path = new THREE.Path(curve.getPoints(2000));
            var geometry = path.createPointsGeometry(2000);
            var material = new THREE.LineBasicMaterial({
                color: 0xff0000
            });

            // Create the final Object3d to add to the scene
            var ellipse = new THREE.Line(geometry, material);

            ellipse.rotation.x = Math.PI / 2;

            body.meshes.push(ellipse);
        }

        celestialObjects.push(body);

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
    };

    this.getOrbitalVelocity = function () {
        return sqrt(this.parentObject.standard_gravitational_parameter * ((2 / this.orbitalRadius) - (1 / this.semimajoraxis)));
    };

    this.getOrbitalVelocityVector = function () {
        //var velocity = sqrt(this.parentObject.standard_gravitational_parameter * ((2 / this.orbitalRadius) - (1 / this.semimajoraxis)));
        var velocity = {
            x: this.semimajoraxis * -sin(this.eccentricAnomaly),
            y: this.semimajoraxis * cos(this.eccentricAnomaly),
            z: 0
        }

        console.log(hypotenuse(velocity.x, velocity.y));

        console.log(this.getOrbitalVelocity());

        return velocity;


    };

}

/* STARS */
function Star(mass, radius, semimajoraxis, eccentricity, temperature) {
    Celestial_object.call(this, mass, radius, semimajoraxis, eccentricity);
    this.temperature = temperature;

    this.geometry.material = star_material;

    this.render = function () {
        var percentage = this.temperature / 30000;

        var atmosphere_radius = this.radius * 1.1;

        //this.mesh.position.x = this.x;

        //this.drawAtmosphere(atmosphere_radius, getColorForPercentage(percentage, 0), getColorForPercentage(percentage, 1));
    };
}

makeChildOf(Star, Celestial_object);

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

makeChildOf(Planet, Celestial_object);
