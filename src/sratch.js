const SYNTH_GRAPH = {
  nodes: {
    oscillator: {
      type: "Oscillator",
      options: {
        type: "sawtooth",
        volume: -50,
      },
      connect: ["filter"],
    },
    filter: {
      type: "Filter",
      options: {
        type: "lowpass", // "lowpass", "highpass"
        frequency: 300,
        rolloff: -24,
        Q: 5,
        gain: 0,
      },
      connect: ["envelope"],
    },
    envelope: {
      type: "AmplitudeEnvelope",
      options: {
        attack: 3.0,
        decay: 0.1,
        sustain: 0.5,
        release: 2.5,
      },
      connect: ["master"],
    },
  },
};

const ToneGraph = function (data = {}, ctx = this) {
  const graph = {};

  //  if (data.nodes) {
  //    const nodes = data.nodes;
  //    const nodeKeys = Object.keys(nodes);

  //    for (let n = 0; n = nodeKeys.length; n++) {
  //      console.log(nodeKeys[n]);
  //    }
  //  }

  // console.log(data);

  return graph;
};

let graph = ToneGraph(SYNTH_GRAPH);

// console.log(graph);

///////////////////////////////////////////////////////////////////////////////////////////
//
//  WEBSYNTH.JS
//
///////////////////////////////////////////////////////////////////////////////////////////

// CSS in the console hell yeah :)
console.log(
  "%c [ WEBSYNTH.JS ] ",
  "background: #f80; color: black; font-weight: bold;"
);

// CONFIG

const POLYPHONY = 16;
const SYNTH_MIDI_CHANNEL = 0; // must match your controller output channel

const DEBUG = true;
const DEBUG_MIDI = true;

// GLOBALS

let midi, devices, synth, keyboard;

///////////////////////////////////////////////////////////////////////////////////////////
// MIDI ROUTER

let Midi = MIDI(true, onMessage);
midi = Midi.m;

function onMessage(message) {
  const channel = message.channel;

  if (channel === SYNTH_MIDI_CHANNEL) {
    if (message.subtype === "noteOn") {
      synth.triggerAttack(
        noteMidiToString(message.noteNumber),
        0,
        message.velocity
      );
    } else if (message.subtype === "noteOff") {
      synth.triggerRelease(noteMidiToString(message.noteNumber));
    } else if (
      message.subtype === "pitchBend" &&
      synth.hasOwnProperty("pitchbend")
    ) {
      synth.pitchbend.value = message.value / (16384 - 1); // NormalRange: from 0 to 1
    } else if (
      message.subtype === "controller" &&
      synth.hasOwnProperty("modwheel")
    ) {
      // TODO : controller number dispatching
      synth.modwheel.value = message.value / (128 - 1); // NormalRange: from 0 to 1
    }
  }
}

function noteMidiToString(n) {
  const noteName = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const oct = Math.floor(n / 12) - 1;
  const note = n % 12;
  return noteName[note] + oct;
}

///////////////////////////////////////////////////////////////////////////////////////////
// TONE.JS

// BASIC
// synth = new Tone.FMSynth().toMaster();

///////////////////////////////////////////////////////////////////////////////////////////
// CUSTOM SYNTH

Tone.CustomSynth = function (options) {
  options = this.defaultArg(options, Tone.CustomSynth.defaults);
  Tone.Monophonic.call(this, options);

  // NODES

  // Audio nodes
  this.oscillator = new Tone.Oscillator(options.oscillator);
  this.envelope = new Tone.AmplitudeEnvelope(options.envelope);
  this.filter = new Tone.Filter(options.filter);

  // Modulation nodes
  this.frequencyOut = new Tone.Multiply();
  this.frequencyFilterOut = new Tone.Multiply(1);

  this.pitchbendMod = new Tone.Scale(
    Math.pow(2, -options.pitchbendAmplitude / 12), // 2 semitones down
    Math.pow(2, options.pitchbendAmplitude / 12) // 2 semitones up
  );
  this.modwheelMod = new Tone.Scale(1, 8);

  this.lfo1 = new Tone.LFO(options.lfo1);
  this.lfo2 = new Tone.LFO(options.lfo1);
  this.lfo3 = new Tone.LFO(options.lfo1);

  // CONTROLS

  this.frequency = new Tone.Signal(440);
  this.frequencyFilter = new Tone.Signal(options.filter.frequency);
  this.detune = this.oscillator.detune; // TODO

  this.pitchbend = new Tone.Signal(0.5);
  this.modwheel = new Tone.Signal(0);

  // AUDIO CONNEXIONS

  this.oscillator.chain(this.filter, this.envelope, this.output);

  // MODULATIONS

  // Frequency
  this.pitchbend.connect(this.pitchbendMod);
  this.pitchbendMod.connect(this.frequencyOut, 0, 1);

  this.frequency.connect(this.frequencyOut, 0, 0);
  this.frequencyOut.connect(this.oscillator.frequency);

  // Filter frequency

  // frequencyFilter  =>  frequencyFilterOut
  //                            ^^^
  // modwheel         =>  modwheelMod
  // LFO 2            =>

  this.modwheel.connect(this.modwheelMod);
  this.modwheelMod.connect(this.frequencyFilterOut, 0, 1);

  this.frequencyFilter.connect(this.frequencyFilterOut, 0, 0);
  this.frequencyFilterOut.connect(this.filter.frequency);

  // this.lfo1.connect(_filter.frequency);

  // Start OSC's
  this.oscillator.start();
  // Start LFO's
  this.lfo1.start();
  this.lfo2.start();
  this.lfo3.start();

  this._readOnly(["oscillator", "frequency", "detune", "envelope"]); // TODO: PERMANENT!

  this.portamento = options.portamento; // Overrides Tone.Monophonic.portamento
};

Tone.extend(Tone.CustomSynth, Tone.Monophonic);

Tone.CustomSynth.defaults = {
  portamento: 0,
  pitchbendAmplitude: 2, // in semi-tones
  oscillator: {
    type: "sawtooth",
    volume: -50,
  },
  envelope: {
    // TODO: no effet
    attack: 3.0,
    decay: 0.1,
    sustain: 0.5,
    release: 2.5,
  },
  filter: {
    type: "lowpass", // "lowpass", "highpass"
    frequency: 300,
    rolloff: -24,
    Q: 5,
    gain: 0,
  },
  envelopeFilter: {
    attack: 0.2,
    decay: 0.1,
    sustain: 0.3,
    release: 1,
    baseFrequency: "C2",
    octaves: 4,
    exponent: 2,
  },
  lfo1: {
    type: "sine",
    min: -1,
    max: 1,
    phase: 0,
    frequency: "12n",
    amplitude: 0.9,
    units: Tone.Type.Default,
  },
};

Tone.CustomSynth.prototype.setNote = function (note, time) {
  // Same as Tone.Monophonic
  time = this.toSeconds(time);
  if (this.portamento > 0) {
    var currentNote = this.frequency.value;
    this.frequency.setValueAtTime(currentNote, time);
    var portTime = this.toSeconds(this.portamento);
    this.frequency.exponentialRampToValueAtTime(
      Tone.Frequency(note),
      time + portTime
    );
  } else {
    this.frequency.setValueAtTime(Tone.Frequency(note).eval(), time);
  }
  // keyboard.enableKey(note);

  return this;
};

Tone.CustomSynth.prototype._triggerEnvelopeAttack = function (time, velocity) {
  this.envelope.triggerAttack(time, velocity);

  return this;
};

Tone.CustomSynth.prototype._triggerEnvelopeRelease = function (time) {
  this.envelope.triggerRelease(time);
  // keyboard.disableKey(note);

  return this;
};

Tone.CustomSynth.prototype.dispose = function () {
  // TODO: PERMANENT!
  Tone.Monophonic.prototype.dispose.call(this);
  this._writable(["oscillator", "frequency", "detune", "envelope"]);
  this.oscillator.dispose();
  this.oscillator = null;
  this.envelope.dispose();
  this.envelope = null;
  this.frequency = null;
  this.detune = null;
  return this;
};

// End of CustomSynth

// PARAMS PASS-THRU
// Enhance Tone.PolySynth
Tone.PolySynth.prototype.wireSignals = function (signals) {
  for (let s = 0; s < signals.length; s++) {
    const signal = signals[s];
    this[signal] = new Tone.Signal(0);

    for (var i = 0; i < POLYPHONY; i++) {
      const v = this.voices[i];
      if (v.hasOwnProperty(signal)) {
        this[signal].value = v[signal].value; // sync values from child to parent (coherent initial state)
        this[signal].connect(v[signal]); // connect parent to child
      }
    }
  }
};

// SYNTH INIT

synth = new Tone.PolySynth(POLYPHONY, Tone.CustomSynth).toMaster();
synth.wireSignals(["pitchbend", "modwheel"]);

///////////////////////////////////////////////////////////////////////////////////////////
// GUI

// VIRTUAL KEYBOARD

const VirtualKeyboard = function (el, nKeys = 37, lowestKey = 48) {
  // Avoid to start with a black key
  if (isNoteMidiAltered(lowestKey)) {
    lowestKey++;
  }

  let nKeysWhite = 0;
  let nKeysBlack = 0;
  for (let i = 0; i < nKeys; i++) {
    const iMidi = lowestKey + i;
    if (isNoteMidiAltered(iMidi)) {
      nKeysBlack++;
    } else {
      nKeysWhite++;
    }
  }

  const keyWidth = 100 / nKeysWhite;
  const keyBlackWidth = (keyWidth * 2) / 3;

  for (let i = 0; i < nKeys; i++) {
    const iMidi = lowestKey + i;
    const $key = document.createElement("button");
    $key.classList.add("key", "data-note--" + iMidi);

    if (isNoteMidiAltered(iMidi)) {
      $key.classList.add("key--black");
      // Force black keys width
      $key.style.width = keyBlackWidth + "%";
    }
    $key.setAttribute("data-note", iMidi);

    $key.addEventListener("mousedown", function () {
      synth.triggerAttack(
        noteMidiToString(this.getAttribute("data-note")),
        0,
        (127 * 3) / 4
      );
      this.classList.add("pressed");
    });
    $key.addEventListener("mouseup", function () {
      synth.triggerRelease(noteMidiToString(this.getAttribute("data-note")));
      this.classList.remove("pressed");
    });
    $key.addEventListener("mouseout", function () {
      synth.triggerRelease(noteMidiToString(this.getAttribute("data-note")));
      this.classList.remove("pressed");
    });
    el.appendChild($key);
  }

  // Keyboard public object
  let kb = {};

  // kb.keysPressed = [];
  // kb.$el = el;
  // kb.$keys = el.querySelectorAll(".key");

  kb.enableKey = function (note) {
    const $key = el.querySelector(".data-note--" + note);
    if ($key) $key.classList.add("pressed");
  };
  kb.disableKey = function (note) {
    const $key = el.querySelector(".data-note--" + note);
    if ($key) $key.classList.remove("pressed");
  };

  function isNoteMidiAltered(n) {
    const nInScale = n % 12;
    return (
      nInScale === 1 ||
      nInScale === 3 ||
      nInScale === 6 ||
      nInScale === 8 ||
      nInScale === 10
    );
  }

  return kb;
};

const $keyboard = document.querySelector(".virtual-keyboard");
keyboard = VirtualKeyboard($keyboard, 25, 60);

// VISUALIZATIONS

const fft = new Tone.Analyser("fft", 1024);
const waveform = new Tone.Analyser("waveform", 1024);

synth.fan(waveform, fft);

let canvasWidth, canvasHeight;

const fftCanvas = document.getElementById("analyser1");
const waveCanvas = document.getElementById("analyser2");
const fftContext = fftCanvas.getContext("2d");
const waveContext = waveCanvas.getContext("2d");

//drawing the FFT
function drawFFT(values) {
  fftContext.clearRect(0, 0, canvasWidth, canvasHeight);
  let x, y, barWidth, val;
  for (var i = 0, len = values.length; i < len - 1; i++) {
    barWidth = canvasWidth / len;
    x = barWidth * i;
    val = values[i] / 255;
    y = val * canvasHeight;
    fftContext.fillStyle = "rgba(0, 0, 0, " + val + ")";
    fftContext.fillRect(x, canvasHeight - y, barWidth, canvasHeight);
  }
}

//the waveform data
function drawWaveform(values) {
  //draw the waveform
  waveContext.clearRect(0, 0, canvasWidth, canvasHeight);
  var values = waveform.analyse();
  waveContext.beginPath();
  waveContext.lineJoin = "round";
  waveContext.lineWidth = 3;
  waveContext.strokeStyle = "#333";
  waveContext.moveTo(0, (values[0] / 255) * canvasHeight);
  for (var i = 1, len = values.length; i < len; i++) {
    var val = values[i] / 255;
    var x = canvasWidth * (i / len);
    var y = val * canvasHeight;
    waveContext.lineTo(x, y);
  }
  waveContext.stroke();
}

//size the canvases
function sizeCanvases() {
  canvasWidth = fftCanvas.offsetWidth;
  canvasHeight = fftCanvas.offsetHeight;
  waveContext.canvas.width = canvasWidth;
  fftContext.canvas.width = canvasWidth;
  waveContext.canvas.height = canvasHeight;
  fftContext.canvas.height = canvasHeight;
}

function loop() {
  requestAnimationFrame(loop);
  //get the fft data and draw it
  var fftValues = fft.analyse();
  drawFFT(fftValues);
  //get the waveform valeus and draw it
  var waveformValues = waveform.analyse();
  drawWaveform(waveformValues);
}

sizeCanvases();
loop();

///////////////////////////////////////////////////////////////////////////////////////////
// DIRTY UI CONTROLS

const $params = document.querySelector(".params");

// osc1-waveform
const $osc1WaveformRadios = document.querySelectorAll(".osc1-waveform input");
for (let i = 0; i < $osc1WaveformRadios.length; i++) {
  $osc1WaveformRadios[i].addEventListener("click", function () {
    synth.oscillatorType = this.getAttribute("value");
  });
}
