import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useGLTF, useAnimations, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { DomeObject } from "../objects/DomeObject";
import { useFrame } from "@react-three/fiber";

const DOME_GLB = 'cupula_jml-test.glb'

export const DomeCanvas = (props) => {
  const w = window as any // For debugging
  
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef();
  
  const gltf = useGLTF(DOME_GLB);
  const dome = w.dome = new DomeObject(gltf.scene);
  const { actions } = useAnimations(gltf.animations, dome);

  useEffect(() =>  {
    // actions["movimiento"].play();
    w.mov = actions["movimiento"]
  });

  useFrame(() => {
    dome.update()
  })

  return (
    <>
      {/* GLB content */}
      <primitive object={dome} />

      {/* Custom stuff we add to the scene */}
      <group>
        <primitive object={new THREE.GridHelper(50, 10)} position={[0,-0.01,0]} />
      </group>

      {/* Mouse controls */}
      <OrbitControls ref={controlsRef} />

      <PerspectiveCamera ref={cameraRef} makeDefault position={[25, 25, 50]} />

      {/* Some custom lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color={0xffffff} />
    </>
  );
};

useGLTF.preload("cupula_new.glb");

export default DomeCanvas;
