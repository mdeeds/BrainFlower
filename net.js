const kLayerSpacing = 250;
const kRoot2 = Math.sqrt(2);

class SvgContext {
  constructor(svg) {
    this.svg = svg;
    this.clear();
  }

  clear() {
    this.stroke = "black";
    this.fill = "white";
    this.svg.innerHTML = "";
    this.weightBox = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.weightBox.setAttribute("x", 0);
    this.weightBox.setAttribute("y", 50);
    this.weightBox.innerHTML = "w";
    this.svg.appendChild(this.weightBox);
  }

  line(parent, x1, y1, x2, y2) {
    let l = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line");
    l.setAttribute('x1', x1);
    l.setAttribute('y1', y1);
    l.setAttribute('x2', x2);
    l.setAttribute('y2', y2);
    l.setAttribute('stroke', this.stroke);
    parent.appendChild(l);
    return l;
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

  addCircle(parent, x, y, weight) {
    this.setFillForWeight(weight);
    let c = this.circle(parent, x, y, 5);
    c.setAttribute("weight", weight);
    c.addEventListener("mouseover", function () {
      this.weightBox.innerHTML = weight.toFixed(3);
    }.bind(this, weight));
  }

  renderWeights1(parent, weights, offsetX) {
    let shape = weights.shape;
    let data = weights.val.dataSync();

    this.stroke = "#000";
    this.line(parent, offsetX + 30, 0,
      offsetX + 30, shape[0] * 15 + 15);

    let i = 0;
    for (let d0 = 0; d0 < shape[0]; ++d0) {
      let r0 = shape[0] - d0 - 1;
      this.addCircle(parent, offsetX + 30, r0 * 15 + 30, data[i]);
      ++i;
    }
    return 60;
  }

  renderWeights2(parent, weights, offsetX, offsetY) {
    let shape = weights.shape;
    let data = weights.val.dataSync();
    console.log(shape);

    this.stroke = "#000";
    for (let i = 0; i < shape[0]; ++i) {
      this.line(parent, 
        offsetX + i * 15 + 30, offsetY + 0,
        offsetX + i * 15 + 30, offsetY + shape[1] * 15 + 15);
    }

    for (let i = 0; i < shape[1]; ++i) {
      this.line(parent, 
        offsetX + 30, offsetY + i * 15 + 30,
        offsetX + shape[0] * 15 + 60, offsetY + i * 15 + 30);
    }

    let i = 0;
    for (let d0 = 0; d0 < shape[0]; ++d0) {
      for (let d1 = 0; d1 < shape[1]; ++d1) {
        let r1 = shape[1] - d1 - 1;
        this.addCircle(parent, 
          offsetX + d0 * 15 + 30, 
          offsetY + r1 * 15 + 30, data[i]);
        ++i;
      }
    }
    return shape[0] * 15 + 5;
  }

  renderWeights(parent, weights, offsetX, offsetY) {
    if (weights.shape.length == 1) {
      return this.renderWeights1(parent, weights, offsetX, offsetY);
    } else if (weights.shape.length == 2) {
      return this.renderWeights2(parent, weights, offsetX, offsetY);
    }
  }

  renderModel(model) {
    this.clear();
    let x = 0;
    let lastName = "";
    let g;
    let offsetX = 0;
    let offsetY = 0;
    let totalWidth = 0;
    g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform",
      "translate(" + x + " 200)" + "rotate(-45 0 0) ");
    this.svg.appendChild(g);
    for (let l of model.layers) {
      console.log("Layer: " + l.name);
      offsetY += totalWidth;
      for (let w of l.weights) {
        let width = this.renderWeights(g, w, offsetX, offsetY);
        offsetX += width;
        totalWidth += width;
      }
    }
  }
}

var botUnderTest;
var ctx;
var repeatBox;
var referenceSelector;
var opponentSelector;

function show() {
  let model = botUnderTest.getModel();
  ctx.renderModel(model);
}

function collect() {
  show();
  botUnderTest.setReference(referenceSelector.value);
  for (let i = 0; i < repeatBox.value(); ++i) {
    setupGame(botUnderTest, opponentSelector.value);
    for (let i = 0; i < kFramesPerRound; ++i) {
      runFrame();
    }
  }
}

function train() {
  show();
  let ioExamples = botUnderTest.getExamples();
  let input = ioExamples[0];
  let output = ioExamples[1];
  let model = botUnderTest.getModel();
  console.log("Staring train: " + input.shape);
  model.fit(input, output, { epochs: repeatBox.value() }).then(() => {
    console.log("Done training: " + input.shape);
    botUnderTest.brain.dirty = true;
    show();
  });
}

function setup() {
  let body = document.getElementById("body");

  let svg = document.createElementNS(
    "http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", 800);
  svg.setAttribute("height", 400);
  svg.setAttribute("viewbox", "0 0 100 100")
  body.appendChild(svg);

  ctx = new SvgContext(svg);

  botUnderTest = new LearnBot(new MattBot(), true, true);

  let modelNameBox = document.createElement("div");
  modelNameBox.innerText = botUnderTest.brain.name;
  body.appendChild(modelNameBox);

  tf.io.listModels().then(models => {
    for (let m of Object.keys(models)) {
      console.log(m);
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
  repeatBox.size(60,30);
  repeatBox.option("1x", 1);
  repeatBox.option("10x", 10);
  repeatBox.option("100x", 100);

  [referenceSelector, opponentSelector] = buildEntryMap();

  let learnFromDiv = document.createElement("div");
  learnFromDiv.innerText = "Learn from: ";
  learnFromDiv.appendChild(referenceSelector.elt);
  body.appendChild(learnFromDiv);
  let opponentDiv = document.createElement("div");
  opponentDiv.innerText = "Opponent: ";
  opponentDiv.appendChild(opponentSelector.elt);
  body.appendChild(opponentDiv);
}

function draw() {
  background(color("Orchid"));
}