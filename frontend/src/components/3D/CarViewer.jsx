import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, Environment, Text } from "@react-three/drei";
import * as THREE from 'three';

// Defining the specific Auto Care look
const getAutoCarePaintProps = (color) => ({
    color: new THREE.Color(color || "#121212"),
    metalness: 0.9,
    roughness: 0.35,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    iridescence: 0.2,
    iridescenceIOR: 1.5,
});

// Error Boundary to catch missing models (404)
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    componentDidUpdate(prevProps) {
        if (prevProps.modelUrl !== this.props.modelUrl) {
            this.setState({ hasError: false });
        }
    }
    render() {
        if (this.state.hasError) {
            return <FallbackCar name={this.props.modelName} />;
        }
        return this.props.children;
    }
}

// A simple geometric abstraction of a car to display when the user has not uploaded the .glb yet
function FallbackCar({ name, color }) {
    const material = new THREE.MeshPhysicalMaterial(getAutoCarePaintProps(color));
    return (
        <group position={[0, 0.5, 0]}>
            {/* Lower Body */}
            <mesh castShadow receiveShadow position={[0, -0.2, 0]} material={material}>
                <boxGeometry args={[4, 0.8, 1.8]} />
            </mesh>
            {/* Cabin */}
            <mesh castShadow receiveShadow position={[-0.4, 0.5, 0]} material={material}>
                <boxGeometry args={[2, 0.6, 1.5]} />
            </mesh>
            {/* Wheels */}
            <mesh castShadow receiveShadow position={[-1.2, -0.5, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            <mesh castShadow receiveShadow position={[-1.2, -0.5, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            <mesh castShadow receiveShadow position={[1.2, -0.5, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            <mesh castShadow receiveShadow position={[1.2, -0.5, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            {/* Text Label */}
            <Text
                position={[0, 1.5, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000"
            >
                {name} (Placeholder)
            </Text>
            <Text
                position={[0, 1.1, 0]}
                fontSize={0.15}
                color="#aaa"
                anchorX="center"
                anchorY="middle"
            >
                Please upload {name.replace(/\s+/g, '_').toLowerCase()}.glb
            </Text>
        </group>
    );
}

function CarModel({ modelUrl, color }) {
    const { scene } = useGLTF(modelUrl);

    useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.isMesh) {
                    // Try to intercept paint-like materials, or just apply it to everything big enough
                    const mtlName = child.material?.name?.toLowerCase() || '';
                    if (mtlName.includes("body") || mtlName.includes("paint") || mtlName.includes("car") || mtlName.includes("exterior") || child.name.toLowerCase().includes("body") || mtlName === '') {

                        // We must mutate the color and physical properties directly rather than replacing the whole material object
                        // Replacing the whole object ruins the internal name cache, which breaks subsequent color changes!
                        if (child.material) {
                            child.material.color.set(color);
                            // Set AutoCare premium physical properties
                            if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
                                child.material.metalness = 0.9;
                                child.material.roughness = 0.35;
                                child.material.clearcoat = 1.0;
                                child.material.iridescence = 0.2;
                            }
                        }
                    }
                }
            });
        }
    }, [scene, color]);

    return <primitive object={scene} />;
}

export default function CarViewer({ selectedModel, selectedColor }) {
    // Mapping standard selections to their GLTF files
    const getModelUrl = (modelInput) => {
        // If the shop owner uploaded a custom GLB, use that Cloudinary URL!
        if (modelInput && typeof modelInput === 'object') {
            if (modelInput.modelUrl) {
                return modelInput.modelUrl;
            }
            // Fallback to name-based mapping if it's an object but has no custom URL
            modelInput = modelInput.modelName;
        }

        switch (modelInput) {
            case "Porsche 911":
                return "/models/porsche.glb";
            case "Toyota Supra":
                return "/models/toyota_supra.glb";
            case "Toyota Camry":
                return "/models/toyota_camry.glb";
            case "Toyota Corolla GLI":
                return "/models/toyota_corolla_gli.glb";
            case "Toyota Corolla XLI":
                return "/models/toyota_corolla_xli.glb";
            case "Honda Civic Type R":
                return "/models/honda_civic_typer.glb";
            case "Honda Accord":
                return "/models/honda_accord.glb";
            case "Honda Civic":
                return "/models/honda_civic.glb";
            case "Honda City":
                return "/models/honda_city.glb";
            case "Kia Sportage":
                return "/models/kia_sportage.glb";
            case "Hyundai Tucson":
                return "/models/hyundai_tucson.glb";
            case "Mercedes S-Class":
                return "/models/mercedes_sclass.glb";
            default:
                // Use the downloaded realistic toy car as a fallback demo for all custom models
                return "/models/porsche.glb";
        }
    };

    const modelUrl = getModelUrl(selectedModel);

    return (
        <div className="w-full h-full min-h-[600px] bg-gradient-to-br from-slate-900 via-gray-900 to-black relative shadow-inner overflow-hidden">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 45, position: [0, 2, 5] }}>
                <color attach="background" args={["#0a0a0a"]} />
                <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
                    <Stage environment={"city"} intensity={0.4} environmentIntensity={1.2} contactShadow={{ opacity: 0.9, blur: 3 }}>
                        <ErrorBoundary modelUrl={modelUrl} modelName={selectedModel} color={selectedColor}>
                            <React.Suspense fallback={null}>
                                <CarModel modelUrl={modelUrl} color={selectedColor} />
                            </React.Suspense>
                        </ErrorBoundary>
                    </Stage>
                </PresentationControls>
            </Canvas>
            <div className="absolute top-4 left-6 flex flex-col pointer-events-none">
                <span className="text-white/60 text-sm font-bold tracking-[0.3em] uppercase">Auto Care</span>
                <span className="text-indigo-400 text-xs font-mono tracking-widest mt-1">Satin Obsidian Iridescent</span>
            </div>
            <div className="absolute bottom-4 right-6 text-white/30 text-xs font-mono pointer-events-none">
                Drag to Rotate • Scroll to Zoom
            </div>
        </div>
    );
}
