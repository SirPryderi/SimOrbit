var body1 = new Spacecraft(500, 0, 0, fuelTank, liquidHydrogen);

console.log(body1.mass);

var satellite = new Body(10000, 0, -300);


var i = 0;

while (i++ < 500) {
    var angle = Math.random() * PI * 2;
    var satellite = new Body(500, 0, 500);
    satellite.setRadialCoordinate(angle);

    var velocity = Math.random() * 50;

    satellite.vel_x = velocity * cos(angle);
    satellite.vel_y = velocity * sin(angle);
    placeObject(satellite);
}

body1.setRadialCoordinate(Math.PI * 2);

body1.focus(0);

satellite.vel_x = 19;

placeObject(satellite);

placeObjectOnEarth(body1);

init1();
