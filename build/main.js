console.log('Voyager 1 ThreeJS');

var app = app || {};

var trajectoryPoints = [];

$.ajax({
  url: "build/voyagerTrajectory.json",
  data: {
   format: 'json'
  }
})
.done( function( data ) {
    for (var i = 0; i < data.length; i = i+13) {
      trajectoryPoints.push(new THREE.Vector3(
        data[i]["x"],
        data[i]["y"],
        data[i]["z"]
      ));
    }
    var catmull = new THREE.CatmullRomCurve3( trajectoryPoints );
    app.line = app.createLineFromSpline( catmull );
    app.line.rotation.z = Math.PI / 2;
    app.scene.add( app.line );
})

app.init = function(){

  app.width = window.innerWidth;
  app.height = window.innerHeight;
  app.up = new THREE.Vector3( 0, 1, 0 );

  app.scene = new THREE.Scene();

  //Axes
  app.axes = new THREE.AxisHelper( 2000 );
  app.scene.add( app.axes );

  // Renderer
  app.renderer = new THREE.WebGLRenderer();
  app.renderer.setSize( app.width, app.height );
  app.renderer.setClearColor( 0x000000, 1 )

  // Camera has: field of view, ratio, near, far
  app.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000000000)
  app.camera.lookAt( app.planetStart[5]["x"], app.planetStart[5]["z"], app.planetStart[5]["y"]);
  app.camera.position.set(10000,9000,0);

  app.scene.add( app.camera );

  // // // Get a point a short distance ahead along the spline, and move camera to that point
  // var newCameraPos = app.spline.getPoint( app.controller.cameraPosIndex / 3000 );
  // app.camera.position.set(newCameraPos.x, newCameraPos.y, newCameraPos.z  );
  //
  // // Get tanget to that point, and set camera rotatation and focus so it's always looking along the track
  // var newCameraRot = app.spline.getTangent( app.controller.cameraPosIndex / 3000);
  // app.camera.rotation.set(newCameraRot.x, newCameraRot.y, newCameraRot.z);
  // var newCameraLookAt = app.spline.getPoint( (app.controller.cameraPosIndex + 1) / 3000 ); // look 1 step ahead of current position
  // app.camera.lookAt( newCameraLookAt );


  // Add lights
  app.spotlight = app.createSpotlight();
  app.scene.add( app.spotlight );

  app.ambient = new THREE.AmbientLight( 0x555555 );
  app.scene.add( app.ambient );

  app.scene.add(sunPoint);
  app.scene.add(new THREE.PointLightHelper(sunPoint, 3));

  // Add Sun
  app.sun = app.createSun();
  app.scene.add( app.sun );

  //Add Planets
  app.mercury = app.createPlanet( app.planetData[0]["orbitalRadius"], app.planetData[0]["planetRadius"], app.planetStart[0]["x"], app.planetStart[0]["y"], app.planetStart[0]["z"] );
  app.scene.add( app.mercury );
  app.venus = app.createPlanet( app.planetData[1]["orbitalRadius"], app.planetData[1]["planetRadius"], app.planetStart[1]["x"], app.planetStart[1]["y"], app.planetStart[1]["z"]  );
  app.scene.add( app.venus );
  app.earth = app.createPlanet( app.planetData[2]["orbitalRadius"], app.planetData[2]["planetRadius"], app.planetStart[2]["x"], app.planetStart[2]["y"], app.planetStart[2]["z"]  );
  app.scene.add( app.earth );
  app.mars = app.createPlanet( app.planetData[3]["orbitalRadius"], app.planetData[3]["planetRadius"], app.planetStart[3]["x"], app.planetStart[3]["y"], app.planetStart[3]["z"]  );
  app.scene.add( app.mars );
  app.jupiter = app.createPlanet( app.planetData[4]["orbitalRadius"], app.planetData[4]["planetRadius"], app.planetStart[4]["x"], app.planetStart[4]["y"], app.planetStart[4]["z"]  );
  app.scene.add( app.jupiter );
  app.saturn = app.createPlanet( app.planetData[5]["orbitalRadius"], app.planetData[5]["planetRadius"], app.planetStart[5]["x"], app.planetStart[5]["y"], app.planetStart[5]["z"]  );
  app.scene.add( app.saturn );
  app.uranus = app.createPlanet( app.planetData[6]["orbitalRadius"], app.planetData[6]["planetRadius"], app.planetStart[6]["x"], app.planetStart[6]["y"], app.planetStart[6]["z"]  );
  app.scene.add( app.uranus );
  app.neptune = app.createPlanet( app.planetData[7]["orbitalRadius"], app.planetData[7]["planetRadius"], app.planetStart[7]["x"], app.planetStart[7]["y"], app.planetStart[7]["z"]  );
  app.scene.add( app.neptune );
  app.pluto = app.createPlanet( app.planetData[8]["orbitalRadius"], app.planetData[8]["planetRadius"], app.planetStart[8]["x"], app.planetStart[8]["y"], app.planetStart[8]["z"]  );
  app.scene.add( app.pluto );

  // Lines showing orbits - could put in loop, but wont for time being in case explicit circles needed for animation
  app.mercuryOrbit = app.createCircle( app.planetData[0]["orbitalRadius"], app.planetData[0]["angle"] );
  app.scene.add( app.mercuryOrbit )
  app.venusOrbit = app.createCircle( app.planetData[1]["orbitalRadius"], app.planetData[1]["angle"] );
  app.scene.add( app.venusOrbit )
  app.earthOrbit = app.createCircle( app.planetData[2]["orbitalRadius"], app.planetData[2]["angle"] );
  app.scene.add( app.earthOrbit )
  app.marsOrbit = app.createCircle( app.planetData[3]["orbitalRadius"], app.planetData[3]["angle"] );
  app.scene.add( app.marsOrbit )
  app.jupiterOrbit = app.createCircle( app.planetData[4]["orbitalRadius"], app.planetData[4]["angle"] );
  app.scene.add( app.jupiterOrbit )
  app.saturnOrbit = app.createCircle( app.planetData[5]["orbitalRadius"], app.planetData[5]["angle"] );
  app.scene.add( app.saturnOrbit )
  app.uranusOrbit = app.createCircle( app.planetData[6]["orbitalRadius"], app.planetData[6]["angle"] );
  app.scene.add( app.uranusOrbit )
  app.neptuneOrbit = app.createCircle( app.planetData[7]["orbitalRadius"], app.planetData[7]["angle"] );
  app.scene.add( app.neptuneOrbit )
  app.plutoOrbit = app.createCircle( app.planetData[8]["orbitalRadius"], app.planetData[8]["angle"] );
  app.scene.add( app.plutoOrbit )

  // Path for planets to travel along
  var path2 = new THREE.Path( app.earthOrbit.getPoints( 100 ) );
   geometrycirc = path2.createPointsGeometry( 100 );
  var materialcirc = new THREE.LineBasicMaterial( {
      color : 0xff0000
  } );
  var ellipse = new THREE.Line( geometrycirc, materialcirc );
        ellipse.position.set(0,0,0);
        scene.add( ellipse );

  //Add the stars to the scen
  app.stars = app.createStars()
  app.scene.add( app.stars )

  //Orbital controls to move around space
  app.controls = new THREE.OrbitControls( app.camera, app.renderer.domElement );
  app.controls.target.set( app.planetStart[5]["x"], app.planetStart[5]["y"], app.planetStart[5]["z"] );

  // Attach renderer to the page
  document.getElementById("output").appendChild( app.renderer.domElement );

  // Specifying the scene and camera to the renderer
  app.renderer.render( app.scene, app.camera );

  app.animate();

}

app.planetStart =
[{"planet":"Mercury","x":45859.30206,"z":-24871.42391,"y":6233.548795},
{"planet":"Venus","x":-65258.69018,"z":85252.38576,"y":4945.556007},
{"planet":"Earth","x":-146190.7322,"z":-31428.35831,"y":2},
{"planet":"Mars","x":81025.07905,"z":212285.9608,"y":2476.622669},
{"planet":"Jupiter","x":70537.26601,"z":774559.7634,"y":17533.545905},
{"planet":"Saturn","x":-1088636.062,"z":840858.7392,"y":29015.01566},
{"planet":"Uranus","x":-2067029.369,"z":-1861760.835,"y":19855.84114},
{"planet":"Neptune","x":-1134492.103,"z":-4383695.487,"y":116203.7514},
{"planet":"Pluto","x":-4225812.662,"z":-1060539.951,"y":1336833.515}]

app.planetData =
  [{"planet":"Mercury","orbitalRadius":57900.00,"planetRadius":2.44, "angle":1.446878},
  {"planet":"Venus","orbitalRadius":108200.00,"planetRadius":6.05, "angle":1.5116297},
  {"planet":"Earth","orbitalRadius":149600.00,"planetRadius":6.38, "angle":1.5708},
  {"planet":"Mars","orbitalRadius":227900.00,"planetRadius":3.39, "angle":1.5385077},
  {"planet":"Jupiter","orbitalRadius":778300.00,"planetRadius":71.40, "angle":1.5479325},
  {"planet":"Saturn","orbitalRadius":1427000.00,"planetRadius":60.33, "angle":1.5273376},
  {"planet":"Uranus","orbitalRadius":2871000.00,"planetRadius":25.56, "angle":1.5591026},
  {"planet":"Neptune","orbitalRadius":4497100.00,"planetRadius":24.30, "angle":1.5416493},
  {"planet":"Pluto","orbitalRadius":5913000.00,"planetRadius":1.14, "angle":1.27409}];

app.createSpotlight = function(){
  var spotlight = new THREE.SpotLight( 0xFFFFFF );
  spotlight.position.set( 6300000, 60, 10 );
  return spotlight;
};

app.createSun = function(){
  var sphereGeometry = new THREE.SphereGeometry( 695.7, 30, 30 );  // radius, X and Y segments to approximate sphere with
  var material  = new THREE.MeshPhongMaterial({
    transparent: true,
      opacity: 0.85, // 0.8
  })
  material.map = THREE.TextureLoader('assets/sun_detailed.png')
  material.bumpMap = THREE.TextureLoader('assets/sun-alpha-2k.jpg')
  material.bumpScale = 0.05
  var sun = new THREE.Mesh( sphereGeometry, material );
  sun.position.set( 0,0,0 );
  return sun;
};

app.createPlanet = function( orbit, radius, xPosition, yPosition, zPosition ){
  var sphereGeometry = new THREE.SphereGeometry( 2000, 30, 30 );
  var material  = new THREE.MeshPhongMaterial()
  material.map = THREE.TextureLoader('assets/sun_detailed.png')
  var planet = new THREE.Mesh( sphereGeometry, material );
  planet.position.set( xPosition, yPosition, zPosition );
  return planet;
};

app.createLineFromSpline = function( spline ){
  var lineMaterial = new THREE.LineBasicMaterial({
    color: 0xFF00F0
  });
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices = spline.getPoints( 10000 );
  var line = new THREE.Line( lineGeometry, lineMaterial );

  return line;
};

// Create circle orbit
app.createCircle = function( radius, angle ){
  var segments = 100;
  var material = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );
  var geometry = new THREE.CircleGeometry( radius, segments ).rotateX(angle).rotateZ(Math.PI);

  geometry.vertices.shift();
  // Work around to fix missing segment in circle
  geometry.vertices.push( geometry.vertices[0].clone() )

  var circle = new THREE.Line( geometry, material );

  return circle
}

var sunPoint = new THREE.PointLight(0xffe600, 3, 150);
sunPoint.position.set( 0, 350, 0 );


app.animate = function(){
  app.renderer.render( app.scene, app.camera );
  requestAnimationFrame( app.animate );

  //Animate Mercury
  // app.mercury.position.x = mercuryx;
  // app.mercury.position.z = mercury;
};



app.createStars = function(){
  var distance = 500000000;
  var geometry = new THREE.Geometry();

  for (var i = 0; i < 100000; i++) {

      var vertex = new THREE.Vector3();

      var theta = THREE.Math.randFloatSpread(360);
      var phi = THREE.Math.randFloatSpread(360);

      vertex.x = distance * Math.sin(theta) * Math.cos(phi);
      vertex.y = distance * Math.sin(theta) * Math.sin(phi);
      vertex.z = distance * Math.cos(theta);

      geometry.vertices.push(vertex);
  }
  return new THREE.Points(geometry, new THREE.PointsMaterial({color: 0xffffff}));
  particles.boundingSphere = 50;
}

app.onResize = function(){
  app.width = window.innerWidth;
  app.height = window.innerHeight;
  app.camera.aspect = app.width / app.height;
  app.camera.updateProjectionMatrix();
  app.renderer.setSize(app.width, app.height);
}
window.addEventListener("resize", app.onResize, false);

window.onload = app.init;
