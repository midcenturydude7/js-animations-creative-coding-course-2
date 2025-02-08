const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;

    analyserNode.getFloatFrequencyData(audioData);

    const avg = getAverage(audioData);

    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.lineWidth = 10;

    context.beginPath();
    context.arc(0, 0, Math.abs(avg), 0, Math.PI * 2);
    context.stroke(); // Draw the circle

    context.restore();

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
  audio.src = "sketches/audio/big-city-lights.mp3";

  audioContext = new AudioContext();

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  sourceNode.connect(analyserNode);

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
