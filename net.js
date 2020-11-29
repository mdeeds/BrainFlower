const kLayerSpacing = 250;
const kRoot2 = Math.sqrt(2);

var botUnderTest;
var ctx;
var repeatBox;
var match;
var trainingData = [];
var testPoints;
var modelEval = null;
var game = null;
var simplify = true;

class TestPoint {
  constructor(element, dataCallback) {
    this.element = element;
    this.dataCallback = dataCallback;
    let bb = element.getBoundingClientRect();
    this.x = bb.x;
    this.y = bb.y;
  }
}

class TestPointCollection {
  constructor() {
    this.testPoints = [];
  }

  add(element, dataCallback) {
    this.testPoints.push(new TestPoint(element, dataCallback));
  }

  getClosestPoint(element) {
    let bb = element.getBoundingClientRect();
    let x = bb.x;
    let y = bb.y;
    let closestR2 = 400;
    let closest = null;
    for (let tp of this.testPoints) {
      let dx = tp.x - x;
      let dy = tp.y - y;
      let r2 = (dx * dx) + (dy * dy);
      if (r2 < closestR2) {
        closestR2 = r2;
        closest = tp;
      }
    }
    if (closest) {
      return closest;
    }
    return null;
  }
}

class Wire {
  /**
   * 
   * @param {number} destinationX 
   * @param {number} destinationY 
   */
  constructor(destinationX, destinationY, color1, color2, oscope) {
    this.x0 = destinationX;
    this.y0 = destinationY;
    this.paths = [];
    for (let i = 0; i < 2; ++i) {
      let p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("fill", "none");
      p.setAttribute("stroke-width", 4);
      this.paths.push(p);
    }
    this.paths[0].setAttribute("stroke", color1);
    this.paths[1].setAttribute("stroke-dasharray", "4 7");
    this.paths[1].setAttribute("stroke", color2);
    this.tip = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.tip.setAttribute("r", 10);
    this.tip.setAttribute("transform", "translate(-5, -5)");
    this.tip.setAttribute("fill", color2);

    this.tipDiv = document.createElement("div");
    this.tipDiv.classList.add("draggable");
    this.tipDiv.classList.add("tipDiv");
    this.tipDiv.draggable = true;

    this.addDragHandlers(this.tipDiv);
    this.setDestination(destinationX, destinationY);

    this.dragging = false;
    this.dataCallback = null;
    this.oscope = oscope;
  }

  addDragHandlers(element) {
    element.addEventListener("dragstart", this.dragStart.bind(this));
    element.addEventListener("drag", this.drag.bind(this));
    element.addEventListener("dragend", this.dragEnd.bind(this));
    element.classList.add("draggable");
  }

  dragStart(e) {
    this.dragging = true;
  }

  drag(e) {
    if (!this.dragging) {
      return;
    }
    let newX = e.clientX - 10;
    let newY = e.clientY - 10;
    let divLocation = this.tipDiv.getBoundingClientRect();
    this.tipDiv.style.setProperty("left", newX.toFixed(0) + "px");
    this.tipDiv.style.setProperty("top", newY.toFixed(0) + "px");

    let dx = this.tip.getAttribute("cx") - divLocation.left;
    let dy = this.tip.getAttribute("cy") - divLocation.top;

    this.setDestination(newX + dx, newY + dy);
  }

  dragEnd(e) {
    let dx = e.movementX;
    let dy = e.movementY;
    this.dragging = false;
  }

  addTo(parent) {
    for (let p of this.paths) {
      parent.appendChild(p);
    }
    parent.appendChild(this.tip);
    let body = document.getElementById("body");
    body.appendChild(this.tipDiv);

    let dotPosition = this.tip.getBoundingClientRect();
    this.tipDiv.style.setProperty("left", dotPosition.left);
    this.tipDiv.style.setProperty("top", dotPosition.top);
  }

  setDestination(x, y) {
    for (let p of this.paths) {
      p.setAttribute("d", "M " + this.x0 + " " + this.y0
        + " C " + this.x0 + " " + (this.y0 + 100)
        + " " + x + " " + (y + 110)
        + " " + x + " " + (y + 10));
    }
    this.tip.setAttribute("cx", x);
    this.tip.setAttribute("cy", y);
    if (testPoints) {
      let tp = testPoints.getClosestPoint(this.tip);
      if (tp) {
        if (this.dataCallback != tp.dataCallback) {
          this.dataCallback = tp.dataCallback;
          this.oscope.showData();
        }
      } else {
        this.dataCallback = null;
      }
    }
  }
}

class Oscope {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.body = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.body.setAttribute("transform", "translate(" + this.x + " " + this.y + ")");

    let img = document.createElementNS("http://www.w3.org/2000/svg", "image");
    img.setAttribute("href", "img/O-Scope.png");
    img.setAttribute("width", 300);
    this.body.appendChild(img);

    this.xWire = new Wire(this.x + 46, this.y + 420, "Yellow", "Chocolate", this);
    this.aWire = new Wire(this.x + 158, this.y + 420, "RoyalBlue", "MidnightBlue", this);
    this.bWire = new Wire(this.x + 225, this.y + 420, "Orchid", "Indigo", this);

    this.displayGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.displayGroup.setAttribute("transform",
      "translate(" + (this.x + 150) + " " + (this.y + 142) + ") scale(0.55)");

    this.jitter = false;

    this.jitterDiv = document.createElement("div");
    this.jitterDiv.classList.add("indicator");
    this.jitterDiv.addEventListener("click", (e) => {
      this.jitter = !this.jitter;
      if (this.jitter) {
        let img = document.createElement("img");
        // TODO: Add this to the SVG and set its position the same way as the screen.
        // Also, toggle it on and off by setting its visibility, not by changing its presence.
        img.setAttribute("src", "img/OnLED.png");
        img.setAttribute("width", 26);
        img.addEventListener("click", () => true);
        e.target.innerHTML = "";
        e.target.appendChild(img);
      } else {
        e.target.innerHTML = "";
      }
    });

    this.showData();
  }

  addTo(parent) {
    parent.appendChild(this.body);
    this.xWire.addTo(parent);
    this.aWire.addTo(parent);
    this.bWire.addTo(parent);
    parent.appendChild(this.displayGroup);
    let bodyRect = this.body.getBoundingClientRect();
    this.jitterDiv.style.setProperty("left", bodyRect.x + 32);
    this.jitterDiv.style.setProperty("top", bodyRect.y + 272);
    document.getElementById("body").appendChild(this.jitterDiv);
  }

  showSeries(xs, series, color) {
    for (let i = 0; i < xs.length; ++i) {
      let x = xs[i];
      let y = series[i];
      if (this.jitter) {
        x += Math.random() * 0.05 - 0.025;
        y += Math.random() * 0.05 - 0.025;
      }

      let dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("fill", color);
      dot.setAttribute("fill-opacity", 0.2);
      dot.setAttribute("cx", Math.min(200, Math.max(-200, 100 * x)));
      dot.setAttribute("cy", Math.min(200, Math.max(-200, 100 * -y)));
      dot.setAttribute("r", 5);
      this.displayGroup.appendChild(dot);
    }
  }

  showData() {
    this.displayGroup.innerHTML = "";
    let axes = document.createElementNS("http://www.w3.org/2000/svg", "path");
    axes.setAttribute("d", "M -200 0 L 200 0 M 0 -200 L 0 200");
    axes.setAttribute("stroke", "LightGreen");
    axes.setAttribute("stroke-width", 0.5);
    this.displayGroup.appendChild(axes);
    if (this.xWire.dataCallback) {
      if (this.aWire.dataCallback) {
        this.showSeries(this.xWire.dataCallback(), this.aWire.dataCallback(),
          "RoyalBlue");
      }
      if (this.bWire.dataCallback) {
        this.showSeries(this.xWire.dataCallback(), this.bWire.dataCallback(),
          "Orchid");
      }
    }
  }
}

class SvgContext {
  constructor(svg) {
    this.svg = svg;
    this.clear();
    this.oscope = new Oscope(500, 0);
    this.mouseX = 0;
    this.mouseY = 0;
    this.currentWeightTensor = null;
    this.currentWeightIndex = -1;

    svg.addEventListener("mouseover",
      function (e) {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
      }.bind(this));
    document.getElementById("body").addEventListener("keydown",
      (e) => {
        if (!this.currentWeightTensor) {
          return;
        }
        let oldData = this.currentWeightTensor.dataSync();
        let oldValue = oldData[this.currentWeightIndex];
        let invMag = (e.ctrlKey || e.metaKey) ? 20 : 2;
        let newValue;
        if (e.key === '0') {
          newValue = 0.0;
        } else {
          let delta = 0.0;
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            delta = +1;
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            delta = -1;
          }
          if (delta === 0) {
            return;
          }
          newValue = (Math.round(invMag * oldValue) + delta) / invMag;
        }
        oldData[this.currentWeightIndex] = newValue;
        this.currentWeightTensor.assign(tf.tensor(oldData, this.currentWeightTensor.shape, 'float32'));
        // TODO: Compile and update model eval.
        // modelEval = new ModelEvaluation(botUnderTest.brain.model);
        show();
        return true;
      });
  }

  clear() {
    this.stroke = "black";
    this.fill = "white";
    this.svg.innerHTML = "";
    let bg = document.createElementNS(
      "http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", 0);
    bg.setAttribute("y", 0);
    bg.setAttribute("width", 800);
    bg.setAttribute("height", 500);
    bg.setAttribute("fill", "Honeydew")
    this.svg.appendChild(bg);
    this.weightBox = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.weightBox.setAttribute("x", 0);
    this.weightBox.setAttribute("y", 50);
    this.weightBox.innerHTML = "";
    this.svg.appendChild(this.weightBox);
  }

  line(parent, x1, y1, x2, y2) {
    let l = document.createElementNS(
      "http://www.w3.org/2000/svg", "line");
    l.setAttribute('x1', x1);
    l.setAttribute('y1', y1);
    l.setAttribute('x2', x2);
    l.setAttribute('y2', y2);
    l.setAttribute('stroke', this.stroke);
    parent.appendChild(l);
    return l;
  }

  path(parent, x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
    let p = document.createElementNS(
      "http://www.w3.org/2000/svg", "path");
    p.setAttribute('d',
      "M " + x1 + " " + y1 +
      "C " + cx1 + " " + cy1 +
      " " + cx2 + " " + cy2 +
      " " + x2 + " " + y2);
    p.setAttribute('stroke', this.stroke);
    p.setAttribute('fill', "none");
    parent.appendChild(p);
    return p;
  }

  circle(parent, cx, cy, r) {
    let c = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle");
    c.setAttribute('cx', cx);
    c.setAttribute('cy', cy);
    c.setAttribute('r', r);
    c.setAttribute('stroke', this.stroke);
    c.setAttribute('fill', this.fill);
    parent.appendChild(c);
    return c;
  }

  diamond(parent, x, y) {
    let p = document.createElementNS(
      "http://www.w3.org/2000/svg", "path");
    p.setAttribute('d', "M " + x + " " + y
      + " l 6 6 l 6 -6 l -6 -6 l -6 6");
    p.setAttribute('stroke', this.stroke);
    p.setAttribute('fill', this.fill);
    parent.appendChild(p);
    return p;
  }

  setFillForWeight(weight) {
    if (weight > 1.0) {
      this.fill = "#000";
      this.stroke = "#000"
    } else if (weight < -1.0) {
      this.fill = "#fff";
      this.stroke = "#000"
    } else {
      let a = Math.round(255 * (Math.abs(weight) / 1.0));
      let ch = (weight > 0) ? '00' : 'ff';
      let cha = Math.round(a).toString(16).padStart(2, '0');
      this.fill = "#" + ch + ch + ch + cha;
      this.stroke = "#000000" + cha;
    }
  }

  addCircle(parent, x, y, weightTensor, data, i) {
    let weight = data[i];
    this.setFillForWeight(weight);
    let c = this.circle(parent, x, y, 5);
    c.setAttribute("weight", weight);
    c.addEventListener("mouseover", function () {
      this.weightBox.innerHTML = weight.toFixed(3);
      this.currentWeightTensor = weightTensor;
      this.currentWeightIndex = i;
    }.bind(this, weight, weightTensor, i));
  }

  addTestPoint(parent, x, y) {
    this.stroke = "#000";
    this.fill = "#fff";
    let d = this.diamond(parent, x, y);
    return d;
  }

  renderWeights1(parent, weights, offsetX, offsetY) {
    let shape = weights.shape;
    let data = weights.val.dataSync();

    this.stroke = "#000";
    // Input
    this.line(parent,
      offsetX + 30, offsetY + 0,
      offsetX + 30, offsetY + shape[0] * 15 + 15);

    let i = 0;
    for (let d0 = 0; d0 < shape[0]; ++d0) {
      this.addCircle(parent,
        offsetX + 30, offsetY + d0 * 15, weights.val, data, i);
      ++i;
    }
    return 60;
  }

  buildDataCallback(model, layer, index, isOutput) {
    return function () {
      if (!modelEval) { return [0]; }
      return modelEval.getArray(layer, index, isOutput);
    }.bind(model, layer, index);
  }

  buildExpectedCallback() {
    return function () {
      if (!modelEval) { return [0]; }
      return modelEval.getExpectedValues();
    };
  }

  renderWeights2(parent, weights, offsetX, offsetY, model, layer) {
    let shape = weights.shape;
    let data = weights.val.dataSync();

    this.stroke = "#000";
    this.fill = "#fff";
    // Inputs
    for (let i = 0; i < shape[0]; ++i) {
      let tp = this.addTestPoint(parent, offsetX + i * 15 + 30,
        offsetY + shape[1] * 15 + 15);
      testPoints.add(tp, this.buildDataCallback(model, layer, i, /*isOutput=*/ false));

      this.line(parent,
        offsetX + i * 15 + 30, offsetY + 0,
        offsetX + i * 15 + 30, offsetY + shape[1] * 15 + 15);
    }

    // Outputs
    for (let i = 0; i < shape[1]; ++i) {
      let j = (shape[1] - i - 1)
      let x0 = offsetX + 30;
      let y0 = offsetY + i * 15;
      let x1 = offsetX + shape[0] * 15 + 50;
      let y1 = offsetY + i * 15;
      let x2 = x1 + 95 + (i * 15);
      let y2 = offsetY + 30;
      this.line(parent, x0, y0, x1, y1);
      this.path(parent, x1, y1, x1 + 40, y1,
        x2, y2 + 50 + i * 20, x2, y2);

      let tp = this.addTestPoint(parent, x1, y1);
      testPoints.add(tp, this.buildDataCallback(model, layer, i, /*isOutput=*/ true));
      // this.path(parent,)
    }

    // Weights;
    let i = 0;
    for (let d0 = 0; d0 < shape[0]; ++d0) {
      for (let d1 = 0; d1 < shape[1]; ++d1) {
        this.addCircle(parent,
          offsetX + d0 * 15 + 30,
          offsetY + d1 * 15, weights.val, data, i);
        ++i;
      }
    }
    return shape[0] * 15 + 5;
  }

  renderWeights(parent, weights, offsetX, offsetY, model, layer) {
    if (weights.shape.length == 1) {
      return this.renderWeights1(parent, weights, offsetX, offsetY);
    } else if (weights.shape.length == 2) {
      return this.renderWeights2(parent, weights, offsetX, offsetY, model, layer);
    }
  }

  renderModel(model) {
    this.clear();
    let g;
    let offsetX = 0;
    let offsetY = 220;
    g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.appendChild(g);
    this.oscope.addTo(g);

    for (let l of model.layers) {
      if (l.weights.length == 0) {
        continue;
      }
      for (let w of l.weights) {
        let width = this.renderWeights(g, w, offsetX, offsetY, model, l);
        offsetX += width;
      }
      offsetX += 50;
    }

    let tp = this.addTestPoint(g, offsetX, offsetY);
    testPoints.add(tp, this.buildExpectedCallback());
    this.oscope.showData();
  }
}

class TrainingExample {
  /**
   * 
   * @param {FrameState} frameState 
   * @param {number} gameNumber 
   */
  constructor(frameState, gameNumber) {
    this.gameNumber = gameNumber || 0;
    this.frameState = frameState;
    // training.js:1190 Uncaught (in promise) Error: sample weight is not supported yet.
    // SO SAD!
    this.weight = 1.0;
  }
}

function show() {
  let model = botUnderTest.getModel();
  ctx.renderModel(model);
}

function getLastGameNumber(trainingData) {
  if (trainingData.length == 0) {
    return -1;
  }
  return trainingData[trainingData.length - 1].gameNumber;
}

function collect() {
  show();
  let referenceBot = match.getEntry(0);
  let gameNumber = getLastGameNumber(trainingData) + 1;
  for (let i = 0; i < repeatBox.value(); ++i) {
    game = new Game(referenceBot, match.getEntry(1));
    for (let i = 0; i < kFramesPerRound; ++i) {
      let frameState = game.runFrame();
      trainingData.push(new TrainingExample(frameState, gameNumber));
    }
    ++gameNumber;
    counters.set("Games collected", trainingData.length / kFramesPerRound);
    // TODO: determine win, and store appropriately
  }
  modelEval = new ModelEvaluation(botUnderTest.brain.model);
  show();
  console.log("Done collecting.");
}

class SelectEverything {
  isUseful(example) {
    return true;
  }
}

class SelectScoringMoves {
  constructor(frameCount) {
    this.frameCount = frameCount;
    this.currentGame = -1;
    this.currentScore = -1;
    this.framesToKeep = 0;
  }
  /**
   * @param {TrainingExample} example 
   */
  isUseful(example) {
    if (example.gameNumber != this.currentGame) {
      this.currentGame = example.gameNumber;
      this.currentScore = -1;
      return false;
    }
    let currentScore = example.frameState.leftSenses.myScore;
    if (currentScore < this.currentScore) {
      this.framesToKeep = this.frameCount;
    }
    this.currentScore = currentScore;
    if (this.framesToKeep > 0) {
      this.framesToKeep--;
      return true;
    } else {
      return false;
    }

  }
}

function getInputOutputTensors(selector) {
  if (!selector) {
    selector = new SelectEverything();
  }
  let input = [];
  let output = [];
  let weights = [];

  for (let i = trainingData.length - 1; i >= 0; --i) {
    let ex = trainingData[i];
    if (selector.isUseful(ex)) {
      input.push(ex.frameState.leftSensorArray);
      output.push([ex.frameState.leftTurn]);
      weights.push(ex.weight);
    }
  }
  // TODO: Divide this into smaller batches and provide updates.
  let inputTensor = tf.tensor2d(input, [input.length, kInputSize]);
  let outputTensor = tf.tensor2d(output, [output.length, kOutputSize]);
  let weightTensor = tf.tensor1d(weights, 'float32');

  return [inputTensor, outputTensor, weightTensor];
}

function rebuildModel(model, layerCount) {
  const input = model.inputs[0];
  let previousLayer = input;
  for (let i = 0; i <= layerCount; ++i) {
    let l = model.layers[i];
    if (l.input == l.output) {
      continue;
    }
    let config = l.getConfig();
    if (i == layerCount) {
      config.activation = "linear";
    }
    const newLayer = tf.layers.dense(config).apply(previousLayer);
    copyLayerWeights(newLayer.sourceLayer, l)
    previousLayer = newLayer;
  }
  const newModel = tf.model({ inputs: input, outputs: previousLayer });
  return newModel;
}

class ModelEvaluation {
  constructor(model) {
    this.layerMapInput = new Map();
    this.layerMapOutput = new Map();

    let inputTensor, outputTensor, weightTensor;
    [inputTensor, outputTensor, weightTensor] = getInputOutputTensors();

    this.expected = outputTensor.dataSync();

    for (let i = 0; i < model.layers.length; ++i) {
      let l = model.layers[i];
      if (l.input == l.output) {
        this.layerMapInput.set(inputTensor.dataSync());
        continue;
      }
      let smallerModel = tf.model({
        inputs: model.inputs,
        outputs: l.input
      });
      let prediction = smallerModel.predict(inputTensor);
      this.layerMapInput.set(l, prediction.dataSync());
      if (!l.getConfig().units) {
        continue;
      }
      let outputModel = rebuildModel(model, i);
      let outputPrediction = outputModel.predict(inputTensor)
      this.layerMapOutput.set(l, outputPrediction.dataSync());
    }
  }
  getArray(layer, index, isOutput) {
    let data = isOutput ? this.layerMapOutput.get(layer) :
      this.layerMapInput.get(layer);
    if (!data) {
      return [0];
    }
    let stride = isOutput ? layer.output.shape[1] : layer.input.shape[1];
    let result = [];
    for (let i = index; i < data.length; i += stride) {
      result.push(data[i]);
    }
    return result;
  }
  getExpectedValues() {
    return this.expected;
  }
}

var trainStart = 0;
var batchSize = 1;
function train() {
  show();
  let trainingDiv = document.createElement("div");
  trainingDiv.innerHTML = "Training...";
  trainingDiv.classList.add("status");
  let body = document.getElementById("body");
  body.appendChild(trainingDiv);
  let inputTensor, outputTensor, weightTensor;
  [inputTensor, outputTensor, weightTensor] = getInputOutputTensors(
    new SelectEverything()
    // new SelectScoringMoves(60)
  );

  let model = botUnderTest.getModel();
  console.log("Staring train");
  counters.incrementBy("Train games", trainingData.length / kFramesPerRound);
  trainStart = window.performance.now();
  model.fit(inputTensor, outputTensor,
    {
      epochs: repeatBox.value(),
      shuffle: true,
      batchSize: batchSize,
      //sampleWeight: weightTensor
    })
    .then(() => {
      trainingDiv.remove();
      let elapsed = window.performance.now() - trainStart;
      console.log("Done training: " + (elapsed / 1000).toFixed(2) + "s");
      botUnderTest.brain.setDirty();
      modelEval = new ModelEvaluation(botUnderTest.brain.model);
      show();
    });
}

function resetBrain(descriptor) {
  let options = {};
  options.layers = [];
  options.activations = [];
  for (let l of descriptor.split(/[-, ]/)) {
    options.layers.push(parseInt(l));
    options.activations.push("tanh");
  }
  options.activations.push("linear");
  options.simplify = simplify;

  botUnderTest.brain.reset(options);
  counters.set("Train games", 0);
  modelEval = new ModelEvaluation(botUnderTest.brain.model);
  show();
}

var counters;

class CounterSet {
  constructor() {
    this.map = new Map();
    this.div = document.createElement("div");
  }
  addTo(parent) {
    parent.appendChild(this.div);
    this.render();
  }
  set(counter, value) {
    this.map.set(counter, value);
    this.render();
  }
  incrementBy(counter, step) {
    if (this.map.has(counter)) {
      this.map.set(counter, this.map.get(counter) + step);
    } else {
      this.map.set(counter, step);
    }
    this.render();
  }
  increment(counter) {
    this.incrementBy(counter, 1);
  }
  render() {
    this.div.innerHTML = "";
    for (let k of this.map.keys()) {
      let d = document.createElement("div");
      d.innerText = k + ": " + this.map.get(k);
      this.div.appendChild(d);
    }
  }
}

function loadSound(path) {
  let audio = document.createElement("audio");
  audio.src = path;
  return audio;
}

function tryPlaying(audioElement) {
  audioElement.play().catch((e) => {
    setTimeout(() => { tryPlaying(audioElement); }, 100);
  });
}


function setup() {
  let body = document.getElementById("body");
  music = loadSound("sfx/Background.mp3");
  music.setAttribute("loop", true);
  music.volume = 0.25;
  tryPlaying(music);
  body.appendChild(music);

  body.addEventListener("dragover", (event) => {
    event.preventDefault();
  }, false);

  for (c of document.getElementsByTagName("canvas")) {
    c.parentElement.removeChild(c);
  }
  {
    let l;
    let r;
    [l, r] = buildEntryMap(["KeyBot", "LearnBot", "KeyBot2"]);
    let ldiv = document.createElement("div");
    ldiv.innerHTML = "Learn from: ";
    ldiv.appendChild(l.elt);
    body.appendChild(ldiv);
    let rdiv = document.createElement("div");
    rdiv.innerHTML = "Play against: ";
    rdiv.appendChild(r.elt);
    body.appendChild(rdiv);
  }

  let svg = document.createElementNS(
    "http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", 800);
  svg.setAttribute("height", 500);
  svg.setAttribute("viewbox", "0 0 100 100")
  body.appendChild(svg);

  ctx = new SvgContext(svg);

  botUnderTest = new LearnBot(match.getEntry(0));

  let modelNameBox = document.createElement("div");
  modelNameBox.innerText = botUnderTest.brain.name;
  body.appendChild(modelNameBox);

  tf.io.listModels().then(models => {
    for (let m of Object.keys(models)) {
      let div = document.createElement("div");
      div.innerText = m;
      body.appendChild(div);
      div.addEventListener("click",
        function (e) {
          tf.loadLayersModel(m)
            .then(model => {
              ctx.renderModel(model);
            });
        }.bind(m));
    }
  });

  let startButton = createButton("Show");
  startButton.size(60, 30);
  startButton.mousePressed(show);
  {
    let button = createButton("Collect");
    button.size(60, 30);
    button.mousePressed(collect);
  }

  {
    let button = createButton("Train");
    button.size(60, 30);
    button.mousePressed(train);
  }
  repeatBox = createSelect();
  repeatBox.size(60, 30);
  repeatBox.option("1x", 1);
  repeatBox.option("10x", 10);
  repeatBox.option("100x", 100);
  {
    let d = document.getElementById("netspec");
    d.innerText = "Brain config: ";
    let input = createInput("4");
    d.appendChild(input.elt);
    let button = createButton("Reset Brain");
    d.appendChild(button.elt);
    button.size(60, 50);
    button.mousePressed(
      function () {
        resetBrain(input.elt.value);
      }.bind(input));
    let s = createSelect();
    s.option("Simplify");
    s.option("Perfect");
    s.elt.addEventListener("change", function (e) {
      selected = e.target.value == "Simplify";
    });
    d.appendChild(s.elt);

    let sBackend = createSelect();
    sBackend.option("cpu");
    sBackend.option("webgl");
    // sBackend.option("wasm");
    // Error: 'step' not yet implemented or not found in the registry.
    sBackend.elt.addEventListener("change", function (e) {
      tf.setBackend(e.target.value);
    });
    d.appendChild(sBackend.elt);
    let batchSizeBox = createSelect();
    for (let size of [1, 10, 100, 1000]) {
      batchSizeBox.option(size.toFixed(0), size);
    }
    batchSizeBox.elt.addEventListener("change", function (e) {
      batchSize = parseInt(e.target.value);
    });
    d.appendChild(batchSizeBox.elt);
  }
  {
    let button = createButton("Clear Data");
    button.size(60, 30);
    button.mousePressed(function () {
      trainingData = [];
      show();
    });
  }
  counters = new CounterSet();
  counters.addTo(body);

  testPoints = new TestPointCollection();
}

function draw() {
  background(color("Orchid"));
}