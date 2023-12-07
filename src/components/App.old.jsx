import Move from "./Move";
import { OrbitControls} from "@react-three/drei";
import { Canvas } from '@react-three/fiber'
//import { Physics} from "@react-three/cannon"


const App  = () => {
   
  //const [ref, api] = useBox(() => ({ mass: 1, position: [0, 5, 0] }))
  return (  
  <div className="boardCanvas"
  style={{ width: "100vw", height: "40vw" }} > 
  <Canvas referenceSpace="local">
    <hemisphereLight intensity={1} />
      <OrbitControls />
       <Move position={[0, -1, -9]} rotation={[0, -1.85, 0]}/>
  </Canvas> 
</div>

  );
}

export default App
