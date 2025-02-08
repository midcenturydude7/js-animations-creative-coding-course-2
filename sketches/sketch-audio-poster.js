const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const eases = require("eases");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;
let minDb, maxDb;

const sketch = () => {
  const numCircles = 5;
  const numSlices = 9;
  const slice = (Math.PI * 2) / numSlices;
  const radius = 200;

  const bins = [];
  const lineWidths = [];

  let lineWidth, bin, mapped;

  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(4, 64);
    if (random.value() > 0.5) bin = 0;
    bins.push(bin);
  }

  for (let i = 0; i < numCircles; i++) {
    const t = i / (numCircles - 1);
    lineWidth = eases.quadIn(t) * 200 + 20;
    lineWidths.push(lineWidth);
  }

  return ({ context, width, height }) => {
    context.fillStyle = "#EEEAE0";
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;

    analyserNode.getFloatFrequencyData(audioData);

    context.save();
    context.translate(width * 0.5, height * 0.5);

    let cradius = radius;

    for (let i = 0; i < numCircles; i++) {
      context.save();

      for (let j = 0; j < numSlices; j++) {
        context.rotate(slice);
        context.lineWidth = lineWidths[i];

        bin = bins[i * numSlices + j];
        if (!bin) continue;

        mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);

        lineWidth = lineWidths[i] * mapped;
        if (lineWidth < 1) continue;

        context.lineWidth = lineWidth;

        context.beginPath();
        context.arc(0, 0, cradius + context.lineWidth * 0.5, 0, slice);
        context.stroke(); // Draw the circle}
      }

      cradius += lineWidths[i];

      context.restore();
    }

    context.restore();

    // for (let i = 0; i < bins.length; i++) {
    //   const bin = bins[i];
    //   const mapped = math.mapRange(
    //     audioData[bin],
    //     analyserNode.minDecibels,
    //     analyserNode.maxDecibels,
    //     0,
    //     1,
    //     true
    //   );
    //   const radius = mapped * 300;
    // }

    // const barWidth = (width / audioData.length) * 2.5;
    // let barHeight;
    // let x = 0;

    // for (let i = 0; i < audioData.length; i++) {
    //   barHeight = (audioData[i] + 140) * 2;
    //   context.fillStyle = "black";
    //   context.fillRect(x, height - barHeight / 2, barWidth, barHeight);
    //   x += barWidth + 1;
    // }
  };
};

const addListeners = () => {
  window.addEventListener("mouseup", () => {
    if (!audioContext) createAudio();

    if (audio.paused) {
      audio.play();
      manager.play();
    } else {
      audio.pause();
      manager.pause();
    }
  });
};

const createAudio = () => {
  audio = document.createElement("audio");
  // audio.src = "sketches/audio/big-city-lights.mp3";
  audio.src = "sketches/audio/romeo-eagle-flight.mp3";

  audioContext = new AudioContext();

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount);

  // console.log(audioData.length);

  // const updateAudioData = () => {
  //   analyserNode.getFloatFrequencyData(audioData);
  //   requestAnimationFrame(updateAudioData);
  // };
  // updateAudioData();
};

const getAverage = (data) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  return sum / data.length;
};

const start = async () => {
  addListeners();
  manager = await canvasSketch(sketch, settings);
  manager.pause();
};

start();
