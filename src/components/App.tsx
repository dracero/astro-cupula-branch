import './App.css'
import { DatGUI } from './DatGUI';
import { DomeCanvas } from "./DomeCanvas";
import { ThreeCanvas } from "./ThreeCanvas";

const App = () => {
  return (
    <>
    <ThreeCanvas>
      <DomeCanvas/>
    </ThreeCanvas>

    <DatGUI />

    <div className="text-overlay">
      <span id="weight-force">|| P || = </span>
      <span id="contact-force">|| N || = </span>
      <span id="friction-force">|| Froz || = </span>
      <span id="theta-value"></span>
    </div>
    </>
  );
};

export default App;
