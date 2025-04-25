
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ThreeDSceneProps {
  buildingParams: {
    width: number;
    length: number;
    height: number;
    floors: number;
    setbacks: {
      front: number;
      back: number;
      left: number;
      right: number;
    };
  };
}

const ThreeDScene: React.FC<ThreeDSceneProps> = ({ buildingParams }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(50, 50, 50);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x999999,
      side: THREE.DoubleSide,
      roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper
    const gridHelper = new THREE.GridHelper(200, 20);
    scene.add(gridHelper);

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Remove previous buildings
    sceneRef.current.children.forEach(child => {
      if (child.name === 'building') {
        sceneRef.current?.remove(child);
      }
    });
    
    // Calculate dimensions
    const { width, length, height, floors, setbacks } = buildingParams;
    const floorHeight = height / floors;
    
    // Create building floors with setbacks
    for (let i = 0; i < floors; i++) {
      const setbackFactor = 1 - (i / (floors * 2));
      
      const floorWidth = width * setbackFactor;
      const floorLength = length * setbackFactor;
      
      const geometry = new THREE.BoxGeometry(floorWidth, floorHeight, floorLength);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0xd6bcfa, 
        transparent: true, 
        opacity: 0.9,
        roughness: 0.3
      });
      
      const floor = new THREE.Mesh(geometry, material);
      floor.position.y = floorHeight * (i + 0.5);
      floor.castShadow = true;
      floor.receiveShadow = true;
      floor.name = 'building';
      
      sceneRef.current.add(floor);
    }
  }, [buildingParams]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-gray-100 rounded-md"
      style={{ minHeight: '400px' }}
    />
  );
};

export default ThreeDScene;
