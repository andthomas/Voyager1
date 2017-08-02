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
    for (var i = 0; i < 539; i = i+20) {
      trajectoryPoints.push(new THREE.Vector3(
        data[i].x,
        data[i].y,
        data[i].z
      ));
    }
    for (var i = 539; i < data.length; i = i+100) {
      trajectoryPoints.push(new THREE.Vector3(
        data[i].x,
        data[i].y,
        data[i].z
      ));
    }
    var catmull = new THREE.CatmullRomCurve3( trajectoryPoints );
    // debugger;
    app.line = app.createLineFromSpline( catmull );
    // app.line.rotation.y = 1.5 * Math.PI;
    app.scene.add( app.line );
})

var mercuryPath, venusPath, earthPath, marsPath, jupiterPath, saturnPath, uranusPath, neptunePath, plutoPath;
var t = 0.9663;
var mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto;

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
  mercury = app.createPlanet( app.planetData[0]["orbitalRadius"], app.planetData[0]["planetRadius"], app.planetStart[0]["x"], app.planetStart[0]["y"], app.planetStart[0]["z"] );
  app.scene.add( mercury );
  venus = app.createPlanet( app.planetData[1]["orbitalRadius"], app.planetData[1]["planetRadius"], app.planetStart[1]["x"], app.planetStart[1]["y"], app.planetStart[1]["z"]  );
  app.scene.add( venus );
  earth = app.createPlanet( app.planetData[2]["orbitalRadius"], app.planetData[2]["planetRadius"], app.planetStart[2]["x"], app.planetStart[2]["y"], app.planetStart[2]["z"]  );
  app.scene.add( earth );
  mars = app.createPlanet( app.planetData[3]["orbitalRadius"], app.planetData[3]["planetRadius"], app.planetStart[3]["x"], app.planetStart[3]["y"], app.planetStart[3]["z"]  );
  app.scene.add( mars );
  jupiter = app.createPlanet( app.planetData[4]["orbitalRadius"], app.planetData[4]["planetRadius"], app.planetStart[4]["x"], app.planetStart[4]["y"], app.planetStart[4]["z"]  );
  app.scene.add( jupiter );
  saturn = app.createPlanet( app.planetData[5]["orbitalRadius"], app.planetData[5]["planetRadius"], app.planetStart[5]["x"], app.planetStart[5]["y"], app.planetStart[5]["z"]  );
  app.scene.add( saturn );
  uranus = app.createPlanet( app.planetData[6]["orbitalRadius"], app.planetData[6]["planetRadius"], app.planetStart[6]["x"], app.planetStart[6]["y"], app.planetStart[6]["z"]  );
  app.scene.add( uranus );
  neptune = app.createPlanet( app.planetData[7]["orbitalRadius"], app.planetData[7]["planetRadius"], app.planetStart[7]["x"], app.planetStart[7]["y"], app.planetStart[7]["z"]  );
  app.scene.add( neptune );
  pluto = app.createPlanet( app.planetData[8]["orbitalRadius"], app.planetData[8]["planetRadius"], app.planetStart[8]["x"], app.planetStart[8]["y"], app.planetStart[8]["z"]  );
  app.scene.add( pluto );

  // {"year":1979,"doy":50,"y":10000,"z":-472729,"x":626815},

  testPlanet = app.createPlanet( 1000, 20000, 611855, 10000, -427850  );
  app.scene.add( testPlanet );

  // Lines showing orbits - could put in loop, but wont for time being in case explicit circles needed for animation
  app.mercuryOrbit = app.createCircle( app.planetData[0]["orbitalRadius"], app.planetData[0]["angle"] );
  app.scene.add( app.mercuryOrbit[0] )
  app.venusOrbit = app.createCircle( app.planetData[1]["orbitalRadius"], app.planetData[1]["angle"] );
  app.scene.add( app.venusOrbit[0] )
  app.earthOrbit = app.createCircle( app.planetData[2]["orbitalRadius"], app.planetData[2]["angle"] );
  app.scene.add( app.earthOrbit[0] )
  app.marsOrbit = app.createCircle( app.planetData[3]["orbitalRadius"], app.planetData[3]["angle"] );
  app.scene.add( app.marsOrbit[0] )
  app.jupiterOrbit = app.createCircle( app.planetData[4]["orbitalRadius"], app.planetData[4]["angle"] );
  app.scene.add( app.jupiterOrbit[0] )
  app.saturnOrbit = app.createCircle( app.planetData[5]["orbitalRadius"], app.planetData[5]["angle"] );
  app.scene.add( app.saturnOrbit[0] )
  app.uranusOrbit = app.createCircle( app.planetData[6]["orbitalRadius"], app.planetData[6]["angle"] );
  app.scene.add( app.uranusOrbit[0] )
  app.neptuneOrbit = app.createCircle( app.planetData[7]["orbitalRadius"], app.planetData[7]["angle"] );
  app.scene.add( app.neptuneOrbit[0] )
  app.plutoOrbit = app.createCircle( app.planetData[8]["orbitalRadius"], app.planetData[8]["angle"] );
  app.scene.add( app.plutoOrbit[0] )

  mercuryPath = app.mercuryOrbit[1]
  venusPath = app.venusOrbit[1]
  earthPath = app.earthOrbit[1]
  marsPath = app.marsOrbit[1]
  jupiterPath = app.jupiterOrbit[1]
  saturnPath = app.saturnOrbit[1]
  uranusPath = app.uranusOrbit[1]
  neptunePath = app.neptuneOrbit[1]
  plutoPath = app.plutoOrbit[1]

  //Add the stars to the scene
  app.stars = app.createStars()
  app.scene.add( app.stars )

  // var pt = earthPath.getPoint( t );
  // earth.position.set( pt.x, pt.y, pt.z );

  // Camera has: field of view, ratio, near, far
  app.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000000000)
  app.camera.lookAt( app.planetStart[9].x, app.planetStart[9].y, app.planetStart[9].z);
  app.camera.position.set(0,20000,0);

  app.scene.add( app.camera );

  //Orbital controls to move around space
  app.controls = new THREE.OrbitControls( app.camera, app.renderer.domElement );
  app.controls.target.set( app.planetStart[9].x, app.planetStart[9].y, app.planetStart[9].z );

  // Attach renderer to the page
  document.getElementById("output").appendChild( app.renderer.domElement );

  // Specifying the scene and camera to the renderer

  app.animate();
}//init

app.planetStart =
[{"planet":"Mercury","x":45859.30206,"z":-24871.42391,"y":6233.548795},
{"planet":"Venus","x":-65258.69018,"z":85252.38576,"y":4945.556007},
{"planet":"Earth","x":-146190.7322,"z":-31428.35831,"y":2},
{"planet":"Mars","x":81025.07905,"z":212285.9608,"y":2476.622669},
{"planet":"Jupiter","x":70537.26601,"z":774559.7634,"y":17533.545905},
{"planet":"Saturn","x":-1088636.062,"z":840858.7392,"y":29015.01566},
{"planet":"Uranus","x":-2067029.369,"z":-1861760.835,"y":19855.84114},
{"planet":"Neptune","x":-1134492.103,"z":-4383695.487,"y":116203.7514},
{"planet":"Pluto","x":-4225812.662,"z":-1060539.951,"y":1336833.515},
{"planet":"Test","x":-38895,"z":-1413700,"y":10000}]

app.planetData =
  [{"planet":"Mercury","orbitalRadius":57900.00,"planetRadius":2.44, "angle":1.446878},
  {"planet":"Venus","orbitalRadius":108200.00,"planetRadius":6.05, "angle":1.5116297},
  {"planet":"Earth","orbitalRadius":149600.00,"planetRadius":6.38, "angle":1.5708},
  {"planet":"Mars","orbitalRadius":227900.00,"planetRadius":3.39, "angle":1.5385077},
  {"planet":"Jupiter","orbitalRadius":783300.00,"planetRadius":71.40, "angle":1.5479325},
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
  var sphereGeometry = new THREE.SphereGeometry( 3000, 30, 30 );
  var material  = new THREE.MeshPhongMaterial()
  material.map = THREE.TextureLoader('assets/sun_detailed.png')
  var planet = new THREE.Mesh( sphereGeometry, material );
  planet.position.set( xPosition, yPosition, zPosition );
  return planet;
};

app.createLineFromSpline = function( spline ){
  var lineMaterial = new THREE.LineBasicMaterial({
    color: 0xFFFFFF
  });
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices = spline.getPoints( 10000 );
  var line = new THREE.Line( lineGeometry, lineMaterial );

  return line;
};

// Create circular orbit
app.createCircle = function( radius, angle ){
  var segments = 100;
  var material = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );
  var geometry = new THREE.CircleGeometry( radius, segments ).rotateX(angle).rotateZ(Math.PI);
  // var path = new THREE.Path( app.geometry.getPoints( 100 ) );

  geometry.vertices.shift();
  var path = geometry["vertices"]
  // Work around to fix missing segment in circle
  geometry.vertices.push( geometry.vertices[0].clone() )

  var circle = new THREE.Line( geometry, material );
  var planetPath = new THREE.CatmullRomCurve3( path );

  // debugger;

  var linePath = app.createLineFromSpline( planetPath );
  return [linePath, planetPath]
}

var sunPoint = new THREE.PointLight(0xffe600, 3, 150);
sunPoint.position.set( 0, 350, 0 );


app.animate = function(){
  // app.renderer.render( app.scene, app.camera );
  app.render()
  requestAnimationFrame( app.animate );
};

app.render = function() {

  // sets initial position of planet based on CatmullRomCurve3
  var pm = mercuryPath.getPoint( t );
  var pv = venusPath.getPoint( t );
  var pt = earthPath.getPoint( t );
  // console.log('earth point', t, pt);
  var pma = marsPath.getPoint( t );
  var pj = jupiterPath.getPoint( t );
  var ps = saturnPath.getPoint( t );
  var pu = uranusPath.getPoint( t );
  var pn = neptunePath.getPoint( t );
  var pp = plutoPath.getPoint( t );



  mercury.position.set( pm.x, pm.y, pm.z );
  venus.position.set( pv.x, pv.y, pv.z );
  earth.position.set( pt.x, pt.y, pt.z );
  mars.position.set( pma.x, pma.y, pma.z );
  jupiter.position.set( pj.x, pj.y, pj.z );
  saturn.position.set( ps.x, ps.y, ps.z );
  uranus.position.set( pu.x, pu.y, pu.z );
  neptune.position.set( pn.x, pn.y, pn.z );
  pluto.position.set( pp.x, pp.y, pp.z );

  t = (t >= 1) ? 0 : t += 0.00000005;

  app.renderer.render( app.scene, app.camera );
}

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

app.UpdateParticles = function(){
        for( var i = 0; i < particles.app.earthOrbit[1].vertices.length; i++ ){
            var planet = app.earth.geometry.vertices[i];
            var path = particle.path;
            particle.lerpN += 0.05;
            if(particle.lerpN > 1){
                particle.lerpN = 0;
                particle.moveIndex = particle.nextIndex;
                particle.nextIndex++;
                if( particle.nextIndex >= path.length ){
                    particle.moveIndex = 0;
                    particle.nextIndex = 1;
                }
            }

            var currentPoint = path[particle.moveIndex];
            var nextPoint = path[particle.nextIndex];


            particle.copy( currentPoint );
            particle.lerp( nextPoint, particle.lerpN );
        }
        particles.geometry.verticesNeedUpdate = true;
    };

app.onResize = function(){
  app.width = window.innerWidth;
  app.height = window.innerHeight;
  app.camera.aspect = app.width / app.height;
  app.camera.updateProjectionMatrix();
  app.renderer.setSize(app.width, app.height);
}

window.addEventListener("resize", app.onResize, false);

window.onload = app.init;
