var infinite_fuel = true;

function Fuel(efficiency, density){
    this.efficiency = efficiency;
    this.density = density;
}

function FuelTank(capacity){
    this.capacity = capacity;
    this.fuel = null;
    this.amount = 0;
}

Object.defineProperty(FuelTank.prototype, 'mass',    {
    get: function (){
        return this.amount * this.fuel.density;
    }
});

FuelTank.prototype.fill = function (fuel){
    this.fuel = fuel;
    this.amount = this.capacity;
};

var liquidHydrogen = new Fuel(500, 1);

var fuelTank = new FuelTank(5);

fuelTank.fill(liquidHydrogen);