import * as THREE from 'three'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MapControls } from 'three/examples/jsm/controls/MapControls.js'
import { Raycaster } from 'three'
import { gsap } from "gsap";

const gui = new GUI()


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
})


// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

let sceneReady = false
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        

        window.setTimeout(() =>
        {
            sceneReady = true
        }, 2000)
    }

    
)

/**
 * Lights
 */

//Array of lights

const lightOneA = new THREE.DirectionalLight(0xffffff, .8)

scene.add(lightOneA)

const lightOneB = new THREE.PointLight(0xffffff, 3500)
const lightTwoB = new THREE.PointLight(0xffffff, 3500)
const lightThreeB = new THREE.PointLight(0xffffff, 3500)
const lightFourB = new THREE.PointLight(0xffffff, 3500)
const lightFiveB = new THREE.PointLight(0xffffff, 3500)

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
 * Models
 */
const dracoLoader = new DRACOLoader()
const gltfLoader = new GLTFLoader()
dracoLoader.setDecoderPath('/draco/')
console.log(gltfLoader)
gltfLoader.setDRACOLoader(dracoLoader)

let model = null

gltfLoader.load(
    '/models/new-landscape/landscape-simple.gltf',
    (gltf) => 
    {
        console.log(gltf)
        // gltf.scene.traverse((child) => {
        //     if (child.isMesh) {
                
        //         child.material.color.setHex(0xe7bc91);
        //     }
        // });
        gltf.scene.scale.set(.8, .8, .8)

        scene.add(gltf.scene)
        model = gltf.scene
        model.rotateY(5)
        model.position.set(0,-2,0)

         // Add the model's position to the GUI
         gui.add(model.position, 'x', -500, 500);
         gui.add(model.position, 'y', -500, 500);
         gui.add(model.position, 'z', -500, 500);

    }
)

/**
 * Camera
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 1000)
camera.position.set(0,32.375,105)
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

// Animate the camera to its final position
gsap.to(camera.position, {
    duration: 3, // Duration in seconds
    x: 0,
    y: 10,
    z: 105,
    ease: "power3.out", // This easing can be adjusted
    onStart: () => {
        console.log("Camera animation started");
    },
    onUpdate: () => {
        // Update anything necessary during the animation
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
const controls = new MapControls(camera, canvas);
controls.enableRotate = false; // Disable rotation in MapControls

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationSpeed = 0.005; // Adjust as needed

document.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        // Apply rotation
        camera.rotation.y += deltaX * rotationSpeed;
        camera.rotation.x += deltaY * rotationSpeed;

        previousMousePosition.x = event.clientX;
        previousMousePosition.y = event.clientY;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});


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
renderer.setClearColor(0x000000, 0.0);
renderer.autoClear = false;

/**
 * Animation 
*/
const clock = new THREE.Clock()
let previousTime = 0

// Camera Control Limits
const terrainRaycaster = new THREE.Raycaster();
const offsetHeight = 10; // Height above the ground
const dampingFactor = 0.1; // Adjust for smoother transition

// Scene Object Interactions
const cubes = objects.map(object => object.cube);
const minIntensity = 500;       // Minimum light intensity
const maxIntensity = 8000;         // Maximum light intensity
const visibilityThreshold = 60; // Adjust this value as needed
const cameraDirection = new THREE.Vector3();
const pointDirection = new THREE.Vector3();
const fieldOfViewThreshold = Math.cos(THREE.MathUtils.degToRad(45)); // Adjust the FOV threshold as needed




const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    if (isDragging) {
        // Apply damping to the rotation
        camera.rotation.y += (camera.rotation.y - camera.rotation.y) * dampingFactor;
        camera.rotation.x += (camera.rotation.x - camera.rotation.x) * dampingFactor;
    }

    controls.update();

    if (model) {
        // Set the raycaster to check directly beneath the camera
        terrainRaycaster.set(camera.position, new THREE.Vector3(0, -1, 0));
        const intersects = terrainRaycaster.intersectObject(model, true);

        if (intersects.length > 0) {
            // Get the height of the terrain directly below the camera
            const terrainHeight = intersects[0].point.y;
            const targetHeight = terrainHeight + offsetHeight;

            // Smoothly interpolate the camera height
            camera.position.y += (targetHeight - camera.position.y) * dampingFactor;
        }
    }

    // Update camera direction
    camera.getWorldDirection(cameraDirection);
    

    for (const point of points) {
        const screenPosition = point.cube.position.clone();
        screenPosition.project(camera);

        // Raycaster
        raycaster.setFromCamera(screenPosition, camera);
        const intersects = raycaster.intersectObjects(cubes, true);

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


console.log(scene)



/**
 * GUI
 */


const cubeOneFolder = gui.addFolder('Box One')
const cubeTwoFolder = gui.addFolder('Box Two')
const cubeThreeFolder = gui.addFolder('Box Three')
const cubeFourFolder = gui.addFolder('Box Four')
const cubeFiveFolder = gui.addFolder('Box Five')

const cameraFolder = gui.addFolder('Camera')

const lightOneAFolder = gui.addFolder('Light One A')
const lightOneBFolder = gui.addFolder('Light One B')
const lightTwoBFolder = gui.addFolder('Light Two B')
const lightThreeBFolder = gui.addFolder('Light Three B')
const lightFourBFolder = gui.addFolder('Light Four B')
const lightFiveBFolder = gui.addFolder('Light Five B')
// const pointLightFolder = gui.addFolder('Point Light')


cameraFolder.add(camera.position, 'x', -1000, 1000)
cameraFolder.add(camera.position, 'y', -1000, 1000)
cameraFolder.add(camera.position, 'z', -1000, 1000)

//Directional Lights
lightOneAFolder.add(lightOneA.position, 'x', -100, 100)
lightOneAFolder.add(lightOneA.position, 'y', -100, 100)
lightOneAFolder.add(lightOneA.position, 'z', -100, 100)
lightOneAFolder.add(lightOneA, 'intensity', 0, 10)

//Point Lights
lightOneBFolder.add(lightOneB.position, 'x', -100, 100)
lightOneBFolder.add(lightOneB.position, 'y', -100, 100)
lightOneBFolder.add(lightOneB.position, 'z', -100, 100)

lightTwoBFolder.add(lightTwoB.position, 'x', -100, 100)
lightTwoBFolder.add(lightTwoB.position, 'y', -100, 100)
lightTwoBFolder.add(lightTwoB.position, 'z', -100, 100)

lightThreeBFolder.add(lightThreeB.position, 'x', -100, 100)
lightThreeBFolder.add(lightThreeB.position, 'y', -100, 100)
lightThreeBFolder.add(lightThreeB.position, 'z', -100, 100)

lightFourBFolder.add(lightFourB.position, 'x', -100, 100)
lightFourBFolder.add(lightFourB.position, 'y', -100, 100)
lightFourBFolder.add(lightFourB.position, 'z', -100, 100)

lightFiveBFolder.add(lightFiveB.position, 'x', -100, 100)
lightFiveBFolder.add(lightFiveB.position, 'y', -100, 100)
lightFiveBFolder.add(lightFiveB.position, 'z', -100, 100)

// pointLightFolder.add(pointLight.position, 'x', -100, 100)
// pointLightFolder.add(pointLight.position, 'y', -100, 100)
// pointLightFolder.add(pointLight.position, 'z', -100, 100)

cubeOneFolder.add(cubeOne.position, 'x', -100, 100)
cubeOneFolder.add(cubeOne.position, 'y', -100, 100)
cubeOneFolder.add(cubeOne.position, 'z', -100, 100)

cubeTwoFolder.add(cubeTwo.position, 'x', -100, 100)
cubeTwoFolder.add(cubeTwo.position, 'y', -100, 100)
cubeTwoFolder.add(cubeTwo.position, 'z', -100, 100)

cubeThreeFolder.add(cubeThree.position, 'x', -100, 100)
cubeThreeFolder.add(cubeThree.position, 'y', -100, 100)
cubeThreeFolder.add(cubeThree.position, 'z', -100, 100)

cubeFourFolder.add(cubeFour.position, 'x', -100, 100)
cubeFourFolder.add(cubeFour.position, 'y', -100, 100)
cubeFourFolder.add(cubeFour.position, 'z', -100, 100)

cubeFiveFolder.add(cubeFive.position, 'x', -100, 100)
cubeFiveFolder.add(cubeFive.position, 'y', -100, 100)
cubeFiveFolder.add(cubeFive.position, 'z', -100, 100)

cameraFolder.close()
lightOneAFolder.close()
lightOneBFolder.close()
lightTwoBFolder.close()
lightThreeBFolder.close()
lightFourBFolder.close()
lightFiveBFolder.close()