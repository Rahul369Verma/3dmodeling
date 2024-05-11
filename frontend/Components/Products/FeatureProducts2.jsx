import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const FalconScene = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000);
        renderer.setPixelRatio(window.devicePixelRatio);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(4, 5, 11);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = 5;
        controls.maxDistance = 20;
        controls.minPolarAngle = 0.5;
        controls.maxPolarAngle = 1.5;
        controls.autoRotate = false;
        controls.target = new THREE.Vector3(0, 1, 0);

        const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
        groundGeometry.rotateX(-Math.PI / 2);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            side: THREE.DoubleSide
        });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.castShadow = false;
        groundMesh.receiveShadow = true;
        scene.add(groundMesh);

        const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
        spotLight.position.set(0, 25, 0);
        spotLight.castShadow = true;
        spotLight.shadow.bias = -0.0001;
        scene.add(spotLight);

        const loader = new GLTFLoader().setPath('/millennium_falcon/');
        loader.load('scene.gltf', (gltf) => {
            const mesh = gltf.scene;

            mesh.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            mesh.position.set(0, 1.05, -1);
            scene.add(mesh);

            // Hide loading progress
            document.getElementById('progress-container').style.display = 'none';
        }, (xhr) => {
            console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
        }, (error) => {
            console.error(error);
        });

        // Resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        
        // Render loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        
        animate();
        
        // Append renderer to DOM
        canvasRef.current.appendChild(renderer.domElement);
        // Clean-up function
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <div ref={canvasRef} />;
};

export default FalconScene;
