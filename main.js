import * as THREE from 'three'
import { sphereFragmentShader } from './shaders/sphereFragmentShader.glsl';
import { sphereVertexShader } from './shaders/sphereVertexShader.glsl';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	60,
	window.innerWidth / window.innerHeight,
	0.1, 1000);
camera.position.z = 75;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize );
document.addEventListener( 'pointermove', onPointerMove );
document.addEventListener( 'pointerdown', onPointerDown );
document.addEventListener( 'pointerup', onPointerUp );

const clock = new THREE.Clock(true);

const mouseCoord = new THREE.Vector2(.5, .5);
let isMouseButtonPressed = false;
let isMouseOverSphere = false;
let isMouseMoved = false;
const raycaster = new THREE.Raycaster();
let lastRaycastTime = 0;

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onPointerMove( event ) {
	if ( event.isPrimary === true ) {
		mouseCoord.set(
			( event.clientX / renderer.domElement.clientWidth ) * 2 - 1,
			- ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1
		);
		isMouseMoved = true;
		console.log(isMouseOverSphere);
	}
}

function onPointerDown( event ) {
	if (event.isPrimary === true && event.button == 0) {
		isMouseButtonPressed = true;
	}
}

function onPointerUp( event ) {
	if (event.isPrimary === true && event.button == 0) {
		isMouseButtonPressed = false;
	}
}

function updateRaycaster() {
    if (isMouseMoved) {
        const currentTime = performance.now();
        const timeSinceLastRaycast = currentTime - lastRaycastTime;

        if (timeSinceLastRaycast > 16) {
            raycaster.setFromCamera(mouseCoord, camera);
            isMouseOverSphere = !!raycaster.intersectObject(rayMesh).length;
            isMouseMoved = false;
            lastRaycastTime = currentTime;
        }
    }
}


const uniforms = {
	u_time: {
		value: 0.0
	},
	u_mouse: {
		value: mouseCoord
	},
	u_resolution: {
		value: {
			x: 0,
			y: 0
		}
	},
	u_color: {
		value: new THREE.Color(0xffffff)
	},
	u_light1_position: {
		value: new THREE.Vector3()
	},
	u_light1_intensity: {
		value: 0.0
	},
	u_light1_color: {
		value: new THREE.Color()
	},
	u_light2_position: {
		value: new THREE.Vector3()
	},
	u_light2_intensity: {
		value: 0.0
	},
	u_light2_color: {
		value: new THREE.Color()
	},
	u_light3_position: {
		value: new THREE.Vector3()
	},
	u_light3_intensity: {
		value: 0.0
	},
	u_light3_color: {
		value: new THREE.Color()
	},
	u_mouse_leftbutton_pressed: {
		value: false
	},
	u_mouse_rightbutton_pressed: {
		value: false
	},
	u_mouse_is_on_sphere: {
		value: false
	},
	u_screen_width: {
		value: window.innerWidth
	},
	u_pattern_seeds: {
		value: new THREE.Vector2()
	},
}











const sphereGeometry = new THREE.IcosahedronGeometry(10, 100);
const sphereMaterial = new THREE.ShaderMaterial( {
	vertexShader: sphereVertexShader,
	fragmentShader: sphereFragmentShader,
	uniforms: THREE.UniformsUtils.merge([
		THREE.UniformsLib['common'],
		THREE.UniformsLib['lights'],
		uniforms
	]),
	// wireframe: true,
	lights: true,
	defines: {
		PI: Math.PI
	},
});

const sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphereMesh.castShadow = true;

const rayMesh = new THREE.Mesh(
	new THREE.SphereGeometry(10),
	new THREE.MeshBasicMaterial({ visible: false })
);

const light1 = new THREE.PointLight(0xff0000, .02);
const light2 = new THREE.PointLight(0x0000ff, .02);
const light3 = new THREE.PointLight(0x00ff00, .02);

const lightObj1 = new THREE.Mesh(
	new THREE.SphereGeometry(1),
	new THREE.MeshBasicMaterial({color: 0xff0000})
)
const lightObj2 = new THREE.Mesh(
	new THREE.SphereGeometry(1),
	new THREE.MeshBasicMaterial({color: 0x0000ff})
)
const lightObj3 = new THREE.Mesh(
	new THREE.SphereGeometry(1),
	new THREE.MeshBasicMaterial({color: 0x00ff00})
)
lightObj1.add( light1 );
lightObj2.add( light2 );
lightObj3.add( light3 );
lightObj1.position.set(0, 0, 40);
lightObj2.position.set(40, 0, 0);
lightObj3.position.set(0, 0, 40);

scene.add( lightObj1 );
scene.add( lightObj2 );
scene.add( lightObj3 );

sphereMesh.add( rayMesh );
scene.add( sphereMesh );

function update_uniforms() {
	sphereMaterial.uniforms.u_light1_position.value = sphereMesh.worldToLocal(lightObj1.position.clone());
	sphereMaterial.uniforms.u_light2_position.value = sphereMesh.worldToLocal(lightObj2.position.clone());;
	sphereMaterial.uniforms.u_light3_position.value = sphereMesh.worldToLocal(lightObj3.position.clone());;
	sphereMaterial.uniforms.u_light1_intensity.value = light1.intensity;
	sphereMaterial.uniforms.u_light2_intensity.value = light2.intensity;
	sphereMaterial.uniforms.u_light3_intensity.value = light3.intensity;
	sphereMaterial.uniforms.u_mouse.value = mouseCoord;
	sphereMaterial.uniforms.u_time.value += clock.getDelta();
}

function alter_light_colors(isMouseOverSphere) {
    if (isMouseOverSphere) {
        lightObj1.material.color.offsetHSL(0.005, 0, 0);
        lightObj2.material.color.offsetHSL(0.005, 0, 0);
        lightObj3.material.color.offsetHSL(0.005, 0, 0);

        sphereMaterial.uniforms.u_light1_color.value.copy(lightObj1.material.color);
        sphereMaterial.uniforms.u_light2_color.value.copy(lightObj2.material.color);
        sphereMaterial.uniforms.u_light3_color.value.copy(lightObj3.material.color);
    } else {
        lightObj1.material.color.set(light1.color.clone());
        lightObj2.material.color.set(light2.color.clone());
        lightObj3.material.color.set(light3.color.clone());

        sphereMaterial.uniforms.u_light1_color.value.copy(light1.color);
        sphereMaterial.uniforms.u_light2_color.value.copy(light2.color);
        sphereMaterial.uniforms.u_light3_color.value.copy(light3.color);
    }
}

let rotation_const = 0.01;
function animate() {
	requestAnimationFrame( animate );
	if (isMouseButtonPressed) rotation_const = 0.02;
	else rotation_const = 0.01;
	if (isMouseOverSphere === true) {
		alter_light_colors(true);
	} else {
		alter_light_colors(false);
	}
	sphereMesh.rotateY(rotation_const);

	const rotationMatrix = new THREE.Matrix4();
	rotationMatrix.makeRotationAxis(new THREE.Vector3(0,1,0), rotation_const * 1.5);
	lightObj1.position.applyMatrix4(rotationMatrix);
	rotationMatrix.makeRotationAxis(new THREE.Vector3(0,0,1), rotation_const * 3);
	lightObj2.position.applyMatrix4(rotationMatrix);
	rotationMatrix.makeRotationAxis(new THREE.Vector3(1,0,0), rotation_const * 2.);
	lightObj3.position.applyMatrix4(rotationMatrix);
	lightObj1.updateMatrixWorld();
	lightObj2.updateMatrixWorld();
	lightObj3.updateMatrixWorld();

	update_uniforms();
	updateRaycaster();
	renderer.render( scene, camera );
}
animate();
