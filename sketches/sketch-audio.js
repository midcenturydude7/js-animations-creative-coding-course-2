const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

let audio;

const sketch = () => {
  audio = document.createElement("audio");
  audio.src = "sketches/audio/big-city-lights.mp3";

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
  };
};

const addListeners = () => {
  window.addEventListener("mouseup", () => {
    if (audio.paused) audio.play();
    else audio.pause();
  });
};

addListeners();

canvasSketch(sketch, settings);
