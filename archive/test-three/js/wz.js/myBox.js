// https://github.com/mrdoob/three.js/blob/master/examples/webgl_lensflares.html


!function() {
	return;
	var WIDTH = document.body.clientWidth,
	    HEIGHT = document.body.clientHeight;

	// set some camera attributes
	var VIEW_ANGLE = 45,
		ASPECT = WIDTH / HEIGHT,
		NEAR = 0.1,
		FAR = 10000;

	// get the DOM element
	var container = document.querySelector('#container');

	// create a WebGL renderer, camera and a scene
	var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	var scene = new THREE.Scene();

	// attach the render-supplied DOM element
	container.appendChild(renderer.domElement);

	// start the renderer - set the clear colour to a full black
	renderer.setClearColor(new THREE.Color(0, 0));
	renderer.setSize(WIDTH, HEIGHT);

	camera.position.z = 10;



	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 50 } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	var dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
	dirLight.position.set( 0, -1, 0 ).normalize();
	scene.add( dirLight );



	var textureLoader = new THREE.TextureLoader();
	var textureFlare0 = textureLoader.load( "./images/lensflare/lensflare0.png" );
	var textureFlare2 = textureLoader.load( "./images/lensflare/lensflare2.png" );
	var textureFlare3 = textureLoader.load( "./images/lensflare/lensflare3.png" );

	function addLensFlare(x,y,z, size) {

		var light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
		light.color.setHSL( 0.55, 0.9, 0.5 );
		light.position.set( x, y, z );
		scene.add( light );

		var flareColor = new THREE.Color( 0xffffff );

		var lensFlare = new THREE.LensFlare( textureFlare0, 7.00, 0.0, THREE.AdditiveBlending, flareColor );

		//	we're going to be using multiple sub-lens-flare artifacts, each with a different size
		lensFlare.add( textureFlare2, 5.12, 0.0, THREE.AdditiveBlending );
		lensFlare.add( textureFlare2, 5.12, 0.0, THREE.AdditiveBlending );
		lensFlare.add( textureFlare2, 5.12, 0.0, THREE.AdditiveBlending );

		lensFlare.add( textureFlare3, .60, 0.6, THREE.AdditiveBlending );
		lensFlare.add( textureFlare3, .70, 0.7, THREE.AdditiveBlending );
		lensFlare.add( textureFlare3, .120, 0.9, THREE.AdditiveBlending );
		lensFlare.add( textureFlare3, .70, 1.0, THREE.AdditiveBlending );

		//	and run each through a function below
		lensFlare.customUpdateCallback = lensFlareUpdateCallback;

		lensFlare.position = new THREE.Vector3(x,y,z);
		// lensFlare.size = size ? size : 16000 ;
		return lensFlare;
	}

	function lensFlareUpdateCallback( object ) {
		var f, fl = object.lensFlares.length;
		var flare;
		var vecX = -object.positionScreen.x * 2;
		var vecY = -object.positionScreen.y * 2;
		for( f = 0; f < fl; f++ ) {
			flare = object.lensFlares[ f ];
			flare.x = object.positionScreen.x + vecX * flare.distance;
			flare.y = object.positionScreen.y + vecY * flare.distance;
			flare.rotation = 0;
		}
		object.lensFlares[ 2 ].y += 0.025;
		object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );
	}
	var lf = addLensFlare(5, 0, -1);
	scene.add( lf );

	function render() {
		requestAnimationFrame( render );
		cube.rotation.x += 0.1;
		cube.rotation.y += 0.1;
		renderer.render( scene, camera );
	}
	render();
}();
