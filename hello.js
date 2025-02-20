const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "#f7f7f7";
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
