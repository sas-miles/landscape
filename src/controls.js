import { MapControls } from 'three/examples/jsm/controls/MapControls';
import gsap from 'gsap';

function createControls(camera, canvas) {
    const controls = new MapControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.08

    // Set the rotation order
    camera.rotation.order = 'YXZ';

    let isMouseDown = false;
    let startMouseX = 0;
    let isAnimating = true; // Add this flag

    window.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        startMouseX = event.clientX;
    });
    
    window.addEventListener('mousemove', (event) => {
        if (isMouseDown && !isAnimating) { // Check the flag here
            const deltaX = event.clientX - startMouseX;
            const rotateSpeed = 0.01; // Adjust to control the speed of the rotation
            camera.rotation.y -= deltaX * rotateSpeed; // Adjust the camera's rotation
            startMouseX = event.clientX;
        }
    });
    
    window.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

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
            isAnimating = false; // Set the flag to false when the animation is complete
        }
    });

    return controls
}

export { createControls }