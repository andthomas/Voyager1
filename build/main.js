var app = app || {};

//Define globals
var mercuryPath, venusPath, earthPath, marsPath, jupiterPath, saturnPath, uranusPath, neptunePath, plutoPath;

var m = 0.2163;
var v = 0.4663;
var t = 0;
var e = 0.21823;
var ma = 0.43;
var j = 0.395;
var s = 0.566;
var n = 0.01;
var u = 0.96;
var p = 0.05;
var day = 1;

var sun, mercury, venus, earth, mesh, mars, jupiter, saturn, saturnRings, uranus, neptune, pluto, voyager, voyagerCam;
var trajectoryPoints = [];
var infoPoints = [];
var voyagerPath;
var displayTrajectories;

//Set up daydream variables
if ( 'bluetooth' in navigator === false ) {
  button.style.display = 'none';
  message.innerHTML = 'This browser doesn\'t support the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API" target="_blank">Web Bluetooth API</a> :(';
}

var axis = new THREE.Vector3();
var quaternion = new THREE.Quaternion();
var quaternionHome = new THREE.Quaternion();
var initialised = false;
var timeout = null;

//Dat GUI controller default values
app.controller = {
  rotationSpeed: 0.00000004,
  sunScale: 1,
  planetScale: 1,
  displayTrajectories: true,
  view: "voyager"
};

$.ajax({
  url: "build/voyagerTrajectory.json",
  data: {
   format: 'json'
  }
})
.done( function( data ) {
    for (var i = 0; i < data.length; i++) {
      infoPoints.push({"doy": data[i].doy, "year": data[i].year, "x": data[i].x, "y": data[i].y, "z": data[i].z} )
    }
    for (var i = 0; i < data.length; i = i+30) {
      trajectoryPoints.push(new THREE.Vector3(
        data[i].x,
        data[i].y,
        data[i].z
      ));
    }
    voyagerPath = new THREE.CatmullRomCurve3( trajectoryPoints );
    app.line = app.createLineFromSpline( voyagerPath );

    function addModelToScene( geometry, materials ) {
      var material = new THREE.MeshFaceMaterial(materials);
      voyager = new THREE.Mesh( geometry, material );
      voyager.scale.set(0.004,0.004,0.004);
      voyager.position.set(-31430.2, 1, 146248.8);
      app.scene.add( voyager );
      app.scene.add( app.line );

      // voyager.rotation.x = 1.5 *  Math.PI;
      // voyager.rotation.y = Math.PI / 2;
      // voyager.rotation.z = Math.PI;
    }

    var loader = new THREE.JSONLoader();
    loader.load( "models/Voyager_one.json", addModelToScene)

})
.done(function(){
    app.init()

})

app.init = function(){

  app.width = window.innerWidth;
  app.height = window.innerHeight;
  app.up = new THREE.Vector3( 0, 1, 0 );

  app.scene = new THREE.Scene();

  //Axes
  app.axes = new THREE.AxisHelper( 2000 );
  // app.scene.add( app.axes );

  // Renderer
  app.renderer = new THREE.WebGLRenderer();
  app.renderer.setSize( app.width, app.height );
  app.renderer.setClearColor( 0x000000, 1 )

  // Add lights

  // for (var i = 0; i < 5; i++) {
  //   app.spotlight = app.createSpotlight();
  //   app.spotlight.position.set( 10000, 0, 0 );
  //   app.scene.add( app.spotlight );
  // }
  app.spotlight = app.createSpotlight();
  app.spotlight.position.set( 10000, 10000, 0 );
  app.scene.add( app.spotlight );

  app.spotlight1 = app.createSpotlight();
  app.spotlight1.position.set( -10000, -10000, 0 );
  app.scene.add( app.spotlight1 );

  app.spotlight2 = app.createSpotlight();
  app.spotlight2.position.set( 0, 10000, 10000 );
  app.scene.add( app.spotlight2 );

  app.spotlight4 = app.createSpotlight();
  app.spotlight4.position.set( 0, -10000, -10000 );
  app.scene.add( app.spotlight4 );

  app.spotlight3 = app.createSpotlight();
  app.spotlight3.position.set( 0, 10000, 0 );
  app.scene.add( app.spotlight3 );

  app.spotlight5 = app.createSpotlight();
  app.spotlight5.position.set( 0, 0, -10000 );
  app.scene.add( app.spotlight5 );

  app.ambient = new THREE.AmbientLight( 0x0b0b0b );
  app.scene.add( app.ambient );

  // Add Sun
  sun = THREEx.Planets.createSun()
  sun.scale.set(600,600,600)
  app.scene.add( sun );

  // Add daydream controller
  $('#button').on( 'click', function () {
    console.log("Initialise daydream");
    var controller = new DaydreamController();
    controller.onStateChange( function ( state ) {
      if ( app.camera !== undefined ) {
        var angle = Math.sqrt( state.xOri * state.xOri + state.yOri * state.yOri + state.zOri * state.zOri );
        if ( angle > 0 ) {
          axis.set( state.xOri, state.yOri, state.zOri )
          axis.multiplyScalar( 1 / angle );
          quaternion.setFromAxisAngle( axis, angle );
          if ( initialised === false ) {
            quaternionHome.copy( quaternion );
            quaternionHome.inverse();
            initialised = true;
          }
        } else {
          quaternion.set( 0, 0, 0, 1 );
        }
        if ( state.isHomeDown ) {
          if ( timeout === null ) {
            timeout = setTimeout( function () {
              quaternionHome.copy( quaternion );
              quaternionHome.inverse();
            }, 1000 );
          }
        } else {
          if ( timeout !== null ) {
            clearTimeout( timeout );
            timeout = null;
          }
        }
        app.camera.quaternion.copy( quaternionHome );
        app.camera.quaternion.multiply( quaternion );
        // button1.material.emissive.g = state.isClickDown ? 0.5 : 0;
        // button2.material.emissive.g = state.isAppDown ? 0.5 : 0;
        // button3.material.emissive.g = state.isHomeDown ? 0.5 : 0;
        touch.position.x = ( state.xTouch * 2 - 1 ) / 1000;
        touch.position.y = - ( state.yTouch * 2 - 1 ) / 1000;
        touch.visible = state.xTouch > 0 && state.yTouch > 0;
      }
    } );

    controller.connect();
  } );

  var spriteMaterial = new THREE.SpriteMaterial(
  {
    map: new THREE.TextureLoader( 'assets/glow.png' ),
    useScreenCoordinates: false,
    color: 0xe6af2e, transparent: false, blending: THREE.AdditiveBlending
  });
  var sprite = new THREE.Sprite( spriteMaterial );
  sprite.scale.set(0.01, 0.01, 0.01);
  sun.add(sprite); // this centers the glow at the sun
  // debugger;

  //Add Planets
  mercury = THREEx.Planets.createMercury()
  var mercuryRadius = app.planetData[0]["planetRadius"]
  mercury.scale.set(mercuryRadius, mercuryRadius, mercuryRadius)
  app.scene.add( mercury );

  venus = THREEx.Planets.createVenus()
  var venusRadius = app.planetData[1]["planetRadius"]
  venus.scale.set(venusRadius, venusRadius, venusRadius)
  app.scene.add( venus );

  earth = THREEx.Planets.createEarth()
  earth.material.shininess = 10000000
  var earthRadius = app.planetData[2]["planetRadius"]
  earth.scale.set(earthRadius, earthRadius, earthRadius)
  app.scene.add( earth );
  mesh	= THREEx.Planets.createEarthCloud()
  mesh.scale.set(earthRadius, earthRadius, earthRadius)
	app.scene.add(mesh)

  mars = THREEx.Planets.createMars()
  var marsRadius = app.planetData[3]["planetRadius"]
  mars.scale.set(marsRadius, marsRadius, marsRadius)
  app.scene.add( mars );

  jupiter = THREEx.Planets.createJupiter()
  var jupiterRadius = app.planetData[4]["planetRadius"]
  jupiter.scale.set(jupiterRadius, jupiterRadius, jupiterRadius)
  app.scene.add( jupiter );

  saturn = THREEx.Planets.createSaturn()
  var saturnRadius = app.planetData[5]["planetRadius"]
  saturn.scale.set(saturnRadius, saturnRadius, saturnRadius)
  app.scene.add( saturn );
  // var saturnRings	= THREEx.Planets.createSaturnRing()
  // saturnRings.scale.set(saturnRadius, saturnRadius, saturnRadius)
  // app.scene.add(saturnRings)

  uranus = THREEx.Planets.createUranus()
  var uranusRadius = app.planetData[6]["planetRadius"]
  uranus.scale.set(uranusRadius, uranusRadius, uranusRadius)
  app.scene.add( uranus );

  neptune = THREEx.Planets.createNeptune()
  var neptuneRadius = app.planetData[7]["planetRadius"]
  neptune.scale.set(neptuneRadius, neptuneRadius, neptuneRadius)
  app.scene.add( neptune );

  pluto = THREEx.Planets.createPluto()
  var plutoRadius = app.planetData[8]["planetRadius"]
  pluto.scale.set(plutoRadius, plutoRadius, plutoRadius)
  app.scene.add( pluto );

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

  // Camera has: field of view, ratio, near, far
  app.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000000000)
  app.camera.position.set(60,10,-10);
  app.camera.lookAt( app.scene.position );
  app.scene.add( app.camera );

  //Orbital controls to move around space
  app.controls = new THREE.OrbitControls( app.camera, app.renderer.domElement );
  app.controls.target.set( app.planetStart[0].x, app.planetStart[0].y, app.planetStart[0].z );
  app.controls.minDistance=2;

  //Dat gui controller
  app.gui = new dat.GUI();
  app.gui.add( app.controller, 'rotationSpeed', 0, 1.5 );
  app.gui.add( app.controller, 'sunScale', 1.0, 10.0 ).onChange(function(val){
    sun.scale.set(val*600, val*600, val*600);
  });
  app.gui.add( app.controller, 'planetScale', 1.0, 500.0 ).onChange(function(val){
    mercury.scale.set(val * app.planetData[0].planetRadius, val * app.planetData[0].planetRadius, val * app.planetData[0].planetRadius);
    venus.scale.set(val * app.planetData[1].planetRadius, val * app.planetData[1].planetRadius, val * app.planetData[1].planetRadius);
    earth.scale.set(val * app.planetData[2].planetRadius, val * app.planetData[2].planetRadius, val * app.planetData[2].planetRadius);
    mesh.scale.set(val * app.planetData[2].planetRadius, val * app.planetData[2].planetRadius, val * app.planetData[2].planetRadius);
    mars.scale.set(val * app.planetData[3].planetRadius, val * app.planetData[3].planetRadius, val * app.planetData[3].planetRadius);
    jupiter.scale.set(val * app.planetData[4].planetRadius, val * app.planetData[4].planetRadius, val * app.planetData[4].planetRadius);
    saturn.scale.set(val * app.planetData[5].planetRadius, val * app.planetData[5].planetRadius, val * app.planetData[5].planetRadius);
    // saturnRings.scale.set(val * app.planetData[5].planetRadius, val * app.planetData[5].planetRadius, val * app.planetData[5].planetRadius);
    uranus.scale.set(val * app.planetData[6].planetRadius, val * app.planetData[6].planetRadius, val * app.planetData[6].planetRadius);
    neptune.scale.set(val * app.planetData[7].planetRadius, val * app.planetData[7].planetRadius, val * app.planetData[7].planetRadius);
    pluto.scale.set(val * app.planetData[8].planetRadius, val * app.planetData[8].planetRadius, val * app.planetData[8].planetRadius);
  });
   app.gui.add(app.controller , 'displayTrajectories');
   app.gui.add(app.controller, 'view', [ 'voyager', 'sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto' ] );

  // Attach renderer to the page
  document.getElementById("output").appendChild( app.renderer.domElement );

  app.stats = app.addStats();
  app.animate();
}//init

app.planetStart =
[{"planet":"Sun","x":0,"z":0,"y":0},
{"planet":"Mercury","x":45859.30206,"z":-24871.42391,"y":6233.548795},
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
  {"planet":"Jupiter","orbitalRadius":781700.00,"planetRadius":71.40, "angle":1.5479325},
  {"planet":"Saturn","orbitalRadius":1427000.00,"planetRadius":60.33, "angle":1.5273376},
  {"planet":"Uranus","orbitalRadius":2871000.00,"planetRadius":25.56, "angle":1.5591026},
  {"planet":"Neptune","orbitalRadius":4497100.00,"planetRadius":24.30, "angle":1.5416493},
  {"planet":"Pluto","orbitalRadius":5913000.00,"planetRadius":1.14, "angle":1.27409}];

app.createSpotlight = function(){
  var spotlight = new THREE.SpotLight( 0xCCCCCC );
  return spotlight;
};

app.createLineFromSpline = function( spline ){
  var lineMaterial = new THREE.LineBasicMaterial({
    color: 0x818181
  });
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices = spline.getPoints( 10000 );
  var line = new THREE.Line( lineGeometry, lineMaterial );

  return line;
};

// Create circular orbit
app.createCircle = function( radius, angle ){
  var segments = 1000;
  var material = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );
  var geometry = new THREE.CircleGeometry( radius, segments ).rotateX(angle).rotateZ(Math.PI);

  geometry.vertices.shift();
  var path = geometry["vertices"]
  // Work around to fix missing segment in circle
  geometry.vertices.push( geometry.vertices[0].clone() )

  var circle = new THREE.Line( geometry, material );
  var planetPath = new THREE.CatmullRomCurve3( path );

  var linePath = app.createLineFromSpline( planetPath );
  return [linePath, planetPath]
}

app.animate = function(){
  requestAnimationFrame( app.animate );
  app.render()
};

app.render = function() {
  //Change what the camera is centered on

  var planet = app.controller.view
  window[planet].add( app.camera )


  // sets initial position of planet based on CatmullRomCurve3
  var pm = mercuryPath.getPoint( m );
  var pv = venusPath.getPoint( v );
  var pt = earthPath.getPoint( e );
  var pma = marsPath.getPoint( ma );
  var pj = jupiterPath.getPoint( j );
  var ps = saturnPath.getPoint( s );
  var pu = uranusPath.getPoint( n );
  var pn = neptunePath.getPoint( u );
  var pp = plutoPath.getPoint( p );

  var vp = voyagerPath.getPoint( t );

  mercury.position.set( pm.x, pm.y, pm.z );
  venus.position.set( pv.x, pv.y, pv.z );
  earth.position.set( pt.x, pt.y, pt.z );
  mesh.position.set( pt.x, pt.y, pt.z );
  mars.position.set( pma.x, pma.y, pma.z );
  jupiter.position.set( pj.x, pj.y, pj.z );
  saturn.position.set( ps.x, ps.y, ps.z );
  // debugger
  // saturnRings.position.set( ps.x, ps.y, ps.z );
  uranus.position.set( pu.x, pu.y, pu.z );
  neptune.position.set( pn.x, pn.y, pn.z );
  pluto.position.set( pp.x, pp.y, pp.z );

  if ( voyager ){
    var rotate = 0;
    voyager.position.set( vp.x, vp.y, vp.z );
    // voyager.rotation.x = Math.PI / rotate
    rotate += 0.1
  }

  m = (m >= 1) ? 0 : m += 0.01451705*app.controller.rotationSpeed;
  v = (v >= 1) ? 0 : v += 0.00567778*app.controller.rotationSpeed;
  e = (e >= 1) ? 0 : e += 0.0035*app.controller.rotationSpeed;
  ma = (ma >= 1) ? 0 : ma += 0.00185953*app.controller.rotationSpeed;
  j = (j >= 1) ? 0 : j += 0.00029167*app.controller.rotationSpeed;
  s = (s >= 1) ? 0 : s += 0.00012069*app.controller.rotationSpeed;
  u = (u >= 1) ? 0 : u += 0.00004167*app.controller.rotationSpeed;
  n = (n >= 1) ? 0 : n += 0.00002121*app.controller.rotationSpeed;
  p = (p >= 1) ? 0 : p += 0.00001411*app.controller.rotationSpeed;


  if ( infoPoints ){
    if ( app.controller.rotationSpeed > 0 ) {
      day += 1.59*app.controller.rotationSpeed;
      i = Math.floor(day)
      // debugger;
      $("#doy").text("D.O.Y : " + infoPoints[i].doy)
      $("#year").text("Year : " + infoPoints[i].year)
      $("#x").text(infoPoints[i].x + " x 10^3 km")
      $("#y").text(infoPoints[i].y + " x 10^3 km")
      $("#z").text(infoPoints[i].z + " x 10^3 km")
    }
  }

  t = (t >= 1) ? 0 : t += 0.00005*app.controller.rotationSpeed;

  app.stats.update();
  app.renderer.render( app.scene, app.camera );
}

app.onResize = function(){
  app.width = window.innerWidth;
  app.height = window.innerHeight;
  app.camera.aspect = app.width / app.height;
  app.camera.updateProjectionMatrix();
  app.renderer.setSize(app.width, app.height);
}

app.addStats = function(){
  var stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.getElementById("stats").appendChild(stats.domElement);
  return stats;
}

window.addEventListener("resize", app.onResize, false);
