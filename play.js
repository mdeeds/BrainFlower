var leftEntryChoice;
var rightEntryChoice;

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
   * @param {number} i
   * @returns {RobotContainer} 
   */
  getEntry(i) {
    if (i == 0) {
      return entryMap.get(this.leftEntryChoice.value());
    } else {
      return entryMap.get(this.rightEntryChoice.value());
    }
  }

  remove() {
    leftEntryChoice.remove();
    rightEntryChoice.remove();
  }

  /**
   * 
   * @param {Element} choice 
   */
  populateChoice(choice) {
    for (let label of entryMap.keys()) {
      choice.option(label);
    }
    choice.tabindex = "-1";
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

var started = false;
var startButton;
var match;
var robotDisplays = [];

function startGame() {
  started = true;
  startButton.remove();
  let left = match.getEntry(0);
  let right = match.getEntry(1);
  match.remove();
  robotContainers = setupGame(left, right);
  for (let rc of robotContainers) {
    robotDisplays.push(new RobotDisplay(rc));
  }
}

function setup() {
  entryMap.set("KeyBot", new KeyBot());
  entryMap.set("CircleBot", new CircleBot());
  entryMap.set("MattBot2", new MattBot2());
  entryMap.set("RudeBot", new RudeBot());
  entryMap.set("CloseBot", new CloseBot());

  leftEntryChoice = createSelect();
  leftEntryChoice.position(10, 10);
  leftEntryChoice.size(380, 25);

  rightEntryChoice = createSelect();
  rightEntryChoice.position(410, 10);
  rightEntryChoice.size(380, 25);

  match = new Match(leftEntryChoice, rightEntryChoice);

  createCanvas(kArenaSize, kArenaSize);

  startButton = createButton("Start");
  startButton.size(60, 40);
  startButton.position(kArenaSize / 2 - 25, 200);
  startButton.mousePressed(startGame);
}

var angle = 0;

function playFrame() {
  runFrame();
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

function splashFrame() {
  background(color("LightSlateGray"));
  textSize(40);
  textAlign(CENTER);
  noStroke();
  fill(color("Teal"));
  text("choose your robots", kArenaSize / 2, 100);
}

var frameNumber = 0;
function draw() {
  if (!started) {
    splashFrame();
  } else {
    ++frameNumber;
    if (frameNumber <= kFramesPerRound) {
      playFrame();
    }
  }
}
