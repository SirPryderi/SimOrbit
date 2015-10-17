var camera, controls, scene, renderer;

var cross;

function init2() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

    controls = new THREE.OrbitControls(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('here').appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    var cube = new THREE.Mesh(geometry, material);


    var curve = new THREE.EllipseCurve(
        //asd
        planetoid.focus, 0, // ax, aY
        planetoid.semimajoraxis, planetoid.semiminoraxis, // xRadius, yRadius
        0, 2 * Math.PI, // aStartAngle, aEndAngle
        false, // aClockwise
        0 // aRotation 
    );

    var path = new THREE.Path(curve.getPoints(100));
    var geometry = path.createPointsGeometry(100);
    var material = new THREE.LineBasicMaterial({
        color: 0xff0000
    });

    // Create the final Object3d to add to the scene
    var ellipse = new THREE.Line(geometry, material);

    //scene.add(cube);

    camera.up = new THREE.Vector3(0, 0, 1);

    camera.position.y = 5;

    scene.add(ellipse);

    scene.add(cube);

    scene.add(root.geometry);

    scene.add(planetoid.geometry);

    console.log(planetoid.geometry);

    //root.chi

    ellipse.rotation.x += Math.PI;

    var render = function () {
        requestAnimationFrame(render);

        root.render(); // This will render the root object (sun or center of the galaxy);

        root.renderChildren(); // This will rendere root children. Warning,  recursion inside!

        renderer.render(scene, camera);

        //render();
    };

    render();

    global_timestamp = Date.now();
}

function animate() {

    requestAnimationFrame(animate);
    controls.update();

}
