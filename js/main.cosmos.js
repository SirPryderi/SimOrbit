var root = new Star(1.98855E30, 6.955E8, 0, 0, 5778);

var star = new Star(1.98855E30, 6.955E8, 1E10, .8, 5778);

var earth = new Planet(5.9736E24, 6.371E6, 1.49598261E11, 0.01671123, 1, "Terra");

var moon = new Planet(7.3477E22, 1.73710E6, 3.84399e8, 0.0549, 1, "Moon");

//var earth = new Planet(1, 0.5, 10, 0.901671123, 1, "terra");

//var gattini = new Planet(0.0000005, 0.1, 0.7, 0.1, 1, "piu");

//planetoid.addChild(gattini);

var gas_giant = new Planet(1.8986E27, 7.1492E7, 7.78547200E11, 0.048, 1, "Jupiter"); //7.78547200E11

//var dwarf_planet = new Planet(1.305E22, 1.186E6, 5.874E12, 0.244671664, 1, "dwarf"); // Pluto

var mercury = new Planet(3.3022E23, 2.4397E6, 5.7909050E10, 0.205630, 1, "Mercury"); // Mercury

//var planet2 = new Planet(1.305E22, 1.186E6, 12.84748E6, 0.5, 1, "asd");


root.addChild(earth);

root.planet_type = "Sun;"

//root.addChild(star);

root.addChild(gas_giant);

root.addChild(mercury);

earth.addChild(moon);

particle = new Body(5000, 5e15, 5e15);

placeObject(particle);

particle.focus();

console.log(particle);

celestialObjects.push(root);


//planetoid.addChild(planet2);

var time_warp = 1; //5E5;

zoom_level = 1.3081952214077505e-9;

//var time = 60 * 60 * 24 * 365.25;

$(document).ready(function () {
    init2();
});
