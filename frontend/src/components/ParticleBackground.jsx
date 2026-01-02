import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function ParticleBackground() {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        sceneRef.current = scene;

        // Create particles
        const particleCount = 300;
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesPositions = new Float32Array(particleCount * 3);
        const particlesVelocity = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            particlesPositions[i] = (Math.random() - 0.5) * 100;
            particlesPositions[i + 1] = (Math.random() - 0.5) * 100;
            particlesPositions[i + 2] = (Math.random() - 0.5) * 100;

            particlesVelocity[i] = (Math.random() - 0.5) * 0.2;
            particlesVelocity[i + 1] = (Math.random() - 0.5) * 0.2;
            particlesVelocity[i + 2] = (Math.random() - 0.5) * 0.2;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x667eea,
            size: 0.3,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8,
            sizeRange: [0.1, 10]
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        camera.position.z = 30;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            const positions = particlesGeometry.attributes.position.array;

            for (let i = 0; i < particleCount * 3; i += 3) {
                positions[i] += particlesVelocity[i];
                positions[i + 1] += particlesVelocity[i + 1];
                positions[i + 2] += particlesVelocity[i + 2];

                // Wrap around edges
                if (positions[i] > 50) positions[i] = -50;
                if (positions[i] < -50) positions[i] = 50;
                if (positions[i + 1] > 50) positions[i + 1] = -50;
                if (positions[i + 1] < -50) positions[i + 1] = 50;
                if (positions[i + 2] > 50) positions[i + 2] = -50;
                if (positions[i + 2] < -50) positions[i + 2] = 50;
            }

            particlesGeometry.attributes.position.needsUpdate = true;

            particles.rotation.x += 0.0001;
            particles.rotation.y += 0.0001;

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
}

export default ParticleBackground;
