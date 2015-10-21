var benchMark1;

var focusedIndex = 0;

var focusedObj = null;

launchVelocity = 15;

function moveNow() {
    if (relativeObjects[focusedIndex]) {
        relativeObjects[focusedIndex].vel_y = launchVelocity;

        takeOff(relativeObjects[focusedIndex]);
    }

    //ellipse_angle = angle;

    toggleAvionix();
}

function benchMarkStart() {
    setTimeout(benchMarkEnd, 1000);
    benchMark1 = angle;
}

function benchMarkEnd() {
    console.log((angle - benchMark1) + 'rad/s');
}

var FVV = false;

function toggleFVV() {
    $('#FVV').toggleClass('active');
    if (FVV) {
        FVV = false;
    } else {
        FVV = true;
    }
}

var SOPS = false;

function toggleSOPS() {
    $('#SOPS').toggleClass('active');
    if (SOPS) {
        SOPS = false;
    } else {
        SOPS = true;
    }
}

var ellipse_angle = 0;

var keyImpulse = 1e5;
$(document).keydown(function (e) {
    switch (e.which) {
        case 37: // left
            focusedObject().applyImpulse(-keyImpulse, 0, FVV);
            break;

        case 38: // up
            focusedObject().applyImpulse(0, -keyImpulse, FVV);
            break;

        case 39: // right
            focusedObject().applyImpulse(keyImpulse, 0, FVV);
            break;

        case 40: // down
            focusedObject().applyImpulse(0, keyImpulse, FVV);
            break;
        case 32: // SPACEBAR
            moveNow();
            break;
        case 87: //w
            camera.position.y -= 20 / zoom_level;
            break;
        case 83: //s
            camera.position.y += 20 / zoom_level;
            break;
        case 68: //d
            camera.position.x += 20 / zoom_level;
            break;
        case 65: //a
            camera.position.x -= 20 / zoom_level;
            break;
        case 90: //z
            camera.position.x = focusedObject().pos_x;
            camera.position.y = focusedObject().pos_y;
            break;
        case 88: //x
            camera.position.x = 0;
            camera.position.y = 0;
            break;
        case 81: //q
            toggleFVV();
            break;
        case 82: //r
            particle.x = earth.x + 1e7;
            particle.y = earth.y;
            particle.vel_y = 7e3;
            break;
        case 69: //e
            toggleSOPS();
            break;
        case 70: //f
            particle.gStat();
            break;
        case 107: //+
            zoom_level = zoom_level / 2;
            break;

        case 109: //-
            zoom_level = zoom_level * 2;
            break;
        default:
            console.info(e.keyCode);
            return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});


/* (NOT SO EXPERIMENTAL) TOUCH EVENTS */
var touch_start = {
        x: 0,
        y: 0
    },
    touch_end = {
        x: 0,
        y: 0
    }


$('#playbox').bind('touchstart', function (e) {
    touch_start.x = e.originalEvent.touches[0].pageX;
    touch_start.y = e.originalEvent.touches[0].pageY;
});

$('#playbox').bind('touchmove', function (e) {
    e.preventDefault();
});

var touch_sensibility = 5;

$('#playbox').bind('touchend', function (e) {
    //touch_end.x = e.originalEvent.touches[0].pageX;
    //touch_end.y = e.originalEvent.touches[0].pageX;



    touch_end.x = e.originalEvent.changedTouches[0].pageX;
    touch_end.y = e.originalEvent.changedTouches[0].pageY;

    absoluteObjects[focusedIndex].applyImpulse(touch_sensibility * (touch_end.x - touch_start.x), touch_sensibility * (touch_end.y - touch_start.y), FVV);

    //alert(touch_start.x +' '+ touch_start.y + '\n'+ touch_end.x + ' ' +touch_end.y)

    //console.log(touch_start);

    //alert(e.originalEvent.touches[0].length);

    e.preventDefault();
});

function toggleAvionix() {
    $('avionics').toggle();
}

function focusedObject() {
    var ret;
    try {
        ret = absoluteObjects[focusedIndex];
    } catch (err) {
        try {
            ret = relativeObjects[focusedIndex];
        } catch (err) {
            ret = false;
        }
    }
    return ret;
}
