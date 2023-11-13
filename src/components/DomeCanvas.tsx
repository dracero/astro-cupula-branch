// i need to importo useThree to adjust the camera position
import * as THREE from "three";
import React, { useRef, useState, useEffect } from "react";
import { useGLTF, useAnimations, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { DomeObject } from "./objects/DomeObject";


export const DomeCanvas = (props) => {
  const w = window as any // For debugging
  
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef();
  
  const gltf = useGLTF("cupula_new.glb");
  const dome = w.dome = new DomeObject(gltf.scene);
  const { actions } = useAnimations(gltf.animations, dome);

  useEffect(() =>  {
    // actions["movimiento"].play();
    w.mov = actions["movimiento"]
  });

  return (
    <>
      {/* GLB content */}
      <primitive object={dome} />

      {/* Custom stuff we add to the scene */}
      <group>
        <primitive object={new THREE.AxesHelper(50)} />
        <primitive object={new THREE.GridHelper(100, 10)} />
      </group>

      {/* Mouse controls */}
      <OrbitControls ref={controlsRef} />

      <PerspectiveCamera ref={cameraRef} makeDefault position={[25, 25, 50]} />

      {/* Some custom lighting */}
      <ambientLight />
      <pointLight position={[50, 50, 50]} />
    </>
  );
};

useGLTF.preload("cupula_new.glb");

export default DomeCanvas;
