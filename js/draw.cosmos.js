function draw2() {
    ctx.globalCompositeOperation = 'destination-over';
    //ctx.globalCompositeOperation = 'source-over';

    canvas.height = $('#playbox').height();
    canvas.width = $('#playbox').width();

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeStyle = 'rgba(0,153,255,0.4)';




    if (zoom_level != 1) {
        ctx.scale(zoom_level, zoom_level);
    }



    //drawUnzoomablePoint(0, 0, "yellow");

    //Move axis to the middle with the camera offset. 
    //translate()
    ctx.save();
    //ctx.translate(Math.floor(canvas.width / 2) - zoomifyInt(camera_position.x), Math.floor(canvas.height / 2) - zoomifyInt(camera_position.y));



    ctx.translate(Math.floor(canvas.width / 2) / zoom_level - camera_position.x, Math.floor(canvas.height / 2) / zoom_level - camera_position.y);



    root.render(); // This will render the root object (sun or center of the galaxy);

    root.renderChildren(); // This will rendere root children. Warning,  recursion inside!

    drawUnzoomablePoint(0, 0, "green"); // This will render a pinpoint az (0,0);

    //planetoid.lookAt();
    planetoid.lookAt();

    ctx.restore(); // Restore Position

    window.requestAnimationFrame(draw2);

    //console.log(proportionReference(1));
}

function init2() {
    canvas = document.getElementById('playbox');
    ctx = canvas.getContext('2d');

    global_timestamp = Date.now();

    window.requestAnimationFrame(draw2);
}
