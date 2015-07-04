"use strict";

// Globals
var camera, scene, renderer, light;
// Objects
var house, ground, newHouse;
// Mouse positions
var mouseX = 0, mouseY = 0;
// FPS statistics
var stats;
// Keyboard controls
var kcontrols;
// Mouse controls;
var mcontrols;
// boolean to check if we can move the camera
var pressM = false;
// A clock to keep track of time
var clock = new THREE.Clock();
// Global radius and light height
var RADIUS = 250;
var SUN_HEIGHT = 125;

// Define controls for dat.GUI
var Controls = new function() {
    // Environment
    this.shadow = 0.5;
    this.sunGrid = true;
    // Objects
    this.distanceHouse = 15;
    this.distanceNewHouse = 30;

};

function init() {
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        35,                                             // Field of view
        window.innerWidth / window.innerHeight,         // Aspect ratio
        0.1,                                            // Near plane
        10000                                           // Far plane
    );
    camera.position.set( 400, 400, 400 );
    camera.lookAt( scene.position );

    // Configure keyboard controls 
    kcontrols = new THREE.FlyControls( camera );
    kcontrols.movementSpeed = 100;
    kcontrols.domElement = document.body;
    kcontrols.rollSpeed = Math.PI / 24;
    kcontrols.autoForward = false;

    // Configure mouse controls
    //mcontrols = new THREE.OrbitControls( camera );
    //mcontrols.damping = 0.2;
    //mcontrols.addEventListener( 'change', render );

    // Axes
    var axes = buildAxes( 1000 );
    scene.add(axes);

    // Insert custom stuff
    house = buildHouse(10, 10, 10, 15);                 // A house
    scene.add( house );
    newHouse = buildNewHouse(20, 20, 100, 30);          // The house which should be built
    scene.add( newHouse );
    ground = buildGround( RADIUS );                         // The ground
    scene.add( ground );

    // Ambient light to add some indirect lightning to the scene.
    var ambient = new THREE.AmbientLight( 0x404040 );
    scene.add( ambient );

    // Add a light source as 'sun'.
    light = buildLight();
    scene.add(light);

    // Define who is casting and receiving shadows.
    house.castShadow = true;
    house.receiveShadow = true;
    newHouse.castShadow = true;
    newHouse.receiveShadow = true;
    ground.receiveShadow = true;

    // Define renderer settings
    renderer.setClearColor( 0xdddddd, 1);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.render( scene, camera );

    // Add stats view
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild( stats.domElement );

    // Add event listener for mouse movement
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    // Add event listener for key pressing
    document.addEventListener( 'keydown', onKeyDown, false );
}

function render() {
    var delta = clock.getDelta();

    // If we press M on the keyboard, the position of the camera changes.
    if(pressM) {
        camera.position.x += mouseX * 0.05;
        // Returns a value between -1000 and 1000
        camera.position.x = Math.max( Math.min( camera.position.x, 1000 ), -1000 );
        camera.lookAt( scene.position );
    }

    // Speed of sun movement (time for a full loop in seconds)
    var speed = 6;
    var speedScale = (0.001*2*Math.PI)/speed;
    var angle = Date.now()*speedScale;
    light.position.x = Math.sin(angle)*RADIUS;
    light.position.z = Math.cos(angle)*RADIUS;
    light.shadowDarkness = Controls.shadow;
    light.shadowCameraVisible = Controls.sunGrid;

    // Update positions of the houses after change in gui
    house.position.x = Controls.distanceHouse * -1;
    newHouse.position.x = Controls.distanceNewHouse;

    // Update the controls position
    kcontrols.update( delta );

    renderer.render( scene, camera );
}

window.onload = function() {
    var gui = new dat.GUI();

    var f1 = gui.addFolder('Environment');
    gui.add(Controls, 'shadow', { Off : 0.0, Mid : 0.5, Full : 1 });
    gui.add(Controls, 'sunGrid');

    var f2 = gui.addFolder('Objects');
    gui.add(Controls, 'distanceHouse', 0, 100);
    gui.add(Controls, 'distanceNewHouse', 0, 100);

    f1.open();

    init();
    animate();
};
