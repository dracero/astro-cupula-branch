import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useGLTF, OrbitControls, PerspectiveCamera, OrthographicCamera } from "@react-three/drei";
import { DomeObject } from "../objects/DomeObject";
import { useFrame, useThree } from "@react-three/fiber";
import { addDatListener } from "./DatGUI";

const DOME_GLB = 'cupula_jml-test.glb'

export const DomeCanvas = (props) => {
  const w = window as any // For debugging
  
  const perspectiveCamRef = useRef<THREE.PerspectiveCamera>();
  const orthoCamRef = useRef<THREE.OrthographicCamera>();
  const perspControlsRef = useRef<any>();
  const orthoControlsRef = useRef<any>();
  
  const gltf = useGLTF(DOME_GLB);
  const dome = w.dome = new DomeObject(gltf.scene);

  const { set: setThree, viewport } = useThree()

  useFrame(() => {
    dome.update()
  })

  addDatListener('datgui-2D', (e) => {
    const show2d = e.value;
    
    if (show2d) setThree({ camera: orthoCamRef.current });
    else setThree({ camera: perspectiveCamRef.current });

    perspControlsRef.current.enable = !show2d;
    orthoControlsRef.current.enable = show2d;
  })

  return (
    <>
      {/* GLB content */}
      <primitive object={dome} />

      {/* Custom stuff we add to the scene */}
      <group>
        <primitive object={new THREE.GridHelper(50, 10)} position={[0, 0, 0]} />
      </group>

      {/* Mouse controls */}
      <OrbitControls ref={perspControlsRef} camera={perspectiveCamRef.current} />
      <OrbitControls ref={orthoControlsRef} camera={orthoCamRef.current} enableRotate={false} />

      <PerspectiveCamera ref={perspectiveCamRef} makeDefault position={[15, 15, 30]} />
      <OrthographicCamera ref={orthoCamRef} position={[0, 0, 10]} zoom={40} />

      {/* Some custom lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 15, 10]} intensity={100} />
    </>
  );
};

useGLTF.preload("cupula_new.glb");

export default DomeCanvas;
