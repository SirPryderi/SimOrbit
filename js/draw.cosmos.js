var camera, controls, scene, renderer;

function render() {
    root.render(); // This will render the root object (sun or center of the galaxy);

    root.renderChildren(); // This will rendere root children. Warning,  recursion inside!

    /*
    line.geometry.vertices[1].x = moon.x;
    line.geometry.vertices[1].z = moon.y;
    line.geometry.verticesNeedUpdate = true;
    */

    renderer.render(scene, camera);
};

function addObjectsToScene(obj) {
    scene.add(obj.geometry);

    obj.meshes.forEach(function (obji) {
        scene.add(obji);
    });

    obj.childrenObjects.forEach(function (objj) {
        addObjectsToScene(objj);
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

    textureFlare1 = THREE.ImageUtils.loadTexture('imgs/textures/lensflare0.png');
    textureFlare2 = THREE.ImageUtils.loadTexture('imgs/textures/lensflare1.png');
    textureFlare3 = THREE.ImageUtils.loadTexture('imgs/textures/lensflare3.png');
    moonTexture = THREE.ImageUtils.loadTexture('imgs/textures/moon.jpg');

    //  controls.target = (earth.geometry.position);

    var SOPS = new THREE.Geometry();
    SOPS.vertices.push(new THREE.Vector3(0, 0, 0));
    SOPS.vertices.push(gas_giant.geometry.position);

    line = new THREE.Line(SOPS, material);

    focusObject(moon);

    scene.add(cube);

    scene.add(line);

    addLensFlare(0, 0, 0, 5, textureFlare1);

    //camera.up = new THREE.Vector3(0, 0, 1);

    camera.position.y = 5;

    addObjectsToScene(root);

    var light = new THREE.AmbientLight(0x404040); // soft white light
    //scene.add(light);


    var light = new THREE.PointLight(0xffcccc, 4, 0);
    light.position.set(0, 0, 0);
    scene.add(light);


    var moonMat = new THREE.MeshPhongMaterial({
        map: moonTexture
    });

    moon.geometry.material = moonMat;

    animate();

    //global_timestamp = Date.now();

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();

}
