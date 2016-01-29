var camera, controls, scene, renderer;

function init2() {
    setUpRenderer();

    //setUpTexture();

    //  controls.target = (earth.geometry.position);

    /*
    var SOPS = new THREE.Geometry();
    SOPS.vertices.push(new THREE.Vector3(0, 0, 0));
    SOPS.vertices.push(gas_giant.geometry.position);
    
    line = new THREE.Line(SOPS, material);
    */

    //addLensFlare(0, 0, 0, 5, textureFlare1);

    //camera.up = new THREE.Vector3(0, 0, 1);

    //var light = new THREE.AmbientLight(0x404040); // soft white light
    //scene.add(light);

    var light = new THREE.PointLight(0xffcccc, 4, 0);
    light.position.set(0, 0, 0);
    scene.add(light);

    //moon.geometry.material = moonMat;

    root.render(); // This will render the root object (sun or center of the galaxy);

    root.renderChildren(); // This will rendere root children. Warning,  recursion inside!

    //////////////////////////

    scene.add(particle.geometry);

    focusObject(earth);

    addObjectsToScene(root);

    animate();

    //global_timestamp = Date.now();
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

function render() {
    particle.renderPhysics();

    particle.drawOrbit();

    root.renderChildren();

    /*
    line.geometry.vertices[1].x = moon.x;
    line.geometry.vertices[1].z = moon.y;
    line.geometry.verticesNeedUpdate = true;
    */

    //console.log(earth.getOrbitalVelocity() + "\t", hypotenuse(earth.velocity.y, earth.velocity.y));

    renderer.render(scene, camera);
};

function addObjectsToScene(obj) {
    scene.add(obj.geometry);

    obj.meshes.forEach(function (obji) {
        obj.parentObject.geometry.add(obji);
    });

    obj.childrenObjects.forEach(function (objj) {
        addObjectsToScene(objj);
    });
}

function setUpRenderer() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000e200);

    controls = new THREE.OrbitControls(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('here').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function setUpTexture() {
    THREE.ImageUtils.crossOrigin = '';

    textureFlare1 = THREE.ImageUtils.loadTexture('imgs/textures/lensflare0.png');
    textureFlare2 = THREE.ImageUtils.loadTexture('imgs/textures/lensflare1.png');
    textureFlare3 = THREE.ImageUtils.loadTexture('imgs/textures/lensflare3.png');
    moonTexture = THREE.ImageUtils.loadTexture('imgs/textures/moon.jpg');
}
