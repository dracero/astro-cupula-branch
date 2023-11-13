import { DomeCanvas } from "./DomeCanvas";
import { Canvas } from "@react-three/fiber";
import Move from "./Move";

const App = () => {
  return (
    <div className="boardCanvas" style={{ width: "100vw", height: "100vw" }}>
      <Canvas>
        <DomeCanvas></DomeCanvas>
      </Canvas>
    </div>
  );
};

export default App;
