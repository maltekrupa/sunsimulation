"use strict";

// Globals
var camera, scene, renderer;
// Mouse positions
var mouseX = 0, mouseY = 0;
// FPS statistics
var stats;
// boolean to check if we can move the camera
var spacePressed = false;
// A clock to keep track of time
var clock = new THREE.Clock();

// Define controls for dat.GUI
var controls = new function() {
    this.light = 0;
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
    camera.position.set( 75, 75, 75 );
    camera.lookAt( scene.position );

    // Axes
    var axes = buildAxes( 1000 );
    scene.add(axes);

    // Insert custom stuff
    var house = buildHouse(10, 10, 10, 15);                 // A house
    scene.add( house );
    var newHouse = buildNewHouse(20, 20, 100, 30);          // The house which should be built
    scene.add( newHouse );
    var ground = buildGround( 200 );                         // The ground
    scene.add( ground );

    var ambient = new THREE.AmbientLight( 0x444444 );
    scene.add( ambient );

    var light = buildLight();
    scene.add(light);

    house.castShadow = true;
    ground.receiveShadow = true;

    renderer.setClearColor( 0xdddddd, 1);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
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
    if(spacePressed) {
        camera.position.x += mouseX * 0.05;
        camera.position.x = Math.max( Math.min( camera.position.x, 1000 ), -1000 );
        camera.lookAt( scene.position );
        camera.updateProjectionMatrix();
    }

    renderer.render( scene, camera );
}

function animate() {
    // Update view related information
    render();
    // Update statistics of FPV
    stats.update();

    requestAnimationFrame( animate );
}

function buildLight() {
    // Lights
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 2, 2);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadowDarkness = 0.5;
    light.shadowCameraVisible = true; // only for debugging
    // these six values define the boundaries of the yellow box seen above
    light.shadowCameraNear = 2;
    light.shadowCameraFar = 5;
    light.shadowCameraLeft = -0.5;
    light.shadowCameraRight = 0.5;
    light.shadowCameraTop = 0.5;
    light.shadowCameraBottom = -0.5;

    return light
}

function buildHouse( x, y, z, distanceFromCenter ) {
    var geometry = new THREE.BoxGeometry( x, y, z );
    var material = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = distanceFromCenter * -1;
    mesh.position.y = y/2;
    mesh.position.z = 0;
    return mesh;
}

function buildNewHouse( x, y, z, distanceFromCenter ) {
    var geometry = new THREE.BoxGeometry( x, y, z );
    var material = new THREE.MeshLambertMaterial( { color: 0xFFFFA0 } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = distanceFromCenter;
    mesh.position.y = y/2;
    mesh.position.z = 0;
    return mesh;
}

function buildGround( radius ) {
    var segments = 128;
    var geometry = new THREE.CircleGeometry( radius, segments );
    var material = new THREE.MeshLambertMaterial( { color: 0x008000 } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = 0;
    mesh.position.y = -1;
    mesh.position.z = 0;
    mesh.rotation.x = (Math.PI / 2) * -1;
    return mesh;
}

function buildAxes( length ) {
    var axes = new THREE.Object3D();

    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

    return axes;
}

function buildAxis( src, dst, colorHex, dashed ) {
    var geom = new THREE.Geometry(),
        mat; 

    if(dashed) {
        mat = new THREE.LineDashedMaterial({ linewidth: 1, color: colorHex, dashSize: 0.5, gapSize: 0.5 });
    } else {
        mat = new THREE.LineBasicMaterial({ linewidth: 1, color: colorHex });
    }

    geom.vertices.push( src.clone() );
    geom.vertices.push( dst.clone() );
    geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

    var axis = new THREE.Line( geom, mat, THREE.LinePieces );

    return axis;
}

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - window.innerWidth / 2 );
    mouseY = ( event.clientY - window.innerHeight / 2 );
}

function onKeyDown( event ) {
      var keyCode = event.keyCode;
      if(keyCode==77) {
          if(spacePressed) {
              spacePressed = false;
          } else {
              spacePressed = true;
          }
      }
}

window.onload = function() {
    init();
    animate();
};
