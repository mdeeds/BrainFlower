var robotDisplays = [];

var kArenaSize = 800;
var kFramesPerRound = 1800;

var flowers = new Set();

var robotStats = new Map();

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

function addRandomFlower() {
  if (flowers.size >= 100) {
    return;
  }
  let found = false;
  let x;
  let y;
  while (true) {
    x = Math.random() * kArenaSize;
    y = Math.random() * kArenaSize;
    let overlapping = false;
    for (rd of robotDisplays) {
      let rc = rd.robotContainer;
      if (distance2(rc.x, rc.y, x, y) < 10000) {
        overlapping = true;
        break;
      }
    }
    if (!overlapping) {
      break;
    }
  }
  let flower = new Flower(x, y);
  flowers.add(flower);
}

function startRobot(robot, x, y, t) {
  let robotContainer = new RobotContainer(robot, x, y, t);
  let robotDisplay = new RobotDisplay(robotContainer);
  robotDisplays.push(robotDisplay);
  robotStats.set(robotDisplay, new RobotScore(x, 50));
}

function setup() {
  createCanvas(kArenaSize, kArenaSize);
  
  startRobot(new KeyBot(), 100, 100, Math.PI / 4);
  startRobot(new CircleBot(), kArenaSize - 100, kArenaSize - 100, -3 * Math.PI / 4);

  for (let i = 0; i < 15; ++i) {
    addRandomFlower();
  }
}

var angle = 0;

function generateSenses()  {
  return new SensorState();
}

function checkFlower(f) {
  let overlappingRobot = null;
  let bestDistance2 = 2500;
  for (rd of robotDisplays) {
    let d2 = distance2(f.x, f.y, rd.robotContainer.x, rd.robotContainer.y); 
    if (d2 < 2500) {
      overlappingRobot = rd;
      bestDistance2 = d2;
    }
  }
  if (overlappingRobot) {
    // TODO: points!
    let stats = robotStats.get(overlappingRobot);
    ++stats.score;
    flowers.delete(f);
    if (Math.random() < 0.5) {
      addRandomFlower();
    }
    return false;
  }
  return true;
}

/**
 * Runs the robots and physics simulation without any draw operations.
 */
function runFrame() {
  if (Math.random() < 0.005) {
    addRandomFlower();
  }
  for (r of robotDisplays) {
    let rc = r.robotContainer;
    let s = generateSenses(rc);
    rc.robot.run(s);
    let forward = Math.max(0, Math.min(1, s.speed - Math.abs(s.turn)));
    let turn = Math.max(-1, Math.min(1.0, s.turn));
    rc.t += turn / 10.0;
    rc.forward(forward * 5);
  }
  for (r1 of robotDisplays) {
    for (r2 of robotDisplays) {
      if (r1 != r2) {
        r1.robotContainer.collide(r2.robotContainer);
      }
    }
  }
  for (r of robotDisplays) {
    r.robotContainer.update();
  }
  for (f of flowers) {
    checkFlower(f);
  }
}

function playFrame() {
  runFrame();
  background(220);
  for (r of robotStats.values()) {
    r.draw();
  }
  noStroke();
  fill(color("black"));
  textSize(6);
  text("Flowers: " + flowers.size, 30, 700);
  text("Frame: " + frameNumber + 
    " Time: " + (frameNumber / 60).toFixed(2), 20, 720);
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
