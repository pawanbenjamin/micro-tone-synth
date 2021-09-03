import "./App.css";

import * as Tone from "tone";
import { useEffect, useState } from "react";

function App() {
  const [rootKey, setRootKey] = useState("C");

  useEffect(() => {
    console.log(rootKey);
  });

  const changeKey = (e) => {
    setRootKey(e.target.value);
  };

  return (
    <div className="App">
      <h2>Tone Micro Synth</h2>
      <div className="freq-table">
        <input type="text" placeholder="root-frequency" />
        <label>Root Key:</label>
        <select className="root-note" onChange={changeKey}>
          <option value="C">C</option>
          <option value="C#">C# / Db</option>
          <option value="D">D</option>
          <option value="D#">D# / Eb</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="F#">F# / Gb</option>
          <option value="G">G</option>
          <option value="G#">G# / Ab</option>
          <option value="A">A</option>
          <option value="A#">A# / Bb</option>
          <option value="B">B</option>
        </select>
        <div className="note-ratios">
          <label>Note Ratios:</label>
          <span>Sa</span>
          <select>
            <option>Ati Komal Re</option>
            <option>Komal Re</option>
          </select>
          <select>
            <option>Shuddha Re</option>
            <option>Tivra Re</option>
          </select>
          <select>
            <option>Ati Komal Ga</option>
            <option>Komal Ga</option>
          </select>
          <select>
            <option>Shuddha Ga</option>
            <option>Tivra Ga</option>
          </select>
          <select>
            <option>Shuddha Ma</option>
            <option>Shruti Ma</option>
          </select>
          <select>
            <option>Tivra Ma</option>
            <option>Tivra Tivra Ma</option>
          </select>
          <span>Pa</span>
          <select>
            <option>Ati Komal Dha</option>
            <option>Komal Dha</option>
          </select>
          <select>
            <option>Shuddha Dha</option>
            <option>Tivra Dha</option>
          </select>
          <select>
            <option>Ati Komal Ni</option>
            <option>Komal Ni</option>
          </select>
          <select>
            <option>Shuddha Ni</option>
            <option>Tivra Ni</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
