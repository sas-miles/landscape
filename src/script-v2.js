import * as THREE from 'three'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MapControls } from 'three/examples/jsm/controls/MapControls.js'
import { Raycaster } from 'three'
import { gsap } from "gsap";

/**
 * TODO
 * - Add HTML Elements
 * - Add GSAP Animations
 * -- Intro and hovers on elements 
 * -- Add more objects on scene
 */


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xedf6f9)


/**
 * MOUSE
 */

const mouse = new THREE.Vector2()

// window.addEventListener('mousemove', (event) => {
//     mouse.x = event.clientX / sizes.width * 2 - 1
//     mouse.y = - (event.clientY / sizes.height * 2 - 1)
// })

window.addEventListener('click', () => {
    if(currentIntersect){
        console.log('click')
    }
})




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
    '/models/landscape/landscape.gltf',
    (gltf) => 
    {
        console.log(gltf)
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                
                child.material.color.setHex(0xe7bc91);
            }
        });
        gltf.scene.scale.set(100, 100, 100)

        scene.add(gltf.scene)
        model = gltf.scene

        model.position.set(-300, -100, 0)
         // Add the model's position to the GUI
         gui.add(model.position, 'x', -500, 500);
         gui.add(model.position, 'y', -500, 500);
         gui.add(model.position, 'z', -500, 500);

    }
)


/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(100, 200, 100)
const materialA = new THREE.MeshStandardMaterial({color: 0x233d4d})
const cubeOne = new THREE.Mesh(geometry, materialA)
cubeOne.position.set(0, 100, 0)
cubeOne.rotateY(0.5)

const geometryTwo = new THREE.BoxGeometry(100, 200, 100)
const cubeTwo = new THREE.Mesh(geometryTwo, materialA)
cubeTwo.position.set(-260, 100, 380)
cubeTwo.rotateY(0.5)


const materialB = new THREE.MeshStandardMaterial({color: 0x29524a})
const cubeThree = new THREE.Mesh(geometryTwo, materialB)
cubeThree.position.set(400, 100, 770)
cubeThree.rotateY(0.5)

scene.add(cubeOne, cubeTwo, cubeThree)


/**
 * POINTS
*/ 


const objects = [
    {
        cube: cubeOne,
        position: new THREE.Vector3(0, 2, 0),
        element: document.querySelector('.point-0'), 
        distance: 800,
        translateMultiplier: 0.5
    },
    {
        cube: cubeTwo,
        position: new THREE.Vector3(-260, -10, 390),
        element: document.querySelector('.point-1'),
        distance: 600,
        translateMultiplier: 0.51
    },
    {
        cube: cubeThree,
        position: new THREE.Vector3(410, 40, 780),
        element: document.querySelector('.point-2'),
        distance: 350,
        translateMultiplier: 0.5
    }
]

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight(0xffffff, 5)
directionalLight.position.set(606, 754, -376)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 10)
scene.add(ambientLight)

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

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 1, 10000)
camera.position.set(5300, 400, 1100)


scene.add(camera)


/**
 * Controls
 */


const controls = new MapControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
// controls.minDistance = -80;
// controls.maxDistance = 1700;
// var minPan = new THREE.Vector3( 0, 0, - 100 );
// var maxPan = new THREE.Vector3( 0, 0, 400 );
// controls.addEventListener('change', () => {
//     controls.target.clamp(minPan, maxPan);
// });

const axesHelper = new THREE.AxesHelper( 1000 );
scene.add( axesHelper );
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



const clock = new THREE.Clock()
let previousTime = 0

let currentIntersect = null


document.addEventListener('DOMContentLoaded', (event) => {
    // Your JavaScript code goes here
});

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    controls.update()


    for (const object of objects){
        let visibilityThreshold = object.distance; 
        const screenPosition = object.position.clone()
        screenPosition.project(camera)

        raycaster.setFromCamera(screenPosition, camera)
        const distance = camera.position.distanceTo(object.cube.position)

        if(distance < visibilityThreshold) {
            // Make the point visible
            object.element.classList.add('visible')
        } else {
            // Make the point invisible
            object.element.classList.remove('visible')
        }
        const translateX = screenPosition.x * sizes.width * object.translateMultiplier
        const translateY = - screenPosition.y * sizes.height * object.translateMultiplier
        object.element.style.transform = `translate(${translateX}px, ${translateY}px)`
    }
    

    // Render
    renderer.render(scene, camera)
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/**
 * Base
 */
// Debug
const gui = new GUI()
const cameraFolder = gui.addFolder('Camera')
const lightFolder = gui.addFolder('Directional Light')
const cubeTwoFolder = gui.addFolder('Cube Two')
const cubeThreeFolder = gui.addFolder('Cube Three')
const pointOneFolder = gui.addFolder('Point One')

// Add controllers for the x, y, and z position
cameraFolder.add(camera.position, 'x', -10000, 10000, 100)
cameraFolder.add(camera.position, 'y', -10000, 10000, 100)
cameraFolder.add(camera.position, 'z', -10000, 10000, 100)

// Add controllers for the color, intensity, and position
lightFolder.addColor(directionalLight, 'color').onChange(() => {
    directionalLight.color.set(directionalLight.color)
})
lightFolder.add(directionalLight, 'intensity', 0, 10)
lightFolder.add(directionalLight.position, 'x', -1000, 1000)
lightFolder.add(directionalLight.position, 'y', -1000, 1000)
lightFolder.add(directionalLight.position, 'z', -1000, 1000)

//Add controllers for cubeThree
cubeThreeFolder.add(cubeThree.position, 'x', -2000, 2000, 10)
cubeThreeFolder.add(cubeThree.position, 'y', -2000, 2000, 10)
cubeThreeFolder.add(cubeThree.position, 'z', -2000, 2000, 10)

//Add controllers for cubeTwo
cubeTwoFolder.add(cubeTwo.position, 'x', -2000, 2000, 10)
cubeTwoFolder.add(cubeTwo.position, 'y', -2000, 2000, 10)
cubeTwoFolder.add(cubeTwo.position, 'z', -2000, 2000, 10)

//Add controllers for pointOne
pointOneFolder.add(objects[2].position, 'x', -1000, 1000, 10)
pointOneFolder.add(objects[2].position, 'y', -1000, 1000, 10)
pointOneFolder.add(objects[2].position, 'z', -1000, 1000, 10)

lightFolder.open() // Open the folder by default
cameraFolder.open() // Open the folder by default