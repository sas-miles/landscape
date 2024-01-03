import * as THREE from 'three'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { MapControls } from 'three/examples/jsm/controls/MapControls.js'
import { Raycaster } from 'three'
import { gsap } from "gsap";
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'


// Canvas
const canvas = document.querySelector('canvas.webgl')


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update particles
    pariclesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

// Scene
const scene = new THREE.Scene();
let sceneReady = false;


// Loading manager
const loadingManager = new THREE.LoadingManager();

// Loaded callback
loadingManager.onLoad = () => {
    console.log('All resources loaded');
    window.setTimeout(() => {
        sceneReady = true;
    }, 2000);
};


/**
 * Fonts
 */

let text, textTwo;


const fontLoader = new FontLoader();
fontLoader.load(
    '/fonts/orbitron-black.json',
    (font) => 
    {
        const textGeometry = new TextGeometry(
            'HELLO',
            {
                font: font,
                size: 10,
                height: 0.2,
                curveSegments: 10,
                bevelEnabled: true,
                bevelThickness: 2,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 50
            }
        )
        const textMaterial = new THREE.MeshStandardMaterial()
        text = new THREE.Mesh(textGeometry, textMaterial)
        textMaterial.metalness = .1
        textMaterial.roughness = .9
        textMaterial.envMapIntensity = 5
        text.position.set(-30, 0, 10)
        scene.add(text)
    }
)


const fontLoaderTwo = new FontLoader();
fontLoaderTwo.load(
    '/fonts/orbitron-black.json',
    (font) => 
    {
        const textGeometryTwo = new TextGeometry(
            'HELLO',
            {
                font: font,
                size: 10,
                height: 0.2,
                curveSegments: 10,
                bevelEnabled: true,
                bevelThickness: .1,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 50
            }
        )
        const textMaterialTwo = new THREE.PointsMaterial()
        textTwo = new THREE.Mesh(textGeometryTwo, textMaterialTwo)
        textTwo.position.set(-30, 0, 10)
        scene.add(textTwo)

    }
    
)




/**
 * Lights
 */

const pointLightOverhead = new THREE.PointLight(0x183ED3, 20000)
pointLightOverhead.position.set(0, 30, 20)
scene.add(pointLightOverhead)

const pointLightOne = new THREE.PointLight(0x183ED3, 20000)
pointLightOne.position.set(0, 15, 0)
scene.add(pointLightOne)

const pointLightTwo = new THREE.PointLight(0x183ED3, 2000)
pointLightTwo.position.set(-30, 5, 40)
scene.add(pointLightTwo)


//Array of lights

const lightOneB = new THREE.PointLight(0xFFD25E, 50)
const lightTwoB = new THREE.PointLight(0xFFD25E, 50)
const lightThreeB = new THREE.PointLight(0xFFD25E, 50)
const lightFourB = new THREE.PointLight(0xFFD25E, 50)
const lightFiveB = new THREE.PointLight(0xFFD25E, 50)

const pointLights = [
    {
        light: lightOneB,
        position: new THREE.Vector3(-27.2, 16, 61.8),
       
    },
    {
        light: lightTwoB,
        position: new THREE.Vector3(-74.6, 31.2, 21.4),
       
    },
    {
        light: lightThreeB,
        position: new THREE.Vector3(-32.4, 18.6, -6.8),
       
    },
    {
        light: lightFourB,
        position: new THREE.Vector3(11.4, 23.8, -25.4),
       
    },
    {
        light: lightFiveB,
        position: new THREE.Vector3(39, 11, 16),
       
    },

]

pointLights.forEach(lightObject => {
    lightObject.light.position.set(lightObject.position.x, lightObject.position.y, lightObject.position.z)
    scene.add(lightObject.light)

})



/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshStandardMaterial({ visible: false, color: 0x233d4d });

const cubeOne = new THREE.Mesh(geometry, material);
const cubeTwo = new THREE.Mesh(geometry, material);
const cubeThree = new THREE.Mesh(geometry, material);
const cubeFour = new THREE.Mesh(geometry, material);
const cubeFive = new THREE.Mesh(geometry, material);

const objects = [
    { cube: cubeOne, position: new THREE.Vector3(-32.8, 1.6, 58.2) },
    { cube: cubeTwo, position: new THREE.Vector3(-75.6, 18.6, 18.6) },
    { cube: cubeThree, position: new THREE.Vector3(-32.4, 5.8, -9.4) },
    { cube: cubeFour, position: new THREE.Vector3(5.8, 11, -27.2) },
    { cube: cubeFive, position: new THREE.Vector3(33.8, 0.8, 8.4) }
];

objects.forEach(objectItem => {
    objectItem.cube.position.set(objectItem.position.x, objectItem.position.y, objectItem.position.z);
    objectItem.cube.rotateY(0);
    scene.add(objectItem.cube);
});

/**
 * Points of Interest 
 */
const points = [
    {
        cube: cubeOne,
        pointLight: lightOneB,
        position: new THREE.Vector3(0, 0, 0),  // Example new position
        element: document.querySelector('.point-1'),
        distance: 1,
        translateMultiplier: 0
        
    },
    {
        cube: cubeTwo,
        pointLight: lightTwoB,
        position: new THREE.Vector3(0, 0, 0),  // Unique position for point 2
        element: document.querySelector('.point-2'),
        distance: 1,
        translateMultiplier: 0
        
    },
    {
        cube: cubeThree,
        pointLight: lightThreeB,
        position: new THREE.Vector3(0, 0, 0),  // Unique position for point 3
        element: document.querySelector('.point-3'),
        distance: 1,
        translateMultiplier: 0
        
    },
    {
        cube: cubeFour,
        pointLight: lightFourB,
        position: new THREE.Vector3(0, 0, 0),  // Unique position for point 4
        element: document.querySelector('.point-4'),
        distance: 1,
        translateMultiplier: 0
        
    },
    {
        cube: cubeFive,
        pointLight: lightFiveB,
        position: new THREE.Vector3(0, 0, 0),  // Unique position for point 5
        element: document.querySelector('.point-5'),
        distance: 1,
        translateMultiplier: 0
       
    }
]

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

const bakedTexture = textureLoader.load('/textures/landscape-bake-color.jpg')
const normalTexture = textureLoader.load('/textures/hi-res-normal.jpg')
normalTexture.flipY = false
bakedTexture.flipY = false
normalTexture.colorSpace = THREE.SRGBColorSpace
normalTexture.magFilter = THREE.LinearFilter;


/**
 * Models
 */

//Material
const modelMaterial = new THREE.MeshStandardMaterial()

const dracoLoader = new DRACOLoader()
const gltfLoader = new GLTFLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

let model = null

gltfLoader.load(
    '/models/landscape-2-road-test-2.glb',
    (gltf) => 
    {
        console.log(gltf)
        let isFirstMesh = true;

        // gltf.scene.traverse((child) => {
        //     if (child.isMesh) {
        //         if (isFirstMesh) {
        //             // Apply texture to the first mesh
        //             child.material = modelMaterial;
        //             isFirstMesh = false;
        //         } else {
        //             // You can apply different materials to other meshes if needed
        //              //child.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
                    
        //         }

        //     }
            
        // });
        gltf.scene.scale.set(.8, .8, .8)

        scene.add(gltf.scene)
        model = gltf.scene
        model.rotateY(5)
        model.position.set(0,-2,0)

    }
)



/**
 *  Particles
 */

const particlesGeometry = new THREE.BufferGeometry()
const particlesCount = 1000
const particlePositions = new Float32Array(particlesCount * 3)
const scaleArray = new Float32Array(particlesCount)

for(let i = 0; i < particlesCount * 3; i++) {
    particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 500
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 500
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 500

    scaleArray[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

// Material
const pariclesMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 500 }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader
})


// Points
const particles = new THREE.Points(particlesGeometry, pariclesMaterial)

scene.add(particles)

/**
 * Camera
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 1000)
camera.position.set(0,10,105)
scene.add(camera)

//Camera Load In
// Define the starting position for the animation
const startPositions = {
    x: 0,
    y: 200, // Elevated position
    z: 200  // Further back
};


// Move the camera to the start position (without rendering)
camera.position.set(startPositions.x, startPositions.y, startPositions.z);

let targetPosition = new THREE.Vector3().copy(camera.position);
let targetRotationY = camera.rotation.y;

// Animate the camera to its final position
gsap.to(camera.position, {
    duration: 6, // Duration in seconds
    x: 0,
    y: 10,
    z: 105,
    ease: "power3.out", // This easing can be adjusted
    onStart: () => {
        console.log("Camera animation started");
    },
    onUpdate: () => {
        
    },
    onComplete: () => {
        console.log("Camera animation completed");
    }
});



/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()


/**
 * Controls
 */
const controls = new MapControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.08


// let isDragging = false;
// let previousMousePosition = { x: 0, y: 0 };

// let isGSAPAnimating = true;


// const onMouseDown = (e) => {
//     console.log("Mouse Down");
//     isDragging = true;
//     previousMousePosition.x = e.clientX;
//     previousMousePosition.y = e.clientY;
// };

// const deadzoneThreshold = 5; // Adjust this value as needed

// const onMouseMove = (e) => {
//     console.log(`Mouse Move - isDragging: ${isDragging}`);

//     // The isDragging flag should not be set to true here; it's already handled in onMouseDown and onMouseUp
//     if (isDragging) {
//         const deltaX = e.clientX - previousMousePosition.x;
//         const deltaY = e.clientY - previousMousePosition.y;
//         console.log(`Delta X: ${deltaX}, Delta Y: ${deltaY}`);

//         if (Math.abs(deltaX) > deadzoneThreshold) {
//             targetRotationY += deltaX * 0.005;
//         }

//         const forward = new THREE.Vector3(0, 0, -1);
//         forward.applyQuaternion(camera.quaternion);
//         forward.y = 0; // Eliminate Y component
//         forward.normalize();
//         forward.multiplyScalar(deltaY * 0.1);

//         targetPosition.x += forward.x;
//         targetPosition.z += forward.z;

//         console.log(`Updated Target Position: x=${targetPosition.x}, y=${targetPosition.y}, z=${targetPosition.z}`);

//         previousMousePosition.x = e.clientX; // Update previous mouse position
//         previousMousePosition.y = e.clientY;
//     }

//     if (!isGSAPAnimating) {
//         camera.rotation.y += (targetRotationY - camera.rotation.y) * dampingFactor;
//         camera.position.lerp(targetPosition, dampingFactor);
//     }
// };



// const onMouseUp = () => {
//     console.log("Mouse Up");
    
//     isDragging = false;
// };

// document.addEventListener('mousedown', onMouseDown);
// document.addEventListener('mousemove', onMouseMove);
// document.addEventListener('mouseup', onMouseUp);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



/**
 * Animation 
*/
const clock = new THREE.Clock()
let previousTime = 0

// Camera Control Limits
const terrainRaycaster = new THREE.Raycaster();
const offsetHeight = 18; // Height above the ground
const dampingFactor = .1; // Adjust for smoother transition

// Scene Object Interactions
const cubes = objects.map(object => object.cube);
const minIntensity = 50;       // Minimum light intensity
const maxIntensity = 2000;         // Maximum light intensity
const visibilityThreshold = 60; // Adjust this value as needed
const cameraDirection = new THREE.Vector3();
const pointDirection = new THREE.Vector3();
const fieldOfViewThreshold = Math.cos(THREE.MathUtils.degToRad(45)); // Adjust the FOV threshold as needed




const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    //Update Material 
    pariclesMaterial.uniforms.uTime.value = elapsedTime
    
    
    // Apply damping to camera rotation
    // if (!isGSAPAnimating) {
    //     // Apply damping to camera rotation
    //     camera.rotation.y += (targetRotationY - camera.rotation.y) * dampingFactor;

    //     // Apply damping to camera position
    //     camera.position.lerp(targetPosition, dampingFactor);
    // }
    
    // Update controls
    controls.update()
    
    if (model) {
        // Set the raycaster to check directly beneath the camera
        //terrainRaycaster.set(camera.position, new THREE.Vector3(0, -1, 0));

        // Update the raycaster's origin and direction based on the camera's position and rotation
    terrainRaycaster.ray.origin.copy(camera.position);
    terrainRaycaster.ray.direction.set(0, -1, 0).applyQuaternion(camera.quaternion);

        const intersects = terrainRaycaster.intersectObject(model, true);
        
    
        if (intersects.length > 0) {
            // Get the height of the terrain directly below the camera
            const terrainHeight = intersects[0].point.y;
            const targetHeight = terrainHeight + offsetHeight;
    
            // Smoothly interpolate the camera height for both ascending and descending
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetHeight, dampingFactor);
        }
    }


    // Update camera direction
    camera.getWorldDirection(cameraDirection);
    

    for (const point of points) {
        const screenPosition = point.cube.position.clone();
        screenPosition.project(camera);

        // Raycaster
        raycaster.setFromCamera(screenPosition, camera);

        // Calculate distance from the camera to the point
        const distance = point.cube.position.distanceTo(camera.position);

       
        // Calculate direction from camera to point
        pointDirection.subVectors(point.cube.position, camera.position).normalize();

        // Check if point is within camera's field of view
        if (cameraDirection.dot(pointDirection) > fieldOfViewThreshold) {
            // Point is within the field of view
            if (distance <= visibilityThreshold) {
                point.element.classList.add('visible');
                const intensity = minIntensity + (maxIntensity - minIntensity) * (1 - distance / visibilityThreshold);
                point.pointLight.intensity = intensity;
            } else {
                point.element.classList.remove('visible');
                point.pointLight.intensity = minIntensity;
            }
        } else {
            // Point is outside the field of view
            point.element.classList.remove('visible');
            point.pointLight.intensity = minIntensity;
        }

        const translateX = screenPosition.x * sizes.width * 0.5;
        const translateY = - screenPosition.y * sizes.height * 0.5;
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
    }

    

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();



//const gui = new GUI()


// const cameraFolder = gui.addFolder('Camera')

// cameraFolder.add(camera.position, 'x', -1000, 1000)
// cameraFolder.add(camera.position, 'y', -1000, 1000)
// cameraFolder.add(camera.position, 'z', -1000, 1000)


// cameraFolder.close()
