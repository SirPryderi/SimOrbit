var start;
var gp_index;
var interval;

function buttonPressed(b) {
    if (typeof(b) == "object") {
        return b.pressed;
    }
    return false;
}

var previous_buttons_state;

function buttonDown(id) {

}

function buttonUp(id) {

}

function buttonPress(id) {

}

function getAxisValue(a) {
    if (typeof(a) !== "undefined") {
        return parseFloat(round(a, 2));
    } else {
        return 0;
    }
}

function gameLoop() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads) {
        return;
    }

    var gp = gamepads[gp_index];

    //console.log(gp);

    /*
    if (buttonPressed(gp.buttons[0])) {

    } else if (buttonPressed(gp.buttons[2])) {
       
    }
    
    if (buttonPressed(gp.buttons[1])) {
       
    } else if (buttonPressed(gp.buttons[3])) {
       
    }
    */

    var axis_1_x = getAxisValue(gp.axes[0]);
    var axis_1_y = getAxisValue(gp.axes[1]);

    var sensibility = 20;

    if (axis_1_x || axis_1_y) {
        try {
            absoluteObjects[focusedIndex].applyImpulse(axis_1_x * sensibility, axis_1_y * sensibility, FVV);
        } catch (err) {}
    }


    var axis_2_x = getAxisValue(gp.axes[2]);
    var axis_2_y = getAxisValue(gp.axes[5]);

    if (axis_2_x || axis_2_y) {
        camera_position.x -= axis_2_x * sensibility / zoom_level;
        camera_position.y -= axis_2_y * sensibility / zoom_level;
    }


    start = requestAnimationFrame(gameLoop);
}







if (!('ongamepadconnected' in window)) {
    // No gamepad events available, poll instead.
    interval = setInterval(pollGamepads, 500);
}

function pollGamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    for (var i = 0; i < gamepads.length; i++) {
        var gp = gamepads[i];
        if (gp) {
            gp_index = gp.index;
            console.log("Gamepad connected at index " + gp.index + ": " + gp.id +
                ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.");
            gameLoop();

            clearInterval(interval);
        }
    }
}

window.addEventListener("gamepaddisconnected", function(e) {
    console.log("Gamepad disconnected from index %d: %s",
        e.gamepad.index, e.gamepad.id);

    cancelRequestAnimationFrame(start);
});