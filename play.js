var robotDisplays = [];
var robotContainers = [];

var kArenaSize = 800;
var kFramesPerRound = 1800;

var leftEntryChoice;
var rightEntrychoice;

class RobotScore {
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.score = 0;
  }
  draw() {
    textSize(24);
    fill(color("black"));
    noStroke();
    text(this.score.toFixed(0), this.x, this.y);
  }
}

function distance2(x1, y1, x2, y2) {
  return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
}

let entryMap = new Map();

class Match {
  constructor(leftEntryChoice, rightEntryChoice) {
    this.leftEntryChoice = leftEntryChoice;
    this.rightEntryChoice = rightEntryChoice;
    this.populateChoice(this.leftEntryChoice);
    this.populateChoice(this.rightEntryChoice);
    this.setToOtherValue(rightEntryChoice, leftEntryChoice);
    this.leftEntryChoice.changed(this.handleChange.bind(this));
    this.rightEntryChoice.changed(this.handleChange.bind(this));
  }

  /**
   * 
   * @param {Element} choice 
   */
  populateChoice(choice) {
    for (let label of entryMap.keys()) {
      choice.option(label);
    }
  }

  setToOtherValue(choiceToChange, choiceToKeep) {
    for (let label of entryMap.keys()) {
      if (label != choiceToKeep.value()) {
        choiceToChange.elt.value = label;
        break;
      }
    }
  }

  /**
   * 
   * @param {Event} e 
   */
  handleChange(e) {
    console.log("Change");
    if (this.leftEntryChoice.value() == this.rightEntryChoice.value()) {
      console.log("Same");
      if (leftEntryChoice.elt == e.target) {
        this.setToOtherValue(rightEntryChoice, leftEntryChoice);
      } else {
        this.setToOtherValue(leftEntryChoice, rightEntryChoice);
      }
    }
  }
}

function setup() {
  entryMap.set("KeyBot", new KeyBot());
  entryMap.set("CircleBot", new CircleBot());

  leftEntryChoice = createSelect();
  leftEntryChoice.position(10, 10);
  leftEntryChoice.size(380, 25);

  rightEntryChoice = createSelect();
  rightEntryChoice.position(410, 10);
  rightEntryChoice.size(380, 25);

  let match = new Match(leftEntryChoice, rightEntryChoice);

  createCanvas(kArenaSize, kArenaSize);
  
  setupGame();
}

var angle = 0;

function generateSenses()  {
  return new SensorState();
}

function playFrame() {
  runFrame(robotContainers, flowers);
  background(220);
  for (r of robotStats.values()) {
    r.draw();
  }
  let x = 50;
  for (r of robotDisplays) {
    r.draw();
  }
  for (f of flowers) {
    f.draw();
  }

  let framesRemaining = kFramesPerRound - frameNumber;
  let secondsRemaining = framesRemaining / 60.0;
  if (secondsRemaining <= 3) {
    textSize(600);
    textAlign(CENTER);
    strokeWeight(5);
    fill(color("red"));
    stroke(color("black"));
    if (framesRemaining === 0) {
      textSize(200);
      text("STOP", kArenaSize/2, 450);
    } else {
      text(secondsRemaining.toFixed(0), kArenaSize/2, 600);
    }
  }
}

var frameNumber = 0;
function draw() {
  ++frameNumber;
  if (frameNumber <= kFramesPerRound) {
    playFrame();
  }
}
