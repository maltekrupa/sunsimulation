"use strict";

// Globals
var camera, scene, renderer, light, views, view, gui;
// Windows size
var windowWidth, windowHeight;
// Objects
var houseDae, ground, newHouse;
// Mouse positions
var mouseX = 0, mouseY = 0;
// Time and date
var currentTime;
// Text object to show date and time
var textParams, textMaterial, textOfTime, objectOfTime;
// FPS statistics
var stats;
// Keyboard controls
var kcontrols;
// Mouse controls;
var mcontrols;
// boolean to check if we can move the camera
var pressM = false, pressSpace = true;
// A clock to keep track of the time
var clock, time, delta, tmpDelta = 0.0;
// Global radius and light height
var RADIUS = 400;
var SUN_HEIGHT = 125;

// Define controls for dat.GUI
var Controls = new function() {
    // Environment
    this.shadow = 0.5;
    this.sunGrid = true;
    this.fog = 0.001;
    // Date/Time
    this.day = 1;
    this.month = 1;
    this.year = 2000;
    this.hour = 18;
    this.minute = 27;
    this.delta = 'm';
    // Objects
    this.distanceHouse = 15;
    this.distanceNewHouse = 30;

};

var views = [
    {
        left: 0,
        bottom: 0,
        width: 0.5,
        height: 1.0,
        eye: [ 400, 400, 400 ],
        up: [ 0, 1, 0 ],
        fov: 60,
        updateCamera: function ( camera, scene, mouseX, mouseY ) {
        }
    },
    {
        left: 0.5,
        bottom: 0,
        width: 0.5,
        height: 0.5,
        eye: [ 0, 200, 0 ],
        up: [ 0, 1, 0 ],
        fov: 45,
        updateCamera: function ( camera, scene, mouseX, mouseY ) {
        //  camera.position.x -= mouseX * 0.05;
        //  camera.position.x = Math.max( Math.min( camera.position.x, 2000 ), -2000 );
            camera.lookAt( scene.position );
        }
    },
    {
        left: 0.5,
        bottom: 0.5,
        width: 0.5,
        height: 0.5,
        eye: [ -19.6, 4.7, 5.1 ],
        up: [ 0, 1, 0 ],
        fov: 60,
        updateCamera: function ( camera, scene, mouseX, mouseY ) {
            if(pressM) {
                camera.position.x += mouseX * 0.05;
                camera.position.x = Math.max( Math.min( camera.position.x, 2000 ), -2000 );
            }
            camera.lookAt(new THREE.Vector3(0,10,0));
        }
    }
];

function loadHouse() {
    var loader = new THREE.ColladaLoader();

    //loader.options.convertUpAxis = true;
    loader.load( 'house.dae', function ( house ) {

        // Grab the collada scene data:
        houseDae = house.scene;
        houseDae.rotation.y = (Math.PI / 2) * 1
        houseDae.scale.x = houseDae.scale.y = houseDae.scale.z = 0.02;
        houseDae.position.x = 15 * -1;
        houseDae.position.y = 0;
        houseDae.position.z = 0;
        //scene.add(house.scene);
        // Scale-up the model so that we can see i
        //dae.scale.x = dae.scale.y = dae.scale.z = 25.0;
        init();
        animate();
    });

}



function init() {
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xA8A8A8, 0.001 );

    // Camera
    for (var ii =  0; ii < views.length; ++ii ) {
        view = views[ii];
        camera = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.x = view.eye[ 0 ];
        camera.position.y = view.eye[ 1 ];
        camera.position.z = view.eye[ 2 ];
        camera.up.x = view.up[ 0 ];
        camera.up.y = view.up[ 1 ];
        camera.up.z = view.up[ 2 ];
        camera.lookAt( scene.position );
        if(ii == 2){
            camera.lookAt(new THREE.Vector3(0,10,0));
        }
        view.camera = camera;
    }

    // A clock object to access the THREEjs clock
    clock = new THREE.Clock();

    // A currentTime dateobject for the simulated time
    currentTime = moment();

    // Update GUI time and date to current values
    Controls.day    = currentTime.date();
    Controls.month  = currentTime.month() + 1;
    Controls.year   = currentTime.year();
    Controls.hour   = currentTime.hour();
    Controls.minute = currentTime.minute();

    // Configure keyboard controls 
    kcontrols = new THREE.FlyControls( views[0].camera );
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

    scene.add(houseDae);
    // Insert custom stuff
    newHouse = buildNewHouse(20, 20, 100, 30);          // The house which should be built
    scene.add( newHouse );
    ground = buildGround( RADIUS );                         // The ground
    scene.add( ground );

    // Create text of current simulation time
    textParams = {
        size:           15,    // size of the text
        height:     0.5,   // thickness to extrude text
        curveSegments: 3,       // number of points on the curves
        font:           'helvetiker',       // font name
        weight:         'normal',       // font weight (normal, bold)
        style:      'normal',       // font style  (normal, italics)
    }
    textMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    textOfTime = new THREE.TextGeometry(currentTime.toString(), textParams);
    objectOfTime = new THREE.Mesh(textOfTime, textMaterial); 
    objectOfTime.position.x = RADIUS/4;
    objectOfTime.position.z = 30;
    objectOfTime.rotation.x = (Math.PI / 2) * -1;
    scene.add(objectOfTime);

    // Ambient light to add some indirect lightning to the scene.
    var ambient = new THREE.AmbientLight( 0x404040 );
    scene.add( ambient );

    // Add a light source as 'sun'.
    light = buildLight();
    scene.add(light);

    // Define who is casting and receiving shadows.
    houseDae.castShadow = true;
    houseDae.receiveShadow = true;
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

function animate() {
    // Request new frame from browser
    requestAnimationFrame( animate );
    // Update statistics of FPV
    stats.update();

    // The time since the last frame
    delta = clock.getDelta();
    // The time sind intantiation the clock
    time = clock.getElapsedTime();

    // Update positions of the houses after change in gui
    houseDae.position.x = Controls.distanceHouse * -1;
    newHouse.position.x = Controls.distanceNewHouse;

    // Update the controls position
    kcontrols.update( delta );

    // Renew fog
    scene.fog.density = Controls.fog;

    // If the simulation is in pause mode, we don't change the sun and don't update time
    if(pressSpace) {
        currentTime.add(delta, Controls.delta);
        tmpDelta += delta;

        // Speed of sun movement (time for a full loop in seconds)
        var transformDate = currentTime.toDate();
        light.position.x = SunCalcCartesian.getX(transformDate, 50.111512, 8.680506);
        light.position.y = SunCalcCartesian.getY(transformDate, 50.111512, 8.680506);
        light.position.z = SunCalcCartesian.getZ(transformDate, 50.111512, 8.680506);
        light.shadowDarkness = Controls.shadow;
    }

    // Change visibility of sun grid
    light.shadowCameraVisible = Controls.sunGrid;

    // Update the current time
    updateTimeText();

    // Iterate over all gui controllers to update their values
    for (var i in dat.gui.__controllers) {
        gui.__controllers[i].updateDisplay();
    }

    console.log(views[0].camera.position);
    render();
}

function render() {
    updateSize();

    for ( var ii = 0; ii < views.length; ++ii ) {

        view = views[ii];
        camera = view.camera;

        view.updateCamera( camera, scene, mouseX, mouseY );

        var left   = Math.floor( windowWidth  * view.left );
        var bottom = Math.floor( windowHeight * view.bottom );
        var width  = Math.floor( windowWidth  * view.width );
        var height = Math.floor( windowHeight * view.height );
        renderer.setViewport( left, bottom, width, height );
        renderer.setScissor( left, bottom, width, height );
        renderer.enableScissorTest ( true );
        renderer.setClearColor( view.background );

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.render( scene, camera );
    }

    renderer.render( scene, camera );
}

window.onload = function() {
    gui = new dat.GUI();

    var f1 = gui.addFolder('Environment');
    f1.add(Controls, 'shadow', { Off : 0.0, Mid : 0.5, Full : 1 });
    f1.add(Controls, 'sunGrid');
    f1.add(Controls, 'fog', 0.001, 0.0025).step(0.0001);
    var f11 = gui.addFolder('Date/Time');
    f11.add(Controls, 'day', 1, 31).step(1).listen();
    f11.add(Controls, 'month', 1, 12).step(1).listen();
    f11.add(Controls, 'year', 1900, 2100).step(1).listen();
    f11.add(Controls, 'hour', 0, 23).step(1).listen();
    f11.add(Controls, 'minute', 0, 59).step(1).listen();
    f11.add(timeButton, 'set');
    f11.add(Controls, 'delta', { '1 min' : 'm', '1 hour' : 'h' });

    var f2 = gui.addFolder('Objects');
    f2.add(Controls, 'distanceHouse', 0, 100);
    f2.add(Controls, 'distanceNewHouse', 0, 100);

    f1.open();

    loadHouse();

};
