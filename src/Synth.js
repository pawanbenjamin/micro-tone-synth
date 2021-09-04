import React from "react";

function Synth({ Tone, scale }) {
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  const POLYPHONY = 16;
  const SYNTH_MIDI_CHANNEL = 1;
  const DEBUG = true;
  const DEBUG_MIDI = true;

  console.log("scale", scale);
  return <div></div>;
}

export default Synth;
