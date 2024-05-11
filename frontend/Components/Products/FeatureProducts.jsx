import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const FloorScene = () => {
    const canvasRef = useRef(null);
    const modelRef = useRef();
    const previousMousePosition = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const pivot = useRef(new THREE.Object3D()); // Create a pivot point

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff); // Set background to white

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true; // Enable shadows
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soften shadows

        const loader = new GLTFLoader().setPath('/millennium_falcon/');
        loader.load('scene.gltf', (gltf) => {
            const model = gltf.scene;
            modelRef.current = model;
            scene.add(pivot.current); // Add the pivot to the scene
            pivot.current.add(model); // Add the model to the pivot
            
            // Calculate the centroid of the model's geometry
            const centroid = new THREE.Vector3();
            const geometry = new THREE.Geometry().fromBufferGeometry(model.children[0].geometry);
            geometry.computeBoundingBox();
            geometry.boundingBox.getCenter(centroid);
            
            // Move the pivot to the centroid of the model
            pivot.current.position.copy(centroid.negate());

            // Enable shadow casting and receiving for the model
            model.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        });

        // Add ambient light to illuminate the scene
        const ambientLight = new THREE.AmbientLight(0xffffff, 5);
        scene.add(ambientLight);

        // Add directional light for shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        scene.add(directionalLight);

        camera.position.z = 4; // Initial camera position

        const handleMouseDown = (event) => {
            isDragging.current = true;
            previousMousePosition.current = { x: event.clientX, y: event.clientY };
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        const handleMouseMove = (event) => {
            if (!isDragging.current) return;

            const { clientX, clientY } = event;
            const deltaX = clientX - previousMousePosition.current.x;
            const deltaY = clientY - previousMousePosition.current.y;

            previousMousePosition.current = { x: clientX, y: clientY };

            if (modelRef.current) {
                pivot.current.rotation.y += deltaX * 0.01; // Rotate on Y-axis
                pivot.current.rotation.x += deltaY * 0.01; // Rotate on X-axis
            }
        };

        const handleMouseWheel = (event) => {
            event.preventDefault();
            const delta = Math.max(-1, Math.min(1, (event.deltaY || -event.detail)));

            if (modelRef.current) {
                const model = modelRef.current;
                camera.position.z += delta * 0.4;
            }
        };

        canvasRef.current.addEventListener('mousedown', handleMouseDown);
        canvasRef.current.addEventListener('mouseup', handleMouseUp);
        canvasRef.current.addEventListener('mousemove', handleMouseMove);
        canvasRef.current.addEventListener('wheel', handleMouseWheel);

        const animate = function () {
            requestAnimationFrame(animate);

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            renderer.dispose();
            canvasRef.current.removeEventListener('mousedown', handleMouseDown);
            canvasRef.current.removeEventListener('mouseup', handleMouseUp);
            canvasRef.current.removeEventListener('mousemove', handleMouseMove);
            canvasRef.current.removeEventListener('wheel', handleMouseWheel);
        };
    }, []);

    return <canvas ref={canvasRef} />;
};

export default FloorScene;
