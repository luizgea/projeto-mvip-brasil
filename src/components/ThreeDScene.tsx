
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
  buildablePolygon?: any;
  alturaMaxima?: number;
}

const ThreeDScene: React.FC<ThreeDSceneProps> = ({ 
  buildingParams, 
  buildablePolygon,
  alturaMaxima
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const buildingRef = useRef<THREE.Group | null>(null);
  const terrainRef = useRef<THREE.Mesh | null>(null);
  const buildableShapeRef = useRef<THREE.Mesh | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 100, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const gridHelper = new THREE.GridHelper(100, 100);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(25);
    scene.add(axesHelper);

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

    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);
    buildingRef.current = buildingGroup;

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

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Effect for rendering the standard building
  useEffect(() => {
    if (!buildingRef.current) return;

    while (buildingRef.current.children.length > 0) {
      buildingRef.current.remove(buildingRef.current.children[0]);
    }

    const floorHeight = buildingParams.height / buildingParams.floors;

    for (let i = 0; i < buildingParams.floors; i++) {
      const floorGeometry = new THREE.BoxGeometry(
        buildingParams.width,
        floorHeight,
        buildingParams.length
      );
      
      const hue = (i / buildingParams.floors) * 0.1 + 0.6;
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(hue, 0.5, 0.5),
        transparent: true,
        opacity: 0.8,
      });
      
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      
      floor.position.y = (i * floorHeight) + (floorHeight / 2);
      floor.position.x = 0;
      floor.position.z = 0;
      
      floor.castShadow = true;
      floor.receiveShadow = true;
      
      buildingRef.current.add(floor);
    }

    if (terrainRef.current) {
      const terrainSize = 100;
      const centerX = (buildingParams.setbacks.right - buildingParams.setbacks.left) / 2;
      const centerZ = (buildingParams.setbacks.back - buildingParams.setbacks.front) / 2;
      
      buildingRef.current.position.x = centerX;
      buildingRef.current.position.z = centerZ;
      
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
  
  // Effect for rendering the buildable polygon if available
  useEffect(() => {
    if (!sceneRef.current || !buildablePolygon) return;
    
    // Remove existing buildable shape if exists
    if (buildableShapeRef.current && sceneRef.current) {
      sceneRef.current.remove(buildableShapeRef.current);
      buildableShapeRef.current = null;
    }
    
    try {
      // This is a simplified implementation - in a real app you would 
      // need to convert GeoJSON polygon to THREE.Shape properly
      if (buildablePolygon && buildablePolygon.geometry && buildablePolygon.geometry.coordinates) {
        const coordinates = buildablePolygon.geometry.coordinates[0];
        
        // Create a Three.js shape from the coordinates
        const shape = new THREE.Shape();
        
        // Start at the first point
        if (coordinates && coordinates.length > 0) {
          shape.moveTo(coordinates[0][0], coordinates[0][1]);
          
          // Add all other points
          for (let i = 1; i < coordinates.length; i++) {
            shape.lineTo(coordinates[i][0], coordinates[i][1]);
          }
          
          // Close the shape
          shape.closePath();
          
          // Create extruded geometry
          const height = alturaMaxima || 10;
          const extrudeSettings = {
            steps: 1,
            depth: height,
            bevelEnabled: false
          };
          
          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const material = new THREE.MeshStandardMaterial({ 
            color: 0x3366cc,
            transparent: true,
            opacity: 0.5
          });
          
          const mesh = new THREE.Mesh(geometry, material);
          mesh.rotation.x = -Math.PI / 2;
          mesh.position.y = 0;
          
          if (sceneRef.current) {
            sceneRef.current.add(mesh);
            buildableShapeRef.current = mesh;
          }
        }
      }
    } catch (error) {
      console.error("Error rendering buildable polygon:", error);
    }
  }, [buildablePolygon, alturaMaxima]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeDScene;
