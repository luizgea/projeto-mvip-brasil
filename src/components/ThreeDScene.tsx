
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// Corrigindo o import para OrbitControls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface BuildingParams {
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
}

interface ThreeDSceneProps {
  buildingParams: BuildingParams;
}

const ThreeDScene: React.FC<ThreeDSceneProps> = ({ buildingParams }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const buildingRef = useRef<THREE.Group | null>(null);
  const terrainRef = useRef<THREE.Mesh | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 100, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Grid
    const gridHelper = new THREE.GridHelper(100, 100);
    scene.add(gridHelper);

    // Axes
    const axesHelper = new THREE.AxesHelper(25);
    scene.add(axesHelper);

    // Terrain
    const terrainGeometry = new THREE.PlaneGeometry(100, 100);
    const terrainMaterial = new THREE.MeshStandardMaterial({
      color: 0x7ec850,
      side: THREE.DoubleSide,
    });
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);
    terrainRef.current = terrain;

    // Building Group
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);
    buildingRef.current = buildingGroup;

    // Animation loop
    const animate = () => {
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animate();

    // Responsive resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (buildingRef.current) {
        buildingRef.current.clear();
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!buildingRef.current) return;

    // Clear existing building mesh
    while (buildingRef.current.children.length > 0) {
      buildingRef.current.remove(buildingRef.current.children[0]);
    }

    // Floor height (average 3m per floor)
    const floorHeight = buildingParams.height / buildingParams.floors;

    // Create building floors
    for (let i = 0; i < buildingParams.floors; i++) {
      const floorGeometry = new THREE.BoxGeometry(
        buildingParams.width,
        floorHeight,
        buildingParams.length
      );
      
      // Different colors for different floors
      const hue = (i / buildingParams.floors) * 0.1 + 0.6; // Blue-ish colors
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(hue, 0.5, 0.5),
        transparent: true,
        opacity: 0.8,
      });
      
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      
      // Position each floor
      floor.position.y = (i * floorHeight) + (floorHeight / 2);
      floor.position.x = 0;
      floor.position.z = 0;
      
      floor.castShadow = true;
      floor.receiveShadow = true;
      
      buildingRef.current.add(floor);
    }

    // Position the building in relation to setbacks
    if (terrainRef.current) {
      const terrainSize = 100; // Our terrain size
      
      // Calculate the center position based on setbacks
      const centerX = (buildingParams.setbacks.right - buildingParams.setbacks.left) / 2;
      const centerZ = (buildingParams.setbacks.back - buildingParams.setbacks.front) / 2;
      
      buildingRef.current.position.x = centerX;
      buildingRef.current.position.z = centerZ;
      
      // Apply offset to center the building on the terrain
      const terrainOffsetX = -(terrainSize / 2) + (buildingParams.width / 2) + buildingParams.setbacks.left;
      const terrainOffsetZ = -(terrainSize / 2) + (buildingParams.length / 2) + buildingParams.setbacks.front;
      
      buildingRef.current.position.x += terrainOffsetX;
      buildingRef.current.position.z += terrainOffsetZ;
    }
  }, [
    buildingParams.width,
    buildingParams.length, 
    buildingParams.height, 
    buildingParams.floors,
    buildingParams.setbacks
  ]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeDScene;
