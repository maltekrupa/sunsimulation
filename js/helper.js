function animate() {
    // Update view related information
    render();
    // Update statistics of FPV
    stats.update();

    requestAnimationFrame( animate );
}

function buildLight() {
    // Lights
    var light = new THREE.SpotLight(0xffffff);
    light.position.set(RADIUS, SUN_HEIGHT, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadowDarkness = Controls.shadow;
    light.shadowCameraVisible = true; // only for debugging

    // these six values define the boundaries of the yellow box seen above
    light.shadowCameraNear = 4;
    light.shadowCameraFar = RADIUS*2;
    light.shadowCameraLeft = -RADIUS;
    light.shadowCameraRight = RADIUS;
    light.shadowCameraTop = RADIUS;
    light.shadowCameraBottom = -RADIUS;

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
    mesh.position.y = 0;
    mesh.position.z = 0;
    mesh.rotation.x = (Math.PI / 2) * -1;
    return mesh;
}

function buildAxes( length ) {
    var axes = new THREE.Object3D();

    axes.add( buildAxis( new THREE.Vector3( 0, 0.2, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
    axes.add( buildAxis( new THREE.Vector3( 0, 0.2, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
    axes.add( buildAxis( new THREE.Vector3( 0, 0.2, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0.2, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0.2, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
    axes.add( buildAxis( new THREE.Vector3( 0, 0.2, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

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
      // M is pressed
      if(keyCode==77) {
          if(pressM) {
              pressM = false;
          } else {
              pressM = true;
          }
      }
}
