function Spacecraft(mass, x, y, fuelTank, fuel) {
    Body.call(this, mass, x, y);
    this.style = 'rgba(255,0,0,1)';
    this.fuelTank = new FuelTank(50);
    this.fuelTank.fill(fuel);
    this._mass = mass;

    this.__defineGetter__('mass', function () {
        //console.log(this._mass);
        return this._mass + this.fuelTank.amount * this.fuelTank.fuel.density;
    });
}

makeChildOf(Spacecraft, Body);

Spacecraft.prototype.applyImpulse = function (force_x, force_y, follow_velocity) {

    var totalForce = hypotenuse(force_x, force_y);
    if (this.fuelTank.amount >= totalForce / this.fuelTank.fuel.efficiency) {

        if (!infinite_fuel) { // cheating
            this.fuelTank.amount -= totalForce / this.fuelTank.fuel.efficiency;
        }

        // This will change the remaining fuel amuont. Hopefully.

        if (follow_velocity) {
            var velocity_angle = this.getVelocityVector() + PI / 2;
            this.vel_x += (force_x * Math.cos(velocity_angle) - force_y * Math.sin(velocity_angle)) / this.mass;
            this.vel_y += (force_x * Math.sin(velocity_angle) + force_y * Math.cos(velocity_angle)) / this.mass;
        } else {
            this.vel_x += force_x / this.mass;
            this.vel_y += force_y / this.mass;
        }
    } else {
        console.log(this.mass);
        console.log('no fuel');
    }
};
