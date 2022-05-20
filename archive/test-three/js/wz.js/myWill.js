// @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/

!function() {
	// return;
	window.requestAnimFrame = (function() {
		return  window.requestAnimationFrame   || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
	})();
	// set the scene size
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

	// the camera starts at 0,0,0 so pull it back
	camera.position.z = 300;

	// start the renderer - set the clear colour to a full black
	renderer.setClearColor(new THREE.Color(0, 0));
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	container.appendChild(renderer.domElement);

	// create the particle variables
	var textureLoader = new THREE.TextureLoader();
	var particleCount = 1800,
		particles = new THREE.Geometry(),
		pMaterial = new THREE.PointsMaterial({
			color: 0xFFFFFF,
			size: 9,
			map: textureLoader.load("./images/particle.png"),
			blending: THREE.AdditiveBlending,
			transparent: true,
			fog: true,
			opacity: 0.8
		});

	var setParticleVertices = function (particles, particleCount) {
		// now create the individual particles
		for(var p = 0; p < particleCount; p++) {

			// create a particle with random
			// position values, -250 -> 250
			var pX = Math.random() * 500 - 250,
				pY = Math.random() * 500 - 250,
				pZ = Math.random() * 500 - 250,
				particle = new THREE.Vector3(pX, pY, pZ);

			// create a velocity vector
			particle.velocity = new THREE.Vector3(
				0,				// x
				-Math.random(),	// y
				0);				// z

			// add it to the geometry
			particles.vertices.push(particle);
		}
	};
	setParticleVertices(particles, particleCount);

	// create the particle system
	var particleSystem = new THREE.Points(particles, pMaterial);

	particleSystem.sortParticles = true;

	// add it to the scene
	scene.add(particleSystem);
	scene.fog = new THREE.FogExp2(0xFF00FF, 0.0009);


	var farParticleCount = 333,
		farParticles = new THREE.Geometry(),
		farMaterial = new THREE.PointsMaterial({
			color: 0xFFFFFF,
			size: Math.random() * 20 + 10,
			map: textureLoader.load("./images/particle.png"),
			blending: THREE.AdditiveBlending,
			transparent: true,
			fog: true,
			opacity: 0.3
		});
	setParticleVertices(farParticles, farParticleCount);
	var farParticleSystem = new THREE.Points(farParticles, farMaterial);
	farParticleSystem.sortParticles = true;
	scene.add(farParticleSystem);

	// animation loop
	function update() {
		
		// add some rotation to the system
		particleSystem.rotation.y += 0.003;
		farParticleSystem.rotation.y += 0.003;
		
		var pCount = particleCount;
		while(pCount--) {
			// get the particle
			var particle = particles.vertices[pCount];
			
			// check if we need to reset
			if (particle.y > 200) {
				particle.y = -200;
				particle.velocity.y = 0;
			}
			if (particle.x < -200) {
				particle.x = 200;
				particle.velocity.x = 0;
			}
			if (particle.x > 200) {
				particle.x = -200;
				particle.velocity.x = 0;
			}
			
			// update the velocity
			particle.velocity.y += Math.random() * .01 - .0033;
			particle.velocity.x += (Math.random() - 0.5) * .05;
			
			// and the position
			particle.add(particle.velocity);
		}

		pCount = farParticleCount;
		while(pCount--) {
			// get the particle
			var particle = farParticles.vertices[pCount];
			
			// check if we need to reset
			if (particle.y > 200) {
				particle.y = -200;
				particle.velocity.y = 0;
			}
			if (particle.x < -200) {
				particle.x = 200;
				particle.velocity.x = 0;
			}
			if (particle.x > 200) {
				particle.x = -200;
				particle.velocity.x = 0;
			}
			
			// update the velocity
			particle.velocity.y += Math.random() * .008 - .0033;
			particle.velocity.x += (Math.random() - 0.5) * .03;
			
			// and the position
			particle.add(particle.velocity);
		}
		
		// flag to the particle system that we've changed its vertices. This is the dirty little secret.
		particleSystem.geometry.verticesNeedUpdate = true;
		farParticleSystem.geometry.verticesNeedUpdate = true;
		
		renderer.render(scene, camera);
		// 
		// set up the next call
		requestAnimFrame(update);
	}
	requestAnimFrame(update);
}();
