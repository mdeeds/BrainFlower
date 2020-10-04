const kLayerSpacing = 250;
const kRoot2 = Math.sqrt(2);

class Wire {
  /**
   * 
   * @param {number} destinationX 
   * @param {number} destinationY 
   */
  constructor(destinationX, destinationY, color1, color2) {
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
    this.dragging = false;
    this.paths[1].addEventListener("mousedown",
      this.handleMouseDown.bind(this));
    this.setDestination(destinationX, destinationY);
  }

  addDragHandlers(elemnt) {
    Element.addEventListener()
  }

  addTo(parent) {
    for (let p of this.paths) {
      parent.appendChild(p);
    }
  }

  setDestination(x, y) {
    for (let p of this.paths) {
      p.setAttribute("d", "M " + this.x0 + " " + this.y0
        + " C " + this.x0 + " " + (this.y0 + 100)
        + " " + x + " " + (y + 100)
        + " " + x + " " + y);
    }
  }

  handleDrag() {
    if (this.dragging) {
      this.setDestination(ctx.mouseX, ctx.mouseY);
      setTimeout(this.handleDrag.bind(this), 5);
    }
  }

  handleMouseDown(e) {
    this.dragging = true;
    setTimeout(this.handleDrag.bind(this));
  }
}

class Oscope {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.body = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.body.setAttribute("transform", "translate(" + this.x + " " + this.y + ")");
    
    let img = document.createElementNS("http://www.w3.org/2000/svg", "image");
    img.setAttribute("href", "img/oscope.png");
    this.body.appendChild(img);

    this.xWire = new Wire(this.x + 50, this.y + 410, "Yellow", "Chocolate");
    this.aWire = new Wire(this.x + 140, this.y + 410, "RoyalBlue", "MidnightBlue");
    this.bWire = new Wire(this.x + 230, this.y + 410, "Orchid", "Indigo");
  }

  addTo(parent) {
    parent.appendChild(this.body);
    this.xWire.addTo(parent);
    this.aWire.addTo(parent);
    this.bWire.addTo(parent);
  }

}

class SvgContext {
  constructor(svg) {
    this.svg = svg;
    this.clear();
    this.wire = new Wire(0, 0);
    this.oscope = new Oscope(500, 0);
    this.mouseX = 0;
    this.mouseY = 0;
    svg.addEventListener("mouseover",
      function (e) {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
      }.bind(this));
  }

  clear() {
    this.stroke = "black";
    this.fill = "white";
    this.svg.innerHTML = "";
    this.weightBox = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.weightBox.setAttribute("x", 0);
    this.weightBox.setAttribute("y", 50);
    this.weightBox.innerHTML = "";
    this.svg.appendChild(this.weightBox);
    let bg = document.createElementNS(
      "http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", 0);
    bg.setAttribute("y", 0);
    bg.setAttribute("width", 800);
    bg.setAttribute("height", 500);
    bg.setAttribute("fill", "Honeydew")
    this.svg.appendChild(bg);
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

  addCircle(parent, x, y, weight) {
    this.setFillForWeight(weight);
    let c = this.circle(parent, x, y, 5);
    c.setAttribute("weight", weight);
    c.addEventListener("mouseover", function () {
      this.weightBox.innerHTML = weight.toFixed(3);
    }.bind(this, weight));
  }

  addTestPoint(parent, x, y) {
    let d = this.diamond(parent, x, y);
    d.addEventListener("mouseover", function () {
      this.wire.setDestination(x + 5, y);
    }.bind(this));
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
      let r0 = shape[0] - d0 - 1;
      this.addCircle(parent,
        offsetX + 30, offsetY + r0 * 15, data[i]);
      ++i;
    }
    return 60;
  }

  renderWeights2(parent, weights, offsetX, offsetY) {
    let shape = weights.shape;
    let data = weights.val.dataSync();
    console.log(shape);

    this.stroke = "#000";
    this.fill = "#fff";
    // Inputs
    for (let i = 0; i < shape[0]; ++i) {
      this.addTestPoint(parent, offsetX + i * 15 + 30,
        offsetY + shape[1] * 15 + 15);
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
      // this.path(parent,)
    }

    // Weights;
    let i = 0;
    for (let d0 = 0; d0 < shape[0]; ++d0) {
      for (let d1 = 0; d1 < shape[1]; ++d1) {
        let r1 = shape[1] - d1 - 1;
        this.addCircle(parent,
          offsetX + d0 * 15 + 30,
          offsetY + r1 * 15, data[i]);
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
    let g;
    let offsetX = 0;
    let offsetY = 220;
    g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.appendChild(g);
    this.wire.addTo(g);
    this.oscope.addTo(g);

    for (let l of model.layers) {
      console.log("Layer: " + l.name);
      for (let w of l.weights) {
        let width = this.renderWeights(g, w, offsetX, offsetY);
        offsetX += width;
      }
      offsetX += 50;
    }
  }
}

var botUnderTest;
var ctx;
var repeatBox;
var match;

function show() {
  let model = botUnderTest.getModel();
  ctx.renderModel(model);
}

function collect() {
  show();
  let referenceBot = match.getEntry(0);
  botUnderTest.setReference(referenceBot);
  console.log("Training source: " + referenceBot.constructor.name);
  for (let i = 0; i < repeatBox.value(); ++i) {
    setupGame(botUnderTest, match.getEntry(1));
    for (let i = 0; i < kFramesPerRound; ++i) {
      // TODO: Get the data from the frame and store it
      runFrame();
    }
    // TODO: determine win, and store appropriately
  }
}

function train() {
  show();
  // TODO: Use the values that we stored in colect,
  // Don't get them from botUnderTest.
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

function resetBrain() {
  botUnderTest.reset();
}

function setup() {
  let body = document.getElementById("body");
  let l;
  let r;
  [l, r] = buildEntryMap();

  let svg = document.createElementNS(
    "http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", 800);
  svg.setAttribute("height", 500);
  svg.setAttribute("viewbox", "0 0 100 100")
  body.appendChild(svg);

  ctx = new SvgContext(svg);

  botUnderTest = new LearnBot(match.getEntry(0), true, true);

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
  repeatBox.size(60, 30);
  repeatBox.option("1x", 1);
  repeatBox.option("10x", 10);
  repeatBox.option("100x", 100);
  {
    let button = createButton("Reset");
    button.size(60, 30);
    button.mousePressed(resetBrain);
  }
}

function draw() {
  background(color("Orchid"));
}