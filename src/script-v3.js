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
scene.background = new THREE.Color(0xffffff)

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
        position: new THREE.Vector3(0, 0, 0),  // Example new position
        element: document.querySelector('.point-1'),
        distance: 18,
        translateMultiplier: 0
        
    },
    // {
    //     cube: cubeTwo,
    //     position: new THREE.Vector3(0, 0, 0),  // Unique position for point 2
    //     element: document.querySelector('.point-2'),
    //     distance: 50,
    //     translateMultiplier: 0.51
        
    // },
    // {
    //     cube: cubeThree,
    //     position: new THREE.Vector3(0, 0, 0),  // Unique position for point 3
    //     element: document.querySelector('.point-3'),
    //     distance: 50,
    //     translateMultiplier: 0.51
        
    // },
    // {
    //     cube: cubeFour,
    //     position: new THREE.Vector3(0, 0, 0),  // Unique position for point 4
    //     element: document.querySelector('.point-4'),
    //     distance: 50,
    //     translateMultiplier: 0.51
        
    // },
    // {
    //     cube: cubeFive,
    //     position: new THREE.Vector3(0, 0, 0),  // Unique position for point 5
    //     element: document.querySelector('.point-5'),
    //     distance: 50,
    //     translateMultiplier: 0.51
       
    // }
]



const axesHelper = new THREE.AxesHelper( 1000 );
scene.add( axesHelper );


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

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()


/**
 * Lights
 */

//Array of lights

const lightOneA = new THREE.DirectionalLight(0xffffff, 1.5)

const directionalLights = [
    { 
        light: lightOneA,
        position: new THREE.Vector3(0, 2, 0),
        intensity: 0
    }
]

directionalLights.forEach(lightObject => {
    lightObject.light.position.set(lightObject.position.x, lightObject.position.y, lightObject.position.z)
    lightObject.light.intensity = lightObject.intensity
    
    const lightHelper = new THREE.DirectionalLightHelper(lightObject.light, 0)
    scene.add(lightObject.light, lightHelper)
})

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

    // const lightHelper = new THREE.PointLightHelper(lightObject.light, 1)
    // scene.add(lightObject.light, lightHelper)
})


/**
 * Controls
 */
const controls = new MapControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.1;



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
let currentIntersect = null


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    
    controls.update()

    // Go through each point
    for(const point of points)
    {
        let visibilityThreshold = point.distance
        const screenPosition = point.position.clone()
        screenPosition.project(camera)

        raycaster.setFromCamera(screenPosition, camera)
        const distance = camera.position.distanceTo(point.cube.position)
        if(distance < visibilityThreshold)
        {
            point.element.classList.add('visible')
        }
        else
        {
            point.element.classList.remove('visible')
        }

        const translateX = screenPosition.x * sizes.width * point.translateMultiplier
        const translateY = - screenPosition.y * sizes.height * point.translateMultiplier
        point.element.style.transform = `translate(${translateX}px, ${translateY}px)`

    }

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()

console.log(scene)



/**
 * GUI
 */

const pointOneFolder = gui.addFolder('Point One')

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


cameraFolder.add(camera.position, 'x', -100, 100)
cameraFolder.add(camera.position, 'y', -100, 100)
cameraFolder.add(camera.position, 'z', -100, 100)

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


pointOneFolder.add(points[0].position, 'x', -500, 500)
pointOneFolder.add(points[0].position, 'y', -500, 500)
pointOneFolder.add(points[0].position, 'z', -500, 500)



cameraFolder.close()
lightOneAFolder.close()
lightOneBFolder.close()
lightTwoBFolder.close()
lightThreeBFolder.close()
lightFourBFolder.close()
lightFiveBFolder.close()