var camera, scene, renderer, group, tween;

var stats, controls;

init()
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 1;
	camera.position.x = 1;
	camera.position.y = 1;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf0f0f0 );

	var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
	var material  = new THREE.MeshPhongMaterial({'reflectivity': 0})
	material.map = new THREE.TextureLoader().load('/images/earthmap1k.jpg')
	material.bumpMap = new THREE.TextureLoader().load('/images/earthbump1k.jpg')
	material.bumpScale = 0.05
	material.specularMap = new THREE.TextureLoader().load('/images/earthspec1k.jpg')
	material.specular = new THREE.Color("grey")
	var earthMesh = new THREE.Mesh(geometry, material)
	scene.add(earthMesh)

	// Let there be light
	var light = new THREE.DirectionalLight( "rgb(255,241,224)", 0.3 );
	light.position.set( 1, 1, 1 ).normalize();
	scene.add(light);

	var ambientLight = new THREE.AmbientLight(0xffffff)
	scene.add(ambientLight);

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.maxDistance = 100;
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;

	stats = new Stats();
	document.body.appendChild( stats.dom );

}

function animate() {

	requestAnimationFrame( animate );
	controls.update();
	stats.begin();
	render();
	stats.end();

}

function render() {

	renderer.render( scene, camera );

}