import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function AnimatedCube({ stats }) {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cubeRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setClearColor(0x000000, 0);
        containerRef.current.appendChild(renderer.domElement);

        // Create cube with gradient colors based on stats
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const materials = [
            new THREE.MeshPhongMaterial({
                color: 0x667eea,
                emissive: 0x667eea,
                emissiveIntensity: 0.5
            }),
            new THREE.MeshPhongMaterial({
                color: 0x764ba2,
                emissive: 0x764ba2,
                emissiveIntensity: 0.5
            }),
            new THREE.MeshPhongMaterial({
                color: 0x10b981,
                emissive: 0x10b981,
                emissiveIntensity: 0.5
            }),
            new THREE.MeshPhongMaterial({
                color: 0xf59e0b,
                emissive: 0xf59e0b,
                emissiveIntensity: 0.5
            }),
            new THREE.MeshPhongMaterial({
                color: 0xef4444,
                emissive: 0xef4444,
                emissiveIntensity: 0.5
            }),
            new THREE.MeshPhongMaterial({
                color: 0x3b82f6,
                emissive: 0x3b82f6,
                emissiveIntensity: 0.5
            })
        ];

        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);
        cubeRef.current = cube;

        // Lighting
        const light1 = new THREE.PointLight(0xffffff, 1, 100);
        light1.position.set(5, 5, 5);
        scene.add(light1);

        const light2 = new THREE.PointLight(0x667eea, 0.5, 100);
        light2.position.set(-5, -5, 5);
        scene.add(light2);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        camera.position.z = 4;

        // Create particles
        const particleCount = 50;
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesPositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            particlesPositions[i] = (Math.random() - 0.5) * 20;
            particlesPositions[i + 1] = (Math.random() - 0.5) * 20;
            particlesPositions[i + 2] = (Math.random() - 0.5) * 20;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x667eea,
            size: 0.1,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.6
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate cube
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.008;

            // Rotate particles
            particles.rotation.x += 0.0002;
            particles.rotation.y += 0.0003;

            // Scale cube based on completion rate
            const completionRate = stats?.completionRate || 0;
            const scale = 0.9 + (completionRate / 100) * 0.3;
            cube.scale.set(scale, scale, scale);

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            if (containerRef.current) {
                const width = containerRef.current.clientWidth;
                const height = containerRef.current.clientHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, [stats]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '250px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'rgba(0, 0, 0, 0.1)',
                marginBottom: '20px'
            }}
        />
    );
}

export default AnimatedCube;
