var canvas;
var ctx;

var imgs = [];

var zoom_level = 1;

var camera_position = {
    x: 0,
    y: 0
};

var global_timestamp;

function draw1() {
    ctx.globalCompositeOperation = 'destination-over';
    //ctx.globalCompositeOperation = 'source-over';

    canvas.height = $('#playbox').height();
    canvas.width = $('#playbox').width();

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeStyle = 'rgba(0,153,255,0.4)';

    ctx.save();


    if (zoom_level != 1) {
        ctx.scale(zoom_level, zoom_level);
    }


    ctx.translate(Math.floor(canvas.width / 2) / zoom_level - camera_position.x, Math.floor(canvas.height / 2) / zoom_level - camera_position.y);
    //Absolute Objects

    absoluteObjects.forEach(function (obj) {
        obj.renderPhysics();

        if (obj.focused) {
            obj.drawOrbit();
            if (SOPS) {
                obj.SpaceObjectTracking();
            }
        }
        obj.render();
    });

    //Earth
    var time = global_timestamp / 1000;
    //var seconds = time.getSeconds() + (time.getMilliseconds() / 1000);
    var dT = (Date.now() - global_timestamp) / 1000;
    angle = earth_angular_velocity * dT;

    //Approximate simulation    angular velocity = 0.10471975511965947  rad/s
    //Approximate earth         angular velocity = 0.000072921150       rad/s
    //Approxiamte ratio                            1434.63227561

    //console.log(time.getMilliseconds());

    ctx.rotate(angle);
    //ctx.globalAlpha = 0.5;

    //Relative Objects
    relativeObjects.forEach(function (obj) {
        obj.render();
    });


    //Draws Earth and Atmosphere
    //ctx.globalAlpha = 0.5;
    drawAtmosphere(0, 0, 255, [
        [0, "rgba(200, 200, 255, 0)"],
        [0.1, "rgba(0,150,225,0.6)"]
    ]);
    ctx.drawImage(imgs['earth_map'], -earth_radius, -earth_radius);
    ctx.globalAlpha = 1;



    ctx.restore(); // Restore Rotation
    ctx.restore(); // Restore Position

    window.requestAnimationFrame(draw1);
}

function init1() {
    loadImg('earth_map', 'imgs/earth.png');
    loadImg('apoapsis_img', 'imgs/apoapsis.png');
    loadImg('periapsis_img', 'imgs/periapsis.png');
    loadImg('arrow', 'imgs/arrow.png');
    loadImg('pony', 'imgs/pony.png');

    canvas = document.getElementById('playbox');
    ctx = canvas.getContext('2d');

    global_timestamp = Date.now();

    window.requestAnimationFrame(draw1);
}

function drawPoint(x, y, style) {
    //x = zoomifyInt(x);
    //y = zoomifyInt(y);
    radius = 5; //zoomifyInt(root.radius * 1.1);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = style;
    ctx.fill();
}

function drawUnzoomablePoint(x, y, style) {
    //x = zoomifyInt(x);
    //y = zoomifyInt(y);
    radius = 5 / zoom_level;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = style;
    ctx.fill();
}

function drawQuadraticCurve(x1, y1, x2, y2, style) {
    ctx.beginPath();
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    ctx.strokeStyle = style;
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2, style) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = style;
    ctx.stroke();
}

function drawCircle(x, y, r, style) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.strokeStyle = style;
    ctx.stroke();
}

function drawImage(img, x, y) {
    //console.log(img.width);

    var width = img.width;
    var height = img.height;

    ctx.drawImage(img, x - width / 2, y - height / 2);
}

function drawImageRot(img, x, y, deg) {
    ctx.save();

    var width = img.width;
    var height = img.height;

    //Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    ctx.drawImage(img, width / 2 * (-1), height / 2 * (-1), width, height);

    //reset the canvas  
    //ctx.restore();
    ctx.restore();
    /*ctx.rotate(rad * ( -1 ) );
    ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));*/
}

function drawEllipse(x, y, radiusX, radiusY, rotation, style) {
    ctx.beginPath();

    try {
        ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, 2 * Math.PI);
    } catch (err) {

        ctx.save();
        ctx.rotate(rotation);
        var ratio = radiusY / radiusX;
        ctx.scale(1, ratio);
        drawCircle(x, y, radiusX, style);
        ctx.restore();

    }
    ctx.strokeStyle = style;
    ctx.stroke();
}

function drawHyperbola(semimajoraxis, semiminoraxis, eccentricity, style) {
    var x2g = hyperbolaTrueAnomaly(semimajoraxis, eccentricity, 0);

    var resolution = PI / 50;

    var hypAngle = getRadialCoordinates(semimajoraxis, semiminoraxis);

    for (var t = -hypAngle - PI / 2; t < hypAngle + PI / 2; t += resolution) {
        var x1 = hyperbolaTrueAnomaly(semimajoraxis, eccentricity, t - resolution) * cos(t - resolution);
        var y1 = hyperbolaTrueAnomaly(semimajoraxis, eccentricity, t - resolution) * sin(t - resolution);

        var x2 = hyperbolaTrueAnomaly(semimajoraxis, eccentricity, t) * cos(t);
        var y2 = hyperbolaTrueAnomaly(semimajoraxis, eccentricity, t) * sin(t);

        if (x1 < x2g)
            drawLine(x1, y1, x2, y2, style);
    }
}

function traslateAxis(x, y) {
    ctx.save();
    ctx.translate(x, y);
}

function rotateAxis(t) {
    ctx.save();
    ctx.rotate(t);
}

function rotoTraslateAxis(x, y, t) {
    ctx.save();
    ctx.rotate(t);
    ctx.translate(x, y);
}

function drawAtmosphere(x, y, radius, gradients) {
    var center_x, center_y;
    center_x = center_y = 0;
    var gradient = ctx.createRadialGradient(center_x, center_y, radius, center_x, center_y, 0);
    gradients.forEach(function (obj) {
        gradient.addColorStop(obj[0], obj[1]);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, x + radius * 2, y + radius * 2);
}

function loadImg(name, src) {
    var img = new Image();
    img.src = src;
    imgs[name] = img;
}

var percentColors = [{
    pct: 0.0,
    color: {
        r: 0xff,
        g: 0x00,
        b: 0
    }
}, {
    pct: 0.5,
    color: {
        r: 0xff,
        g: 0xff,
        b: 0
    }
}, {
    pct: 1.0,
    color: {
        r: 0x50,
        g: 0xAA,
        b: 0xff
    }
}];

function zoomify(value) {
    return value * zoom_level;
}

function zoomifyInt(value) {
    return Math.floor(zoomify(value));
}

var getColorForPercentage = function (pct, alpha) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgba(' + [color.r, color.g, color.b, alpha].join(',') + ')';
    // or output as hex if preferred
}

function translate(x, y) {
    ctx.save();
    ctx.translate(zoomifyInt(x), zoomifyInt(y));
}

function proportionReference(pixels) {
    if (zoom_level > 500) {
        return pixels + "px = " + pixels / zoom_level * 1000 + "mm";
    } else if (zoom_level > 1) {
        return pixels + "px = " + pixels / zoom_level * 100 + "cm";
    } else if (zoom_level > 1 / 1E3) {
        return pixels + "px = " + pixels / zoom_level + "m";
    } else if (zoom_level > 1 / 1E11) {
        return pixels + "px = " + pixels / zoom_level / 1000 + "km";
    } else if (zoom_level > 1 / 5E15) {
        return pixels + "px = " + pixels / zoom_level / 149597870700 + "AU";
    } else if (zoom_level > 1 / 1E16) {
        return pixels + "px = " + pixels * zoom_level / 9.4605284E15 + "ly";
    } else {
        return pixels + "px = " + pixels * zoom_level / 3.08567758E16 + "pc";
    }
}




// NEW STUFF






//This function retuns a lesnflare THREE object to be.add() ed to the scene graph

function addLensFlare(x, y, z, size, overrideImage) {
    var flareColor = new THREE.Color(0xffffff);

    lensFlare = new THREE.LensFlare(overrideImage, 700, 0.0, THREE.AdditiveBlending, flareColor);

    //	we're going to be using multiple sub-lens-flare artifacts, each with a different size
    lensFlare.add(textureFlare1, 4096, 0.0, THREE.AdditiveBlending);
    lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
    lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
    lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);

    //	and run each through a function below
    lensFlare.customUpdateCallback = lensFlareUpdateCallback;

    lensFlare.position = new THREE.Vector3(x, y, z);
    lensFlare.size = size ? size : 16000;
    return lensFlare;
}

//	this function will operate over each lensflare artifact, moving them around the screen
function lensFlareUpdateCallback(object) {
    var f, fl = this.lensFlares.length;
    var flare;
    var vecX = -this.positionScreen.x * 2;
    var vecY = -this.positionScreen.y * 2;
    var size = object.size ? object.size : 16000;

    var camDistance = camera.position.length();

    for (f = 0; f < fl; f++) {
        flare = this.lensFlares[f];

        flare.x = this.positionScreen.x + vecX * flare.distance;
        flare.y = this.positionScreen.y + vecY * flare.distance;

        flare.scale = size / camDistance;
        flare.rotation = 0;
    }
}
