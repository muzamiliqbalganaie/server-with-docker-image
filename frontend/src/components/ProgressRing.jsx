import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function ProgressRing({ completionRate = 0 }) {
    const containerRef = useRef(null);

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

        // Create torus (ring) for progress
        const geometry = new THREE.TorusGeometry(2, 0.3, 32, 64);
        const material = new THREE.MeshPhongMaterial({
            color: 0x667eea,
            emissive: 0x667eea,
            emissiveIntensity: 0.6,
            wireframe: false
        });

        const torus = new THREE.Mesh(geometry, material);
        scene.add(torus);

        // Create progress indicator (smaller torus)
        const progressGeometry = new THREE.TorusGeometry(2, 0.2, 32, 64);
        const progressMaterial = new THREE.MeshPhongMaterial({
            color: 0x10b981,
            emissive: 0x10b981,
            emissiveIntensity: 0.8
        });

        const progressTorus = new THREE.Mesh(progressGeometry, progressMaterial);
        scene.add(progressTorus);

        // Lighting
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(5, 5, 5);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        camera.position.z = 5;

        // Animation
        let animationProgress = 0;
        const targetProgress = completionRate / 100;

        const animate = () => {
            requestAnimationFrame(animate);

            // Smooth progress animation
            animationProgress += (targetProgress - animationProgress) * 0.05;

            // Scale progress torus based on completion
            progressTorus.scale.set(1 + animationProgress * 0.3, 1 + animationProgress * 0.3, 1);

            // Rotate both
            torus.rotation.x += 0.005;
            torus.rotation.y += 0.008;

            progressTorus.rotation.x -= 0.008;
            progressTorus.rotation.y += 0.005;

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
    }, [completionRate]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '150px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'rgba(0, 0, 0, 0.05)',
                position: 'relative'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    zIndex: 10,
                    pointerEvents: 'none'
                }}
            >
                <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#667eea',
                    textShadow: '0 0 10px rgba(102, 126, 234, 0.5)'
                }}>
                    {Math.round(completionRate)}%
                </div>
                <div style={{
                    fontSize: '12px',
                    color: '#999',
                    marginTop: '4px'
                }}>
                    Complete
                </div>
            </div>
        </div>
    );
}

export default ProgressRing;
