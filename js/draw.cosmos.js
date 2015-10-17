var camera, controls, scene, renderer;

var cross;

function addObjectsToScene(obj) {
    scene.add(obj.geometry);
    obj.childrenObjects.forEach(function (obj) {
        addObjectsToScene(obj);
    });
}

function init2() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000e200);

    controls = new THREE.OrbitControls(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('here').appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    var cube = new THREE.Mesh(geometry, material);

    cube.position.x = 5;
    cube.position.y = 5;



    var curve = new THREE.EllipseCurve(
        //asd
        gas_giant.focus, 0, // ax, aY
        gas_giant.semimajoraxis, gas_giant.semiminoraxis, // xRadius, yRadius
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


    var SOPS = new THREE.Geometry();
    SOPS.vertices.push(new THREE.Vector3(0, 0, 0));
    SOPS.vertices.push(gas_giant.geometry.position);

    var line = new THREE.Line(SOPS, material);

    scene.add(cube);

    scene.add(line);

    camera.up = new THREE.Vector3(0, 0, 1);

    camera.position.y = 5;

    scene.add(ellipse);

    addObjectsToScene(root);

    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);


    var light = new THREE.PointLight(0xffcccc, 4, 0);
    light.position.set(0, 0, 0);
    light.castShadow = true;
    scene.add(light);

    ellipse.rotation.x += Math.PI;



    var render = function () {
        requestAnimationFrame(render);

        root.render(); // This will render the root object (sun or center of the galaxy);

        root.renderChildren(); // This will rendere root children. Warning,  recursion inside!

        line.geometry.vertices[1].x = star.x;
        line.geometry.vertices[1].y = star.y;
        line.geometry.verticesNeedUpdate = true;


        camera.lookAt(earth.geometry.position);


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
