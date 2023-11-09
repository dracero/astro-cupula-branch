// i need to importo useThree to adjust the camera position
import * as THREE from "three";
import React, { useRef, useState, useEffect} from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Html } from "@react-three/drei";

const Move = (props) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("cupula_new.glb");
  const { actions } = useAnimations(animations, group);
  let [removeMesh, setRemoveMesh] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [inicio, setInicio] = useState(false);
 
  //I need to improve the camera position ang ligths
  let camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
  camera.position.z = 50;
  camera.position.y = 10;
  camera.position.x = 10;
  //I need to add a directional light
  let light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 10.507, 10, 7.5 ).normalize();
  let light1 = new THREE.DirectionalLight( 0xffffff, 1 );
  light1.position.set( -28.13, 0.511, -6.487 ).normalize();
  let light2 = new THREE.DirectionalLight( 0xffffff, 1 );
  light2.position.set( 5, 3.228, 11.397 ).normalize();
  //I nee to add an hemisphere light
  let light3 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  light3.position.set( 0, 1, 0 );
  
  
  const removeMeshAfterFrames = () => {
    if (isPlaying) {
      setIsPlaying(false)
      actions["movimiento"].paused = true;
    } else {
      setIsPlaying(true)
      actions["movimiento"].paused = false;
    }
  }

  const reinicioMove = () => {
     actions["movimiento"].reset();
     setRemoveMesh(false)
  }

  useEffect(() => {
    actions["movimiento"].play();
    let camera = new THREE.OrthographicCamera(75, window.innerWidth / window.innerHeight, 2, 1);
  }, []);
  

 return (
  <group ref={group} {...props} dispose={null}>
  <group name="Scene">
    <group
      name="NurbsPath002"
      position={[0, 1.804, -3.273]}
      rotation={[0, 1.328, 0]}
      scale={[1.442, 1, 1.033]}
    >
      <group
        name="Sphere001"
        position={[-2.026, -0.345, 0.806]}
        rotation={[-0.755, -0.014, 1.667]}
        scale={[0.983, 0.697, 0.983]}
      >{!removeMesh && (
        <mesh
          name="Sphere001_1"
          castShadow
          receiveShadow
          geometry={nodes.Sphere001_1.geometry}
          material={materials["Material.002"]}
        />)};
        //I need to put this mesh to rotate
        <mesh
        //I need an animation to rotate this mesh
        rotateOnWorldAxis={new THREE.Vector3(0, 1, 0)}
         name="Sphere001_2"
         castShadow
         receiveShadow
         geometry={nodes.Sphere001_2.geometry}
         material={ new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load('/textura.jpg')})}
        />
        {!removeMesh && (
        <mesh
          name="Sphere001_3"
          castShadow
          receiveShadow
          geometry={nodes.Sphere001_3.geometry}
          material={materials["Material.005"]}
        />)};
        {!removeMesh && (
        <mesh
          name="Sphere001_4"
          castShadow
          receiveShadow
          geometry={nodes.Sphere001_4.geometry}
          material={materials["Material.003"]}
        />)};
      </group>
    </group>
    <mesh
      name="Sphere"
      castShadow
      receiveShadow
      geometry={nodes.Sphere.geometry}
      material={materials["Material.001"]}
      position={[0, -4.696, 0.256]}
      scale={2}
    />
  </group>
  <Html position={[6, 3, 0]}>
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <button onClick={removeMeshAfterFrames}>Movement</button>
          <button onClick={() => setRemoveMesh(true)}>Salida</button>
          <button onClick={reinicioMove}>Reinicio</button>
        </div>
  </Html>
 </group>
 );
};

useGLTF.preload("cupula_new.glb");

export default Move;