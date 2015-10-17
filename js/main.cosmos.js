//var root = new Star(1.98855E30, 6.955E8, 0, 0, 5778);

var root = new Star(1000000000, 1, 0, 0, 5778);

var planetoid = new Planet(1, 0.5, 10, 0.901671123, 1, "terra");



//var planetoid = new Planet(5.9736E24, 6.371E6, 1.49598261E11, 0.501671123, 1, "terra");

//var gas_giant = new Planet(1.8986E27, 7.1492E7, 7.78547200E11, 0.048, 1, "gas giant"); //7.78547200E11

//var dwarf_planet = new Planet(1.305E22, 1.186E6, 5.874E12, 0.244671664, 1, "dwarf"); // Pluto

//var mercury = new Planet(3.3022E23, 2.4397E6, 5.7909050E10, 0.205630, 1, "asd"); // Mercury

var planet2 = new Planet(1.305E22, 1.186E6, 12.84748E6, 0.5, 1, "asd");


root.addChild(planetoid);


//planetoid.addChild(planet2);

var time_warp = 1; //5E5;

zoom_level = 1.3081952214077505e-9;


var time = 60 * 60 * 24 * 365.25;

$(document).ready(function () {
    init2();
});
