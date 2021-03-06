import "./App.css";

import * as Tone from "tone";

import { useEffect, useState } from "react";

import MidiInfo from "./Midi";
import Synth from "./Synth";

function App() {
  //used to set Midi Keyboard Mapping
  const [rootKey, setRootKey] = useState("C");

  const [rootFreq, setRootFreq] = useState("261.63");

  const [sa, setSa] = useState("1");
  const [komalRe, setKomalRe] = useState("16/15");
  const [re, setRe] = useState("9/8");
  const [komalGa, setKomalGa] = useState("6/5");
  const [ga, setGa] = useState("5/4");
  const [ma, setMa] = useState("4/3");
  const [tivraMa, setTivraMa] = useState("45/32");
  const [pa, setPa] = useState("3/2");
  const [komalDha, setKomalDha] = useState("8/5");
  const [dha, setDha] = useState("5/3");
  const [komalNi, setKomalNi] = useState("9/5");
  const [ni, setNi] = useState("15/8");

  useEffect(() => {
    console.log("Root Freq: ", rootFreq);
    console.log("Root Key: ", rootKey);
    console.log(
      "Freq Table:",
      sa,
      komalRe,
      re,
      komalGa,
      ga,
      ma,
      tivraMa,
      pa,
      komalDha,
      dha,
      komalNi,
      ni
    );
  });

  const changeKey = (e) => {
    setRootKey(e.target.value);
  };

  const changeRatio = (e, setter) => {
    setter(e.target.value);
  };

  return (
    <div className="App">
      <h2>Tone Shruti Synth</h2>
      <Synth
        Tone={Tone}
        scale={{
          sa,
          komalRe,
          re,
          komalGa,
          ga,
          ma,
          tivraMa,
          pa,
          komalDha,
          dha,
          komalNi,
          ni,
        }}
      />
      <MidiInfo Tone={Tone} />
      <div className="freq-table">
        <div className="root-info">
          <label>Root Freq:</label>
          <input
            type="text"
            placeholder="261.63"
            onChange={(e) => setRootFreq(e.target.value)}
          />
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
        </div>
        <div className="note-ratios">
          <label>Note Ratios:</label>
          <span>Sa</span>
          <select onChange={(e) => changeRatio(e, setKomalRe)}>
            <option value="256/243">Ati Komal Re</option>
            <option value="16/15">Komal Re</option>
          </select>
          <select onChange={(e) => changeRatio(e, setRe)}>
            <option value="10/9">Shuddha Re</option>
            <option value="9/8">Tivra Re</option>
          </select>
          <select onChange={(e) => changeRatio(e, setKomalGa)}>
            <option value="32/27">Ati Komal Ga</option>
            <option value="6/5">Komal Ga</option>
          </select>
          <select onChange={(e) => changeRatio(e, setGa)}>
            <option value="5/4">Shuddha Ga</option>
            <option value="81/64">Tivra Ga</option>
          </select>
          <select onChange={(e) => changeRatio(e, setMa)}>
            <option value="4/3">Shuddha Ma</option>
            <option value="27/20">Shruti Ma</option>
          </select>
          <select onChange={(e) => changeRatio(e, setTivraMa)}>
            <option value="45/32">Tivra Ma</option>
            <option value="729/512">Tivra Tivra Ma</option>
          </select>
          <span>Pa</span>
          <select onChange={(e) => changeRatio(e, setKomalDha)}>
            <option value="128/81">Ati Komal Dha</option>
            <option value="8/5">Komal Dha</option>
          </select>
          <select onChange={(e) => changeRatio(e, setDha)}>
            <option value="5/3">Shuddha Dha</option>
            <option value="27/16">Tivra Dha</option>
          </select>
          <select onChange={(e) => changeRatio(e, setKomalNi)}>
            <option value="16/9">Ati Komal Ni</option>
            <option value="9/5">Komal Ni</option>
          </select>
          <select onChange={(e) => changeRatio(e, setNi)}>
            <option value="15/8">Shuddha Ni</option>
            <option value="243/128">Tivra Ni</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
